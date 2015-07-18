//---------------------------Load the video-----------------------------

var _STATIC_URL = "/";
var videoId;
var player, startTime, endTime;
var timeUpdater = null;
var thumbnailUpdater = null;
var maxGifLength = 15;
var currentMaskCoordinates = null;
var VIDEO_TYPE = null;


function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}
var url = window.location.pathname;
var GET_VIDEO_TYPE = getQueryVariable('type');
var VIDEO_ID_FILE = url.substring(url.lastIndexOf('/')+1);


var onStart = function() {
  if(document.getElementById('player-toggle') != null){
    //download YouTube player API
    var tag = document.createElement('script');
    tag.src = "//www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    // Create YouTube player(s) after the API code downloads.
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    function onYouTubeIframeAPIReady() {
        player = new YT.Player('player-toggle', {
        events: {
          'onReady': onPlayerReady
        }
      });
    }
    function onPlayerReady(evt) {
        initSlider();
    }
  }
  else {
    document.getElementById('player-video').addEventListener('loadeddata', function() {
        player = {
          getDuration: function() {
            return parseInt(document.getElementById('player-video').duration);
          },
          mute: function() {
            return document.getElementById('player-video').setAttribute('muted','true');
          },
          seekTo: function(t) {
            return document.getElementById('player-video').currentTime = t;
          },
          getCurrentTime: function() {
            return document.getElementById('player-video').currentTime;
          }
        };
        initSlider();
      }, false);

  }
}





//---------------------------Set the page up (content + listeners)-----------------------------

function init(id) {
	videoId = id;
	initLoopButtons();
	$('document').ready(function(){
		buildMask('region-mask');
		buildMask('split-mask');
		verticallyCenter();
		document.getElementById("save-note").innerHTML = "<i class='fa fa-folder-open'></i>"
    + " GIFs + video located in Documents" +
    "> Glyph > videos > " + videoId + " > gifs";
	});

}

function verticallyCenter() {

	bigLeftCol = $('#bigLeftCol').height();
	win = $(window).height();
	console.log(win);
	if ((win - bigLeftCol)/2 > 50) {
		$('#bigLeftCol').css("padding-top", (win - bigLeftCol)/2 + "px" );
		$('#focus-left-button').css("top", -(win - bigLeftCol)/2 + "px" );
	}
}

//---------------------------Set up mask canvases-----------------------------

function buildMask (id) {
	var canvas = document.getElementById(id),
    ctx = canvas.getContext('2d'),
    rect = {},
    drag = false;

	function draw() {
		if (id == 'region-mask') { //draw rectangle
			ctx.fillRect(rect.startX, rect.startY, rect.w, rect.h);
		}
		else if (id == 'split-mask') {
			//draw line
			ctx.beginPath();
			ctx.moveTo(rect.startX, rect.startY);
			ctx.lineTo(rect.startX + rect.w, rect.startY + rect.h);
			ctx.stroke();
		}
		currentMaskCoordinates = [rect.startX, rect.startY, rect.startX + rect.w, rect.startY + rect.h];

	}

	function getMousePos(canvas, evt) {
		var rect = canvas.getBoundingClientRect();
		return {
		  x: evt.clientX - rect.left,
		  y: evt.clientY - rect.top
		};
	}

	function mouseDown(e) {
	  // rect.startX = e.pageX - this.offsetLeft;
	  // rect.startY = e.pageY - this.offsetTop;
	  rect.startX = getMousePos(canvas, e).x;
	  rect.startY = getMousePos(canvas, e).y;
	  drag = true;
	}

	function mouseUp() {
	  drag = false;
	}

	function mouseMove(e) {
	  if (drag) {
	    rect.w = getMousePos(canvas, e).x - rect.startX;
	    rect.h = getMousePos(canvas, e).y - rect.startY ;
	    ctx.clearRect(0,0,canvas.width,canvas.height);
	    draw();
	  }
	}

	function init() {
	  canvas.addEventListener('mousedown', mouseDown, false);
	  canvas.addEventListener('mouseup', mouseUp, false);
	  canvas.addEventListener('mousemove', mouseMove, false);
	}

	init();
}

function splitMaskButtonClicked () {
	$( "#split-mask-button" ).toggleClass( "mask-active" );
	$( "#region-mask-button" ).removeClass( "mask-active" );

	$( "#region-mask" ).addClass( "mask-hidden" );
	$( "#split-mask" ).toggleClass( "mask-hidden" );

	// $( "#region-choice" ).toggleClass( "mask-hidden" );
	if ($( "#split-mask-button" ).hasClass( "mask-active" )) {
		document.getElementById("region-choice").style.opacity = "1";
		document.getElementById("mask-instructions").innerHTML = "Draw on the blue mask."
	}
	else {
		document.getElementById("region-choice").style.opacity = "";
		document.getElementById("mask-instructions").innerHTML = ""
	}
	$( '#arrow-up' ).css("left", "51px")
	$( "#1-label span" ).text("Freeze Right Side");
	$( "#2-label span" ).text("Freeze Left Side");

}

function regionMaskButtonClicked () {
	$( "#region-mask-button" ).toggleClass( "mask-active" );
	$( "#split-mask-button" ).removeClass( "mask-active" );

	$( "#split-mask" ).addClass( "mask-hidden" );
	$( "#region-mask" ).toggleClass( "mask-hidden" );

	if ($( "#region-mask-button" ).hasClass( "mask-active" )) {
		document.getElementById("region-choice").style.opacity = "1";
		document.getElementById("mask-instructions").innerHTML = "Draw on the purple mask."
	}
	else {
		document.getElementById("region-choice").style.opacity = "";
		document.getElementById("mask-instructions").innerHTML = ""
	}
	$( '#arrow-up' ).css("left", "183px")
	$( "#1-label span" ).text("Freeze Inner Region");
	$( "#2-label span" ).text("Freeze Outer Region");
}

//---------------------------JQuery UI slider-----------------------------

// var changeStartVal = function() {
// 	startTime = parseFloat($(this).val());
// 	endTime = startTime + duration;
//     $( "#slider-range" ).slider( "value", startTime );
//     loopVideo();
//     refreshThumbnails();
// }

// var changeDurationVal = function() {
// 	duration = parseFloat($(this).val());
// 	endTime = startTime + duration;
//     loopVideo();
//     refreshThumbnails();
// }

// function updateTimeButton() {
// 	changeStartVal;
// 	changeDurationVal;
// }

function initSlider() {
	$(function() {
		startTime = 10.05;
		duration = 2.25;
		endTime = startTime + duration;
		var videoDuration = player.getDuration();
    console.log("videoDuration" + videoDuration);

	    $( "#slider-range" ).slider({
	      min: 0,
	      max: videoDuration,
	      step: .001,
	      value: startTime,
	      slide: function(event, ui) {
            startTime = ui.value;
            endTime = startTime + duration;
	        $( "#start" ).val(startTime);
	        loopVideo();
	        refreshThumbnails();
	      }
	    });
	    $( "#start" ).val(startTime);
	    $( "#duration" ).val(duration);

	    $( "#start" ).change(function() {
			startTime = parseFloat($(this).val());
			endTime = startTime + duration;
		    $( "#slider-range" ).slider( "value", startTime );
		    loopVideo();
		    refreshThumbnails();
		});
	    $( "#duration" ).change(function() {
			duration = parseFloat($(this).val());
			endTime = startTime + duration;
		    loopVideo();
		    refreshThumbnails();
		});
	});

}

//---------------------------Thumbnails & youtube preview + looping -----------------------------

function loopVideo() {
	console.log ("startTime: " + startTime);
	console.log ("endTime: " + endTime);

	player.mute();
  	clearInterval(timeUpdater);
	player.seekTo(startTime);
	function updateTime () {
		if (player.getCurrentTime() > endTime) {
			console.log("the video reached the end time! " + endTime);
			player.seekTo(startTime);
		}

		//update the value where we show the current time
		box = document.getElementById("time-box");
		$(box).val(player.getCurrentTime());
	}
	timeUpdater = setInterval(updateTime, 100);
}

function refreshThumbnails() {
	clearTimeout(thumbnailUpdater);
	function getThumbnails() {
		console.log ("refreshThumbnails " + startTime + " " + endTime);

		var thumbnailUrl = _STATIC_URL + 'authoringTool/makeThumbnails/' + VIDEO_ID_FILE
                      + '?type='+ GET_VIDEO_TYPE +'&start=' + startTime
                      + '&end=' + endTime;
    console.log(thumbnailUrl);
		var errorMessage = 'Oops. There was a problem loading the thumbnails. Something might be up with the video file. Try deleting the video directory and re-submitting its url.';
		handleRequest(thumbnailUrl, errorMessage, showThumbnails);
	}
	thumbnailUpdater = setTimeout(getThumbnails, 1000);
}


//---------------------------JQuery UI buttonset for loop type selection -----------------------------

function initLoopButtons () {
	//init radio buttons
	$(function() {
	    $( "#loop" ).buttonset();
	    $( "#region-choice" ).buttonset();
	});

}

function getRadioVal(id) {
    var val = "";
    // get list of radio buttons with specified name
    var radios = document.getElementsByClassName(id);

    // loop through list of radio buttons
    for (var i=0, len=radios.length; i<len; i++) {
        if ( radios[i].checked ) { // radio checked?
            val = radios[i].value; // if so, hold its value in val
            break; // and break out of for loop
        }
    }
    return val; // return value of checked radio or undefined if none checked
}

//---------------------------The place where shit gets built as a result of asynch calls-----------------------------

function resetGifContainer () {
	document.getElementById("gifContainer").innerHTML='<p id="loadingGif" class="blink_me">Generating your gif...Check the terminal <i class="fa fa-terminal"></i> for progress.</p>';
}

var showGif = function () {
	gifContainer = document.getElementById("gifContainer");
	response = JSON.parse(this.responseText);
	if (!response) {
		handleError ("Whoops, error getting response.")
		return;
	}
	// console.log (response);
	imagePath = response.gif;
	var gif = document.createElement("img");
	gif.setAttribute('src', imagePath);
	gif.setAttribute('class', 'gif');

	gifContainer.innerHTML="";
	gifContainer.appendChild(gif);

}

//we could clean these two up if we wanted

var showThumbnails = function () {
	console.log ("showThumbnails fired")
	startContainer = document.getElementById("startFrame");
	endContainer = document.getElementById("endFrame");
	response = JSON.parse(this.responseText);
	console.log (response);
	if (!response) {
		handleError ("Whoops, error getting response.")
		return;
	}
	var startThumbnail = document.createElement("img");
	startThumbnail.setAttribute('src', response.startThumb);
	startThumbnail.setAttribute('class', 'thumb');
	var endThumbnail = document.createElement("img");
	endThumbnail.setAttribute('src', response.endThumb);
	endThumbnail.setAttribute('class', 'thumb');

	startContainer.innerHTML="";
	startContainer.appendChild(startThumbnail);
	endContainer.innerHTML="";
	endContainer.appendChild(endThumbnail);

}

var showAutoLoopResults = function () {
	console.log ("auto loop");
	response = JSON.parse(this.responseText);
	console.log (response);
	if (!response) {
		handleError ("Whoops, error getting response.")
		return;
	}
	loopResults = document.getElementById("loop-results");
	loopResults.innerHTML = "<span class='small-text'>Loops in this clip (scroll for more, click to set)<i class='fa fa-angle-right'></i> </span>";
	for (var i = 0; i < response.loops.length; i++) {
		var d = Number(( parseFloat(response.loops[i].end) - parseFloat(response.loops[i].start) ).toFixed(2));
		var pair = "<span class='pair hover-highlight small-text' onclick='pairClicked(" + response.loops[i].start + "," + response.loops[i].end + ")'>Start time: " + response.loops[i].start + " | Duration: " + d + " s</span>"
		loopResults.innerHTML += pair;
	};
}

//---------------------------Click listeners-----------------------------

function focusLeft () {
	document.getElementById("gifBuilder").style.left = "0";
	document.getElementById("focus-right-button").style.opacity = "1";
	document.getElementById("focus-left-button").style.opacity = "0";
}

function focusRight () {
	document.getElementById("gifBuilder").style.left = "-70%";
	document.getElementById("focus-right-button").style.opacity = "0";
	document.getElementById("focus-left-button").style.opacity = "1";
}

function loopDetection() {
	document.getElementById("loop-results").innerHTML = "<span class='blink_me'> Looking for loops. This takes a while. </br> Leave Glyph alone, and check terminal <i class='fa fa-terminal'></i> for progress.</span>"
	var autoLoopUrl = _STATIC_URL + 'authoringTool/loopDetection/' +  VIDEO_ID_FILE;
	var errorMessage = 'There was a problem automatically detecting loops in this clip. Something might be up with the video file. Try deleting the video directory and re-submitting its url.';
	handleRequest(autoLoopUrl, errorMessage, showAutoLoopResults);
}

function pairClicked (pairStart, pairEnd) {
	console.log('clicked!');
	startTime = parseFloat(pairStart);
	endTime = parseFloat(pairEnd);
	duration = endTime - startTime;
	$( "#slider-range" ).slider( "value", startTime );
    $( "#start" ).val(startTime);
    $( "#duration" ).val(duration);
	loopVideo();
	refreshThumbnails();
}

function outputGif() {
	//check length of gif
	if (endTime - startTime > maxGifLength) {
		handleError("This clip is too long. Get the clip under " + maxGifLength + " seconds, and then you can process it.");
		return;
	}

	clearError ();
	// player.pauseVideo();
	resetGifContainer();

	var pixelWidth = document.getElementById('output-size').value; //get this
	console.log(pixelWidth);

	//get still frame
	var stillFrame = document.getElementById('still-frame').value;
	console.log("still frame = " + stillFrame);
	if (stillFrame > duration) {
		stillFrame = duration;
	}
	console.log("still frame = " + stillFrame);


	//get loop value
	var loop = getRadioVal("loopButton");

	//get mask value if any
	var maskType = "";
	var mask = "";
	maskRegion = getRadioVal("choice-button");
	console.log (maskRegion);
	//check to see if each mask editor is open
	if ( !$("#split-mask").hasClass("mask-hidden") ) {
		mask = resizeMask(currentMaskCoordinates, pixelWidth);
		if (mask != null) {
			maskType = "maskLeft"
			if (maskRegion == 2) {
				maskType = "maskRight";
			}
		}
	}
	else if ( !$("#region-mask").hasClass("mask-hidden") ) {
		mask = resizeMask(currentMaskCoordinates, pixelWidth);
		if (mask != null) {
			maskType = "maskInner";
			if (maskRegion == 2) {
				maskType = "maskOuter";
			}
		}
	}

	fps = document.getElementById("fps").value;

	var mp4 = ""
	if (document.getElementById("mp4").checked){
		mp4 = true;
	}

	var createGifUrl = _STATIC_URL + 'authoringTool/makeGif/' +  VIDEO_ID_FILE + '?start=' + startTime + '&end=' + endTime + '&pixelWidth=' + pixelWidth + '&loop=' + loop + '&maskType=' + maskType +'&stillFrame=' + stillFrame + '&mask=' + mask + '&mp4=' + mp4 + '&fps=' + fps;
	var errorMessage = 'Oops. There was a problem. Your gif could not be loaded. Something might be up with the video file. Try deleting the video directory and re-submitting its url.';
	console.log (createGifUrl);
	handleRequest(createGifUrl, errorMessage, showGif);
	focusRight ();

}

function resizeMask(currentMaskCoordinates, resizeX) {
	// dimension of drawing / dimension of player = resize mask X / dimensions of new gif
	if (currentMaskCoordinates == null){
		return null;
	}
	var x1, y1, x2, y2;
	var resizeY = resizeX * 315 / 560

	x1 = parseInt(currentMaskCoordinates[0] * resizeX / 560);
	y1 = parseInt(currentMaskCoordinates[1] * resizeY / 315);
	x2 = parseInt(currentMaskCoordinates[2] * resizeX / 560);
	y2 = parseInt(currentMaskCoordinates[3] * resizeY / 315);

	return [x1, y1, x2, y2];

	// return null;

}

//---------------------------Asynch Helpers-----------------------------

function handleRequest (url, error, onloadCallback) {
	var response;
	var request = new XMLHttpRequest();
	request.onreadystatechange=function() {
	    if (request.readyState === 4){   //if complete
	        if(request.status === 200){  //check if "OK" (200)
	            request.onload = onloadCallback;
	        } else {
	            handleError(error); //otherwise, some other code was returned
	        }
	    }
	}
	request.open('GET', url, true);
	request.send();
}

// does something with error messages
function handleError (errorMessage) {
	console.log(errorMessage);
	document.getElementById("error").innerHTML = errorMessage;
	document.getElementById("error").style.background = "white";
	focusLeft ();
}

function clearError () {
	document.getElementById("error").innerHTML = "";
	document.getElementById("error").style.background = "";
}


window.onload = function () {
	document.getElementById("curtain").style.opacity = 0;
	document.getElementById("curtain").style.zIndex = -10;
}
