var join = require('path').join,
    exec = require('child_process').exec;

var Dialog = module.exports = {

	info: function(str, title, callback){
		this.show('info', str, title, callback);
	},

	warn: function(str, title, callback){
		this.show('warning', str, title, callback);
	},

	show: function(type, str, title, callback){

		if (typeof title == 'function') {
			callback = title;
			title = null;
		}

		var cmd, os_name = process.platform, title = title ? title : 'Important';

		// remove or replace unsupported chars.
		var str = str.replace(/(`|<|>|\|)/g, '').replace(/"/g, '\\"');

		if (os_name == 'linux'){

			var width = str.length > 30 ? "--width 300" : '';
			cmd = 'zenity ' + width  + ' --' + type + ' --text "' + str + '"';
			cmd += ' --title "' + title + '"';

		} else if (os_name == 'darwin'){

			cmd = "osascript -e 'tell app \"System Events\" to display dialog ";
			cmd += '"' + str + '" with title "' + title + '" buttons "OK"';
			cmd += (type == 'warning') ? " with icon 0'" : "'";

		} else {

			// msgbox.vbs script from http://stackoverflow.com/questions/774175
			cmd = 'cscript ' + join(__dirname, 'msgbox.vbs');
			cmd += ' "' + [title, str].join('" "') + '"';

		}

		exec(cmd, callback);

	}

}
