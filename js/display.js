//import {Pomodoro as pom} from './pomodoro'

//const pom = require('./pomodoro');
/**
* formatTime() returns a string with the remaining
* time in a nice printable format.
*/
function formatTime(time) {
    let timeStr = "";
    // calculate seconds, minutes and hours left.
    let s = Math.floor((time / 1000) % 60);
    let m = Math.floor((time / 1000 / 60) % 60);
    let h = Math.floor((time / (1000 * 60 * 60)) % 24);
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


//module.exports = {

//export default Display = {

    /**
    * display() does all the visual work
    * change numbers, show remaining time,
    * change filling% depending on remaining time
    * and change color depending on session.
    */
    function display(time) {

        time = formatTime(time);

        // calculate % of elapsed time
        let percentage;
        if (pom.state === "work" || pom.state === "pauseWork")
            percentage = (((pom.durations.workTime * 60) - pom.durations.remainingTime) / (pom.durations.workTime * 60) * 100);
        else if ((pom.completedCount % 4 === 0) && (pom.state === "break" || pom.state === "pauseBreak"))
            percentage = (((pom.durations.longBreakTime * 60) - pom.durations.remainingTime) / (pom.durations.longBreakTime * 60) * 100);
        else if (pom.state === "break" || pom.state === "pauseBreak")
            percentage = (((pom.durations.breakTime * 60) - pom.durations.remainingTime) / (pom.durations.breakTime * 60) * 100);
        else
            percentage = 0;

        // fill timer background based on % of elapsed time and session.
        $(".filler").css({ background: "linear-gradient(to top, " + pom.colors.bgColor + " " + percentage + "%,transparent " + percentage + "%,transparent 100%)" });
        $(".pomodoro").css({ border: "3px " + pom.colors.bgColor + " solid" });

        // update work time and break time (no change if no '+' or '-' clicked)
        $(".work-time").text(pom.durations.workTime);
        $(".break-time").text(pom.durations.breakTime);
        $(".long-break-time").text(pom.durations.longBreakTime);

        // Create string with HTML depending on pom.state and time remaining
        // and update page title according to session/timer pom.state
        let str;
        switch (pom.state) {
            case "work":
                $(".title").text(time + " - Work");
                str = "<h1>Work</h1><br><h2>" + time + "</h2>";
                break;
            case "pauseWork":
                $(".title").text(time + " - Paused (Work)");
                str = "<h1>Unpause</h1><br><h2>" + time + "</h2>";
                break;
            case "break":
                $(".title").text(time + " - Break");
                if (pom.completedCount % 4 == 0)
                    str = "<h1>Long Break</h1><br><h2>" + time + "</h2>";
                else
                    str = "<h1>Break</h1><br><h2>" + time + "</h2>";
                break;
            case "pauseBreak":
                $(".title").text(time + " - Paused (Break)");
                str = "<h1>Unpause</h1><br><h2>" + time + "</h2>";
                break;
            default:
                str = "<h1>Start</h1><br><h2>" + pom.durations.workTime + ":00</h2>";
        }
        // display the string in HTML
        $(".filler").html(str);

    }
//}