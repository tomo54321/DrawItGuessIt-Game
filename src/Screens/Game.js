import React from 'react';
import SocketBoard from '../Components/SocketBoard/SocketBoard';
import Chat from '../Components/Chat/Chat';

export default class Game extends React.Component{

    constructor(props){
        super(props);
        this.state={
            connected:false,
            username: "",
            room: "",
            users: []
        };

        this.socket = props.socket;
        
        this.onTextChange = this.onTextChange.bind(this);
        this.onConnect = this.onConnect.bind(this);
        this.onLeaveRoom = this.onLeaveRoom.bind(this);
    }

    componentDidMount(){
        this.socket.on("user joined", ({username})=>{
            const users = this.state.users;
            users.push(username);
            this.setState({users});
        });

        this.socket.on("user left", ({username})=>{
            let users = [...this.state.users]
            const userIndex = users.indexOf(username);
            if(userIndex > -1){
                users.splice(userIndex, 1);
                this.setState({
                    users
                })
            }

            console.log(`${username} has left!`);
        });

        this.socket.on("user list", (remote_users)=>{
            let users = [...this.state.users, ...remote_users];
            this.setState({users});
        });

        this.socket.on("disconnect", ()=>{
            this.setState({connected:false})
        });
    }

    onTextChange(e){
        this.setState({[e.target.name] : e.target.value});
    }

    onConnect(e){
        this.socket.emit("join room", {
            room: this.state.room,
            username: this.state.username
        });
        this.setState({
            connected:true,
            users:[this.state.username]
        })
        e.preventDefault();
    }

    onLeaveRoom(e){
        this.socket.emit("leave room", {room: this.state.room});
        this.setState({
            connected:false
        })
        e.preventDefault();
    }

    render(){
        if(!this.state.connected){
            return(
            <form action="" method="POST" onSubmit={this.onConnect}>
                <input type="text" value={this.state.username} onChange={this.onTextChange} name="username" placeholder="Username"/>
                <input type="text" value={this.state.room} onChange={this.onTextChange} name="room" placeholder="Room"/>
                <button>Login</button>
            </form>)
        }
        const users = this.state.users.map((v, i)=>{
            return( <span key={"user-"+i} style={{display:"inline-block", padding:5}}>{v}</span> )
        });
        return (
            <>
            <button type="button" onClick={this.onLeaveRoom}>Leave</button>
            <SocketBoard 
            room={this.state.room} 
            socket={this.socket}
            controls
            />
            <div>
                {users}
            </div>
            <Chat room={this.state.room} socket={this.socket} />
            </>
        );
    }

}