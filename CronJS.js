/**
 * @author Gustavo Paes <gpaes@uolinc.com>
 * @description Uma simples lib para gerenciar TimeOut e TimeInterval.
 * @site http://github.com/gustavopaes/CronJS
 * @version 1.1
 * @changes
 *  1.1 => correção na flag is_running (nunca era definida como false)
 *      => criado objeto onde todos os crons criados são armazenados;
 *         quando o cron é executado, esse registro é removido.
 *      => criado métodos exists() e total() para exibir os crons ativos
 */
(function (win) {
	var execute = {},
		time_convertion = {
			"milliseconds" : 1,
			"seconds"      : 1000,
			"minutes"      : 60000,
			"hours"        : 3600000,
			"days"         : 86400000
		};

	var crons = {};

	function cron(time, execute, every) {
		this.stop = function() {
			if(this.id && this.is_running) {
				every && clearInterval(this.id) || clearTimeout(this.id);
				this.stopped    = +new Date();
				this.is_running = false;
				this.id         = null;

				delete crons[this.id];

				return true;
			}
			return false;
		}

		this.cancel = this.stop;

		this.play = function (time) {
			// remove o id antigo
			if(this.id) {
				delete crons[this.id];
			}

			this.time = time || this.time;
			this.id = (this.is_running == false && (this.is_running = true) && (every && setInterval(this.execute, this.time) || setTimeout(this.execute, this.time)) || this.id);

			crons[this.id] = this;

			return this.id;
		}

		this.execute = (function(self) {
			return function() {
				delete crons[self.id];
				execute();
			}
		}(this));

		this.every      = every;
		this.original   = execute;
		this.time       = time;
		this.started_at = +new Date();
		this.stopped_at = 0;
		this.is_running = false;
		this.id         = this.play();

		crons[this.id] = this;

		return this;
	}

	function getTime(expression) {
		if(typeof expression == "string") {
			var matches = expression.match(/(\d+)( (\w+))?/);
			return +matches[1] * ( time_convertion[matches[3] || "milliseconds"] );
		}

		return expression;
	};

	execute.every = function (time, execute) {
		return new cron( getTime(time), execute, true);
	};

	execute.after = function (time, execute) {
		return new cron( getTime(time), execute, false);
	}

	execute.total = function(total) {
		var n = 0;
		for(var c in crons)
			total && n++ || crons[c].is_running && n++;

		return n;
	}

	execute.exists = function() {
		return crons;
	}

	if(!win.execute) {
		win.execute = execute;
	}
}(window));