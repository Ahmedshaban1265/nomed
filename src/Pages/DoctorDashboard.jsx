import React from 'react';
import { useAuth } from '../Auth/AuthProvider';
import { Link } from 'react-router-dom';

const DoctorDashboard = () => {
    const { user, logOut, isDoctor } = useAuth();

    // Ensure the user is a doctor
    if (!isDoctor()) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
                    <p className="text-gray-600 mb-4">This page is for doctors only.</p>
                    <Link to="/" className="bg-Primary text-white px-4 py-2 rounded-lg">
                        Back to Home
                    </Link>
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
                            <h1 className="text-2xl font-bold text-gray-900">
                                Welcome Dr. {user?.firstName} {user?.lastName}
                            </h1>
                            <p className="text-gray-600">Doctor Dashboard</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link 
                                to="/doctor/profile" 
                                className="bg-Primary text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                            >
                                Profile
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
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    
                    {/* Quick Stats */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Appointments Today</h3>
                        <p className="text-3xl font-bold text-Primary">5</p>
                        <p className="text-sm text-gray-600">scheduled appointments</p>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">New Patients</h3>
                        <p className="text-3xl font-bold text-green-600">3</p>
                        <p className="text-sm text-gray-600">this week</p>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Patients</h3>
                        <p className="text-3xl font-bold text-blue-600">127</p>
                        <p className="text-sm text-gray-600">registered patients</p>
                    </div>

                    {/* Upcoming Appointments */}
                    <div className="bg-white rounded-lg shadow p-6 md:col-span-2">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Appointments</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium">Ahmed Mohamed</p>
                                    <p className="text-sm text-gray-600">10:00 AM - Routine Checkup</p>
                                </div>
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                                    Confirmed
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium">Fatima Ali</p>
                                    <p className="text-sm text-gray-600">11:30 AM - Consultation</p>
                                </div>
                                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                                    Pending
                                </span>
                            </div>
                        </div>
                        <div className="mt-4">
                            <Link 
                                to="/doctor/appointments" 
                                className="text-Primary hover:underline text-sm"
                            >
                                View All Appointments →
                            </Link>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <Link 
                                to="/doctor/appointments/new" 
                                className="block w-full bg-Primary text-white text-center py-2 rounded-lg hover:bg-blue-700"
                            >
                                Add New Appointment
                            </Link>
                            <Link 
                                to="/doctor/patients" 
                                className="block w-full bg-gray-200 text-gray-800 text-center py-2 rounded-lg hover:bg-gray-300"
                            >
                                View Patients
                            </Link>
                            <Link 
                                to="/doctor/schedule" 
                                className="block w-full bg-gray-200 text-gray-800 text-center py-2 rounded-lg hover:bg-gray-300"
                            >
                                Manage Schedule
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DoctorDashboard;

