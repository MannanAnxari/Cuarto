import React from "react";

const CreateGroup = ({
  groupName,
  setgroupName,
  groupPass,
  setgroupPass,
  createGroup 
}) => {
 
  return (
    <>
      <div className="user-chat-nav float-end">
        <div
          data-bs-toggle="tooltip"
          data-bs-placement="bottom"
          title=""
          data-bs-original-title="Create group"
        >
          <button
            type="button"
            className="btn btn-link text-decoration-none text-muted font-size-18 py-0"
            data-bs-toggle="modal"
            data-bs-target="#addgroup-exampleModal"
          >
            <i className="ri-group-line me-1 ms-0"></i>
          </button>
        </div>
      </div>
      <h4 className="mb-4">Groups</h4>

      <div
        className="modal fade"
        id="addgroup-exampleModal"
        tabIndex="-1"
        aria-labelledby="addgroup-exampleModalLabel"
        aria-hidden="true"
        style={{ display: "none" }}
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5
                className="modal-title font-size-16"
                id="addgroup-exampleModalLabel"
              >
                Create New Group
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body p-4">
              <form>
                <div className="mb-4">
                  <label htmlFor="addgroupname-input" className="form-label">
                    Group Name*
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="addgroupname-input"
                    placeholder="Enter Group Name*"
                    autoComplete="off"
                    value={groupName}
                    onChange={(e) => {
                      setgroupName(e.target.value);
                    }}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="addgrouppass-input" className="form-label">
                    Group Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="addgrouppass-input"
                    placeholder="Enter Group Password"
                    autoComplete="off"
                    value={groupPass}
                    onChange={(e) => {
                      setgroupPass(e.target.value);
                    }}
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label">Group Members</label>
                  <div className="mb-3">
                    <button
                      className="btn btn-light btn-sm"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#groupmembercollapse"
                      aria-expanded="false"
                      aria-controls="groupmembercollapse"
                    >
                      Select Members
                    </button>
                  </div>

                  <div className="collapse" id="groupmembercollapse">
                    <div className="card border">
                      <div className="card-header">
                        <h5 className="font-size-15 mb-0">Contacts</h5>
                      </div>
                      <div className="card-body p-2">
                        <div
                          data-simplebar="init"
                          style={{ maxHeight: "150px" }}
                        >
                          <div
                            className="simplebar-wrapper"
                            style={{ margin: "0px" }}
                          >
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
                                  style={{
                                    height: "auto",
                                    overflow: "hidden",
                                  }}
                                >
                                  <div
                                    className="simplebar-content"
                                    style={{ padding: "0px" }}
                                  >
                                    <div>
                                      <ul className="list-unstyled contact-list">
                                        <li>
                                          <div className="form-check">
                                            <input
                                              type="checkbox"
                                              className="form-check-input"
                                              id="memberCheck1"
                                              defaultChecked
                                            />
                                            <label
                                              className="form-check-label"
                                              htmlFor="memberCheck1"
                                            >
                                              Albert Rodarte
                                            </label>
                                          </div>
                                        </li>

                                        <li>
                                          <div className="form-check">
                                            <input
                                              type="checkbox"
                                              className="form-check-input"
                                              id="memberCheck2"
                                            />
                                            <label
                                              className="form-check-label"
                                              htmlFor="memberCheck2"
                                            >
                                              Allison Etter
                                            </label>
                                          </div>
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div
                              className="simplebar-placeholder"
                              style={{ width: "0px", height: "0px" }}
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
                                height: " 25px",
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> 
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-link"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                onClick={createGroup}
                className="btn btn-primary"
              >
                Create Group
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateGroup;
