import React, { useContext, useEffect, useRef, useState } from "react";
import $ from "jquery";
import { useSelector } from "react-redux";
import { AppContext } from "../context/appContext";
import "./MessageForm.css";


function MessageForm(props) {
    const [message, setMessage] = useState("");
    const [isTyping, setisTyping] = useState(false);
    const user = useSelector((state) => state.user);

    const { socket, currentRoom, setMessages, messages, privateMemberMsg } = useContext(AppContext);
    const [typerId, settyperId] = useState(null);

    const messageEndRef = useRef(null);
    useEffect(() => {
        scrollToBottom();


        let skillet = {
            "person": {
                "name": {
                    "first": 'not Updated',
                }
            }
        }

        $.extend(true, skillet.person, {
            name: {
                first: 'updated'
            }
        });


    }, [messages]);
    function getFormattedDate() {
        const date = new Date();
        const year = date.getFullYear();
        let month = (1 + date.getMonth()).toString();

        month = month.length > 1 ? month : "0" + month;
        let day = date.getDate().toString();

        day = day.length > 1 ? day : "0" + day;

        return day + "/" + month + "/" + year;
    }

    function scrollToBottom() {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    const todayDate = getFormattedDate();

    socket.off("room-messages").on("room-messages", (roomMessages) => {
        setMessages(roomMessages);
    });

    function handleSubmit(e) {
        e.preventDefault();
        if (!message) return;
        const today = new Date();
        const minutes = today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
        const time = today.getHours() + ":" + minutes;
        const roomId = currentRoom;
        const classname = ""
        socket.emit("message-room", roomId, message, classname, user, time, todayDate);
        setMessage("");
    }
    async function sendMsgId(id, currentRoom) {
        const response = await fetch("http://localhost:8000/delete_user_message", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id,
                currentRoom
            }),
        });
        let data = await response.json();
        if (response.ok) {
            socket.emit("reload-deleted", currentRoom);
            // setIsDeleted(true); 
            // setIsDeleted(current => [...current, id]);
            setMessages(data.msgList)
            return props.showAlert(data.msg, "warning");
        } else {
            return props.showAlert(data.error, "warning");
        }
    }

    var typingTimer;                //timer identifier
    var doneTypingInterval = 1000;  //time in ms (5 seconds)

    //on input change, start the countdown

    $('#msgin').on("input", function () {
        clearTimeout(typingTimer);
        setisTyping(true);
        typingTimer = setTimeout(function () {
            setisTyping(false);
        }, doneTypingInterval);
    });

    if (isTyping) {
        socket.emit("typing", isTyping, user)
    }
    else {
        socket.emit("typing", isTyping, user)
    }
    // function callServerScript() {
    //     console.log(searchTimeout);
    // }


    // function sendTyping() { 
    //     socket.emit("typing", "typing")
    // } 

    // Listen for `keyup` event 

    return (
        <>
            <div className="d-lg-flex">
                <div className="w-100 overflow-hidden position-relative">
                    <div className="p-3 p-lg-4 border-bottom user-chat-topbar">
                        <div className="row align-items-center">
                            <div className="col-sm-4 col-8">

                                {user && !privateMemberMsg?._id &&
                                    <div className="d-flex align-items-center">
                                        <div className="d-block d-lg-none me-2 ms-0" >
                                            <a className="user-chat-remove text-muted font-size-16 p-2"><i className="ri-arrow-left-s-line"></i></a>
                                        </div>
                                        <div className="me-3 ms-0">
                                            <img src="assets/images/users/avatar-4.jpg" className="rounded-circle avatar-xs" alt="" />
                                        </div>
                                        <div className="flex-grow-1 overflow-hidden">
                                            <h5 className="font-size-16 mb-0 text-truncate"><a href="#" className="text-reset user-profile-show">{currentRoom}</a></h5>
                                        </div>
                                    </div>
                                }

                                {user && privateMemberMsg?._id &&
                                    <div className="d-flex align-items-center">
                                        <div className="d-block d-lg-none me-2 ms-0">
                                            <a href="" className="user-chat-remove text-muted font-size-16 p-2"><i className="ri-arrow-left-s-line"></i></a>
                                        </div>
                                        <div className="me-3 ms-0">
                                            <img src={privateMemberMsg.picture} className="rounded-circle avatar-xs" alt="" />
                                        </div>
                                        <div className="flex-grow-1 overflow-hidden">
                                            <h5 className="font-size-16 mb-0 text-truncate"><a href="#" className="text-reset user-profile-show">{privateMemberMsg.name}</a> {props.sendScreenStatus ? <i className="ri-record-circle-fill font-size-10 text-success d-inline-block ms-1"></i> : <i className="ri-record-circle-fill font-size-10 text-muted d-inline-block ms-1"></i>}</h5>
                                        </div>
                                    </div>
                                }
                            </div>
                            <div className="col-sm-8 col-4">
                                <ul className="list-inline user-chat-nav text-end mb-0">
                                    <li className="list-inline-item d-none d-lg-inline-block me-2 ms-0">
                                        <button type="button" className="btn nav-btn" data-bs-toggle="modal" data-bs-target="#audiocallModal">
                                            <i className="ri-phone-line"></i>
                                        </button>
                                    </li>

                                    <li className="list-inline-item d-none d-lg-inline-block me-2 ms-0">
                                        <button type="button" className="btn nav-btn" data-bs-toggle="modal" data-bs-target="#videocallModal">
                                            <i className="ri-vidicon-line"></i>
                                        </button>
                                    </li>

                                    <li className="list-inline-item">
                                        <div className="dropdown">
                                            <button className="btn nav-btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                <i className="ri-more-fill"></i>
                                            </button>
                                            <div className="dropdown-menu dropdown-menu-end">
                                                <a className="dropdown-item d-block d-lg-none user-profile-show" href="#">View profile <i className="ri-user-2-line float-end text-muted"></i></a>
                                                <a className="dropdown-item d-block d-lg-none" href="#" data-bs-toggle="modal" data-bs-target="#audiocallModal">Audio <i className="ri-phone-line float-end text-muted"></i></a>
                                                <a className="dropdown-item d-block d-lg-none" href="#" data-bs-toggle="modal" data-bs-target="#videocallModal">Video <i className="ri-vidicon-line float-end text-muted"></i></a>
                                                <a className="dropdown-item" href="#">Archive <i className="ri-archive-line float-end text-muted"></i></a>
                                                <a className="dropdown-item" href="#">Muted <i className="ri-volume-mute-line float-end text-muted"></i></a>
                                                <a className="dropdown-item" href="#">Delete <i className="ri-delete-bin-line float-end text-muted"></i></a>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="chat-conversation p-3 p-lg-4" data-simplebar="init">
                        <div className="simplebar-wrapper" style={{ margin: "-24px" }}>
                            <div className="simplebar-height-auto-observer-wrapper">
                                <div className="simplebar-height-auto-observer">

                                </div>
                            </div>
                            <div className="simplebar-mask">
                                <div className="simplebar-offset" style={{ right: "-16.8px", bottom: "0px" }}>
                                    <div className="simplebar-content-wrapper" style={{ height: "100%", overflow: "hidden scroll" }}>
                                        <div className="simplebar-content" style={{ padding: " 24px" }}>
                                            {!user && <div className="alert alert-danger">Please login</div>}

                                            {user &&
                                                messages.map(({ _id: date, messagesByDate }, idx) => (
                                                    <ul className="list-unstyled mb-0" key={idx}>
                                                        <li>
                                                            <div className="chat-day-title">
                                                                <span className="title">{date}</span>
                                                            </div>
                                                        </li>
                                                        {messagesByDate?.map(({ _id, content, classname, time, from: sender }, msgIdx) => (
                                                            <li className={sender?.email == user?.email ? "right" : ""} key={msgIdx}>
                                                                <div className="conversation-list">
                                                                    <div className="chat-avatar">
                                                                        <img src={sender.picture} alt="" />
                                                                    </div>
                                                                    <div className="user-chat-content">
                                                                        {classname === "deleted" ?

                                                                            <div className="ctext-wrap">
                                                                                <div className="ctext-wrap-content deleted-container">
                                                                                    <p className="mb-0 deleted">
                                                                                        This message was deleted
                                                                                    </p>
                                                                                    {/* <p className="chat-time mb-0"><i className="ri-time-line align-middle"></i> <span className="align-middle">{time}</span></p> */}
                                                                                </div>
                                                                            </div>

                                                                            :

                                                                            <div className="ctext-wrap">
                                                                                <div className="ctext-wrap-content">
                                                                                    <p className="mb-0">
                                                                                        {content}
                                                                                    </p>
                                                                                    <p className="chat-time mb-0"><i className="ri-time-line align-middle"></i> <span className="align-middle">{time}</span></p>
                                                                                </div>

                                                                                {sender?.email == user?.email ?

                                                                                    <div className="dropdown align-self-start">
                                                                                        <a className="dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                                            <i className="ri-more-2-fill"></i>
                                                                                        </a>

                                                                                        <div className="dropdown-menu">
                                                                                            <a className="dropdown-item" href="#">Copy <i className="ri-file-copy-line float-end text-muted"></i></a>
                                                                                            <a className="dropdown-item" href="#">Forward <i className="ri-chat-forward-line float-end text-muted"></i></a>
                                                                                            <a className="dropdown-item" onClick={() => sendMsgId(_id, currentRoom)}>Delete <i className="ri-delete-bin-line float-end text-muted"></i></a>
                                                                                        </div>

                                                                                    </div>
                                                                                    :

                                                                                    ""

                                                                                }
                                                                            </div>

                                                                        }

                                                                        <div className="conversation-name">{sender._id == user?._id ? "You" : sender.name}</div>
                                                                    </div>

                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ))}
                                            <div ref={messageEndRef} />

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="simplebar-placeholder" style={{ width: "auto", height: "1152px" }}>
                            </div>
                        </div>
                        <div className="simplebar-track simplebar-horizontal" style={{ visibility: "hidden" }}>
                            <div className="simplebar-scrollbar" style={{ transform: "translate3d(0px, 0px, 0px)", display: "none" }}></div></div><div className="simplebar-track simplebar-vertical" style={{ visibility: "visible" }}><div className="simplebar-scrollbar" style={{ height: "273px", transform: "translate3d(0px, 0px, 0px)", display: "block" }}></div></div></div>

                    <div className="chat-input-section p-3 p-lg-4 border-top mb-0">
                        <form onSubmit={handleSubmit}>
                            <div className="row g-0">

                                <div className="col">
                                    <input type="text" id="msgin" autoComplete="off" className="form-control form-control-lg bg-light border-light" placeholder="Enter Message..." disabled={!user} value={message} onChange={(e) => setMessage(e.target.value)}></input>
                                </div>
                                <div className="col-auto">
                                    <div className="chat-input-links ms-md-2 me-md-0">
                                        <ul className="list-inline mb-0">
                                            <li className="list-inline-item" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Emoji">
                                                <button type="button" className="btn btn-link text-decoration-none font-size-16 btn-lg waves-effect">
                                                    <i className="ri-emotion-happy-line"></i>
                                                </button>
                                            </li>
                                            <li className="list-inline-item" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Attached File">
                                                <button type="button" className="btn btn-link text-decoration-none font-size-16 btn-lg waves-effect">
                                                    <i className="ri-attachment-line"></i>
                                                </button>
                                            </li>
                                            <li className="list-inline-item">

                                                <button type="submit" className="btn btn-primary font-size-16 btn-lg chat-send waves-effect waves-light">
                                                    <i className="ri-send-plane-2-fill"></i>
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </>
    );
}

export default MessageForm;
