import React, { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:5000';

const TodayAssignedRole = () => {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTask = async () => {
      setLoading(true);
      setError('');
      setTask(null);

      // 1. Get staffId from logged-in user
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        setError('User not logged in.');
        setLoading(false);
        return;
      }

      let staffId;
      try {
        const user = JSON.parse(storedUser);
        staffId = user.staffId || localStorage.getItem('staffId');
      } catch (err) {
        setError('Invalid user session.');
        setLoading(false);
        return;
      }

      if (!staffId) {
        setError('Staff ID not found. Please log in again.');
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Authentication required.');
        setLoading(false);
        return;
      }

      try {
        // ✅ Use new safe endpoint
        const url = `${API_BASE}/api/tasks/my?staffId=${staffId}`;
        const res = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const tasks = await res.json();

        if (Array.isArray(tasks) && tasks.length > 0) {
          const latest = tasks[0]; // Already sorted by backend
          setTask(latest);
        } else {
          setError('No tasks have been assigned to you yet.');
        }
      } catch (err) {
        console.error('Fetch task failed:', err);
        if (err.message.includes('Failed to fetch')) {
          setError('⚠️ Cannot connect to server. Is backend running at http://localhost:5000?');
        } else if (err.message.includes('401') || err.message.includes('403')) {
          setError('🔐 Session expired. Please log in again.');
        } else {
          setError('❌ Could not load your assigned role. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, []);

  if (loading) {
    return (
      <div style={styles.container}>
        <h3 style={styles.title}>📋 Today’s Assigned Role</h3>
        <p>🔄 Fetching your task...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>📋 Today’s Assigned Role</h3>

      {error ? (
        <div style={styles.errorBox}>
          <strong>{error}</strong>
        </div>
      ) : (
        <div style={styles.card}>
          <p><strong>Staff Name:</strong> {task.staffName}</p>
          <p><strong>Designation:</strong> {task.designation}</p>
          <p><strong>Department:</strong> {task.department}</p>
          <p><strong>Assigned By:</strong> {task.assignedBy || 'Admin'}</p>
          <p><strong>Assigned On:</strong> {new Date(task.assignedAt).toLocaleString()}</p>

          <div style={styles.taskBox}>
            <strong>🎯 Task:</strong>
            <p style={styles.taskText}>{task.task}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// === STYLES (unchanged) ===
const styles = {
  container: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    border: '1px solid #c8e6c9',
    minHeight: '300px',
  },
  title: {
    margin: '0 0 16px',
    color: '#1b5e20',
    fontSize: '20px',
    borderBottom: '2px solid #a5d6a7',
    paddingBottom: '8px',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    fontSize: '15px',
    color: '#2e7d32',
  },
  taskBox: {
    marginTop: '15px',
    padding: '15px',
    backgroundColor: '#f1f8e9',
    borderRadius: '8px',
    border: '1px solid #c8e6c9',
  },
  taskText: {
    margin: '8px 0 0',
    lineHeight: '1.6',
    whiteSpace: 'pre-wrap',
    fontSize: '15px',
  },
  errorBox: {
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: '16px',
    borderRadius: '6px',
    fontSize: '0.95rem',
  },
};

export default TodayAssignedRole;