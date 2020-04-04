import React, { useState, useEffect, useRef, useReducer } from 'react';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { Button } from 'antd';

const appStates = {
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
    const imageRef = useRef();
    const inputRef = useRef();

    const reducer = (state, event) => appStates.states[state].on[event] || appStates.initial;

    const [state, dispatch] = useReducer(reducer, appStates.initial);

    const nextState = () => dispatch("next");

    const loadMobileNet = async () => {
        nextState();
        const model = await mobilenet.load();
        setModel(model);
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

    const upload = () => imageRef.current.click();

    const handkeUpload = event => {
        const { files } = event.target;
        if (files.length > 0) {
            const url = URL.createObjectURL(event.target.files[0]);
            setImageURL(url);
            nextState();
        }
    }

    const actionButton = {
        initial: { action: loadModel, text: "Load Model" },
        loadingModel: { text: "Loading Model..." },
        modelReady: { action: upload, text: "Upload Image" },
        imageReady: { action: identify, text: "Identify" },
        identifying: { text: "Identifying..." },
        complete: { action: reset, text: "Reset" }
    };

    const { showImage, showResult } = appStates.states[state]
    return (
        <div>
            {showImage && <img src={imageURL} alt="upload-preview" ref={imageRef} />}
            <input
                type="file"
                accept="image/*"
                capture="camera"
                onChange={handleUpload}
                ref={inputRef}
            />
            {showResults && (
                <ul>
                    {results.map(({ className, probability }) => (
                        <li key={className}>{`${className}: %${(probability * 100).toFixed(
                            2
                        )}`}</li>
                    ))}
                </ul>
            )}
            <Button onClick={actionButton[appState].action || (() => { })}>
                {actionButton[appState].text}
            </Button>
        </div>
    )
}

export default ObjectDetection;
