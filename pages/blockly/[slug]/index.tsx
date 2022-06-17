import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import Image from "next/image";
import dynamic from "next/dynamic";
import { GetStaticPaths, GetStaticProps } from "next/types";
import Canvas from "../../../components/Canvas";
import styles from "../../../styles/Problems.module.css";
import TestDialog from "../../../MyComponents/DialogBoxes/TutorialDialog";
const Blockly = dynamic(import("../../../components/Blockly"), { ssr: false });
const Tour = dynamic(import("../../../components/Tour"), { ssr: false });
import * as XLSX from "xlsx";
import React from "react";
import axios from "axios";
import FormData from 'form-data';
import { Button } from "@mui/material";
import { Icon } from '@iconify/react'

const language = {
    English: 1,
    Hindi: 2,
    Marathi: 3,
    Spanish: 4,
    Arabic: 5,
    Swaheli: 6,
};


export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
    return {
        paths: [
            // { params: { slug: 'bunny' } },
            { params: { slug: '4bda4814-a2b1-4c4f-b102-eda5181bd0f8' } },
            // { params: { slug: 'trafficSignal' } },
        ],
        fallback: false,
    };
};

export const getStaticProps: GetStaticProps = async (context) => {
    const readedData = XLSX.readFile("public/BunnyLanguageTemplate.xlsx", {
        type: "binary",
    });

    const staticSlug = [
        "1d749e84-1155-4269-93ab-550ee7aabd4a",
        "4bda4814-a2b1-4c4f-b102-eda5181bd0f8"
    ]

    let index = 0;
    const sheetNames = readedData.SheetNames;
    sheetNames.forEach((s, i) => {
        //console.log(context.params.slug == staticSlug[i]);
        context.params.slug === staticSlug[i] ? index = i : 0
    })

    const wsname = readedData.SheetNames[index];
    console.log(index, context.params.slug, 57)
    const ws = readedData.Sheets[wsname];

    /* Convert array to json*/
    const dataParse: any[] = XLSX.utils.sheet_to_json(ws, { header: 1 });

    var bodyFormData = new FormData();
    bodyFormData.append('lessonID', context.params.slug);

    const lessonDetails = await axios({
        method: "post",
        url: "https://appssl.educobot.com:8443/EduCobotWS/lessonsWS/getLessonsByID",
        data: bodyFormData,
        headers: { "Content-Type": "multipart/form-data" },
    });

    return {
        props: { dataParse, slug: context.params.slug, lessonDetails: lessonDetails.data.DATA[0] },
    };
};

const Home: NextPage<any> = (props) => {
    const { dataParse, slug, lessonDetails } = props;
    const [muteState, setMute] = useState(false);
    const [command, setcommand] = useState("");
    const [reset, setReset] = useState(false);
    const [lang, setLang] = useState(1);
    const [PythonCode, setPythonCode] = useState("");
    const tut: any[] = dataParse.map(data => (data[lang]))
    const [imt, setImt] = useState([]);
    const [timer, setTimer] = useState(0);
    const router = useRouter();


    const childFunc = React.useRef(null)

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Credentials', 'true');
    headers.append('GET', 'POST');

    function FinalTask(value) {

        const user_id = router.query.user_id;
        let blocks = 0
        if (typeof window !== "undefined" && window['getNoOfBlocks'])
            blocks = window['getNoOfBlocks']();

        console.log(blocks, value, user_id, timer)
        fetch(`https://api.educobot.com/users/postEvalData`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                timeTaken: timer,
                userID: user_id,//"d45c7cb9-831e-4a2c-9372-0b1f34a0fae6",
                lessonID: slug, blocks,
                coins: value
            })
        }).then(res => res.json())
            .then(res => console.log(res))

    }

    const handleClick = async () => {
        try {
            window[`runCode`]()
        } catch (e) {
            console.log(e)
        }
    };

    useEffect(() => {
        window["language"] = tut.shift().toLowerCase();
        window['tutorials'] = tut

        if (typeof window !== "undefined" && window['updateImports'])
            setImt([...window['updateImports']])
        let completed = window[`completedFlag`]

        const interval = setInterval(() => {
            setTimer(t => t + 1)
            if (completed()) {
                document.getElementById("openTest").click();
                clearInterval(interval);
            }
        }, 2000);


        return () => clearInterval(interval);

    }, []);

    function onChange(e) {
        setLang(parseInt(e.target.value))
        const tut: any[] = dataParse.map(data => (data[e.target.value]))

        window["language"] = tut.shift().toLowerCase();
        window['tutorials'] = tut
        window['loadAgain']()
    }


    return (
        <>
            <div className={styles.lessonDetailsDiv} id="game_page">
                <div className={styles.lessonTitle}>
                    <div className={styles.lesson_div} >
                        <Button className={styles.backbtn} onClick={() => { router.back(); }}>
                            <Icon style={{ color: "#fff", fontSize: "18px", }} icon="eva:arrow-ios-back-fill" />
                        </Button>
                        <p style={{ fontSize: "18px", fontWeight: "700", fontFamily: "Public Sans" }}>{lessonDetails.lsName}</p>
                    </div>
                    <p className={styles.description} >{lessonDetails.lsDesc}</p>
                </div>
                <div className={styles.select_languageDiv}>
                    <select className={`${styles.select_language}`} value={lang} onChange={onChange}>
                        {
                            Object.keys(language).map(key => <option key={key} value={`${language[key]}`}>{key}</option>)
                        }
                    </select>
                </div>
            </div>
            <div
                // style={{
                //     display: "grid",
                //     height: "100%",
                //     gridTemplateColumns: "repeat(2, 1fr)",
                // }}
                className={styles.blocklybunny}
            >
                <div className="fill-bunny" id="blocklyDiv">
                    <Blockly
                        childFunc={childFunc}
                        slug={slug}
                        setPythonCode={setPythonCode}
                    />
                </div>
                <div
                    // id="circle"
                    // className={styles.canvas}
                    style={{ padding: "0 0.6rem 0rem 0.3rem" }}
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
                            onClick={() => setReset(!reset)}
                        >
                            <img src="/assets/reset_icon.png" width="22.5" height="25.5" />
                        </button>
                        {/* <button
                            className={`${styles.normal_button}  ${styles.sound}`}
                            data-position="bottom"
                            data-tooltip="Open Keyboard"
                            //id="soundBtn"
                            onClick={() => {
                                if (typeof window !== 'undefined' && window['setAudioPreference'])
                                    window['setAudioPreference']()
                                setMute(!muteState)
                            }}
                        >
                            <img
                                src={muteState ? "/assets/sound_icon.png" : "/assets/sound_unmute.png"}
                                width="22.5"
                                height="25.5"
                            />
                        </button> */}
                    </div>
                    {
                        <Canvas
                            command={command}
                            id="sprite"
                            className={""}
                            handleReset={setReset}
                            reset={reset}
                            setCommand={setcommand}
                            slug={slug}
                        />
                    }
                    <div
                        id="pycode"
                        className={styles.output}
                        style={{ minHeight: "9vh" }}
                    >

                        {imt.map(res => {
                            return (<div key={res} style={{
                                color: "#fff",
                                display: "contents",
                                padding: 0, margin: 0
                            }}>
                                <b style={{ display: "contents" }}>
                                    {res}
                                </b>
                                <br /></div>)
                        })}
                        {PythonCode}
                    </div>
                </div>
            </div>
            <TestDialog
                slug={slug}
                getCoins={FinalTask}
                lessonDetails={lessonDetails}
                testDialogInfo={{
                    dialogStatus: "test",
                }}
            />
            <Tour slug={slug} />
            <label id="hand" htmlFor="test">
                <img src="/assets/hand_upward.png" width="50px" height="60px" />
            </label>
        </>
    );
};
export default Home;
