import { QuestionsList } from './../../Apis/GetQuestions';
import QuestionToWeight from './QuestionToWeight';

const appendDataToQuestions = el => {
    // Get Index of Question 
    const q_index = QuestionsList.findIndex(item => item.id === el.question);
    
    // Get Index of Chice Answer  
    const c_index = QuestionsList[q_index].choices.findIndex(item => item.id === el.choice);

    // Get Value of Question Depend on Index , Then Insert it to List 
    el.text = QuestionsList[q_index].text

    // Get Value of Chice Answer Depend on Index , Then Insert it to List  
    el.choice_text = QuestionsList[q_index].choices[c_index].text
    
    // Get Value of Weight By  QuestionToWeight Function, Then Insert it to List  
    el.weight = QuestionToWeight(el.choice_text)[0].weight

    return el
}


export default appendDataToQuestions
