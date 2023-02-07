// import React from 'react';
// import { render, fireEvent } from '@testing-library/react';
// import Login from '../pages/Login';
// import { credentialsLogin, facebookLogin, googleLogin } from '../services/AuthService';

// jest.mock('../services/AuthService', () => {
//   return {
//     credentialsLogin: jest.fn(),
//     facebookLogin: jest.fn(),
//     googleLogin: jest.fn(),
//   };
// });

// describe('Login component', () => {
//   it('should call credentialsLogin with correct arguments on form submit', async () => {
//     const { getByTestId } = render(<Login />);

//     const email = 'test@example.com';
//     const password = 'password';
//     const emailInput = getByTestId('email-input');
//     const passwordInput = getByTestId('password-input');
//     const submitButton = getByTestId('submit-button');

//     fireEvent.change(emailInput, { target: { value: email } });
//     fireEvent.change(passwordInput, { target: { value: password } });
//     fireEvent.click(submitButton);

//     expect(credentialsLogin).toHaveBeenCalledWith(email, password);
//   });

//   it('should call facebookLogin on facebook login button click', async () => {
//     const { getByTestId } = render(<Login />);

//     const facebookLoginButton = getByTestId('facebook-login-button');
//     fireEvent.click(facebookLoginButton);

//     expect(facebookLogin).toHaveBeenCalled();
//   });

//   it('should call googleLogin on google login button click', async () => {
//     const { getByTestId } = render(<Login />);

//     const googleLoginButton = getByTestId('google-login-button');
//     fireEvent.click(googleLoginButton);

//     expect(googleLogin).toHaveBeenCalled();
//   });
// });
import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Login from "../pages/Login";
import { credentialsLogin, facebookLogin, googleLogin } from "../services/AuthService";

jest.mock("../services/AuthService", () => ({
  credentialsLogin: jest.fn(),
  facebookLogin: jest.fn(),
  googleLogin: jest.fn()
}));

describe("Login component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
  });
  
  it("submits the form and logs in with credentials", async () => {
    credentialsLogin.mockResolvedValue();
    const navigate = jest.fn();
    const { getByText, getByLabelText } = render(<Login />);
    const emailInput = getByLabelText("Email");
    const passwordInput = getByLabelText("Password");
    const submitButton = getByText("Log in");
    fireEvent.change(emailInput, { target: { value: "test@email.com" } });
    fireEvent.change(passwordInput, { target: { value: "testpassword" } });
    fireEvent.click(submitButton);
    await expect(credentialsLogin).toHaveBeenCalledWith("test@email.com", "testpassword");
    expect(navigate).toHaveBeenCalledWith("/");
  });
  
  it("logs in with Facebook", async () => {
    facebookLogin.mockResolvedValue();
    const navigate = jest.fn();
    const { getByText } = render(<Login />);
    const facebookButton = getByText("Log in with Facebook");
    fireEvent.click(facebookButton);
    await expect(facebookLogin).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith("/");
  });
  
  it("logs in with Google", async () => {
    googleLogin.mockResolvedValue();
    const navigate = jest.fn();
    const { getByText } = render(<Login />);
    const googleButton = getByText("Log in with Google");
    fireEvent.click(googleButton);
    await expect(googleLogin).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith("/");
  });
});