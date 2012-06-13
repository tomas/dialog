#!/usr/bin/env node

function abort(msg){
	console.log(msg) || process.exit(1);
}

if(!process.argv[3])
	abort("Usage: show_dialog [info|warn] [message]")

var dialog = require('./..');
var type = process.argv[2];
var message = process.argv.slice(3).join(' ');

if (!dialog[type])
	abort("Unknown message type: " + type);
else
	dialog[type](message, function(err){
		if (err) console.log(err.message.trim());
	});
