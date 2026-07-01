import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Shield, QrCode, Download, Users, CheckCircle, Building } from 'lucide-react';
import ninjaLogo from '../source/logo.JPG';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start mb-8">
                  <img src={ninjaLogo} alt="Ninja Deliveries" className="h-16 w-16 object-contain mr-4" />
                  <div>
                    <h2 className="text-3xl font-bold text-blue-800">NINJA DELIVERIES</h2>
                    <p className="text-lg text-blue-600">Internship Certificate Management</p>
                  </div>
                </div>
                
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Digital Internship</span>{' '}
                  <span className="block text-blue-600 xl:inline">Certificates</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Create, manage, and verify digital internship certificates for Ninja Deliveries. 
                  A secure platform to issue professional certificates with QR code verification and comprehensive management tools.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      to="/login"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                    >
                      <Building className="h-5 w-5 mr-2" />
                      Administrator Login
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link
                      to="/signup"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10"
                    >
                      Register as Admin
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Complete internship certificate management
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Ninja Deliveries provides a complete solution for digital internship certificate management with security and ease of use at its core.
            </p>
          </div>

          <div className="mt-10">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <Shield className="h-6 w-6" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Secure Authentication</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Firebase-powered authentication ensures only authorized Ninja Deliveries administrators can create and manage certificates.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <QrCode className="h-6 w-6" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">QR Code Verification</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Every certificate includes a unique QR code that links to a public verification page - no login required for verification.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <Download className="h-6 w-6" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">PDF Export</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Generate professional PDF certificates with embedded QR codes ready for printing and distribution to interns.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <Users className="h-6 w-6" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Internship Management</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Comprehensive dashboard to view, search, update, and revoke internship certificates with full audit trail.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Real-time Verification</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Instant certificate verification with current status including validity and revocation information.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <Award className="h-6 w-6" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Professional Templates</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Beautiful, professional certificate templates that maintain Ninja Deliveries branding and consistency.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* How it Works Section */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">How it Works</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Simple internship certificate workflow
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              <div className="text-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-md bg-blue-500 text-white mx-auto">
                  <span className="text-xl font-bold">1</span>
                </div>
                <h3 className="mt-6 text-lg leading-6 font-medium text-gray-900">Create Certificate</h3>
                <p className="mt-2 text-base text-gray-500">
                  Administrator logs in and creates an internship certificate by entering intern details, role, and internship period.
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-md bg-blue-500 text-white mx-auto">
                  <span className="text-xl font-bold">2</span>
                </div>
                <h3 className="mt-6 text-lg leading-6 font-medium text-gray-900">Generate & Download</h3>
                <p className="mt-2 text-base text-gray-500">
                  System automatically generates unique certificate ID, QR code, and professional PDF with Ninja Deliveries branding.
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-md bg-blue-500 text-white mx-auto">
                  <span className="text-xl font-bold">3</span>
                </div>
                <h3 className="mt-6 text-lg leading-6 font-medium text-gray-900">Verify Certificate</h3>
                <p className="mt-2 text-base text-gray-500">
                  Anyone can scan the QR code to instantly verify the internship certificate's authenticity and current status.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block">Create your first internship certificate today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-blue-200">
            Join Ninja Deliveries in providing professional internship certificates for all our interns.
          </p>
          <Link
            to="/signup"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 sm:w-auto"
          >
            <Building className="h-5 w-5 mr-2" />
            Get Started Now
          </Link>
        </div>
      </div>
    </div>
  );
}