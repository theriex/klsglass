/*jslint node, white */

var picc = (function () {
    "use strict";

    const fs = require("fs");
    const psrc = "../../../../../inbound/Photos";
    const pdst = "../docroot/gpics/";
    const picjspath = "../docroot/js/picfiles.js";
    const writeopt = {encoding: "utf8"};
    var filenames = [];


    function writePicFilenamesJS () {
        filenames.sort().reverse();
        const js = "var picfiles = [" + filenames.join(",") + "];\n";
        fs.writeFileSync(picjspath, js, writeopt);
    }
        

    function processTree(path) {
        const dirlist = fs.readdirSync(path);
        console.log("processTree: " + path);
        dirlist.forEach(function (pname) {
            const filepath = path + "/" + pname;
            const pstat = fs.statSync(filepath);
            if(pstat.isDirectory()) {
                return processTree(filepath); }
            if(pname.indexOf("_kga") > 0) {
                filenames.push("\"" + pname + "\"");
                fs.copyFileSync(filepath, pdst + pname); } });
    }

    return {
        run: function () { 
            processTree(psrc);
            writePicFilenamesJS(); }
    };
}());

picc.run();
