// AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Form, Button, Spinner, Navbar, Nav, Carousel, Card } from 'react-bootstrap';
import { FaSearch, FaDownload } from 'react-icons/fa';
import ExcelPreview from './ExcelPreview';


const AdminDashboard = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  const token = localStorage.getItem('adminToken'); // This is where the Bearer token comes from
  const API = process.env.REACT_APP_API_BASE_URL;

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/files`, {
        headers: {
          Authorization: `Bearer ${token}` // This sends the Bearer token in the request
        }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setFiles(data);
      }
    } catch (err) {
      console.error('Error fetching files:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const filteredFiles = files.filter(file => {
    const matchSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = selectedType === 'all' || file.mimetype.includes(selectedType);
    return matchSearch && matchType;
  });

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin-login';
  };

  const getPreviewContent = (file) => {
  const fileUrl = `${API}/api/file/${file.id}`;

  if (file.mimetype.includes('pdf')) {
    return <iframe src={fileUrl} title={file.name} style={{ height: 260, width: '100%' }} />;
  } else if (file.mimetype.includes('image')) {
    return <img src={fileUrl} alt={file.name} style={{ height: 260, width: '100%', objectFit: 'contain' }} />;
  } else if (file.mimetype.includes('csv')) {
    return (
      <CSVPreview fileId={file.id} />
    );
  } else if (
    file.mimetype.includes('sheet') ||
    file.mimetype.includes('excel') ||
    file.name.endsWith('.xlsx') ||
    file.name.endsWith('.xls')
  ) {
    return <ExcelPreview fileId={file.id} />
  } else if (file.mimetype.includes('json')) {
    return <iframe src={fileUrl} title={file.name} style={{ height: 260, width: '100%' }} />;
  } else {
    return <div className="text-center" style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Unsupported Preview</div>;
  }
};

const CSVPreview = ({ fileId }) => {
  const [csvData, setCsvData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCSV = async () => {
      try {
        const response = await fetch(`${API}/api/file/${fileId}`);
        const text = await response.text();

        const rows = text.trim().split('\n').slice(0, 5); // Limit to 5 rows
        const data = rows.map(row => row.split(','));

        setCsvData(data);
      } catch (err) {
        console.error('CSV preview error:', err);
        setError('Unable to load CSV preview.');
      }
    };

    fetchCSV();
  }, [fileId]);

  if (error) return <div>{error}</div>;

  return (
    <div style={{ overflowX: 'auto', height: 260 }}>
      <Table bordered size="sm">
        <tbody>
          {csvData.map((row, idx) => (
            <tr key={idx}>
              {row.map((cell, i) => (
                <td key={i}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};



  return (
    <div>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand>IoT Platform</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="me-auto"></Nav>
            <Form className="d-flex me-3">
              <Form.Control
                type="search"
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Form>
            <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Row>
          <Col>
            <h4>File Previews</h4>
            <Carousel variant="dark">
              {filteredFiles.map(file => (
                <Carousel.Item key={file.id}>
                  {getPreviewContent(file)}
                  <Carousel.Caption>
                    <h5>{file.name}</h5>
                    <p>{file.mimetype}</p>
                  </Carousel.Caption>
                </Carousel.Item>
              ))}
            </Carousel>
          </Col>
        </Row>

        <Row className="mt-4 mb-3">
          <Col md={6}><h4>Uploaded Files</h4></Col>
          <Col md={6}>
            <Form.Select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
              <option value="all">All Types</option>
              <option value="pdf">PDF</option>
              <option value="image">Image</option>
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
              <option value="sheet">Excel</option>
            </Form.Select>
          </Col>
        </Row>

        {loading ? (
          <div className="text-center"><Spinner animation="border" /></div>
        ) : (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>File Name</th>
                <th>MIME Type</th>
                <th>Uploaded By</th>
                <th>Uploaded At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFiles.map((file, index) => (
                <tr key={file.id}>
                  <td>{index + 1}</td>
                  <td>{file.name}</td>
                  <td>{file.mimetype}</td>
                  <td>{file.uploaded_by}</td>
                  <td>{new Date(file.uploaded_at).toLocaleString()}</td>
                  <td>
                    <a
                      href={`${API}/api/file/${file.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline-primary"
                    >
                      <FaDownload /> Download
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
    </div>
  );
};

export default AdminDashboard;
