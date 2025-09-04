// src/components/Uploads.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Uploads = () => {
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [error, setError] = useState('');
  const [assignedDoctor, setAssignedDoctor] = useState('');

  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch documents
        const docRes = await fetch('http://localhost:5000/api/document/my', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (docRes.ok) {
          const docs = await docRes.json();
          setDocuments(docs);
        }

        // Fetch latest appointment to show doctor
        const aptRes = await fetch('http://localhost:5000/api/appointment/my', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (aptRes.ok) {
          const appointments = await aptRes.json();
          const booked = appointments.find(a => a.status === 'Booked');
          setAssignedDoctor(booked ? booked.doctorName : 'No active appointment');
        }
      } catch (err) {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!description.trim()) return setError('Document name is required');
    if (!file) return setError('Please select a file');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', description);

    try {
      const res = await fetch('http://localhost:5000/api/document/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        setDocuments([result.document, ...documents]);
        setDescription('');
        setFile(null);
        setUploadSuccess('Document uploaded successfully!');
        setTimeout(() => setUploadSuccess(''), 3000);
        setError('');
      } else {
        setError(result.msg);
      }
    } catch (err) {
      setError('Network error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this document?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/document/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (res.ok) {
        setDocuments(documents.filter(d => d._id !== id));
        alert('Deleted successfully');
      } else {
        alert('Delete failed');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  return (
    <div style={{
      fontFamily: 'Segoe UI, sans-serif',
      background: '#f5f8fa',
      minHeight: '100vh',
      padding: '30px',
    }}>
      <style>{`
        .container { max-width: 900px; margin: 0 auto; }
        .back-link { color: #1e88e5; text-decoration: none; margin-bottom: 20px; display: inline-block; }
        .back-link:hover { text-decoration: underline; }
        .header h1 { color: #0d47a1; }

        .info-box {
          background: #e3f2fd; padding: 15px; border-radius: 8px; margin-bottom: 20px; color: #0d47a1;
        }

        .form-section {
          background: white; padding: 25px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-bottom: 30px;
        }
        .form-group label { display: block; margin-bottom: 8px; font-weight: 500; }
        .form-group input[type="text"] {
          width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 8px; font-size: 1rem;
        }
        .file-input {
          display: flex; gap: 10px; align-items: center; margin-bottom: 15px;
        }
        .file-input button {
          background: #1e88e5; color: white; border: none; padding: 10px 16px; border-radius: 8px; cursor: pointer;
        }
        .file-input span { color: #555; }

        .success { color: green; margin: 10px 0; }

        .doc-item {
          background: white; padding: 16px; border-radius: 10px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 1px 6px rgba(0,0,0,0.1);
        }
        .doc-info h3 { margin: 0 0 6px; color: #0d47a1; }
        .doc-info p { margin: 4px 0; color: #555; font-size: 0.95rem; }
        .delete-btn {
          background: #d32f2f; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;
        }
        .delete-btn:hover { background: #c62828; }
      `}</style>

      <div className="container">
        <Link to="/patient-dashboard" className="back-link">← Back to Dashboard</Link>

        <div className="header">
          <h1>Upload Medical Documents</h1>
        </div>

        {uploadSuccess && <div className="success">{uploadSuccess}</div>}
        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

        <div className="info-box">
          <strong>Files will be shared with:</strong> Dr. {assignedDoctor}
        </div>

        <div className="form-section">
          <form onSubmit={handleUpload}>
            <div className="form-group">
              <label>Document Name (e.g., X-Ray, MRI)</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter document type"
              />
            </div>

            <div className="form-group">
              <label>Upload File</label>
              <div className="file-input">
                <button type="button" onClick={() => document.getElementById('fileInput').click()}>
                  Choose File
                </button>
                <span>{file ? file.name : 'No file selected'}</span>
              </div>
              <input
                id="fileInput"
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                style={{ display: 'none' }}
              />
            </div>

            <button type="submit" style={{
              background: '#1e88e5',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              fontSize: '1rem',
              borderRadius: '8px',
              cursor: 'pointer',
            }}>
              Upload Document
            </button>
          </form>
        </div>

        <div className="documents-list">
          <h2>Uploaded Documents</h2>
          {loading ? (
            <p>Loading...</p>
          ) : documents.length > 0 ? (
            documents.map((doc) => (
              <div className="doc-item" key={doc._id}>
                <div className="doc-info">
                  <h3>{doc.fileName}</h3>
                  <p><strong>Description:</strong> {doc.description}</p>
                  <p><strong>Uploaded:</strong> {new Date(doc.uploadedAt).toLocaleDateString()}</p>
                  <p><strong>Shared with:</strong> Dr. {doc.doctorName}</p>
                </div>
                <button className="delete-btn" onClick={() => handleDelete(doc._id)}>
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p>No documents uploaded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Uploads;