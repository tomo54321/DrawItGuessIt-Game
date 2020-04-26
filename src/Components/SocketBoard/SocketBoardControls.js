import React from 'react';

import SocketBoardActions from './SocketBoardActions';

export default class SocketBoardControls extends React.Component{

    constructor(props){
        super(props);

        this.penThickness = {
            THIN : 1,
            MEDIUM : 5,
            THICK : 10,
        };

        this.state={
            thickness:this.penThickness.THIN
        };

        this.handleClearCanvas = this.handleClearCanvas.bind(this);
        this.handleRemoteAction = this.handleRemoteAction.bind(this);
        this.handleSetPenThickness = this.handleSetPenThickness.bind(this);

    }

    componentDidMount(){
        this.memCtx = this.props.memCanvas.getContext("2d");
        this.props.socket.on("canvas action", this.handleRemoteAction);
    }

    componentDidUpdate(){
        this.memCtx = this.props.memCanvas.getContext("2d");
        this.ctx = this.props.canvas ? this.props.canvas.getContext("2d") : null;
    }

    handleClearCanvas(e){
        this.memCtx.clearRect(0, 0, this.props.width, this.props.height);
        this.ctx.clearRect(0, 0, this.props.width, this.props.height);

        this.props.socket.emit("canvas action", {room: this.props.room, action: SocketBoardActions.CLEAR_CANVAS, data:true });

        e.preventDefault();
    }

    handleSetPenThickness(thickness, e){
        this.setState({
            thickness
        })
        this.ctx.lineWidth = thickness;
        this.props.socket.emit("canvas action", {
            room: this.props.room, 
            action: SocketBoardActions.SET_PEN_THICKNESS, 
            data:thickness 
        });
        e.preventDefault();
    }

    handleRemoteAction({action, data}){
        switch (action){
            case SocketBoardActions.CLEAR_CANVAS:
                this.memCtx.clearRect(0, 0, this.props.width, this.props.height);
                this.ctx.clearRect(0, 0, this.props.width, this.props.height);
                break;
            case SocketBoardActions.SET_PEN_THICKNESS:
                this.ctx.lineWidth = data;
                break;
            default:
                break;
        }
    }

    render(){
        return(
            <div>
                <button 
                onClick={this.handleClearCanvas}>Clear</button>
                <button onClick={(e)=>{this.handleSetPenThickness(this.penThickness.THIN, e)}}>
                    Thin
                </button>
                <button onClick={(e)=>{this.handleSetPenThickness(this.penThickness.MEDIUM, e)}}>
                    Medium
                </button>
                <button onClick={(e)=>{this.handleSetPenThickness(this.penThickness.THICK, e)}}>
                    Thick
                </button>
            </div>
        )
    }

}