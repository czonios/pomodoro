/**
 * timer.js
 * is the timer logic.
 * It is an object holding the necessary functions and variables to
 * start, pause, continue, and initialize the clock.
 */

let deadline;
let timeInterval;

const timer = {

    /**
    * initializeClock() creates the time interval
    * and runs updateClock()
    */
    initializeClock: function(deadline) {

        /**
         * updateClock() is the function run in
         * every interval. It gets the remaining time,
         * runs display(), and checks the state to see
         * if it needs to stop the intervals, plays a sound if
         * the session is done, and handles long break every 4 
         * pomodoros.
         */
        function updateClock() {
            let time = timer.getRemainingTime()

            display(time);

            // if the timer is running, reduce remaining time by 1 second
            if (pom.state != "pauseWork" && pom.state != "pauseBreak")
                pom.durations.remainingTime--
            else // if paused, stop the intervals
                clearInterval(timeInterval)

            // check if the current session is over	
            if (time <= 0) {
                // play a bell sound
                pom.bell.play()

                // stop the intervals
                clearInterval(timeInterval)

                // check which session we are at
                if (pom.state === "work") { // if we were on a work session,
                    //increment completed pomodoro counter
                    pom.completedCount++;
                    // long break if counter is multiple of 4
                    if (pom.completedCount % 4 === 0)
                        pom.durations.remainingTime = pom.durations.longBreakTime * 60;
                    else // if not, normal break
                        pom.durations.remainingTime = pom.durations.breakTime * 60;

                    // update pomodoro count
                    $("#counter").text("Completed Pomodoros: " + pom.completedCount);

                    // change state to break and start the break timer
                    pom.state = "break";
                    timer.startBreak();
                }
                else { // if we were on a break
                    // update remaining time, change state and start work timer
                    pom.durations.remainingTime = pom.durations.workTime * 60;
                    pom.state = "work";
                    timer.startWork();
                }
            }
        }

        // runs updateClock in intervals of 1 sec
  	    updateClock();
  	    timeInterval = setInterval(updateClock, 1000);
    },

    /**
    * getRemainingTime returns the remaining time
    * in a usable format (ms)
    */
    getRemainingTime: function() {

        let time = pom.durations.remainingTime * 1000;
        return time;
    },

    /**
    * start() starts the work timer.
    */
    startWork: function () {
        // clear interval if already running
        clearInterval(timeInterval);
        // get an absolute date based on remaining time
        deadline = new Date(Date.parse(new Date()) + pom.durations.remainingTime * 1000);
        // change state and timer background color
        pom.state = "work";
        pom.colors.bgColor = pom.colors.bgGreen;
        // start the intervals for the work session
        timer.initializeClock(deadline);
    },

    /**
    * startBreak() starts the break timer.
    */
    startBreak: function () {
        // clear interval if already running
        clearInterval(timeInterval);
        // get an absolute date based on remaining time
        deadline = new Date(Date.parse(new Date()) + pom.durations.remainingTime * 1000);
        // change state and timer background color
        pom.state = "break";
        pom.colors.bgColor = pom.colors.bgRed;
        // start the intervals for the break session
        timer.initializeClock(deadline);
    },

    /**
    * pause() stops the work timer intervals and "freezes" time
    */
    pauseWork: function () {
        let time  = timer.getRemainingTime();
        clearInterval(timeInterval);
        pom.state = "pauseWork";

        display(time);
    },

    /**
    * pauseBreak() stops the break timer intervals and "freezes" time
    */
    pauseBreak: function () {
        let time  = timer.getRemainingTime();
        clearInterval(timeInterval);
        pom.state = "pauseBreak";

        display(time);
    }

}