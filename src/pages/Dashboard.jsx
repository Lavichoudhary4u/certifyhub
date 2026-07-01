import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import { Search, Plus, Eye, Ban, Download, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';

export default function Dashboard() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCertificates, setFilteredCertificates] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, 'certificates'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const certs = [];
      querySnapshot.forEach((doc) => {
        certs.push({
          id: doc.id,
          ...doc.data()
        });
      });
      setCertificates(certs);
      setFilteredCertificates(certs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  useEffect(() => {
    const filtered = certificates.filter(cert =>
      cert.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.certificateId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.company.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCertificates(filtered);
  }, [searchTerm, certificates]);

  const handleRevokeCertificate = async (certificateId) => {
    try {
      const certRef = doc(db, 'certificates', certificateId);
      await updateDoc(certRef, {
        status: 'revoked',
        revokedAt: new Date().toISOString(),
        revokedBy: currentUser.uid
      });
    } catch (error) {
      console.error('Error revoking certificate:', error);
    }
  };

  const handleRestoreCertificate = async (certificateId) => {
    try {
      const certRef = doc(db, 'certificates', certificateId);
      await updateDoc(certRef, {
        status: 'valid',
        revokedAt: null,
        revokedBy: null
      });
    } catch (error) {
      console.error('Error restoring certificate:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <div className="bg-blue-600 rounded-full p-3">
            <User className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-blue-800">NINJA DELIVERIES</h1>
            <p className="text-blue-600">Internship Certificate Dashboard</p>
          </div>
        </div>
        <p className="text-gray-600">Manage and monitor all issued internship certificates</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <User className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Internship Certificates
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {certificates.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Valid Internship Certificates
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {certificates.filter(cert => cert.status === 'valid').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Ban className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Revoked Internship Certificates
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {certificates.filter(cert => cert.status === 'revoked').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Plus className="h-6 w-6 text-indigo-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    This Month
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {certificates.filter(cert => {
                      const certDate = new Date(cert.createdAt);
                      const currentDate = new Date();
                      return certDate.getMonth() === currentDate.getMonth() &&
                             certDate.getFullYear() === currentDate.getFullYear();
                    }).length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Create Button */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Search internship certificates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <Link
          to="/create-certificate"
          className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Internship Certificate
        </Link>
      </div>

      {/* Certificates Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredCertificates.length === 0 ? (
            <li className="px-6 py-8 text-center text-gray-500">
              {certificates.length === 0 ? 'No internship certificates issued yet' : 'No certificates match your search'}
            </li>
          ) : (
            filteredCertificates.map((certificate) => (
              <li key={certificate.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {certificate.candidateName}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {certificate.role} Internship at NINJA DELIVERIES
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          certificate.status === 'valid'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {certificate.status === 'valid' ? 'Valid' : 'Revoked'}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4" />
                      <span>
                        Issued: {format(new Date(certificate.issueDate), 'MMM dd, yyyy')}
                      </span>
                      <span className="mx-2">•</span>
                      <span>Period: from {certificate.internshipPeriod || 'N/A'}</span>
                      <span className="mx-2">•</span>
                      <span>ID: {certificate.certificateId}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Link
                      to={`/certificate/${certificate.certificateId}`}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Link>
                    {certificate.status === 'valid' ? (
                      <button
                        onClick={() => handleRevokeCertificate(certificate.id)}
                        className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <Ban className="h-4 w-4 mr-1" />
                        Revoke
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRestoreCertificate(certificate.id)}
                        className="inline-flex items-center px-3 py-2 border border-green-300 shadow-sm text-sm leading-4 font-medium rounded-md text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Restore
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}