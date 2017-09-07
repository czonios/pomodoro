// state of the clock initialized to nothing
var state = "";

// Bell sound
var bell = document.getElementById("bell");


// Default work & break times (may change with plus/minus buttons)
var workTimeDef = 25;
var breakTimeDef = 5;
var longBreakTimeDef = 15;

// Time remaining on clock. Global because many functions use it
// initialized to 25:00
var remainingTime = workTimeDef * 60;

// used to create the timer and set remainingTime
var deadline;

// global so pause() functions etc. can stop auto-updating clock
var timeInterval;

// global to count pomodoros
var count = 0;

// colors for timer filling
var bgColor = "#7CB342";
var bgGreen = "#7CB342";
var bgRed = "#f44336";

/**
 * display() does all the visual work
 * change numbers, show remaining time,
 * change filling% depending on remaining time
 * and change color depending on session.
 */
function display(deadline) {
	var time = formatTime(deadline);
	
	// calculate % of elapsed time
	if (state == "start" || state == "pause")
		var percentage = (((workTimeDef * 60) - remainingTime) / (workTimeDef * 60) * 100);
	else if ((count % 4 == 0) && (state == "break" || state == "pauseBreak"))
		var percentage = (((longBreakTimeDef * 60) - remainingTime) / (longBreakTimeDef * 60) * 100);
	else if (state == "break" || state == "pauseBreak")
		var percentage =(((breakTimeDef * 60) - remainingTime) / (breakTimeDef * 60) * 100);
	else
		percentage = 0;
	
	// fill timer background based on % of elapsed time and session.
	$(".filler").css({background: "linear-gradient(to top, "+bgColor+ " " + percentage+"%,transparent "+percentage+"%,transparent 100%)"});
	$(".pomodoro").css({border: "3px "+bgColor+" solid"});
	
	// update work time and break time (no change if no '+' or '-' clicked)
	$(".work-time").text(workTimeDef);
	$(".break-time").text(breakTimeDef);
	$(".long-break-time").text(longBreakTimeDef);
	
	// Create string with HTML depending on state and time remaining
    // and update page title according to session/timer state
	var str;
	switch(state) {
		case "start":
            $(".title").text(time + " - Work");
			str = "<h1>Work</h1><br><h2>" + time + "</h2>";
			break;
		case "pause":
            $(".title").text(time + " - Paused (Work)");
			str = "<h1>Unpause</h1><br><h2>" + time + "</h2>";
			break;
		case "break":
            $(".title").text(time + " - Break");
			if (count % 4 == 0)
				str = "<h1>Long Break</h1><br><h2>" + time + "</h2>";
			else
				str = "<h1>Break</h1><br><h2>" + time + "</h2>";
			break;
		case "pauseBreak":
            $(".title").text(time + " - Paused (Break)");
			str = "<h1>Unpause</h1><br><h2>" + time + "</h2>";
			break;
		default:
			str = "<h1>Start</h1><br><h2>" + workTimeDef + ":00</h2>";
				}
	// display the string in HTML
	$(".filler").html(str);
    
}

/**
 * toggle() runs when the timer is clicked.
 * It checks the current state, changes it,
 *and runs the appropriate function.
 */
function toggle() {
	
	switch(state) {
		case "start":
			state = "pause";
			pause();
			break;
		case "pause":
			state = "start";
			start();
			break;
		case "break":
			state = "pauseBreak";
			pauseBreak();
			break;
		case "pauseBreak":
			state = "break";
			startBreak();
			break;
		default:
			remainingTime = workTimeDef * 60;
			start();
				}
}

/**
 * getRemainingTime returns the remaining time
 * in a usable format (ms)
 */
function getRemainingTime() {

	var time = remainingTime * 1000;
	return time;
}

/**
 * initializeClock() creates the time interval
 * and runs updateClock()
 */
function initializeClock(deadline) {

	/**
	 * updateClock() is the function run in
	 * every interval. It gets the remaining time,
	 * runs display(), and checks the state to see
	 * if it needs to stop the intervals, plays a sound if
	 * the session is done, and handles long break every 4 
	 * pomodoros.
	 */
  	function updateClock() {
    	var time = getRemainingTime();

    display(deadline);
		
	// if the timer is running, reduce remaining time by 1 second
	if (state != "pause" && state != "pauseBreak")
		remainingTime--;
	else // if paused, stop the intervals
		clearInterval(timeInterval);
	  
	// check if the current session is over	
    if (time <= 0) {
		// play a bell sound
		bell.play()

		// stop the intervals
     	clearInterval(timeInterval);
		
		// check which session we are at
		if (state == "start") { // if we were on a work session,
			//increment completed pomodoro counter
			count++;
			// long break if counter is multiple of 4
			if (count % 4 == 0)
				remainingTime = longBreakTimeDef * 60;
			else // if not, normal break
				remainingTime = breakTimeDef * 60;

			// update pomodoro count
			$("#counter").text("Completed Pomodoros: " + count);
			
			// change state to break and start the break timer
			state = "break";
			startBreak();
		}
		else { // if we were on a break
			// update remaining time, change state and start work timer
			remainingTime = workTimeDef * 60;
			state = "start";
			start();
		}
    }
  }
	
	// runs updateClock in intervals of 1 sec
  	updateClock();
  	timeInterval = setInterval(updateClock, 1000);
}


/**
 * formatTime() returns a string with the remaining
 * time in a nice printable format.
 */
function formatTime(deadline) {
	time = getRemainingTime(deadline);
	var timeStr = "";
	// calculate seconds, minutes and hours left.
    var s = Math.floor((time / 1000) % 60);
  	var m = Math.floor((time / 1000 / 60) % 60);
  	var h = Math.floor((time / (1000 * 60 * 60)) % 24);
	if (h > 0) 
		timeStr += h + ":";
	if (m >= 10)
		timeStr += m + ":";
	else
		timeStr += "0" + m + ":";
	if (s >= 10)
		timeStr += s;
	else
		timeStr += "0" + s;
    
	return timeStr;
  }

/**
 * start() starts the work timer.
 */
function start() {
    // clear interval if already running
    clearInterval(timeInterval);
	// get an absolute date based on remaining time
	deadline = new Date(Date.parse(new Date()) + remainingTime * 1000);
	// change state and timer background color
	state = "start";
	bgColor = bgGreen;
	// start the intervals for the work session
	initializeClock(deadline);
}

/**
 * startBreak() starts the break timer.
 */
function startBreak() {
    // clear interval if already running
    clearInterval(timeInterval);
	// get an absolute date based on remaining time
	deadline = new Date(Date.parse(new Date()) + remainingTime * 1000);
	// change state and timer background color
	state = "break";
	bgColor = bgRed;
	// start the intervals for the break session
	initializeClock(deadline);
	
}

/**
 * pause() stops the work timer intervals and "freezes" time
 */
function pause() {
	clearInterval(timeInterval);
	state = "pause";
	
	display(deadline);
}

/**
 * pause() stops the break timer intervals and "freezes" time
 */
function pauseBreak() {
	clearInterval(timeInterval);
	state = "pauseBreak";
	
	display(deadline);
}


// this is ran when page is loaded.
$(document).ready(function() {
	
	// when timer is clicked, change state
	$(".filler").click(function(){
		toggle();
	});
	
	// add a minute to work session default & remaining time
	$(".work-plus").click(function(){
		
		if (state == "" || state == "pause" || state == "pauseBreak") {
			workTimeDef++;
			if (state == "pause")
				remainingTime += 60;
			deadline = new Date(Date.parse(new Date()) + remainingTime * 1000);
			display(deadline);
		}
	});
	
	// subtract a minute from work session default & remaining time
	$(".work-minus").click(function(){
		
		if (state == "pause" ){
			if (remainingTime > 60 && workTimeDef > 1) {
				workTimeDef--;
				remainingTime -= 60;
				deadline = new Date(Date.parse(new Date()) + remainingTime * 1000);
				display(deadline);
			}
		}
		else if (state == "" || state == "pauseBreak") {
			if (workTimeDef > 1) {
				workTimeDef--;
				deadline = new Date(Date.parse(new Date()) + remainingTime * 1000);
				display(deadline);
			}
		}



	});
	
	// add a minute to break session default & remaining time
	$(".break-plus").click(function(){

		if (state == "" || state == "pause" || state == "pauseBreak") {
			breakTimeDef++;
			if (state == "pauseBreak")
				remainingTime += 60;
			deadline = new Date(Date.parse(new Date()) + remainingTime * 1000);
			display(deadline);
		}
	});
	
	// subtract a minute from break session default & remaining time
	$(".break-minus").click(function(){

		if (state == "pauseBreak" ){
			if (remainingTime > 60 && breakTimeDef > 1) {
				breakTimeDef--;
				remainingTime -= 60;
				deadline = new Date(Date.parse(new Date()) + remainingTime * 1000);
				display(deadline);
			}
		}
		else if (state == "" || state == "pause") {
			if (breakTimeDef > 1) {
				breakTimeDef--;
				deadline = new Date(Date.parse(new Date()) + remainingTime * 1000);
				display(deadline);
			}
		}
	});
	
	// add a minute to long break session default & remaining time
	$(".long-break-plus").click(function(){
		if (state == "" || state == "pause" || state == "pauseBreak") {
			longBreakTimeDef++;
			if (state == "pauseBreak" && count % 4 == 0)
				remainingTime += 60;
			deadline = new Date(Date.parse(new Date()) + remainingTime * 1000);
			display(deadline);
		}
	});
	
	// subtract a minute from long break session default & remaining time
	$(".long-break-minus").click(function(){
		if (remainingTime > 61 && longBreakTimeDef > 1 && (state == "" || state == "pause" || state == "pauseBreak") ) {
			longBreakTimeDef--;
			if (state == "pauseBreak" && count % 4 == 0)
				remainingTime -= 60;
			deadline = new Date(Date.parse(new Date()) + remainingTime * 1000);
			display(deadline);
		}
	});
	
	$(".reset").click(function() {
        clearInterval(timeInterval);
		remainingTime = workTimeDef * 60;
		state = "";
        bgColor = bgGreen;
		display(deadline);
	});
	
	
	
});