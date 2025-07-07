// UserUpload.js
import React, { useState, useRef } from 'react';
import { Container, Form, Button, Alert, Spinner, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const UserUpload = () => {
  const [file, setFile] = useState(null);
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }
    setUploading(true);
    setError('');
    setMessage('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('user', username || 'anonymous');

      const res = await fetch('http://localhost:4000/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        setMessage('File uploaded successfully!');
        setFile(null);
        fileInputRef.current.value = '';
        setUsername('');
      } else {
        setError(data.error || 'Upload failed');
      }
    } catch (err) {
      setError('Server error');
    }
    setUploading(false);
  };

  return (
    <Container style={{ maxWidth: '600px', marginTop: '60px' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginBottom: '10px' }}>
        <Link to="/admin">Admin Login</Link>
      </div>
      <Card>
        <Card.Body>
          <Card.Title className="mb-4">Upload File</Card.Title>
          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Your Name (optional)</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your name"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Choose file</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                ref={fileInputRef}
                accept=".pdf,.csv,.json,.xlsx,image/*"
              />
            </Form.Group>
            <Button type="submit" variant="primary" disabled={uploading}>
              {uploading ? <Spinner animation="border" size="sm" /> : 'Upload'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UserUpload;

