import React from "react";

const JoinByPass = ({
  gpPassword,
  setgpPassword,
  myRefclose,
  checkPassAndJoin,
}) => {
  return (
    <>
      <div
        className="modal fade"
        id="addpass-exampleModal"
        tabIndex="-1"
        aria-labelledby="addgroup-exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5
                className="modal-title font-size-16"
                id="addgroup-exampleModalLabel"
              >
                Enter Group Password
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
                    Enter Group Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="addgroupname-input"
                    placeholder="Enter Group Password*"
                    autoComplete="off"
                    value={gpPassword.byUser}
                    onChange={(e) => {
                      setgpPassword({ ...gpPassword, byUser: e.target.value });
                    }}
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-link"
                data-bs-dismiss="modal"
                ref={myRefclose}
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => checkPassAndJoin(gpPassword)}
                className="btn btn-primary"
              >
                Join Group
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default JoinByPass;
