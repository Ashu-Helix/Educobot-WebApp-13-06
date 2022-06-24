import React, { useEffect } from "react";
import { useState } from "react";
import styles from "../../../styles/Problems.module.css";
import openEditor from "../../../styles/pythonCode.module.css";
import Image from "next/image";
import dynamic from "next/dynamic";
import KeyBoardContainer from "../../../components/KeyBoardContainer";
import ScriptDialog from "../../../MyComponents/DialogBoxes/ScriptMcqDialog";
import { Button } from "@mui/material";
import { Icon } from '@iconify/react'
import axios from "axios";
import FormData from 'form-data';

const EditorContainer = dynamic(import("../../../components/EditorContainer"), {
    ssr: false,
});
import { GetServerSideProps } from "next/types";
import { useRouter } from "next/router";

export const getServerSideProps: GetServerSideProps = async (context) => {

    /*const response1 = await fetch(`https://app.educobot.com/liveLessons/python/${context.params.id}/code.json`);
    // const response1 = await fetch(`http://localhost:7001/scripts/${context.params.id}/code.json`);
    if (response1.status === 404) {
        return {
            notFound: true,
        }
    }
    let res = await response1.json() ?? "";
    let { code,  type } = res
*/
    var bodyFormData = new FormData();
    bodyFormData.append('lessonID', "7adbaaff-0e03-41b4-a2e1-81b40fd56dfc");

    const lessonDetails = await axios({
        method: "post",
        url: "https://appssl.educobot.com:8443/EduCobotWS/lessonsWS/getLessonsByID",
        data: bodyFormData,
        headers: { "Content-Type": "multipart/form-data" },
    });

    let code = 'name = input("What is your name?")\nprint("hello "+name)\na=3\nb=5\nprint(a+b)';
    return {
        props: { id: context.params.id, code, lessonDetails: lessonDetails.data.DATA[0] },
    };

}

export default function PythonEditor(props) {
    const { id, code, lessonDetails } = props;
    const [script, setScript] = useState(code)
    const [keyboardState, setkeyboardState] = useState(false);
    const [testTaken, setTestTaken] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const language = { English: 1 };
    const [lang, setLang] = useState(1);
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== "undefined") {
            require("../../../skulpt/worker").runIt("")
        }
    }, [])
    const runScript = () => {
        if (typeof window !== "undefined") {
            const script1 = require("../../../skulpt/worker");
            const { runIt } = script1;
            const py = script;
            runIt(py)
            // if (!testTaken) {
            //     let interval = setInterval(() => {
            //         if (!dialogOpen) {
            //             if (script.completedFlag()) {
            //                 document.getElementById("openTest").click();
            //                 setDialogOpen(true);
            //                 clearInterval(interval);
            //             }
            //         } else {
            //             clearInterval(interval);
            //         }
            //     }, 1000);
            // }
        }
    };



    const updateUserCodeFromKeyboard = (input) => {
        if (input === "{bksp}")
            setScript(script => script.slice(0, -1))

        else setScript(input)
    }

    function onChange(e) {
        setLang(parseInt(e.target.value))
    }

    function reset_output() {
        setScript("")
        document.getElementById("output").innerHTML = "";
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
                <EditorContainer
                    language="python"
                    theme="yonce"
                    handleChange={(value) => setScript(value)}
                    className={openEditor.open_code_editor}
                    //className={styles.editor}
                    setkeyboardState={setkeyboardState}
                    value={script} />

                <div id="" className={styles.canvas_for_script}>
                    <div className={styles.neumorphic_button_container}>
                        <div style={{ display: "inline-block" }}>
                            <button
                                className={`${styles.neumorphic_button}  ${styles.tooltip}`}
                                data-position="bottom"
                                data-tooltip="Run Code"
                                id="runbtn"
                                onClick={runScript}
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
                                id="keyboardbutton"
                                className={`${styles.neumorphic_button}  ${styles.tooltip}`}
                                data-position="bottom"
                                data-tooltip="Open Keyboard"
                                onClick={() => setkeyboardState(!keyboardState)}
                            >
                                <span className={`${styles.tooltiptext}`}>Open Keyboard</span>
                                <Image src="/assets/keyboard_icon.png" width="26.5" height="25.5" />
                            </button>
                        </div>
                    </div>
                    <div id="output" className={styles.output_for_script} />
                    <ScriptDialog
                        lessonDetails={lessonDetails}
                        testDialogInfo={{
                            dialogStatus: "test",
                        }}
                    />
                    <dialog id="modal" />
                    {/* <dialog id="modal">
                        <div className="sound_close_container">
                            <img src="/assets/sound_icon.png"
                                width="25.5" height="25.5"
                            />
                            <svg width="35" viewBox="0 0 21 19" stroke="black" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.4042 6.00409L12.7042 1.71409C13.0963 1.32197 13.0963 0.686214 12.7042 0.294092C12.3121 -0.0980305 11.6763 -0.0980305 11.2842 0.294092L6.9942 4.59409L2.7042 0.294092C2.31208 -0.0980305 1.67632 -0.0980305 1.2842 0.294092C0.892079 0.686214 0.89208 1.32197 1.2842 1.71409L5.5842 6.00409L1.2842 10.2941C1.09489 10.4819 0.988403 10.7375 0.988403 11.0041C0.988403 11.2707 1.09489 11.5263 1.2842 11.7141C1.47197 11.9034 1.72756 12.0099 1.9942 12.0099C2.26084 12.0099 2.51644 11.9034 2.7042 11.7141L6.9942 7.41409L11.2842 11.7141C11.472 11.9034 11.7276 12.0099 11.9942 12.0099C12.2608 12.0099 12.5164 11.9034 12.7042 11.7141C12.8935 11.5263 13 11.2707 13 11.0041C13 10.7375 12.8935 10.4819 12.7042 10.2941L8.4042 6.00409Z"
                                    fill="black" />
                            </svg>
                        </div>
                        <div> </div>
                    </dialog> */}

                </div>
                {keyboardState && (
                    <KeyBoardContainer script={script} setScript={(value) => updateUserCodeFromKeyboard(value)} />
                )}
            </div>
        </>
    );
}