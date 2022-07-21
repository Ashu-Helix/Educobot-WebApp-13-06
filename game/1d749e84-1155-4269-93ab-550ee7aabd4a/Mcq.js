const mcqArr = [
    {
        id: 1,
        correct_answer: true,
        question: `Wait for block is used to trigger the sleep function. The sleep function codes the wait period between the light switch on and switch off`,
        right_answer_message: `You got it right, when you code to switch on a light of particular color, you need to also switch it off after waiting for few seconds by using the sleep function through Wait for block.`,
        wrong_answer_message: `sleep function is used to add a pause between two events. Wait for block helps to trigger await sleep function. So the answer is true.`,
        button_1_text: `TRUE`,
        button_2_text: `FALSE`,
    },
    {
        id: 2,
        correct_answer: false,
        question: `Light block is used to create a loop of different light colors of traffic signal to switch on or off repeatedly`,
        right_answer_message: `Its false. The repeat block is used to loop the traffic signal light more than once to switch on and off in selected colour sequence`,
        wrong_answer_message: `Correct, it’s the repeat function that creates a loop by number of times defined in repeat block, in this case we programmed traffic signal to loop 5 times.`,
        button_1_text: `TRUE`,
        button_2_text: `FALSE`,
    },
];

export { mcqArr };