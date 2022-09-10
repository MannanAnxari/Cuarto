import React, { useContext, useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppContext } from "../context/appContext";
import MessageForm from "../components/MessageForm";
import { useLogoutUserMutation } from "../services/appApi";
import { BrowserRouter, Link } from "react-router-dom";
// import swal from 'sweetalert';
import { addNotifications, resetNotifications } from "../features/userSlice";
import "./Sidebar.css";


function Sidebar(props) {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [logoutUser] = useLogoutUserMutation();
    const [pname, setPname] = useState(user.name);
    const { socket, setMembers, members, setCurrentRoom, setRooms, privateMemberMsg, rooms, setPrivateMemberMsg, currentRoom } = useContext(AppContext);
    const [toggleChat, settoggleChat] = useState(false);
    const [isActiveEdit, setActiveEdit] = useState("false");
    const [isActiveEditPass, setisActiveEditPass] = useState("false");
    const [activePhoneChatBox, setactivePhoneChatBox] = useState(false);
    const [sendScreenStatus, setsendScreenStatus] = useState(false);
    const [typingUserId, settypingUserId] = useState(null);
    const [memberbtn, setmember] = useState(true);
    const [groupbtn, setGroup] = useState(false);
    const [profilebtn, setProfile] = useState(false);
    const [isSelected, setIsSelected] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [ppass, setPpass] = useState("*******");
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isTyping, setisTyping] = useState(false);

    let userId = user._id;
    var id = user._id;

    const enableEdit = () => {
        setActiveEdit(!isActiveEdit);
    };
    const enableEditPass = () => {
        setisActiveEditPass(!isActiveEditPass);
    };
    const setTheme = () => {
        document.body.hasAttribute("data-layout-mode") && "dark" == document.body.getAttribute("data-layout-mode")
            ? document.body.setAttribute("data-layout-mode", "light") : document.body.setAttribute("data-layout-mode", "dark")
    }

    async function handleLogout(e) {
        e.preventDefault();
        await logoutUser(user);
        // redirect to home page
        window.location.replace("/");
    }
    function joinRoom(room, isPublic = true, id) {
        socket.emit("join-room", room, currentRoom, id);
        setCurrentRoom(room);
        setactivePhoneChatBox(true)
        if (isPublic) {
            setPrivateMemberMsg(null);
        }
        dispatch(resetNotifications(room));

    }


    const changeActive = () => {
        setactivePhoneChatBox(false)
    }
    socket.off("notifications").on("notifications", (room) => {
        if (currentRoom !== room) dispatch(addNotifications(room));
    });

    socket.on("typing", (isTyping, user) => {
        setisTyping(isTyping);
        settypingUserId(user._id);
    })

    useEffect(() => {
        if (user) {
            setCurrentRoom("KODRZ");
            getRooms();
            socket.emit("join-room", "KODRZ");
            socket.emit("new-user");
        }
    }, []);

    socket.off("new-user", (id)).on("new-user", (payload) => {
        setMembers(payload);
    });

    function getRooms() {
        fetch("https://cuarta.herokuapp.com/rooms")
            // fetch("http://localhost:8000/rooms")
            .then((res) => res.json())
            .then((data) => setRooms(data));
    }

    function orderIds(id1, id2) {
        if (id1 > id2) {
            return id1 + "-" + id2;
        } else {
            return id2 + "-" + id1;
        }
    }

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
        joinRoom(roomId, false, id);
        // }
    }



    const groupbtnclick = () => {
        setmember(false);
        setGroup(true);
        setProfile(false);
        setSearchTerm("");
    }
    const memberbtnclick = () => {
        setmember(true);
        setGroup(false);
        setProfile(false);
        setSearchTerm("");
    }

    const profilebtnclick = () => {
        setmember(false);
        setGroup(false);
        setProfile(true);
        setSearchTerm("");
    }


    if (!user) {
        return <></>;
    }

    async function postPass(e) {
        e.preventDefault();
        const response = await fetch("http://localhost:8000/update_password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId,
                ppass,
            }),
        });
        let data = await response.json();
        if (response.ok) {
            return props.showAlert(data.msg, "success");
        } else {
            return props.showAlert(data.error, "warning");
        }
    }

    var pImage = user.picture;

    async function postName(e) {
        e.preventDefault();
        const response = await fetch("http://localhost:8000/update_name", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId,
                pname,
            }),
        });
        let data = await response.json();
        if (response.ok) {
            return props.showAlert(data.msg, "success");
        } else {
            return props.showAlert(data.error, "warning");
        }
    }
    async function uploadImage() {
        const data = new FormData();
        data.append("file", image);
        data.append("upload_preset", "crl4gmtt");
        try {

            let res = await fetch("https://api.cloudinary.com/v1_1/dmfeom3v4/image/upload", {
                method: "post",
                body: data,
            });
            const urlData = await res.json();
            return urlData.url;
        } catch (error) {
            console.log(error + "Image Not Upload Sucessfully!");
        }
    }
    async function handelUpdateProPic(e) {
        console.log("Upload");
        e.preventDefault();
        if (!image) return alert("Please upload your profile picture");
        const img = await uploadImage(image);
        // signup the user
        e.preventDefault();
        const response = await fetch("http://localhost:8000/update_profile_picture", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                img,
                userId,
            }),
        });
        let data = await response.json();
        if (response.ok) {
            return props.showAlert(data.msg, "success");
        } else {
            return props.showAlert(data.error, "warning");
        }
    }
    function validateImg(e) {
        const file = e.target.files[0];
        if (file.size >= 1048576) {
            return alert("Max file size is 1mb");
        } else {
            setIsSelected(true);
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    }
    // if (isPhone) {
    //     return (
    //         <>
    //             <div className="container">
    //                 <Row>
    //                     {toggleChat === false ? <Col md={4} className="sidebar" >
    //                         <div className="row ">
    //                             <div className="col-12 main-sidebar-parent px-0">
    //                                 <div className="main">
    //                                     <div className="side-nav">
    //                                         <div className="profile">
    //                                             <img src={user.picture} alt="profile-pic" />
    //                                         </div>
    //                                         <div className="icos">
    //                                             <div className="icon-container single_chat mt-4 px-4">
    //                                                 <button onClick={memberbtnclick} style={{ width: "100%", background: "transparent" }} className="border-0"><i className="text-white fa-solid fa-user"></i></button>
    //                                             </div>
    //                                             <div className="icon-container group_chat">
    //                                                 <button onClick={groupbtnclick} style={{ width: "100%", background: "transparent" }} className="border-0"><i className="text-white fa-solid fa-users"></i></button>
    //                                             </div>
    //                                         </div>
    //                                     </div>
    //                                 </div>
    //                                 <div className="items" >
    //                                     <div className="sections">
    //                                         {groupbtn === true ?

    //                                             <div className="groups mt-3" id="groups">
    //                                                 <h2 className="text-white text-center fw-bold ff-cod"><span className="text-danger opacity-75">#</span>Groups</h2>
    //                                                 <div className="search-bar d-flex">

    //                                                     <div className="container-form m-3 position-relative  d-flex align-items-center">
    //                                                         <input type="text" autoComplete="off" id="box" placeholder="Search Groups..." onChange={e => { setSearchTerm(e.target.value) }} className="search__box" />
    //                                                         <i className="fas fa-search search__icon me-2 text-white position-absolute"></i>
    //                                                     </div>
    //                                                 </div>
    //                                                 {rooms.filter((room) => {
    //                                                     if (searchTerm === "") {
    //                                                         return room
    //                                                     }
    //                                                     else if (room.toLowerCase().includes(searchTerm.toLowerCase())) {
    //                                                         return room
    //                                                     }
    //                                                     return null
    //                                                 }).map((room, idx) => (
    //                                                     <ListGroup.Item key={idx} onClick={() => joinRoom(room)} active={room === currentRoom} style={{ cursor: "pointer", display: "flex", justifyContent: "space-between" }}>
    //                                                         {room} {currentRoom !== room && <span className="badge rounded-pill bg-danger">{user.newMessages[room]}</span>}
    //                                                     </ListGroup.Item>
    //                                                 ))}
    //                                                 {/* </ListGroup> */}
    //                                             </div> : ""
    //                                         }
    //                                         {memberbtn === true ? <div className="members mt-3" id="membr">
    //                                             <h2 className="text-white text-center fw-bold ff-cod"><span className="text-danger opacity-75">#</span>Peoples</h2>
    //                                             <div className="search-bar d-flex">
    //                                                 {/* <input type="text" onChange={e => {setSearchTerm(e.target.value)}} className="form-control w-100 rounded-0 my-3 border-0 shadow-none" placeholder="Search Users..." />
    //                                     <i className="fas fa-search bg-white my-3 d-flex pe-2 align-items-center"></i> */}


    //                                                 <div className="container-form search-inp m-3 position-relative d-flex align-items-center">
    //                                                     <input type="text" autoComplete="off" id="box" placeholder="Search Users..." onChange={e => { setSearchTerm(e.target.value) }} className="search__box" />
    //                                                     <i className="fas fa-search search__icon me-2 text-white position-absolute" ></i>
    //                                                 </div>
    //                                                 {/* <button className="btn btn-dark my-3 bg-dark border-0"> */}
    //                                                 {/* </button> */}
    //                                             </div>
    //                                             {members.filter((member) => {
    //                                                 if (searchTerm === "") {
    //                                                     return member
    //                                                 }
    //                                                 else if (member.name.toLowerCase().includes(searchTerm.toLowerCase())) {
    //                                                     return member

    //                                                 }
    //                                                 return null
    //                                             }).map((member, idx) => (
    //                                                 <ListGroup.Item key={member.id} active={privateMemberMsg?._id === member?._id} onClick={() => handlePrivateMemberMsg(member)} disabled={member._id === user._id} style={{ display: `${member._id === user._id ? "none" : "block"}`, cursor: "pointer", userSelect: "none" }}>
    //                                                     <Row className="d-flex align-items-center">
    //                                                         <Col xs={3} className="member-status">
    //                                                             <img src={member.picture} alt="Profile Pic" className="member-status-img" />
    //                                                             {member.status === "online" ? <i className="fas fa-circle sidebar-online-status"></i> : <i className="fas fa-circle sidebar-offline-status"></i>}
    //                                                         </Col>
    //                                                         <Col xs={8}>
    //                                                             {member.name}
    //                                                             {member._id === user?._id && " (You)"}
    //                                                             {member.status === "offline" && " (Offline)"}
    //                                                         </Col>
    //                                                         <Col xs={1} className="p-0">
    //                                                             <span className="badge rounded-pill bg-danger">{user.newMessages[orderIds(member._id, user._id)]}</span>
    //                                                         </Col>
    //                                                     </Row>
    //                                                 </ListGroup.Item>
    //                                             ))}
    //                                         </div> : ""
    //                                         }

    //                                     </div>
    //                                 </div>
    //                             </div>
    //                         </div>
    //                     </Col> : null}
    //                     {toggleChat === true ? <Col md={8} className="chat-box ps-0" >
    //                         <MessageForm showAlert={props.showAlert} />
    //                     </Col> : null}
    //                     {toggleChat === true ? <div className="back-btn">
    //                         <div className="back-ico" onClick={handleBackBtn}>
    //                             <i className="fa-solid fa-left-long"></i>
    //                         </div>
    //                     </div> : null}
    //                 </Row>
    //             </div>
    //         </>
    //     );
    // }

    return (
        <>
            <div className="layout-wrapper d-lg-flex">

                {user && (

                    <div className="side-menu flex-lg-column me-lg-1 ms-lg-0">
                        <div className="navbar-brand-box">
                            <a href="index.html" className="logo logo-dark">
                                <span className="logo-sm">
                                    <img src="assets/images/logo.svg" alt="" height="30" />
                                </span>
                            </a>

                            <a href="index.html" className="logo logo-light">
                                <span className="logo-sm">
                                    <img src="assets/images/logo.svg" alt="" height="30" />
                                </span>
                            </a>
                        </div>
                        <div className="flex-lg-column my-auto">
                            <ul className="nav nav-pills side-menu-nav justify-content-center" role="tablist">
                                <li className="nav-item" data-bs-toggle="tooltip" data-bs-placement="top" title="Home">
                                    <Link to="/">
                                        <a className="nav-link" id="pills-user-tab" role="tab" >
                                            <i className="ri-home-2-line"></i>
                                        </a>
                                    </Link>
                                </li>
                                <li className="nav-item" data-bs-toggle="tooltip" data-bs-placement="top" title="Chats">
                                    <Link to="/chat">
                                        <a className="nav-link" id="pills-chat-tab" role="tab" >
                                            <i className="ri-message-3-line"></i>
                                        </a>
                                    </Link>
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

                            {!toggleChat &&
                                <div>
                                    {groupbtn &&
                                        <div className="tab-pane active" id="pills-groups" role="tabpanel" aria-labelledby="pills-groups-tab">
                                            <div>
                                                <div className="p-4">
                                                    <div className="user-chat-nav float-end">
                                                        <div data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Create group">

                                                            <button type="button" className="btn btn-link text-decoration-none text-muted font-size-18 py-0" data-bs-toggle="modal" data-bs-target="#addgroup-exampleModal">
                                                                <i className="ri-group-line me-1 ms-0"></i>
                                                            </button>
                                                        </div>

                                                    </div>
                                                    <h4 className="mb-4">Groups</h4>

                                                    <div className="modal fade" id="addgroup-exampleModal" tabindex="-1" aria-labelledby="addgroup-exampleModalLabel" aria-hidden="true" style={{ display: "none" }}>
                                                        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                                                            <div className="modal-content">
                                                                <div className="modal-header">
                                                                    <h5 className="modal-title font-size-16" id="addgroup-exampleModalLabel">Create New Group</h5>
                                                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">
                                                                    </button>
                                                                </div>
                                                                <div className="modal-body p-4">
                                                                    <form>
                                                                        <div className="mb-4">
                                                                            <label for="addgroupname-input" className="form-label">Group Name</label>
                                                                            <input type="text" className="form-control" id="addgroupname-input" placeholder="Enter Group Name" />
                                                                        </div>
                                                                        <div className="mb-4">
                                                                            <label className="form-label">Group Members</label>
                                                                            <div className="mb-3">
                                                                                <button className="btn btn-light btn-sm" type="button" data-bs-toggle="collapse" data-bs-target="#groupmembercollapse" aria-expanded="true" aria-controls="groupmembercollapse">
                                                                                    Select Members
                                                                                </button>
                                                                            </div>

                                                                            <div className="collapse show" id="groupmembercollapse">
                                                                                <div className="card border">
                                                                                    <div className="card-header">
                                                                                        <h5 className="font-size-15 mb-0">Contacts</h5>
                                                                                    </div>
                                                                                    <div className="card-body p-2">
                                                                                        <div data-simplebar="init" style={{ "max-height": "150px" }}><div className="simplebar-wrapper" style={{ margin: "0px" }}><div className="simplebar-height-auto-observer-wrapper"><div className="simplebar-height-auto-observer"></div></div><div className="simplebar-mask"><div className="simplebar-offset" style={{ right: "0px", bottom: "0px" }}><div className="simplebar-content-wrapper" style={{ height: "auto", overflow: "hidden" }}><div className="simplebar-content" style={{ padding: "0px" }}>
                                                                                            <div>
                                                                                                <ul className="list-unstyled contact-list">
                                                                                                    <li>
                                                                                                        <div className="form-check">
                                                                                                            <input type="checkbox" className="form-check-input" id="memberCheck1" checked="" />
                                                                                                            <label className="form-check-label" for="memberCheck1">Albert Rodarte</label>
                                                                                                        </div>
                                                                                                    </li>

                                                                                                    <li>
                                                                                                        <div className="form-check">
                                                                                                            <input type="checkbox" className="form-check-input" id="memberCheck2" />
                                                                                                            <label className="form-check-label" for="memberCheck2">Allison Etter</label>
                                                                                                        </div>
                                                                                                    </li>
                                                                                                </ul>
                                                                                            </div>

                                                                                        </div></div></div></div><div className="simplebar-placeholder" style={{ width: "0px", height: "0px" }}></div></div><div className="simplebar-track simplebar-horizontal" style={{ visibility: "hidden" }}><div className="simplebar-scrollbar" style={{ transform: "translate3d(0px, 0px, 0px)", display: "none" }}></div></div><div className="simplebar-track simplebar-vertical" style={{ visibility: "hidden" }}><div className="simplebar-scrollbar" style={{ transform: "translate3d(0px, 0px, 0px)", display: "none", height: " 25px" }}></div></div></div>
                                                                                    </div>

                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="mb-3">
                                                                            <label for="addgroupdescription-input" className="form-label">Description</label>
                                                                            <textarea className="form-control" id="addgroupdescription-input" rows="3" placeholder="Enter Description"></textarea>
                                                                        </div>
                                                                    </form>
                                                                </div>
                                                                <div className="modal-footer">
                                                                    <button type="button" className="btn btn-link" data-bs-dismiss="modal">Close</button>
                                                                    <button type="button" className="btn btn-primary">Create Groups</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="search-box chat-search-box">
                                                        <div className="input-group rounded-3">
                                                            <span className="input-group-text text-muted bg-light pe-1 ps-3" id="basic-addon1">
                                                                <i className="ri-search-line search-icon font-size-18"></i>
                                                            </span>
                                                            <input type="text" className="form-control bg-light" placeholder="Search groups..." onChange={e => { setSearchTerm(e.target.value) }} aria-label="Search groups..." aria-describedby="basic-addon1" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="p-4 chat-message-list chat-group-list" data-simplebar="init"><div className="simplebar-wrapper" style={{ margin: "-24px" }}><div className="simplebar-height-auto-observer-wrapper"><div className="simplebar-height-auto-observer"></div></div><div className="simplebar-mask"><div className="simplebar-offset" style={{ right: "0px", bottom: "0px" }}><div className="simplebar-content-wrapper" style={{ height: "100%", overflow: "hidden" }}><div className="simplebar-content" style={{ padding: "24px" }}>


                                                    <ul className="list-unstyled chat-list">


                                                        {rooms.filter((room) => {
                                                            if (searchTerm === "") {
                                                                return room
                                                            }
                                                            else if (room.toLowerCase().includes(searchTerm.toLowerCase())) {
                                                                return room
                                                            }
                                                            return null
                                                        }).map((room, idx) => (


                                                            <li key={idx} className={room === currentRoom ? "active" : ""} onClick={() => joinRoom(room, user._id)} style={{ cursor: "pointer" }}>
                                                                <a>
                                                                    <div className="d-flex align-items-center">
                                                                        {/* <div className="chat-user-img online align-self-center me-3 ms-0">
                                                                                <img src="assets/images/users/avatar-2.jpg" className="rounded-circle avatar-xs" alt="" />
                                                                                <span className="user-status"></span>
                                                                            </div> */}
                                                                        <div className="chat-user-img align-self-center me-3 ms-0"><div className="avatar-xs"><span className="avatar-title rounded-circle bg-soft-primary text-primary">K</span></div></div>
                                                                        <div className="flex-grow-1 overflow-hidden">
                                                                            <h5 className="text-truncate font-size-14 mb-0"> {room} {currentRoom !== room && <span className="badge badge-soft-danger rounded-pill float-end">{user.newMessages[room]}</span>}</h5>
                                                                        </div>
                                                                    </div>
                                                                </a>
                                                            </li>

                                                        ))}

                                                        {/* <li>
                                                            <a href="#">
                                                                <div className="d-flex align-items-center">
                                                                    <div className="chat-user-img me-3 ms-0">
                                                                        <div className="avatar-xs">
                                                                            <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                                                R
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex-grow-1 overflow-hidden">
                                                                        <h5 className="text-truncate font-size-14 mb-0">#Reporting <span className="badge badge-soft-danger rounded-pill float-end">+23</span></h5>
                                                                    </div>
                                                                </div>
                                                            </a>
                                                        </li> */}

                                                    </ul>
                                                </div></div></div></div><div className="simplebar-placeholder" style={{ width: "auto", height: "445px" }}></div></div><div className="simplebar-track simplebar-horizontal" style={{ visibility: "hidden" }}><div className="simplebar-scrollbar" style={{ transform: "translate3d(0px, 0px, 0px)", display: "none" }}></div></div><div className="simplebar-track simplebar-vertical" style={{ visibility: "hidden" }}><div className="simplebar-scrollbar" style={{ transform: "translate3d(0px, 0px, 0px)", display: "none" }}></div></div></div>
                                            </div>
                                        </div>
                                    }

                                    {memberbtn &&
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


                                                            <li className={privateMemberMsg?._id === member?._id ? "active" : `${isTyping && typingUserId === member._id ? "typing" : "unread"}`} key={member.id} onClick={() => handlePrivateMemberMsg(member)} disabled={member._id === user._id} style={{ display: `${member._id === user._id ? "none" : "block"}`, cursor: "pointer", userSelect: "none" }}>
                                                                <a href="#">
                                                                    <div className="d-flex">
                                                                        <span className="user-status"></span>
                                                                        <div class={`chat-user-img ${member.status === "online" && "online"} align-self-center me-3 ms-0`}>
                                                                            <img src={member.picture} className="rounded-circle avatar-xs" alt="" />
                                                                            <span className="user-status"></span>
                                                                        </div>
                                                                        <div className="flex-grow-1 overflow-hidden">
                                                                            <h5 className="text-truncate font-size-15 mb-1">{member.name}</h5>

                                                                            {isTyping && typingUserId === member._id ?
                                                                                <p className="chat-user-message text-truncate mb-0">typing<span className="animate-typing">
                                                                                    <span className="dot"></span>
                                                                                    <span className="dot"></span>
                                                                                    <span className="dot"></span>
                                                                                </span></p>
                                                                                :
                                                                                <p className="chat-user-message text-truncate mb-0">Next meeting tomorrow 10.00AM</p>
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
                                    }

                                    {profilebtn &&
                                        <div className="tab-pane active" id="pills-setting" role="tabpanel" aria-labelledby="pills-setting-tab">
                                            <div>
                                                <div className="px-4 pt-4">
                                                    <h4 className="mb-0">Settings</h4>
                                                </div>

                                                <div className="text-center border-bottom p-4">
                                                    <form onSubmit={handelUpdateProPic} >
                                                        <div className="mb-4 profile-user">
                                                            <img src={imagePreview || pImage} className="rounded-circle avatar-lg img-thumbnail" alt="" />
                                                            <div className="uploadBtn position-relative">
                                                                <button type="submit" className="btn btn-light bg-light avatar-xs p-0 rounded-circle profile-photo-edit">
                                                                    <i className={`ri-${isSelected ? "save" : "pencil"}-line`}></i>
                                                                    <input
                                                                        type="file"
                                                                        onChange={validateImg}
                                                                        accept="image/png, image/jpeg"
                                                                        className={isSelected ? `d-none` : `d-block`}
                                                                    />
                                                                </button>
                                                            </div>

                                                        </div>
                                                    </form>

                                                    <h5 className="font-size-16 mb-1 text-truncate">{user.name}</h5>
                                                    <div className="dropdown d-inline-block mb-1">
                                                        <a className="text-muted dropdown-toggle pb-1 d-block" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                            Available <i className="mdi mdi-chevron-down"></i>
                                                        </a>

                                                        <div className="dropdown-menu" >
                                                            <a className="dropdown-item" href="#">Available</a>
                                                            <a className="dropdown-item" href="#">Busy</a>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="p-4 user-profile-desc" data-simplebar="init"><div className="simplebar-wrapper" style={{ margin: "-24px" }}><div className="simplebar-height-auto-observer-wrapper"><div className="simplebar-height-auto-observer"></div></div><div className="simplebar-mask"><div className="simplebar-offset" style={{ right: '0px', bottom: '0px' }}><div className="simplebar-content-wrapper" style={{ height: "100%", overflow: "hidden" }}><div className="simplebar-content" style={{ padding: " 24px" }}>
                                                    <div id="settingprofile" className="accordion">
                                                        <div className="accordion-item card border mb-2">
                                                            <div className="accordion-header" id="personalinfo1">
                                                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#personalinfo" aria-expanded="false" aria-controls="personalinfo">
                                                                    <h5 className="font-size-14 m-0">Personal Info</h5>
                                                                </button>
                                                            </div>
                                                            <div id="personalinfo" className="accordion-collapse collapse" aria-labelledby="personalinfo1" data-bs-parent="#settingprofile" >
                                                                <div className="accordion-body">
                                                                    <form onSubmit={postName}>
                                                                        <div>
                                                                            <p className="text-muted mb-1">Name</p>
                                                                            <input
                                                                                type="text"
                                                                                className="font-size-14 bg-transparent border-0 p-0"
                                                                                disabled={isActiveEdit}
                                                                                value={pname}
                                                                                onChange={(e) => setPname(e.target.value)} />

                                                                            <div className="float-end">
                                                                                <button type={`${!isActiveEdit ? "button" : "submit"}`} onClick={enableEdit} className={`btn ${!isActiveEdit ? "btn-primary" : "btn-light"}  btn-sm`}><i className={`ri-${!isActiveEdit ? "save" : "edit"}-fill me-1 ms-0 align-middle`}></i> {!isActiveEdit ? "Save" : "Edit"}</button>
                                                                            </div>
                                                                        </div>
                                                                    </form>

                                                                    <div className="mt-4">
                                                                        <form onSubmit={postPass}>
                                                                            <div>
                                                                                <p className="text-muted mb-1">Password</p>
                                                                                <input
                                                                                    type="password"
                                                                                    className="font-size-14 bg-transparent border-0 p-0"
                                                                                    disabled={isActiveEditPass}
                                                                                    value={ppass}
                                                                                    onChange={(e) => setPpass(e.target.value)} />

                                                                                <div className="float-end">
                                                                                    <button type={`${!isActiveEditPass ? "button" : "submit"}`} onClick={enableEditPass} className={`btn ${!isActiveEditPass ? "btn-primary" : "btn-light"}  btn-sm`}><i className={`ri-${!isActiveEditPass ? "save" : "edit"}-fill me-1 ms-0 align-middle`}></i> {!isActiveEditPass ? "Save" : "Edit"}</button>
                                                                                </div>
                                                                            </div>
                                                                        </form>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="accordion-item card border mb-2">
                                                            <div className="accordion-header" id="privacy1">
                                                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#privacy" aria-expanded="false" aria-controls="privacy">
                                                                    <h5 className="font-size-14 m-0">Privacy</h5>
                                                                </button>
                                                            </div>
                                                            <div id="privacy" className="accordion-collapse collapse" aria-labelledby="privacy1" data-bs-parent="#settingprofile"  >
                                                                <div className="accordion-body">
                                                                    <div className="py-3">
                                                                        <div className="d-flex align-items-center">
                                                                            <div className="flex-grow-1 overflow-hidden">
                                                                                <h5 className="font-size-13 mb-0 text-truncate">Profile photo</h5>
                                                                            </div>
                                                                            <div className="dropdown ms-2 me-0">
                                                                                <button className="btn btn-light btn-sm dropdown-toggle w-sm" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                                    Everyone <i className="mdi mdi-chevron-down"></i>
                                                                                </button>
                                                                                <div className="dropdown-menu dropdown-menu-end">
                                                                                    <a className="dropdown-item" href="#">Everyone</a>
                                                                                    <a className="dropdown-item" href="#">selected</a>
                                                                                    <a className="dropdown-item" href="#">Nobody</a>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="py-3 border-top">
                                                                        <div className="d-flex align-items-center">
                                                                            <div className="flex-grow-1 overflow-hidden">
                                                                                <h5 className="font-size-13 mb-0 text-truncate">Last seen</h5>

                                                                            </div>
                                                                            <div className="ms-2 me-0">
                                                                                <div className="form-check form-switch">
                                                                                    <input type="checkbox" className="form-check-input" id="privacy-lastseenSwitch" checked="" />
                                                                                    <label className="form-check-label" for="privacy-lastseenSwitch"></label>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="py-3 border-top">
                                                                        <div className="d-flex align-items-center">
                                                                            <div className="flex-grow-1 overflow-hidden">
                                                                                <h5 className="font-size-13 mb-0 text-truncate">Status</h5>
                                                                            </div>
                                                                            <div className="dropdown ms-2 me-0">
                                                                                <button className="btn btn-light btn-sm dropdown-toggle w-sm" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                                    Everyone <i className="mdi mdi-chevron-down"></i>
                                                                                </button>
                                                                                <div className="dropdown-menu dropdown-menu-end">
                                                                                    <a className="dropdown-item" href="#">Everyone</a>
                                                                                    <a className="dropdown-item" href="#">selected</a>
                                                                                    <a className="dropdown-item" href="#">Nobody</a>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="py-3 border-top">
                                                                        <div className="d-flex align-items-center">
                                                                            <div className="flex-grow-1 overflow-hidden">
                                                                                <h5 className="font-size-13 mb-0 text-truncate">Read receipts</h5>
                                                                            </div>
                                                                            <div className="ms-2 me-0">
                                                                                <div className="form-check form-switch">
                                                                                    <input type="checkbox" className="form-check-input" id="privacy-readreceiptSwitch" checked="" />
                                                                                    <label className="form-check-label" for="privacy-readreceiptSwitch"></label>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="py-3 border-top">
                                                                        <div className="d-flex align-items-center">
                                                                            <div className="flex-grow-1 overflow-hidden">
                                                                                <h5 className="font-size-13 mb-0 text-truncate">Groups</h5>

                                                                            </div>
                                                                            <div className="dropdown ms-2 me-0">
                                                                                <button className="btn btn-light btn-sm dropdown-toggle w-sm" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                                    Everyone <i className="mdi mdi-chevron-down"></i>
                                                                                </button>
                                                                                <div className="dropdown-menu dropdown-menu-end">
                                                                                    <a className="dropdown-item" href="#">Everyone</a>
                                                                                    <a className="dropdown-item" href="#">selected</a>
                                                                                    <a className="dropdown-item" href="#">Nobody</a>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="accordion-item card border mb-2">
                                                            <div className="accordion-header" id="security1">
                                                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#security" aria-expanded="false" aria-controls="security">
                                                                    <h5 className="font-size-14 m-0"> Security</h5>
                                                                </button>
                                                            </div>
                                                            <div id="security" className="accordion-collapse collapse" aria-labelledby="security1" data-bs-parent="#settingprofile" >
                                                                <div className="accordion-body">
                                                                    <div className="d-flex align-items-center">
                                                                        <div className="flex-grow-1 overflow-hidden">
                                                                            <h5 className="font-size-13 mb-0 text-truncate">Show security notification</h5>

                                                                        </div>
                                                                        <div className="ms-2 me-0">
                                                                            <div className="form-check form-switch">
                                                                                <input type="checkbox" className="form-check-input" id="security-notificationswitch" />
                                                                                <label className="form-check-label" for="security-notificationswitch"></label>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="accordion-item card border mb-2">
                                                            <div className="accordion-header" id="help1">
                                                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                                                                    <h5 className="font-size-14 m-0"> Help</h5>
                                                                </button>
                                                            </div>
                                                            <div id="collapseFour" className="accordion-collapse collapse" aria-labelledby="help1" data-bs-parent="#settingprofile" >
                                                                <div className="accordion-body">
                                                                    <div className="py-3">
                                                                        <h5 className="font-size-13 mb-0"><a href="#" className="text-body d-block">FAQs</a></h5>
                                                                    </div>
                                                                    <div className="py-3 border-top">
                                                                        <h5 className="font-size-13 mb-0"><a href="#" className="text-body d-block">Contact</a></h5>
                                                                    </div>
                                                                    <div className="py-3 border-top">
                                                                        <h5 className="font-size-13 mb-0"><a href="#" className="text-body d-block">Terms &amp; Privacy policy</a></h5>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div></div></div></div><div className="simplebar-placeholder" style={{ width: "auto", height: "251px" }}></div></div><div className="simplebar-track simplebar-horizontal" style={{ visibility: 'hidden' }}><div className="simplebar-scrollbar" style={{ transform: 'translate3d(0px, 0px, 0px)', display: 'none' }}></div></div><div className="simplebar-track simplebar-vertical" style={{ visibility: 'hidden' }}><div className="simplebar-scrollbar" style={{ transform: 'translate3d(0px, 0px, 0px)', display: "none", height: "397px" }}></div></div></div>

                                            </div>
                                        </div>
                                    }
                                </div>
                            }
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
