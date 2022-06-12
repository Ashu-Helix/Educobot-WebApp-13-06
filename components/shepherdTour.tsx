import { ShepherdTour, Tour, TourMethods } from "react-shepherd";
import "shepherd.js/dist/css/shepherd.css";
import Blockly from "blockly";
import React, { CSSProperties, useEffect } from "react";
import M from "materialize-css";

var tour_over = false;
let playAudio = true;
let myInterval: NodeJS.Timeout;
let audio = new Audio();
let kill_audio = () => {
  if (!audio.paused) audio.pause();
};
var adapt_orientation_array = [];
const demoWorkspace = Blockly.getMainWorkspace();

let isPortrait = () => (screen.width <= 600 ? true : false);
let adapt_orientation = (portait, landscape) => {
  adapt_orientation_array.push([portait, landscape]);
  return isPortrait() ? portait : landscape;
};
// window.addEventListener('resize', () => {
//     for (let i = 0; i < tour.steps.length; i++) {
//         try {
//             tour.steps[i].options.attachTo.on = isPortrait() ?
//                 adapt_orientation_array[i][0] :
//                 adapt_orientation_array[i][1];
//         } catch (error) { true; }
//     }
// });

function image_scaler(file) {
  let path = "/assets/";
  return `<img src="` + path + file + `"class="tutorial_image">`;
}



function handPointAt(hand: any, element: any, visibility: string) {
  if (!element) return;

  let pos2 = {
    top: element.getBoundingClientRect().top,
    left: element.getBoundingClientRect().left,
  },
    ele_oh = element.outerHeight,
    ele_ow = element.outerWidth,
    h_oh = hand.outerHeight,
    h_ow = hand.outerWidth;

  if (ele_oh > h_oh) {
    pos2.top += (ele_oh - h_oh) / 2;
  } else {
    true;
  }
  if (ele_ow > h_ow) {
    pos2.left += (ele_ow - h_ow) / 2;
  }
  hand.style.visibility = visibility;
  hand.style.top = `${pos2.top}px`;
  hand.style.left = `${pos2.left}px`;
}
const hand = document.getElementById("hand");
function play_audio_tutorial(file) {
  if (!playAudio) return;
  kill_audio();
  let path = "/assets/audio/";
  try {
    audio = new Audio(path + file);
    audio.play();
  } catch (err) {
    console.error(err);
  }
}
const blockt = document.getElementsByClassName("blocklyToolboxCategory");
const dragBlock = document.getElementsByClassName("blocklyDraggable");
const mainWorkspace = Blockly.getMainWorkspace();

const handanimated = (hand: HTMLElement) => {
  let pos = {
    top: hand.getBoundingClientRect().top,
    left: hand.getBoundingClientRect().left,
  };
  hand.style.top = `${pos.top + 99}px`;
  hand.style.left = `${pos.left + 45}px`;
};
function t1() {
  clearInterval(myInterval);
  play_audio_tutorial("line4.mp3");
  const blocks = document.getElementsByClassName("blocklyDraggable");
  handPointAt(hand, blocks[0], "visible");
  let krr = false;
  myInterval = setInterval(function () {
    if (krr) {
      handPointAt(hand, blocks[0], "visible");
      krr = !krr;
    } else {
      handanimated(hand);
      krr = !krr;
    }
  }, 1500);
}

function t2() {
  let edit: any = document.getElementsByClassName("blocklyEditableText");
  clearInterval(myInterval);
  play_audio_tutorial("line6.mp3");
  myInterval = setInterval(function () {
    handPointAt(hand, edit[0], "visible");
  }, 100);
}

function t3() {
  let edit: any = document.getElementsByClassName("blocklyEditableText");
  clearInterval(myInterval);
  play_audio_tutorial("line8.mp3");
  myInterval = setInterval(function () {
    handPointAt(hand, edit[1], "visible");
  }, 100);
}

function t4() {
  clearInterval(myInterval);
  play_audio_tutorial("line10.mp3");
  handPointAt(hand, blockt[0], "visible");
}

function t5() {
  clearInterval(myInterval);
  play_audio_tutorial("line12.mp3");
  handPointAt(hand, dragBlock[2], "visible");
  let krr = false;
  myInterval = setInterval(function () {
    if (krr) {
      handPointAt(hand, dragBlock[2], "visible");
      krr = !krr;
    } else {
      handPointAt(hand, dragBlock[0], "visible");
      krr = !krr;
    }
  }, 1500);
}

function t6() {
  clearInterval(myInterval);
  play_audio_tutorial("line14.mp3");
  myInterval = setInterval(function () {
    handPointAt(hand, blockt[0], "visible");
  }, 100);
}

function t7() {
  clearInterval(myInterval);
  play_audio_tutorial("line16.mp3");
  let krr = false;
  handPointAt(hand, dragBlock[2], "visible");
  myInterval = setInterval(function () {
    if (krr) {
      handPointAt(hand, dragBlock[2], "visible");
      krr = !krr;
    } else {
      handPointAt(hand, dragBlock[1], "visible");
      krr = !krr;
    }
  }, 1500);
}

function t8() {
  clearInterval(myInterval);
  play_audio_tutorial("line16B.mp3");
  let edit: any = document.getElementsByClassName("blocklyEditableText");
  myInterval = setInterval(function () {
    handPointAt(hand, edit[3], "visible");
  }, 100);
}

function step2_val() {
  (Blockly as any).JavaScript.INFINITE_LOOP_TRAP = null;
  var codep = (Blockly as any).Python.workspaceToCode(mainWorkspace);
  if (codep == "bunny.left(10)\n") {
    return true;
  } else return false;
}

function step2_dirn_val() {
  (Blockly as any).JavaScript.INFINITE_LOOP_TRAP = null;
  var code = (Blockly as any).Python.workspaceToCode(demoWorkspace);
  if (code == "bunny.right(10)\n") {
    return true;
  } else return false;
}

function step2_steps_val() {
  (Blockly as any).JavaScript.INFINITE_LOOP_TRAP = null;
  var code = (Blockly as any).Python.workspaceToCode(demoWorkspace);
  if (code == "bunny.right(40)\n") {
    return true;
  } else return false;
}

function step3_val() {
  (Blockly as any).JavaScript.INFINITE_LOOP_TRAP = null;
  var code = (Blockly as any).Python.workspaceToCode(demoWorkspace);
  if (code == "bunny.right(40)\nbunny.eat_carrot()\n") {
    return true;
  } else return false;
}

function step4_val() {
  (Blockly as any).JavaScript.INFINITE_LOOP_TRAP = null;
  var code = (Blockly as any).Python.workspaceToCode(demoWorkspace);
  if (code == "bunny.right(40)\nbunny.eat_carrot()\nbunny.left(10)\n") {
    tour_over = true;
    return true;
  } else return false;
}

function step4_2_val() {
  (Blockly as any).JavaScript.INFINITE_LOOP_TRAP = null;
  var code = (Blockly as any).Python.workspaceToCode(demoWorkspace);
  if (code == "bunny.right(40)\nbunny.eat_carrot()\nbunny.left(40)\n") {
    tour_over = true;
    return true;
  } else return false;
}

let toolbox = null;
mainWorkspace.addChangeListener((event) => { });
function check_toolbox_selection(id) {
  try {
    if (toolbox === "Bunny") return true;
    else return false;
  } catch {
    return false;
  }
}

const tourOptions: any = {
  defaultStepOptions: {
    cancelIcon: {
      enabled: true,
    },
    classes: "class-1 class-2",
    scrollTo: { behavior: "smooth", block: "center" },
  },
  useModalOverlay: false,
};
function Start(props) {
  // React.useEffect(() => {
  //     if (props.startTour) {
  //         props.startTour.start()
  //         props.setTour(props.startTour)
  //     }
  // }, [])
  function startTour() {
    if (props.startTour) {
      props.startTour.start();
      props.setTour(props.startTour);
    }
  }
  return (
    <button onClick={startTour} style={STARTTOURStyle}>
      {svgIcon}
    </button>
  );
}
const STARTTOURStyle: CSSProperties = {
  position: "absolute",
  right: 0,
  bottom: "4px",
  background: "none",
  padding: 0,
  border: "none",
};
const svgIcon = (
  <svg
    width="72"
    height="108"
    viewBox="0 0 72 108"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M32 0C14.3269 0 0 14.3269 0 32C0 49.6731 14.3269 64 32 64H67V100C67 104.418 70.5817 108 75 108H360C364.418 108 368 104.418 368 100V8C368 3.58172 364.418 0 360 0H67.4842H67H32Z"
      fill="#FF4842"
    />
    <path
      d="M49.5593 19H24.2527C22.5129 19 21.1052 20.35 21.1052 22L21.0894 49L27.416 43H49.5593C51.2991 43 52.7226 41.65 52.7226 40V22C52.7226 20.35 51.2991 19 49.5593 19ZM30.5793 37H27.416V34H30.5793V37ZM30.5793 32.5H27.416V29.5H30.5793V32.5ZM30.5793 28H27.416V25H30.5793V28ZM40.0693 37H35.3243C34.4544 37 33.7426 36.325 33.7426 35.5C33.7426 34.675 34.4544 34 35.3243 34H40.0693C40.9392 34 41.6509 34.675 41.6509 35.5C41.6509 36.325 40.9392 37 40.0693 37ZM44.8143 32.5H35.3243C34.4544 32.5 33.7426 31.825 33.7426 31C33.7426 30.175 34.4544 29.5 35.3243 29.5H44.8143C45.6842 29.5 46.3959 30.175 46.3959 31C46.3959 31.825 45.6842 32.5 44.8143 32.5ZM44.8143 28H35.3243C34.4544 28 33.7426 27.325 33.7426 26.5C33.7426 25.675 34.4544 25 35.3243 25H44.8143C45.6842 25 46.3959 25.675 46.3959 26.5C46.3959 27.325 45.6842 28 44.8143 28Z"
      fill="white"
    />
  </svg>
);

function ShepherdCustomTour(props) {
  const [tour, setTour] = React.useState<Tour>(null);
  const [toolbar, setToolbar] = React.useState(false);

  const tut: any[] = props.tut.map(
    (data) => `<p><span style="color: rgb(239, 239, 239); font-family: Verdana, Geneva, sans-serif; font-size: 20px;">
        ${data}
        </span></p>`
  );

  useEffect(() => {
    document.getElementById("soundBtn").addEventListener("click", () => {
      if (playAudio) {
        kill_audio();
      }
      playAudio = !playAudio;
    });

    return document
      .getElementById("soundBtn")
      .removeEventListener("click", () => { });
  }, []);

  useEffect(() => {
    if (tour)
      mainWorkspace.addChangeListener((event) => {
        if (event.type == Blockly.Events.TOOLBOX_ITEM_SELECT) {
          if (event.newItem !== "Bunny") {
            toolbox = null;
            return;
          }
          toolbox = event.newItem;
          setToolbar(true);
          if (
            tour.getCurrentStep().id === "Step1" ||
            tour.getCurrentStep().id === "Step3" ||
            tour.getCurrentStep().id === "Step4"
          )
            tour.next();

        }

        if (event.type == Blockly.Events.BLOCK_CHANGE) {
          //Step2.1
          if (event.name === "direction" && event.newValue === "right") {
            clearInterval(myInterval);
            if (step2_dirn_val()) {
              t3();
              return tour.next();
            } else M.toast({ html: "Wrong block or values selected!" });
          }
          //Step2.2 ,Step4.2
          else if (event.name === "STEPS" && event.newValue === "40") {
            clearInterval(myInterval);
            if (tour.getCurrentStep().id !== "Step4.2") t4();
            return tour.next();
          } else M.toast({ html: "Wrong block or values selected!" });
        }
        if (event.type == Blockly.Events.SELECTED) {
          const block = mainWorkspace.getBlockById(event.newElementId);
          if (tour.getCurrentStep().id === "Step2.0") {
            if (block?.type === "move") {
              clearInterval(myInterval);
              if (step2_val()) {
                t2();
                return tour.next();
              } else M.toast({ html: "Wrong block or values selected!" });
            } else if (block?.type === "eatcarrot") {
              tour.back();
              clearInterval(myInterval);
              handPointAt(hand, blockt[0], "visible");
              M.toast({ html: "Wrong block or values selected!" });
            }
          }

          if (tour.getCurrentStep().id === "Step3.1") {
            if (block?.type === "eatcarrot") {
              clearInterval(myInterval);
              return tour.next();
            } else M.toast({ html: "Wrong block or values selected!" });
          }

          if (tour.getCurrentStep().id === "Step4.1") {
            clearInterval(myInterval);
            if (block?.type === "move") {
              t8();
              return tour.next();
            } else M.toast({ html: "Wrong block or values selected!" });
          }
        }
      });
  }, [tour]);
  const newSteps = [
    {
      eval() {
        return false;
      },
      title: "Task",
      arrow: true,
      text: image_scaler("Task.png"),
      buttons: [
        {
          action() {
            return this.back();
          },
          classes: "shepherd-button-secondary",
          text: "Cancel",
          type: "cancel",
        },
        {
          action() {
            handPointAt(hand, blockt[0], "visible");
            play_audio_tutorial("line2.mp3");
            return this.next();
          },
          text: "Next",
        },
      ],
      id: "Task",
    },
    {
      title: "Step 1",
      text: tut[1],
      arrow: true,
      attachTo: {
        element: "#sprite",
        on: adapt_orientation("bottom", "bottom"),
      },
      buttons: [
        {
          action() {
            clearInterval(myInterval);
            handPointAt(hand, blockt[0], "hidden");
            return check_toolbox_selection("blockly-0") ? this.back() : false;
          },
          classes: "shepherd-button-secondary",
          text: "Back",
        },
        {
          text: "Next",
          type: "next",
        },
      ],
      id: "Step1",
    },
    {
      eval() {
        return step2_val();
      },
      title: "Step 2.0",
      text: tut[2],
      arrow: true,
      attachTo: {
        element: "#sprite",
        on: adapt_orientation("bottom", "bottom"),
      },
      buttons: [
        {
          action() {
            play_audio_tutorial("line2.mp3");
            clearInterval(myInterval);
            handPointAt(hand, blockt[0], "visible");
            return this.back();
          },
          classes: "shepherd-button-secondary",
          text: "Back",
        },
        { text: "Next" },
      ],
      when: {
        show: () => {
          t1();
        },
        hide: () => { },
      },
      id: "Step2.0",
    },
    {
      eval() {
        return step2_dirn_val();
      },
      title: "Step 2.1 _ Set Direction",
      text: tut[3],
      arrow: true,
      attachTo: {
        element: "#sprite",
        on: adapt_orientation("bottom", "bottom"),
      },
      buttons: [
        {
          action() {
            t1();
            return this.back();
          },
          classes: "shepherd-button-secondary",
          text: "Back",
        },
        {
          text: "Next",
        },
      ],
      id: "Step2.1",
    },
    {
      eval() {
        return step2_steps_val();
      },
      title: "Step 2.2 - Set Number of Steps",
      text: tut[4],
      arrow: true,
      attachTo: {
        element: "#sprite",
        on: adapt_orientation("bottom", "bottom"),
      },
      buttons: [
        {
          action() {
            t2();
            return this.back();
          },
          classes: "shepherd-button-secondary",
          text: "Back",
        },
        {
          text: "Next",
        },
      ],
      id: "Step2.2",
    },
    {
      eval() {
        return check_toolbox_selection("blockly-0");
      },
      title: "Step 3",
      text: tut[5],
      arrow: true,
      attachTo: {
        element: "#sprite",
        on: adapt_orientation("bottom", "bottom"),
      },
      buttons: [
        {
          action() {
            t3();
            return this.back();
          },
          classes: "shepherd-button-secondary",
          text: "Back",
        },
        {
          action() {
            t5();
            return this.next();
          },
          text: "Next",
        },
      ],
      id: "Step3",
    },
    {
      eval() {
        return step3_val();
      },
      title: "Step 3.1",
      text: tut[6],
      arrow: true,
      attachTo: {
        element: "#sprite",
        on: adapt_orientation("bottom", "bottom"),
      },
      buttons: [
        {
          action() {
            t4();
            return this.back();
          },
          classes: "shepherd-button-secondary",
          text: "Back",
        },
        {
          text: "Next",
        },
      ],
      when: {
        show: () => {
          t5();
        },
        hide: () => { },
      },
      id: "Step3.1",
    },
    {
      eval() {
        return check_toolbox_selection("blockly-0");
      },
      title: "Step 4",
      text: tut[7],
      arrow: true,
      attachTo: {
        element: "#sprite",
        on: adapt_orientation("bottom", "bottom"),
      },
      buttons: [
        {
          action() {
            t5();
            return this.back();
          },
          classes: "shepherd-button-secondary",
          text: "Back",
        },
        {
          action() {
            t7();
            return this.next();
          },
          text: "Next",
        },
      ],
      when: {
        show: () => {
          t6();
        },
        hide: () => { },
      },
      id: "Step4",
    },
    {
      eval() {
        return step4_val();
      },
      title: "Step 4.1",
      text: tut[8],
      arrow: true,
      attachTo: {
        element: "#sprite",
        on: adapt_orientation("bottom", "bottom"),
      },
      buttons: [
        {
          action() {
            t6();
            return this.back();
          },
          classes: "shepherd-button-secondary",
          text: "Back",
        },
        {
          action() {
            clearInterval(myInterval);
            if (step4_val()) {
              t8();
              return this.next();
            } else M.toast({ html: "Wrong block or values selected!" });
          },
          text: "Next",
        },
      ],
      when: {
        show: () => {
          t7();
        },
        hide: () => { },
      },
      id: "Step4.1",
    },
    {
      eval() {
        return step4_2_val();
      },
      title: "Step 4.2",
      text: tut[9],
      arrow: true,
      attachTo: {
        element: "#sprite",
        on: adapt_orientation("bottom", "bottom"),
      },
      buttons: [
        {
          action() {
            t7();
            return this.back();
          },
          classes: "shepherd-button-secondary",
          text: "Back",
        },
        {
          text: "Next",
        },
      ],
      id: "Step4.2",
    },
    {
      eval() {
        return false;
      },
      title: "Nicee, run it now!",
      text: tut[10],
      arrow: true,
      attachTo: {
        element: "#circle",
        on: adapt_orientation("top-start", "left-start"),
      },
      buttons: [
        {
          action() {
            t7();
            return this.back();
          },
          classes: "shepherd-button-secondary",
          text: "Back",
        },
        {
          action() {
            return this.next();
          },
          text: "Close",
        },
      ],
      when: {
        show() {
          clearInterval(myInterval);
          const runbtn = document.getElementById("runbtn");
          handPointAt(hand, runbtn, "visible");
          play_audio_tutorial("line18.mp3");
          runbtn.addEventListener("click", () => {
            this.complete();
            hand.remove();
          });
        },
        hide() {
          document
            .getElementById("runbtn")
            .removeEventListener("click", () => { });
        },
      },
      id: "run",
    },
  ];

  return (
    <div>
      <ShepherdTour steps={newSteps} tourOptions={tourOptions}>
        <TourMethods>
          {(tourContext) => <Start startTour={tourContext} setTour={setTour} />}
        </TourMethods>
      </ShepherdTour>
    </div>
  );
}

export default ShepherdCustomTour;
