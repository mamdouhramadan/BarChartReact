import GetSpecificQuestions from "./GetSpecificQuestions";
import appendDataToQuestions from "./appendDataToQuestions";


const SpliteDateToMonth = (el, { submitted_at, answers }) => {

    let dateObj = new Date(submitted_at);
    let monthyear = dateObj.toLocaleString("en-us", { month: "short", year: '2-digit' });

    if (!el[monthyear]) {
        el[monthyear] = { monthyear, entries: 1, data: [] }
    } else {
        el[monthyear].data.push(
            answers.filter(GetSpecificQuestions).map(appendDataToQuestions)
        );
        el[monthyear].entries++;
    }
    return el;
}


export default SpliteDateToMonth
