/**
 * index.js
 * is the controller script. 
 * Button presses and clicks are controlled here.
 */

/**
 * toggle() runs when the timer is clicked.
 * It checks the current pom.state, changes it,
 *and runs the appropriate function.
 */
function toggle() {
	
	switch(pom.state) {
		case "work":
			pom.state = "pauseWork";
			timer.pauseWork();
			break;
		case "pauseWork":
			pom.state = "work";
			timer.startWork();
			break;
		case "break":
			pom.state = "pauseBreak";
			timer.pauseBreak();
			break;
		case "pauseBreak":
			pom.state = "break";
			timer.startBreak();
			break;
		default:
			pom.durations.remainingTime = pom.durations.workTime * 60;
			timer.startWork();
				}
}

// this is ran when page is loaded.
$(document).ready(function() {
	
	// when timer is clicked, change pom.state
	$(".filler").click(function(){
		toggle();
	});
	
	// add a minute to work session default & remaining time
	$(".work-plus").click(function(){
		
		if (pom.state == "" || pom.state == "pauseWork" || pom.state == "pauseBreak") {
			pom.durations.workTime++;
			if (pom.state == "pauseWork")
				pom.durations.remainingTime += 60;

			timer.deadline = new Date(Date.parse(new Date()) + pom.durations.remainingTime * 1000);

			let time  = timer.getRemainingTime();
			display(time);
		}
	});
	
	// subtract a minute from work session default & remaining time
	$(".work-minus").click(function(){
		
		if (pom.state == "pauseWork" ){
			if (pom.durations.remainingTime > 60 && pom.durations.workTime > 1) {
				pom.durations.workTime--;
				pom.durations.remainingTime -= 60;

				timer.deadline = new Date(Date.parse(new Date()) + pom.durations.remainingTime * 1000);

				let time  = timer.getRemainingTime();
				display(time);
			}
		}
		else if (pom.state == "" || pom.state == "pauseBreak") {
			if (pom.durations.workTime > 1) {
				pom.durations.workTime--;

				timer.deadline = new Date(Date.parse(new Date()) + pom.durations.remainingTime * 1000);

				let time  = timer.getRemainingTime();
				display(time);
			}
		}



	});
	
	// add a minute to break session default & remaining time
	$(".break-plus").click(function(){

		if (pom.state == "" || pom.state == "pauseWork" || pom.state == "pauseBreak") {
			pom.durations.breakTime++;
			if (pom.state == "pauseBreak")
				pom.durations.remainingTime += 60;

			timer.deadline = new Date(Date.parse(new Date()) + pom.durations.remainingTime * 1000);

			let time  = timer.getRemainingTime();
			display(time);
		}
	});
	
	// subtract a minute from break session default & remaining time
	$(".break-minus").click(function(){

		if (pom.state == "pauseBreak" ){
			if (pom.durations.remainingTime > 60 && pom.durations.breakTime > 1) {
				pom.durations.breakTime--;
				pom.durations.remainingTime -= 60;

				timer.deadline = new Date(Date.parse(new Date()) + pom.durations.remainingTime * 1000);

				let time  = timer.getRemainingTime();
				display(time);
			}
		}
		else if (pom.state == "" || pom.state == "pauseWork") {
			if (pom.durations.breakTime > 1) {
				pom.durations.breakTime--;

				timer.deadline = new Date(Date.parse(new Date()) + pom.durations.remainingTime * 1000);

				let time  = timer.getRemainingTime();
				display(time);
			}
		}
	});
	
	// add a minute to long break session default & remaining time
	$(".long-break-plus").click(function(){
		if (pom.state == "" || pom.state == "pauseWork" || pom.state == "pauseBreak") {
			pom.durations.longBreakTime++;
			if (pom.state == "pauseBreak" && pom.completedCount % 4 == 0)
				pom.durations.remainingTime += 60;

			timer.deadline = new Date(Date.parse(new Date()) + pom.durations.remainingTime * 1000);

			let time  = timer.getRemainingTime();
			display(time);
		}
	});
	
	// subtract a minute from long break session default & remaining time
	$(".long-break-minus").click(function(){
		if (pom.durations.remainingTime > 61 && pom.durations.longBreakTime > 1 && (pom.state == "" || pom.state == "pauseWork" || pom.state == "pauseBreak")) {
			pom.durations.longBreakTime--;
			if (pom.state == "pauseBreak" && pom.completedCount % 4 == 0)
				pom.durations.remainingTime -= 60;

			timer.deadline = new Date(Date.parse(new Date()) + pom.durations.remainingTime * 1000);

			let time  = timer.getRemainingTime();
			display(time);
		}
	});
	
	$(".reset").click(function() {
        clearInterval(timer.timeInterval);
		pom.durations.remainingTime = pom.durations.workTime * 60;
		pom.state = "";
		pom.colors.bgColor = pom.colors.bgGreen;
		
		let time  = timer.getRemainingTime();
		display(time);
	});
	
	
	
});