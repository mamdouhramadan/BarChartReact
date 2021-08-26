import React from 'react'
import { ReviewsList } from '../Apis/GetReviews'

function ReviewsDetails() {
    return (
        <div className="modal-content">
            <h4>More Detailes</h4>
            <ul className="collapsible">
                {Object.entries(ReviewsList).map(([key, value], index) =>
                    <React.Fragment key={index}>

                        <li>
                            <div className="collapsible-header"><i className="material-icons">date_range</i>{value.monthyear} <span style={{
                                display: 'inline-block',
                                margin: '0 0 0 auto'
                            }}>{(value.entries * 2) - 2}</span></div>
                            <div className="collapsible-body">

                                <table>
                                    <thead>
                                        <tr>
                                            <th className="center">Question ID </th>
                                            <th className="center">Question Text</th>
                                            <th className="center">Answer ID</th>
                                            <th className="center">Answer</th>
                                            <th className="center">Weight</th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {value.data.map(el =>

                                            el.map((ans, index) =>

                                                <tr key={index} >
                                                    <td className="center">{ans.question}</td>
                                                    <td className="center">{ans.text}</td>
                                                    <td className="center">{ans.choice}</td>
                                                    <td className="center">{ans.choice_text}</td>
                                                    <td className="center">{ans.weight}</td>
                                                </tr>

                                            )

                                        )}
                                    </tbody>
                                </table>

                            </div>
                        </li>

                    </React.Fragment>
                )}
            </ul>

        </div>

    )
}

export default ReviewsDetails
