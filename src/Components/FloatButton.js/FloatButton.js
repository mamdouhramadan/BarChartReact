import React from 'react'

function FloutButton(props) {
    const { onClick } = props
    return (
        <div className="fixed-action-btn">
            <a className="btn-floating btn-large red modal-trigger detailes-modal-btn" href="#detailes-modal" data-position="top" data-tooltip="More Info" onClick={onClick} >
                <i className="large material-icons">grid_on</i>
            </a>
        </div>
    )
}


export default FloutButton

