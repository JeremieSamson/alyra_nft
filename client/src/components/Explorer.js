import React, { Component } from 'react'
import Card from "./Card";
import data from "./data.json"

class Explorer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const filteredData = data.filter((data) => {
            if (this.props.state.query === '') {
                console.log('no query');
                return data;
            } else {
                console.log(this.props.state.query);
                return data.title.toLowerCase().includes(this.props.state.query)
            }
        })

        return (
            <>
                <div className="container mt-5 mb-5">
                    <div className="row row-cols-1 row-cols-md-3 g-4">
                        {data.map((item) => (
                            <div className="col">
                                <Card imageSrc={item.imageSrc} title={item.title} description={item.description}/>
                            </div>
                        ))}
                    </div>
                </div>
            </>
        );
    }
}

export default Explorer;