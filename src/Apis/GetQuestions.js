import axios from 'axios';


const URL = 'https://staging.mymelior.com/v1/questions';

export let QuestionsList = [];

const AuthStr = 'Bearer '.concat('SLSmxK17vjRInEWIiFQjwE1QIDfeSM');

const Header = {
    headers: {
        Authorization: AuthStr
    }
};

const Get_Questions = async () => {

    await axios.get(URL, Header).then(res => {

        QuestionsList = res.data[0].questions;

    }).catch(err => {
        alert(err);
        console.log(err)
    })
}



export default Get_Questions
