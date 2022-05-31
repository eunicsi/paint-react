import { makeAutoObservable } from "mobx";

class CanvasState {
    canvas = null;
    socket = null;
    sessionId = null;
    undoList = [];
    redoList = [];
    username = "";

    constructor() {
        makeAutoObservable(this);
    }

    setSessionId(id) {
        this.sessionId = id;
    }

    setSocket(socket) {
        this.socket = socket;
    }

    setUserName(username) {
        this.username = username;
    }

    setCanvas(canvas) {
        this.canvas = canvas;
    }

    pushToUndo(undo) {
        this.undoList.push(undo);
    }
    
    pushToRedo(redo) {
        this.redoList.push(redo);
    }

    undo() {
        let ctx = this.canvas.getContext('2d');

        if (this.undoList.length) {
            let dataUrl = this.undoList.pop();
            this.redoList.push(this.canvas.toDataURL());
            let img = new Image();
            img.src = dataUrl;
            img.onload = () => {
                ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
            }
        } else {
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    redo() {
        let ctx = this.canvas.getContext('2d');

        if (this.redoList.length) {
            let dataUrl = this.redoList.pop();
            this.undoList.push(this.canvas.toDataURL());
            let img = new Image();
            img.src = dataUrl;
            img.onload = () => {
                ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
            }
        }
    }
}

export default new CanvasState();