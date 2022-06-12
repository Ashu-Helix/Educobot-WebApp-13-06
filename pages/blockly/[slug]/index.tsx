import { useEffect, useState } from "react";
import type { NextPage } from "next";
import Router, { useRouter } from "next/router";
import Image from "next/image";
import dynamic from "next/dynamic";
import { GetStaticPaths, GetStaticProps } from "next/types";
import { existsSync, writeFileSync } from "fs";
import Canvas from "../../../components/Canvas";
import styles from "../../../styles/Problems.module.css";
import TestDialog from "../../../MyComponents/DialogBoxes/TutorialDialog";
import * as XLSX from "xlsx";
import path from "path";
const Blocky = dynamic(import("../../../components/Blocky"), { ssr: false });
const Tour = dynamic(import("../../../components/Tour"), { ssr: false });
import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";
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
    console.log(context.params.slug == staticSlug[i]);
    context.params.slug === staticSlug[i] ? index = i : 0
  })

  const wsname = readedData.SheetNames[index];
  console.log(index, context.params.slug, 57)
  const ws = readedData.Sheets[wsname];

  /* Convert array to json*/
  const dataParse: any[] = XLSX.utils.sheet_to_json(ws, { header: 1 });
  /* const blockPath = path.join(process.cwd(), "public", "block");
   const animPath = path.join(process.cwd(), "public", "anim");
 
   const blockFileName = path.join(
     blockPath,
     `${context.params.slug}_Blocks.js`
   );
   const animFileName = path.join(animPath, `${context.params.slug}.js`);
   if (!existsSync(blockFileName) && existsSync(animFileName)) {
     const res = await fetch(
       `${process.env.SERVER_URL}/files/${context.params.slug}.js`
     );
     const anim = await res.text();
 
     const res1 = await fetch(
       `${process.env.SERVER_URL}/blocks/${context.params.slug}_Blocks.js`
     );
     const block = await res1.text();
 
     if (!existsSync(blockFileName)) {
       writeFileSync(blockFileName, block);
     }
 
     if (!existsSync(animFileName)) {
       writeFileSync(animFileName, anim);
     }
   }
   */

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
  const [javascriptCode, setJavascriptCode] = useState("");
  const [PythonCode, setPythonCode] = useState("");
  const McqData = require(`../../../public/mcq/${slug}Mcq.js`);
  const tut: any[] = dataParse.map(data => (data[lang]))
  const [imt, setImt] = useState([]);
  const [timer, setTimer] = useState(0);
  const router = useRouter();
  let startAnimating: () => void;

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
    // tut.shift();
    window["language"] = tut.shift().toLowerCase();
    // .shift().toLowerCase();

    window['tutorials'] = tut
    window['loadAgain']()
  }


  return (
    <>
      <div className={styles.lessonDetailsDiv}>
        <div className={styles.lessonTitle}>
          <Button
            style={{
              // backgroundColor: theme.palette.grey[200],
              color: "#000",
              minWidth: "50px",
              padding: "6px 0px",
            }}
          >
            <Icon style={{ color: "#fff", fontSize: "18px", }} icon="eva:arrow-ios-back-fill" />
          </Button>
          <p style={{ fontSize: "18px", fontWeight: "700", fontFamily: "Public Sans" }}>{lessonDetails.lsName}</p>
          <p style={{ fontSize: "14px", fontWeight: "300", fontFamily: "Public Sans" }}>{lessonDetails.lsDesc}</p>
        </div>
        <div className="select_languageDiv">
          <select className={`${styles.select_language}`} value={lang} onChange={onChange}>
            {
              Object.keys(language).map(key => <option key={key} value={`${language[key]}`}>{key}</option>)
            }
          </select>
        </div>
      </div>
      <div
        style={{
          display: "grid",
          height: "100%",
          gridTemplateColumns: "repeat(2, 1fr)",
        }}
      >
        <div id="blocklyDiv">
          <Blocky
            childFunc={childFunc}
            slug={slug}
            setPythonCode={setPythonCode}
          />
        </div>
        <div
          // id="circle"
          // className={styles.canvas}
          style={{ padding: "0 1rem" }}
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
                src="/assets/run_button_icon_landscape.png"
                width="30"
                height="30"
              />
            </button>
            <button
              className={`${styles.normal_button} `}
              data-position="bottom"
              data-tooltip="Reset Output"
              onClick={() => setReset(!reset)}
            >
              <img src="/assets/reset_button_icon.png" width="30" height="30" />
            </button>
            <button
              className={`${styles.normal_button}  ${styles.sound}`}
              data-position="bottom"
              data-tooltip="Open Keyboard"
              id="soundBtn"
              onClick={() => {
                if (typeof window !== 'undefined' && window['setAudioPreference'])
                  window['setAudioPreference']()
                setMute(!muteState)
              }}
            >
              <img
                src={muteState ? "/assets/mute.png" : "/assets/unmute.png"}
                width="30"
                height="30"
              />
            </button>
            {/* <select className={`${styles.select_language}`} value={lang} onChange={onChange}>
              {
                Object.keys(language).map(key => <option
                  key={language[key]}
                  value={`${language[key]}`}>
                  {key}
                </option>)
              }
            </select> */}
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
            //file={canvasFile}
            />
          }
          <div
            id="pycode"
            className={styles.output}
            style={{ minHeight: "9vh" }}
          >
            {imt.map(res => {
              return (<><b style={{ color: "#fff", display: "contents" }}>
                import {res}
              </b>
                <br /></>)
            })}
            {PythonCode}
          </div>
          <TestDialog
            slug={slug}
            getCoins={FinalTask}
            lessonDetails={lessonDetails}
            testDialogInfo={{
              dialogStatus: "test",
            }}
          />
        </div>
      </div>

      <Tour slug={slug} />
      <label id="hand" htmlFor="test">
        <img src="/assets/hand_upward.png" width="50px" height="60px" />
      </label>
      {/* <ShepherdTour tut={tut} /> */}
    </>
  );
};
export default Home;
