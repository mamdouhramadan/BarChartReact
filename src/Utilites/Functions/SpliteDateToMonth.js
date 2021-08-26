import GetSpecificQuestions from "./GetSpecificQuestions";
import appendDataToQuestions from "./appendDataToQuestions";

// Grouping Data By months 
const SpliteDateToMonth = (el, { submitted_at, answers }) => {
    // Get Submitted Day Values 
    let dateObj = new Date(submitted_at);
    // Get Month and year from [Submitted Day Value]
    let monthyear = dateObj.toLocaleString("en-us", { month: "short", year: '2-digit' });

    if (!el[monthyear]) {
        el[monthyear] = { monthyear, entries: 1, data: [] }
    } else {
        el[monthyear].data.push(
            // Before Inserting Answers Filter It As Required
            answers.filter(GetSpecificQuestions).map(appendDataToQuestions)
        );
        
        el[monthyear].entries++;
    }
    return el;
}


export default SpliteDateToMonth
