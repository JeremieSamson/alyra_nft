import React, { Component } from 'react'
import FormData from 'form-data';
import axios from 'axios';
import {NotificationManager} from "react-notifications";

class NewNFT extends Component {
    constructor(props) {
        super(props);

        this.handleFile = this.handleFile.bind(this);

        this.state = {
            url: '',
            name: '',
            description: '',
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
            <h1>Create your collection</h1>

            <form>
                <div className="mb-3 text-start mt-5">
                    <label htmlFor="inputUrl" className="form-label">Base URL (don't have one ?create it with pinata <a href="/pinata">here</a>)</label>
                    <input
                        id="inputUrl"
                        type="text"
                        className="form-control"
                        placeholder="e.g. https://gateway.pinata.cloud/ipfs/<hash>"
                        onChange={(event) => this.state.url = event.target.value}
                    />

                    <label htmlFor="inputName" className="form-label">Name</label>
                    <input
                        id="inputName"
                        type="text"
                        className="form-control"
                        placeholder="e.g. My first NFT!"
                        onChange={(event) => this.state.name =event.target.value}
                    />

                    <label htmlFor="inputDescription" className="form-label">Description</label>
                    <input
                        id="inputDescription"
                        type="text"
                        className="form-control"
                        placeholder="e.g. Even cooler than cryptokitties ;)"
                        onChange={(event) => this.state.description = event.target.value}
                    />
                </div>
            </form>
        </div>;
    }
}

export default NewNFT;