import React, { useEffect, useState } from 'react'
import Blockly from "blockly";
let demoWorkspace = Blockly.getMainWorkspace();
import $ from 'jquery';

if(typeof window !== "undefined"){
    window['total_rescue_btns_wb'] = 0;
    window['rescue_btn_click_count_wb'] = [];
}

let newStyle = ` .modal {
    max-width: 350px !important;
    height: 95% !important;
    border-radius: 25px;
}

.shepherd-custom-rescue-sutton-white {
    border: 1px solid rgb(182, 182, 182);
    background-color: rgba(182, 182, 182, 0.15);
    color: black;
    font-size: 12px;
    cursor: pointer;
    width: 65px;
    height: 30px;
    border-radius: 6px;
    justify-content: center;
    align-items: center;
    transition: 0.5s;
}

.shepherd-custom-rescue-sutton-white:hover {
    border: 1px solid rgb(182, 182, 182);
    background-color: rgb(97, 97, 97);
    color: rgb(228, 228, 228);
    font-size: 12px;
    cursor: pointer;
    border-radius: 6px;
    transition: 0.5s;
}

.shepherd-custom-rescue-sutton-white:active {
    border: 1px solid rgb(182, 182, 182);
    background-color: rgb(97, 97, 97);
    color: rgb(228, 228, 228);
    padding: 3px 10px;
    cursor: pointer;
    border-radius: 6px;
    transition: 0.5s;
}

.shepherd-custom-rescue-sutton-white:focus {
    border: 1px solid rgb(182, 182, 182);
    background-color: rgb(97, 97, 97);
    color: rgb(228, 228, 228);
    padding: 3px 10px;
    cursor: pointer;
    border-radius: 6px;
    transition: 0.5s;
}

.cbx {
    margin: auto;
    -webkit-user-select: none;
    user-select: none;
    cursor: pointer;
}

.cbx span {
    display: inline-block;
    vertical-align: middle;
    transform: translate3d(0, 0, 0);
}

.cbx span:first-child {
    position: relative;
    width: 18px;
    height: 18px;
    border-radius: 3px;
    transform: scale(1);
    vertical-align: middle;
    border: 1px solid #9098A9;
    transition: all 0.2s ease;
}

.cbx span:first-child svg {
    position: absolute;
    top: 3px;
    left: 2px;
    fill: none;
    stroke: #FFFFFF;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: 16px;
    stroke-dashoffset: 16px;
    transition: all 0.3s ease;
    transition-delay: 0.1s;
    transform: translate3d(0, 0, 0);
}

.cbx span:first-child:before {
    content: "";
    width: 100%;
    height: 100%;
    background: rgb(100, 100, 100);
    display: block;
    transform: scale(0);
    opacity: 1;
    border-radius: 50%;
}

.cbx span:last-child {
    padding-left: 8px;
}

.cbx:hover span:first-child {
    border-color: rgb(100, 100, 100);
}

.inp-cbx:checked+.cbx span:first-child {
    background: rgb(100, 100, 100);
    border-color: rgb(100, 100, 100);
    animation: wave 0.4s ease;
}

.inp-cbx:checked+.cbx span:first-child svg {
    stroke-dashoffset: 0;
}

@keyframes wave {
    50% {
        transform: scale(0.9);
    }
}

.row {
    margin-bottom: 0px !important;
}`;

export default function Help({ instruction, open }) {
    let workspaces = [];

    const [rescued, setRescued] = useState(false)

    useEffect(() => {
        if (typeof window !== "undefined") {
            var styleSheet = document.createElement("style")
            styleSheet.innerText = newStyle;
            document.head.appendChild(styleSheet);
            import("./helpers/openModel.js")
            if (instruction) {
                add_main_heading(instruction.heading)
                instruction.steps.forEach((ele, idx) => { add_instruction(ele, idx) })
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
    function update_rescue_workspace(i: number, ele:any) {
        var xml = Blockly.Xml.textToDom(workspaces[i]);
        Blockly.getMainWorkspace().clear();
        Blockly.Xml.domToWorkspace(xml, Blockly.getMainWorkspace());
        $('#undo_btn').css('display', 'inline-block');
        setRescued(true);

        if(!window['rescue_btn_click_count_wb'].includes(i) && ele.rescue)
            window['rescue_btn_click_count_wb'].push(i)
    }


    function add_main_heading(text) {
        const hr = document.createElement('hr')
        const h5 = document.createElement('h5')
        h5.innerText = text;
        const wrapper = document.createElement('div');
        wrapper.classList.add(...["row", "valign-wrapper"])
        const comp = document.createElement('div')
        comp.classList.add(...["col", "s12", "m12", "l12", "xl12", "left-align"])
        comp.append(hr, h5)
        wrapper.appendChild(comp)
        document.getElementById("content").appendChild(wrapper);
    }

    function add_title(text) {
        const hr = document.createElement('hr')
        const h6 = document.createElement('h6')
        h6.innerText = text;
        h6.classList.add(...["center-align"])
        const wrapper = document.createElement('div');
        wrapper.classList.add(...["row", "valign-wrapper"])
        const comp = document.createElement('div')
        comp.classList.add(...["col", "s12", "m12", "l12", "xl12", "center-align"])
        comp.append(hr, h6)
        wrapper.appendChild(comp)
        return wrapper;
    }

    function add_instruction(ele, j: number) {
        let text = ele.text;
        let title = ele?.title ? add_title(ele.title) : false;
        let rescue = ele.rescue ?? false;
        let checkbox = ele.checkbox ?? false;
        let workspace = '<xml xmlns="https://developers.google.com/blockly/xml"></xml>';
        try {
            if (typeof (ele.workspace) != "undefined")
                if (ele.workspace != "") workspace = ele.workspace;
        } catch { }

        let rescue_btn = document.createElement('div'); 
        rescue_btn.classList.add(...["col", "s3", "m3", "l3", "xl3", "right-align", `rescue_btn`])

        if(ele.rescue) window['total_rescue_btns_wb'] += 1;

        let btn = document.createElement('button'); btn.classList.add(...["shepherd-custom-rescue-sutton-white", "valign-wrapper", "right-align"]);
        btn.style.cssText = "height: 24px;line-height: 24px;padding: 0 0.5rem;margin-right: 0px;"
        btn.innerText = "Rescue"
        btn.onclick = () => update_rescue_workspace(j, ele)

        rescue_btn.appendChild(btn)

        let rescueDiv = document.createElement('div');
        rescueDiv.classList.add(...["row", "valign-wrapper", "right-align"]);
        rescueDiv.style.marginBottom = "0px";
        rescueDiv.appendChild(rescue_btn)


        let checkbox_btn = document.createElement('div'); checkbox_btn.classList.add(...["col", "s2", "m2", "l2", "xl2", "valign-wrapper"]);
        checkbox_btn.style.cssText = "margin-right: 10px;border: 1px solid rgba(145, 158, 171, 0.32);height: 50px;width: 50px;border-radius: 10px;"
        let input = document.createElement("input"); input.classList.add("inp-cbx");
        input.id = `cbx${j}`
        input.type = "checkbox"; input.style.display = "none"
        let label = document.createElement("label"); label.classList.add("cbx");
        label.htmlFor = `cbx${j}`;
        let span = document.createElement("span");
        let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute("width", "12px"); svg.setAttribute("height", "10px"); svg.setAttribute("viewbox", "0 0 12 10");
        let polyline = document.createElementNS('http://www.w3.org/2000/svg', "polyline");
        polyline.setAttribute("points", "1.5 6 4.5 9 10.5 1")

        svg.appendChild(polyline);
        span.appendChild(svg);
        label.appendChild(span)

        checkbox_btn.append(input, label);

        let checkbox_btn_empty = document.createElement('div'); checkbox_btn_empty.classList.add(...["col", "s1", "m1", "l1", "xl1", "valign-wrapper"])

        let component = document.createElement('div');
        component.classList.add(...["row", "valign-wrapper"])
        if (title) {
            document.getElementById("content").appendChild(title);
        }

        let textDiv = document.createElement("div"); textDiv.innerText = text;
        textDiv.style.cssText = "text-align:justify;text-justify:inter-word;";

        if (checkbox) {
            component.appendChild(checkbox_btn);
            textDiv.classList.add(...["col", "s11", "m10", "l10", "xl10", "left-align"])
        } else {
            textDiv.classList.add(...["col", "s12", "m12", "l12", "xl12", "left-align"]);
        }
        component.appendChild(textDiv);

        document.getElementById("content").appendChild(component);
        if (rescue) document.getElementById("content").appendChild(rescueDiv);
        workspaces.push(workspace);
    }

    function undo_button_function() {
        Blockly.getMainWorkspace().undo(false);
        Blockly.getMainWorkspace().undo(false);
        $('#undo_btn').css('display', 'none');
    }

    return (
        <div id="help_practice" className="modal modal-fixed-footer" style={{ maxWidth: "350px", height: "95%", borderRadius: "25px" }}>
            <div className="modal-content center-align" id="content" style={{ paddingTop: "35px" }}>
            </div>
            <div className="modal-footer right-align" style={{ height: 60 }}>
                <button id="undo_btn" style={{ display: "none", marginRight: "15px", marginTop: "15px", float: "right" }}
                    className="shepherd-custom-rescue-sutton-white valign-wrapper"
                    onClick={undo_button_function}>Undo</button>
            </div>
        </div>
    )
}
