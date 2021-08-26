import React from 'react'


function DatePicker(props) {

    const { disabled, btnDisabled } = props

    return (
        <form onSubmit={props.Get_Data} className="d-flex justify-content-center align-items-center ">
            <div className="row">
                <div className="input-field col l4">
                    <input type="text" className="datepicker" name="StartDate" id="StartDate" />
                    <label htmlFor="StartDate">Select Start Date</label>
                </div>
                <div className="input-field col l4">
                    <input type="text" className="datepicker" name="EndDate" id="EndDate" disabled={disabled} />
                    <label htmlFor="EndDate">Select End Date</label>
                </div>
                <div className="col l4">
                    <button type="submit" disabled={btnDisabled} className="btn btn-primary"  >Get Data</button>
                </div>
            </div>


        </form>
    )
}

export default DatePicker