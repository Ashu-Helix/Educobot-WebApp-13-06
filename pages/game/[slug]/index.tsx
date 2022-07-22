import React, { useEffect, useState } from "react";
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

const urls:any = process.env.devUrls;


export const getStaticPaths = async () => {

    // const res = await fetch(
    //   `https://api.educobot.com/lessonsRoute/getAllLessonID`, {method: 'POST' }
    // );
    // const data = await res.json();
    // const paths = data.data.map((t) => ({params: {slug: t.lsID } }));

    // const res = await fetch(`${process.env.URL}/all`);
    // const data = await res.json();
    // const paths = data;


    return {
        paths: [
            { params: { slug: "4bda4814-a2b1-4c4f-b102-eda5181bd0f8" } },
            { params: { slug: "f48757f4-f612-41dc-b882-614fe3c6544a" } },
            { params: { slug: "e0c38e50-cbb3-455f-ae16-d737fc624b24" } }
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
    dataParse[0] &&
        dataParse[0].forEach((language: any) => {
            if (language != dataParse[0][0]) {
                languageObj[language] = i;
                i++;
            }
        });

    var bodyFormData = new FormData();
    bodyFormData.append('lessonID', context.params.slug);

    // lesson details
    const lessonDetails = await axios({
        method: "post",
        url: `${urls.EduCobotBaseUrl}${urls.getLessonByID}`,
        data: bodyFormData,
        // headers: {"Content-Type": "multipart/form-data" },
    });

    const instruction = context.params.slug === "e0c38e50-cbb3-455f-ae16-d737fc624b24" ? [{
        col1: (`The task is to place the monument at the appropriate country through blocks`),
        col2: ``,
        rescue: false,
        checkbox: false,
        workspace: '',
    },
    {
        col1: `Touch the country and obtain the x,y coordinate for placing the monument at thier respective country`,
        col2: ``,
        rescue: false,
        checkbox: false,
        workspace: '',
    },
    {
        col1: `Send Horse to stable`,
        col2: `Set Country's x & y coordinates`,
        rescue: true,
        checkbox: true,
        workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="send__block" id="h0XdfPSk|OXns`9+*t?I" x="58" y="127"><field name="options1">horse</field><field name="options2">sty</field><next><block type="wait_block" id=".8[e}M}p6c/b9)KYR5d1"><field name="milli">6</field></block></next></block></xml>',
    },
    {
        col1: ``,
        col2: `send pig`,
        rescue: true,
        checkbox: true,
        workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="send__block" id="Z_.;V0s!(K6f,T:[Y2Xv" x="27" y="113"><field name="options1">horse</field><field name="options2">stable</field><next><block type="wait_block" id="1HgQ/DGvN,F`6;o)yDYN"><field name="milli">6</field><next><block type="send__block" id="^$oefJlcH}G7W6i3:b5U"><field name="options1">pig</field><field name="options2">sty</field><next><block type="wait_block" id="%;@JELa)A9Q~ICHP!.z}"><field name="milli">11</field></block></next></block></next></block></next></block></xml>',
    },
    {
        col1: `ALL`,
        col2: ``,
        rescue: true,
        checkbox: true,
        workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="send__block" id="Z_.;V0s!(K6f,T:[Y2Xv" x="27" y="113"><field name="options1">horse</field><field name="options2">stable</field><next><block type="wait_block" id="1HgQ/DGvN,F`6;o)yDYN"><field name="milli">6</field><next><block type="send__block" id="^$oefJlcH}G7W6i3:b5U"><field name="options1">pig</field><field name="options2">sty</field><next><block type="wait_block" id="%;@JELa)A9Q~ICHP!.z}"><field name="milli">11</field><next><block type="send__block" id="):ViSC):@~M91cL^I)QX"><field name="options1">cow</field><field name="options2">shed</field></block></next></block></next></block></next></block></next></block></xml>',
    }]
        : [{
            col1: (`The task is to place the monument at the appropriate country through blocks`),
            col2: ``,
            rescue: false,
            checkbox: false,
            workspace: '',
        },
        {
            col1: `Touch the country and obtain the x,y coordinate for placing the monument at thier respective country`,
            col2: ``,
            rescue: false,
            checkbox: false,
            workspace: '',
        },
        {
            col1: `Send Monument to respective Country`,
            col2: `Set Country's x & y coordinates`,
            rescue: true,
            checkbox: true,
            workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="variable_holder" id="g)`%]AL[j7-a)qH!yFyd" x="52" y="-113"><field name="countryName">India</field><value name="NAME"><block type="xy" id="YbCA1lsnfRlHrY@!Y~HX"><field name="x_coordinate">1265</field><field name="y_coordinate">649</field></block></value></block></xml>',
        },
        {
            col1: ``,
            col2: `place monument in Country`,
            rescue: true,
            checkbox: true,
            workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="variable_holder" id="g)`%]AL[j7-a)qH!yFyd" x="52" y="-113"><field name="countryName">India</field><value name="NAME"><block type="xy" id="YbCA1lsnfRlHrY@!Y~HX"><field name="x_coordinate">1265</field><field name="y_coordinate">649</field></block></value><next><block type="place_block" id="0R{]X0`E`:jFi$F=Oudf"><field name="options1">tajMahal</field><field name="options2">India</field></block></next></block></xml>',
        },
        {
            col1: `USA`,
            col2: ``,
            rescue: true,
            checkbox: true,
            workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="variable_holder" id="g)`%]AL[j7-a)qH!yFyd" x="52" y="-113"><field name="countryName">India</field><value name="NAME"><block type="xy" id="YbCA1lsnfRlHrY@!Y~HX"><field name="x_coordinate">1265</field><field name="y_coordinate">649</field></block></value><next><block type="place_block" id="0R{]X0`E`:jFi$F=Oudf"><field name="options1">tajMahal</field><field name="options2">India</field><next><block type="variable_holder" id="Aq+QaW%]IAS%ogM;e~${"><field name="countryName">UnitedStates</field><value name="NAME"><block type="xy" id="]qw~qxHc#1Ha1ABENRpm"><field name="x_coordinate">500</field><field name="y_coordinate">500</field></block></value><next><block type="place_block" id="c+i]m@ZxUSr#YLHxiQ,n"><field name="options1">statueOfLib</field><field name="options2">UnitedStates</field></block></next></block></next></block></next></block></xml>',
        },
        {
            col1: `Australia`,
            col2: ``,
            rescue: true,
            checkbox: true,
            workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="variable_holder" id="g)`%]AL[j7-a)qH!yFyd" x="52" y="-113"><field name="countryName">India</field><value name="NAME"><block type="xy" id="YbCA1lsnfRlHrY@!Y~HX"><field name="x_coordinate">1265</field><field name="y_coordinate">649</field></block></value><next><block type="place_block" id="0R{]X0`E`:jFi$F=Oudf"><field name="options1">tajMahal</field><field name="options2">India</field><next><block type="variable_holder" id="Aq+QaW%]IAS%ogM;e~${"><field name="countryName">UnitedStates</field><value name="NAME"><block type="xy" id="]qw~qxHc#1Ha1ABENRpm"><field name="x_coordinate">500</field><field name="y_coordinate">500</field></block></value><next><block type="place_block" id="c+i]m@ZxUSr#YLHxiQ,n"><field name="options1">statueOfLib</field><field name="options2">UnitedStates</field><next><block type="variable_holder" id="bm(rB`Dt39-ttN+YpXB/"><field name="countryName">Australia</field><value name="NAME"><block type="xy" id="U|h?hwQY9HOOI=8?r_6$"><field name="x_coordinate">1500</field><field name="y_coordinate">900</field></block></value><next><block type="place_block" id="#ZXlhG!0b%[_=b4o0~HT"><field name="options1">lotus</field><field name="options2">Australia</field></block></next></block></next></block></next></block></next></block></next></block></xml>',
        },
        {
            col1: `UK`,
            col2: ``,
            rescue: true,
            checkbox: true,
            workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="variable_holder" id="g)`%]AL[j7-a)qH!yFyd" x="52" y="-113"><field name="countryName">India</field><value name="NAME"><block type="xy" id="YbCA1lsnfRlHrY@!Y~HX"><field name="x_coordinate">1265</field><field name="y_coordinate">649</field></block></value><next><block type="place_block" id="0R{]X0`E`:jFi$F=Oudf"><field name="options1">tajMahal</field><field name="options2">India</field><next><block type="variable_holder" id="Aq+QaW%]IAS%ogM;e~${"><field name="countryName">UnitedStates</field><value name="NAME"><block type="xy" id="]qw~qxHc#1Ha1ABENRpm"><field name="x_coordinate">500</field><field name="y_coordinate">500</field></block></value><next><block type="place_block" id="c+i]m@ZxUSr#YLHxiQ,n"><field name="options1">statueOfLib</field><field name="options2">UnitedStates</field><next><block type="variable_holder" id="bm(rB`Dt39-ttN+YpXB/"><field name="countryName">Australia</field><value name="NAME"><block type="xy" id="U|h?hwQY9HOOI=8?r_6$"><field name="x_coordinate">1500</field><field name="y_coordinate">900</field></block></value><next><block type="place_block" id="#ZXlhG!0b%[_=b4o0~HT"><field name="options1">lotus</field><field name="options2">Australia</field><next><block type="variable_holder" id="am/zqu%njldM94K??20/"><field name="countryName">London</field><value name="NAME"><block type="xy" id="/+bNm3?wV!MN^xTNdyv["><field name="x_coordinate">900</field><field name="y_coordinate">450</field></block></value><next><block type="place_block" id="9vIJT*/`=$EnWxG}h9p]"><field name="options1">london</field><field name="options2">London</field></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></xml>',
        },
        {
            col1: `Egypt`,
            col2: ``,
            rescue: true,
            checkbox: true,
            workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="variable_holder" id="g)`%]AL[j7-a)qH!yFyd" x="52" y="-113"><field name="countryName">India</field><value name="NAME"><block type="xy" id="YbCA1lsnfRlHrY@!Y~HX"><field name="x_coordinate">1265</field><field name="y_coordinate">649</field></block></value><next><block type="place_block" id="0R{]X0`E`:jFi$F=Oudf"><field name="options1">tajMahal</field><field name="options2">India</field><next><block type="variable_holder" id="Aq+QaW%]IAS%ogM;e~${"><field name="countryName">UnitedStates</field><value name="NAME"><block type="xy" id="]qw~qxHc#1Ha1ABENRpm"><field name="x_coordinate">500</field><field name="y_coordinate">500</field></block></value><next><block type="place_block" id="c+i]m@ZxUSr#YLHxiQ,n"><field name="options1">statueOfLib</field><field name="options2">UnitedStates</field><next><block type="variable_holder" id="bm(rB`Dt39-ttN+YpXB/"><field name="countryName">Australia</field><value name="NAME"><block type="xy" id="U|h?hwQY9HOOI=8?r_6$"><field name="x_coordinate">1500</field><field name="y_coordinate">900</field></block></value><next><block type="place_block" id="#ZXlhG!0b%[_=b4o0~HT"><field name="options1">lotus</field><field name="options2">Australia</field><next><block type="variable_holder" id="am/zqu%njldM94K??20/"><field name="countryName">London</field><value name="NAME"><block type="xy" id="/+bNm3?wV!MN^xTNdyv["><field name="x_coordinate">900</field><field name="y_coordinate">450</field></block></value><next><block type="place_block" id="9vIJT*/`=$EnWxG}h9p]"><field name="options1">london</field><field name="options2">London</field><next><block type="variable_holder" id="*zu}*gySEp+Hw0B6T#Y="><field name="countryName">Egypt</field><value name="NAME"><block type="xy" id="aA!q):%d[#YQ)SYi?RiV"><field name="x_coordinate">1050</field><field name="y_coordinate">620</field></block></value><next><block type="place_block" id=".P=W`.:,(+!vjcCfro(V"><field name="options1">egypt</field><field name="options2">Egypt</field></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></xml>',
        },
        {
            col1: `Brazil`,
            col2: ``,
            rescue: true,
            checkbox: true,
            workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="variable_holder" id="g)`%]AL[j7-a)qH!yFyd" x="52" y="-113"><field name="countryName">India</field><value name="NAME"><block type="xy" id="YbCA1lsnfRlHrY@!Y~HX"><field name="x_coordinate">1265</field><field name="y_coordinate">649</field></block></value><next><block type="place_block" id="0R{]X0`E`:jFi$F=Oudf"><field name="options1">tajMahal</field><field name="options2">India</field><next><block type="variable_holder" id="Aq+QaW%]IAS%ogM;e~${"><field name="countryName">UnitedStates</field><value name="NAME"><block type="xy" id="]qw~qxHc#1Ha1ABENRpm"><field name="x_coordinate">500</field><field name="y_coordinate">500</field></block></value><next><block type="place_block" id="c+i]m@ZxUSr#YLHxiQ,n"><field name="options1">statueOfLib</field><field name="options2">UnitedStates</field><next><block type="variable_holder" id="bm(rB`Dt39-ttN+YpXB/"><field name="countryName">Australia</field><value name="NAME"><block type="xy" id="U|h?hwQY9HOOI=8?r_6$"><field name="x_coordinate">1500</field><field name="y_coordinate">900</field></block></value><next><block type="place_block" id="#ZXlhG!0b%[_=b4o0~HT"><field name="options1">lotus</field><field name="options2">Australia</field><next><block type="variable_holder" id="am/zqu%njldM94K??20/"><field name="countryName">London</field><value name="NAME"><block type="xy" id="/+bNm3?wV!MN^xTNdyv["><field name="x_coordinate">900</field><field name="y_coordinate">450</field></block></value><next><block type="place_block" id="9vIJT*/`=$EnWxG}h9p]"><field name="options1">london</field><field name="options2">London</field><next><block type="variable_holder" id="*zu}*gySEp+Hw0B6T#Y="><field name="countryName">Egypt</field><value name="NAME"><block type="xy" id="aA!q):%d[#YQ)SYi?RiV"><field name="x_coordinate">1050</field><field name="y_coordinate">620</field></block></value><next><block type="place_block" id=".P=W`.:,(+!vjcCfro(V"><field name="options1">egypt</field><field name="options2">Egypt</field><next><block type="variable_holder" id="j@G6vf(#2Jzp;p1_$*Jd"><field name="countryName">Brazil</field><value name="NAME"><block type="xy" id="6IHd)bAdr(_w/8cQol5R"><field name="x_coordinate">600</field><field name="y_coordinate">800</field></block></value><next><block type="place_block" id="qN2+:UF[er)z[^zdr!Zm"><field name="options1">brazil</field><field name="options2">Brazil</field></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></xml>',
        }]

    return {
        props: { dataParse, slug: context.params.slug, lessonDetails: lessonDetails.data.DATA[0], languageObj: languageObj, instruction },
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


    // user details
    const [userDetails, setUserDetails] = useState([]);
    const getUserDetails = async (otp: string | string[]) => {
        try {
            const body = {
                "sdUID": router.query.user_id
            }

            const userDetails = await axios({
                method: "post",
                url: `${urls.EduCobotBaseUrl}${urls.getStudents}`,
                data: body,
                headers: { "Content-Type": "application/json" },
            });
            {
                let newData = { ...userDetails.data.DATA[0], otp }
                setUserDetails(newData)
                // console.log("got user details")
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


    // whitebox rescue count logic
    let clickArray = [];
    const [clickcnt, setClickCnt] = useState(0);
    const [mount, setMount] = useState(false);

    function increamentClick(idx) {
        if (clickArray.includes(idx)) return;
        clickArray.push(idx)
        setClickCnt(c => c += 1);
    }

    useEffect(() => {
        if (mount) {
            const element: HTMLCollectionOf<Element> = document.getElementsByClassName("rescue_button_id");
            if (element.length) {
                // console.log(element);
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
    // const language = {English: 1, Hindi: 2, Marathi: 3, Spanish: 4, Arabic: 5, Swaheli: 6 }
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

    function FinalTask(value) {

        const user_id = router.query.user_id;
        let blocks = 0
        if (typeof window !== "undefined" && window['getNoOfBlocks'])
            blocks = window['getNoOfBlocks']();
        // fetch(`https://api.educobot.com/users/postEvalData`, {
        //     method: 'POST',
        //     headers: headers,
        //     body: JSON.stringify({
        //         timeTaken: timer,
        //         userID: user_id,//"d45c7cb9-831e-4a2c-9372-0b1f34a0fae6",
        //         lessonID: slug, blocks,
        //         coins: value
        //     })
        // }).then(res => res.json())
        //     .then(res => console.log(res))

    }


    // useEffect(() => {
    //     // instruction_activate();
    //     window[`instruction_activate`]();
    //     // document.getElementById('help_practice').modal();
    //     window[`modal`].modal();
    // }, []);

    useEffect(() => {
        window["slug"] = slug;
        if (typeof window !== "undefined" && window['updateImports']) {
            setImt([...window['updateImports']])
            //  window["update_rescue_workspace"] = update_rescue_workspace;
            // helpCode()
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


    function HelpCode() {
        var xmlDom = Blockly.Xml.workspaceToDom(Blockly.getMainWorkspace());
        var xmlText = Blockly.Xml.domToPrettyText(xmlDom);
        console.log(xmlText);
    }
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
                            {/* language.charAt(0).toUpperCase() + language.slice(1) */}
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
                userDetails={userDetails}
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
