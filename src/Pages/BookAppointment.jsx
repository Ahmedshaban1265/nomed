import React, { useState, useEffect } from 'react';
import { useAuth } from '../Auth/AuthProvider';
import { Link } from 'react-router-dom';

const BookAppointment = () => {
    const { user, getToken } = useAuth();
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [appointmentData, setAppointmentData] = useState({
        doctorId: '',
        appointmentDate: '',
        appointmentTime: '',
        reason: '',
        notes: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSpecialization, setFilterSpecialization] = useState('');

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const token = getToken();
            const response = await fetch('https://medscanapi.runasp.net/api/Doctor/all', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setDoctors(data.data || []);
                }
            }
        } catch (error) {
            console.error('Error fetching doctors:', error);
            setMessage('Error loading doctors');
            setMessageType('error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setAppointmentData({
            ...appointmentData,
            [e.target.name]: e.target.value
        });
    };

    const handleDoctorSelect = (doctor) => {
        setSelectedDoctor(doctor);
        setAppointmentData({
            ...appointmentData,
            doctorId: doctor.id
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const token = getToken();
            const response = await fetch('https://medscanapi.runasp.net/api/Appointment', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    doctorId: appointmentData.doctorId,
                    appointmentDate: appointmentData.appointmentDate,
                    appointmentTime: appointmentData.appointmentTime,
                    reason: appointmentData.reason,
                    notes: appointmentData.notes
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setMessage('Appointment booked successfully!');
                setMessageType('success');
                // Reset form
                setAppointmentData({
                    doctorId: '',
                    appointmentDate: '',
                    appointmentTime: '',
                    reason: '',
                    notes: ''
                });
                setSelectedDoctor(null);
            } else {
                setMessage(data.message || 'Failed to book appointment');
                setMessageType('error');
            }
        } catch (error) {
            console.error('Error booking appointment:', error);
            setMessage('Error booking appointment');
            setMessageType('error');
        } finally {
            setIsSubmitting(false);
            setTimeout(() => setMessage(''), 5000);
        }
    };

    // Filter doctors based on search term and specialization
    const filteredDoctors = doctors.filter(doctor => {
        const matchesSearch = doctor.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            doctor.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSpecialization = !filterSpecialization || doctor.specialization === filterSpecialization;
        return matchesSearch && matchesSpecialization;
    });

    // Get unique specializations for filter
    const specializations = [...new Set(doctors.map(doctor => doctor.specialization).filter(Boolean))];

    // Generate time slots
    const timeSlots = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
        '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'
    ];

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-Primary mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading doctors...</p>
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
                            <h1 className="text-2xl font-bold text-gray-900">Book Appointment</h1>
                            <p className="text-gray-600">Find and book an appointment with a doctor</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link 
                                to="/patient-profile" 
                                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
                            >
                                Back to Profile
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {message && (
                    <div className={`mb-6 p-4 rounded-lg ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Doctors List */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Doctors</h3>
                            
                            {/* Search and Filter */}
                            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <input 
                                        type="text"
                                        placeholder="Search doctors by name or specialization..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-Primary"
                                    />
                                </div>
                                <div>
                                    <select 
                                        value={filterSpecialization}
                                        onChange={(e) => setFilterSpecialization(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-Primary"
                                    >
                                        <option value="">All Specializations</option>
                                        {specializations.map(spec => (
                                            <option key={spec} value={spec}>{spec}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Doctors Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {filteredDoctors.map(doctor => (
                                    <div 
                                        key={doctor.id} 
                                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                                            selectedDoctor?.id === doctor.id 
                                                ? 'border-Primary bg-blue-50' 
                                                : 'border-gray-200 hover:border-Primary hover:bg-gray-50'
                                        }`}
                                        onClick={() => handleDoctorSelect(doctor)}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 rounded-full bg-Primary flex items-center justify-center text-white font-bold">
                                                {doctor.firstName?.charAt(0)}{doctor.lastName?.charAt(0)}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-900">
                                                    Dr. {doctor.firstName} {doctor.lastName}
                                                </h4>
                                                <p className="text-sm text-Primary">{doctor.specialization}</p>
                                                <p className="text-xs text-gray-600">{doctor.email}</p>
                                            </div>
                                        </div>
                                        {doctor.bio && (
                                            <p className="mt-2 text-sm text-gray-600 line-clamp-2">{doctor.bio}</p>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {filteredDoctors.length === 0 && (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">No doctors found matching your criteria.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Appointment Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow p-6 sticky top-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment Details</h3>
                            
                            {selectedDoctor ? (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Selected Doctor */}
                                    <div className="p-3 bg-blue-50 rounded-lg">
                                        <p className="font-medium text-gray-900">
                                            Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}
                                        </p>
                                        <p className="text-sm text-Primary">{selectedDoctor.specialization}</p>
                                    </div>

                                    {/* Date */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Appointment Date
                                        </label>
                                        <input 
                                            type="date"
                                            name="appointmentDate"
                                            value={appointmentData.appointmentDate}
                                            onChange={handleInputChange}
                                            min={new Date().toISOString().split('T')[0]}
                                            required
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-Primary"
                                        />
                                    </div>

                                    {/* Time */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Appointment Time
                                        </label>
                                        <select 
                                            name="appointmentTime"
                                            value={appointmentData.appointmentTime}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-Primary"
                                        >
                                            <option value="">Select Time</option>
                                            {timeSlots.map(time => (
                                                <option key={time} value={time}>{time}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Reason */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Reason for Visit
                                        </label>
                                        <input 
                                            type="text"
                                            name="reason"
                                            value={appointmentData.reason}
                                            onChange={handleInputChange}
                                            placeholder="e.g., Regular checkup, Follow-up..."
                                            required
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-Primary"
                                        />
                                    </div>

                                    {/* Notes */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Additional Notes (Optional)
                                        </label>
                                        <textarea 
                                            name="notes"
                                            value={appointmentData.notes}
                                            onChange={handleInputChange}
                                            rows={3}
                                            placeholder="Any additional information..."
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-Primary"
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <button 
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-Primary text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? 'Booking...' : 'Book Appointment'}
                                    </button>
                                </form>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-500 mb-4">Please select a doctor to book an appointment</p>
                                    <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default BookAppointment;

