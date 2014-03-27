/*
  Three.js "tutorials by example"
  Author: Lee Stemkoski
  Date: July 2013 (three.js v59dev)
*/

// MAIN

// standard global variables
var container, scene, camera, renderer, controls, stats;
var keyboard = new THREEx.KeyboardState();
var clock = new THREE.Clock();
// custom global variables
var cube;

init();
animate();

// FUNCTIONS
function init()
{
  // SCENE
  scene = new THREE.Scene();
  // CAMERA
  var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
  var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
  camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
  scene.add(camera);
  camera.position.set(0,100,400);
  camera.lookAt(scene.position);
  // RENDERER
  if ( Detector.webgl )
    renderer = new THREE.WebGLRenderer( {antialias:true} );
  else
    renderer = new THREE.CanvasRenderer();
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
  container = document.getElementById( 'ThreeJS' );
  container.appendChild( renderer.domElement );
  // EVENTS
  THREEx.WindowResize(renderer, camera);
  THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });
  // CONTROLS
  controls = new THREE.OrbitControls( camera, renderer.domElement );
  // STATS
  /*stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.bottom = '0px';
  stats.domElement.style.zIndex = 100;
  container.appendChild( stats.domElement );*/
  // LIGHT
  var light = new THREE.PointLight(0xffffff);
  light.position.set(0,250,0);
  scene.add(light);
  // FLOOR

  var floorTexture = new THREE.ImageUtils.loadTexture( 'images/sea4.png' );
  floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set( 1, 1 );
  var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
  var floorGeometry = new THREE.PlaneGeometry(300, 300, 10, 10);
  var floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.position.y = -0.5;
  floor.rotation.x = Math.PI / 2.41;
  floor.position.set(0, -100, 10);
  scene.add(floor);
  // SKYBOX/FOG
  /*scene.fog = new THREE.FogExp2( 0x9999ff, 0.00025 );*/

  ////////////
  // CUSTOM //
  ////////////

  // base image texture for mesh
  var lavaTexture = new THREE.ImageUtils.loadTexture( 'images/gold3.jpg');
  lavaTexture.wrapS = lavaTexture.wrapT = THREE.RepeatWrapping;
  // multiplier for distortion speed
  var baseSpeed = 0.02;
  // number of times to repeat texture in each direction
  var repeatS = repeatT = 4.0;

  // texture used to generate "randomness", distort all other textures
  var noiseTexture = new THREE.ImageUtils.loadTexture( 'images/cloud.png' );
  noiseTexture.wrapS = noiseTexture.wrapT = THREE.RepeatWrapping;
  // magnitude of noise effect
  var noiseScale = 0.5;

  // texture to additively blend with base image texture
  var blendTexture = new THREE.ImageUtils.loadTexture( 'images/gold3.jpg' );
  blendTexture.wrapS = blendTexture.wrapT = THREE.RepeatWrapping;
  // multiplier for distortion speed
  var blendSpeed = 0.01;
  // adjust lightness/darkness of blended texture
  var blendOffset = 0.25;

  // texture to determine normal displacement
  var bumpTexture = noiseTexture;
  bumpTexture.wrapS = bumpTexture.wrapT = THREE.RepeatWrapping;
  // multiplier for distortion speed
  var bumpSpeed   = 0.15;
  // magnitude of normal displacement
  var bumpScale   = 40.0;

  // use "this." to create global object
  this.customUniforms = {
    baseTexture:  { type: "t", value: lavaTexture },
    baseSpeed:    { type: "f", value: baseSpeed },
    repeatS:    { type: "f", value: repeatS },
    repeatT:    { type: "f", value: repeatT },
    noiseTexture: { type: "t", value: noiseTexture },
    noiseScale:   { type: "f", value: noiseScale },
    blendTexture: { type: "t", value: blendTexture },
    blendSpeed:   { type: "f", value: blendSpeed },
    blendOffset:  { type: "f", value: blendOffset },
    bumpTexture:  { type: "t", value: bumpTexture },
    bumpSpeed:    { type: "f", value: bumpSpeed },
    bumpScale:    { type: "f", value: bumpScale },
    alpha:      { type: "f", value: 1.0 },
    time:       { type: "f", value: 1.0 }
  };

  // create custom material from the shader code above
  //   that is within specially labeled script tags
  var customMaterial = new THREE.ShaderMaterial(
  {
      uniforms: customUniforms,
    vertexShader:   document.getElementById( 'vertexShader'   ).textContent,
    fragmentShader: document.getElementById( 'fragmentShader' ).textContent
  }   );


  var ballGeometry = new THREE.SphereGeometry( 50, 50, 50 );
  var ball = new THREE.Mesh(  ballGeometry, customMaterial );
  ball.position.set(0, 40, 0);
  scene.add( ball );
}

function animate()
{
    requestAnimationFrame( animate );
  render();
  update();
}

function update()
{
  if ( keyboard.pressed("z") )
  {
    // do something
  }
  var delta = clock.getDelta();
  customUniforms.time.value += delta;
  controls.update();
}

function render()
{
  renderer.render( scene, camera );
}
