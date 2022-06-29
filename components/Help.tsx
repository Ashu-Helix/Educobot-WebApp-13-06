import React, { useEffect, useState } from 'react'
import Blockly from "blockly";
// import "blockly/python";
// import "blockly/javascript";
let demoWorkspace = Blockly.getMainWorkspace();
import $ from 'jquery';


export default function Help({ instruction, open }) {
    let workspaces = [];

    const [rescued, setRescued] = useState(false)

    function lesson_title(txt) {
        const hr1 = document.createElement('hr')
        const hr = document.createElement('hr')
        const h5 = document.createElement('h5')
        const br = document.createElement('br')
        h5.innerText = txt;
        const comp = document.createElement('div')
        comp.append(hr1, h5, hr, br)
        return comp

    }
    useEffect(() => {
        if (typeof window !== "undefined") {
            import("./helpers/openModel.js")
            if (instruction) {
                instruction.forEach((ele, idx) => { add_instruction(ele, idx) })
            }
        }
        if (demoWorkspace) {
            demoWorkspace.addChangeListener((event) => {
                if (event.type == Blockly.Events.BLOCK_CREATE ||
                    event.type == Blockly.Events.BLOCK_DELETE ||
                    event.type == Blockly.Events.BLOCK_CHANGE || event.type == Blockly.Events.BLOCK_MOVE) {
                    if (!rescued) $('#undo_btn').css('display', 'none');
                    else setTimeout(() => { setRescued(false) }, 500);
                }
            });
        }
    }, [])
    useEffect(() => {
        if (open)
            require("./helpers/openModel.js").helpCode()
    }, [open])
    function update_rescue_workspace(i: number) {
        demoWorkspace = Blockly.getMainWorkspace();
        var xml = Blockly.Xml.textToDom(workspaces[i]);
        demoWorkspace.clear();
        Blockly.Xml.domToWorkspace(xml, demoWorkspace);
        $('#undo_btn').css('display', 'inline-block');
        setRescued(true);
    }


    function add_instruction(ele, j: number) {

        let col1 = j == 0 ? lesson_title(ele.col1) : ele.col1;
        let col2 = ele.col2;
        let rescue = ele.rescue;
        let checkbox = ele.checkbox;
        let workspace = '<xml xmlns="https://developers.google.com/blockly/xml"></xml>';
        try {
            if (typeof (ele.workspace) != "undefined")
                if (ele.workspace != "") workspace = ele.workspace;
        } catch { }

        let rescue_btn = document.createElement('div'); rescue_btn.classList.add(...["col", "s2", "m2", "l2", "xl2"])
        let btn = document.createElement('button'); btn.classList.add(...["waves-effect", "waves-dark", "btn-small", "black-text", "white"]);
        btn.style.cssText = "height: 24px;line-height: 24px;padding: 0 0.5rem;"
        btn.innerText = "Rescue"
        btn.onclick = () => update_rescue_workspace(j)

        rescue_btn.appendChild(btn)


        let rescue_btn_empty = document.createElement('div'); rescue_btn_empty.classList.add(...["col", "s2", "m2", "l2", "xl2"])

        let checkbox_btn = document.createElement('div'); checkbox_btn.classList.add(...["col", "s1", "m1", "l1", "xl1"])
        let label = document.createElement("label"); label.classList.add("container");
        let input = document.createElement("input"); input.type = "checkbox";
        let span = document.createElement("span"); span.classList.add("checkmark");
        label.appendChild(input);
        label.appendChild(span)
        checkbox_btn.appendChild(label);

        let checkbox_btn_empty = document.createElement('div'); checkbox_btn_empty.classList.add(...["col", "s1", "m1", "l1", "xl1"])


        let component = document.createElement('div');
        component.classList.add(...["row", "valign-wrapper"])

        if ((col1 != "" && col2 != "") || (col1 == "" && col2 != "")) {

            let col1d = document.createElement('div');
            col1d.classList.add(...["col", "s4", "m4", "l4", "xl4", "left-align"])

            typeof col1 === "object" ? col1d.appendChild(col1) : col1d.innerHTML = col1;
            let col2d = document.createElement('div');
            col2d.classList.add(...["col", "s5", "m5", "l5", "xl5", "left-align"])
            typeof col2 === "object" ? col2d.appendChild(col2) : col2d.innerHTML = col2;

            component.appendChild(col1d);
            component.appendChild(col2d);

            if (rescue) component.appendChild(rescue_btn);
            else component.appendChild(rescue_btn_empty);

            if (checkbox) component.appendChild(checkbox_btn);
            else component.appendChild(checkbox_btn_empty);
        } else if (col1 != "" && col2 == "") {
            let col1d = document.createElement('div');
            col1d.classList.add(...["col", "s9", "m9", "l9", "xl9", "left-align"])
            typeof col1 === "object" ? col1d.appendChild(col1) : col1d.innerHTML = col1;
            component.appendChild(col1d);

            if (rescue) component.appendChild(rescue_btn);
            else component.appendChild(rescue_btn_empty);

            if (checkbox) component.appendChild(checkbox_btn);

            else component.appendChild(checkbox_btn_empty);
        }

        workspaces.push(workspace);
        document.getElementById("content").appendChild(component);

    }
    function undo_button_function() {
        demoWorkspace.undo(false);
        demoWorkspace.undo(false);
        $('#undo_btn').css('display', 'none');
    }
    return (
        <div id="help_practice" className="modal modal-fixed-footer" /*style={{ borderRadius: "18px"  }}*/>
            <div className="modal-content center-align" id="content" style={{ paddingTop: "35px" }}>
            </div>
            <div className="modal-footer">
                <div style={{ float: "left", marginLeft: "15px" }}>
                    <button id="undo_btn" style={{ display: "none" }} className="waves-effect waves-gray btn-flat white-text black"
                        onClick={undo_button_function}>UNDO</button>
                </div><button className="modal-close waves-effect waves-gray btn-flat white-text black" style={{ marginRight: "15px", marginBottom: "20px" }}>Close</button>
            </div>
        </div>
    )
}
