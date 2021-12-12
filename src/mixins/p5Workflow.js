export default {
    methods: {
        //
        // Parse code, and create new p5 sketch
        //
        runCode() {
            // console.log("Safe to remove runCode()")
        },
        //
        // Parses the users code, and adds some custom features
        // - reroutes console log to DOM
        // - adds try / catch statements
        //
        // TODO(Anna):
        // - Bug: if an error occurs in the setup, the canvas is not
        //        re-rendered after the error is fixed
        // - Featuer (nice-to-have): Dark/light illuminationsPreview overlay in p5
        //
        //
        // Reroute / restore console
        //
        rerouteConsole() {
            const logs = this.logs;
            (window.console.log = function (msg) {
                const previous = logs[logs.length - 1] || {
                    type: '',
                    msg: '',
                    n: 0
                }
                if (msg !== previous.msg) {
                    logs.push({msg: msg, type: 'log', n: 0})
                } else {
                    previous.n += 1
                }

            }),
                (window.console.error = function (msg) {
                    logs.push({msg: msg, type: 'err', n: 0});
                })
        },
        restoreConsole() {
            window.console.log = this.consoleLogBasic
            window.console.error = this.consoleErrorBasic
        }
    }
}
