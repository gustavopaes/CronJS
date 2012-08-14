/**
 * @author Gustavo Paes <gustavo.paes@gmail.com>
 * @description Uma simples lib para gerenciar TimeOut e TimeInterval.
 * @version 1.0
 * @ToDo: - pause() function
 *        - validar se "execute" já existir no window, criar com nome CronJS. Ago como noConflict().
 */
(function () {
	var execute = {},
		time_convertion = {
			"milliseconds" : 1,
			"seconds"      : 1000,
			"minutes"      : 60000,
			"hours"        : 3600000,
			"days"         : 86400000
		};

	function cron(time, execute, every) {
		this.stop = function() {
			if(this.id && (every && clearInterval(this.id) || clearTimeout(this.id)) || false) {
				this.stopped = +new Date();
				this.id = null;
			}
		}

		this.play = function () {
			return (this.id = (!this.is_running && (every && setInterval(this.execute, this.time) || setTimeout(this.execute, this.time)) || this.id));
		}

		this.execute = execute;
		this.time = time;
		this.started_at = +new Date();
		this.stopped_at = 0;
		this.is_running = false;
		this.id = this.play();

		return this;
	}

	function getTime(expression) {
		var matches = expression.match(/(\d+)( (\w+))?/);
		return +matches[1] * ( time_convertion[matches[3] || "milliseconds"] );
	};

	execute.every = function (time, execute) {
		return new cron( getTime(time), execute, true);
	};

	execute.after = function (time, execute) {
		return new cron( getTime(time), execute, false);
	}

	if(!window.execute) {
		window.execute = execute;
	}
}());
