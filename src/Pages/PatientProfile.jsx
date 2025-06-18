import React, { useState, useEffect } from 'react';
import { useAuth } from '../Auth/AuthProvider';
import { Link } from 'react-router-dom';

const PatientProfile = () => {
    const { user, getToken, logOut } = useAuth();
    const [patientData, setPatientData] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [favoritesDoctors, setFavoritesDoctors] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [editForm, setEditForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        dateOfBirth: '',
        gender: '',
        profilePictureUrl: ''
    });

    // Fetch patient data on component mount
    useEffect(() => {
        fetchPatientData();
        fetchAppointments();
        // fetchFavoritesDoctors(); // Uncomment when favorites API is available
    }, []);

    const fetchPatientData = async () => {
        try {
            // Since there's no specific patient endpoint, we'll use the user data from auth
            setPatientData(user);
            setEditForm({
                firstName: user?.firstName || '',
                lastName: user?.lastName || '',
                email: user?.email || '',
                phoneNumber: user?.phoneNumber || '',
                dateOfBirth: user?.dateOfBirth || '',
                gender: user?.gender || '',
                profilePictureUrl: user?.profilePictureUrl || ''
            });
        } catch (error) {
            console.error('Error fetching patient data:', error);
            setMessage('Error loading profile data');
            setMessageType('error');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAppointments = async () => {
        try {
            const token = getToken();
            const response = await fetch('https://medscanapi.runasp.net/api/Appointment', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setAppointments(data.data || []);
                }
            }
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    };

    const handleInputChange = (e) => {
        setEditForm({
            ...editForm,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = async () => {
        try {
            setIsLoading(true);
            // Since there's no specific patient update endpoint, we'll simulate the update
            // In a real scenario, you would call the appropriate API endpoint
            
            setPatientData({ ...patientData, ...editForm });
            setIsEditing(false);
            setMessage('Profile updated successfully!');
            setMessageType('success');
            
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage('Error updating profile');
            setMessageType('error');
        } finally {
            setIsLoading(false);
            setTimeout(() => setMessage(''), 5000);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        // Reset form to original data
        if (patientData) {
            setEditForm({
                firstName: patientData.firstName || '',
                lastName: patientData.lastName || '',
                email: patientData.email || '',
                phoneNumber: patientData.phoneNumber || '',
                dateOfBirth: patientData.dateOfBirth || '',
                gender: patientData.gender || '',
                profilePictureUrl: patientData.profilePictureUrl || ''
            });
        }
    };

    const getAppointmentStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'confirmed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            case 'completed':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-Primary mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                            <p className="text-gray-600">Manage your personal information and appointments</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link 
                                to="/" 
                                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
                            >
                                Back to Home
                            </Link>
                            <Link 
                                to="/book-appointment" 
                                className="bg-Primary text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                            >
                                Book Appointment
                            </Link>
                            <button 
                                onClick={logOut}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {message && (
                    <div className={`mb-6 p-4 rounded-lg ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Profile Picture and Basic Info */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow p-6 text-center">
                            <div className="mb-4">
                                {patientData?.profilePictureUrl ? (
                                    <img 
                                        src={patientData.profilePictureUrl} 
                                        alt="Profile" 
                                        className="w-32 h-32 rounded-full mx-auto object-cover"
                                    />
                                ) : (
                                    <div className="w-32 h-32 rounded-full mx-auto bg-Primary flex items-center justify-center text-white text-4xl font-bold">
                                        {patientData?.firstName?.charAt(0)}{patientData?.lastName?.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">
                                {patientData?.firstName} {patientData?.lastName}
                            </h2>
                            <p className="text-gray-600 text-sm mt-2">{patientData?.email}</p>
                            
                            {!isEditing && (
                                <button 
                                    onClick={() => setIsEditing(true)}
                                    className="mt-4 w-full bg-Primary text-white py-2 rounded-lg hover:bg-blue-700"
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>

                        {/* Quick Stats */}
                        <div className="bg-white rounded-lg shadow p-6 mt-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Summary</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Total Appointments</span>
                                    <span className="font-semibold">{appointments.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Upcoming</span>
                                    <span className="font-semibold text-Primary">
                                        {appointments.filter(apt => apt.status === 'Confirmed').length}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Completed</span>
                                    <span className="font-semibold text-green-600">
                                        {appointments.filter(apt => apt.status === 'Completed').length}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Profile Details and Appointments */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Profile Information */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                                {isEditing && (
                                    <div className="space-x-2">
                                        <button 
                                            onClick={handleSave}
                                            className="bg-Primary text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                        >
                                            Save Changes
                                        </button>
                                        <button 
                                            onClick={handleCancel}
                                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                    {isEditing ? (
                                        <input 
                                            type="text"
                                            name="firstName"
                                            value={editForm.firstName}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-Primary"
                                        />
                                    ) : (
                                        <p className="text-gray-900">{patientData?.firstName || 'Not provided'}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                    {isEditing ? (
                                        <input 
                                            type="text"
                                            name="lastName"
                                            value={editForm.lastName}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-Primary"
                                        />
                                    ) : (
                                        <p className="text-gray-900">{patientData?.lastName || 'Not provided'}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                    {isEditing ? (
                                        <input 
                                            type="email"
                                            name="email"
                                            value={editForm.email}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-Primary"
                                        />
                                    ) : (
                                        <p className="text-gray-900">{patientData?.email || 'Not provided'}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                    {isEditing ? (
                                        <input 
                                            type="tel"
                                            name="phoneNumber"
                                            value={editForm.phoneNumber}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-Primary"
                                        />
                                    ) : (
                                        <p className="text-gray-900">{patientData?.phoneNumber || 'Not provided'}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                                    {isEditing ? (
                                        <input 
                                            type="date"
                                            name="dateOfBirth"
                                            value={editForm.dateOfBirth?.split('T')[0] || ''}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-Primary"
                                        />
                                    ) : (
                                        <p className="text-gray-900">
                                            {patientData?.dateOfBirth ? new Date(patientData.dateOfBirth).toLocaleDateString() : 'Not provided'}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                                    {isEditing ? (
                                        <select 
                                            name="gender"
                                            value={editForm.gender}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-Primary"
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                        </select>
                                    ) : (
                                        <p className="text-gray-900">{patientData?.gender || 'Not provided'}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Recent Appointments */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Recent Appointments</h3>
                                <Link 
                                    to="/book-appointment" 
                                    className="text-Primary hover:underline text-sm"
                                >
                                    Book New Appointment →
                                </Link>
                            </div>
                            
                            {appointments.length > 0 ? (
                                <div className="space-y-3">
                                    {appointments.slice(0, 5).map((appointment, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="font-medium">Dr. {appointment.doctorName || 'Unknown'}</p>
                                                <p className="text-sm text-gray-600">
                                                    {appointment.appointmentDate ? new Date(appointment.appointmentDate).toLocaleDateString() : 'Date TBD'} - {appointment.appointmentTime || 'Time TBD'}
                                                </p>
                                            </div>
                                            <span className={`px-2 py-1 rounded-full text-xs ${getAppointmentStatusColor(appointment.status)}`}>
                                                {appointment.status || 'Pending'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-500 mb-4">No appointments yet</p>
                                    <Link 
                                        to="/book-appointment" 
                                        className="bg-Primary text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                    >
                                        Book Your First Appointment
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PatientProfile;

