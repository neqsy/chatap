import React from "react";

const Login = () => {
    return (
        <div class="container bg-transparent">
            <div class="row justify-content-center">
                <div class="col-xxl-4 col-xl-5 col-lg-5 col-md-7 col-sm-9">

                    <button class="btn btn-white w-100 mt-4 py-2 rounded-4">Log in with Facebook <i class="fa-brands fa-square-facebook"></i></button>
                    <button class="btn btn-white w-100 my-4 py-2 rounded-4">Log in with Google <i class="fa-brands fa-google"></i></button>
                    
                    <div class="card shadow-lg rounded-4">
                        <div class="card-body py-4 px-5">
                            <h1 class="fs-4 card-title fw-bold mb-4 text-center">Chatap</h1>
                            <form>
                                <div class="mb-3">
                                    <label class="mb-2" for="email">Email</label>
                                    <input id="name" type="text" class="form-control shadow-sm rounded-4" name="name" autofocus/>
                                </div>
                                <div class="mb-3">
                                    <div class="mb-2 w-100">
                                        <label for="password">Password</label>
                                    </div>
                                    <input id="password" type="password" class="form-control shadow-sm rounded-4" name="password"/>
                                </div>
                                <button class="btn btn-blue w-100 rounded-4">Log in</button>
                            </form>
                        </div>
                    </div>
                    
                    <p class="text-center text-white mt-3">
                        Don't have an account? <a href="/" class="link-info">Sign up</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
