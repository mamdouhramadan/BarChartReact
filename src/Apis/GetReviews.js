import axios from 'axios';
import SplitDataByMonth from './../Utilites/Functions/SpliteDateToMonth'
import SortByDate from './../Utilites/Functions/SortByDate'

const URL = 'https://staging.mymelior.com/v1/branches/1/progress';

export let ReviewsList = [];
export let Result = []
const AuthStr = 'Bearer '.concat('SLSmxK17vjRInEWIiFQjwE1QIDfeSM');

const Header = {
    headers: {
        Authorization: AuthStr
    }
};



const Get_data = async (date_from, date_end) => {

    const URL_Q = `${URL}?date_from=${date_from}&date_to=${date_end}`;

    await axios.get(URL_Q, Header).then(res => {

        Result = res.data.line_chart_data
        console.log(Result)
        if (Result != undefined || Result != null) {

            ReviewsList = Result.sort(SortByDate).reduce(SplitDataByMonth, {})
        } else {
            alert('Please Select Different Date')
        }


    }).catch(err => {

        console.log(err)
        alert(err)
    })
}



export default Get_data
