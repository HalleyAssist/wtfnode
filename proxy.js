#!/usr/bin/env node

'use strict';

// When binding a SIGINT handler, Node will no longer be able to exit infinite loops
// To counteract this, we spawn the "wtf'ed" module as a child and create a provision
// to kill the process if it's unresponsive (double Ctrl+C)

var cp = require('child_process');
var PATH = require('path');

var child = cp.fork(PATH.join(__dirname, 'index.js'), process.argv.slice(2), {
    cwd: process.cwd(),
    env: process.env
});

var count = 0;
process.on('SIGINT', function () {
    console.log("WTFNODE received SIGNINT")
    count++;
    if (count > 1) {
        console.error('Forcefully terminating, unable to gather process info');
        child.kill();
        process.exit(1);
    }
});
process.on('SIGUSR2', function () {
    console.log("WTFNODE received SIGUSR2")
    child.kill('SIGUSR2');
    count++;
    if (count > 1) {
        console.error('Forcefully terminating, unable to gather process info');
        child.kill();
        process.exit(1);
    }
});
child.on('exit', function(code){
    setTimeout(function(){
        process.exit(code);
    }, 1)
})
