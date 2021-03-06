var Terrain = (function(){

    var camera, scene, renderer, controls;
    var terrain_mesh;
    var terrain_detail = 7, terrain_roughness = 1;

    function Terrain(detail) {
        this.size = Math.pow(2, detail) + 1;
        this.max = this.size - 1;
        this.map = new Float32Array(this.size * this.size);
    }

    Terrain.prototype.get = function (x, y) {
        if (x < 0 || x > this.max || y < 0 || y > this.max) return -1;
        return this.map[x + this.size * y];
    };

    Terrain.prototype.set = function (x, y, val) {
        this.map[x + this.size * y] = val;
    };

    Terrain.prototype.generate = function (roughness) {
        var self = this;

        this.set(0, 0, self.max);
        this.set(this.max, 0, self.max / 2);
        this.set(this.max, this.max, 0);
        this.set(0, this.max, self.max / 2);

        divide(this.max);

        function divide(size) {
            var x, y, half = size / 2;
            var scale = roughness * size;
            if (half < 1) return;

            for (y = half; y < self.max; y += size) {
                for (x = half; x < self.max; x += size) {
                    square(x, y, half, Math.random() * scale * 2 - scale);
                }
            }
            for (y = 0; y <= self.max; y += half) {
                for (x = (y + half) % size; x <= self.max; x += size) {
                    diamond(x, y, half, Math.random() * scale * 2 - scale);
                }
            }
            divide(size / 2);
        }

        function average(values) {
            var valid = values.filter(function (val) {
                return val !== -1;
            });
            var total = valid.reduce(function (sum, val) {
                return sum + val;
            }, 0);
            return total / valid.length;
        }

        function square(x, y, size, offset) {
            var ave = average([
                self.get(x - size, y - size), // upper left
                self.get(x + size, y - size), // upper right
                self.get(x + size, y + size), // lower right
                self.get(x - size, y + size) // lower left
            ]);
            self.set(x, y, ave + offset);
        }

        function diamond(x, y, size, offset) {
            var ave = average([
                self.get(x, y - size), // top
                self.get(x + size, y), // right
                self.get(x, y + size), // bottom
                self.get(x - size, y) // left
            ]);
            self.set(x, y, ave + offset);
        }
    };

    Terrain.prototype.addMesh = function () {
        var self = this;

        var terrain_geometry = new THREE.PlaneGeometry(512, 512, this.size - 1, this.size - 1);
        var min_height = Infinity;
        var max_height = -Infinity;
        for (var y = 0; y < this.size; y++) {
            for (var x = 0; x < this.size; x++) {
                var height_val = this.get(x, y);
                if ( height_val < min_height ) min_height = height_val;
                if ( height_val > max_height ) max_height = height_val;
                if ( height_val < 0 ) height_val = 0;
                if (y === 0 || y === this.size - 1 || x === 0 || x === this.size - 1) height_val = 0.0;
                terrain_geometry.vertices[y * this.size + x].z = height_val;
            }
        }

        terrain_geometry.computeFaceNormals();
        terrain_geometry.computeVertexNormals();

        scene.remove(terrain_mesh);

        var terrain_material = new THREE.MeshPhongMaterial({
            map: THREE.ImageUtils.loadTexture('images/sea-texture.png'),
            side: THREE.DoubleSide
        });

        /*var terrain_material = new THREE.MeshPhongMaterial({
            // light
            specular: '#5959AB',
            // intermediate
            color: '#23238E',
            // dark
            emissive: '#000033',
            shininess: 100,
            side: THREE.DoubleSide
          });

        // directional lighting
          var directionalLight = new THREE.DirectionalLight(0xffffff);
          directionalLight.position.set(-1, -1, -1).normalize();
          scene.add(directionalLight);
          */

        terrain_mesh = new THREE.Mesh(terrain_geometry, terrain_material);
        terrain_mesh.rotation.x = -Math.PI / 4.0;
        terrain_mesh.rotation.y = -Math.PI / 4.0;    
        terrain_mesh.rotation.z = -Math.PI / 3.0;

        scene.add(terrain_mesh);
    }

    function init() {
        if (!Detector.webgl) return false;

        renderer = new THREE.WebGLRenderer({
            antialias: true
        });

        renderer.setClearColor(0xffffff, 1.0);
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
        camera.position.y = 100;
        camera.position.z = 400;

        var ambient_light = new THREE.AmbientLight(0xffffff);
        scene.add(ambient_light);

        window.addEventListener('resize', onWindowResize, false);

        controls = new THREE.TrackballControls(camera, renderer.domElement);
        controls.rotateSpeed = 0.1;
        controls.noZoom = false;
        controls.noPan = true;
        controls.staticMoving = false;
        controls.dynamicDampingFactor = 0.4;
        controls.minDistance = 300;
        controls.maxDistance = 600;

        return true;
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        terrain_detail = parseInt(terrain_detail);
        renderer.render(scene, camera);
    }

    function generate() {
        var terrain = new Terrain(parseInt(terrain_detail));
        terrain.generate(terrain_roughness);
        terrain.addMesh();
    };

    return {
        load: function(){
            if(!init()) return false;
            generate();
            animate();
            return true;

        }
    };

})();

