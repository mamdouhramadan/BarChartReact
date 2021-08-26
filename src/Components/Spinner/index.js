import React from "react"
import './style.css';

function Spinner() {
    return (
        <div className="spinner-container">
            <div className="progress">
                <div className="indeterminate"></div>
            </div>

        </div>
    )
}

export default Spinner
