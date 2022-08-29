import React, { useContext, useState } from "react"; 
import { useLoginUserMutation } from "../services/appApi";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import { AppContext } from "../context/appContext";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { socket } = useContext(AppContext);
    const [loginUser, { isLoading, error }] = useLoginUserMutation();
    function handleLogin(e) {
        e.preventDefault();
        // login logic
        loginUser({ email, password }).then(({ data }) => {
            if (data) {
                // socket work
                socket.emit("new-user");
                // navigate to the chat
                navigate("/chat");
            }
        });
    }

    return (

        <div className="account-pages my-5 pt-sm-5">
            {error && <div className="alert alert-warning alert-dismissible fade show" role="alert"><strong>Warning!  </strong>{error.data}<button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>}

            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6 col-xl-5">
                        <div className="text-center mb-4">
                            <a href="index.html" className="auth-logo mb-5 d-block">
                                <img src="assets/images/logo-dark.png" alt="" height="30" className="logo logo-dark" />
                                <img src="assets/images/logo-light.png" alt="" height="30" className="logo logo-light" />
                            </a> 
                            <h4>Sign in</h4>
                            <p className="text-muted mb-4">Sign in to continue to Chatvia.</p>

                        </div>

                        <div className="card">
                            <div className="card-body p-4">
                                <div className="p-3">
                                    <form onSubmit={handleLogin}>
                                        <div className="mb-3">
                                            <label className="form-label">Email</label>
                                            <div className="input-group mb-3 bg-soft-light rounded-3">
                                                <span className="input-group-text text-muted" id="basic-addon3">
                                                    <i className="ri-mail-line"></i>
                                                </span>
                                                <input type="email" className="form-control form-control-lg border-light bg-soft-light" onChange={(e) => setEmail(e.target.value)} value={email} placeholder="Enter Email" aria-label="Enter Username" aria-describedby="basic-addon3" />
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <div className="float-end">
                                                <a href="auth-recoverpw.html" className="text-muted font-size-13">Forgot password?</a>
                                            </div>
                                            <label className="form-label">Password</label>
                                            <div className="input-group mb-3 bg-soft-light rounded-3">
                                                <span className="input-group-text text-muted" id="basic-addon4">
                                                    <i className="ri-lock-2-line"></i>
                                                </span>
                                                <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} className="form-control form-control-lg border-light bg-soft-light" placeholder="Enter Password" aria-label="Enter Password" aria-describedby="basic-addon4" />

                                            </div>
                                        </div>

                                        <div className="form-check mb-4">
                                            <input type="checkbox" className="form-check-input" id="remember-check" />
                                            <label className="form-check-label" for="remember-check">Remember me</label>
                                        </div>

                                        <div className="d-grid">

                                            <button className="btn btn-primary waves-effect waves-light" type="submit"> Sign in</button>
                                        </div>

                                    </form>
                                </div>
                            </div>
                        </div>

                        <div className="mt-5 text-center">
                            <p>Don't have an account ? <Link to="/signup" className="fw-medium text-primary"> Signup now </Link> </p>
                            <p>© 2022 Cuarto. Crafted with <i className="mdi mdi-heart text-danger"></i> by KODRz</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
