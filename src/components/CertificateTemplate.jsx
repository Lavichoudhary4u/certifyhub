import React from 'react';
import { formatDate } from '../utils/certificateUtils';
import ninjaLogo from '../source/logo.JPG';
import ninjaSign from '../source/sign.JPG';

export default function CertificateTemplate({ certificate, showQR = true }) {
  return (
    <div 
      className="bg-white mx-auto relative overflow-hidden" 
      id="certificate-template" 
      style={{
        width: '842px', 
        height: '595px', 
        border: '12px solid #1e40af',
        borderRadius: '8px',
        fontFamily: 'Times New Roman, serif',
        lineHeight: '1.4',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale'
      }}
    >
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 border-4 border-blue-300 rounded-full"></div>
        <div className="absolute top-20 right-20 w-24 h-24 border-4 border-blue-300 rounded-full"></div>
        <div className="absolute bottom-20 left-20 w-20 h-20 border-4 border-blue-300 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-28 h-28 border-4 border-blue-300 rounded-full"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col" style={{ padding: '24px 32px' }}>
        
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <img 
            src={ninjaLogo} 
            alt="Ninja Deliveries Logo" 
            className="w-24 h-24 object-contain"
            style={{ width: '96px', height: '96px' }}
          />
          <div className="text-center flex-1">
            <h1 
              className="font-bold text-blue-800 mb-1"
              style={{ 
                fontSize: '32px',
                fontFamily: 'Times New Roman, serif',
                color: '#1e40af',
                letterSpacing: '2px'
              }}
            >
              NINJA DELIVERIES
            </h1>
            <div 
              className="mx-auto bg-blue-800"
              style={{ width: '200px', height: '2px' }}
            ></div>
          </div>
          {showQR && (
            <img 
              src={certificate.qrCode} 
              alt="QR Code for verification" 
              className="w-24 h-24"
              style={{ width: '96px', height: '96px' }}
            />
          )}
        </div>

        {/* Certificate Title */}
        <div className="text-center mb-3">
          <h2 
            className="font-bold text-gray-800 mb-2"
            style={{ 
              fontSize: '22px',
              fontFamily: 'Times New Roman, serif',
              color: '#374151',
              letterSpacing: '1px'
            }}
          >
            CERTIFICATE OF INTERNSHIP
          </h2>
          <div 
            className="mx-auto bg-gray-600"
            style={{ width: '280px', height: '2px' }}
          ></div>
        </div>

        {/* Main Content - Compact spacing */}
        <div className="text-center space-y-2" style={{ flex: '1', paddingBottom: '16px' }}>
          
          <p 
            className="text-gray-700 italic"
            style={{ 
              fontSize: '15px',
              fontFamily: 'Times New Roman, serif',
              color: '#4b5563'
            }}
          >
            This is to certify that
          </p>
          
          <div className="relative">
            <h3 
              className="font-bold text-blue-900 pb-2"
              style={{ 
                fontSize: '34px',
                fontFamily: 'Times New Roman, serif',
                color: '#1e3a8a',
                borderBottom: '3px solid #3b82f6',
                display: 'inline-block',
                paddingLeft: '20px',
                paddingRight: '20px'
              }}
            >
              {certificate.candidateName}
            </h3>
          </div>
          
          <div className="space-y-1" style={{ marginTop: '12px', lineHeight: '1.5' }}>
            <p 
              className="text-gray-800"
              style={{ 
                fontSize: '17px',
                fontFamily: 'Times New Roman, serif',
                color: '#1f2937',
                lineHeight: '1.6',
                margin: '8px 0'
              }}
            >
              has successfully completed the internship at
            </p>
            <p 
              className="font-bold text-blue-800"
              style={{ 
                fontSize: '22px',
                fontFamily: 'Times New Roman, serif',
                color: '#1e40af',
                fontWeight: 'bold',
                lineHeight: '1.4',
                margin: '8px 0'
              }}
            >
              Ninja Deliveries
            </p>
            <p 
              className="text-gray-800"
              style={{ 
                fontSize: '17px',
                fontFamily: 'Times New Roman, serif',
                color: '#1f2937',
                lineHeight: '1.6',
                margin: '8px 0'
              }}
            >
              from{' '}
              <span 
                className="font-bold"
                style={{ 
                  fontWeight: 'bold',
                  textDecoration: 'underline',
                  textDecorationThickness: '2px',
                  textUnderlineOffset: '4px'
                }}
              >
                {certificate.internshipPeriod}
              </span>
            </p>
          </div>

          {/* Appreciation Text - Compact */}
          <div 
            className="mt-2 px-4"
            style={{ marginTop: '10px' }}
          >
            <p 
              className="text-gray-700 italic max-w-3xl mx-auto"
              style={{ 
                fontSize: '13px',
                fontFamily: 'Times New Roman, serif',
                color: '#4b5563',
                fontStyle: 'italic',
                lineHeight: '1.4',
                textAlign: 'center',
                margin: '12px 0'
              }}
            >
              During this period, the candidate has demonstrated dedication, enthusiasm, and a strong willingness to learn. 
              We appreciate the contributions and wish all the best for future endeavors.
            </p>
          </div>

        </div>

        {/* Bottom Section - Fixed at bottom with absolute positioning */}
        <div className="mt-auto">
          
          {/* Main bottom content */}
          <div className="flex justify-between items-end mb-2">
            
            {/* Left side - Certificate Info */}
            <div className="text-left">
              <p 
                className="text-gray-600"
                style={{ 
                  fontSize: '11px',
                  fontFamily: 'Times New Roman, serif',
                  color: '#6b7280',
                  marginBottom: '2px'
                }}
              >
                Issue Date:{' '}
                <span 
                  className="font-semibold text-gray-800"
                  style={{ fontWeight: '600', color: '#374151' }}
                >
                  {formatDate(certificate.issueDate)}
                </span>
              </p>
              <p 
                className="text-gray-500"
                style={{ 
                  fontSize: '9px',
                  fontFamily: 'Times New Roman, serif',
                  color: '#9ca3af'
                }}
              >
                Certificate ID: {certificate.certificateId}
              </p>
            </div>

            {/* Right side - Signature */}
            <div className="text-center">
              <img 
                src={ninjaSign} 
                alt="Signature" 
                className="mx-auto"
                style={{ height: '50px', width: 'auto', marginBottom: '2px' }}
              />
              <div 
                className="mx-auto bg-gray-800"
                style={{ width: '140px', height: '1px', marginBottom: '2px' }}
              ></div>
              <p 
                className="font-bold text-gray-800"
                style={{ 
                  fontSize: '12px',
                  fontFamily: 'Times New Roman, serif',
                  color: '#374151',
                  fontWeight: 'bold',
                  marginBottom: '1px'
                }}
              >
                ABHAY KUMAR
              </p>
              <p 
                className="text-gray-600"
                style={{ 
                  fontSize: '10px',
                  fontFamily: 'Times New Roman, serif',
                  color: '#6b7280'
                }}
              >
                Founder & Director
              </p>
            </div>
            
          </div>
          
        </div>

      </div>

    </div>
  );
}