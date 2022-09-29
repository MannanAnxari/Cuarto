import React, { useState, useContext, useEffect, useRef } from "react";
import { AppContext } from "../context/appContext";
import toast from "react-hot-toast";
import CreateGroup from "./CreateGroup";
import JoinByPass from "./JoinByPass";

export const GroupSidebar = ({ joinRoom, rooms, currentRoom, user }) => {
  const { setAllGroups, allgroups } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [groupName, setgroupName] = useState("");
  const [gpPassword, setgpPassword] = useState({
    byUser: "",
    byGroup: "",
    groupName: "",
    userid: "",
  });
  const [groupPass, setgroupPass] = useState("");
  const myRefname = useRef(null);
  const myRefclose = useRef(null);
  const handleClick = () => {
    myRefname.current.click();
  };

  var groupCreator = user.id

  async function createGroup() {
    const response = await fetch("http://localhost:8000/creategroup", { 
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        groupName,
        groupPass,
        groupCreator,
      }),
    }); 
    let data = await response.json();
    if (response.ok) {
      toast.success(data.msg); 
      setAllGroups(data.allgroup);
    } else {
      toast.error(data);
    }
  }
  const checkPassAndJoin = (groupPassword) => {
    let { byUser, byGroup, groupName, userid } = groupPassword;
    if (byUser === byGroup) {
      toast.success("Password Correct");
      joinRoom(groupName, true, userid, byGroup);
      setgpPassword({
        byUser: "",
        byGroup: "",
        groupName: "",
        userid: "",
        grppss: "",
      });
      myRefclose.current.click();
    } else {
      toast.error("Password is Incorrect");
    }
  };
  const joinRoomByCrd = (grpname, groupvisib, userid, grppass) => {
    joinRoom(grpname, groupvisib, userid, grppass);
    // console.log(grpname, groupvisib, userid, grppass);
  };

  return (
    <>
      <JoinByPass
        gpPassword={gpPassword}
        setgpPassword={setgpPassword}
        myRefclose={myRefclose}
        checkPassAndJoin={checkPassAndJoin}
      />
      <div
        className="tab-pane active"
        id="pills-groups"
        role="tabpanel"
        aria-labelledby="pills-groups-tab"
      >
        <div>
          <div className="p-4">
            <CreateGroup
              groupName={groupName}
              setgroupName={setgroupName}
              groupPass={groupPass}
              setgroupPass={setgroupPass}
              createGroup={createGroup}
              user={user}
            />
            <div className="search-box chat-search-box">
              <div className="input-group rounded-3">
                <span
                  className="input-group-text text-muted bg-light pe-1 ps-3"
                  id="basic-addon1"
                >
                  <i className="ri-search-line search-icon font-size-18"></i>
                </span>
                <input
                  type="text"
                  className="form-control bg-light"
                  placeholder="Search groups..."
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                  }}
                  aria-label="Search groups..."
                  aria-describedby="basic-addon1"
                />
              </div>
            </div>
          </div>
          <div
            className="p-4 chat-message-list chat-group-list"
            data-simplebar="init"
          >
            <div className="simplebar-wrapper" style={{ margin: "-24px" }}>
              <div className="simplebar-height-auto-observer-wrapper">
                <div className="simplebar-height-auto-observer"></div>
              </div>
              <div className="simplebar-mask">
                <div
                  className="simplebar-offset"
                  style={{ right: "0px", bottom: "0px" }}
                >
                  <div
                    className="simplebar-content-wrapper"
                    style={{ height: "100%", overflow: "hidden" }}
                  >
                    <div
                      className="simplebar-content"
                      style={{ padding: "24px" }}
                    >
                      {!allgroups.length && (
                        <ul className="list-unstyled chat-list">
                          <p className="text-center">No Groups Found!</p>
                        </ul>
                      )}
                      <ul className="list-unstyled chat-list">
                        <button
                          id="showModal"
                          data-bs-toggle="modal"
                          data-bs-target="#addpass-exampleModal"
                          style={{ display: "none" }}
                          ref={myRefname}
                        />
                        {allgroups
                          // .filter((grp.groupName) => {
                          //   if (searchTerm === "") {
                          //     return grp.groupName;
                          //   } else if (
                          //     grp.groupName
                          //       .toLowerCase()
                          //       .includes(searchTerm.toLowerCase())
                          //   ) {
                          //     return grp.groupName;
                          //   }
                          //   return null;
                          // })
                          .map((grp) => (
                            <li
                              key={grp._id}
                              className={
                                grp.groupName === currentRoom ? "active" : ""
                              }
                              onClick={() => {
                                if (grp.groupPass === "") {
                                  joinRoomByCrd(
                                    grp.groupName,
                                    true,
                                    user._id,
                                    grp.groupPass
                                  );
                                } else {
                                  handleClick();
                                  setgpPassword({
                                    ...gpPassword,
                                    byGroup: grp.groupPass,
                                    groupName: grp.groupName,
                                    userid: user._id,
                                  });
                                }
                              }}
                              style={{ cursor: "pointer" }}
                            >
                              <a>
                                <div className="d-flex align-items-center">
                                  <div className="chat-user-img align-self-center me-3 ms-0">
                                    <div className="avatar-xs">
                                      <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                        {grp.groupName.split("")[0]}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex-grow-1 overflow-hidden">
                                    <h5 className="text-truncate font-size-14 mb-0">
                                      #
                                      {grp.groupName.charAt(0).toUpperCase() +
                                        grp.groupName.slice(1)}{" "}
                                      {currentRoom !== grp.groupName && (
                                        <span className="badge badge-soft-danger rounded-pill float-end">
                                          {user.newMessages[grp.groupName]}
                                        </span>
                                      )}
                                    </h5>
                                  </div>
                                </div>
                              </a>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="simplebar-placeholder"
                style={{ width: "auto", height: "445px" }}
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
          </div>
        </div>
      </div>
    </>
  );
};
