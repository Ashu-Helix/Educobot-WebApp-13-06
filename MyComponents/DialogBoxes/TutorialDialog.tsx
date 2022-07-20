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
    getCoins: (value) => void
    slug: any;
    lessonDetails: any;
    userDetails: any;
    noOfClicks?: any;
    testDialogInfo: {
        dialogStatus: String;

    };
};
export default function TestDialog({ getCoins, noOfClicks, testDialogInfo, lessonDetails, userDetails, slug }: Props) {

    // console.log(lessonDetails, noOfClicks)

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
    const [questionArray, setQuestionArray] = useState([]);
    const [disabledBtn, setDisabledBtn] = useState(true);
    // let questionArray = require(`../../public/mcq/${slug}Mcq.js`).mcqArr;
    const [display, setDisplay] = useState("none");
    const [coins, setCoins] = useState([]);



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
            if (String(obj.answer) === String(questionArray[index].correct_answer)) {
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
            console.log(err.message)
        }

        return () => {
            window.removeEventListener("resize", setActualWidthHeight);
        };
    }, []);

    const selectAnswer = (event: any) => {
        setDisabledBtn(false);
        const itemIndex = userQuestionPaper.findIndex(
            (obj) => obj.id === questionIndex + 1
        );


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


    useEffect(() => {
        open === "second" && postEvalData();
    }, [open])


    //SAVE COINS
    const saveCoins = async (body: any, coins: number) => {
        if (coins) {
            body["edcoins"] = coins;
            body["coins"] = coins;
            console.log(coins)

            // displaying coins logic
            let arr = ['0', '0', '0'];
            let i: number;
            let int = coins.toString()?.split('.')[0];
            let deci = coins.toString()?.split('.')[1];

            for (i = 0; i < Number(int); i++)
                arr[i] = '1'

            if (Number(deci) !== 0 && Number(deci))
                arr[i] = `.${deci}`

            setCoins(arr)
        }
        else setCoins(['0', '0', '0'])

        try {
            const res = await axios({
                method: "post",
                url: "https://api.educobot.com/users/postEvalData",
                data: body,
                headers: { "Content-Type": "application/json" },
            });
            if (res.status == 200 && res.data.msg) {
                console.log(res.data.msg)
            }
        }
        catch (error) {
            console.log(error.message)
        }
    }


    //POST EVAL DATA
    const postEvalData = () => {
        let coins: number = 0;
        const totalMcq: number = questionArray.length || 0;
        let lsType = lessonDetails?.lsCourse === "Python Basic" ?
            lessonDetails?.lsLevel : lessonDetails?.lsSkillTag1


        let body = {
            "userID": userDetails?.sdUID,
            "edType": "B",
            "std": userDetails?.sdClass,
            "div": userDetails?.sdDiv,
            "status": "C",
            "lessonID": lessonDetails?.lsID,
            "rollNo": userDetails?.sdRollNo,
            "pin": userDetails?.otp,
            "schoolID": userDetails?.sdSchoolID,
            "coins": coins
        }
        console.log(lsType, "lsType")
        if (lsType === "test") {
            saveCoins(body, 3.0)
        }
        else if (lsType === "Guided") {
            coins += 1;

            // calculating mcq score
            let score = (2 / totalMcq) * (totalMcq - (totalMcq - marks))
            coins += Number((Math.round((score) * 4) / 4).toFixed(2))
            saveCoins(body, coins)
        }
        else if (lsType === "Partly Guided") {
            coins += 1;
            let total_rescue_btns_clicked = window['rescue_btn_click_count'];
            let total_rescue_btns = window['total_rescue_btns'];

            // calculating score of penalty on rescue button click
            let rescue_score = (1 / total_rescue_btns) * (total_rescue_btns - total_rescue_btns_clicked)
            coins += Number((Math.round((rescue_score) * 4) / 4).toFixed(2))

            // calculating mcq score
            let score = (1 / totalMcq) * (totalMcq - (totalMcq - marks))
            coins += Number((Math.round((score) * 4) / 4).toFixed(2))

            saveCoins(body, coins)
        }
        else if (lsType === "Practice" || lsType === "Test") {
            let total_rescue_btns_clicked = window['rescue_btn_click_count_wb'];
            let total_rescue_btns = window['total_rescue_btns_wb'];

            console.log(total_rescue_btns_clicked, total_rescue_btns, "bnt")

            // calculating score of penalty on rescue button click
            let rescue_score = (2 / total_rescue_btns) * (total_rescue_btns - total_rescue_btns_clicked)
            coins += Number((Math.round((rescue_score) * 4) / 4).toFixed(2))

            // calculating mcq score
            let score = (1 / totalMcq) * (totalMcq - (totalMcq - marks))
            coins += Number((Math.round((score) * 4) / 4).toFixed(2))

            saveCoins(body, coins)
        }
    }



    return (
        <div style={{ display }}>
            <Button
                color="info"
                variant="outlined"
                id="openTest"
                onClick={() => {
                    if (questionArray.length === 0) {
                        setOpen("second");
                    } else {
                        setOpen("test");
                    }

                    setDisplay("block")
                }}
                sx={{ display: "none" }}
            >
                Take Test
            </Button>




            {/* modal popup    */}
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





            {/* Test Dialog */}
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
                                disabled={questionIndex !== 0 ? false : true}
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
                                    setOpen("second")
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




            {/* Last Dialog*/}
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
                <DialogContent
                    id="completeDialogBox"
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

                        <Stack justifyContent={"center"} direction={"row"} gap={1}>
                            {/* {console.log(coins)} */}
                            {
                                coins.length > 0 &&
                                coins.map(coin => {
                                    if (coin == "1") {
                                        return <MemoCoin1 />
                                    }
                                    else if (coin == ".75") {
                                        return <MemoCoin75 />
                                    }
                                    else if (coin == ".5") {
                                        return <MemoCoin50 />
                                    }
                                    else if (coin == ".25") {
                                        return <MemoCoin25 />
                                    }
                                    else {
                                        return <MemoCoin0 />
                                    }
                                })
                            }
                        </Stack>

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
                            lessonDetails.lsSkillTag3 === "" ?
                                `With this lesson, you have learned the basics of ${lessonDetails.lsSkillTag2}.`
                                :
                                `With this lesson, you have learned the basics of ${lessonDetails.lsSkillTag2} and ${lessonDetails.lsSkillTag3}.`
                        }

                    </Typography>
                </DialogContent>
                <DialogActions
                    sx={{
                        justifyContent: "center",
                        padding: "2rem",
                    }}>
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
                        onClick={() => router.push(`${process.env.Dashboard_URL}`)}
                        autoFocus>
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
        /* <Snackbar open={showError} autoHideDuration={6000} onClose={closeError} anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}>
          <Alert onClose={closeError} severity="error" sx={{ width: "100%" }}>
            please select answer before moving to next question.
          </Alert>
        </Snackbar> */

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