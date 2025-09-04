// AssignRole.js
import { useState, useEffect } from 'react';

// 🔧 Define API base URL (your backend)
const API_BASE = 'http://localhost:5000'; // ← Make sure this matches your backend

const AssignRole = () => {
  const [staffList, setStaffList] = useState([]);
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [task, setTask] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [assignedTasks, setAssignedTasks] = useState([]);

  // Fetch approved staff on mount
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/staff-tasks/staff-list`);
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setStaffList(data);
        setError('');
      } catch (err) {
        console.error('Fetch staff failed:', err);
        if (err.message.includes('Failed to fetch')) {
          setError('❌ Cannot connect to server. Is backend running at http://localhost:5000?');
        } else {
          setError('Failed to load staff: ' + err.message);
        }
      }
    };

    const fetchTasks = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/staff-tasks/tasks`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setAssignedTasks(data);
      } catch (err) {
        console.warn('Could not load tasks:', err);
      }
    };

    fetchStaff();
    fetchTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStaffId) {
      setError('Please select a staff member.');
      return;
    }
    if (!task.trim()) {
      setError('Task description is required.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`${API_BASE}/api/staff-tasks/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ staffId: selectedStaffId, task }),
      });

      const result = await res.json();

      if (res.ok) {
        setSuccess('🎉 Task assigned successfully!');
        setTask('');
        setSelectedStaffId('');

        // Refresh task list
        const tasksRes = await fetch(`${API_BASE}/api/staff-tasks/tasks`);
        const tasksData = await tasksRes.json();
        setAssignedTasks(tasksData);
      } else {
        setError('❌ ' + (result.message || 'Failed to assign task.'));
      }
    } catch (err) {
      console.error('Assign task error:', err);
      setError(
        '⚠️ Network error. Check if backend is running at http://localhost:5000'
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ New: Handle Delete Task
  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      const res = await fetch(`${API_BASE}/api/staff-tasks/task/${taskId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        // Remove from UI
        setAssignedTasks((prev) => prev.filter((t) => t._id !== taskId));
        setSuccess('🗑️ Task deleted successfully!');
      } else {
        const text = await res.text();
        try {
          const data = JSON.parse(text);
          setError('❌ ' + (data.message || 'Failed to delete task.'));
        } catch {
          setError('❌ Failed to delete task. Server error.');
        }
      }
    } catch (err) {
      setError('⚠️ Failed to connect to server. Is backend running?');
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
      <h3 style={{ color: '#1a2238' }}>📋 Assign Task to Staff</h3>
      <p>Select a staff member and assign a task. The task will be logged with date and time.</p>

      {error && (
        <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{ backgroundColor: '#e8f5e8', color: '#2e7d32', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
            Select Staff
          </label>
          <select
            value={selectedStaffId}
            onChange={(e) => setSelectedStaffId(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              fontSize: '1rem',
              backgroundColor: '#fff',
            }}
          >
            <option value="">-- Choose a Staff Member --</option>
            {staffList.length === 0 ? (
              <option disabled>Loading staff...</option>
            ) : (
              staffList.map((staff) => (
                <option key={staff.staffId} value={staff.staffId}>
                  {staff.name} (ID: {staff.staffId}) - {staff.designation} ({staff.department})
                </option>
              ))
            )}
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
            Task Description
          </label>
          <textarea
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="E.g., Handle patient records, Supervise junior staff, etc."
            rows="4"
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              fontSize: '1rem',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: '#9d2235',
            color: 'white',
            padding: '12px 20px',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            fontSize: '1rem',
          }}
        >
          {loading ? 'Assigning...' : 'Assign Task'}
        </button>
      </form>

      {/* Display Assigned Tasks */}
      <h4 style={{ color: '#1a2238', marginTop: '30px' }}>📋 Recently Assigned Tasks</h4>
      {assignedTasks.length === 0 ? (
        <p>No tasks assigned yet.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr style={{ backgroundColor: '#1a2238', color: 'white' }}>
              <th style={{ padding: '10px', textAlign: 'left' }}>Staff</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Designation</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Task</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Assigned On</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assignedTasks.map((t) => (
              <tr key={t._id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px' }}>{t.staffName}</td>
                <td style={{ padding: '10px' }}>{t.designation || 'N/A'}</td>
                <td style={{ padding: '10px' }}>{t.task}</td>
                <td style={{ padding: '10px', fontSize: '0.9rem', color: '#555' }}>
                  {new Date(t.assignedAt).toLocaleString()}
                </td>
                <td style={{ padding: '10px' }}>
                  <button
                    onClick={() => handleDelete(t._id)}
                    style={{
                      backgroundColor: '#c62828',
                      color: 'white',
                      border: 'none',
                      padding: '6px 10px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AssignRole;