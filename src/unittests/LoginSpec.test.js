import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Login from '../pages/Login';
import { credentialsLogin, facebookLogin, googleLogin } from '../services/AuthService';

jest.mock('../services/AuthService', () => {
  return {
    credentialsLogin: jest.fn(),
    facebookLogin: jest.fn(),
    googleLogin: jest.fn(),
  };
});

describe('Login component', () => {
  it('should call credentialsLogin with correct arguments on form submit', async () => {
    const { getByTestId } = render(<Login />);

    const email = 'test@example.com';
    const password = 'password';
    const emailInput = getByTestId('email-input');
    const passwordInput = getByTestId('password-input');
    const submitButton = getByTestId('submit-button');

    fireEvent.change(emailInput, { target: { value: email } });
    fireEvent.change(passwordInput, { target: { value: password } });
    fireEvent.click(submitButton);

    expect(credentialsLogin).toHaveBeenCalledWith(email, password);
  });

  it('should call facebookLogin on facebook login button click', async () => {
    const { getByTestId } = render(<Login />);

    const facebookLoginButton = getByTestId('facebook-login-button');
    fireEvent.click(facebookLoginButton);

    expect(facebookLogin).toHaveBeenCalled();
  });

  it('should call googleLogin on google login button click', async () => {
    const { getByTestId } = render(<Login />);

    const googleLoginButton = getByTestId('google-login-button');
    fireEvent.click(googleLoginButton);

    expect(googleLogin).toHaveBeenCalled();
  });
});