import React, { useState } from 'react';
import './LoginSignup.css';
import { useNotification } from '../Context/NotificationContext';
import { backend_url } from '../App';

const LoginSignup = () => {
  const { error } = useNotification();
  const [mode, setMode] = useState('Login');
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const changeHandler = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const submit = async () => {
    setLoading(true);
    const endpoint = mode === 'Login' ? 'login' : 'signup';
    const res = await fetch(`${backend_url}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    setLoading(false);

    if (data.success) {
      localStorage.setItem('auth-token', data.token);
      window.location.replace('/');
    } else {
      error(data.errors || 'Something went wrong');
    }
  };

  return (
    <div className="loginsignup-safe">
      <div className="glass-card">
        <h2>{mode}</h2>

        <div className="input-group">
          {mode === 'Sign Up' && (
            <div className="input-box">
              <input type="text" placeholder=" " name="username" value={formData.username} onChange={changeHandler} required />
              <label>Your name</label>
            </div>
          )}

          <div className="input-box">
            <input type="email" placeholder=" " name="email" value={formData.email} onChange={changeHandler} required />
            <label>Email address</label>
          </div>

          <div className="input-box">
            <input type={showPass ? 'text' : 'password'} placeholder=" " name="password" value={formData.password} onChange={changeHandler} required />
            <label>Password</label>
            <span className="eye" onClick={() => setShowPass(!showPass)}>{showPass ? '🙈' : '👁️'}</span>
          </div>
        </div>

        <button className="submit-btn" onClick={submit} disabled={loading}>
          {loading ? <span className="spinner" /> : 'Continue'}
        </button>

        <p className="switch">
          {mode === 'Login' ? 'Create an account? ' : 'Already have an account? '}
          <span className="switch-link" onClick={() => setMode(mode === 'Login' ? 'Sign Up' : 'Login')}>
            {mode === 'Login' ? 'Click here' : 'Login here'}
          </span>
        </p>

        <div className="checkbox-row">
          <input type="checkbox" id="agree" />
          <label htmlFor="agree">I agree to the terms & privacy policy.</label>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;