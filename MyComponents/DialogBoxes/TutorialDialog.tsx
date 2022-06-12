import { useEffect, useState } from "react";
// @mui
import { styled } from "@mui/material/styles";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Rating,
  Box,
  Typography,
  RadioGroup,
  Radio,
  FormControlLabel,
  Snackbar,
  Alert,
} from "@mui/material";

// import SuccessDialog from "./successDialog";
import MotivationIllustration from "../assets/illustration_motivation";

import Icon_StarFullNew from "../assets/Icon_starFullNew";
import Icon_StarEmptyNew from "../assets/Icon_starEmptyNew";
import Confetti from "react-confetti";
import { unstable_useForkRef } from "@mui/utils";
// import { turn } from "../../components/helpers/dog";
import { useRouter } from "next/router";

// ----------------------------------------------------------------------

const StyledRating = styled(Rating)({
  "& .MuiRating-icon": {
    // color: "#fff",
  },
  // "& .MuiRating-iconFilled": {
  //   color: "#fff",
  //   padding: "2px",
  // },
  //   "& .MuiRating-iconHover": {
  //     color: "#000",
  //   },
});

type Props = {
  getCoins: (value) => void
  slug: any;
  testDialogInfo: {
    dialogStatus: String;

  };
};
export default function TestDialog({ getCoins, testDialogInfo, slug }: Props) {
  const [widthState, setWidthState] = useState(0);
  const [heightState, setHeightState] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  //const { dialogStatus, questionArray } = testDialogInfo;
  const [open, setOpen] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [marks, setMarks] = useState(0);
  const [userQuestionPaper, setuserQuestionPaper] = useState([]);
  // const [showError, setShowError] = useState(false);
  const router = useRouter();
  const [questionArray, setQuestionArray] = useState([]);
  const [disabledBtn, setDisabledBtn] = useState(true);
  // let questionArray = require(`../../public/mcq/${slug}Mcq.js`).mcqArr;

  // console.log(questionArray)
  const previousQuestion = () => {
    if (questionIndex !== 0) {
      setDisabledBtn(false);
      setQuestionIndex(questionIndex - 1);
    }
  };
  const nextQuestion = () => {
    if (questionIndex !== questionArray.length - 1) {
      if (userQuestionPaper[questionIndex] !== undefined) {
        setQuestionIndex(questionIndex + 1);
        setDisabledBtn(true);
      }
      // else {
      //   setShowError(true);
      // }
    }
  };

  useEffect(() => {
    if (userQuestionPaper[questionIndex]?.id) {
      setDisabledBtn(false);
    }
  }, [questionIndex]);

  const evaluateTutorial = () => {
    let obtainedMarks = 0;
    userQuestionPaper.forEach((obj, index) => {
      console.log(
        "From TestDialog",
        obj.answer + " " + questionArray[index].correct_answer
      );
      if (String(obj.answer) === String(questionArray[index].correct_answer)) {
        console.log("Correct Answer");
        obtainedMarks = obtainedMarks + 1;
      }
    });
    if (getCoins)
      getCoins(obtainedMarks)
    setMarks(obtainedMarks);
  };

  const setActualWidthHeight = () => {
    setWidthState(window.innerWidth);
    setHeightState(window.innerHeight);
  };

  useEffect(() => {
    setActualWidthHeight();
    window.addEventListener("resize", setActualWidthHeight);
    try {
      setQuestionArray([...require(`../../game/${slug}/Mcq`).mcqArr])
    } catch (err) {
      console.log(err)
    }
    // questionArray = require(`../../public/mcq/${slug}Mcq.js`).mcqArr;
    // try {
    //   questionArray = require(`../../public/mcq/${slug}Mcq.js`).mcqArr
    // } catch (err) {
    //   // setTimeout(() => {
    //   //   questionArray = require(`../../public/mcq/${slug}Mcq.js`).mcqArr
    //   // }, 3000);
    //   router.reload();
    // }

    return () => {
      window.removeEventListener("resize", setActualWidthHeight);
    };
  }, []);

  const selectAnswer = (event: any) => {
    //   var result = userQuestionPaper.find((obj) => {
    //     return obj.id === questionIndex + 1;
    //   });
    setDisabledBtn(false);
    const itemIndex = userQuestionPaper.findIndex(
      (obj) => obj.id === questionIndex + 1
    );

    //   console.log("Item Index", itemIndex);

    if (itemIndex > -1) {
      const newLists = userQuestionPaper.map((obj, index) => {
        if (index === itemIndex) {
          return {
            id: questionArray[questionIndex].id,
            answer: event.target.value,
          };
        }
        return obj;
      });
      setuserQuestionPaper(newLists);
    } else {
      setuserQuestionPaper([
        ...userQuestionPaper,
        {
          id: questionArray[questionIndex].id,
          answer: event.target.value,
        },
      ]);
    }
  };

  // const closeError = (
  //   event?: React.SyntheticEvent | Event,
  //   reason?: string
  // ) => {
  //   if (reason === "clickaway") {
  //     return;
  //   }

  //   setShowError(false);
  // };
  return (
    <>
      <div>
        <Button
          color="info"
          variant="outlined"
          id="openTest"
          onClick={() => {
            setOpen("test");
          }}
          sx={{ display: "none" }}
        >
          Take Test
        </Button>

        <Dialog
          open={open === "test"}
          BackdropProps={{ invisible: true }}
          PaperProps={{
            style: {
              backgroundColor: "#212B36",
              padding: "0rem 2rem",
            },
          }}
        // onClose={handleClose}
        >
          <DialogTitle
            sx={{
              textAlign: "center",
              fontSize: { md: "20px", xs: "18px" },
              color: "#fff",
              padding: "2rem",
              fontWeight: 600,
            }}
            fontFamily={"Public Sans"}
          >
            {"Code written successfully"}
          </DialogTitle>
          <DialogContent
            sx={{
              padding: "0",
            }}
          >
            <MotivationIllustration
              sx={{
                p: 3,
                // width: { md: 360, sm: 340, xs: 255 },
                width: "90%",
                margin: "auto",
              }}
            />

            <Typography
              variant="subtitle1"
              sx={{
                textAlign: "center",
                padding: "0rem 1rem",
                fontWeight: 400,
                fontSize: "16px",
                color: "#fff",
              }}
              fontFamily={"Public Sans"}
            >
              {"Click below button to start test."}
            </Typography>
          </DialogContent>
          <DialogActions
            sx={{
              justifyContent: "center",
              padding: "2rem",
            }}
          >
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#3366ff",
                fontSize: "16px",
                padding: "0.5rem 1.2rem",
                borderRadius: "8px",
                textTransform: "none",
                fontFamily: "Public Sans"
              }}
              onClick={() => {
                setOpen("first");
                // window.location.href = "/";
              }}
              autoFocus
            >
              Take Test
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={open === "first"}
          // onClose={handleClose}
          PaperProps={{
            style: {
              backgroundColor: "#212B36",
              padding: "0rem 2rem",
              minWidth: 310,
            },
          }}
        >
          <DialogTitle
            sx={{
              textAlign: "center",
              fontSize: "18px",
              backgroundColor: "#212B36",
              color: "#fff",
              padding: "2rem",
              fontWeight: 600,
            }}
            fontFamily={"Public Sans"}
            fontSize={18}
          >
            {"True or False?"}
          </DialogTitle>
          <DialogContent sx={{ backgroundColor: "#212B36", padding: "0" }}>
            <Typography
              variant="subtitle1"
              sx={{
                textAlign: "center",
                padding: "0rem 1rem",
                fontWeight: 400,
                textDecoration: "underline",
                color: "#fff",
                fontSize: "16px",
              }}
              fontFamily={"Public Sans"}
            >
              {questionArray.length > 0 && `Question ${questionArray[questionIndex].id} of ${questionArray.length}`}
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                textAlign: "center",
                padding: { md: "0rem 2rem", xs: "0rem 0rem" },
                color: "#fff",
                fontWeight: 600,
                fontSize: "16px",
              }}
              fontFamily={"Public Sans"}
            >
              {questionArray.length > 0 && `${questionArray[questionIndex].question}`}
            </Typography>


            {userQuestionPaper[questionIndex] !== undefined ? (
              <RadioComp
                value={userQuestionPaper[questionIndex].answer}
                selectAnswer={selectAnswer}
                currectQuestion={questionArray[questionIndex]}
              />
            ) : (
              <RadioComp
                value={"none"}
                selectAnswer={selectAnswer}
                currectQuestion={questionArray[questionIndex]}
              />
            )}
          </DialogContent>
          <DialogActions
            sx={{
              justifyContent: "center",
              backgroundColor: "#212B36",
              padding: "2rem 0",
            }}
          >
            {questionIndex !== questionArray.length - 1 ? (
              <>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={previousQuestion}
                  sx={{
                    fontSize: "16px",
                    borderRadius: "8px",
                    textTransform: "none",
                    color: "#fff",
                    fontFamily: "Public Sans"
                  }}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#3366ff",
                    fontSize: "16px",
                    borderRadius: "8px",
                    textTransform: "none",
                    fontFamily: "Public Sans"
                  }}
                  onClick={nextQuestion}
                  disabled={disabledBtn}
                  autoFocus
                >
                  Next
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={previousQuestion}
                  sx={{
                    fontSize: "16px",
                    borderRadius: "8px",
                    textTransform: "none",
                    color: "#fff",
                    fontFamily: "Public Sans"
                  }}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#3366ff",
                    fontSize: "16px",
                    borderRadius: "8px",
                    textTransform: "none",
                    fontFamily: "Public Sans"
                  }}
                  onClick={() => {
                    evaluateTutorial();
                    setOpen("second");
                    setShowConfetti(true);
                  }}
                  disabled={disabledBtn}
                  autoFocus
                >
                  Save and Exit
                </Button>

              </>
            )}
          </DialogActions>
        </Dialog>

        <Dialog
          open={open === "second"}
          BackdropProps={{ invisible: true }}
          PaperProps={{
            style: {
              backgroundColor: "#212B36",
              padding: "0rem 2rem",
              maxWidth: 450,
            },
          }}
        // onClose={handleClose}
        >
          <DialogTitle
            sx={{
              textAlign: "center",
              fontSize: { md: "20px", xs: "18px" },
              color: "#fff",
              padding: "2rem",
              fontWeight: 600,
            }}
            fontFamily={"Public Sans"}
          >
            {"Code written successfully"}
          </DialogTitle>
          <DialogContent
            sx={{
              padding: "0",
            }}
          >
            <MotivationIllustration
              sx={{
                p: 3,
                // width: { md: 360, sm: 340, xs: 255 },
                width: "90%",
                margin: "auto",
              }}
            />

            <Box
              sx={{
                display: "block",
                textAlign: "center",
                marginBottom: "1rem",
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  marginBottom: "0.2rem",
                  color: "#fff",
                  fontSize: "18px",
                  fontWeight: 600,
                }}
                fontFamily={"Public Sans"}
              >
                {`Coins earned`}
              </Typography>

              <StyledRating
                name="read-only"
                value={marks}
                precision={0.5}
                style={{
                  width: "140px",
                  display: "flex",
                  justifyContent: "space-between",
                  margin: "auto",
                }}
                icon={<Icon_StarFullNew width={24} height={24} />}
                emptyIcon={<Icon_StarEmptyNew width={24} height={24} />}
                readOnly
              />
            </Box>

            <Typography
              variant="subtitle1"
              sx={{
                textAlign: "center",
                padding: "0rem 1rem",
                fontWeight: 400,
                fontSize: "16px",
                color: "#fff",
              }}
              fontFamily={"Public Sans"}
            >
              {
                "With this lesson, you have learned the basics of <tag1>, <tag2> and <tag3>."
              }
            </Typography>
          </DialogContent>
          <DialogActions
            sx={{
              justifyContent: "center",
              padding: "2rem",
            }}
          >
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#3366ff",
                fontSize: "16px",
                padding: "0.5rem 1.2rem",
                borderRadius: "8px",
                textTransform: "none",
                fontFamily: "Public Sans"
              }}
              onClick={() => {
                router.push("http://localhost:3001/dashboard/app/");
              }}
              autoFocus
            >
              Go to dashboard
            </Button>
          </DialogActions>
        </Dialog>


        <Confetti
          style={{ zIndex: 999 }}
          run={showConfetti}
          width={widthState}
          height={heightState}
          numberOfPieces={200}
        // tweenDuration={50000}
        />
      </div>
      {/* <Snackbar open={showError} autoHideDuration={6000} onClose={closeError} anchorOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}>
        <Alert onClose={closeError} severity="error" sx={{ width: "100%" }}>
          please select answer before moving to next question.
        </Alert>
      </Snackbar> */}
    </>
  );
}

const RadioComp = (props) => {
  return (
    <RadioGroup
      row
      value={props.value}
      name="course_name"
      sx={{ marginTop: 1, justifyContent: "center", color: "#fff" }}
      onChange={props.selectAnswer}
    >
      <FormControlLabel
        value={true}
        sx={{ marginRight: 4 }}
        control={<Radio />}
        label={<Typography style={{ fontFamily: "Public Sans", fontSize: "14px" }}>{props.currectQuestion.button_1_text ?? ""}</Typography>}
      />
      < FormControlLabel
        value={false}
        control={< Radio />}
        label={<Typography style={{ fontFamily: "Public Sans", fontSize: "14px" }}>{props.currectQuestion.button_2_text ?? ""}</Typography>}
      />
    </RadioGroup >
  );
};