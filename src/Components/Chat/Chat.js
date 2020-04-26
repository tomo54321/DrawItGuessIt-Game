import React from 'react';

export default class Chat extends React.Component{

    constructor(props){
        super(props);

        this.state={
            sendMessage:"",
            messages:[]
        }

        this.socket = props.socket;
        this.room = props.room;

        this.handleChatMessageUpdate = this.handleChatMessageUpdate.bind(this);
        this.handleSendMessage = this.handleSendMessage.bind(this);
    }

    componentDidMount(){
        this.socket.on("chat message recieved", (data)=>{
            const messages = [...this.state.messages];
            messages.push(data);
            this.setState({messages});
        });
    }

    handleChatMessageUpdate(e){
        this.setState({
            sendMessage: e.target.value
        })
    }
    handleSendMessage(e){
        this.socket.emit("send chat message", {room: this.room, message:this.state.sendMessage});

        this.setState({
            sendMessage:""
        });

        e.preventDefault();
    }

    render(){
        let messages = this.state.messages.map((v, i)=>{
            return(
                <div key={"chat-message-"+i}style={{marginTop:10, marginBottom:10}}>
                    <span style={{display:"block", fontWeight:"bold"}}>{v.username}</span>
                    <span>{v.message}</span>
                </div>
            )
        });
        return(
            <div>
                <div style={{
                    borderWidth:1,
                    borderColor:"#000",
                    borderStyle:"solid",
                    height:100,
                    overflow:"auto"
                }}>
                    {messages}                    
                </div>
                <form action="" method="POST" onSubmit={this.handleSendMessage}>
                    <input type="text" name="message" onChange={this.handleChatMessageUpdate} value={this.state.sendMessage} />
                    <button>Send</button>
                </form>
            </div>
        )
    }
}