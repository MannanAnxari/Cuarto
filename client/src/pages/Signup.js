import React, { useState } from "react";
import { useSignupUserMutation } from "../services/appApi";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";
import toast from "react-hot-toast";
import botImg from "../assets/bot.jpeg";

function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [signupUser, { isLoading, error }] = useSignupUserMutation();
    const navigate = useNavigate();
    //image upload states
    const [image, setImage] = useState(null);
    const [upladingImg, setUploadingImg] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    function validateImg(e) {
        const file = e.target.files[0];
        if (file.size >= 1048576) {
            toast.error("Max File Size is 1MB");
        } else {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
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

    async function handleSignup(e) {
        e.preventDefault();
        if (!image) return alert("Please upload your profile picture");
        const url = await uploadImage(image);
        console.log(url);
        // signup the user
        signupUser({ name, email, password, picture: url }).then(({ data }) => {
            if (data) {
                // console.log(data);
                toast.success("Successfully Registered")
                navigate("/chat");
            }
            else {
                toast.error(error.data)
            }
        });
    }
    

    return (
        <div>

            <div className="account-pages my-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-8 col-lg-6 col-xl-5">
                            <div className="text-center mb-4">
                                <a href="index.html" className="auth-logo mb-5 d-block">
                                    <img src="assets/images/logo-dark.png" alt="" height="30" className="logo logo-dark" />
                                    <img src="assets/images/logo-light.png" alt="" height="30" className="logo logo-light" />
                                </a>

                                <h4>Sign up</h4>
                                <p className="text-muted mb-4">Get your Cuarto account now.</p>

                            </div>

                            <div className="card">
                                <div className="card-body p-4">
                                    <div className="p-3">
                                        <form onSubmit={handleSignup}>

                                            <div className="mb-3">
                                                <div className="input-group bg-soft-light rounded-3 overflow-hidden mb-3">
                                                    <span className="input-group-text text-muted p-0 choseProfile" id="basic-addon5">
                                                        {/* <i className="ri-image-line"></i> */}
                                                        <img src={imagePreview || botImg} alt="Profile Pic" className="w-100" />

                                                    </span>
                                                    <input type="file" accept="image/png, image/jpeg" className="form-control form-control-lg bg-soft-light border-light" id="image-upload" aria-label="Enter Email" aria-describedby="basic-addon5" onChange={validateImg} />

                                                </div>
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Email</label>
                                                <div className="input-group bg-soft-light rounded-3  mb-3">
                                                    <span className="input-group-text text-muted" id="basic-addon5">
                                                        <i className="ri-mail-line"></i>
                                                    </span>
                                                    <input type="email" className="form-control form-control-lg bg-soft-light border-light" placeholder="Enter Email" aria-label="Enter Email" onChange={(e) => setEmail(e.target.value)} value={email} aria-describedby="basic-addon5" />

                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label">Username</label>
                                                <div className="input-group bg-soft-light mb-3 rounded-3">
                                                    <span className="input-group-text border-light text-muted" id="basic-addon6">
                                                        <i className="ri-user-2-line"></i>
                                                    </span>
                                                    <input type="text" onChange={(e) => setName(e.target.value)} value={name} required className="form-control form-control-lg bg-soft-light border-light" placeholder="Enter Username" aria-label="Enter Username" aria-describedby="basic-addon6" />

                                                </div>


                                            </div>

                                            <div className="mb-4">
                                                <label className="form-label">Password</label>
                                                <div className="input-group bg-soft-light mb-3 rounded-3">
                                                    <span className="input-group-text border-light text-muted" id="basic-addon7">
                                                        <i className="ri-lock-2-line"></i>
                                                    </span>
                                                    <input type="password" className="form-control form-control-lg bg-soft-light border-light" placeholder="Enter Password" aria-label="Enter Password" aria-describedby="basic-addon7" onChange={(e) => setPassword(e.target.value)} value={password} />

                                                </div>
                                            </div>


                                            <div className="d-grid">
                                                <button className="btn btn-primary waves-effect waves-light" type="submit">
                                                    {upladingImg || isLoading ? "Signing you up..." : "Signup"} </button>
                                            </div>

                                            <div className="mt-4 text-center">
                                                <p className="text-muted mb-0">By registering you agree to the Cuarto <a href="/#" className="text-primary">Terms of Use</a></p>
                                            </div>

                                        </form>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-5 text-center">
                                <p>Already have an account ? <Link to="/login" className="fw-medium text-primary"> Sign in </Link></p>
                                <p>© 2022 Cuarto. Crafted with <i className="mdi mdi-heart text-danger"></i> by KODRz</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;
