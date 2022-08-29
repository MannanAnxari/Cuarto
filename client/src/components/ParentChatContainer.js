import MessageForm from "../components/MessageForm";
import React from 'react'

export default function ParentChatContainer(props) {
    return (
        <>
            <MessageForm showAlert={props.showAlert} />
        </>
    )
}
