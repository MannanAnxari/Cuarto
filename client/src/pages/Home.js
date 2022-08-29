import React from "react"; 
import { useSelector } from "react-redux";
import "./Home.css";
import avatar from "./images/avatar.jpg"
import dog1 from "./images/dog-image-1.jpg"
import dog2 from "./images/dog-image-2.jpg"
import dog3 from "./images/dog-image-3.jpg"

function Home() {
    const animate = document.querySelectorAll(".animate");
    const text = document.querySelector(".sendbox input");
    const user = useSelector((state) => state.user);
    const chatbox = document.querySelector(".chatbox");
    var submit = () => sendmessage();
    const keyUp = (e) => {
        // console.log(e)
        if (e.key === 'Enter' || e.keyCode === 13)
            sendmessage()
    }

    // function start_animation() {
    for (let i = 0; i < animate.length; i++) {
        setTimeout(function () {
            animate[i].classList.add("animated");
        }, 300 * i + 300);
    }
    // }
    // start_animation();
    function sendmessage() {
        let data = text.value.trim()
        if (data !== "")
            chatbox.innerHTML += '<div className="eachmessage sent animated"><p>' + data + '</p></div>'
        text.value = ""
        chatbox.scrollTop = chatbox.scrollHeight
    }
    return (
        <>
            <div className="container home">
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

                <div className="maindiv">
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
                        {/* <p>It`s an Simple Chatting App In React With Unique Functionality.</p>
                        {user && (
                            <LinkContainer to="/chat">
                                <div className="btn-cuarto w-50 ms-0">
                                    <span> Get Started <i className="fas fa-comments home-message-icon"></i></span>
                                </div>
                            </LinkContainer>
                        )}
                        {!user && (
                            <LinkContainer to="/login">
                                <div className="btn-cuarto w-50 ms-0">
                                    Get Started <i className="fas fa-comments home-message-icon"></i>
                                </div>
                            </LinkContainer>
                        )} */}
                    </div>
                </div> 
            </div>
        </>
    );
}

export default Home;
