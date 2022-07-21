import React, { useEffect } from "react";
import { useState } from "react";
import styles from "../../../styles/Problems.module.css";
import Image from "next/image";
import dynamic from "next/dynamic";
import KeyBoardContainer from "../../../components/KeyBoardContainer";
import ScriptDialog from "../../../MyComponents/DialogBoxes/ScriptMcqDialog";
import { Button } from "@mui/material";
import { Icon } from '@iconify/react'
import axios from "axios";
import FormData from 'form-data';

const url:any = process.env.devUrls;

const PythonCode = dynamic(import("../../../components/pythonCode"), {
    ssr: false,
});
import { GetServerSideProps } from "next/types";
import { useRouter } from "next/router";

export const getServerSideProps: GetServerSideProps = async (context) => {

    const response1 = await fetch(`${url.pythonScriptFilesUrl}${context.params.id}/code.json`);
    // const response1 = await fetch(`http://localhost:7001/scripts/${context.params.id}/code.json`);
    if (response1.status === 404) {
        return {
            notFound: true,
        }
    }
    let res = await response1.json() ?? "";
    let { code, guide, type } = res

    var bodyFormData = new FormData();
    bodyFormData.append('lessonID', "4a46c77f-562b-464c-b906-6417bb0c7ac9");

    const lessonDetails = await axios({
        method: "post",
        url: `${url.EduCobotBaseUrl}${url.getLessonByID}`,
        data: bodyFormData,
        headers: { "Content-Type": "multipart/form-data" },
    });

    return {
        props: { id: context.params.id, code, guide, type, lessonDetails: lessonDetails.data.DATA[0] },
    };

}

export default function Scripts(props) {
    const { id, code, guide, type, lessonDetails } = props;
    //   let script = ''; var user_code = [];
    // console.log(Object.keys(guide));
    // const language = { English: "English", Hindi: "Hindi" };
    let language = {};
    Object.keys(guide).forEach((currentLang) => {
        language[currentLang] = currentLang
    })

    const [script, setScript] = useState("")
    const [user_code, setUser_code] = useState([])
    const [keyboardState, setkeyboardState] = useState(false);
    const [testTaken, setTestTaken] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    const [lang, setLang] = useState("English");
    const router = useRouter();
    let tutorial = require("../../../tutorial/tutorial.js");
    const { getPlayAudio } = tutorial;
    const [playAudio, setPlayAudio] = useState(true);

    // user details
    const [userDetails, setUserDetails] = useState([]);
    const getUserDetails = async (otp: string | string[]) => {
        try {
            let formD = new FormData();
            formD.append("sdUID", router.query.user_id)

            const userDetails = await axios({
                method: "post",
                url: `${url.EduCobotBaseUrl}${url.getStudents}`,
                data: formD,
                headers: { "Content-Type": "multipart/form-data" },
            });
            {
                let newData = { ...userDetails.data.DATA[0], otp }
                setUserDetails(newData)
                console.log("got user details in python")
            }
        }
        catch (error) {
            console.log(error.message)
            setUserDetails([])
        }
    }

    useEffect(() => {
        router.query.otp && getUserDetails(router.query.otp)
    }, [router.query.otp])


    const onLoad = () => {
        let tutorial = require("../../../tutorial/tutorial.js");
        const { tutorial_guide_updater, make_pred_guide } = tutorial;
        tutorial_guide_updater(id, user_code, lang, type);
        // console.log(guide);
        // console.log(Array.isArray(guide));
        if (Array.isArray(guide)) {
            guide.forEach(g => make_pred_guide(g.id, g.img, g.code, g.audio, id, type))
        } else {
            guide[lang].forEach(g => make_pred_guide(g.id, g.img, g.code, g.audio, id, type))
        }
        htmlmaker(code, user_code);
        if (typeof window !== "undefined") {
            const script = require("../../../skulpt/worker");
            const { runIt } = script;
            runIt("");
        }
        document.getElementsByClassName("CodeMirror-cursors")[0]?.remove();
    };

    useEffect(() => {
        let tutorial = require("../../../tutorial/tutorial.js");
        const { tutorial_guide_updater, make_pred_guide } = tutorial;
        tutorial_guide_updater(id, user_code, lang, type);
        if (Array.isArray(guide)) {
            guide.forEach(g => make_pred_guide(g.id, g.img, g.code, g.audio, id, type))
        } else {
            guide[lang].forEach(g => make_pred_guide(g.id, g.img, g.code, g.audio, id, type))
        }
    }, [lang]);

    useEffect(() => {
        if (window !== undefined && document.getElementsByClassName(" CodeMirror-line ")[0] !== undefined) {
            htmlmaker(code, user_code)
            setScript(user_code.join(""))
        }
    }, [user_code])
    function htmlmaker(code, user_code) {
        const tutorial = require("../../../tutorial/tutorial.js");
        const { tutorial_guide_updater } = tutorial;
        let max_len = code.length + 1;
        let editor_display = [];
        let cursor_flag = false;
        for (let i = 0; i < max_len; i++) {
            var code_i = code[i];
            if (typeof code[i] === "undefined") code_i = " ";
            if (user_code[i] === "\n" && !(code[i] === "\n")) {
                user_code.pop(i);
            }
            if (user_code[i] === "\t" && !(code[i] === "\t")) {
                user_code.pop(i);
            }
            if (i >= user_code.length && i < code.length)
                if (!cursor_flag) {
                    if (code_i === "\n") {
                        editor_display.push("<span class='cursor'>" + " " + "</span>");
                    }

                    editor_display.push(
                        "<span class='cursor pending_code'>" + code_i + "</span>"
                    );
                    cursor_flag = true;
                } else {
                    editor_display.push(
                        "<span class='pending_code'>" + code_i + "</span>"
                    );
                }
            else if (i === code.length && !cursor_flag) {
                if (code_i === "\n")
                    editor_display.push("<span class='cursor'>" + " " + "</span>");
                editor_display.push("<span class='cursor'>" + code_i + "</span>");
                cursor_flag = true;
            } else if (code_i === user_code[i]) {
                editor_display.push("<span class='right_code'>" + code_i + "</span>");
            } else if (i + 1 >= user_code.length && !cursor_flag && i < code.length) {
                editor_display.push(
                    "<span class='wrong_code'>" + user_code[i] + "</span>"
                );
            } else if (i < code.length) {
                editor_display.push(
                    "<span class='wrong_code'>" + user_code[i] + "</span>"
                );
            }
        }
        document.getElementsByClassName(" CodeMirror-line ")[0].innerHTML =
            editor_display.join("");
        tutorial_guide_updater(id, user_code, lang, type);
    }

    const handleClick = () => {
        if (typeof window !== "undefined") {
            const script = require("../../../skulpt/worker");
            const { runIt } = script;
            console.log(user_code);
            const py = user_code.join('');
            runIt(py, code)
            // const runbtn = document.getElementById('runbtn') as HTMLButtonElement | null;
            // runbtn.disabled = true;
            if (!testTaken) {
                // let interval = setTimeout(() => {
                //     console.log(script.completedFlag());
                //     if (script.completedFlag()) {
                //         // runbtn.disabled = false;
                //         setTestTaken(true);
                //         if (!dialogOpen) {
                //             document.getElementById("openTest").click();
                //         }
                //         setDialogOpen(true);
                //     }
                //     clearInterval(interval);
                // }, 5000);

                let interval = setInterval(() => {
                    if (!dialogOpen) {
                        if (script.completedFlag()) {
                            document.getElementById("openTest").click();
                            setDialogOpen(true);
                            clearInterval(interval);
                        }
                    } else {
                        clearInterval(interval);
                    }
                }, 1000);
            }
        }
    };

    const help = () => {
        const tutorial = require("../../../tutorial/tutorial.js");
        const { helpCode } = tutorial;
        helpCode(id, user_code);
    };

    const updateUserCodeFromKeyboard = (input) => {

        if (input === "{bksp}")
            setUser_code(user_code => user_code.slice(0, -1))
        ///user_code.pop()
        else {
            //user_code.push(input)
            //script = input
            setUser_code([...input.split("")])
            //setScript(input)
        }
        //htmlmaker(code, user_code)
    }
    const handleKeyDown = (_, e) => {

        e.preventDefault();
        if (user_code.length < code.length) {
            if (
                "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-=!@#$%^&*()_+[]{}\\|'\";:.>,</?`~".includes(
                    e.key
                )
            ) {
                // user_code.push(e.key);
                setUser_code(c => [...c, e.key])
            }

            if (e.key === " ") {
                //user_code.push(" ");
                setUser_code(c => [...c, e.key])
            }
            if (e.key === "Tab") {
                // user_code.push(" ");
                // user_code.push(" ");
                // user_code.push(" ");
                // user_code.push(" ");
                setUser_code(c => [...c, " ", " ", " ", " "])
            }
            if (e.key === "Enter") {
                // user_code.push("\n");
                setUser_code(c => [...c, "\n"])
            }

        }
        if (e.key === "Backspace") {
            // user_code.pop();
            setUser_code(user_code => user_code.slice(0, -1))

        }

        //htmlmaker(code, user_code);
    };

    function runCodeForce() {
        user_code.splice(0, user_code.length);

        code.split("").forEach(w => setUser_code(c => [...c, w]));
        //htmlmaker(code, user_code);
    }

    function onChange(e) {
        // setLang(parseInt(e.target.value))
        setLang(e.target.value);
    }

    function reset_output() {
        user_code.splice(0, user_code.length);
        htmlmaker(code, user_code);
        setUser_code(user_code.splice(0, user_code.length));
        document.getElementById("output").innerHTML = "";
    }

    function checkAudio() {
        setPlayAudio(getPlayAudio());
    }

    function closeModal() {
        let myDialog: any = document.getElementById("modal");
        myDialog.close();
    }

    return (
        <>
            <div className={styles.lessonDetailsDiv} id="game_page">
                <div className={styles.lessonTitle}>
                    <div className={styles.lesson_div} >
                        <Button className={styles.backbtn} onClick={() => { router.back(); }}>
                            <Icon style={{ color: "#fff", fontSize: "18px", }} icon="eva:arrow-ios-back-fill" />
                        </Button>
                        <p className={styles.lesson_name} >{lessonDetails.lsName}</p>
                    </div>
                    <p className={styles.description} >{lessonDetails.lsDesc}</p>
                </div>
                <div className={styles.select_languageDiv}>
                    {

                        Object.keys(language).length > 0 &&
                        <select className={`${styles.select_language}`} value={lang} onChange={onChange}>
                            {
                                Object.keys(language).map(key => <option key={key} value={`${language[key]}`}>{key}</option>)
                            }
                        </select>
                    }
                </div>
            </div>
            <div className={styles.container}>
                <PythonCode
                    language="python"
                    theme="material"
                    handleKeyDown={handleKeyDown}
                    onLoad={onLoad}
                    className={styles.editor}
                    setkeyboardState={setkeyboardState}
                />

                <div id="" className={styles.canvas_for_script}>
                    <div className={styles.neumorphic_button_container}>
                        <div style={{ display: "inline-block" }}>
                            <button
                                className={`${styles.neumorphic_button}  ${styles.tooltip}`}
                                data-position="bottom"
                                data-tooltip="Run Code"
                                id="runbtn"
                                onClick={handleClick}
                            >
                                <span className={`${styles.tooltiptext}`}>Run Script</span>
                                <Image
                                    src="/assets/green_flag.png"
                                    width="22.5" height="25.5"
                                />
                            </button>
                            <button
                                className={`${styles.neumorphic_button}  ${styles.tooltip}`}
                                data-position="bottom"
                                data-tooltip="Reset Output"
                                // onClick={() => setReset(!reset)}
                                onClick={reset_output}
                            >
                                <span className={`${styles.tooltiptext}`}>Reset Output</span>
                                <Image src="/assets/reset_icon.png" width="22.5" height="25.5" />
                            </button>
                        </div>
                        <div style={{ display: "inline-block" }}>
                            <button
                                className={`${styles.neumorphic_button}  ${styles.tooltip}`}
                                data-position="bottom"
                                data-tooltip="Help"
                                onClick={help}
                            >
                                <span className={`${styles.tooltiptext}`}>Help</span>
                                <Image src="/assets/help_icon.png" width="22.5" height="25.5" />
                            </button>
                            <button
                                id="keyboardbutton"
                                className={`${styles.neumorphic_button}  ${styles.tooltip}`}
                                data-position="bottom"
                                data-tooltip="Open Keyboard"
                                onClick={() => setkeyboardState(!keyboardState)}
                            >
                                <span className={`${styles.tooltiptext}`}>Open Keyboard</span>
                                <Image src="/assets/keyboard_icon.png" width="26.5" height="25.5" />
                            </button>
                            <button
                                id="autofill"
                                className={`${styles.neumorphic_button}  ${styles.tooltip}`}
                                data-position="bottom"
                                data-tooltip="Demo Run Code"
                                onClick={runCodeForce}
                            >
                                <span className={`${styles.tooltiptext}`}>Autofill</span>
                                <Image
                                    src="/assets/Auto_fill_button_icon.png"
                                    width="25.5" height="25.5"
                                />
                            </button>
                        </div>
                    </div>
                    <div id="output" className={styles.output_for_script} />
                    <ScriptDialog
                        lessonDetails={lessonDetails}
                        userDetails={userDetails}
                        testDialogInfo={{
                            dialogStatus: "test",
                        }}
                    />
                    {/* <dialog id="modal" /> */}
                    <dialog id="modal">
                        <div className={styles.sound_close_container}>
                            {
                                playAudio ? <img src="/assets/sound_icon.png"
                                    width="25.5" height="25.5"
                                    onClick={checkAudio}
                                /> : <img src="/assets/sound_unmute.png"
                                    width="25.5" height="25.5"
                                    onClick={checkAudio}
                                />
                            }
                            <svg width="16" viewBox="0 0 14 14" stroke="black" xmlns="http://www.w3.org/2000/svg" onClick={closeModal}>
                                <path d="M8.4042 6.00409L12.7042 1.71409C13.0963 1.32197 13.0963 0.686214 12.7042 0.294092C12.3121 -0.0980305 11.6763 -0.0980305 11.2842 0.294092L6.9942 4.59409L2.7042 0.294092C2.31208 -0.0980305 1.67632 -0.0980305 1.2842 0.294092C0.892079 0.686214 0.89208 1.32197 1.2842 1.71409L5.5842 6.00409L1.2842 10.2941C1.09489 10.4819 0.988403 10.7375 0.988403 11.0041C0.988403 11.2707 1.09489 11.5263 1.2842 11.7141C1.47197 11.9034 1.72756 12.0099 1.9942 12.0099C2.26084 12.0099 2.51644 11.9034 2.7042 11.7141L6.9942 7.41409L11.2842 11.7141C11.472 11.9034 11.7276 12.0099 11.9942 12.0099C12.2608 12.0099 12.5164 11.9034 12.7042 11.7141C12.8935 11.5263 13 11.2707 13 11.0041C13 10.7375 12.8935 10.4819 12.7042 10.2941L8.4042 6.00409Z"
                                    fill="black" />
                            </svg>
                        </div>
                        <div> </div>
                    </dialog>

                </div>
                {keyboardState && (
                    <KeyBoardContainer script={script} setScript={(value) => updateUserCodeFromKeyboard(value)} onlyKeyboard={false} />
                )}
            </div>
        </>
    );
}
