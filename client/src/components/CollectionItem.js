import React, { Component } from 'react'
import {Link} from 'react-router-dom';

class CollectionItem extends Component {
    render() {
        return (
            <>
                <Link to={{
                    pathname: `/collections/${this.props.id}`,
                    props: { owner: this.props.owner, title: this.props.title}
                }}>
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">{this.props.title}</h5>
                            <p className="card-text">
                                Address: {this.props.address}<br/>
                                Owner: {this.props.address}
                            </p>
                        </div>
                    </div>
                </Link>
            </>
        );
    }
}

export default CollectionItem