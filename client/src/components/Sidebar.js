import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppContext } from "../context/appContext";
import MessageForm from "../components/MessageForm";
import { useLogoutUserMutation } from "../services/appApi";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
// import swal from 'sweetalert';
import { addNotifications, resetNotifications } from "../features/userSlice";
import "./Sidebar.css";
import Profile from "./Profile";
import { GroupSidebar } from "./GroupSidebar";
import { PrivateUserSidear } from "./PrivateUserSidebar";


function Sidebar(props) {

    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [logoutUser] = useLogoutUserMutation();
    const { socket, setMembers, members, setCurrentRoom,  setAllGroups, allgroups,  setRooms, privateMemberMsg, rooms, setPrivateMemberMsg, currentRoom, messages } = useContext(AppContext);
    const [activePhoneChatBox, setactivePhoneChatBox] = useState(false);
    const [sendScreenStatus, setsendScreenStatus] = useState(false);
    const [groupbtn, setGroup] = useState(false);
    const [chatbtn, setChat] = useState(true);
    const [memberbtn, setmember] = useState(false);
    const [profilebtn, setProfile] = useState(false);
    useEffect(() => {
        if (!user) {
            return <>Please Login</>;
        }
        if (user) {
            setCurrentRoom("Default Group");
            // console.log(allgroups);
            // getRooms();
            socket.emit("join-room", "Default Group");
            socket.emit("new-user");
            socket.emit("new-group");
        }
    }, []);
    if (!user) {
        window.location.replace("/login");
    }


    function joinRoom(room, isPublic = true, id,pass) { 
        socket.emit("join-room", room, currentRoom, id);
        setCurrentRoom(room);
        setactivePhoneChatBox(true)
        if (isPublic) {
            setPrivateMemberMsg(null);
        }
        dispatch(resetNotifications(room));

    }
    const setTheme = () => {
        if (document.body.getAttribute("data-layout-mode") === "dark") {
            document.body.setAttribute("data-layout-mode", "light");
            toast.success("Light Mode Enabled");
        }
        else {
            document.body.setAttribute("data-layout-mode", "dark")
            toast.success("Dark Mode Enabled");
        }
    }

    async function handleLogout(e) {
        e.preventDefault();
        await logoutUser(user); 
        // window.location.replace("/");
    }



    const changeActive = () => {
        setactivePhoneChatBox(false)
    }


    socket.off("notifications").on("notifications", (room) => {
        if (currentRoom !== room) dispatch(addNotifications(room));
    });





    var id = user._id;
    socket.off("new-user", (id)).on("new-user", (payload) => {
        setMembers(payload);
    }); 

    // socket.off("new-group").on("new-group", (payload) => {
    //     setAllGroups(payload);
    // });
    // function getRooms() {
        // fetch("https://cuarta.herokuapp.com/rooms")
    //     fetch("http://localhost:8000/rooms")
    //         .then((res) => res.json())
    //         .then((data) => setRooms(data));
    // }





    const groupbtnclick = () => {
        setmember(false);
        setGroup(true);
        setProfile(false);
        setChat(false);
    }
    const chatbtnclick = () => {
        setmember(false);
        setGroup(false);
        setChat(true);
        setProfile(false);
    }
    const memberbtnclick = () => {
        setmember(true);
        setGroup(false);
        setChat(false);
        setProfile(false);
    }

    const profilebtnclick = () => {
        setmember(false);
        setChat(false);
        setGroup(false);
        setProfile(true);
    }




    return (
        <>
            <div className="layout-wrapper d-lg-flex">
                {user && (
                    <div className="side-menu flex-lg-column me-lg-1 ms-lg-0">
                        <div className="navbar-brand-box">
                            <Link to={"/"} className="logo logo-dark">
                                <span className="logo-sm">
                                    <img src="assets/images/logo.png" alt="" height="30" />
                                </span>
                            </Link>

                            <Link to={"/"} className="logo logo-light">
                                <span className="logo-sm">
                                    <img src="assets/images/logo.png" alt="" height="30" />
                                </span>
                            </Link>
                        </div>
                        <div className="flex-lg-column my-auto">
                            <ul className="nav nav-pills side-menu-nav justify-content-center" role="tablist">
                                <li className="nav-item" data-bs-toggle="tooltip" data-bs-placement="top" title="Home">
                                    <Link to="/" className="nav-link" id="pills-user-tab" role="tab" >
                                        <i className="ri-home-2-line"></i>
                                    </Link>
                                </li>
                                <li className="nav-item" data-bs-toggle="tooltip" data-bs-placement="top" title="Chats">
                                    <div onClick={chatbtnclick} >
                                        <a className={`nav-link ${chatbtn && "active"}`} style={{ cursor: "pointer" }} id="pills-chat-tab" role="tab" >
                                            <i className="ri-message-3-line"></i>
                                        </a>
                                    </div>
                                </li>
                                <li className="nav-item" data-bs-toggle="tooltip" data-bs-placement="top" title="P2P">
                                    <div onClick={memberbtnclick} >
                                        <a className={`nav-link ${memberbtn && "active"}`} style={{ cursor: "pointer" }} id="pills-user-tab" role="tab" >
                                            <i className="ri-user-2-line"></i>
                                        </a>
                                    </div>
                                </li>
                                <li className="nav-item" data-bs-toggle="tooltip" data-bs-placement="top" title="Groups">
                                    <div onClick={groupbtnclick} >
                                        <a className={`nav-link ${groupbtn && "active"}`} style={{ cursor: "pointer" }} id="pills-groups-tab" role="tab" >
                                            <i className="ri-group-line"></i>
                                        </a>
                                    </div>
                                </li>
                                <li className="nav-item" data-bs-toggle="tooltip" data-bs-placement="top" title="Settings">
                                    <div onClick={profilebtnclick} >
                                        <a className={`nav-link ${profilebtn && "active"}`} style={{ cursor: "pointer" }} id="pills-user-tab" role="tab" >
                                            <i className="ri-settings-line"></i>
                                        </a>
                                    </div>
                                </li>
                                <li className="nav-item dropdown profile-user-dropdown d-inline-block d-lg-none">
                                    <a className="nav-link dropdown-toggle" href="#" role="button" style={{ cursor: "pointer" }} data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <img src={user.picture} alt="" className="profile-user rounded-circle" />
                                    </a>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item d-flex" href="#">{user.name} <i className="ri-profile-line float-end text-muted"></i></a>
                                        <a className="dropdown-item" href="#" onClick={profilebtnclick}>Profile <i className="ri-profile-line float-end text-muted"></i></a>
                                        <div className="dropdown-divider"></div>
                                        <Link className="dropdown-item" to="/" onClick={handleLogout} >Log out <i className="ri-logout-circle-r-line float-end text-muted"></i></Link>
                                    </div>
                                </li>
                            </ul>

                        </div>

                        <div className="flex-lg-column d-none d-lg-block">
                            <ul className="nav side-menu-nav justify-content-center">
                                <li className="nav-item">
                                    <a className="nav-link light-dark-mode" onClick={setTheme} data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-placement="right" title="Dark / Light Mode">
                                        <i className='ri-sun-line theme-mode-icon'></i>
                                    </a>
                                </li>

                                <li className="nav-item btn-group dropup profile-user-dropdown">
                                    <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <img src={user.picture} alt="" className="profile-user rounded-circle" />
                                    </a>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item d-flex" href="#">{user.name} <i className="ri-profile-line float-end text-muted"></i></a>
                                        <div className="dropdown-divider"></div>
                                        <Link to="/" className="dropdown-item" onClick={handleLogout} >Log out <i className="ri-logout-circle-r-line float-end text-muted"></i></Link>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                )}
                <div className="chat-leftsidebar me-lg-1 ms-lg-0">

                    <div className="tab-content">
                        <div className="tab-pane fade active show" id="pills-chat" role="tabpanel" aria-labelledby="pills-chat-tab">

                            <div>
                                {groupbtn &&
                                    <GroupSidebar joinRoom={joinRoom} rooms={rooms} currentRoom={currentRoom} user={user} />
                                }

                                {chatbtn &&
                                    <PrivateUserSidear user={user} joinRoom={joinRoom} members={members} privateMemberMsg={privateMemberMsg} messages={messages} setPrivateMemberMsg={setPrivateMemberMsg} socket={socket} setactivePhoneChatBox={setactivePhoneChatBox} setsendScreenStatus={setsendScreenStatus} />
                                }
                                {memberbtn &&
                                    <PrivateUserSidear user={user} joinRoom={joinRoom} members={members} privateMemberMsg={privateMemberMsg} messages={messages} setPrivateMemberMsg={setPrivateMemberMsg} socket={socket} setactivePhoneChatBox={setactivePhoneChatBox} setsendScreenStatus={setsendScreenStatus} />
                                }

                                {profilebtn &&
                                    <Profile showAlert={props.showAlert} user={user} />
                                }
                            </div>
                        </div>

                    </div>
                </div>

                <div className={`user-chat w-100 ${activePhoneChatBox ? "user-chat-show" : ""} overflow-hidden`}>
                    <MessageForm showAlert={props.showAlert} sendScreenStatus={sendScreenStatus} />
                    <div className="d-block d-lg-none me-2 ms-0 back-phone-chat-btn" onClick={changeActive}>
                        <a className="user-chat-remove text-muted font-size-16 p-2"><i className="ri-arrow-left-s-line"></i></a>
                    </div>
                </div>
            </div>
        </>
    );

}

export default Sidebar;
