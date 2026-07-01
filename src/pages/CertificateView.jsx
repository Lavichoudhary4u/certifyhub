import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import CertificateTemplate from '../components/CertificateTemplate';
import { Download, Share, ArrowLeft, Eye } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function CertificateView() {
  const { certificateId } = useParams();
  const navigate = useNavigate();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        // First try to find by certificateId field
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

  const downloadPDF = async () => {
    setDownloading(true);
    try {
      const element = document.getElementById('certificate-template');
      
      // Ensure element is visible and styled properly
      element.style.transform = 'scale(1)';
      element.style.transformOrigin = 'top left';
      element.style.position = 'relative';
      element.style.zIndex = '1000';
      
      // Wait longer for fonts and images to load properly
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Configure html2canvas to preserve exact layout
      const canvas = await html2canvas(element, {
        scale: 2, // Reduced scale for better performance while maintaining quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: element.offsetWidth,
        height: element.offsetHeight,
        scrollX: 0,
        scrollY: 0,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        letterRendering: true, // Better text rendering
        logging: false,
        onclone: (clonedDoc) => {
          // Ensure all styles and spacing are preserved in the clone
          const clonedElement = clonedDoc.getElementById('certificate-template');
          if (clonedElement) {
            clonedElement.style.width = element.offsetWidth + 'px';
            clonedElement.style.height = element.offsetHeight + 'px';
            clonedElement.style.transform = 'none';
            clonedElement.style.position = 'relative';
            clonedElement.style.left = '0';
            clonedElement.style.top = '0';
            clonedElement.style.margin = '0';
            clonedElement.style.padding = element.style.padding;
            clonedElement.style.fontFamily = 'Times New Roman, serif';
            
            // Preserve all spacing and line height styles
            const allElements = clonedElement.querySelectorAll('*');
            const originalElements = element.querySelectorAll('*');
            
            allElements.forEach((el, index) => {
              if (originalElements[index]) {
                const computedStyle = window.getComputedStyle(originalElements[index]);
                el.style.lineHeight = computedStyle.lineHeight;
                el.style.marginTop = computedStyle.marginTop;
                el.style.marginBottom = computedStyle.marginBottom;
                el.style.paddingTop = computedStyle.paddingTop;
                el.style.paddingBottom = computedStyle.paddingBottom;
                el.style.fontSize = computedStyle.fontSize;
                el.style.fontFamily = 'Times New Roman, serif';
              }
            });
          }
        }
      });
      
      // Create PDF with A4 landscape dimensions that match screen proportions
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
        compress: false // Don't compress to maintain quality
      });
      
      // A4 landscape dimensions in mm
      const pdfWidth = 297;
      const pdfHeight = 210;
      
      // Calculate scaling to fit exactly while maintaining aspect ratio
      const canvasAspectRatio = canvas.width / canvas.height;
      const pdfAspectRatio = pdfWidth / pdfHeight;
      
      let finalWidth, finalHeight;
      
      if (canvasAspectRatio > pdfAspectRatio) {
        // Canvas is wider relative to its height
        finalWidth = pdfWidth - 20; // 10mm margin on each side
        finalHeight = finalWidth / canvasAspectRatio;
      } else {
        // Canvas is taller relative to its width
        finalHeight = pdfHeight - 20; // 10mm margin on each side
        finalWidth = finalHeight * canvasAspectRatio;
      }
      
      // Center the certificate on the page
      const xOffset = (pdfWidth - finalWidth) / 2;
      const yOffset = (pdfHeight - finalHeight) / 2;
      
      // Convert canvas to high-quality image
      const imgData = canvas.toDataURL('image/png', 1.0); // PNG for better quality
      
      // Add image to PDF with exact dimensions
      pdf.addImage(imgData, 'PNG', xOffset, yOffset, finalWidth, finalHeight, undefined, 'FAST');
      
      // Save the PDF
      pdf.save(`certificate-${certificate.certificateId}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
    setDownloading(false);
  };

  const shareCertificate = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Certificate for ${certificate.candidateName}`,
          text: `Certificate of completion for ${certificate.candidateName} at ${certificate.company}`,
          url: certificate.verificationUrl
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(certificate.verificationUrl);
        alert('Verification URL copied to clipboard!');
      } catch (error) {
        console.error('Error copying to clipboard:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Certificate Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'The requested certificate could not be found.'}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </button>

        <div className="flex space-x-4">
          <button
            onClick={shareCertificate}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Share className="h-4 w-4 mr-2" />
            Share
          </button>
          <button
            onClick={downloadPDF}
            disabled={downloading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
          >
            <Download className="h-4 w-4 mr-2" />
            {downloading ? 'Generating...' : 'Download PDF'}
          </button>
        </div>
      </div>

      {/* Certificate */}
      <div className="bg-gray-50 p-8 rounded-lg">
        <CertificateTemplate certificate={certificate} showQR={true} />
      </div>

      {/* Certificate Info */}
      <div className="mt-8 bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Internship Certificate Information</h3>
        <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">Certificate ID</dt>
            <dd className="mt-1 text-sm text-gray-900 font-mono">{certificate.certificateId}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Status</dt>
            <dd className="mt-1">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                certificate.status === 'valid'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {certificate.status === 'valid' ? 'Valid' : 'Revoked'}
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Created By</dt>
            <dd className="mt-1 text-sm text-gray-900">{certificate.createdByEmail}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Created On</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {new Date(certificate.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Verification URL</dt>
            <dd className="mt-1 text-sm text-gray-900 break-all">
              <a 
                href={certificate.verificationUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-500"
              >
                {certificate.verificationUrl}
              </a>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}