import React, { useState } from 'react'


export const PrivateUserSidear = ({ joinRoom, setactivePhoneChatBox, setsendScreenStatus, members, privateMemberMsg, setPrivateMemberMsg, socket, user, messages }) => {

    const [typingUserId, settypingUserId] = useState(null);
    const [whereUserTyping, setwhereUserTyping] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    socket.on("typing", (myId, roomId) => {
        // setisTyping(`${myId}`);
        // settypingUserId(tpUser._id);
        setwhereUserTyping(roomId);
        settypingUserId(myId);
    })
    // console.log(`${user._id} | ${whereUserTyping}`);

    function handlePrivateMemberMsg(member) {
        // settoggleChat(true)

        setPrivateMemberMsg(member);
        setactivePhoneChatBox(true)

        member.status === "online" ?
            setsendScreenStatus(true) :
            setsendScreenStatus(false)



        const roomId = orderIds(user._id, member._id);
        // if (roomId === "KODRZ") {
        // console.log("You Select Kodrz");
        // }
        // else {
        joinRoom(roomId, false, user._id);
        // }
    }
    function orderIds(id1, id2) {
        if (id1 > id2) {
            return id1 + "-" + id2;
        } else {
            return id2 + "-" + id1;
        }
    }

    // messagesByDate.map(({ _id, content, classname, time, from: sender }) => (
    //    console.log("s");
    // ))

    const lastmsgs = (mess, mmbr) => {
        mess.map((item) => {
            // console.log(item.messagesByDate[item.messagesByDate.length-1].content);
            item.messagesByDate.map(({ from: sender ,content}) => {
                // console.log(sender._id);
                mmbr.map((itemx) => {
                    // console.log(itemx._id);
                    if ("631ec67cd6cca60a6d375d64" === itemx._id) {
                        // console.log("Id : " , content);
                    }
                })
            })
        })
    }
    lastmsgs(messages, members)

    return (

        < div >
            <div className="px-4 pt-4">
                <h4 className="mb-4">Chats</h4>
                <div className="search-box chat-search-box">
                    <div className="input-group mb-3 rounded-3">
                        <span className="input-group-text text-muted bg-light pe-1 ps-3" id="basic-addon1">
                            <i className="ri-search-line search-icon font-size-18"></i>
                        </span>
                        <input type="text" className="form-control bg-light" onChange={e => { setSearchTerm(e.target.value) }} placeholder="Search messages or users" aria-label="Search messages or users" aria-describedby="basic-addon1" />
                    </div>
                </div>
            </div>

            {/* status */}
            {/* <div className="px-4 pb-4" dir="ltr">

                                                <div className="owl-carousel owl-theme owl-loaded owl-drag" id="user-status-carousel">

                                                    <div className="owl-stage-outer"><div className="owl-stage" style={{ transform: 'translate3d(0px, 0px, 0px)', transition: 'all 0s ease 0s', width: '1014px' }}><div className="owl-item active" style={{ width: "186.8px", "margin-right": "16px" }}><div className="item">
                                                        <a href="#" className="user-status-box">
                                                            <div className="avatar-xs mx-auto d-block chat-user-img online">
                                                                <img src="assets/images/users/avatar-2.jpg" alt="user-img" className="img-fluid rounded-circle" />
                                                                <span className="user-status"></span>
                                                            </div>

                                                            <h5 className="font-size-13 text-truncate mt-3 mb-1">Patrick</h5>
                                                        </a>
                                                    </div></div><div className="owl-item active" style={{ width: "186.8px", "margin-right": "16px" }}><div className="item">
                                                        <a href="#" className="user-status-box">
                                                            <div className="avatar-xs mx-auto d-block chat-user-img online">
                                                                <img src="assets/images/users/avatar-4.jpg" alt="user-img" className="img-fluid rounded-circle" />
                                                                <span className="user-status"></span>
                                                            </div>

                                                            <h5 className="font-size-13 text-truncate mt-3 mb-1">Doris</h5>
                                                        </a>
                                                    </div></div><div className="owl-item active" style={{ width: "186.8px", "margin-right": "16px" }}><div className="item">
                                                        <a href="#" className="user-status-box">
                                                            <div className="avatar-xs mx-auto d-block chat-user-img online">
                                                                <img src="assets/images/users/avatar-5.jpg" alt="user-img" className="img-fluid rounded-circle" />
                                                                <span className="user-status"></span>
                                                            </div>

                                                            <h5 className="font-size-13 text-truncate mt-3 mb-1">Emily</h5>
                                                        </a>
                                                    </div></div><div className="owl-item active" style={{ width: "186.8px", "margin-right": "16px" }}><div className="item">
                                                        <a href="#" className="user-status-box">
                                                            <div className="avatar-xs mx-auto d-block chat-user-img online">
                                                                <img src="assets/images/users/avatar-6.jpg" alt="user-img" className="img-fluid rounded-circle" />
                                                                <span className="user-status"></span>
                                                            </div>

                                                            <h5 className="font-size-13 text-truncate mt-3 mb-1">Steve</h5>
                                                        </a>
                                                    </div></div><div className="owl-item" style={{ width: "186.8px", "margin-right": "16px" }}><div className="item">
                                                        <a href="#" className="user-status-box">
                                                            <div className="avatar-xs mx-auto d-block chat-user-img online">
                                                                <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                                    T
                                                                </span>
                                                                <span className="user-status"></span>
                                                            </div>

                                                            <h5 className="font-size-13 text-truncate mt-3 mb-1">Teresa</h5>
                                                        </a>
                                                    </div></div></div></div><div className="owl-nav disabled"><button type="button" role="presentation" className="owl-prev"><span aria-label="Previous">‹</span></button><button type="button" role="presentation" className="owl-next"><span aria-label="Next">›</span></button></div><div className="owl-dots disabled"></div></div>
                                            </div> */}
            <div>
                <h5 className="mb-3 px-3 font-size-16">Recent</h5>

                <div className="chat-message-list px-2" data-simplebar="init"><div className="simplebar-wrapper" style={{ margin: "0px -8px" }}><div className="simplebar-height-auto-observer-wrapper"><div className="simplebar-height-auto-observer"></div></div><div className="simplebar-mask"><div className="simplebar-offset" style={{ right: "-16.8px", bottom: "0px" }}><div className="simplebar-content-wrapper" style={{ height: "100%", overflow: "hidden scroll" }}><div className="simplebar-content" style={{ padding: "0px 8px" }}>



                    <ul className="list-unstyled chat-list chat-user-list">

                        {members.filter((member) => {
                            if (searchTerm === "") {
                                return member
                            }
                            else if (member.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                                return member
                            }
                            return null
                        }).map((member, idx) => (
                            <li className={privateMemberMsg?._id === member?._id ? "active" : `${whereUserTyping === user._id && member._id === typingUserId ? "typing active" : "unread"}`} key={member._id} onClick={() => handlePrivateMemberMsg(member)} disabled={member._id === user._id} style={{ display: `${member._id === user._id ? "none" : "block"}`, cursor: "pointer", userSelect: "none" }}>
                                <a href="#">
                                    <div className="d-flex">
                                        <span className="user-status"></span>
                                        <div className={`chat-user-img ${member.status === "online" && "online"} align-self-center me-3 ms-0`}>
                                            <img src={member.picture} className="rounded-circle avatar-xs" alt="" />
                                            <span className="user-status"></span>
                                        </div>

                                        <div className="flex-grow-1 overflow-hidden">
                                            <h5 className="text-truncate font-size-15 mb-1">{member.name}</h5>

                                            {whereUserTyping === user._id && member._id === typingUserId ?
                                                <p className="chat-user-message text-truncate mb-0">typing<span className="animate-typing">
                                                    <span className="dot"></span>
                                                    <span className="dot"></span>
                                                    <span className="dot"></span>
                                                </span></p>
                                                :
                                                <p className="chat-user-message text-truncate mb-0">How are you Alex.</p>

                                                // messages.map((item)=>{ 
                                                //     <p className="chat-user-message text-truncate mb-0">{lastmsgs(messages)}</p>
                                                // })
                                                // messages.map((item) => {
                                                // return <p className="chat-user-message text-truncate mb-0">{item.messagesByDate[item.messagesByDate.length - 1].content}</p>;

                                                // messages.map((item) => {
                                                    // console.log(item.messagesByDate[item.messagesByDate.length-1].content);
                                                    // item.messagesByDate.map(({ from: sender }, content) => {
                                                        // console.log(sender._id);
                                                        // members.map((itemx) => {
                                                            // console.log(itemx._id);
                                                            // if (sender._id === itemx._id) {
                                                            //     console.log("True");
                                                            // }
                                                        //    return <p className="chat-user-message text-truncate mb-0">{item.messagesByDate[item.messagesByDate.length-1].content}</p>
                                                        // })
                                                    // })
                                                // })
                                                // return item.messagesByDate[item.messagesByDate.length-1].content; 
                                                // })
                                            }
                                        </div>
                                        <div className="font-size-11">12:01 PM</div>
                                        <div className="unread-message">
                                            <span className="badge badge-soft-danger rounded-pill">{user.newMessages[orderIds(member._id, user._id)]}</span>
                                        </div>
                                    </div>
                                </a>
                            </li>
                        ))}
                        {/* <li className="typing unread"> */}

                    </ul>
                </div></div></div></div><div className="simplebar-placeholder" style={{ width: "auto", height: "890px" }}></div></div><div className="simplebar-track simplebar-horizontal" style={{ visibility: "hidden" }} ><div className="simplebar-scrollbar" style={{ transform: "translate3d(0px, 0px, 0px)", display: "none" }}></div></div><div className="simplebar-track simplebar-vertical" style={{ visibility: "visible" }}><div className="simplebar-scrollbar" style={{ height: "243px", transform: "translate3d(0px, 0px, 0px)", display: "block" }}></div></div></div>
            </div>
        </div>
    )
}
