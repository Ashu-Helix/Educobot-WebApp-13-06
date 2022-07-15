const mcqArr = [
    {
        id: 1,
        correct_answer: false,
        question: `The body temperature should be greater than 50`,
        right_answer_message: `The temperature should be below 39`,
        wrong_answer_message: `The correct body temperature should be below 39`,
        button_1_text: `TRUE`,
        button_2_text: `FALSE`,
    },
    {
        id: 2,
        correct_answer: true,
        question: `There are 3 patients in the code`,
        right_answer_message: `There are 3 patients in the program`,
        wrong_answer_message: `There are 3 patients one by one coming to the doctor in this code`,
        button_1_text: `TRUE`,
        button_2_text: `FALSE`,
    },
    {
        id: 3,
        correct_answer: false,
        question: `Every patient needs treatment`,
        right_answer_message: `Only those patient having temperature more than 39 needs treatments`,
        wrong_answer_message: `Only those patient having temperature more than 39 needs treatments`,
        button_1_text: `TRUE`,
        button_2_text: `FALSE`,
    },
];

export { mcqArr };