import React, { useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { AppContext } from "../context/appContext";
import { useDeleteUserMsgMutation } from "../services/appApi";
import "./MessageForm.css";
import Alert from "./Alert";
import Picker from "emoji-picker-react";

import FileBase64 from "react-file-base64";

function MessageForm(props) {
  const user = useSelector((state) => state.user);
  const [content, setContent] = useState({ msg: "", img: "" });
  const [deleteUserMsg] = useDeleteUserMsgMutation();

  const {
    socket,
    currentRoom,
    setMessages,
    messages,
    sendScreenStatus,
    allgroups,
    privateMemberMsg,
  } = useContext(AppContext);
  const [chosenEmoji, setChosenEmoji] = useState(null);
  const [showPicker, setShowPicker] = useState(false);

  const handleMsgDelete = (id, currentRoom) => {
    // delete user message
    deleteUserMsg({ id, currentRoom, }).then(({ data }) => {
      if (data) {
        toast.success("Successfully Deleted");
        socket.emit("reload-deleted", currentRoom);
        setMessages(data.msgList);
      }
      else {
        toast.error(data.error);
      }
    });
  }

  const onEmojiClick = (event, emojiObject) => {
    setChosenEmoji(emojiObject);
    console.log(content.msg);
    setContent({ ...content, msg: content.msg + chosenEmoji.emoji });
  };

  const messageEndRef = useRef(null);
  useEffect(() => {
    scrollToBottom();
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

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }
  const todayDate = getFormattedDate();

  socket.off("room-messages").on("room-messages", (roomMessages) => {
    setMessages(roomMessages);
  });
  // console.log(messages);
  const sendHi = () => {
    const today = new Date();
    const minutes =
      today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
    const time = today.getHours() + ":" + minutes;
    const classname = "";
    socket.emit(
      "message-room",
      currentRoom,
      "hi",
      content.img,
      classname,
      user,
      time,
      todayDate
    );
  };
  function handleSubmit(e) {
    e.preventDefault();
    if (content.msg === "" && content.img === "") return;
    const today = new Date();
    const minutes =
      today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
    const time = today.getHours() + ":" + minutes;
    const roomId = currentRoom;
    const classname = "";
    socket.emit(
      "message-room",
      roomId,
      content.msg,
      content.img,
      classname,
      user,
      time,
      todayDate
    );
    setContent({ msg: "", img: "" });
  }
  //on input change, start the countdown

  const typed = () => {
    let myId = currentRoom.split("-")[0];
    let roomId = currentRoom.split("-")[1];
    // let roomId = user._id;
    socket.emit("typing", myId, roomId);
    // console.log(currentRoom);
    // console.log(`${roomId} | ${user._id}`);
    // console.log(`${myId} | ${roomId}`);
  };

  // if (isTyping) {
  //     socket.emit("typing", isTyping, user)
  // }
  // else {
  //     socket.emit("typing", isTyping, user)
  // }
  // function callServerScript() {
  //     console.log(searchTimeout);
  // }

  // function sendTyping() {
  //     socket.emit("typing", "typing")
  // }

  // Listen for `keyup` event
  const handleGroupDeletion = () => {
    // allgroups.filter((data) => {
    //   console.log(data);
    //   if (data.groupCreator === user.id) {
    //     console.log(true);
    //   } else {
    //     console.log(false);
    //     toast.success("Error You`re Not a Admin.");
    //   }
    // });

    // allgroups.filter((data) => {
    //   if (data.groupCreator === user.id) {
    //     return console.log(data.groupCreator);
    //   } else {
    //     return null;
    //   }
    //   return null;
    // });

    allgroups
      .filter((data) => {
        if (currentRoom === data.groupName) {
          return data;
        } else if (data.groupCreator === user.id) {
          return data;
        } else if (data.groupCreator != user.id) {
          return false;
        }
        return null;
      })
      .map((data, idx) => console.log(data));
  };
  return (
    <>
      {/* <Alert /> */}
      <div className="d-lg-flex">
        <div className="w-100 overflow-hidden position-relative">
          <div className="p-3 p-lg-4 border-bottom user-chat-topbar">
            <div className="row align-items-center">
              <div className="col-sm-4 col-8">
                {user && !privateMemberMsg?._id && (
                  <div className="d-flex align-items-center">
                    <div className="d-block d-lg-none me-2 ms-0">
                      <a className="user-chat-remove text-muted font-size-16 p-2">
                        <i className="ri-arrow-left-s-line"></i>
                      </a>
                    </div>
                    <div class="chat-user-img me-3">
                      <div class="avatar-xs">
                        <span class="avatar-title rounded-circle bg-soft-primary text-primary text-uppercase">
                          {/* {currentRoom && currentRoom.split("")[0]} */}
                          Hi
                        </span>
                      </div>
                    </div>
                    <div className="flex-grow-1 overflow-hidden">
                      <h5 className="font-size-16 mb-0 text-truncate">
                        <a href="#" className="text-reset user-profile-show">
                          #{currentRoom}
                        </a>
                      </h5>
                    </div>
                  </div>
                )}

                {user && privateMemberMsg?._id && (
                  <div className="d-flex align-items-center">
                    <div className="d-block d-lg-none me-2 ms-0">
                      <a
                        href=""
                        className="user-chat-remove text-muted font-size-16 p-2"
                      >
                        <i className="ri-arrow-left-s-line"></i>
                      </a>
                    </div>
                    <div className="me-3 ms-0">
                      <img
                        src={privateMemberMsg.picture}
                        className="rounded-circle avatar-xs"
                        alt=""
                      />
                    </div>
                    <div className="flex-grow-1 overflow-hidden">
                      <h5 className="font-size-16 mb-0 text-truncate">
                        <a href="#" className="text-reset user-profile-show">
                          {privateMemberMsg.name}
                        </a>{" "}
                        {sendScreenStatus ? (
                          <i className="ri-record-circle-fill font-size-10 text-success d-inline-block ms-1"></i>
                        ) : (
                          <i className="ri-record-circle-fill font-size-10 text-muted d-inline-block ms-1"></i>
                        )}
                      </h5>
                    </div>
                  </div>
                )}
              </div>
              <div className="col-sm-8 col-4">
                <ul className="list-inline user-chat-nav text-end mb-0">
                  <li className="list-inline-item d-none d-lg-inline-block me-2 ms-0">
                    <button
                      type="button"
                      className="btn nav-btn"
                      data-bs-toggle="modal"
                      data-bs-target="#audiocallModal"
                    >
                      <i className="ri-phone-line"></i>
                    </button>
                  </li>

                  <li className="list-inline-item d-none d-lg-inline-block me-2 ms-0">
                    <button
                      type="button"
                      className="btn nav-btn"
                      data-bs-toggle="modal"
                      data-bs-target="#videocallModal"
                    >
                      <i className="ri-vidicon-line"></i>
                    </button>
                  </li>

                  <li className="list-inline-item">
                    <div className="dropdown">
                      <button
                        className="btn nav-btn dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <i className="ri-more-fill"></i>
                      </button>
                      <div className="dropdown-menu dropdown-menu-end">
                        <a
                          className="dropdown-item d-block d-lg-none user-profile-show"
                          href="#"
                        >
                          View profile{" "}
                          <i className="ri-user-2-line float-end text-muted"></i>
                        </a>
                        <a
                          className="dropdown-item d-block d-lg-none"
                          href="#"
                          data-bs-toggle="modal"
                          data-bs-target="#audiocallModal"
                        >
                          Audio{" "}
                          <i className="ri-phone-line float-end text-muted"></i>
                        </a>
                        <a
                          className="dropdown-item d-block d-lg-none"
                          href="#"
                          data-bs-toggle="modal"
                          data-bs-target="#videocallModal"
                        >
                          Video{" "}
                          <i className="ri-vidicon-line float-end text-muted"></i>
                        </a>
                        <a className="dropdown-item" href="#">
                          Archive{" "}
                          <i className="ri-archive-line float-end text-muted"></i>
                        </a>
                        <a className="dropdown-item" href="#">
                          Muted{" "}
                          <i className="ri-volume-mute-line float-end text-muted"></i>
                        </a>
                        <a
                          className="dropdown-item"
                          onClick={() => {
                            handleGroupDeletion();
                          }}
                          href="#"
                        >
                          Delete{" "}
                          <i className="ri-delete-bin-line float-end text-muted"></i>
                        </a>
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
                <div className="simplebar-height-auto-observer"></div>
              </div>
              <div className="simplebar-mask">
                <div
                  className="simplebar-offset"
                  style={{ right: "-16.8px", bottom: "0px" }}
                >
                  <div
                    className="simplebar-content-wrapper"
                    style={{ height: "100%", overflow: "hidden scroll" }}
                  >
                    <div
                      className="simplebar-content"
                      style={{ padding: " 24px" }}
                    >
                      {!user && (
                        <div className="alert alert-danger">Please login</div>
                      )}
                      {!messages.length && (
                        <div role="none" className="noMsgMain mx-auto">
                          <div role="none" className="noMsgCont">
                            <div role="none" className="noMsgCol">
                              <div dir="auto" className="noMsgColm">
                                hi
                              </div>
                              <span className="noMsgArea">
                                <span
                                  class="SpriteComponentAnimationPause"
                                  title="hi"
                                  className="noMsgHi"
                                ></span>
                              </span>
                            </div>
                          </div>
                          <div className="noMsgTxt">
                            {privateMemberMsg ? (
                              <p className="mb-0">
                                {" "}
                                Say hi to {privateMemberMsg.name} with a wave.
                              </p>
                            ) : (
                              <p className="mb-0">
                                Start chat with {currentRoom} Group
                              </p>
                            )}
                            {/* Say hi to {privateMemberMsg ? privateMemberMsg.name : "" } with a wave. */}
                          </div>
                          <button className="noMsgTxtB" onClick={sendHi}>
                            <div
                              role="none"
                              className="noMsgTxtC btn btn-primary rounded-pill"
                            >
                              <div
                                data-text-as-pseudo-element="Say hi"
                                dir="auto"
                                className="noMsgTxtD"
                              >
                                Say hi
                              </div>
                            </div>
                          </button>
                        </div>
                      )}
                      {user &&
                        messages.map(({ _id: date, messagesByDate }, idx) => (
                          <ul className="list-unstyled mb-0" key={idx}>
                            <li>
                              <div className="chat-day-title">
                                <span className="title">{date}</span>
                              </div>
                            </li>
                            {messagesByDate?.map(
                              (
                                {
                                  _id,
                                  content,
                                  img,
                                  classname,
                                  time,
                                  from: sender,
                                },
                                msgIdx
                              ) => (
                                <li
                                  className={
                                    sender?.email == user?.email ? "right" : ""
                                  }
                                  key={_id}
                                >
                                  <div className="conversation-list">
                                    <div className="chat-avatar">
                                      <img src={sender.picture} alt="" />
                                    </div>
                                    <div className="user-chat-content">
                                      {classname === "deleted" ? (
                                        <div className="ctext-wrap">
                                          <div className="ctext-wrap-content deleted-container">
                                            <p className="mb-0 deleted">
                                              This message was deleted
                                            </p>
                                            <p className="chat-time mb-0">
                                              <i className="ri-delete-bin-2-line align-middle"></i>{" "}
                                              <span className="align-middle">
                                                {time}
                                              </span>
                                            </p>
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="ctext-wrap">
                                          <div className="ctext-wrap-content">
                                            <p className="mb-0">{content}</p>
                                            {img && (
                                              <ul className="list-inline message-img  mb-0">
                                                <li className="list-inline-item message-img-list me-2 ms-0">
                                                  <div>
                                                    <a
                                                      className="popup-img d-inline-block m-1"
                                                      href="#"
                                                      title="Project 1"
                                                    >
                                                      <img
                                                        src={img}
                                                        alt=""
                                                        className="rounded border"
                                                      />
                                                    </a>
                                                    <a
                                                      download="cuarto"
                                                      href={img}
                                                      className="fw-medium"
                                                    >
                                                      <i className="ri-download-2-line"></i>
                                                    </a>
                                                  </div>
                                                </li>
                                              </ul>
                                            )}
                                            <p className="chat-time mb-0">
                                              <i className="ri-time-line align-middle"></i>{" "}
                                              <span className="align-middle">
                                                {time}
                                              </span>
                                            </p>
                                          </div>
                                          {sender?.email == user?.email ? (
                                            <div className="dropdown align-self-start">
                                              <a
                                                className="dropdown-toggle"
                                                href="#"
                                                role="button"
                                                data-bs-toggle="dropdown"
                                                aria-haspopup="true"
                                                aria-expanded="false"
                                              >
                                                <i className="ri-more-2-fill"></i>
                                              </a>

                                              <div className="dropdown-menu">
                                                <a
                                                  className="dropdown-item"
                                                  href="#"
                                                  onClick={() => {
                                                    navigator.clipboard.writeText(
                                                      content
                                                    );
                                                  }}
                                                >
                                                  Copy{" "}
                                                  <i className="ri-file-copy-line float-end text-muted"></i>
                                                </a>
                                                <a
                                                  className="dropdown-item"
                                                  href="#"
                                                >
                                                  Forward{" "}
                                                  <i className="ri-chat-forward-line float-end text-muted"></i>
                                                </a>
                                                <a
                                                  className="dropdown-item"
                                                  href="#"
                                                  onClick={() =>
                                                    handleMsgDelete(_id, currentRoom)
                                                  }
                                                >
                                                  Delete{" "}
                                                  <i className="ri-delete-bin-line float-end text-muted"></i>
                                                </a>
                                              </div>
                                            </div>
                                          ) : (
                                            ""
                                          )}
                                        </div>
                                      )}

                                      <div className="conversation-name">
                                        {sender._id == user?._id
                                          ? "You"
                                          : sender.name}
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              )
                            )}
                          </ul>
                        ))}
                      <div ref={messageEndRef} />
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="simplebar-placeholder"
                style={{ width: "auto", height: "1152px" }}
              ></div>
            </div>
            <div
              className="simplebar-track simplebar-horizontal"
              style={{ visibility: "hidden" }}
            >
              <div
                className="simplebar-scrollbar"
                style={{
                  transform: "translate3d(0px, 0px, 0px)",
                  display: "none",
                }}
              ></div>
            </div>
            <div
              className="simplebar-track simplebar-vertical"
              style={{ visibility: "visible" }}
            >
              <div
                className="simplebar-scrollbar"
                style={{
                  height: "273px",
                  transform: "translate3d(0px, 0px, 0px)",
                  display: "block",
                }}
              ></div>
            </div>
          </div>
          <div className="chat-input-section p-3 p-lg-4 border-top mb-0">
            <form onSubmit={handleSubmit}>
              <div className="row g-0">
                <div className="col">
                  <input
                    type="text"
                    id="msgin"
                    autoComplete="off"
                    className="form-control form-control-lg bg-light border-light"
                    placeholder="Enter Message..."
                    disabled={!user}
                    value={content.msg}
                    onChange={(e) => {
                      setContent({ ...content, msg: e.target.value });
                    }}
                  ></input>
                </div>
                {showPicker && <Picker onEmojiClick={onEmojiClick} />}
                <div className="col-auto">
                  <div className="chat-input-links ms-md-2 me-md-0">
                    <ul className="list-inline mb-0">
                      <li
                        className="list-inline-item"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title=""
                        data-bs-original-title="Emoji"
                      >
                        <button
                          type="button"
                          onClick={() => setShowPicker(!showPicker)}
                          className="btn btn-link text-decoration-none font-size-16 btn-lg waves-effect"
                        >
                          <i className="ri-emotion-happy-line"></i>
                        </button>
                      </li>
                      <li
                        className="list-inline-item"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title=""
                        data-bs-original-title="Attached File"
                      >
                        <button
                          type="button"
                          className="btn btn-link text-decoration-none font-size-16 btn-lg waves-effect"
                        >
                          <FileBase64
                            type="file"
                            style={{
                              position: "absolute!important",
                              top: "0",
                              left: "0",
                              width: "100%",
                              height: "100%",
                            }}
                            multiple={false}
                            onDone={({ base64 }) =>
                              setContent({ ...content, img: base64 })
                            }
                          />
                          <i className="ri-attachment-line"></i>
                        </button>
                      </li>
                      <li className="list-inline-item">
                        <button
                          type="submit"
                          className="btn btn-primary font-size-16 btn-lg chat-send waves-effect waves-light"
                        >
                          <i className="ri-send-plane-2-fill"></i>
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </form>
            {/* <form onSubmit={createGroup}> */}
            {/* <div className="row g-0">
                <div className="col">
                  <input
                    type="text"
                    id="msgin"
                    autoComplete="off"
                    className="form-control form-control-lg bg-light border-light"
                    placeholder="Enter name..."
                    value={groupName} 
                    onChange={(e) => {
                        setgroupName(e.target.value );
                      }}
                  ></input>
                  <input
                    type="text"
                    id="msgin"
                    autoComplete="off"
                    className="form-control form-control-lg bg-light border-light"
                    placeholder="Enter pass..."
                    value={groupPass}
                    onChange={(e) => {setgroupPass(e.target.value)}}
                  ></input>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary font-size-16 btn-lg chat-send waves-effect waves-light"
                  onClick={createGroup}
                >
                  <i className="ri-send-plane-2-fill"></i>
                </button>
              </div> */}
            {/* </form> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default MessageForm;
