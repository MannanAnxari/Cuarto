import React from "react"; 
import Sidebar from "../components/Sidebar";
import MessageForm from "../components/MessageForm";
import "./Chat.css"

function Chat() {

    return (
        <div className="container-main">
            <div className="row">
                <div  className="col-md-4 sidebar" >
                    <Sidebar />
                </div>
                <div className="col-md-8 chat-box ps-0" >
                    <MessageForm />
                </div>
            </div>
        </div>
    );
}

export default Chat;
