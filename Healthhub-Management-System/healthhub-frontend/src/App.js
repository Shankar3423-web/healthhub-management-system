// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';

// === Public Pages ===
import HomePage from './components/HomePage';
import Login from './components/Login';
import SignUp from './components/SignUp';

// === Profile Forms ===
import AdminProfileForm from './profiles/AdminProfileForm';
import DoctorProfileForm from './profiles/DoctorProfileForm';
import PatientProfileForm from './profiles/PatientProfileForm';
import StaffProfileForm from './profiles/StaffProfileForm';

// === Dashboard Pages ===
import AdminDashboard from './Dashboards/Admin/AdminDashboard';
import DoctorDashboard from './Dashboards/Doctor/DoctorDashboard';
import PatientDashboard from './Dashboards/Patient/PatientDashboard';
import StaffDashboard from './Dashboards/staff/StaffDashboard'; // ✅ FIXED: Correct path to staff subfolder

// === Patient Feature Pages ===
import BookAppointment from './Dashboards/Patient/BookAppointment';
import Uploads from './Dashboards/Patient/Uploads';
import Billing from './Dashboards/Patient/Billing';
import History from './Dashboards/Patient/History'; // Patient's history
import Prescriptions from './Dashboards/Patient/Prescriptions';
import CheckAppointments from './Dashboards/Doctor/CheckAppointments';
import AddPrescription from './Dashboards/Doctor/AddPrescription';
import GivePrescription from './Dashboards/Doctor/GivePrescription';
import UploadedFiles from './Dashboards/Doctor/UploadedFiles'; // For document verification
import PatientHistory from './Dashboards/Doctor/PatientHistory'; // ✅ Add import for Doctor's History

// === Admin Feature Pages ===
import AssignRole from './Dashboards/Admin/AssignRole'; // ✅ NEW: Import AssignRole

function App() {
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
    }
  }, []);

  return (
    <Router>
      <div className="App" style={{ height: '100vh' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          <Route path="/admin-profile" element={<AdminProfileForm />} />
          <Route path="/doctor-profile" element={<DoctorProfileForm />} />
          <Route path="/patient-profile" element={<PatientProfileForm />} />
          <Route path="/staff-profile" element={<StaffProfileForm />} />

          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="/patient-dashboard" element={<PatientDashboard />} />
          <Route path="/staff-dashboard" element={<StaffDashboard />} />

          <Route path="/book-appointment" element={<BookAppointment />} />
          <Route path="/upload-files" element={<Uploads />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/history" element={<History />} />
          <Route path="/prescriptions" element={<Prescriptions />} />

          <Route path="/doctor/check-appointments" element={<CheckAppointments />} />
          <Route path="/doctor/checkup-prescription" element={<AddPrescription />} />
          <Route path="/doctor/give-prescription" element={<GivePrescription />} />
          <Route path="/doctor/uploaded-files" element={<UploadedFiles />} />
          <Route path="/doctor/history" element={<PatientHistory />} /> {/* ✅ Add Doctor's History Route */}

          {/* ✅ NEW: Admin Assign Role Route */}
          <Route path="/admin/assign-role" element={<AssignRole />} />

          {/* <Route path="*" element={<HomePage />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;