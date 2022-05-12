import React, { Component } from 'react'
import getWeb3 from "../getWeb3";

class Card extends Component {
    constructor(props) {
        super(props);
        this.handleBuyButton = this.handleBuyButton.bind(this);
        this.state = JSON.parse(window.localStorage.getItem('state')) || {
            accounts: null,
            contract: null,
        }
    }

    renderButtons() {
        if (this.state.accounts !== null && this.props.owner !== this.state.accounts[0]) {
            return <a href="#buy" className="btn btn-primary" onClick={this.handleBuyButton}>Buy</a>;
        }
    }

    async handleBuyButton() {
        try {
            const web3 = await getWeb3();
            const workflowStatus = await this.state.contract.methods.get().call({from: this.state.accounts[0]});

        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    }

    render() {
        return (
            <>
                <div className="card">
                    <img src={this.props.imageSrc} className="card-img-top" alt={this.props.title}/>
                    <div className="card-body">
                        <h5 className="card-title">{this.props.title}</h5>
                        <p className="card-text">{this.props.description}</p>

                        {this.renderButtons()}
                    </div>
                </div>
            </>
        );
    }
}

export default Card;