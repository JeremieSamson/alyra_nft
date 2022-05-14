import React, { Component } from 'react'
import collections from "../data/collections.json"
import CollectionItem from "./CollectionItem";

class Collections extends Component {
    constructor(props) {
        super(props);
        this.handleSearch = this.handleSearch.bind(this);

        this.state = {
            query: null
        }
    }

    handleSearch(e) {
        this.setState({query:e.target.value});
    }

    render() {
        const filteredCollections = collections.filter((collection) => {
            if (this.state.query === null || this.state.query === '') {
                return collection;
            } else {
                return collection.title.toLowerCase().includes(this.state.query.toLowerCase())
            }
        })

        return (
            <>
                <div className="container mt-5 mb-5">
                    <h1>Explore collections</h1>
                    <div className="input-group rounded searchInput">
                        <input type="search" className="form-control rounded" placeholder="Search a collection ..." aria-label="Search"
                               aria-describedby="search-addon"
                               onChange={this.handleSearch}
                        />
                        <span className="input-group-text border-0" id="search-addon">
                            <i className="fas fa-search"/>
                          </span>
                    </div>
                    <div className="row row-cols-1 row-cols-md-3 g-4">
                        {filteredCollections.map((item) => (
                            <div className="col" key={item.id}>
                                <CollectionItem imageSrc={item.imageSrc} title={item.title} owner={item.owner} id={item.id}/>
                            </div>
                        ))}
                    </div>
                </div>
            </>
        );
    }
}

export default Collections;