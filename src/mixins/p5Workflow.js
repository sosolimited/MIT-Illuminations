export default {
    methods: {
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
