import { observer } from 'mobx-react-lite';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import canvasState from '../store/canvasState';
import toolState from '../store/toolState';
import "../styles/canvas.scss"
import Brush from '../tools/Brush';
import axios from 'axios';

const Canvas = observer(() => {
    const canvasRef = useRef();
    const usernameRef = useRef();
    const [modal, setModal] = useState(true);
    const params = useParams();

    useEffect(() => {
        canvasState.setCanvas(canvasRef.current);
        axios.get(`http://localhost:5000/image?id=${params.id}`)
            .then(response => {
                const img = new Image();
                img.src = response.data;
                img.onload = () => {
                    canvasRef.current.getContext('2d').clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                    canvasRef.current.getContext('2d').drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
                    canvasRef.current.getContext('2d').stroke();
                }
            })
    }, [])

    useEffect(() => {
        if (canvasState.username) {
            const socket = new WebSocket("ws://localhost:5000/");
            canvasState.setSocket(socket);
            canvasState.setSessionId(params.id);
            toolState.setTool(new Brush(canvasRef.current, socket, params.id));

            socket.onopen = () => {
                socket.send(JSON.stringify({
                    id: params.id,
                    username: canvasState.username,
                    method: "connection"
                }))
            }

            socket.onmessage = (event) => {
                let msg = JSON.parse(event.data);
                switch (msg.method) {
                    case "connection":
                        console.log(`User ${msg.username} connected`);
                        break;
                    case "draw":
                        drawHandler(msg);
                        break;
                }
            }
        }
    }, [canvasState.username])

    const drawHandler = (msg) => {
        const figure = msg.figure;
        const ctx = canvasRef.current.getContext('2d');
        switch (figure.type) {
            case "brush":
                Brush.draw(ctx, figure.x, figure.y);
                break;
            case "finish":
                ctx.beginPath();
                break;
        }
    }

    const mouseDownHandler = () => {
        canvasState.pushToUndo(canvasRef.current.toDataURL());
        axios.post(`http://localhost:5000/image?id=${params.id}`, {img: canvasRef.current.toDataURL()})
            .then(response => console.log(response.data));
    }
        
    const connectHandler = () => {
        canvasState.setUserName(usernameRef.current.value);
        setModal(false);
    }

    return (
        <div className="canvas">

            <div className={`modal ${modal ? "active" : ""}`}>
                <div className={`content`} onClick={e => e.stopPropagation()}>
                    <input ref={usernameRef} type="text" placeholder="Enter your name" />
                    <button onClick={() => connectHandler()}>Sign in</button>
                </div>
            </div>

            <canvas onMouseDown={() => mouseDownHandler()} ref={canvasRef} width={600} height={400}></canvas>
        </div>
    );
});

export default Canvas;