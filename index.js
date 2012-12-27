var join = require('path').join,
    spawn = require('child_process').spawn;

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

    var cmd = [],
        os_name = process.platform,
        title = title ? title : 'Important';

    // remove or replace unsupported chars.
    var str = str.replace(/(`|<|>|\|)/g, '').replace(/"/g, '\\"');

    if (os_name == 'linux'){

      cmd.push('zenity');
      cmd.push('--' + type);
      cmd.push('--text') && cmd.push(str);
      cmd.push('--title') && cmd.push(title);
      if (str.length > 30) cmd.push('--width') && cmd.push('300');

    } else if (os_name == 'darwin'){

      cmd.push('osascript') && cmd.push('-e');
      var script = 'tell app \"System Events\" to display dialog ';
      script += '\"' + str + '\" with title \"' + title + '\" buttons \"OK\"';
      script += (type == 'warning') ? " with icon 0" : "";
      cmd.push(script);

    } else {

      // msgbox.vbs script from http://stackoverflow.com/questions/774175
      cmd.push('cscript');
      cmd.push(join(__dirname, 'msgbox.vbs'));
      cmd.push(title) && cmd.push(str);

    }

    this.run(cmd, callback);

  },

  run: function(cmd, cb){
    var bin = cmd[0];
    var args = cmd.splice(1);
    spawn(bin, args);
  }

}
