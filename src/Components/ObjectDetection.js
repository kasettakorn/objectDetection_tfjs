import React, { useState, useEffect, useRef, useReducer } from 'react';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { Button, Spin, Card } from 'antd';
import '../styles/ObjectDetection.css'

const machineStates = {
    initial: 'initial',
    states: {
        initial: { on: { next: "loadingModel" } },
        loadingModel: { on: { next: "modelReady" } },
        modelReady: { on: { next: "imageReady" } },
        imageReady: { on: { next: "identifying" }, showImage: true },
        identifying: { on: { next: "complete" } },
        complete: { on: { next: "modelReady" }, showImage: true, showResult: true }
    }
};
function ObjectDetection() {
    const [model, setModel] = useState(null);
    const [imageURL, setImageURL] = useState(null);
    const [result, setResult] = useState([]);
    const [loading, setLoading] = useState(true);
    const imageRef = useRef();
    const inputRef = useRef();

    const reducer = (state, event) => machineStates.states[state].on[event] || machineStates.initial;

    const [appState, dispatch] = useReducer(reducer, machineStates.initial);

    const nextState = () => dispatch("next");

    const loadMobileNet = async () => {
        nextState();
        const model = await mobilenet.load();
        setModel(model);
        setLoading(false)
        nextState();
       
    };

    const identify = async () => {
        nextState();
        const results = await model.classify(imageRef.current);
        setResult(results);
        nextState();
    }

    const reset = async () => {
        setResult([]);
        nextState();
    }

    const upload = () => inputRef.current.click();

    const handleUpload = event => {
        const { files } = event.target;
        if (files.length > 0) {
            const url = URL.createObjectURL(event.target.files[0]);
            setImageURL(url);
            nextState();
        }
    }

    const actionButton = {
        initial: { action: loadMobileNet, text: "Load Model" },
        loadingModel: { text: "Loading Model..." },
        modelReady: { action: upload, text: "Upload Image" },
        imageReady: { action: identify, text: "Identify" },
        identifying: { text: "Identifying..." },
        complete: { action: reset, text: "Reset" }
    };

    const { showImage, showResult } = machineStates.states[appState];
    useEffect(() => {
        loadMobileNet();
    }, []);
     if (loading) {
        return (
            <center style={{marginTop:"100px"}}>
                <Spin tip="Loading MobileNet model..."></Spin>
            </center>
        );
    } 
    return (

        <div className="wrapper">
            {showImage && <img src={imageURL} alt="upload-preview" ref={imageRef} />}
            <input
                type="file"
                accept="image/*"
                capture="camera"
                onChange={handleUpload}
                ref={inputRef}
            />
            {showResult && (
                <div className="resultCard">
                    {result.map(({ className, probability }) => (
                        <li key={className}>{`${className}: ${(probability * 100).toFixed(2)}%`}</li>
                    ))}
                </div>
            )}
            <Button type="primary" size="large" onClick={actionButton[appState].action || (() => { })}>
                {actionButton[appState].text}
            </Button>
        </div>
    )
}

export default ObjectDetection;
