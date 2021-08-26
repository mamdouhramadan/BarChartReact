
const CalculateWeight = (QuestionNumber, data) => data.flat(1).filter(el => el.question === QuestionNumber).reduce((total, current,_, { length }) => {
    return total + current.weight /length * 100
}, 0)



export default CalculateWeight
