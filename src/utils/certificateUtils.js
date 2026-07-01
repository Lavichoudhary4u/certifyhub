import QRCode from 'qrcode';

// Generate unique certificate ID
export const generateCertificateId = () => {
  const prefix = 'ND-INTERN';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

// Generate QR code for certificate verification
export const generateQRCode = async (certificateId) => {
  try {
    // Automatically detect production URL
    let baseUrl;
    
    // Check if we're in production (Vercel or other deployment)
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      // Production - use current domain
      baseUrl = window.location.origin;
    } else {
      // Development - use production Vercel URL
      baseUrl = 'https://certifyhub-tan.vercel.app';
    }
    
    const verificationUrl = `${baseUrl}/verify/${certificateId}`;
    
    const qrCodeDataURL = await QRCode.toDataURL(verificationUrl, {
      width: 200,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    return { qrCodeDataURL, verificationUrl };
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};

// Format date for display
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// No date validation restrictions - any dates are allowed
export const validateDates = (issueDate, internshipPeriod) => {
  // Always return valid - no restrictions on dates
  return { valid: true };
};