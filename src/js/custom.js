
$(document).ready(function(){
  
  var scripts = ["js/Three.min.js", "js/stuff.min.js"];

  var load_backup = function(){
    $('#centre').remove();
    $('#linky').remove();

    if (window.innerHeight > window.innerWidth){
        $('body').append('<a id="linky" href="https://soundcloud.com/ourmother"><img id="sun" src="images/background.jpg"></a>');
        var $sunny_boy = $('#sun');
        var width = $sunny_boy.width();
        $('#sun').css({
          height: width,
          marginTop: width / -2,
          marginBottom: width / -2
        });    
    }
    else {
      $('body').append('<div id="centre"><a id="linky" href="https://soundcloud.com/ourmother"><img id="sun" src="images/background.jpg"></a></div>');
      var $sunny_boy = $('#sun');
      $sunny_boy.css({
        position: 'static'
      });
      $('#centre').css({
        width: window.innerHeight,
        height: window.height,
        margin: '0 auto'
      })
    }
  };

  if (Modernizr.canvas){

    if (window.innerWidth > 768){
        // Use yep nope to load the huge script files.
        yepnope({
          load: scripts,
          complete: function(){
            init();
            animate();
          }
        });
    }
    else {
      load_backup();
    }
  }
  else {
    load_backup();
  }

  // Window event listeners
  window.addEventListener("orientationchange", function() {
    load_backup();
  }, false);

  window.addEventListener('resize', function(){
    load_backup()
  }, false);

  // Setup the hidden soundcloud widget.
  /*
  sc_widget = SC.Widget($('#widget').get(0));

  sc_widget.bind(SC.Widget.Events.READY, function(){
    sc_widget.play();
    $('#play').on('click', function(){
      console.log('hi');
      sc_widget.play();
      sc_widget.setVolume(100);
      return false;
    });

    $('#pause').on('click', function(){
      sc_widget.pause();
      return false;
    });
  });

  sc_widget.bind(SC.Widget.Events.PLAY, function(){
    console.log('playing')
  })
  
  */

});

