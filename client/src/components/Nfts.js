import React, { Component } from 'react'
import nfts from "../data/nfts.json"
import NFTItem from "./NFTItem";

class Nfts extends Component {
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
        const filteredCollections = nfts.filter((nft) => {
            if (this.state.query === null || this.state.query === '') {
                return nft;
            } else {
                return nft.title.toLowerCase().includes(this.state.query.toLowerCase())
            }
        })

        return (
            <>
                <div className="container mt-5 mb-5">
                    <h1>Explore NFTs</h1>
                    <div className="input-group rounded searchInput">
                        <input type="search" className="form-control rounded" placeholder="Search in nfts ..." aria-label="Search"
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
                                <NFTItem imageSrc={item.tokenURI} title={item.tokenId} owner={item.owner} id={item.tokenId}/>
                            </div>
                        ))}
                    </div>
                </div>
            </>
        );
    }
}

export default Nfts;