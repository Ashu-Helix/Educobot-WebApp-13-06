import React, { useEffect, useState } from "react";
import { BlocklyWorkspace } from "react-blockly";

import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";
import "./toolbox";
import zolo from "../theme/zolo";

export default function BlocklyContainer(props) {
    // const block = require("../public/block/" + props.slug + "_Blocks");
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


    //   {
    //     kind: "CATEGORY",
    //     contents: [{ kind: "BLOCK", blockxml: "", type: "math_number" },],
    //     name: "Math",
    //     colour: "%{BKY_LOOPS_HUE}",
    // },

    const [setXml] = useState(null);
    const initialXml = '<xml xmlns="http://www.w3.org/1999/xhtml"></xml>';

    // const toolboxCategories = {
    //   kind: "categoryToolbox",
    //   collapsed: false,
    //   contents: [
    //     // {
    //     //   kind: "category",
    //     //   name: "Bunny",
    //     //   colour: "#e0006f",
    //     //   contents: [
    //     //     {
    //     //       kind: "block",
    //     //       type: "move",
    //     //       id: 'blockly-3'
    //     //     },
    //     //     {
    //     //       kind: "block",
    //     //       type: "eatcarrot",
    //     //     }]
    //     // },
    //     {
    //       kind: block.blocks.kind,
    //       name: block.blocks.name,
    //       colour: block.blocks.colour,
    //       contents: block.blocks.contents,
    //     },
    //     {
    //       kind: "category",
    //       name: "Logic",
    //       colour: "#006ad6",
    //       contents: [
    //         {
    //           kind: "block",
    //           type: "controls_if",
    //         },
    //         {
    //           kind: "block",
    //           type: "logic_negate",
    //         },
    //       ],
    //     },
    //     {
    //       kind: "category",
    //       name: "Boolean",
    //       colour: "#74caff",
    //       contents: [
    //         {
    //           kind: "block",
    //           type: "logic_compare",
    //         },
    //         {
    //           kind: "block",
    //           type: "logic_operation",
    //         },
    //         {
    //           kind: "block",
    //           type: "logic_boolean",
    //         },
    //       ],
    //     },
    //     {
    //       kind: "category",
    //       name: "Loop",
    //       colour: "#00ef00",
    //       contents: [
    //         {
    //           kind: "block",
    //           type: "controls_whileUntil",
    //         },
    //         {
    //           kind: "block",
    //           type: "controls_for",
    //         },
    //         {
    //           kind: "block",
    //           type: "controls_forEach",
    //         },
    //         {
    //           kind: "block",
    //           type: "controls_repeat",
    //         },
    //         {
    //           kind: "block",
    //           type: "controls_flow_statements",
    //         },
    //       ],
    //     },
    //     {
    //       kind: "category",
    //       name: "Math",
    //       colour: "#5CA65C",
    //       contents: [
    //         {
    //           kind: "block",
    //           type: "math_round",
    //         },
    //         {
    //           kind: "block",
    //           type: "math_number",
    //         },
    //         {
    //           kind: "block",
    //           type: "math_arithmetic",
    //         },
    //         {
    //           kind: "block",
    //           type: "math_single",
    //           //"disabled": "true"
    //         },
    //       ],
    //     },
    //   ],
    // };

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
                zoom: {
                    controls: true,
                    wheel: true,
                    startScale: 1.0,
                    maxScale: 3,
                    minScale: 0.3,
                    scaleSpeed: 1.2,
                    pinch: true,
                },
                move: { scrollbars: { horizontal: false, vertical: true }, drag: true, wheel: false },
                grid: false,
                trashcan: true,
                renderer: "zelos",
                theme: zolo,
            }}
            onWorkspaceChange={workspaceDidChange}
            onXmlChange={setXml}
        />
    );
}
