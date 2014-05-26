$(document).ready(function(){

  var on;

  $('#lion-link').hover(function(){

    var back = false
    on = setInterval(function(){
      if (!back){
        setBackground('sea-texture.png');
        back = true;
      }
      else {
        $('html').css({
          background: 'none'
        });
        back = false
      }    
    }, 70);

  }, function(){
    clearInterval(on);
    clearBackground();
  });


  $('#fire-link').hover(function(){

    var back = false
    on = setInterval(function(){
      if (!back){
        setBackground('fire-texture.jpg');
        back = true;
      }
      else {
        $('html').css({
          background: 'none'
        });
        back = false
      }    
    }, 70);

  }, function(){
    clearInterval(on);
    clearBackground();
  });




  var setBackground = function(background){
    $('html').css({
      'background': 'url(../images/' + background + ') no-repeat center center fixed', 
      '-webkit-background-size': 'cover',
      '-moz-background-size': 'cover',
      '-o-background-size': 'cover',
      'background-size': 'cover'
    });
  };

  var clearBackground = function(){
    $('html').css({
          background: 'none'
    });
  };

});