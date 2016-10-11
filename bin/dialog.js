#!/usr/bin/env node

function abort(msg) {
  console.log(msg) || process.exit(1);
}

if (!process.argv[3])
  abort("Usage: show_dialog [err|info|warn] [message]")

var dialog  = require('./..'),
    type    = process.argv[2],
    message = process.argv.slice(3).join(' ');

if (!dialog[type])
  return abort("Unknown message type: " + type);

dialog[type](message, function(err) {
  if (err) console.log(err.message.trim());
});
