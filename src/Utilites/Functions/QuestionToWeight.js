const QuestionWeight = [
    { 'text': 'Good', 'weight': 1 },
    { 'text': 'Neutral', 'weight': 0 },
    { 'text': 'Bad', 'weight': - 1 }
]

const QuestionToWeight = (Question) =>
    QuestionWeight.filter((el) => {
        return el.text.toLowerCase() === Question.toLowerCase()
    })


export default QuestionToWeight
