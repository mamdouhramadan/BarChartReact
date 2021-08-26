import React, { useState, useEffect } from 'react';
import './App.css';
import DatePicker from './Components/DatePicker/DatePicker';
import Get_data, { ReviewsList } from './Apis/GetReviews';
import Spinner from './Components/Spinner/index';
import VerticalBarchart from './Components/BarChart/VerticalBarchart';
import GetQuestions /*,{ QuestionsList } */ from './Apis/GetQuestions';
import ReviewsDetails from './Components/ReviewsDetailes/ReviewsDetails';
import InitDatePicker from './Utilites/JsComponents/InitDatePicker';
import InitToolTip from './Utilites/JsComponents/InitToolTip';
import InitCollape from './Utilites/JsComponents/InitCollape';
import InitModal from './Utilites/JsComponents/InitModal';
import FloatButton from './Components/FloatButton.js/FloatButton';
function App() {

  const [spinner_status, setSpinner] = useState(false)
  const [sDate, setSDate] = useState('')
  const [endDateDisabled, setdisabled] = useState(true)
  const [SubmitBtnDisabled, setSubmitBtndisabled] = useState(true)

  const GetData = async (e) => {
    // Prevent Page Refresh 
    e.preventDefault();
    // Display Spinner Until Request Done
    setSpinner(true)
    // Get Field Value start_date 
    const start_date = e.target.elements.StartDate.value;
    // Get Field Value  end_date
    const end_date = e.target.elements.EndDate.value;
    // Start Getting Data 
    await Get_data(start_date, end_date);
    // Hide Spinner After Responed 
    setSpinner(false)
  }

  useEffect(() => {
    // Fire and Iniit Function
    GetQuestions();
    // Get Value of StartDate Field 
    var StartDateInput = document.getElementById('StartDate');
    // Get Value of EndDate Field 
    var EndDateInput = document.getElementById('EndDate');

    // Fire And Init Datepicker for StartDateInput
    InitDatePicker(StartDateInput, 2017, () => {
      setdisabled(false);
      setSDate(StartDateInput.value)
    })
    // Fire And Init Datepicker for EndDateInput
    InitDatePicker(EndDateInput, new Date(sDate).getFullYear(), () => {
      setSDate(EndDateInput.value);
      setSubmitBtndisabled(false)
    })

    //Fire and Init Tooltip
    InitToolTip('.detailes-modal-btn');
    //Fire and Init Collapse
    InitCollape('.collapsible');

  }, [sDate]);

  return (

    <div className="container">

      {/* Display Date Picker Component  */}
      <DatePicker Get_Data={GetData} disabled={endDateDisabled} btnDisabled={SubmitBtnDisabled} />

      {/* Display Barchart  */}
      <VerticalBarchart />

      {/* Display Snipper */}
      {spinner_status && <Spinner />}

      {/* Dipslay Floating Button If ReviewsList items > 0  */}
      {Object.entries(ReviewsList).length > 0 && <FloatButton onClick={() => InitModal('.modal')} />}

      {/* Display Modal Component  */}
      <div id="detailes-modal" className="modal"><ReviewsDetails /></div>

    </div>
  );
}

export default App;
