/*
 * app/sysinfo.js
 */

 const child_process = require('child_process');

var proc_loadavg = child_process.execSync('cat /proc/loadavg').toString('ascii');
var [load_avg_1, load_avg_5, load_avg_10] = proc_loadavg.split(' ');

module.exports = {
    load_avg_1:  load_avg_1,
    load_avg_5:  load_avg_5,
    load_avg_10: load_avg_10
}