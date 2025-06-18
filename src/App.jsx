import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from './Auth/PrivateRoute'
import Home from "./Components/Home";
import Navbar from "./Components/Navbar"
import Footer from "./Components/Footer"
import Services from "./Pages/Services";
import AboutUs from "./Pages/AboutUs";
import ContactUs from "./Pages/ContactUs";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import ResetPassword from "./Pages/ResetPassword";
import Scan from "./Pages/Scan";
import ScanResult from "./Pages/ScanResult";
import { AuthProvider } from "./Auth/AuthProvider"; 
import ProtectedRoute from "./Auth/ProtectedRoute"; 
import DoctorDashboard from "./Pages/DoctorDashboard"; 
import DoctorProfile from "./Pages/DoctorProfile";
import PatientProfile from "./Pages/PatientProfile";
import BookAppointment from "./Pages/BookAppointment";
import ClinicInfo from "./Pages/ClinicInfo";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/scan" element={ <PrivateRoute> <Scan /> </PrivateRoute>} />
          <Route path="/scan-result" element={<ScanResult />} />
          {/* Protected Doctor Dashboard route */}
          <Route 
            path="/doctor-dashboard" 
            element={
              <ProtectedRoute requiredRole="Doctor">
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/doctor/profile" 
            element={
              <ProtectedRoute requiredRole="Doctor">
                <DoctorProfile />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/doctor/clinic-info" 
            element={
              <ProtectedRoute requiredRole="Doctor">
                <ClinicInfo />
              </ProtectedRoute>
            }
          />

          {/* Protected Patient Routes */}
          <Route 
            path="/patient-profile" 
            element={
              <ProtectedRoute requiredRole="Patient">
                <PatientProfile />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/book-appointment" 
            element={
              <ProtectedRoute requiredRole="Patient">
                <BookAppointment />
              </ProtectedRoute>
            }
          />

        </Routes>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
