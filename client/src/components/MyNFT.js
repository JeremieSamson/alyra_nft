import React, { Component } from 'react'
import nfts from "../data/nfts.json";
import Card from "./Card";

class MyNFT extends Component {
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
        const filteredData = nfts.filter((data) => {
            if (this.state.query === null || this.state.query === '') {
                return data;
            } else {
                return data.title.toLowerCase().includes(this.state.query.toLowerCase())
            }
        })

        return (
            <>
                <div className="container mt-5 mb-5">
                    <div className="input-group rounded searchInput">
                        <input type="search" className="form-control rounded" placeholder="Search" aria-label="Search"
                               aria-describedby="search-addon"
                               onChange={this.handleSearch}
                        />
                        <span className="input-group-text border-0" id="search-addon">
                            <i className="fas fa-search"/>
                          </span>
                    </div>
                    <div className="row row-cols-1 row-cols-md-3 g-4">
                        {filteredData.map((item) => (
                            <div className="col">
                                <Card imageSrc={item.tokenURI} title={item.tokenId} owner={item.owner}/>
                            </div>
                        ))}
                    </div>
                </div>
            </>
        );
    }
}

export default MyNFT;