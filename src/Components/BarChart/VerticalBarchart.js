import React from 'react'
import { ReviewsList } from '../../Apis/GetReviews'
import CalculateWeight from '../../Utilites/Functions/CalculateWeight';

function VerticalBarchart() {

    const ChartLineHeight = 450;
    const DistanceBetwenBars = 90;
    const BarWidth = 20;
    const FirstBarColor = '#16a085';
    const SecondBarColor = '#f1c40f';
    const BarLinesColor = '#2c3e50';
    const yAxisPersentage = 11;
    const ListData = Object.entries(ReviewsList);
    return (
        <div>
            <svg width="960" height="500" style={{ fontSize: 14 }}>
                <g transform="translate(40,20)">

                    <g className="x axis" transform={`translate(0,${ChartLineHeight})`} fill={BarLinesColor}>

                        {ListData.map(([key, value], index) => {
                            return (
                                <g key={index} className="tick" transform={`translate(${DistanceBetwenBars * (index + 1)},0)`} style={{ opacity: 1 }}>
                                    <line y2="6" x2="0"></line>
                                    <text dy=".51em" y="20" x="0" style={{ textAnchor: "middle" }}>{key}</text>
                                </g>
                            );
                        })}

                        <path className="domain" d="M0,6V0H900V6"></path>
                    </g>
                    <g className="y axis" fill={BarLinesColor}>

                        {[...Array(yAxisPersentage)].map((el, i) =>

                            <g key={i} className="tick" data-height={40 + (i * 40)} transform={`translate(0,${40 + (i * 40)})`} style={{ opacity: 1 }}><line x2="-6" y2="0"></line>
                                <text dy=".32em" x="-9" y="0" style={{ textAnchor: 'end' }}>{100 - (i * 10)}</text>
                            </g>

                        )}

                        <path className="domain" d="M-6,0H0V450H-6"></path>
                        <text transform="rotate(-90)" y="6" dy=".71em" style={{ textAnchor: 'end' }}>Frequency</text>
                    </g>

                    {

                        ListData.map(([key, value], index) => {
                            const FirstBarValue = Math.max(0, CalculateWeight(2, value.data).toFixed(1))
                            const SecondBarValue = Math.max(0, CalculateWeight(2, value.data).toFixed(1))
                            return (

                                <g key={index} className="tick" transform={`translate( ${DistanceBetwenBars * (index + 1.5) - 40} , ${ChartLineHeight - FirstBarValue * 4.1} )`} style={{ opacity: 1 }}>

                                    <g transform={`translate( -20 , 0)`}>
                                        <text transform={`translate( -15 , -10)`}>({FirstBarValue}% </text>
                                        <rect className="bar" x={0} width={BarWidth} y="0" rx={3} height={FirstBarValue * 4.1} fill={FirstBarColor}></rect>
                                    </g>
                                    <g transform={`translate( -15 , 0)`}>
                                        <text transform={`translate(30 , -10)`}>{SecondBarValue}% )</text>
                                        <rect className="bar" x={BarWidth} width={BarWidth} y="0" rx={3} height={SecondBarValue * 4.1} fill={SecondBarColor}></rect>
                                    </g>

                                </g>
                            )
                        }
                        )
                    }

                </g>
            </svg>
        </div>
    )
}

export default VerticalBarchart
