import { QuestionsList } from './../../Apis/GetQuestions';
import QuestionToWeight from './QuestionToWeight';

const appendDataToQuestions = el => {
    const q_index = QuestionsList.findIndex(item => item.id === el.question);
    const c_index = QuestionsList[q_index].choices.findIndex(item => item.id === el.choice);
    el.text = QuestionsList[q_index].text
    el.choice_text = QuestionsList[q_index].choices[c_index].text
    el.weight = QuestionToWeight(el.choice_text)[0].weight
    return el
}


export default appendDataToQuestions
