//import "shepherd.js/dist/css/shepherd.css";
import React, { useEffect } from "react";
import { new_script } from "./helpers/scriptLoader"
import $ from 'jquery';
//import draggable from 'jquery-ui/ui/widgets/draggable';
import Blockly from "blockly";

import "blockly/python";
import "blockly/javascript";
let demoWorkspace = Blockly.getMainWorkspace();
function CustomTour({ slug }) {

    useEffect(() => {
        (async () => {
            await new_script("../shepherd.min.js");
            // await new_script("../jquery.min.js");
            // await new_script("../jquery-ui.js");
            // await new_script("../jquery.ui.touch-punch.js");
            // await new_script("../materialize.min.js");

            try {
                await import(`../shepherd/${slug}_shepherd.js`)
                await import("../tutorial/tutorial1");
            } catch (err) {
                return null;
            }
            // window["workspaces"] = [];
            // window["update_rescue_workspace"] = (i) => {
            //     var xml = Blockly.Xml.textToDom(window["workspaces"][i]);
            //     demoWorkspace.clear();
            //     Blockly.Xml.domToWorkspace(xml, demoWorkspace);
            //     $('#undo_btn').css('display', 'inline-block');
            //     window["rescued"] = true;
            // }
            window["amber_ref"] = () => {
                $("#amber_ref").toggle("slow");
                $("#amber_ref" + "_btn").toggle();
            }
        })()
    }, [slug]);


    return (<> </>);
}

export default CustomTour;
