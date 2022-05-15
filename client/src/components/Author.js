import React, { Component } from 'react'

class Home extends Component {

    render() {
        return (
            <>
                <div className="card mb-3 author-card">
                    <div className="row g-0">
                        <div className="col-md-4">
                            <img
                                src={this.props.imgSrc}
                                alt={this.props.name}
                                className="img-fluid rounded-start"
                            />
                        </div>
                        <div className="col-md-8">
                            <div className="card-body">
                                <h5 className="card-title">{this.props.name}</h5>
                                <p className="card-text">
                                    {this.props.description}
                                </p>
                                <a href={this.props.githubLink} className="card-link" target="_blank" rel="noopener noreferrer">
                                    <i className="fa-brands fa-github"></i>
                                </a>
                                <a href={this.props.twitterLink} className="card-link" target="_blank" rel="noopener noreferrer">
                                    <i className="fa-brands fa-twitter"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default Home;