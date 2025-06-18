import React, { useState, useEffect } from 'react';
import { useAuth } from '../Auth/AuthProvider';
import { Link, useNavigate } from 'react-router-dom';

const ClinicInfo = () => {
    const { user, getToken } = useAuth();
    const navigate = useNavigate();
    const [clinicData, setClinicData] = useState({
        name: '',
        address: '',
        phoneNumber: '',
        email: '',
        workingHours: '',
        description: '',
        services: '',
        website: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [hasExistingInfo, setHasExistingInfo] = useState(false);

    useEffect(() => {
        fetchClinicInfo();
    }, []);

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
                if (data.success && data.data) {
                    setClinicData(data.data);
                    setHasExistingInfo(true);
                }
            }
        } catch (error) {
            console.error('Error fetching clinic info:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setClinicData({
            ...clinicData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const token = getToken();
            const url = hasExistingInfo 
                ? 'https://medscanapi.runasp.net/api/ClinicInfo/update'
                : 'https://medscanapi.runasp.net/api/ClinicInfo/create';
            
            const method = hasExistingInfo ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(clinicData)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setMessage(`Clinic information ${hasExistingInfo ? 'updated' : 'created'} successfully!`);
                setMessageType('success');
                setHasExistingInfo(true);
                
                setTimeout(() => {
                    navigate('/doctor-dashboard');
                }, 2000);
            } else {
                setMessage(data.message || `Failed to ${hasExistingInfo ? 'update' : 'create'} clinic information`);
                setMessageType('error');
            }
        } catch (error) {
            console.error('Error saving clinic info:', error);
            setMessage('Error saving clinic information');
            setMessageType('error');
        } finally {
            setIsSubmitting(false);
            setTimeout(() => setMessage(''), 5000);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-Primary mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading clinic information...</p>
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
                            <h1 className="text-2xl font-bold text-gray-900">Clinic Information</h1>
                            <p className="text-gray-600">Manage your clinic details and information</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link 
                                to="/doctor-dashboard" 
                                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
                            >
                                Back to Dashboard
                            </Link>
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

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">
                            {hasExistingInfo ? 'Update Clinic Information' : 'Add Clinic Information'}
                        </h2>
                        <p className="text-gray-600 mt-1">
                            This information will be visible to patients when they book appointments
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Clinic Name */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Clinic Name *
                                </label>
                                <input 
                                    type="text"
                                    name="name"
                                    value={clinicData.name}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="e.g., City Medical Center"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-Primary"
                                />
                            </div>

                            {/* Address */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Address *
                                </label>
                                <textarea 
                                    name="address"
                                    value={clinicData.address}
                                    onChange={handleInputChange}
                                    required
                                    rows={3}
                                    placeholder="Full clinic address including street, city, and postal code"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-Primary"
                                />
                            </div>

                            {/* Phone Number */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number *
                                </label>
                                <input 
                                    type="tel"
                                    name="phoneNumber"
                                    value={clinicData.phoneNumber}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="e.g., +1 (555) 123-4567"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-Primary"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <input 
                                    type="email"
                                    name="email"
                                    value={clinicData.email}
                                    onChange={handleInputChange}
                                    placeholder="clinic@example.com"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-Primary"
                                />
                            </div>

                            {/* Working Hours */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Working Hours *
                                </label>
                                <input 
                                    type="text"
                                    name="workingHours"
                                    value={clinicData.workingHours}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="e.g., Mon-Fri: 9:00 AM - 6:00 PM, Sat: 9:00 AM - 2:00 PM"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-Primary"
                                />
                            </div>

                            {/* Website */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Website
                                </label>
                                <input 
                                    type="url"
                                    name="website"
                                    value={clinicData.website}
                                    onChange={handleInputChange}
                                    placeholder="https://www.yourclinic.com"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-Primary"
                                />
                            </div>

                            {/* Services */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Services Offered
                                </label>
                                <textarea 
                                    name="services"
                                    value={clinicData.services}
                                    onChange={handleInputChange}
                                    rows={3}
                                    placeholder="List the main services offered at your clinic (e.g., General consultation, Diagnostic tests, Emergency care...)"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-Primary"
                                />
                            </div>

                            {/* Description */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Clinic Description
                                </label>
                                <textarea 
                                    name="description"
                                    value={clinicData.description}
                                    onChange={handleInputChange}
                                    rows={4}
                                    placeholder="Provide a brief description of your clinic, its mission, and what makes it special..."
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-Primary"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end space-x-4">
                            <Link 
                                to="/doctor-dashboard"
                                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
                            >
                                Cancel
                            </Link>
                            <button 
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-Primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Saving...' : (hasExistingInfo ? 'Update Information' : 'Save Information')}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default ClinicInfo;

