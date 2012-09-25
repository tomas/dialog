Dialog
======

Simple wrapper around zenity, osascript and vbscript that lets you
show native alert dialogs on Linux, OSX and Windows, respectively.

Example
-----

``` js
var dialog = require('dialog');

dialog.info('Hello there');
```

Usage
-------

To show a generic info dialog:

``` js
dialog.info(msg, title, callback);

// example, setting title
dialog.info('Ground control to major Tom.', 'My app', function(err){
	if (!err) console.log('User clicked OK');
})
```

To show a warning dialog:

``` js
dialog.warn(msg, title, callback);

// example, without setting title
dialog.warn('This computer will autoterminate itself in 5 seconds.', function(err){
	if (!err) console.log('User clicked OK');
})
```

Both `title` and `callback` are optional. Default title shown is "Important".

Credits
-------
Written by Tomás Pollak, except for the MsgBox script which was written by
[StackOverflow user boflynn](http://stackoverflow.com/a/774197).

Copyright
---------
(c) 2012 Fork Ltd. MIT license.
