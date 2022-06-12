import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useState } from "react";
import styles from "../../../styles/Problems.module.css";
import Image from "next/image";
import dynamic from "next/dynamic";
import KeyBoardContainer from "../../../components/KeyBoardContainer";
import ScriptDialog from "../../../MyComponents/DialogBoxes/ScriptMcqDialog";

const PythonCode = dynamic(import("../../../components/pythonCode"), {
  ssr: false,
});
import { GetServerSideProps, GetStaticProps } from "next/types";

export const getServerSideProps: GetServerSideProps = async (context) => {

  const response1 = await fetch(`https://app.educobot.com/liveLessons/python/${context.params.id}/code.json`);
  if (response1.status === 404) {
    return {
      notFound: true,
    }
  }
  let res = await response1.json() ?? "";
  let { code, guide, type } = res
  return {
    props: { id: context.params.id, code, guide, type },
  };

}
export default function Scripts(props) {
  const { id, code, guide, type } = props;
  //const [script, setScript] = useState(``);
  let script = ''
  const [reset, setReset] = useState(false);
  const [keyboardState, setkeyboardState] = useState(false);
  // const [isCompleted, setisCompleted] = useState(false)

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     let completed = 
  //     if (completed()) {
  //       document.getElementById("openTest").click();
  //       clearInterval(interval);
  //     }
  //   }, 2000);
  //   return () => clearInterval(interval);
  // }, []);

  const onLoad = () => {
    let tutorial = require("../../../tutorial/tutorial.js");
    const { tutorial_guide_updater, make_pred_guide } = tutorial;
    tutorial_guide_updater(id, user_code);
    guide.forEach(g => make_pred_guide(g.id, g.img, g.code, g.audio, id, type))
    htmlmaker(code, user_code);
    if (typeof window !== "undefined") {
      const script = require("../../../skulpt/worker");
      const { runIt } = script;
      runIt("");
    }
    document.getElementsByClassName("CodeMirror-cursors")[0]?.remove();
  };
  const user_code = [];
  const setScript1 = (input) => {
    console.log(input)
    if (input === "{bksp}")
      user_code.pop()
    else {
      user_code.push(input)
      script = input
    }
    htmlmaker(code, user_code)
  }
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
    tutorial_guide_updater(id, user_code);
  }

  const handleClick = () => {
    if (typeof window !== "undefined") {
      const script = require("../../../skulpt/worker");
      const { runIt } = script;
      console.log(user_code);
      const py = user_code.join('');
      runIt(py, code)
      let interval = setTimeout(() => {
        console.log(script.completedFlag());
        if (script.completedFlag()) {
          document.getElementById("openTest").click();
        }
        clearInterval(interval);
      }, 5000);
      // document.getElementById("runbtn").click();
    }
  };

  const help = () => {
    const tutorial = require("../../../tutorial/tutorial.js");
    const { helpCode } = tutorial;
    helpCode(id, user_code);
  };

  const handleKeyDown = (_, e) => {
    e.preventDefault();
    //console.log(user_code);
    if (user_code.length < code.length) {
      if (
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-=!@#$%^&*()_+[]{}\\|'\";:.>,</?`~".includes(
          e.key
        )
      )
        user_code.push(e.key);

      if (e.key === " ") {
        user_code.push(" ");
      }
      if (e.key === "Tab") {
        user_code.push(" ");
        user_code.push(" ");
        user_code.push(" ");
        user_code.push(" ");
      }
      if (e.key === "Enter") {
        user_code.push("\n");
      }
    }
    if (e.key === "Backspace") user_code.pop();

    htmlmaker(code, user_code);
  };

  function runCodeForce() {
    code.split("").forEach(w => user_code.push(w));
    htmlmaker(code, user_code);
  }

  return (
    <>
      <div className={styles.container}>
        <PythonCode
          language="python"
          theme="material"
          handleKeyDown={handleKeyDown}
          onLoad={onLoad}
          className={styles.editor}
        />

        <div id="" className={styles.canvas_for_script}>
          <div className={styles.neumorphic_button_container}>
            <button
              className={`${styles.neumorphic_button}  ${styles.tooltip}`}
              data-position="bottom"
              data-tooltip="Run Code"
              id="runbtn"
              onClick={handleClick}
            >
              <span className={`${styles.tooltiptext}`}>Run Scritp</span>
              <Image
                src="/assets/run_button_icon_landscape.png"
                width="30"
                height="30"
              />
            </button>
            <button
              className={`${styles.neumorphic_button}  ${styles.tooltip}`}
              data-position="bottom"
              data-tooltip="Reset Output"
              // onClick={() => setReset(!reset)}
              onClick={() => { user_code.splice(0, user_code.length); htmlmaker(code, user_code); }}
            >
              <span className={`${styles.tooltiptext}`}>Run Scritp</span>
              <img src="/assets/reset_button_icon.png" width="30" height="30" />
            </button>
            <button
              className={`${styles.neumorphic_button}  ${styles.tooltip}`}
              data-position="bottom"
              data-tooltip="Help"
              onClick={help}
            >
              <span className={`${styles.tooltiptext}`}>Help</span>
              <img src="/assets/help_button_icon.png" width="30" height="30" />
            </button>
            <button
              id="keyboardbutton"
              className={`${styles.neumorphic_button}  ${styles.tooltip}`}
              data-position="bottom"
              data-tooltip="Open Keyboard"
              onClick={() => setkeyboardState(!keyboardState)}
            >
              <span className={`${styles.tooltiptext}`}>Open Keyboard</span>
              <img src="/assets/Keyboard.png" width="30" height="30" />
            </button>
            <button
              id="autofill"
              className={`${styles.neumorphic_button}  ${styles.tooltip}`}
              data-position="bottom"
              data-tooltip="Demo Run Code"
              onClick={runCodeForce}
            >
              <span className={`${styles.tooltiptext}`}>Reset Scritp</span>
              <img
                src="/assets/Auto_fill_button_icon.png"
                width="30"
                height="30"
              />
            </button>
          </div>
          <div id="output" className={styles.output_for_script} />
          <ScriptDialog
            testDialogInfo={{
              dialogStatus: "test",
            }}
          />
          <dialog id="modal" />
        </div>
        {keyboardState && (
          <KeyBoardContainer script={script} setScript={(value) => setScript1(value)} />
        )}
      </div>
    </>
  );
}
