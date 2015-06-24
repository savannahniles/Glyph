var gui = require("nw.gui");
var win = gui.Window.get();
var appWindow;

//win.showDevTools();
gui.App.clearCache();

//the block below gets copy-pasta to work
var nativeMenuBar = new gui.Menu({ type: "menubar" });
try {
	nativeMenuBar.createMacBuiltin("Glyph");
	win.menu = nativeMenuBar;
} catch (ex) {
	console.log(ex.message);
}

var startInterval = setInterval(function(){ checkServer(); }, 2500);

var checkServer = function() {

	var get = require('simple-get');
	get('http://localhost:1369/test', function (err, res) {
	  if (err) {
	  	console.log("The server is not started...");
	  } else {
	  	console.log ("Yo the server exists");
	  	clearInterval(startInterval);
	  	openWindow();
	  }
	});

}

var killServer = function() {
	console.log("killing server");

	var exec = require('child_process').exec;
	var child = exec('kill -9 `lsof -t -i:1369`',
	  function (error, stdout, stderr) {
	  	console.log('error: ' + error);
	    //console.log('stdout: ' + stdout); //this breaks shit
	    //console.log('stderr: ' + stderr); //this breaks shit
	  }
	);
}

var openWindow = function() {
	win.hide();
	appWindow = gui.Window.open('http://localhost:1369', // Starts your application
    { 	fullscreen: false, 
		resizable: false, 
		show: true, 
		frame: true, 
		title: "Glyph", 
		visible: true, 
		as_desktop: false, 
		width: 1430,
        height: 700,
		position: "center", 
		focus: true,
		show_in_taskbar: true, 
		transparent: false, 
		toolbar: false, 
    });
    appWindow.on('close', function() {
		console.log("Window is clooooosed");
		this.hide(); // Pretend to be closed already
		console.log("We're closing...");
		killServer();
		this.close(true);
		win.close();
	})
}

