// export default  {}

//module.exports = {

//export default Pomodoro = {

const pom = {

    // State of the clock initialized to nothing
    state: "",

    // Bell sound
    bell: document.getElementById("bell"),

    // Durations initialized to default values
    durations: {
        workTime: 25,
        breakTime: 5,
        longBreakTime: 15,
        remainingTime: 25 * 60
    },

    // Completed pomodori counter initialized to 0
    completedCount: 0,

    // Colors for timer filling
    colors: {
        bgColor: "#7CB342",
        bgGreen: "#7CB342",
        bgRed: "#f44336"
    }

}
