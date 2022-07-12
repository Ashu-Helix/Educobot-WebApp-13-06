import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { GetStaticProps } from "next";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import * as XLSX from "xlsx";
import axios from "axios";
import FormData from 'form-data';
import { Button } from "@mui/material";
import { Icon } from '@iconify/react'
const BlocklyComp = dynamic(import("../../../components/Blockly"), { ssr: false });
const Tour = dynamic(import("../../../components/Tour"), { ssr: false, });
import TestDialog from "../../../MyComponents/DialogBoxes/TutorialDialog";
import Help from "../../../components/Help";
import Game from "./game";
import styles from "../../../styles/Problems.module.css";


import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";


export const getStaticPaths = async () => {

    // const res = await fetch(
    //   `https://api.educobot.com/lessonsRoute/getAllLessonID`, { method: 'POST' }
    // );
    // const data = await res.json();
    // const paths = data.data.map((t) => ({ params: { slug: t.lsID } }));

    // const res = await fetch(`${process.env.URL}/all`);
    // const data = await res.json();
    // const paths = data;


    return {
        paths: [
            { params: { slug: "d51b6016-7b0b-4da7-826e-a70cbcc8b941" } },
            { params: { slug: "8bedf833-bde2-433c-9930-f9f8947f2631" } },
            { params: { slug: "e0c38e50-cbb3-455f-ae16-d737fc624b24" } },
            { params: { slug: "2d49121d-2710-491e-b7b4-8c286b1f95a4" } },
            { params: { slug: "956dfe60-ed8a-45a4-8fac-dd3d72137944" } },
            { params: { slug: "1d749e84-1155-4269-93ab-550ee7aabd4a" } }
        ],
        //paths,
        fallback: false,
    };
};

export const getStaticProps: GetStaticProps = async (context) => {

    const readedData = XLSX.readFile("public/BunnyLanguageTemplate.xlsx", {
        type: "binary",
    });

    const sheetNames = readedData.SheetNames;
    let index = -1;

    const staticSlug = [
        "1d749e84-1155-4269-93ab-550ee7aabd4a",
        "4bda4814-a2b1-4c4f-b102-eda5181bd0f8",
        "e0c38e50-cbb3-455f-ae16-d737fc624b24"
    ]
    sheetNames.forEach((s, i) => {
        //context.params.slug === s.toLowerCase() ? index = i : -1
        context.params.slug === staticSlug[i] ? index = i : -1
    })

    sheetNames.forEach((s, i) => {
        context.params.slug === s.toLowerCase() ? index = i : -1
    })

    const wsname = readedData.SheetNames[index];
    const ws = readedData.Sheets[wsname];



    /* Convert array to json*/
    const dataParse: any[] = XLSX.utils.sheet_to_json(ws, { header: 1 });

    const languageObj = {};
    let i = 1;
    dataParse[0] && dataParse[0].forEach((language: any) => { if (language != dataParse[0][0]) { languageObj[language] = i; i++; } });

    var bodyFormData = new FormData();
    bodyFormData.append('lessonID', context.params.slug);

    const lessonDetails = await axios({
        method: "post",
        url: "https://appssl.educobot.com:8443/EduCobotWS/lessonsWS/getLessonsByID",
        data: bodyFormData,
        headers: { "Content-Type": "multipart/form-data" },
    });


    return {
        props: { dataParse, slug: context.params.slug, lessonDetails: lessonDetails.data.DATA[0], languageObj: languageObj, },
    };
};


export default function PhaserGame(props) {
    const [timer, setTimer] = useState(0);
    const [imt, setImt] = useState([]);
    const router = useRouter();
    const { dataParse, slug, lessonDetails, languageObj, } = props;
    const [open, setOpen] = useState(false);
    const [lang, setLang] = useState(1);
    const [PythonCode, setPythonCode] = useState("");
    const tut: any[] = dataParse.map(data => (data[lang]))
    if (tut.length > 0) {
        if (typeof window !== "undefined") {
            window["language"] = tut[0].toLowerCase();
        }
    } else {
        if (typeof window !== "undefined") {
            window["language"] = "english";
        }
    }
    tut.shift();
    const childFunc = React.useRef(null)
    // const language = { English: 1, Hindi: 2, Marathi: 3, Spanish: 4, Arabic: 5, Swaheli: 6 }
    const language = languageObj;
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Credentials', 'true');
    headers.append('GET', 'POST');

    const handleClick = async () => {
        try {
            if (window[`runCode`]) {
                window[`runCode`]();
            }

        } catch (e) {
            alert(e);
        }
    };
    const reSet = () => {
        try {
            window[`reset_output`]();
        } catch (err) { console.log(err) }
    };

    function onChange(e) {
        setLang(parseInt(e.target.value))
        if (dataParse.length == 0) return;
        const tut: any[] = dataParse.map(data => (data[e.target.value]))
        window["language"] = tut[0].toLowerCase();
        tut.shift();
        window['tutorials'] = tut
        window['loadAgain']()
    }

    function FinalTask(mcqScore) {
        console.log(mcqScore);
        //we'll call api here

    }
    let clickArray = [];
    const [clickcnt, setClickCnt] = useState(0)
    const [mount, setMount] = useState(false)
    function increamentClick(idx) {
        if (clickArray.includes(idx)) return;
        clickArray.push(idx)
        setClickCnt(c => c += 1);
    }
    useEffect(() => {

        if (mount) {
            const element: HTMLCollectionOf<Element> = document.getElementsByClassName("rescue_button_id");
            if (element.length) {
                console.log(element);
                for (let i = 0; i < element.length; i++) {
                    element[i].addEventListener('click', () => increamentClick(i));
                }
                lessonDetails["steps"] = element.length;
            }
            else {
                if (window["totlResBtn"])
                    lessonDetails["steps"] = window["totlResBtn"];
            }
        }
        else setMount(true);
    }, [mount]);

    useEffect(() => {

        window["slug"] = slug;
        if (typeof window !== "undefined" && window['updateImports']) {
            setImt([...window['updateImports']])
        }
        window['tutorials'] = tut
        let interval = setInterval(() => {
            setTimer(t => t + 1);
            let completed = window[`completedFlag`];
            if (completed()) {
                document.getElementById("openTest").click();
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [router.query]);


    return (
        <>
            <div className={styles.lessonDetailsDiv} id="game_page">
                <div className={styles.lessonTitle}>
                    <div className={styles.lesson_div}>
                        <Button
                            className={styles.backbtn}
                            onClick={() => {
                                router.back();
                            }}
                        >
                            <Icon
                                style={{ color: "#fff", fontSize: "18px" }}
                                icon="eva:arrow-ios-back-fill"
                            />
                        </Button>
                        <p className={styles.lesson_name}>{lessonDetails.lsName}</p>
                    </div>
                    <p className={styles.description}>{lessonDetails.lsDesc}</p>
                </div>
                <div className={styles.select_languageDiv}>
                    {Object.keys(language).length > 0 && (
                        <select
                            className={`${styles.select_language}`}
                            value={lang}
                            onChange={onChange}
                        >
                            {Object.keys(language).map(key => (
                                <option key={key} value={`${language[key]}`}>
                                    {key}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            </div>
            <div
                style={{
                    height: "93%",
                    display: "flex",
                }}
                className={styles.blocklycontainer}
            >
                <div className="fill-blockly" id="blocklyDiv">
                    <BlocklyComp
                        childFunc={childFunc}
                        slug={slug}
                        setPythonCode={setPythonCode}
                    />
                </div>

                <div
                    className={styles.canvas}
                // style={{ padding: "0 0.6rem 0rem 0.3rem" }}
                >
                    <div className={""}>
                        <button
                            className={`${styles.normal_button} `}
                            data-position="bottom"
                            data-tooltip="Run Code"
                            id="runbtn"
                            onClick={handleClick}
                        >
                            <Image
                                src="/assets/green_flag.png"
                                width="22.5"
                                height="25.5"
                            />
                        </button>
                        <button
                            className={`${styles.normal_button} `}
                            data-position="bottom"
                            data-tooltip="Reset Output"
                            onClick={reSet}
                        >
                            <img src="/assets/reset_icon.png" width="22.5" height="25.5" />
                        </button>
                        {/* <button
                            className={`${styles.normal_button}  ${styles.sound}`}
                            data-position="bottom"
                            data-tooltip="Open Keyboard"
                            id="soundBtn"
                            onClick={() => setMute(!muteState)}
                        >
                            <img
                                src={muteState ? "/assets/sound_icon.png" : "/assets/sound_unmute.png"}
                                width="22.5"
                                height="25.5"
                            />
                        </button> */}
                        <button
                            className={`${styles.normal_button}`}
                            data-position="bottom"
                            data-tooltip="Help"
                            // onClick={() => typeof window !== "undefined" && childFunc.current && childFunc?.current(window["helpCode"])}
                            // onClick={() => setOpen(!open)}
                            onClick={() => {
                                if (typeof window["helpCode"] === "undefined") {
                                    setOpen(!open);
                                } else {
                                    typeof window !== "undefined" &&
                                        childFunc.current &&
                                        childFunc?.current(window["helpCode"]);
                                }
                            }}
                            //onClick={HelpCode}
                            style={{ position: "absolute", right: 0 }}
                        >
                            <img src="/assets/help_icon.png" width="22.5" height="25.5" />
                        </button>
                    </div>
                    <Game slug={slug} />
                    <div
                        id="pycode"
                        className={styles.output}
                        style={{ minHeight: "9vh" }}
                    >
                        {imt.map(res => {
                            return (
                                <div
                                    key={res}
                                    style={{
                                        color: "#fff",
                                        display: "contents",
                                        padding: 0,
                                        margin: 0,
                                    }}
                                >
                                    <b style={{ display: "contents" }}>{res}</b>
                                    <br />
                                </div>
                            );
                        })}

                        {PythonCode}
                    </div>
                </div>
            </div>
            <TestDialog
                getCoins={FinalTask}
                slug={slug}
                noOfClicks={clickcnt}
                lessonDetails={lessonDetails}
                testDialogInfo={{
                    dialogStatus: "test",
                }}
            />
            <Tour slug={slug} />
            {(typeof window !== "undefined" && window["instruction"]) && <Help instruction={window["instruction"]} open={open} />}
            <label id="hand" htmlFor="test">
                <img src="/assets/hand_upward.png" width="50px" height="60px" />
            </label>

        </>
    );
}
