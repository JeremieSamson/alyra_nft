import React, { Component } from 'react'
import {NotificationManager} from "react-notifications";

class Contact extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit() {
        NotificationManager.success('Your message has been send', '', 5000);
    }

    render() {
        return (
            <>
                <div className="container mt-5  mb-5">
                    <h1>Contact</h1>
                    <div className="container py-4" >
                        <form id="contactForm " >
                            <div className = "mb-3 text-start">
                                <label className = "form-label" htmlFor="name"> Name < /label>
                                <input className="form-control" id="name" type="text" placeholder="Name"/>
                            </div>

                            <div className="mb-3 text-start">
                                <label className="form-label" htmlFor="emailAddress">Email Address</label>
                                <input className="form-control" id="emailAddress" type="email" placeholder="Email Address"/>
                            </div>

                            <div className="mb-3 text-start">
                                <label className="form-label" htmlFor="message">Message</label>
                                <textarea className="form-control" id="message" type="text" placeholder="Message"/>
                            </div>

                            <div className="d-grid">
                                <button className="btn btn-primary btn-lg" type="button" onClick={this.handleSubmit}>Send</button>
                            </div>

                        </form>

                    </div>
                </div>
            </>
        )

    }
}

export default Contact;