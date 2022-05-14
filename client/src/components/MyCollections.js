import React, { Component } from 'react'

class MyCollections extends Component {
    constructor(props) {
        super(props);
        this.handleSearch = this.handleSearch.bind(this);
        this.state = {
          query: null
        };
    }

    handleSearch(e) {
        this.setState({query:e.target.value});
    }

    render() {
        return (
            <>
                <div className="container mt-5 mb-5">
                    <h1>My collections</h1>
                </div>
            </>
        );
    }
}

export default MyCollections;