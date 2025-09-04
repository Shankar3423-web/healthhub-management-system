// src/Dashboards/Doctor/UploadedFiles.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const UploadedFiles = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

  const { patient } = location.state || {};
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!patient) return;

    const fetchFiles = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/doctor/patient/${patient.patientId}/documents`,
          {
            headers: { 'Authorization': `Bearer ${token}` },
          }
        );

        if (res.ok) {
          const data = await res.json();
          setFiles(data);
        }
      } catch (err) {
        console.error('Failed to load documents', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [token, patient]);

  if (!patient) {
    return (
      <div style={containerStyle}>
        <p style={{ color: 'red' }}>No patient data found.</p>
        <button onClick={() => navigate(-1)} style={backButtonStyle}>← Go Back</button>
      </div>
    );
  }

  const openFile = (filePath, fileName) => {
    const fullUrl = filePath.startsWith('http')
      ? filePath
      : `http://localhost:5000${filePath}`;
    const fileExt = fileName.toLowerCase().split('.').pop();

    if (fileExt === 'pdf') {
      const pdfWindow = window.open('', '_blank');
      pdfWindow.document.write(`
        <html style="height: 100%; margin: 0;">
          <head><title>${fileName}</title></style>
          <body><iframe src="${fullUrl}#zoom=85" style="width:100%;height:100%;border:none;"></iframe></body>
        </html>
      `);
      pdfWindow.document.close();
    } else if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExt)) {
      const imgWindow = window.open('', '_blank');
      imgWindow.document.write(`
        <html style="height:100%;margin:0;display:flex;justify-content:center;align-items:center;">
          <body><img src="${fullUrl}" style="max-width:90vw;max-height:90vh;"/></body>
        </html>
      `);
      imgWindow.document.close();
    } else {
      const link = document.createElement('a');
      link.href = fullUrl;
      link.download = fileName;
      link.click();
    }
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1>📂 Uploaded Documents</h1>
        <p><strong>Patient:</strong> {patient.patientName} (ID: {patient.patientId})</p>
      </div>

      {loading ? (
        <p style={emptyStyle}>Loading documents...</p>
      ) : files.length > 0 ? (
        <div style={fileListStyle}>
          {files.map((file) => (
            <div key={file.id} className="file-item" style={fileItemStyle}>
              <div style={{ flex: 1 }}>
                <strong>{file.fileName}</strong>
                <div style={{ fontSize: '0.9rem', color: '#555' }}>
                  {file.fileType} • {new Date(file.uploadedAt).toLocaleDateString()}
                </div>
              </div>
              <button
                style={viewButtonStyle}
                onClick={() => openFile(file.filePath, file.fileName)}
              >
                {file.fileName.toLowerCase().endsWith('.pdf') ? '📄 View' : '⬇️ Download'}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p style={emptyStyle}>No documents uploaded by this patient.</p>
      )}

      <div style={buttonGroupStyle}>
        <button
          onClick={() => {
            // ✅ Pass patientId back via state
            navigate('/doctor/checkup-prescription', {
              state: { verifiedPatientId: patient.patientId },
            });
          }}
          style={completeButtonStyle}
        >
          ✅ Complete Verification
        </button>
      </div>
    </div>
  );
};

// Styles (same as before)
const containerStyle = {
  fontFamily: 'Segoe UI, sans-serif',
  background: '#f5f8fa',
  minHeight: '100vh',
  padding: '30px',
};

const headerStyle = {
  marginBottom: '30px',
  color: '#0d47a1',
};

const fileListStyle = {
  background: 'white',
  borderRadius: '12px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  marginBottom: '30px',
};

const fileItemStyle = {
  padding: '15px 20px',
  borderBottom: '1px solid #eee',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const viewButtonStyle = {
  background: '#1e88e5',
  color: 'white',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '6px',
  cursor: 'pointer',
};

const emptyStyle = {
  textAlign: 'center',
  color: '#777',
  padding: '40px',
  background: 'white',
  borderRadius: '12px',
  margin: '20px 0',
};

const buttonGroupStyle = {
  textAlign: 'center',
  marginTop: '40px',
};

const completeButtonStyle = {
  background: '#4caf50',
  color: 'white',
  border: 'none',
  padding: '12px 32px',
  fontSize: '1.1rem',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 'bold',
};

const backButtonStyle = {
  ...completeButtonStyle,
  background: '#999',
  display: 'inline-block',
  marginTop: '20px',
};

export default UploadedFiles;