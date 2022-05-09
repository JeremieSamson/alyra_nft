import React, { Component } from 'react'

class Footer extends Component {

    render() {
        return (
            <>
                <footer className="text-center text-lg-start bg-light text-muted">
                    <section className="">
                        <div className="container text-center text-md-start mt-5">
                            <div className="row mt-3">
                                <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
                                    <h6 className="text-uppercase fw-bold mb-4">
                                        <i className="fas fa-gem me-3"/>NFT MarketPlace
                                    </h6>
                                    <p>
                                        The best place to create, sell and buy NFT.
                                    </p>
                                </div>

                                <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
                                    <h6 className="text-uppercase fw-bold mb-4">
                                        Useful links
                                    </h6>
                                    <p>
                                        <a href="home" className="text-reset">Home</a>
                                    </p>
                                    <p>
                                        <a href="explore" className="text-reset">Explore</a>
                                    </p>
                                    <p>
                                        <a href="team" className="text-reset">Team</a>
                                    </p>
                                    <p>
                                        <a href="contact" className="text-reset">Contact</a>
                                    </p>
                                </div>

                                <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
                                    <h6 className="text-uppercase fw-bold mb-4">
                                        Contact
                                    </h6>
                                    <p><i className="fas fa-home me-3"></i> 10 Rue Greneta, Alyra</p>
                                    <p>
                                        <i className="fas fa-envelope me-3"></i>
                                        contact@cryptobrothers.com
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="text-center p-4">
                        © 2022 Copyright:
                        <a className="text-reset fw-bold" href="#">CryptoBrothers</a>
                    </div>
                </footer>
            </>
        )
        ;
    }
}

export default Footer;