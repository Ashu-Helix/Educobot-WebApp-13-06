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
    IconButton,
    Stack
} from "@mui/material";

import CloseIcon from '@mui/icons-material/Close';

// import SuccessDialog from "./successDialog";
import MotivationIllustration from "../assets/illustration_motivation";

import Icon_StarFullNew from "../assets/Icon_starFullNew";
import Icon_StarEmptyNew from "../assets/Icon_starEmptyNew";
import Confetti from "react-confetti";
import { unstable_useForkRef } from "@mui/utils";
// import { turn } from "../../components/helpers/dog";
import { useRouter } from "next/router";
import axios from "axios";

// coins
import MemoCoin1 from "../assets/1";
import MemoCoin75 from "../assets/75";
import MemoCoin50 from "../assets/50";
import MemoCoin25 from "../assets/25";
import MemoCoin0 from "../assets/0";

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

export interface DialogTitleProps {
    id: string;
    children?: React.ReactNode;
    onClose: () => void;
    sx: any;
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
    const { children, onClose, ...sx } = props;

    return (
        <DialogTitle {...sx} >
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
};

type Props = {
    // getCoins: (value) => void
    // slug: any;
    lessonDetails?: any;
    userDetails?:any;
    testDialogInfo: {
        dialogStatus: String;

    };
};
export default function TestDialog(
    {
        // getCoins,  slug,
        lessonDetails,
        userDetails,
        testDialogInfo }: Props
) {
    const [widthState, setWidthState] = useState(0);
    const [heightState, setHeightState] = useState(0);
    const [showConfetti, setShowConfetti] = useState(false);
    const [recycleConfetti, setRecycleConfetti] = useState(false);
    //const { dialogStatus, questionArray } = testDialogInfo;
    const [open, setOpen] = useState(null);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [marks, setMarks] = useState(0);
    const [userQuestionPaper, setuserQuestionPaper] = useState([]);
    // const [showError, setShowError] = useState(false);
    const router = useRouter();
    // const [questionArray, setQuestionArray] = useState([]);
    const [disabledBtn, setDisabledBtn] = useState(true);
    // let questionArray = require(`../../public/mcq/${slug}Mcq.js`).mcqArr;

    let questionArray = [{
        id: 1,
        correct_answer: true,
        question: `_________ are special words understood by python`,
        right_answer_message: `Keywords are the reserved words in Python. We cannot use a keyword as a variable name, function name or any other identifier.`,
        wrong_answer_message: `Keywords are the reserved words in Python. We cannot use a keyword as a variable name, function name or any other identifier.`,
        button_1_text: `Keywords`,
        button_2_text: `Special-words`,
    },
    {
        id: 2,
        correct_answer: false,
        question: `__________ is used to display the output content`,
        right_answer_message: `print() is used to display the output content`,
        wrong_answer_message: `print() is used to display the output content`,
        button_1_text: `display_output()`,
        button_2_text: `print()`,
    },
    {
        id: 3,
        correct_answer: true,
        question: `To assign values to a variable in Python, we will use the ________ assignment operator`,
        right_answer_message: `To assign values to a variable in Python, we will use the assignment (=) operator.`,
        wrong_answer_message: `To assign values to a variable in Python, we will use the assignment (=) operator.`,
        button_1_text: `= , I.e a = 80`,
        button_2_text: `->, i.e a -> 80`,
    },
    {
        id: 4,
        correct_answer: true,
        question: `_________ in python is like a container which can store values`,
        right_answer_message: `You can consider a variable to be a temporary storage space where you can keep changing values.`,
        wrong_answer_message: `You can consider a variable to be a temporary storage space where you can keep changing values.`,
        button_1_text: `Variables`,
        button_2_text: `Data types`,
    },
    {
        id: 5,
        correct_answer: false,
        question: `Which one of the following is the correct way of declaring and initializing a variable, x with the value 7?`,
        right_answer_message: `The correct way of declaring and initializing a variable, x with the value 7 is x=7.`,
        wrong_answer_message: `The correct way of declaring and initializing a variable, x with the value 7 is x=7.`,
        button_1_text: `declare x=7`,
        button_2_text: `x=7`,
    },];

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
            // console.log(
            //   "From TestDialog",
            //   obj.answer + " " + questionArray[index].correct_answer
            // );
            if (String(obj.answer) === String(questionArray[index].correct_answer)) {
                // console.log("Correct Answer");
                obtainedMarks = obtainedMarks + 1;
            }
        });
        // if (getCoins)
        //     getCoins(obtainedMarks)
        setMarks(obtainedMarks);
    };

    const setActualWidthHeight = () => {
        setWidthState(window.innerWidth);
        setHeightState(window.innerHeight);
    };

    useEffect(() => {
        setActualWidthHeight();
        window.addEventListener("resize", setActualWidthHeight);

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

    const handleClose = () => {
        setOpen(false);
        setRecycleConfetti(false);
    };


    // POST EVAL DATA
    const [coins, setCoins] = useState([]);
    useEffect(() => {
        open==="second" && postEvalData();
    }, [open])
    

    //SAVE COINS
    const saveCoins = async(body:any, coins: number) => {
        if (coins) {
            body["edcoins"] = coins;
        }

        try {
            const res = await axios({
                method:"post",
                url:"https://api.educobot.com/users/postEvalData",
                data:body,
                headers: { "Content-Type": "application/json" },
            });
            if(res.status==200 && res.data.msg){
                console.log(res.data.msg)
            }
        }
        catch (error) {
            console.log(error.message)
        }
    }


    //POST EVAL DATA
    const postEvalData = () => {
        
        let body = {
                "userID": userDetails?.sdUID,
                "edType":"B",
                "std": userDetails?.sdClass,
                "div": userDetails?.sdDiv,
                "status":"C",
                "lessonID": lessonDetails?.lsID,
                "rollNo": userDetails?.sdRollNo,
                "pin" : userDetails?.otp,
                "schoolID" : userDetails?.sdSchoolID,
                "edcoins":1.0
        }
        saveCoins(body, 1.0)
    }


    return (
        <>
            <div>
                <Button
                    color="info"
                    variant="outlined"
                    id="openTest"
                    onClick={() => {
                        setOpen("second");
                    }}
                    sx={{ display: "none" }}
                >
                    Take Test
                </Button>

                {/* confirmation dialog */}
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
                            padding: { md: "2rem", xs: "2rem 0" },
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
                                padding: { md: "0rem 1rem", xs: "0rem" },
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


                {/* test dialog */}
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
                                        setRecycleConfetti(true);
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

                {/* last dialog */}
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
                    <BootstrapDialogTitle id="customized-dialog-title"
                        sx={{
                            m: 0, p: 2,
                            textAlign: "center",
                            fontSize: { md: "20px", xs: "18px" },
                            color: "#fff",
                            padding: { md: "2rem", xs: "2rem 0" },
                            fontWeight: 600,
                            fontFamily: "Public Sans"
                        }}
                        onClose={handleClose}>
                        {"Code written successfully"}
                    </BootstrapDialogTitle>
                    {/* <DialogTitle
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
          </DialogTitle> */}
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


                                {/* Ratings */}
                            {/* <Stack justifyContent={"center"} direction={"row"} gap={1}>
                            {
                                coins.length>0 &&
                                coins.map(coin => {
                                    if(coin=="1"){
                                        return <MemoCoin1/>
                                    }
                                    else if(coin==".75"){
                                        return <MemoCoin75/>
                                    }
                                    else if(coin==".50"){
                                        return <MemoCoin50/>
                                    }
                                    else if(coin==".25"){
                                        return <MemoCoin25/>
                                    }
                                    else{
                                        return <MemoCoin0/>
                                    }
                                })
                            }
                        </Stack> */}
                        
                        </Box>

                        <Typography
                            variant="subtitle1"
                            sx={{
                                textAlign: "center",
                                padding: { md: "0rem 1rem", xs: "0" },
                                fontWeight: 400,
                                fontSize: "16px",
                                color: "#fff",
                            }}
                            fontFamily={"Public Sans"}
                        >
                            {
                                lessonDetails ?
                                    lessonDetails.lsSkillTag3 === "" ?
                                        `With this lesson, you have learned the basics of ${lessonDetails.lsSkillTag2}.`
                                        :
                                        `With this lesson, you have learned the basics of ${lessonDetails.lsSkillTag2} and ${lessonDetails.lsSkillTag3}.`

                                    :
                                    `With this lesson, you have learned the basics of <tag2> and <tag3>. `
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
                                router.push(`${process.env.Dashboard_URL}`);
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
                    recycle={recycleConfetti}
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