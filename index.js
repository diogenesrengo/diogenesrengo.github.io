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
	};

	wsnow();

function wsnow() {
    $(document).ready(function() {
        if (wsnow_parms !== undefined) {
	        var Santa_dt    = wsnow_parms.Santa_dt;     // update interval for santa, seconds
	        var Santa_speed = wsnow_parms.Santa_speed;  // speed of Santa, pixels/second
	        var Santa_type  = wsnow_parms.Santa_type;   // which Santa to show
	        var Where       = wsnow_parms.where;        // where to snow
        }

      var Container;
      var Itemscount = 0;
      var Nsantas;
      var Position = 'fixed';           // static relative fixed absolute sticky
      var Resized = false;
      var Santa_default = 5;            // Santa: 8 reindeers
      var Santa_speed_default = 100;
      var Santasinfo = [];
      var ShowRudolf;
      var ShowSanta;

      if (Where === undefined) Where = 'body';

    function defaults() {
	    if (Santa_dt    === undefined) Santa_dt    = 0.5;
	    if (Santa_speed === undefined) Santa_speed = Santa_speed_default;
	    if (Santa_type  === undefined) Santa_type  = Santa_default;
    }    

    function randint(n) {
	    // returns int <n, >=0
	    return Math.floor(Math.random()*n);
    }

        // convert 'url("file:///home/etc/etc")' 
        //  and    'url("http://localhost/etc/etc")'
        //  to ///home/etc/etc
        //  resp
        //  to //localhost/etc/etc
        //
    function urltoimg(url) {
	    //var x = url.replace(/.*:/,"");
	    // but: if url is like 'url("http://localhost:8081/etc/etc")' ....
	    var x = url.replace(/^[^:]*:/,"");
	    x = x.replace(/\"\)/,"");
	    return x;
    }

        // to count items like
        // .wsnow.tree1 { background-image: url("../images/tannenbaum.png");}
        // .wsnow.tree2 { background-image: url("../images/baum.png");}
    function countItems(item) {
	    var i = 0;
	    while (1) {
	        i++;
	        var item = $('<div class="wsnow"></div>');
	        item.addClass(item+i).hide();
	        Container.append(item);
	        var b = item.css("background-image");
	        item.remove();
	        if (b == "none")
	            return i-1;
	    }
    }


    function getsantainfo() {
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
	    while (true) {
	        i++;
	        var s = "santa"+i+"_";
	        var n = countItems(s);
	        if (n != 4) break;
	        s = "wsnow "+s+1;
	        var sinfo = getiteminfo(s);
	        sinfo.name = "santa"+i;

	        // so santa is ok, now check if rudolf is ok
	        s = "santarudolf"+i+"_";
	        n = countItems(s);
	        if (n != 4) break;
	        Nsantas++;
	        Santasinfo[2*i-1]   = sinfo;
	        s = "wsnow "+s+1;
	        var rinfo = getiteminfo(s);
	        rinfo.name = "santarudolf"+i;
	        // looks ok, store results
	        Santasinfo[2*i] = rinfo;
	    }
    }

    function checkSanta() {
	    if (Santasinfo.length <= 2*Nsantas)
	        return false;
	    for (var i=1; i<=2*Nsantas; i++) {
	        if (!Santasinfo[i].src || !Santasinfo[i].width || !Santasinfo[i].height 
	            || Santasinfo[i].width<0 || Santasinfo[i].height<0 )
	            return false;
	    }
	    return true;
    }

    function getiteminfo(c) {
	    Itemscount ++;
	    var iteminfo = {};
	    var item = $('<div class="'+c+'"></div>');
	    item.css({left: 100, top: 100, overflow: 'hidden' }).show();
	    $('body').append(item);
	    var x = item.css("background-image");
	    iteminfo = {src: urltoimg(x),width:-314,height:-314};
	    item.remove();

	    item = $('<img id="wsnow_apekool'+Itemscount+'" src="'+iteminfo.src+'">').hide();
	    $("body").append(item);
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
    function waitfor(wait,run,t) {
	    function w() {
	        if (wait())
	            run();
	        else
	            setTimeout(w,t);
	    }
	    if (t === undefined)
	        t = 5;
	    w();
    }

    function createSanta() {
	    var yspeed = 0;
	    function stepYspeed() {
	        yspeed = randint(51) - 25;
	        setTimeout(stepYspeed,3000);
	    }
	    stepYspeed();

	    var santatype = Santa_type;

	    function stepSanta(n) {
	        y += yspeed * Santa_dt;
	        if (y <= 0)  y = 0;
	        if (y > 150) y = 150;

	        santa.removeClass(Santasinfo[santatype].name+"_"+n);
	        n++;
	        if (n > 4) n = 1;
	        var s = Santasinfo[Santa_type];
	        santa.addClass(s.name+"_"+n).css({width: s.width, height: s.height});
	        santatype = Santa_type;     // Santa_type can change, so we remember it here
	        //xspeed = Santa_speed + 1.5*Wind;
	        xspeed = Santa_speed;
	        if(xspeed > 2*Santa_speed)     xspeed = 2*Santa_speed;
	        if (xspeed < -0.2*Santa_speed) xspeed = -0.2*Santa_speed;
	        x += xspeed * Santa_dt;
	        if (x < -300) x = -300;
	        var timer;
	        if (x > Container.width()) {
	            y = (randint(100)+50);
	            x = -300;
	            timer = 0;
	        }
	        else timer = Santa_dt * 1000;

	        santa.animate({left: x+'px', top: y+'px'},timer,"linear",function(){
	            stepSanta(n);
	        });
	    }
	    
        var santa = $('<div class="wsnow"></div>');
	    var y = (randint(100)+50);
	    var x = -300;
	    var xspeed = Santa_speed;

	    santa.css({ top: y, left: x, opacity: 1, position: Position} ).addClass("wsnow_santa");
	        Container.append(santa);
	    stepSanta(1);
    }

    function startSanta() {
	    $(".wsnow_santa").remove();
	    createSanta();
    }
    
    function stopSanta() {
	    $(".wsnow_santa").stop().remove();
    }

    function createResize() {
	    function stepResize() {
	        setTimeout(function(){if (Resized) Resized=false; stepResize();}, 4000);
	    }
	    stepResize();
    }

    function do_Santa(target) {
	    var x = target.currentTarget;
	    if (ShowRudolf) Santa_type = parseInt(x.getAttribute("index"))*2;
	    else     	    Santa_type = parseInt(x.getAttribute("index"))*2-1;
    }

    function do_Rudolfswitch() {
	    ShowRudolf = ! ShowRudolf;
	    var rs;
	    if (ShowRudolf) rs = 0; else rs = 1;
        for (var i=1; i<=Nsantas; i++) {
	        var k=2*i-rs;
	        $('.wsnow_santa_button[index="'+i+'"] img').attr("src",Santasinfo[k].src);
	    }
    }

    function do_Santaswitch() {
	    ShowSanta = !ShowSanta;
	    if (ShowSanta) startSanta(); else stopSanta();
    }

    function do_Santaspeed(target) {
	    var x = target.currentTarget;
	    switch(x.getAttribute("speed")) {
	        case "plus":
	            Santa_speed *=1.20;
	            if (Santa_speed > 300) Santa_speed = 300;
	            break;
	        case "minus":
	            Santa_speed /=1.2;
	            if (Santa_speed < 10) Santa_speed = 10;
	            break;
	    case 'default':
	            Santa_speed = Santa_speed_default;
	            break;
	    }
    }


    // ----- start of main program ------


    Container = $(Where);

    $(window).resize( function() { Resized=true; } );

    getsantainfo();
    waitfor( checkSanta, function() {
	    defaults();
	    console.log("Santa_dt:",Santa_dt);
	    console.log("Santa_speed:",Santa_speed);
	    console.log("Santa_type:",Santa_type);
	    console.log("Where:",Where);
	    startSanta();
	    createResize();

	    ShowRudolf = true;
	    do_Rudolfswitch();
	    ShowRudolf = false;
	    ShowSanta  = true;

	 },10);  // waitfor
   });  // $(document).ready
}  // wsnow

