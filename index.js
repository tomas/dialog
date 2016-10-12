/*
 By Tomas Pollak <tomas@forkhq.com>.
 MIT License.
*/

var join  = require('path').join,
    spawn = require('child_process').spawn;

var Dialog = module.exports = {

  err: function(str, title, callback) {
    this.show('error', str, title, callback);
  },

  info: function(str, title, callback) {
    this.show('info', str, title, callback);
  },

  warn: function(str, title, callback) {
    this.show('warning', str, title, callback);
  },

  show: function(type, str, title, callback) {
    if (!str || str.trim() == '')
      throw new Error('Empty or no string passed!');

    if (typeof title == 'function') {
      callback = title;
      title = null;
    }

    var cmd     = [],
        os_name = process.platform,
        title   = title ? title : 'Important';

    var str = (str + '').replace(/([.?*+^$[\]\\(){}<>|`-])/g, "\$1");

    if (os_name == 'linux') {

      str = str.replace(/[<>]/g, '');
      cmd.push('zenity');
      cmd.push('--' + type);
      cmd.push('--text') && cmd.push(str);
      cmd.push('--title') && cmd.push(title);
      if (str.length > 30) cmd.push('--width') && cmd.push('300');

    } else if (os_name == 'darwin') {
      // Set dialog icon
      switch (type) {
        case 'error':
          type = 0;
          break;
        case 'info':
          type = 1;
          break;
        case 'warning':
          type = 2;
          break;
        default:
          type = '';
      }

      str = str.replace(/"/g, "'"); // double quotes to single quotes
      cmd.push('osascript') && cmd.push('-e');
      var script = 'tell app \"System Events\" to display dialog ';
      script += '\"' + str + '\" with title \"' + title + '\" buttons \"OK\"';
      script += ' with icon ' + type;
      cmd.push(script);

    } else {
      // Set MsgBox icon
      switch (type) {
        case 'error':
          type = 16;
          break;
        case 'info':
          type = 64;
          break;
        case 'warning':
          type = 48;
          break;
        default:
          type = 0;
      }

      // msgbox.vbs script from http://stackoverflow.com/questions/774175
      cmd.push('cscript');
      cmd.push(join(__dirname, 'msgbox.vbs'));
      cmd.push(str) && cmd.push(type) && cmd.push(title);

    }

    this.run(cmd, callback);

  },

  run: function(cmd, cb) {
    var bin    = cmd[0],
        args   = cmd.splice(1),
        stdout = '',
        stderr = '';

    var child = spawn(bin, args);

    child.stdout.on('data', function(data) {
      stdout += data.toString();
    })

    child.stderr.on('data', function(data) {
      stderr += data.toString();
    })

    child.on('exit', function(code) {
      cb && cb(code, stdout, stderr);
    })
  }

}
