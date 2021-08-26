import React from 'react';


export default class Reviews extends React.Component {

    render() {

        return (
            <React.Fragment>
                <p>
                    {this.props?.reviews?.length}
                </p>
                {
                    this.props.reviews &&
                    <table>
                        <thead>
                            <tr>
                                <td>#</td>
                                <td>Date</td>
                                <td>Question - answerd</td>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.props.reviews.map((item, index) =>
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item?.submitted_at}</td>
                                    </tr>
                                )
                            }

                        </tbody>
                    </table>
                }
            </React.Fragment>
        )

    }
}
