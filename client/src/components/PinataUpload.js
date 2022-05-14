import React, { Component } from 'react'
import FormData from "form-data";
import axios from "axios";
import {NotificationManager} from "react-notifications";

class PinataUpload extends Component {
    constructor(props) {
        super(props);

        this.handleFile = this.handleFile.bind(this);

        this.state = {
            file: null,
            myipfsHash: '',
        }
    }

    async handleFile(e) {
        e.preventDefault();

        try {
            const formData = new FormData()
            formData.append("file", this.state.file)

            const response = await axios.post(
                `https://api.pinata.cloud/pinning/pinFileToIPFS`,
                formData,
                {
                    maxContentLength: "Infinity",
                    headers: {
                        "Content-Type": `multipart/form-data;boundary=${formData._boundary}`,
                        'pinata_api_key': process.env.REACT_APP_PINATA_API_KEY,
                        'pinata_secret_api_key': process.env.REACT_APP_PINATA_API_SECRET

                    }
                }
            )

            this.setState({myipfsHash: response.data.IpfsHash})

            NotificationManager.success('Image successfully uploaded to IPFS through Pinata with ipfshas '+response.data.IpfsHash, '', 5000);
        } catch (error) {
            console.log(error)
        }
    }

    render() {
        return <div className="container mt-5  mb-5">
            <h1>Get your decentralised hash for IPFS</h1>

            <form>
                <div className="mb-3 text-start mt-5">
                    <input type="file" onChange={(event)=>this.state.file = event.target.files[0]}/>
                    <button onClick={this.handleFile}>Pin</button>
                </div>
            </form>

            {this.state.myipfsHash.length > 0 ? <span>You base URL is https://gateway.pinata.cloud/ipfs/{this.state.myipfsHash}</span> : ''}
        </div>;
    }
}

export default PinataUpload;