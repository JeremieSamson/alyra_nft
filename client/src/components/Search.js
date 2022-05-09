import React, { Component } from 'react'
import {Button, Form, FormControl} from "react-bootstrap";

class Search extends Component {
    constructor(props) {
        super(props);
        this.handleSearch = this.handleSearch.bind(this);
        this.state = this.props.state;
    }

    handleSearch(e) {
        console.log('new value: '+e.target.value);
        this.setState({query:e.target.value});
    }

    render() {
        return (
            <>
                <input
                    type="text"
                    onChange={this.handleSearch}
                />
            </>
        );
    }
}

export default Search;