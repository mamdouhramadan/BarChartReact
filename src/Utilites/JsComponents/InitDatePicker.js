import M from "materialize-css";

const InitDatePicker = (InputDate, StartDate , Data) =>
    M.Datepicker.init(InputDate, {
        format: 'yyyy-mm-dd',
        autoClose: true,
        yearRange: [StartDate, new Date().getFullYear()],
        showClearBtn: true,
        onClose: Data
        
    });


export default InitDatePicker
