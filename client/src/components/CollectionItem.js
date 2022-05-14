import React, { Component } from 'react'
import {Link} from 'react-router-dom';

class CollectionItem extends Component {
    render() {
        return (
            <>
                <Link to={`/collection/${this.props.id}`}>
                <div className="card">
                    <img src={this.props.imageSrc} className="card-img-top" alt={this.props.title}/>
                    <div className="card-body">
                        <h5 className="card-title">{this.props.title}</h5>
                        <p className="card-text">{this.props.description}</p>
                    </div>
                </div>
                </Link>
            </>
        );
    }
}

export default CollectionItem