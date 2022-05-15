import React, { Component } from 'react'
import getWeb3 from "../getWeb3";
import CollectionToken from "../contracts/CollectionToken.json";
import {NotificationManager} from "react-notifications";
import {useSearchParams} from "react-router-dom";
import CollectionFactory from "../contracts/CollectionFactory.json";

class MintedNFTItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">{this.props.itemId} ({this.props.price} wei)</h5>
                        <p className="card-text">{this.props.description}</p>
                    </div>
                </div>
            </>
        );
    }
}

export default MintedNFTItem