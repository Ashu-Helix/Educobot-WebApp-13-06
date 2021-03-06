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


    function add_main_heading(ele) {
        const hr = document.createElement('hr')
        const h5 = document.createElement('h5')
        const br = document.createElement('br')
        h5.innerText = ele.text;
        const comp = document.createElement('div')
        comp.append(hr, h5, br)
        return comp;
    }

    function add_title(ele) {
        const hr = document.createElement('hr')
        const h6 = document.createElement('h6')
        const br = document.createElement('br')
        h6.innerText = ele.text;
        h6.classList.add(...["center-align"])
        const comp = document.createElement('div')
        comp.append(hr, h6, br)
        return comp;
    }

    function add_step(ele) {

    }

    function add_instruction(ele, j: number) {

        // let col1;
        // let col2;
        // let rescue;
        // let checkbox;

        // if (ele.type === "heading") {
        //     col1 = add_main_heading(ele);
        // } else if (ele.type === "title") {
        //     col1 = add_title(ele);
        // } else if (ele.type === "step") {
        //     console.log("Step");
        // }

        // let col1 = j == 0 ? lesson_title(ele.col1) : ele.col1;\
        let col1 = ele.type != "step" ? ele.type == "heading" ? add_main_heading(ele) : add_title(ele) : ele.text;
        let col2 = "";
        let rescue = ele.rescue;
        let checkbox = ele.checkbox;
        let workspace = '<xml xmlns="https://developers.google.com/blockly/xml"></xml>';
        try {
            if (typeof (ele.workspace) != "undefined")
                if (ele.workspace != "") workspace = ele.workspace;
        } catch { }

        let rescue_btn = document.createElement('div'); rescue_btn.classList.add(...["col", "s3", "m3", "l3", "xl3", "right-align"])

        let btn = document.createElement('button'); btn.classList.add(...["waves-effect", "waves-dark", "btn-small", "black-text", "white"]);
        btn.style.cssText = "height: 24px;line-height: 24px;padding: 0 0.5rem;"
        btn.innerText = "Rescue"
        btn.onclick = () => update_rescue_workspace(j)

        rescue_btn.appendChild(btn)

        let rescue_div = document.createElement('div');
        rescue_div.classList.add(...["row", "valign-wrapper", "right-align"])
        rescue_div.appendChild(rescue_btn)

        // let rescue_btn_empty = document.createElement('div'); rescue_btn_empty.classList.add(...["col", "s2", "m2", "l2", "xl2"])

        let checkbox_btn = document.createElement('div'); checkbox_btn.classList.add(...["col", "s1", "m1", "l1", "xl1", "valign-wrapper"])
        let label = document.createElement("label"); label.classList.add("container");
        let input = document.createElement("input"); input.type = "checkbox";
        let span = document.createElement("span"); span.classList.add("checkmark");
        label.appendChild(input);
        label.appendChild(span)
        checkbox_btn.appendChild(label);

        let checkbox_btn_empty = document.createElement('div'); checkbox_btn_empty.classList.add(...["col", "s1", "m1", "l1", "xl1", "valign-wrapper"])

        let component = document.createElement('div');
        component.classList.add(...["row", "valign-wrapper"])

        // if ((col1 != "" && col2 != "") || (col1 == "" && col2 != "")) {
        if (ele.type == "step") {
            let col1d = document.createElement('div');
            if (checkbox) {
                component.appendChild(checkbox_btn)
                col1d.classList.add(...["col", "s11", "m11", "l11", "xl11", "left-align"])
            }
            else {
                col1d.classList.add(...["col", "s12", "m12", "l12", "xl12", "left-align"])
            };




            typeof col1 === "object" ? col1d.appendChild(col1) : col1d.innerHTML = col1;
            // col1d.classList.add(...["px-2"])
            // let col2d = document.createElement('div');
            // col2d.classList.add(...["col", "s5", "m5", "l5", "xl5", "left-align"])
            // typeof col2 === "object" ? col2d.appendChild(col2) : col2d.innerHTML = col2;

            component.appendChild(col1d);
            // component.appendChild(col2d);

            // if (rescue) component.appendChild(rescue_btn);
            // else component.appendChild(rescue_btn);




        } else if (ele.type == "heading" || ele.type == "title") {
            let col1d = document.createElement('div');
            col1d.classList.add(...["col", "s12", "m12", "l12", "xl12", "left-align"])
            typeof col1 === "object" ? col1d.appendChild(col1) : col1d.innerHTML = col1;
            component.appendChild(col1d);

            // if (rescue) component.appendChild(rescue_btn);
            // else component.appendChild(rescue_btn_empty);

            // if (checkbox) component.appendChild(checkbox_btn);

            // else component.appendChild(checkbox_btn_empty);
        }

        workspaces.push(workspace);
        document.getElementById("content").appendChild(component);
        if (rescue && ele.type == "step") {
            component.appendChild(rescue_div);
            document.getElementById("content").appendChild(rescue_div);
        }
        else if (ele.type == "step") {
            component.appendChild(rescue_div);
            document.getElementById("content").appendChild(rescue_div);
        }


    }

    function undo_button_function() {
        demoWorkspace.undo(false);
        demoWorkspace.undo(false);
        $('#undo_btn').css('display', 'none');
    }

    // function add_main_heading(j) {
    //     let text = j.text;
    //     let workspace = '<xml xmlns="https://developers.google.com/blockly/xml"></xml>';
    //     try {
    //         if (typeof (j.workspace) != "undefined")
    //             if (j.workspace != "") workspace = j.workspace;
    //     } catch { }

    //     let component = document.createElement('div');
    //     component.classList.add(...["row", "valign-wrapper"])

    //     //     let component = `<div class="row valign-wrapper">
    //     //     <div class="col s12 m12 l12 xl12 left-align">
    //     //         <hr>
    //     //         <h5>${text}</h5>
    //     //     </div>
    //     // </div>`;


    //     // count_instructions++;
    //     workspaces.push(workspace);
    //     // instructions_html.push(component);
    //     document.getElementById("content").appendChild(component);
    // }

    return (
        <div id="help_practice" className="modal modal-fixed-footer" style={{ maxWidth: "350px", height: "95%", borderRadius: "25px" }}>
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
