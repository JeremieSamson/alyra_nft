import React, { Component } from 'react'
import Author from "./Author";

class Home extends Component {

    render() {
        return (
            <>
                <div className="container mt-5  mb-5">
                    <div className="row">
                        <div className="col-md">
                            <Author imgSrc="authors/jonathan.jpeg" name="Jonathan Siti" description="Ylly forever" githubLink="https://github.com/Jonacity"/>
                        </div>
                        <div className="col-md">
                            <Author imgSrc="authors/nathan.jpeg" name="Nathan L" description="Ylly forever" githubLink="https://github.com/NaLe3"/>
                        </div>
                        <div className="col-md">
                            <Author
                                imgSrc="authors/jeremie.jpeg"
                                name="Jérémie Samson"
                                description="Ylly forever"
                                githubLink="https://github.com/JeremieSamson"
                                twitterLink="https://twitter.com/JSamson76"
                            />
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default Home;