"use strict";

function test() {
    var a = "sda";
}
(function () {
    var _console;

    console.log("test function");
    var arr = ["1", "b", "c"];

    (_console = console).log.apply(_console, arr);
})();