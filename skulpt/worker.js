try {
    import("./skulpt.min.js");
    import("./skulpt-stdlib.js");
} catch (exception) {
    console.log(exception);
}

import Sk from "./skulpt.min.js"
//const Sk = require("./skulpt.min.js")
var externalLibs = {
    "./numpy/__init__.js": "https://cdn.jsdelivr.net/gh/ebertmi/skulpt_numpy@master/numpy/__init__.js"
};

var SuccessfulOutput = false

function builtinRead(file) {
    if (externalLibs[file] !== undefined) {
        return Sk.misceval.promiseToSuspension(
            fetch(externalLibs[file]).then(
                function (resp) {
                    console.log(resp)
                    return resp.text();
                }
            ));
    }

    if (Sk.builtinFiles === undefined || Sk.builtinFiles.files[file] === undefined) {
        throw "File not found: '" + file + "'";
    }

    return Sk.builtinFiles.files[file];
}

function outf(text) {
    const mypre = document.getElementById("output");
    if (/^\s*$/.test(text)) return
    mypre.innerHTML = text;
    mypre.innerHTML = mypre.innerHTML + text;
    // mypre.innerHTML = text;
}

function runIt(pythonCode, finalCode) {
    document.getElementById("output").innerHTML = "";
    Sk.pre = "output";
    // Sk.configure({ output: outf, read: builtinRead, __future__: Sk.python3, });
    Sk.configure({
        inputfun: function (prompt) {
            return window.prompt(prompt);
        },
        inputfunTakesPrompt: true,
        output: outf,
        read: builtinRead,
        // retainglobals: true,
        __future__: Sk.python3,
    });
    (Sk.TurtleGraphics || (Sk.TurtleGraphics = {})).target = 'circle';
    var myPromise = Sk.misceval.asyncToPromise(function () {
        Sk.TurtleGraphics.width = (document.getElementById('circle')?.clientWidth);
        Sk.TurtleGraphics.height = (document.getElementById('circle')?.clientHeight + 50);
        return Sk.importMainWithBody("<stdin>", false, pythonCode, true);
    });
    myPromise.then(
        function (mod) {

            // finalCode = finalCode.join('');
            if (pythonCode == finalCode) {
                SuccessfulOutput = true
            }

            //console.log(Sk.ffi.remapToJs(Sk.globals["phase"]));
        },
        function (err) {
            console.log(err.toString());
            // return Sk.importMainWithBody("<stdin>", false, err.toString(), true);
            outf(err.toString());
            return (err.toString());
        }

    );

}

/* function handleMessage(event) {
    const action = event.data.action,
        messageId = event.data.messageId,
        params = event.data.params,
        data = runIt(params);
    return {
        data: data,
        messageId: messageId
    };
}*/

function completedFlag() {
    return SuccessfulOutput;
}

export { runIt, completedFlag }
