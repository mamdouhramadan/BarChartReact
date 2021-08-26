const SortByDate = (a, b) => {
    if (a - b !== undefined) {

        return new Date(b.submitted_at) - new Date(a.submitted_at);
    } else {
        alert('please Choose Different Dates')
    }

}

export default SortByDate
