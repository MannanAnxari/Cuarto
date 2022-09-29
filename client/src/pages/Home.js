import "./Home.css";
import phone from "./images/phone.png"
import android from "./images/android.svg"
import ios from "./images/ios.svg"
import React from "react";
import { useSelector } from "react-redux";
import { useLogoutUserMutation } from "../services/appApi";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

function Home() {
    const user = useSelector((state) => state.user);
    const [logoutUser] = useLogoutUserMutation();



    async function handleLogout(e) {
        e.preventDefault();
        await logoutUser(user);
        toast.success("Successfully Logout");
    }
    return (
        <>
            {/* <div className="container home"> */}
            {/* // <Row>
        //     <Col md={6} className="d-flex flex-direction-column align-items-center justify-content-center">
        //         <div>
        //             <h1>Share the world with your asdfriends</h1>
        //             <p>Chat App lets you connect with the world</p>
        //             <LinkContainer to="/chat">
        //                 <Button variant="danger">
        //                     Get Started <i className="fas fa-comments home-message-icon"></i>
        //                 </Button>
        //             </LinkContainer>
        //         </div>
        //     </Col>
        //     <Col md={6} className="home__bg"></Col>
        // </Row> */}

            {/* <div className="maindiv">
                    <div className="mobile">
                        <div className="head">
                            <div className="notch"></div>
                            <div className="profilebox">
                                <div className="leftpro">
                                    <i className="fa fa-angle-left" aria-hidden="true"></i>
                                    <div className="profile">
                                        <img src={avatar} alt="dp" />
                                        <div className="pdetail">
                                            <h3 style={{ marginBottom: "0" }}>kodrz</h3>
                                            <p style={{ marginBottom: "0" }}>Available to Walk</p>
                                        </div>
                                    </div>
                                </div>
                                <i className="fa fa-ellipsis-v" aria-hidden="true"></i>
                            </div>
                        </div>
                        <div className="chatbox">
                            <div className="eachmessage received animate animated">
                                <p>That sounds great. I’d be happy with that.</p>
                            </div>
                            <div className="eachmessage received animate animated">
                                <p>Could you send over some pictures of your dog, please?</p>
                            </div>
                            <div className="eachmessage imgbox">
                                <img className="animate animated" src={dog1} alt="dog1" />
                                <img className="animate animated" src={dog2} alt="dog2" />
                                <img className="animate animated" src={dog3} alt="dog3" />
                            </div>
                            <div className="eachmessage sent animate animated">
                                <p>Here are a few pictures. She’s a happy girl!</p>
                            </div>
                            <div className="eachmessage sent animate animated">
                                <p>Can you make it?</p>
                            </div>
                            <div className="eachmessage received animate animated">
                                <p>She looks so happy! The time we discussed works. How long shall I take her out for?</p>
                            </div>
                            <div className="deal animate animated">
                                <div className="det">
                                    <input type="radio" name="plan" />
                                    <p>30 minute walk</p>
                                </div>
                                <p className="price">$29</p>
                            </div>
                            <div className="deal animate animated">
                                <div className="det">
                                    <input type="radio" name="plan" />
                                    <p>1 hour walk</p>
                                </div>
                                <p className="price">$49</p>
                            </div>
                        </div>
                        <div className="sendbox">
                            <input type="text" onKeyUp={keyUp} placeholder="Type a message…" />
                            <button onClick={submit} className="submit"><i className="fa fa-chevron-right" aria-hidden="true"></i></button>
                        </div>
                    </div>
                    <div className="text">
                        <h1>El Oscura Oscuro</h1>
                        <p>It`s an Simple Chatting App In React With Unique Functionality.</p>
                        {user && (
                            <Link to="/chat">
                                <div className="btn-cuarto w-50 ms-0">
                                    <span> Get Started <i className="fas fa-comments home-message-icon"></i></span>
                                </div>
                            </Link>
                        )}
                        {!user && (
                            <Link to="/login">
                                <div className="btn-cuarto w-50 ms-0">
                                    Get Started <i className="fas fa-comments home-message-icon"></i>
                                </div>
                            </Link>
                        )}
                    </div>
                </div>  */}
            {/* </div> */}
            <div className="layout-wrapper d-lg-flex">
                {!user && (
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
                                    <a href="/" className="nav-link active" id="pills-user-tab" role="tab" >
                                        <i className="ri-home-2-line"></i>
                                    </a>
                                </li>
                                <li className="nav-item" data-bs-toggle="tooltip" data-bs-placement="top" title="P2P">
                                    <div >
                                        <Link to={"/login"} className='nav-link' style={{ cursor: "pointer" }} id="pills-user-tab" role="tab" >
                                            <i className="ri-login-box-line"></i>
                                        </Link>
                                    </div>
                                </li>
                                <li className="nav-item" data-bs-toggle="tooltip" data-bs-placement="top" title="Groups">
                                    <div >
                                        <Link to={"/signup"} className="nav-link" style={{ cursor: "pointer" }} id="pills-groups-tab" role="tab" >
                                            <i className="ri-login-circle-line"></i>
                                        </Link>
                                    </div>
                                </li>
                            </ul>

                        </div>

                        <div className="flex-lg-column d-none d-lg-block">
                            <ul className="nav side-menu-nav justify-content-center">
                                <li className="nav-item">
                                    <a className="nav-link light-dark-mode" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-placement="right" title="Dark / Light Mode">
                                        <i className='ri-sun-line theme-mode-icon'></i>
                                    </a>
                                </li>

                                <li className="nav-item btn-group dropup profile-user-dropdown">
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item d-flex" href="#">Please Login <i className="ri-profile-line float-end text-muted"></i></a>
                                        <div className="dropdown-divider"></div>
                                        <Link to="/login" className="dropdown-item" >Log out <i className="ri-logout-circle-r-line float-end text-muted"></i></Link>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                )}


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
                                    <a href="/" className="nav-link active" id="pills-user-tab" role="tab" >
                                        <i className="ri-home-2-line"></i>
                                    </a>
                                </li>
                                <li className="nav-item" data-bs-toggle="tooltip" data-bs-placement="top" title="Chats">
                                    <Link to="/chat" className="nav-link" id="pills-chat-tab" role="tab" >
                                        <i className="ri-message-3-line"></i>
                                    </Link>
                                </li>
                                <li className="nav-item" data-bs-toggle="tooltip" data-bs-placement="top" title="P2P">
                                    <div >
                                        <Link to={"/chat"} className='nav-link' style={{ cursor: "pointer" }} id="pills-user-tab" role="tab" >
                                            <i className="ri-user-2-line"></i>
                                        </Link>
                                    </div>
                                </li>
                                <li className="nav-item" data-bs-toggle="tooltip" data-bs-placement="top" title="Groups">
                                    <div >
                                        <Link to={"/chat"} className="nav-link" style={{ cursor: "pointer" }} id="pills-groups-tab" role="tab" >
                                            <i className="ri-group-line"></i>
                                        </Link>
                                    </div>
                                </li>
                                <li className="nav-item" data-bs-toggle="tooltip" data-bs-placement="top" title="Settings">
                                    <div >
                                        <Link to={"/chat"} className="nav-link" style={{ cursor: "pointer" }} id="pills-user-tab" role="tab" >
                                            <i className="ri-settings-line"></i>
                                        </Link>
                                    </div>
                                </li>
                                <li className="nav-item dropdown profile-user-dropdown d-inline-block d-lg-none">
                                    <a className="nav-link dropdown-toggle" href="#" role="button" style={{ cursor: "pointer" }} data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <img src={user.picture} alt="" className="profile-user rounded-circle" />
                                    </a>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item d-flex" href="#">{user.name} <i className="ri-profile-line float-end text-muted"></i></a>
                                        <a className="dropdown-item" href="#">Profile <i className="ri-profile-line float-end text-muted"></i></a>
                                        <div className="dropdown-divider"></div>
                                        <Link className="dropdown-item" to="/" onClick={handleLogout} >Log out <i className="ri-logout-circle-r-line float-end text-muted"></i></Link>
                                    </div>
                                </li>
                            </ul>

                        </div>

                        <div className="flex-lg-column d-none d-lg-block">
                            <ul className="nav side-menu-nav justify-content-center">
                                <li className="nav-item">
                                    <a className="nav-link light-dark-mode" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-placement="right" title="Dark / Light Mode">
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
                <header className="foi-header landing-header w-100">
                    <div className="container">
                        <div className="header-content">
                            <div className="row">
                                <div className="col-md-6 my-auto">
                                    <h1>Great app that makes your life awesome</h1>
                                    <p className="text-dark">He has led a remarkable campaign, defying the traditional mainstream parties courtesy of his En Marche! movement.</p>
                                    <Link to={user ? "/chat" : "/login"} className="btn btn-primary mb-4">Get Started</Link>
                                    <div className="my-2">
                                        <p className="header-app-download-title">GET OUR MOBILE APP</p>
                                    </div>
                                    <div>
                                        <button className="btn btn-app-download mr-2"><img src={ios} alt="App store" /></button>
                                        <button className="btn btn-app-download"><img src={android} alt="play store" /></button>
                                    </div>
                                </div>
                                <div className="col-md-6 my-auto">
                                    <img src={phone} alt="app" width="388px" className="img-fluid" />
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
            </div>
        </>
    );
}

export default Home;
