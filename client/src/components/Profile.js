import React, { useState } from 'react'
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useUpdateUserNameMutation, useUpdateUserPasswordMutation, useUpdateUserProfileImageMutation } from '../services/appApi';


const Profile = () => {
  const user = useSelector((state) => state.user);
  const [pname, setPname] = useState(user.name);
  const [ppass, setPpass] = useState("*******");
  const [isSelected, setIsSelected] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [image, setImage] = useState(null);
  const [isActiveEdit, setActiveEdit] = useState("false");
  const [isActiveEditPass, setisActiveEditPass] = useState("false");
  const [updateUserName] = useUpdateUserNameMutation();
  const [updateUserPassword] = useUpdateUserPasswordMutation();
  const [updateUserProfileImage] = useUpdateUserProfileImageMutation();


  let userId = user._id;
  function validateImg(e) {
    const file = e.target.files[0];
    if (file.size >= 1048576) {
      toast.error("Max File Size is 1MB");
    } else {
      setIsSelected(true);
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }

  const enableEditPass = () => {
    setisActiveEditPass(!isActiveEditPass);
  };

  const enableEdit = () => {
    setActiveEdit(!isActiveEdit);
  };

  const handleUpdateProPic = async (e) => {
    e.preventDefault();
    if (!image) toast.error("Please upload your profile picture");
    const img = await uploadImage(image);

    // update profile image
    updateUserProfileImage({ img, userId }).then(({ data }) => {
      if (data) {
        toast.success(data.msg)
      }
      else {
        console.log(data);
        toast.error(data.error);
      }
    });
  }

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    // update password
    updateUserPassword({ userId, ppass }).then(({ data }) => {
      if (data) {
        toast.success(data.msg)
      }
      else {
        toast.error(data.error);
      }
    });
  }
  var pImage = user.picture;

  const handleUpdateUsername = (e) => {
    e.preventDefault();
    // update username
    updateUserName({ userId, pname }).then(({ data }) => {
      if (data) {
        toast.success(data.msg)
      }
      else {
        toast.error(data.error);
      }
    });
  }
  const uploadImage = async () => {
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
      toast.error(error + " Image Not Upload Sucessfully!");
    }
  }
  return (
    <div className="tab-pane active" id="pills-setting" role="tabpanel" aria-labelledby="pills-setting-tab">
      <div>
        <div className="px-4 pt-4">
          <h4 className="mb-0">Settings</h4>
        </div>

        <div className="text-center border-bottom p-4">
          <form onSubmit={handleUpdateProPic} >
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
            <a className="text-muted dropdown-toggle pb-1 d-block" href="/#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Available <i className="mdi mdi-chevron-down"></i>
            </a>

            <div className="dropdown-menu" >
              <a className="dropdown-item" href="/#">Available</a>
              <a className="dropdown-item" href="/#">Busy</a>
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
                  <form onSubmit={handleUpdateUsername}>
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
                    <form onSubmit={handleUpdatePassword}>
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
                          <a className="dropdown-item" href="/#">Everyone</a>
                          <a className="dropdown-item" href="/#">selected</a>
                          <a className="dropdown-item" href="/#">Nobody</a>
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
                          <input type="checkbox" className="form-check-input" id="privacy-lastseenSwitch" defaultChecked />
                          <label className="form-check-label" htmlFor="privacy-lastseenSwitch"></label>
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
                          <a className="dropdown-item" href="/#">Everyone</a>
                          <a className="dropdown-item" href="/#">selected</a>
                          <a className="dropdown-item" href="/#">Nobody</a>
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
                          <input type="checkbox" className="form-check-input" id="privacy-readreceiptSwitch" defaultChecked />
                          <label className="form-check-label" htmlFor="privacy-readreceiptSwitch"></label>
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
                          <a className="dropdown-item" href="/#">Everyone</a>
                          <a className="dropdown-item" href="/#">selected</a>
                          <a className="dropdown-item" href="/#">Nobody</a>
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
                        <label className="form-check-label" htmlFor="security-notificationswitch"></label>
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
                    <h5 className="font-size-13 mb-0"><a href="/#" className="text-body d-block">FAQs</a></h5>
                  </div>
                  <div className="py-3 border-top">
                    <h5 className="font-size-13 mb-0"><a href="/#" className="text-body d-block">Contact</a></h5>
                  </div>
                  <div className="py-3 border-top">
                    <h5 className="font-size-13 mb-0"><a href="/#" className="text-body d-block">Terms &amp; Privacy policy</a></h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div></div></div></div><div className="simplebar-placeholder" style={{ width: "auto", height: "251px" }}></div></div><div className="simplebar-track simplebar-horizontal" style={{ visibility: 'hidden' }}><div className="simplebar-scrollbar" style={{ transform: 'translate3d(0px, 0px, 0px)', display: 'none' }}></div></div><div className="simplebar-track simplebar-vertical" style={{ visibility: 'hidden' }}><div className="simplebar-scrollbar" style={{ transform: 'translate3d(0px, 0px, 0px)', display: "none", height: "397px" }}></div></div></div>

      </div>
    </div>
  )
}

export default Profile