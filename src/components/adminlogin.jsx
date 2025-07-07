// AdminLogin.js
import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch('http://localhost:4000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('adminToken', data.token);
        navigate('/dashboard');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Server error');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch('http://localhost:4000/api/admin/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Registration successful! Please login.');
        setIsRegister(false);
        setUsername('');
        setPassword('');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Server error');
    }
  };

  return (
    <Container style={{ maxWidth: '400px', marginTop: '100px' }}>
      <Card>
        <Card.Body>
          <Card.Title className="mb-4 text-center">
            {isRegister ? 'Admin Register' : 'Admin Login'}
          </Card.Title>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={isRegister ? handleRegister : handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </Form.Group>
            <Button type="submit" variant="primary" className="w-100">
              {isRegister ? 'Register' : 'Login'}
            </Button>
          </Form>
          <div className="mt-3 text-center">
            {isRegister ? (
              <span>
                Already have an account?{' '}
                <Button variant="link" onClick={() => { setIsRegister(false); setError(''); setSuccess(''); }}>
                  Login
                </Button>
              </span>
            ) : (
              <span>
                New admin?{' '}
                <Button variant="link" onClick={() => { setIsRegister(true); setError(''); setSuccess(''); }}>
                  Register
                </Button>
              </span>
            )}
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminLogin;
