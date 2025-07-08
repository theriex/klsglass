/*global jtminjsDecorateWithUtilities, picfiles */
/*jslint browser, white, unordered */

var app = {};
var jt = {};

(function () {
    "use strict";

    //Sometimes there's a significant lag loading the fonts, and if
    //that happens the index page should not be waiting to display
    //because that just makes the whole site look slow. To avoid that
    //lag, load the fonts last.  If the fonts load fast, the update
    //will be imperceptible.  If they load slow then at least the
    //content will be available to read in the meantime.
    function addFontSupport () {
        var fontlink = document.createElement("link");
        fontlink.href = "http://fonts.googleapis.com/css?family=Asap";
        fontlink.rel = "stylesheet";
        fontlink.type = "text/css";
        document.getElementsByTagName("head")[0].appendChild(fontlink);
    }


    function filterSelectedPicTypes () {
        var pfs = picfiles;
        const gtypes = [{t:"Stained", v:"s", c:true},
                       {t:"Blown", v:"b", c:true},
                       {t:"Fused", v:"f", c:true}];
        if(!jt.byId("sgtcb")) {
            jt.out("pictypeseldiv", jt.tac2html(gtypes.map((gt) =>
                jt.tac2html([["input", {type:"checkbox", id:gt.v + "gtcb",
                                        cla:"gtcbi", checked:jt.toru(gt.c),
                                        onclick:"app.displayPics()"}],
                             ["label", {fo:gt.v + "gtcb"}, gt.t]])))); }
        gtypes.forEach(function (gt) {
            if(!jt.byId(gt.v + "gtcb").checked) {
                pfs = pfs.filter((nm) => nm.indexOf("kga" + gt.v) < 0); } });
        return pfs;
    }


    function displaySelectedPics (pps) {
        const pdiv = jt.byId("picsdispdiv");
        pdiv.innerHTML = "";
        pps.forEach(function (filename, idx) {
            var pd = document.createElement("div");
            pd.className = "artpiecediv";
            pd.innerHTML = jt.tac2html(
                ["img", {cla:"smallimg", src:"gpics/" + filename,
                         id:"glasspic" + idx,
                         onclick:jt.fs("app.togImgSize(" + idx + ")")}]);
            pdiv.appendChild(pd); });
    }


    ////////////////////////////////////////
    // app inteface methods
    ////////////////////////////////////////

    app.displayPics = function () {
        if(!jt.byId("picsdiv")) {
            jt.out("contentdiv", jt.tac2html(
                ["div", {id:"picsdiv"},
                 [["div", {id:"pictypeseldiv"}],
                  ["div", {id:"picsdispdiv"}]]])); }
        const picfiles = filterSelectedPicTypes();
        displaySelectedPics(picfiles);
    };

    app.togImgSize = function (idx) {
        const gp = jt.byId("glasspic" + idx);
        if(gp.className === "smallimg") {
            gp.className = "largeimg"; }
        else {
            gp.className = "smallimg"; }
    };

    app.init = function () {
        var pobj;
        jtminjsDecorateWithUtilities(jt);
        pobj = jt.paramsToObj(window.location.search, {}, "String");
        jt.log("app params: " + JSON.stringify(pobj));
        app.displayPics();
        addFontSupport();
    };
}());
