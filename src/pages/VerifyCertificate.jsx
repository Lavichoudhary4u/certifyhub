import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { CheckCircle, XCircle, Award, Calendar, Building, User, AlertTriangle } from 'lucide-react';
import { formatDate } from '../utils/certificateUtils';

export default function VerifyCertificate() {
  const { certificateId } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const certificatesRef = collection(db, 'certificates');
        const q = query(certificatesRef, where('certificateId', '==', certificateId));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          setCertificate({
            id: doc.id,
            ...doc.data()
          });
        } else {
          setError('Certificate not found');
        }
      } catch (error) {
        console.error('Error fetching certificate:', error);
        setError('Error loading certificate');
      }
      setLoading(false);
    };

    if (certificateId) {
      fetchCertificate();
    }
  }, [certificateId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying certificate...</p>
        </div>
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Certificate</h1>
          <p className="text-gray-600 mb-6">
            The certificate with ID <span className="font-mono font-semibold">{certificateId}</span> could not be found or is invalid.
          </p>
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 mr-3" />
              <div className="text-sm text-red-700">
                This certificate may have been revoked, expired, or never existed. Please contact the issuing organization for verification.
              </div>
            </div>
          </div>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Award className="h-4 w-4 mr-2" />
            Visit CertifyHub
          </Link>
        </div>
      </div>
    );
  }

  const isValid = certificate.status === 'valid';

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 rounded-full p-3">
              <Award className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-blue-800">NINJA DELIVERIES</h1>
          <p className="text-blue-600">Internship Certificate Verification System</p>
        </div>

        {/* Verification Result */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Status Header */}
          <div className={`px-6 py-4 ${
            isValid 
              ? 'bg-green-50 border-b border-green-200' 
              : 'bg-red-50 border-b border-red-200'
          }`}>
            <div className="flex items-center">
              {isValid ? (
                <>
                  <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
                  <div>
                    <h2 className="text-xl font-semibold text-green-800">Certificate Verified</h2>
                    <p className="text-green-600">This is a valid internship certificate</p>
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="h-8 w-8 text-red-500 mr-3" />
                  <div>
                    <h2 className="text-xl font-semibold text-red-800">Certificate Revoked</h2>
                    <p className="text-red-600">This internship certificate has been revoked</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Certificate Details */}
          <div className="px-6 py-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Certificate Details</h3>
            
            {/* Candidate Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <User className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Candidate Name</p>
                    <p className="text-lg font-semibold text-gray-900">{certificate.candidateName}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Award className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Internship Role</p>
                    <p className="text-lg font-semibold text-gray-900">{certificate.role} Internship</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Building className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Organization</p>
                    <p className="text-lg font-semibold text-blue-800">NINJA DELIVERIES</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-blue-500 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Issue Date</p>
                    <p className="text-lg font-semibold text-gray-900">{formatDate(certificate.issueDate)}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-green-500 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Internship Period</p>
                    <p className="text-lg font-semibold text-gray-900">from {certificate.internshipPeriod || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Certificate ID */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm font-medium text-gray-500 mb-1">Certificate ID</p>
              <p className="text-lg font-mono font-semibold text-gray-900">{certificate.certificateId}</p>
            </div>

            {/* Status Information */}
            <div className={`rounded-lg p-4 ${
              isValid 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Current Status</p>
                  <p className={`text-lg font-semibold ${
                    isValid ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {isValid ? 'Valid' : 'Revoked'}
                  </p>
                </div>
                
                {certificate.status === 'revoked' && certificate.revokedAt && (
                  <div className="text-right">
                    <p className="text-sm text-red-600">
                      Revoked on {formatDate(certificate.revokedAt)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Verified by</p>
                <p className="font-semibold text-blue-800">NINJA DELIVERIES</p>
                <p className="text-xs text-blue-600">Internship Certificate Management</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">
                  Verification performed on {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-4">
            This verification was performed using Ninja Deliveries' secure certificate verification system.
          </p>
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-500 text-sm font-medium"
          >
            <Award className="h-4 w-4 mr-2" />
            Learn more about Ninja Deliveries
          </Link>
        </div>
      </div>
    </div>
  );
}