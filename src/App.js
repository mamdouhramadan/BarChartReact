import React, { useState, useEffect } from 'react';
import './App.css';
import DatePicker from './Components/DatePicker/DatePicker';
import Get_data, { Result, ReviewsList } /* , { ReviewsList }*/ from './Apis/GetReviews';
import Spinner from './Components/Spinner/index';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import VerticalBarchart from './Components/BarChart/VerticalBarchart';
import GetQuestions /*,{ QuestionsList } */ from './Apis/GetQuestions';
import M from "materialize-css";

import ReviewsDetails from './Components/ReviewsDetails';
function App() {

  const [spinner_status, setSpinner] = useState(false)
  const [sDate, setSDate] = useState('')
  const [endDateDisabled, setdisabled] = useState(true)
  const [SubmitBtnDisabled, setSubmitBtndisabled] = useState(true)

  const GetData = async (e) => {
    e.preventDefault();
    setSpinner(true)
    const start_date = e.target.elements.StartDate.value;
    const end_date = e.target.elements.EndDate.value;
    await Get_data(start_date, end_date);
    setSpinner(false)
  }

  useEffect(() => {
    //M.AutoInit();
    GetQuestions();
    var StartDateInput = document.getElementById('StartDate');
    var EndDateInput = document.getElementById('EndDate');
    M.Datepicker.init(StartDateInput, {
      format: 'yyyy-mm-dd',
      autoClose: true,
      yearRange: [2017, new Date().getFullYear()],
      showClearBtn: true,
      onClose: () => {
        setdisabled(false);
        setSDate(StartDateInput.value)
        console.log(sDate ? sDate : '')
      }
    });

    M.Datepicker.init(EndDateInput, {
      format: 'yyyy-mm-dd',
      autoClose: true,
      minDate: new Date(sDate),
      yearRange: [new Date(sDate).getFullYear(), new Date().getFullYear()],
      showClearBtn: true,
      onClose: () => {
        setdisabled(false);
        setSDate(EndDateInput.value);
        setSubmitBtndisabled(false)
      }
    });


    var elems = document.querySelectorAll('.detailes-modal-btn');
    M.Tooltip.init(elems);

    elems = document.querySelectorAll('.collapsible');
    M.Collapsible.init(elems);


  }, [sDate]);

  const openDetailes = () => {
    var elems = document.querySelectorAll('.modal');
    M.Modal.init(elems);
  }
  return (

    <div className="container">

      <div className="w-100 m-auto py-5">
        <DatePicker Get_Data={GetData} disabled={endDateDisabled} btnDisabled={SubmitBtnDisabled} />
        <VerticalBarchart />

        {spinner_status && <Spinner />}


        {
          Object.entries(ReviewsList).length > 0 &&
          // <a className="waves-effect waves-light btn modal-trigger" href="#detailes-modal" onClick={() => openDetailes()}>Modal</a>
          <div className="fixed-action-btn">
            <a className="btn-floating btn-large red modal-trigger detailes-modal-btn" href="#detailes-modal" data-position="top" data-tooltip="More Info" onClick={() => openDetailes()} >
              <i className="large material-icons">grid_on</i>
            </a>
          </div>
        }

        <div id="detailes-modal" className="modal">
          <ReviewsDetails />
        </div>


      </div>
    </div>
  );
}

export default App;
