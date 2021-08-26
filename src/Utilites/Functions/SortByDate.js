const SortByDate = (a, b) => {
    if (a - b !== undefined) {
        // Sorting Decinding 
        return new Date(b.submitted_at) - new Date(a.submitted_at);

    } else {
        // if no value show alert 
        alert('please Choose Different Dates')

    }

}

export default SortByDate
