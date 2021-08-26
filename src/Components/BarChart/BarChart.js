import React, { Component } from 'react'
import BarGroup from './BarGroup'
export class BarChart extends Component {
    state = {
        data: [
            { name: 'Mon', value: 20 },
            { name: 'Tue', value: 40 },
            { name: 'Wed', value: 35 },
            { name: 'Thu', value: 50 },
            { name: 'Fri', value: 55 },
            { name: 'Sat', value: 40 },
            { name: 'Sun', value: 30 }
        ]
    }

    render() {
        let barHeight = 30

        let barGroups = this.state.data.map((d, i) =>
            <React.Fragment>


                <g key={i} transform={`translate( ${((3 * i * barHeight))},00)`} >

                    <BarGroup d={d} barHeight={barHeight} />

                </g>



            </React.Fragment>
        )

        return <svg width="800" height="300" preserveAspectRatio="xMaxYMax meet"
        >
            <svg className="container" preserveAspectRatio='none'>
                <svg className="chart"   preserveAspectRatio="none" >
                    {barGroups}
                </svg>

            </svg>

        </svg>
    }


}

export default BarChart
