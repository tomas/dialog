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

    // return codes for zenity are 0 on "OK" 
    // and 1 on "No/Cancel" or close window
    if (os_name == 'linux') {

      str = str.replace(/[<>]/g, '');
      cmd.push('zenity');
      cmd.push('--' + type);
      cmd.push('--text') && cmd.push(str);
      cmd.push('--title') && cmd.push(title);
      if (str.length > 30) cmd.push('--width') && cmd.push('300');

    // return codes in macOS are exactly as in Linux
    // 0 for 'OK', 1 for 'Cancel'
    } else if (os_name == 'darwin') {
      
      switch (type) { // Set dialog icon
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

    } else { // windows

      // return codes for Windows (default value minus 1)
      // defaults in https://www.tutorialspoint.com/vbscript/vbscript_dialog_boxes.htm

      // 0 - vbOK
      // 1 - vbCancel
      // 2 - vbAbort
      // 3 - vbRetry
      // 4 - vbIgnore
      // 5 - vbYes
      // 6 - vbNo
     
      switch (type) { // Set MsgBox icon
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

      str = str.replace(/"/g, "'"); // double quotes to single quotes
     
      // msgbox.vbs script from http://stackoverflow.com/questions/774175
      cmd.push('cscript');
      cmd.push(join(__dirname, 'msgbox.vbs'));
      cmd.push(str) && cmd.push(type) && cmd.push(title);

    }

    this.run(cmd, callback);

  },

  custom: function(str, title, buttons, defaultAnswer, icon, callback) {
    
    //defaultAnswer is used to accept text input from user. If it is empty, the dialog will not have an input text field.
    //buttons is a string with brackets. Example: buttons = '{"No", "Maybe", "OK"}' 
    //Maximum 3 buttons.
    //icon is 'note' by default.
    
    if(process.platform != 'darwin')
      throw new Error('This platform is not supported yet!'); //Not yet explored on non macOS devices

    if (!str || str.trim() == '')
      throw new Error('Empty or no string passed!');

    if (typeof title == 'function') {
      callback = title;
      title = null;
    }

    if(!buttons || buttons.trim() == 0)
      buttons='{"OK"}';
    
    if(!icon || icon.trim() == 0)
      icon='note';

    var cmd     = [],
      os_name = process.platform,
      title   = title ? title : 'Important';
  
    str = str.replace(/"/g, "'"); // double quotes to single quotes
    defaultAnswer = defaultAnswer.replace(/"/g, "'"); // double quotes to single quotes
    
    cmd.push('osascript') && cmd.push('-e');
    var script = 'tell app \"System Events\" '
    
    if(defaultAnswer)
      script += 'to set resp '    //to get the user's text input
      
    script += 'to display dialog \"' + str + '\"';
    
    if(defaultAnswer || defaultAnswer.trim() != 0)
      script += ' default answer \"' + defaultAnswer + '\"';
    
    script += ' with title \"' + title + '\" buttons ' + buttons;

    script += ' with icon ' + icon;
    console.log(script);
    cmd.push(script);
    console.log('\n' + cmd);
    this.run(cmd, callback)
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
