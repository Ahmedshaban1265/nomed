import React, { useState, useEffect } from 'react';
import { useAuth } from '../Auth/AuthProvider';
import { Link } from 'react-router-dom';

const DoctorProfile = () => {
    const { user, getToken, logOut } = useAuth();
    const [doctorData, setDoctorData] = useState(null);
    const [clinicInfo, setClinicInfo] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [editForm, setEditForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        specialization: '',
        bio: '',
        profilePictureUrl: ''
    });

    // Fetch doctor data on component mount
    useEffect(() => {
        fetchDoctorData();
        fetchClinicInfo();
    }, []);

    const fetchDoctorData = async () => {
        try {
            const token = getToken();
            const response = await fetch(`https://medscanapi.runasp.net/api/Doctor/${user?.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setDoctorData(data.data);
                    setEditForm({
                        firstName: data.data.firstName || '',
                        lastName: data.data.lastName || '',
                        email: data.data.email || '',
                        phoneNumber: data.data.phoneNumber || '',
                        specialization: data.data.specialization || '',
                        bio: data.data.bio || '',
                        profilePictureUrl: data.data.profilePictureUrl || ''
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching doctor data:', error);
            setMessage('Error loading profile data');
            setMessageType('error');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchClinicInfo = async () => {
        try {
            const token = getToken();
            const response = await fetch('https://medscanapi.runasp.net/api/ClinicInfo/my-info', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setClinicInfo(data.data);
                }
            }
        } catch (error) {
            console.error('Error fetching clinic info:', error);
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
            const token = getToken();
            
            // Update doctor profile (this might need to be adjusted based on actual API endpoint)
            const response = await fetch(`https://medscanapi.runasp.net/api/Doctor/${user?.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(editForm)
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setDoctorData(data.data);
                    setIsEditing(false);
                    setMessage('Profile updated successfully!');
                    setMessageType('success');
                } else {
                    setMessage(data.message || 'Failed to update profile');
                    setMessageType('error');
                }
            } else {
                setMessage('Failed to update profile');
                setMessageType('error');
            }
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
        if (doctorData) {
            setEditForm({
                firstName: doctorData.firstName || '',
                lastName: doctorData.lastName || '',
                email: doctorData.email || '',
                phoneNumber: doctorData.phoneNumber || '',
                specialization: doctorData.specialization || '',
                bio: doctorData.bio || '',
                profilePictureUrl: doctorData.profilePictureUrl || ''
            });
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
                            <h1 className="text-2xl font-bold text-gray-900">Doctor Profile</h1>
                            <p className="text-gray-600">Manage your professional information</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link 
                                to="/doctor-dashboard" 
                                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
                            >
                                Back to Dashboard
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
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                                {doctorData?.profilePictureUrl ? (
                                    <img 
                                        src={doctorData.profilePictureUrl} 
                                        alt="Profile" 
                                        className="w-32 h-32 rounded-full mx-auto object-cover"
                                    />
                                ) : (
                                    <div className="w-32 h-32 rounded-full mx-auto bg-Primary flex items-center justify-center text-white text-4xl font-bold">
                                        {doctorData?.firstName?.charAt(0)}{doctorData?.lastName?.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">
                                Dr. {doctorData?.firstName} {doctorData?.lastName}
                            </h2>
                            <p className="text-Primary font-medium">{doctorData?.specialization}</p>
                            <p className="text-gray-600 text-sm mt-2">{doctorData?.email}</p>
                            
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
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Total Appointments</span>
                                    <span className="font-semibold">156</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Patients Treated</span>
                                    <span className="font-semibold">89</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Years of Experience</span>
                                    <span className="font-semibold">8</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Profile Details */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
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
                                        <p className="text-gray-900">{doctorData?.firstName || 'Not provided'}</p>
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
                                        <p className="text-gray-900">{doctorData?.lastName || 'Not provided'}</p>
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
                                        <p className="text-gray-900">{doctorData?.email || 'Not provided'}</p>
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
                                        <p className="text-gray-900">{doctorData?.phoneNumber || 'Not provided'}</p>
                                    )}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                                    {isEditing ? (
                                        <input 
                                            type="text"
                                            name="specialization"
                                            value={editForm.specialization}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-Primary"
                                        />
                                    ) : (
                                        <p className="text-gray-900">{doctorData?.specialization || 'Not provided'}</p>
                                    )}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                                    {isEditing ? (
                                        <textarea 
                                            name="bio"
                                            value={editForm.bio}
                                            onChange={handleInputChange}
                                            rows={4}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-Primary"
                                            placeholder="Tell patients about yourself, your experience, and your approach to healthcare..."
                                        />
                                    ) : (
                                        <p className="text-gray-900">{doctorData?.bio || 'No bio provided'}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Clinic Information */}
                        {clinicInfo && (
                            <div className="bg-white rounded-lg shadow p-6 mt-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Clinic Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Clinic Name</label>
                                        <p className="text-gray-900">{clinicInfo.name || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                        <p className="text-gray-900">{clinicInfo.address || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                        <p className="text-gray-900">{clinicInfo.phoneNumber || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Working Hours</label>
                                        <p className="text-gray-900">{clinicInfo.workingHours || 'Not provided'}</p>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <Link 
                                        to="/doctor/clinic-info" 
                                        className="text-Primary hover:underline text-sm"
                                    >
                                        Edit Clinic Information →
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DoctorProfile;

