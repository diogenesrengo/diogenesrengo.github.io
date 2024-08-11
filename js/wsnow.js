/*
 * Let it snow
 * Copyright 2020 Willem Vermin
 * MIT licensed
 */

/*
 * HOWTO
 *
 * Example html:
 *
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>WSNOW - Let is snow in your browser</title>
    <meta name="description" content="">
    <link rel="stylesheet" href="css/wsnow.css">
    <style>
	 body, html {
	     height: 100%;
	     width: 100%;
	     overflow: hidden;
	 }
    </style>
    <!-- here styling of your background image -->
</head>
<body>
    <script src=
    "https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>

    <script src="js/wsnow.js"></script> 
    <script>

   // here you can set your favorite settings:
	var wsnow_parms = {
	   // Santa_dt      : 0.1,           // update interval for santa, seconds
	   // Santa_speed   : 100,           // speed of Santa, pixels/second

	   // Santa_type    : 1,             // Santa: 8 reindeers
	   // Santa_type    : 2,             // Santa: 8 reindeers plus Rudolf
	   // Santa_type    : 3,             // Santa: train
	   // Santa_type    : 4,             // Santa: train with Rudolf
	   // Santa_type    : 5,             // Santa: vintage: 3 reindeers
	   // Santa_type    : 6,             // Santa: vintage: 3 reindeers, first is Rudolf
	   // Santa_type    : 7,             // Santa: medium: 3 reindeers
	   // Santa_type    : 8,             // Santa: medium: 3 reindeers, first is Rudolf
	   // Santa_type    : 9,             // Santa: tiny: 3 reindeers
	   // Santa_type    : 10,            // Santa: tiny: 3 reindeers, first is Rudolf

	   // do_meteorite  : true,          // whether to show meteorites
	   // flake_speed   : 50,            // mean vertical speed of flakes
	   // flakedt       : 0.2,           // update interval of flakes, seconds
	   // fppps         : 0.003,         // create so many flakes/pixel/second
	   // maxtrees      : 12,            // max number of trees
	   // meteorite_dt  : 8,             // max time between two meteorites
	   // nstars        : 20,            // number of stars
	   // show_menu     : false,         // to show or not to show a menu
     show_menu     : true,         // to show or not to show a menu
	   // topcolor      : 'darkred',     // color of top of your screen
	   // botcolor      : 'black',       // color of the bottom of your screen
	   // vintage       : false,         // true: get the original xsnow feeling
	   // where         : 'body',        // where to snow
	   // windtimer     : 1,             // update interval for wind, seconds
	   // windspeed     : 50,            // speed of wind
	};

	wsnow();

    </script>

</body>
</html>
 *
 * If you have a nice background-image, you can use that as in:
*
    <style>
	body {
	  background-image: url('/usr/share/backgrounds/Origin_of_nature_by_Julian_Tomasini.jpg');
	  background-repeat: no-repeat;
	  background-attachment: fixed;
	  background-size: 100% 100%;
	}
    </style>
    *
    * Put that after the line:
    <!-- here styling of your background image -->
    */ 
"use strict";

var wsnow_version = "0.92";

function wsnow()
{
   $(document).ready(function() {
      if (wsnow_parms !== undefined)
      {
	 var Botcolor       = wsnow_parms.botcolor      ;     // color of bottom of screen
	 var Do_meteorite   = wsnow_parms.do_meteorite  ;     // whether to show meteorites
	 var Flake_speed    = wsnow_parms.flake_speed   ;     // mean vertical speed of flakes
	 var Flakedt        = wsnow_parms.flakedt       ;     // update interval of flakes, seconds
	 var Forbiddentrees = wsnow_parms.forbiddentrees;     // Trees that will not be shown
	 var Fppps          = wsnow_parms.fppps         ;     // Number of flakes/pixel/second generated
	 var Maxtrees       = wsnow_parms.maxtrees      ;     // Maximum number of "trees"
	 var Meteorite_dt   = wsnow_parms.meteorite_dt  ;     // max time between two meteorites
	 var Nstars         = wsnow_parms.nstars        ;     // Number of stars
	 var Santa_dt       = wsnow_parms.Santa_dt      ;     // update interval for santa, seconds
	 var Santa_speed    = wsnow_parms.Santa_speed   ;     // speed of Santa, pixels/second
	 var Santa_type     = wsnow_parms.Santa_type    ;     // which Santa to show
	 var Show_menu      = wsnow_parms.show_menu     ;     // to show or not show a menu
	 var Topcolor       = wsnow_parms.topcolor      ;     // color of the top of the screen
	 var Vintage        = wsnow_parms.vintage       ;     // true: get the original xsnow feeling
	 var Where          = wsnow_parms.where         ;     // where to snow
	 var Windspeed      = wsnow_parms.windspeed     ;     // speed of wind  ( pixels/second)
	 var Windtimer      = wsnow_parms.windtimer     ;     // update interval for wind, seconds
      }


      var $Container;
      var $Hello;
      var $Vintagebutton;
      var Buttonbackground;
      var Do_meteorite_default = true;            // To show or not to show meteorites
      var Do_meteorite_vintage = false;
      var Dobackground         = true;
      var Flake_speed_default  = 50;
      var Flakecounter         = 0;
      var Fppps_default        = 0.0030;
      var Fppps_vintage        = 0.0015;
      var Itemscount           = 0;
      var Maxtrees_default     = 12;
      var Maxtrees_vintage     = 6;
      var Nsantas;
      var Nsnowtypes;
      var Nstars_default       = 20;
      var Nstars_vintage       = 0;
      var Ntrees               = 0;
      var Position             = 'fixed';       // static relative fixed absolute sticky
      var Resized              = false;
      var Santa_default        = 1;               // Santa: 8 reindeers
      var Santa_speed_default  = 100;
      var Santa_vintage        = 6;               // Santa: Vintage 3 reindeers, first is Rudolf
      var Santasinfo           = [];
      var ShowRudolf;
      var ShowSanta;
      var Snow_timeout;
      var Snowinfo             = {};
      var Starcounter          = 0;
      var Starsinfo            = {};
      var Treeregion           = [];   // { x1, y1, x2, y2 }
      var Treesinfo            = [];
      var Wind                 = 0;
      var Windspeed_default    = 50;

      // Treeregion picture
      //
      //    x1,y1---------------------------
      //      |                            |
      //      |                            |
      //      |                            |
      //      |                            |
      //      |                            |
      //      |                            |
      //      |                            |
      //      ---------------------------x2,y2
      //

      if(Where          === undefined) Where          ='body';


      function defaults()
      {
	 if(Botcolor       === undefined) Botcolor       = 'black';
	 if(Flake_speed    === undefined) Flake_speed    = Flake_speed_default;
	 if(Flakedt        === undefined) Flakedt        = 0.2;
	 if(Forbiddentrees === undefined) Forbiddentrees = {};
	 if(Meteorite_dt   === undefined) Meteorite_dt   = 8;
	 if(Santa_dt       === undefined) Santa_dt       = 0.1;
	 if(Santa_speed    === undefined) Santa_speed    = Santa_speed_default;
	 if(Show_menu      === undefined) Show_menu      = false;
	 if(Topcolor       === undefined) Topcolor       = 'black';
	 if(Vintage        === undefined) Vintage        = false;
	 if(Windspeed      === undefined) Windspeed      = Windspeed_default;
	 if(Windtimer      === undefined) Windtimer      = 1;

	 if(Santa_type   === undefined) 
	 {
	    if (Vintage)
	       Santa_type   = Santa_vintage;  
	    else
	       Santa_type   = Santa_default;
	 }
	 if(Maxtrees     === undefined)
	 {
	    if(Vintage)
	       Maxtrees     = Maxtrees_vintage;
	    else
	       Maxtrees     = Maxtrees_default;
	 }
	 if(Do_meteorite === undefined)
	 {
	    if(Vintage)
	       Do_meteorite = Do_meteorite_vintage;
	    else
	       Do_meteorite = Do_meteorite_default;
	 }
	 if(Nstars       === undefined)
	 {
	    if(Vintage)
	       Nstars       = Nstars_vintage;
	    else
	       Nstars       = Nstars_default;
	 }
	 if(Fppps        === undefined)
	 {
	    if(Vintage)
	       Fppps       = Fppps_vintage;
	    else
	       Fppps       = Fppps_default;
	 }
	 // if user provided background image, we will not try to
	 // overrule that

	 Dobackground = ($('body').css("background-image") == "none");

	 // get the default button background color:
	 //
	 var $x = $("<button>Button</button>");
	 $Container.append($x);
	 Buttonbackground = $x.css("background-color");
	 $x.remove();
      }

      function randint(n)
      {
	 // returns int <n, >=0
	 return Math.floor(Math.random()*n);
      }

      // convert 'url("file:///home/etc/etc")' 
      //  and    'url("http://localhost/etc/etc")'
      //  to ///home/etc/etc
      //  resp
      //  to //localhost/etc/etc
      //
      function urltoimg(url)
      {
	 //var x = url.replace(/.*:/,"");
	 // but: if url is like 'url("http://localhost:8081/etc/etc")' ....
	 var x = url.replace(/^[^:]*:/,"");
	 x = x.replace(/\"\)/,"");
	    return x;
	 }

      // to count items like
      // .wsnow.tree1 { background-image: url("../images/tannenbaum.png");}
      // .wsnow.tree2 { background-image: url("../images/baum.png");}

      function countItems(item)
      {
	 var i = 0;
	 while(1)
	 {
	    i++;
	    var $item = $('<div class="wsnow"></div>');
	    $item.addClass(item+i).hide();
	    $Container.append($item);
	    var b = $item.css("background-image");
	    $item.remove();
	    if (b == "none")
	       return i-1;
	 }
      }

      function gettreesinfo1()
      {
	 Ntrees    = countItems("tree");
	 Treesinfo = [];
	 for (var i=1; i<=Ntrees; i++)  // create strings to be used in <img src=
	 {
	    var $tree = $('<div class="wsnow"></div>');
	    $tree.addClass("tree"+i);
	    $tree.css({left: -100, top: -100, overflow: 'hidden' }).hide();
	    $('body').append($tree);
	    var x = $tree.css("background-image");
	    Treesinfo[i] = {src: urltoimg(x),width:-314,height:-314};
	    $tree.remove();

	    $tree = $('<img id="wsnow_apekool'+i+'" src="'+Treesinfo[i].src+'">').hide();
	    $("body").append($tree);
	    $("#wsnow_apekool"+i).each(function() {
	       $(this).on('load', function(){
		  var k = this.id.replace("wsnow_apekool","");
		  Treesinfo[k].width  = this.width;
		  Treesinfo[k].height = this.height;
		  $(this).remove();
	       });
	    });
	 }
      }

      function gettreesinfo()
      {
	 Ntrees    = countItems("tree");
	 Treesinfo = [];
	 for (var i=1; i<=Ntrees; i++)  // create strings to be used in <img src=
	 {
	    Treesinfo[i] = getiteminfo("wsnow tree"+i);
	 }
      }

      function checkTrees()
      {
	 if (Treesinfo.length <= Ntrees)
	    return false;
	 for (var i=1; i<=Ntrees; i++)
	 {
	    if (!Treesinfo[i].src || !Treesinfo[i].width || !Treesinfo[i].height 
	       || Treesinfo[i].width<0 || Treesinfo[i].height<0 )
	       return false;
	 }
	 return true;
      }


      function getstarsinfo()
      {
	 for (var i=1; i<=Ntrees; i++)  // create strings to be used in <img src=
	 {
	    Starsinfo = getiteminfo("wsnow star");
	 }
      }

      function checkStars()
      {
	 {
	    if (!Starsinfo.src || !Starsinfo.width || !Starsinfo.height 
	       || Starsinfo.width<0 || Starsinfo.height<0 )
	       return false;
	 }
	 return true;
      }

      function getsnowinfo()
      {
	 Nsnowtypes = countItems("snow_type");
	 Snowinfo = [];
	 for (var i=1; i<=Nsnowtypes; i++)  // create strings to be used in <img src=
	 {
	    Snowinfo[i] = getiteminfo("wsnow snow_type"+i);
	 }
      }

      function checkSnow()
      {
	 if (Snowinfo.length <= Nsnowtypes)
	    return false;
	 for (var i=1; i<=Nsnowtypes; i++)
	 {
	    if (!Snowinfo[i].src || !Snowinfo[i].width || !Snowinfo[i].height 
	       || Snowinfo[i].width<0 || Snowinfo[i].height<0 )
	       return false;
	 }
	 return true;
      }

      function getsantainfo()
      {
	 // searching for santa<n>_1..4 and santarudolf<n>_1..4
	 // will build array Santasinfo[] like:
	 // 1: {src: "../images/santa1_1",       width: 78, height: 33, name:"santa1"}
	 // 2: {src: "../images/santarudolf1_1", width: 84, height: 33, name:"santarudolf1"}
	 // So: Santasinfo[i]   is for santa             number i
	 //     Santasinfo[i+1] is for santa-with-rudolf number i
	 // Info for santa  i in [2*i-1]
	 // Info for rudolf i in [2*i]
	 // Nsantas will be number of santas, not counting rudolfs
	 // length of Santasinfo will be 2*Nsantas+1   (because of index 0)

	 var i = 0;
	 Santasinfo[i] = [];
	 Nsantas = 0;
	 while (true)
	 {
	    i++;
	    var s = "santa"+i+"_";
	    var n = countItems(s);
	    if (n != 4)
	       break;
	    s = "wsnow "+s+1;
	    var sinfo = getiteminfo(s);
	    sinfo.name = "santa"+i;

	    // so santa is ok, now check if rudolf is ok
	    s = "santarudolf"+i+"_";
	    n = countItems(s);
	    if (n != 4)
	       break;
	    Nsantas++;
	    Santasinfo[2*i-1]   = sinfo;
	    s = "wsnow "+s+1;
	    var rinfo = getiteminfo(s);
	    rinfo.name = "santarudolf"+i;
	    // looks ok, store results
	    Santasinfo[2*i] = rinfo;
	 }

      }

      function checkSanta()
      {
	 if (Santasinfo.length <= 2*Nsantas)
	    return false;
	 for (var i=1; i<=2*Nsantas; i++)
	 {
	    if (!Santasinfo[i].src || !Santasinfo[i].width || !Santasinfo[i].height 
	       || Santasinfo[i].width<0 || Santasinfo[i].height<0 )
	       return false;
	 }
	 return true;
      }

      function checkAll()
      {
	 return (checkTrees() && checkStars() && checkSnow() && checkSanta());
      }

      function getiteminfo(c)
      {
	 Itemscount ++;
	 var iteminfo = {};
	 var $item = $('<div class="'+c+'"></div>');
	 $item.css({left: 100, top: 100, overflow: 'hidden' }).show();
	 $('body').append($item);
	 var x = $item.css("background-image");
	 iteminfo = {src: urltoimg(x),width:-314,height:-314};
	 $item.remove();

	 $item = $('<img id="wsnow_apekool'+Itemscount+'" src="'+iteminfo.src+'">').hide();
	 $("body").append($item);
	 $("#wsnow_apekool"+Itemscount).each(function() {
	    $(this).on('load', function(){
	       iteminfo.width  = this.width;
	       iteminfo.height = this.height;
	       $(this).remove();
	    });
	 });
	 return iteminfo;
      }

      // wait for wait() to become true, then start run()
      // t (optional) is number of milliseconds to wait before next try
      // default is 5 milliseconds

      function waitfor(wait,run,t)
      {
	 function w()
	 {
	    if (wait())
	       run();
	    else
	       setTimeout(w,t);
	 }
	 if (t === undefined)
	    t = 5;
	 w();
      }
      function waitfor1(wait,t)   // does not work as expected by me
      {
	 function w()
	 {
	    if (wait())
	       return;
	    else
	       setTimeout(w,t);
	 }
	 if (t === undefined)
	    t = 5;
	 w();
      }

      function createSnowFlake() 
      {
	 function stepFlake()
	 {
	    function endsnowflake()
	    {
	       $flake.animate({ opacity: 0 }, 500, 'swing',
		  function(){
		     x = randint($Container.width());
		     $flake.css({ top: top, left: x + 'px', opacity: 1 });
		     $flake.remove();
		     Flakecounter--;
		  });
	    }
	    function movesnowflake()
	    {
	       y = y+speed*Flakedt;

	       if (y > $Container.height())
	       {
		  endsnowflake();
	       }
	       else
	       {

		  xspeed = xspeed + (Wind - xspeed)*wind_sensitivity;
		  if (xspeed > Flake_speed)
		     xspeed = Flake_speed;
		  if (xspeed < -Flake_speed)
		     xspeed = -Flake_speed;

		  x = x+xspeed*Flakedt;
		  var timer = Flakedt*1000;
		  while (x > $Container.width())
		  {
		     timer = 0;
		     x -= $Container.width();
		  }
		  while (x < -8)
		  {
		     timer = 0;
		     x += $Container.width();
		  }

		  $flake.animate(
		     { top: y+'px' , left: x+'px'},
		     timer, 'linear', movesnowflake);
	       }
	    }

	    // $flake.animate({ opacity: 1},randint(500)+200,'swing', movesnowflake);
	    movesnowflake();
	 }
	 Flakecounter++;
	 var $flake = $('<div class="wsnow"></div>');

	 /* initial coordinates of flake */
	 var y    = -randint(100);  
	 var x = randint($Container.width());

	 var speed  = 0.8*Flake_speed+0.4*randint(Flake_speed);
	 var wind_sensitivity = Math.random()*0.5;
	 var xspeed = 0;

	 var m = 1 + randint(Nsnowtypes);
	 $flake.addClass('snow_type' + m)
	    .addClass("wsnow_flake");

	 var w = Snowinfo[m].width;
	 var h = Snowinfo[m].height;

	 $flake.css({ top: y, left: x, opacity: 1, overflow: 'hidden',
	    width: w, height: h});

	 $Container.append($flake);

	 stepFlake();
      }


      function createsnow()
      {
	 var dt = 0.1;
	 var t  = 0;
	 function stepsnow()
	 {
	    Snow_timeout = setTimeout(function()
	       {
		  var w = $Container.width();
		  t += w*Fppps*dt;
		  if (t > 1)
		  {
		     for (var i=0; i<t; i++)
			createSnowFlake();
		     t = 0;
		  }
		  stepsnow();
	       }, 1000*dt);
	 }
	 stepsnow();
      }

      function start_snow()
      {
	 $(".wsnow_flake").remove();
	 createsnow();
      }
      function stop_snow()
      {
	 clearTimeout(Snow_timeout);
      }

      function createSanta()
      {
	 var yspeed = 0;
	 function stepYspeed()
	 {
	    yspeed = randint(51) - 25;
	    setTimeout(stepYspeed,3000);
	 }
	 stepYspeed();

	 var santatype = Santa_type;

	 function stepSanta(n)
	 {
	    y += yspeed * Santa_dt;
	    if (y <= 0)
	       y=0;
	    if (y > 150)
	       y=150;

	    $santa.removeClass(Santasinfo[santatype].name+"_"+n);
	    n++;
	    if (n > 4) n = 1;
	    var s = Santasinfo[Santa_type];
	    $santa.addClass(s.name+"_"+n).css({width: s.width, height: s.height});
	    santatype = Santa_type;               // Santa_type can change, so we remember it here
	    xspeed = Santa_speed + 1.5*Wind;
	    if(xspeed > 2*Santa_speed)
	       xspeed = 2*Santa_speed;
	    if (xspeed < -0.2*Santa_speed)
	       xspeed = -0.2*Santa_speed;
	    x += xspeed * Santa_dt;
	    if (x < -300)
	       x = -300;
	    var timer;
	    if (x > $Container.width())
	    {
	       y = (randint(100)+50);
	       x  = -300;
	       timer = 0;
	    }
	    else
	       timer = Santa_dt * 1000;

	    $santa.animate({
	       left: x+'px',
	       top:  y+'px'
	    },timer,"linear",function(){
	       stepSanta(n);
	    });
	 }
	 var $santa = $('<div class="wsnow"></div>');
	 var y = (randint(100)+50);
	 var x = -300;
	 var xspeed = Santa_speed;

	 $santa.css({ top: y, left: x, opacity: 1, position: Position} ).addClass("wsnow_santa");
	 $Container.append($santa);
	 stepSanta(1);
      }


      function startSanta()
      {
	 $(".wsnow_santa").remove();
	 createSanta();
      }
      function stopSanta()
      {
	 $(".wsnow_santa").stop().remove();
      }


      function createWind()
      {
	 function stepwind()
	 {
	    setTimeout(function()
	       {
		  Wind += 0.5*(Math.random()*Windspeed-0.5*Windspeed);
		  if (Wind > Windspeed)
		     Wind = Windspeed;
		  if (Wind < -Windspeed)
		     Wind = -Windspeed;
		  stepwind();
	       },Windtimer*1000);
	 }
	 stepwind();
      }


      function createResize()
      {
	 function stepResize()
	 {
	    setTimeout(
	       function()
	       {
		  if (Resized)
		  {
		     Resized = false;
		     createStars();
		     createTrees();
		  }
		  stepResize();
	       }, 4000);
	 }
	 stepResize();
      }

      function createStar()
      {
	 var starnum = ++Starcounter;
	 var end_opacity = 1;
	 function stepStar()
	 {
	    end_opacity = 1 - end_opacity;

	    if ($star.css("top") == "-314px")
	    {
	       $star.remove();
	       return;
	    }
	    $star.animate(
	       { opacity: end_opacity },
	       randint(3000)+1500, 'swing', stepStar);
	 }

	 var $star = $('<div class="wsnow star"></div>');

	 var x = randint($Container.width());
	 var y = randint($Container.height()*0.3);
	 var w = Starsinfo["width"];
	 var h = Starsinfo["height"];

	 // static relative fixed absolute sticky
	 $star.css({top: y, left: x, opacity: 1, position: Position,
	    width: w, height: h});
	 $Container.append($star);
	 stepStar();
      }

      function createStars()
      {
	 //$(".wsnow.star").css({top: "-314px"});
	 $(".wsnow.star").remove();
	 for (var i=0; i< Nstars; i++)
	    createStar();
      }

      // not used as such, but decomposed in createMeteorite
      function createLine(x1,y1, x2,y2){
	 // thanks to http://www.monkeyandcrow.com/blog/drawing_lines_with_css3/
	 var length = Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
	 var angle  = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
	 var transform = 'rotate('+angle+'deg)';

	 // static relative fixed absolute sticky
	 var line = $('<div>')
	 //.addClass('wsnow line')
	    .css({
	       'transform-origin': '0 100%',
	       'position':         'absolute',
	       'height':           2,
	       'background':       'orange',
	       'transform':        transform
	    })
	    .width(length)
	    .offset({left: x1, top: y1});

	 return line;
      }

      function createMeteorite()
      {
	 // static relative fixed absolute sticky
	 var $meteorite = $('<div>')
	    .css({
	       'transform-origin': '0 100%',
	       'height':           2,
	       'background':       'orange',
	       'opacity':          0,
	       'position':         Position,
	    });
	 $Container.append($meteorite);

	 function stepMeteorite()
	 {
	    setTimeout(
	       function()
	       {
		  //var x1        = $Container.width()-30; // testing
		  var x1        = randint($Container.width()-50);
		  var y1        = randint(0.2*$Container.height());
		  var x2        = x1+50+randint(100);
		  var y2        = y1+20+randint(50);
		  var length    = Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
		  var angle     = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
		  var transform = 'rotate('+angle+'deg)';

		  $meteorite.width(0)
		     .css({'transform': transform, opacity: 1, left: x1, top: y1})
		  ;
		  if (!Do_meteorite)
		     length = 0;

		  $meteorite.animate( {width: length},180,'swing');
		  $meteorite.animate( {opacity: 0},400,'swing',
		     stepMeteorite);
	       },
	       randint(1000*Meteorite_dt));
	 }
	 stepMeteorite();
      }


      function intersection(xa1,ya1,xa2,ya2,xb1,yb1,xb2,yb2)
      {
	 var si= Math.max(0, Math.min(xa2, xb2) - Math.max(xa1, xb1)) * 
	    Math.max(0, Math.min(ya2, yb2) - Math.max(ya1, yb1));
	 return si;
      }


      function createTree(m,flop)
      {
	 var $tree = $('<div class="wsnow"></div>');
	 $tree.addClass("tree"+m);
	 $Container.append($tree).hide;
	 var w1 = $tree.width();
	 var h1 = $tree.height();
	 var w = Treesinfo[m].width;
	 var h = Treesinfo[m].height;

	 for (var tryit=0; tryit<100; tryit++)
	 {
	    var x = randint($Container.width()-w);
	    var y = $Container.height()-h-0.25*randint($Container.height());
	    var good = true;

	    for (var i = 0; i<Treeregion.length; i++)
	    {
	       var s = intersection(x,y,x+w,y+h,
		  Treeregion[i].x1, Treeregion[i].y1, Treeregion[i].x2, Treeregion[i].y2);
	       if (s != 0)
	       {
		  good = false;
		  break;
	       }
	    }

	    if (good)
	    {
	       Treeregion.push({x1:x,y1:y,x2:x+w,y2:y+h});
	       $tree.css({left: x, top: y, overflow: 'hidden' ,width: w, height: h}).show();
	       if (flop)
		  $tree.css({'-webkit-transform': 'scaleX(-1)', 'transform': 'scaleX(-1)'});
	       return;
	    }
	 }
	 $tree.remove();
      }



      function createTrees()
      {

	 Treeregion = [];   // { x1, y1, x2, y2 }
	 for (var i=0; i<Ntrees; i++)
	    $(".wsnow.tree"+(i+1)).remove();
	 for (var i=0; i<Maxtrees; i++)
	 {
	    var m;
	    if (Vintage)
	       m = 1;
	    else
	    {
	       if (Ntrees <= Object.keys(Forbiddentrees).length)
		  return;
	       while (true)
	       {
		  m = 1+randint(Ntrees);
		  if (Forbiddentrees[m] === undefined)
		     break;
	       }
	    }
	    var flop = (Math.random()>0.5);
	    createTree(m,flop);
	 }
      }


      function createHello()
      {
	 $Container.append($('<div id="wsnow_hello"></div>'));
	 var x = ""
	    + '<div style="text-align: right">'
	    + '<button class="wsnow_button wsnow_remove_hello">X</button>'
	    + '</div>'
	    + "<h2>Welcome at wsnow!</h2>"
	    + "<p>"
	    + ' Choose your settings:'
	    + " </p>"
	    + '<button class="wsnow_button wsnow_choices" what="santa">Santa</button>'
	    + '<button class="wsnow_button wsnow_choices" what="trees">trees</button>'
	    + '<button class="wsnow_button wsnow_choices" what="celestials">celestials</button>'
	    + '<button class="wsnow_button wsnow_choices" what="vintage">vintage</button>'
	 ;
	 if (Dobackground)
	    x+= '<button class="wsnow_button wsnow_choices" what="background">background</button>';

	 x += ""
	    + '<button class="wsnow_button wsnow_choices" what="about">about</button>'
	    + '<hr>'

	    + '<div id="wsnow_santa_menubuttons" class="wsnow_menu">' 
	    + '<label>Santa and Rudolph</label><br>'
	 ;
	 for (var i=1; i<=Nsantas; i++)
	    x += '<br><button class="wsnow_button wsnow_santa_button" index="'+i+'"> <img> </button>';

	 x += ""
	    + '<br><br>'
	    + '<button class="wsnow_button" id="wsnow_rudolfbutton">Rudolph switch</button>'
	    + '<button class="wsnow_button" id="wsnow_santaswitchbutton">Santa switch</button>'
	    + '<br><br>'
	    + '<label>Speed:</label>&nbsp;'
	    + '<button class="wsnow_button wsnow_santaspeedbutton" speed="minus">-</button>'
	    + '<button class="wsnow_button wsnow_santaspeedbutton" speed="plus">+</button>'
	    + '<button class="wsnow_button wsnow_santaspeedbutton" speed="default">O</button>'
	    + '</div>'

	    + '<div id="wsnow_trees_menubuttons" class="wsnow_menu">'
	    + '<label>Trees:</label>&nbsp;'
	    + '<button class="wsnow_button wsnow_maxtreesbutton" what="minus">-</button>'
	    + '<button class="wsnow_button wsnow_maxtreesbutton" what="plus">+</button>'
	    + '<button class="wsnow_button wsnow_maxtreesbutton" what="default">O</button>'
	    + '<br><br>'
	 ;

	 for (var i=1; i<=Ntrees; i++)
	    x += '<button class="wsnow_button wsnow_tree_button" tree="'+i+'"> <img height="35" src="'+Treesinfo[i].src+'"></button>';

	 x += ""
	    + '</div>'

	    + '<div id="wsnow_celestials_menubuttons" class="wsnow_menu">'
	    +    '<label>Snow</label>'
	    +    '<br><label>amount:</label>&nbsp;'
	    +    '<button class="wsnow_button wsnow_snowquanitybutton" what="minus">-</button>'
	    +    '<button class="wsnow_button wsnow_snowquanitybutton" what="plus">+</button>'
	    +    '<button class="wsnow_button wsnow_snowquanitybutton" what="default">O</button>'
	    +    '&nbsp;<label>speed:</label>&nbsp;'
	    +    '<button class="wsnow_button wsnow_snowspeedbutton" what="minus">-</button>'
	    +    '<button class="wsnow_button wsnow_snowspeedbutton" what="plus">+</button>'
	    +    '<button class="wsnow_button wsnow_snowspeedbutton" what="default">O</button>'
	    +    '<br><br>'

	    +    '<label>Stars:</label>&nbsp;'
	    +    '<button class="wsnow_button wsnow_starbutton" what="minus">-</button>'
	    +    '<button class="wsnow_button wsnow_starbutton" what="plus">+</button>'
	    +    '<button class="wsnow_button wsnow_starbutton" what="default">O</button>'

	    +    '<br><br>'
	    +    '<label>Meteorites:</label>&nbsp;'
	    +    '<button class="wsnow_button wsnow_meteobutton" what="yes">yes</button>'
	    +    '<button class="wsnow_button wsnow_meteobutton" what="no">no</button>'

	    +    '<br><br>'
	    +    '<label>Wind:</label>&nbsp;'
	    +    '<button class="wsnow_button wsnow_windbutton" what="minus">-</button>'
	    +    '<button class="wsnow_button wsnow_windbutton" what="plus">+</button>'
	    +    '<button class="wsnow_button wsnow_windbutton" what="default">O</button>'
	    + '</div>'

	    + '<div id="wsnow_background_menu" class="wsnow_menu">'
	    +    '<label>Background</label><br><br>'
	    +    '<table style="color:black;background-color:white; margin:0 auto;">'
	    +    '<tr><td>Top color:</td>'   
	    +    '<td><input id="colorpickertop" /> </td></tr>'
	    +    '<tr><td>Bottom color:</td>'   
	    +    '<td><input id="colorpickerbot" /> </td></tr>'
	    + '</table>'
	    + '</div>'

	    + '<div id="wsnow_about_menu" class="wsnow_menu">'
	    + '<p>Wsnow, written using Javascript and jQuery, '
	    + 'is a program that shows some Christmas-related '
	    + 'items in a web browser.<p>'
	    + '<p>It has more or less the look-and-feel of the famous program xsnow, which '
	    + 'only runs on the desktop of decent Unix and Linux systems.</p>'
	    + '<br>'
	    + '<label> Version '+wsnow_version+'</label>'


	    + '</div>'
	 ;

	 $Hello = $("#wsnow_hello");
	 // static relative fixed absolute sticky
	 $Hello.html(x).hide().css({'color': 'white', 'background-color': 'black',
	    'width': 500, 'font-family': "Verdana, Geneva, sans-serif",'text-align':'center',
	    left:20,top:30,position:Position,'padding':"20px"});
	 $(".wsnow_button").css("background-color",Buttonbackground);
	 return $Hello;
      }


      function closeMenus()
      {
	 $(".wsnow_menu").hide();
	 $(".wsnow_choices").css("background-color",Buttonbackground);
	 $(".wsnow_choices").attr("clicked","no");
      }

      function openSantamenu()
      {
	 closeMenus();
	 $("#wsnow_santa_menubuttons").show();
      }

      function openmenu(target)
      {

	 var x = target.currentTarget;

	 if (x.getAttribute("clicked") == "yes")
	 {
	    closeMenus();
	    return;
	 }

	 closeMenus();
	 x.setAttribute("clicked","yes");
	 var what = x.getAttribute("what");
	 $(x).css("background-color","yellow");

	 switch (x.getAttribute("what"))
	 {
	    case "santa":
	       $("#wsnow_santa_menubuttons").show();
	       break;
	    case "trees":
	       $("#wsnow_trees_menubuttons").show();
	       for (var i = 1; i<= Ntrees; i++)
	       {
		  var $tree = $('.wsnow_tree_button[tree="'+i+'"]');
		  if (Forbiddentrees[i])
		     $tree.css("opacity","0.6");
		  else
		     $tree.css("opacity","1");
	       }
	       break;
	    case "celestials":
	       $("#wsnow_celestials_menubuttons").show();
	       set_meteobuttons_color();
	       break;
	    case "vintage":
	       do_vintage();
	       closeMenus();
	       break;
	    case "background":
	       $("#wsnow_background_menu").show();
	       do_background();
	       break;
	    case "about":
	       $("#wsnow_about_menu").show();
	       break;
	 }
      }


      function showHello()
      {
	 $Hello.css({"margin":"auto"}).show();
	 $Container.off("click");
      }

      function clickon()
      {
	 $Container.click(showHello);
      }


      function removeHello()
      {
	 $Hello.hide();
	 setTimeout(clickon,200);
      }

      function do_vintage()
      {
	 Vintage    = true;
	 Fppps      = Fppps_vintage;
	 Maxtrees   = Maxtrees_vintage;
	 Nstars     = Nstars_vintage;
	 Santa_type = 2*3;
	 stop_snow();
	 start_snow();
	 createTrees();
	 createStars();
	 $Vintagebutton.off().html("default").click(do_default);

	 Vintage = false;
      }
      function do_default()
      {
	 Vintage    = false;
	 Fppps      = Fppps_default;
	 Maxtrees   = Maxtrees_default;
	 Nstars     = Nstars_default;
	 Santa_type = 2*1-1;
	 stop_snow();
	 start_snow();
	 createTrees();
	 createStars();
	 $Vintagebutton.off().html("vintage").click(do_vintage);
      }

      function do_Santa(target)
      {
	 var x = target.currentTarget;
	 if (ShowRudolf)
	    Santa_type = parseInt(x.getAttribute("index"))*2;
	 else
	    Santa_type = parseInt(x.getAttribute("index"))*2-1;

      }


      function do_Rudolfswitch()
      {
	 ShowRudolf = ! ShowRudolf;
	 var rs;
	 if (ShowRudolf)
	    rs = 0;
	 else
	    rs = 1;
	 for (var i=1; i<=Nsantas; i++)
	 {
	    var k=2*i-rs;
	    $('.wsnow_santa_button[index="'+i+'"] img').attr("src",Santasinfo[k].src);
	 }
      }


      function do_Santaswitch()
      {
	 ShowSanta = !ShowSanta;
	 if (ShowSanta)
	    startSanta();
	 else
	    stopSanta();
      }


      function do_Santaspeed(target)
      {
	 var x = target.currentTarget;
	 switch(x.getAttribute("speed"))
	 {
	    case "plus":
	       Santa_speed *=1.20;
	       if (Santa_speed > 300)
		  Santa_speed = 300;
	       break;
	    case "minus":
	       Santa_speed /=1.2;
	       if (Santa_speed < 10)
		  Santa_speed = 10;
	       break;
	    case 'default':
	       Santa_speed = Santa_speed_default;
	       break;
	 }
      }


      function do_trees(target)
      {
	 var x = target.currentTarget;
	 var m = x.getAttribute("tree");
	 if (Forbiddentrees[m])
	 {
	    delete(Forbiddentrees[m]);
	    $(x).css("opacity","1");
	 }
	 else
	 {
	    Forbiddentrees[m] = true;
	    $(x).css("opacity","0.6");
	 }
	 createTrees();
      }

      function do_maxtrees(target)
      {
	 var x = target.currentTarget;
	 switch(x.getAttribute("what"))
	 {
	    case "plus":
	       Maxtrees *=1.2;
	       if (Maxtrees > 120)
		  Maxtrees = 120;
	       if (Maxtrees == 0)
		  Maxtrees = 1
	       break;
	    case "minus":
	       Maxtrees /=1.2;
	       if (Maxtrees < 1)
		  Maxtrees = 0;
	       break;
	    case "default":
	       Maxtrees = Maxtrees_default;
	       break;
	 }
	 createTrees();
      }

      function do_snowquantity(target)
      {
	 var x = target.currentTarget;
	 switch(x.getAttribute("what"))
	 {
	    case "plus":
	       Fppps *=1.2;
	       if (Fppps > 0.1)
		  Fppps = 0.1;
	       if (Fppps == 0)
		  Fppps = 0.0001;
	       break;
	    case "minus":
	       Fppps /=1.2;
	       if (Fppps < 0.0001)
		  Fppps = 0;
	       break;
	    case "default":
	       Fppps = Fppps_default;
	       break;
	 }
      }

      function do_snowspeed(target)
      {
	 var x = target.currentTarget;
	 switch(x.getAttribute("what"))
	 {
	    case "plus":
	       Flake_speed *=1.2;
	       if (Flake_speed > 600)
		  Flake_speed = 600;
	       break;
	    case "minus":
	       Flake_speed /=1.2;
	       if (Flake_speed < 5)
		  Flake_speed = 5;
	       break;
	    case "default":
	       Flake_speed = Flake_speed_default;
	       break;
	 }
      }

      function do_windspeed(target)
      {
	 var x = target.currentTarget;
	 switch(x.getAttribute("what"))
	 {
	    case "plus":
	       Windspeed *=1.2;
	       if (Windspeed > 1000)
		  Windspeed = 1000;
	       if (Windspeed == 0)
		  Windspeed = 5;
	       break;
	    case "minus":
	       Windspeed /=1.2;
	       if (Windspeed < 5)
		  Windspeed = 0;
	       break;
	    case "default":
	       Windspeed = Windspeed_default;
	       break;
	 }
	 Wind = (randint(3)-1)*Windspeed;
      }

      function do_stars(target)
      {
	 var x = target.currentTarget;
	 switch(x.getAttribute("what"))
	 {
	    case "plus":
	       Nstars *=1.2;
	       if (Nstars > 200)
		  Nstars = 200;
	       if (Nstars == 0)
		  Nstars = 1;
	       break;
	    case "minus":
	       Nstars /=1.2;
	       if (Nstars < 0.5)
		  Nstars = 0;
	       break;
	    case "default":
	       Nstars = Nstars_default;
	       break;
	 }
	 createStars();
      }

      function do_meteorites(target)
      {
	 var x = target.currentTarget;
	 if (x.getAttribute("what") == "yes")
	 {
	    Do_meteorite = true;
	 }
	 else
	 {
	    Do_meteorite = false;
	 }
	 set_meteobuttons_color();
      }

      function set_meteobuttons_color()
      {
	 var $yes = $('.wsnow_meteobutton[what="yes"]');
	 var $no  = $('.wsnow_meteobutton[what="no" ]');
	 if (Do_meteorite)
	 {
	    $yes.css("background-color","yellow");
	    $no.css("background-color",Buttonbackground);
	 }
	 else
	 {
	    $yes.css("background-color",Buttonbackground);
	    $no.css("background-color","yellow");
	 }
      }

      function do_background()
      {
	 var $top = $("#colorpickertop");
	 //$top.spectrum({ color:Topcolor });
	 var $bot = $("#colorpickerbot");
	 //$bot.spectrum({ color:Botcolor });
	 $top.change( function () {
	    Topcolor = $top.val();
	    setbackground();
	 });
	 $bot.change( function () {
	    Botcolor = $bot.val();
	    setbackground();
	 });
      }

      function setbackground()
      {
	 if (!Dobackground)
	    return;
	 $Container.css({"background-image":'linear-gradient('+Topcolor+', '+Botcolor+')',
	    "background-size":"100% 105%"});  // 105% ?: sometimes, using chromium browser, 
	 //                                // there remains a small Topcolor region at the bottom
	 //                                // when using 100%.
      }



      // ----- start of main program ------


      $Container = $(Where);

      $(window).resize( 
	 function()
	 {
	    Resized=true;
	 }
      );

      gettreesinfo();
      getstarsinfo();
      getsnowinfo();
      getsantainfo();
      waitfor( checkAll,   // wait for completion of gettreesinfo()
	 function() {
	    defaults();
	    console.log("Santa_dt:",Santa_dt);
	    console.log("Santa_speed:",Santa_speed);
	    console.log("Santa_type:",Santa_type);
	    console.log("Do_meteorite:",Do_meteorite);
	    console.log("Botcolor:",Botcolor);
	    console.log("Flake_speed:",Flake_speed);
	    console.log("Flakedt:",Flakedt);
	    console.log("Forbiddentrees:",Forbiddentrees);
	    console.log("Fppps:",Fppps);
	    console.log("Maxtrees:",Maxtrees);
	    console.log("Meteorite_dt:",Meteorite_dt);
	    console.log("Nstars:",Nstars);
	    console.log("Show_menu:",Show_menu);
	    console.log("Vintage:",Vintage);
	    console.log("Where:",Where);
	    console.log("Windspeed:",Windspeed);
	    console.log("Windtimer:",Windtimer);
	    setbackground();
	    start_snow();
	    startSanta();
	    createWind();
	    createResize();
	    if(!Vintage)
	       createStars();
	    createMeteorite();
	    createTrees();
	    if (!Show_menu)
	       return;

	    $Hello = createHello();
	    showHello();
	    closeMenus();
	    $("#wsnow_hello .wsnow_remove_hello").click(removeHello);
	    ShowRudolf = true;
	    do_Rudolfswitch();
	    $('#wsnow_rudolfbutton').click(do_Rudolfswitch);
	    $('.wsnow_choices').click(openmenu);
	    $('#wsnow_santaswitchbutton').click(do_Santaswitch);
	    $(".wsnow_santa_button").click(do_Santa);
	    ShowRudolf = false;
	    ShowSanta  = true;

	    $Vintagebutton = $('.wsnow_choices[what="vintage"]');
	    $('.wsnow_santaspeedbutton').click(do_Santaspeed);
	    $('.wsnow_tree_button').click(do_trees);
	    $('.wsnow_maxtreesbutton').click(do_maxtrees);
	    $('.wsnow_snowquanitybutton').click(do_snowquantity);
	    $('.wsnow_snowspeedbutton').click(do_snowspeed);
	    $('.wsnow_starbutton').click(do_stars);
	    $('.wsnow_meteobutton').click(do_meteorites);
	    $('.wsnow_windbutton').click(do_windspeed);
	 },10);  // waitfor
   });  // $(document).ready
}  // wsnow


