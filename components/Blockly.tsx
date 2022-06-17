import React, { useEffect, useState } from "react";
import { BlocklyWorkspace } from "react-blockly";

import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";
import "./toolbox";
import zolo from "../theme/zolo";

export default function BlocklyContainer(props) {
    let block = {
        blocks: {
            kind: "", name: "", colour: "", contents: [
                { kind: "", contents: [] }
            ]
        }
    }

    try {
        block = require(`../game/${props.slug}/Blocks`);
    } catch (err) {
        console.log(err)
    }

    const toolboxCategories = block.blocks
    const mathBlock = {
        kind: "CATEGORY",
        contents: [{ kind: "BLOCK", blockxml: "", type: "math_number" },],
        name: "Math",
        colour: "%{BKY_LOOPS_HUE}",
    };


    if (!JSON.stringify(toolboxCategories.contents).includes(JSON.stringify(mathBlock))) {
        // console.log("Math Block doesn't exists");
        toolboxCategories.contents.push(mathBlock)
    }


    const [setXml] = useState(null);
    const initialXml = '<xml xmlns="http://www.w3.org/1999/xhtml"></xml>';

    useEffect(() => {
        props.childFunc.current = setBlocks
    }, [])

    function setBlocks(xml: string) {
        const xml1 = Blockly.Xml.textToDom(xml);
        Blockly.getMainWorkspace().clear();
        Blockly.Xml.domToWorkspace(xml1, Blockly.getMainWorkspace());
    }

    function workspaceDidChange(workspace: Blockly.Workspace) {
        const tool = Blockly.utils.toolbox;
        // console.log(workspace.toolbox)
        const Pycode: string = (Blockly as any).Python.workspaceToCode(workspace);
        // const Jscode: string = (Blockly as any).JavaScript.workspaceToCode(
        //   workspace
        // );
        props.setPythonCode(Pycode);
        // props.setJavaScript(Jscode);
    }

    return (
        <BlocklyWorkspace
            toolboxConfiguration={toolboxCategories}
            initialXml={initialXml}
            className="fill-height"
            workspaceConfiguration={{
                horizontalLayout: true,
                media: "../media/",
                grid: false,
                trashcan: true,
                zoom: {
                    controls: true,
                    wheel: true,
                    startScale: 1.0,
                    maxScale: 3,
                    minScale: 0.3,
                    scaleSpeed: 1.2,
                    pinch: true,
                },
                move: {
                    scrollbars: {
                        horizontal: false,
                        vertical: true
                    },
                    drag: true, wheel: false
                },
                renderer: "zelos",

                theme: zolo,
            }}
            onWorkspaceChange={workspaceDidChange}
            onXmlChange={setXml}
        />
    );
}
