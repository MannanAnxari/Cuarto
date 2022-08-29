import React, { useContext, useState } from "react";
import { useSelector } from "react-redux";
import { AppContext } from "../context/appContext"; 
import axios from "axios";
import "./Profile.css";

export default function Profile(props) {
  const { socket, setMembers, members } = useContext(AppContext);
  const user = useSelector((state) => state.user);
  socket.emit("message-room", user);
  const [pname, setPname] = useState(user.name);
  const [ppass, setPpass] = useState("");
  const [key, setKey] = useState("home");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [upladingImg, setUploadingImg] = useState(false);


  function validateImg(e) {
    const file = e.target.files[0];
    if (file.size >= 1048576) {
      return alert("Max file size is 1mb");
    } else {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }

  let userId = user._id;

  let name = JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).name;
  let valuez = JSON.parse(localStorage.getItem('persist:root'));
  // console.log(valuez); 

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
    setMembers(data.members);
    if (response.ok) {
      console.log(members)
      return props.showAlert(data.msg, "success");
    } else {
      return props.showAlert(data.error, "warning");
    }
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


  async function uploadImage() {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "crl4gmtt");
    try {
      setUploadingImg(true);

      let res = await fetch("https://api.cloudinary.com/v1_1/dmfeom3v4/image/upload", {
        method: "post",
        body: data,
      });
      const urlData = await res.json();
      setUploadingImg(false);
      return urlData.url;
    } catch (error) {
      setUploadingImg(false);
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

  const [toggleProfile, settoggleProfile] = useState("pCard_card");
  const toggleProfileFunc = () => {
    settoggleProfile(!toggleProfile);
  };

  if (user) {
    var pImage = user.picture;

    return (
      <>
        <div className={toggleProfile ? "pCard_card" : "pCard_card pCard_on"}>
          <div
            className="pCard_up"
            style={{
              backgroundImage: `url(${imagePreview || pImage})`,
            }}
          >
            <div className="pCard_text">
              <h2 className="text-capitalize">{user.name}</h2>
              <p>Hey, there i`m using DarkApp</p>
            </div>
            <div className="pCard_add">
              <i
                className={
                  toggleProfile ? "fa-solid fa-user-pen" : "fa fa-minus"
                }
                onClick={toggleProfileFunc}
              ></i>
            </div>
          </div>
          <div className="pCard_down">
            <div>
              <p>Projects</p>
              <p>126</p>
            </div>
            <div>
              <p>Views</p>
              <p>21,579</p>
            </div>
            <div>
              <p>Likes</p>
              <p>1,976</p>
            </div>
          </div>
          <div className="pCard_back">
            <div
              id="controlled-tab-example"
              activeKey={key}
              onSelect={(k) => setKey(k)}
              className="mb-3"
            >
              <div eventKey="home" title="Username">
                <p>Enter Username Here.</p>
                <form onSubmit={postName} className="text-center row">
                  <div className="col-12 px-5">
                    <input
                      type="text"
                      value={pname}
                      onChange={(e) => setPname(e.target.value)}
                      placeholder="Enter Username..."
                      className="form-control"
                    />
                    <button type="submit" className="btn-cuarto">
                      <span>Update</span>
                    </button>
                  </div>
                </form>
              </div>
              <div eventKey="profile" title="Password">
                <p>Enter Password Here.</p>
                <form onSubmit={postPass} className="text-center row">
                  <div className="col-12 px-5">
                    <input
                      type="password"
                      minLength={5}
                      value={ppass}
                      onChange={(e) => setPpass(e.target.value)}
                      placeholder="Enter New Password..."
                      className="form-control"
                    />
                    <button type="submit" className="btn-cuarto">
                      <span>Update</span>
                    </button>
                  </div>
                </form>
              </div>
              <div eventKey="contact" title="Profile Pic">
                <p>Enter Password Here.</p>
                <form onSubmit={handelUpdateProPic} className="text-center row">
                  <div className="col-12 px-5">
                    <input
                      type="file"
                      placeholder="Enter New Password..."
                      className="form-control"
                      onChange={validateImg}
                    />
                    <button type="submit" className="btn-cuarto">
                      <span>Update</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <div className="main-container">
        <div className="not container">Please Login...!</div>
      </div>
    );
  }
}
