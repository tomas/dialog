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
```

To show a warning dialog:

``` js
dialog.warn(msg, title, callback);
```

Title and callback are optional. Default title shown is "Important".

Credits
-------
Written by Tomás Pollak.

Copyright
---------
(c) 2012 Fork Ltd. MIT license.
