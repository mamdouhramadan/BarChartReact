// Weights Array Values 
const QuestionWeight = [
    { 'text': 'Good', 'weight': 1 },
    { 'text': 'Neutral', 'weight': 0 },
    { 'text': 'Bad', 'weight': - 1 }
]
// Filter Question and Get Weight Value 
const QuestionToWeight = (Question) =>
    QuestionWeight.filter((el) => {
        return el.text.toLowerCase() === Question.toLowerCase()
    })


export default QuestionToWeight
