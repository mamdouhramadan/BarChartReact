import React from 'react'

function BarGroup(props) {

    let barPadding = 2
    let fistBarColour = '#16a085'
    let secondBarColour = '#f1c40f'
    let widthScale = d => d * 5

    let width = widthScale(props.d.value)
    // let yMid = props.barHeight * 0.5

    return (
        <React.Fragment>


            <g className="bar-group first-bar" transform={`translate(${((props.barHeight - barPadding) + 2)},0)`}>
                {/* <text className="name-label" x="-10" y={yMid} alignmentBaseline="middle" >{props.d.name}</text> */}
                <rect style={{ margin: 50 }} y={0} x={0} width={props.barHeight - barPadding} height={width} fill={fistBarColour} rx="5" />
                {/* <text className="value-label" y={width - 5} x={yMid} alignmentBaseline="middle" >{props.d.value}</text> */}
            </g>

            <g className="bar-group second-bar" transform={"translate(" + ((2 * props.barHeight - barPadding) + 2) + ",0)"}>
                {/* <text className="name-label" x="-10" y={yMid} alignmentBaseline="middle" >{props.d.name}</text> */}
                <rect y={0} x={0} width={props.barHeight - barPadding} height={width} fill={secondBarColour} rx="5" />
                {/* <text className="value-label" y={width - 5} x={yMid} alignmentBaseline="middle" >{props.d.value}</text> */}
            </g>



        </React.Fragment>
    )


}


export default BarGroup

