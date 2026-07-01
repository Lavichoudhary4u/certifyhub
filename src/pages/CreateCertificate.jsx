import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import { generateCertificateId, generateQRCode, validateDates } from '../utils/certificateUtils';
import { Calendar, User, Award, Save, Building } from 'lucide-react';

export default function CreateCertificate() {
  const [formData, setFormData] = useState({
    candidateName: '',
    role: '',
    startDate: '',
    endDate: '',
    issueDate: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Basic validation
      if (!formData.candidateName.trim() || !formData.role.trim() || !formData.startDate || !formData.endDate) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      // Generate the internship period text from dates
      const startMonth = new Date(formData.startDate).toLocaleDateString('en-US', { month: 'long' });
      const endMonth = new Date(formData.endDate).toLocaleDateString('en-US', { month: 'long' });
      const internshipPeriod = `${startMonth} to ${endMonth}`;

      // Generate certificate ID and QR code
      const certificateId = generateCertificateId();
      const { qrCodeDataURL, verificationUrl } = await generateQRCode(certificateId);

      // Prepare certificate data
      const certificateData = {
        certificateId,
        candidateName: formData.candidateName.trim(),
        role: formData.role.trim(),
        company: 'NINJA DELIVERIES', // Always Ninja Deliveries
        startDate: formData.startDate, // Store in database but don't show on certificate
        endDate: formData.endDate, // Store in database but don't show on certificate
        internshipPeriod, // This will be "January to May" format for display
        issueDate: formData.issueDate,
        qrCode: qrCodeDataURL,
        verificationUrl,
        status: 'valid',
        createdAt: new Date().toISOString(),
        createdBy: currentUser.uid,
        createdByEmail: currentUser.email
      };

      // Save to Firestore
      const docRef = await addDoc(collection(db, 'certificates'), certificateData);
      
      // Navigate to certificate preview
      navigate(`/certificate/${certificateId}`);
    } catch (error) {
      console.error('Error creating certificate:', error);
      setError('Failed to create certificate. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-xl rounded-lg border border-blue-200">
        <div className="px-6 py-4 border-b border-blue-200 bg-blue-50">
          <div className="flex items-center">
            <Building className="h-6 w-6 text-blue-600 mr-3" />
            <div>
              <h1 className="text-xl font-semibold text-blue-900">Create Internship Certificate</h1>
              <p className="text-sm text-blue-700">NINJA DELIVERIES - Internship Program</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="rounded-md bg-red-50 border border-red-200 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          {/* Intern Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Intern Information
            </h3>
            
            <div>
              <label htmlFor="candidateName" className="block text-sm font-medium text-gray-700">
                Intern Name *
              </label>
              <input
                type="text"
                id="candidateName"
                name="candidateName"
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter intern's full name"
                value={formData.candidateName}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Internship Role/Department *
              </label>
              <input
                type="text"
                id="role"
                name="role"
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., Software Development, Marketing, Operations"
                value={formData.role}
                onChange={handleInputChange}
              />
              <p className="mt-1 text-xs text-gray-500">
                This information is stored for record keeping but won't appear on the certificate
              </p>
            </div>

            <div>
              <label htmlFor="internshipPeriod" className="block text-sm font-medium text-gray-700">
                Internship Duration *
              </label>
              <div className="grid grid-cols-2 gap-4 mt-1">
                <div>
                  <label htmlFor="startDate" className="block text-xs font-medium text-gray-500 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    required
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={formData.startDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="endDate" className="block text-xs font-medium text-gray-500 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    required
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={formData.endDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Certificate will show: "from [Start Month] to [End Month]"
                {formData.startDate && formData.endDate && (
                  <span className="ml-2 text-blue-600 font-medium">
                    Preview: "from {new Date(formData.startDate).toLocaleDateString('en-US', { month: 'long' })} to {new Date(formData.endDate).toLocaleDateString('en-US', { month: 'long' })}"
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Company Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Building className="h-5 w-5 mr-2" />
              Organization Details
            </h3>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-3">
                <Building className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-lg font-semibold text-blue-900">NINJA DELIVERIES</p>
                  <p className="text-sm text-blue-700">Certificate will be issued by Ninja Deliveries</p>
                </div>
              </div>
            </div>
          </div>

          {/* Certificate Date */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Certificate Issue Date
            </h3>
            
            <div>
              <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700">
                Issue Date *
              </label>
              <input
                type="date"
                id="issueDate"
                name="issueDate"
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={formData.issueDate}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Creating Certificate...' : 'Create Certificate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}