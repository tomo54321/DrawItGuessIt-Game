import React from 'react';

export default class WhiteBoard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            height: 400,
            width: 600
        };
        this.mouseDown = false;
        
        this.lastx = 0;
        this.lasty = 0;
        this.memCanvas = document.createElement("canvas");
        this.memCanvas.width = this.state.width;
        this.memCanvas.height = this.state.height;
        this.memCtx = this.memCanvas.getContext("2d");

        this.points = [];

        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.getPoints = this.getPoints.bind(this);
        this.drawPoints = this.drawPoints.bind(this);
    }

    componentDidMount() {
        this.ctx = this.canvas.getContext("2d");
        this.ctx.lineWidth = 5;
        this.ctx.lineCap = "round";
        this.ctx.lineJoin = "round";
    }

    /**
     * When the user begins to click
     */
    handleMouseDown(e) {
        this.mouseDown = true;
        const {x, y} = this.getPoints(e);
        this.points.push({
            x,
            y
        });

    }

    /**
     * When the user lets up the click button
     */
    handleMouseUp(e) {
        if(!this.mouseDown){ return; }
        this.mouseDown = false;

        this.memCtx.clearRect(0, 0, this.state.width, this.state.height);
        this.memCtx.drawImage(this.canvas, 0, 0);
        this.points = [];
    }

    /**
     * When The mouse moves
     * @param {} e 
     */
    handleMouseMove(e) {
        if(!this.mouseDown){ return; }
        
        const {x, y} = this.getPoints(e);

        this.ctx.clearRect(0, 0, this.state.width, this.state.height);
        this.ctx.drawImage(this.memCanvas, 0, 0);
        this.points.push({
            x,
            y
        });
        this.drawPoints();
    }

    /**
     * Get X and Y from events.
     * @param {Event} e 
     */
    getPoints(e){
        let {x, y} = 0;
        const ev = e.nativeEvent;
        if (false) {
            x = ev.touches[0].clientX;
            y = ev.touches[0].clientY; // CH: Is there a better way to do this?
        }
        else if (ev.layerX || ev.layerX == 0) { // Firefox
            x = ev.layerX;
            y = ev.layerY;
        }
        else if (ev.offsetX || ev.offsetX == 0) { // Opera
            x = ev.offsetX;
            y = ev.offsetY;
        }
    
        x = x + 0.5;
        return {x, y};
    }

    drawPoints(){
        if(this.points < 6){ return; }
        if( this.points < 6 ){
            let b = this.points[0];
            this.ctx.beginPath();
            this.ctx.arc(b.x, b.y, this.ctx.lineWidth / 2, 0, Math.PI * 2, !0);
            this.ctx.closePath();
            this.ctx.fill();
            return;
        }
        this.ctx.beginPath();
        this.ctx.moveTo(this.points[0].x, this.points[0].y);
        let it = 0;
        for( let i=1; i < this.points.length - 2; ++i){
            it = i;
            let c = (this.points[i].x + this.points[i + 1].x) / 2;
            let d = (this.points[i].y + this.points[i + 1].y) / 2;
            this.ctx.quadraticCurveTo(this.points[i].x, this.points[i].y, c, d)
        }

        this.ctx.quadraticCurveTo(
            this.points[it].x, 
            this.points[it].y,
            this.points[it + 1].x,
            this.points[it + 1].y
        );
        this.ctx.stroke();
    }


    render() {
        return (
            <div>

                <canvas
                    style={{
                        borderWidth: 2,
                        borderColor: "#000",
                        borderStyle: "solid"
                    }}
                    ref={(ref) => { this.canvas = ref; }}
    
                    onMouseDown={this.handleMouseDown}
                    onMouseUp={this.handleMouseUp}
                    onMouseLeave={this.handleMouseUp}
                    onMouseMove={this.handleMouseMove}

                    onTouchStart={this.handleMouseDown}
                    onTouchEnd={this.handleMouseUp}
                    onTouchMove={(e)=>{ this.handleMouseMove(e); e.preventDefault(); }}
    
                    width={this.state.width}
                    height={this.state.height}
                ></canvas>
            </div>
        )
    }

}