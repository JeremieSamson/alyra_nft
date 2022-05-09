import React, { Component } from 'react'

class Card extends Component {

    render() {
        return (
            <>
                <div className="card">
                    <img src={this.props.imageSrc} className="card-img-top" alt={this.props.title}/>
                    <div className="card-body">
                        <h5 className="card-title">{this.props.title}</h5>
                        <p className="card-text">{this.props.description}</p>
                        <a href="#!" className="btn btn-primary">Buy</a>
                    </div>
                </div>
            </>
        );
    }
}

export default Card;