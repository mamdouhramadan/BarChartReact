
// Calculate The total of weight of [all QUESTION_NUMBER that will choose] in each monthes 
const CalculateWeight = (QuestionNumber, data) => data.flat(1).filter(el => el.question === QuestionNumber).reduce((total, current, _, { length }) => {
    // Get Avarage then multyply * 100 to convert it to percentage
    return total + current.weight / length * 100
}, 0)

export default CalculateWeight
