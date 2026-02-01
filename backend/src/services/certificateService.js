const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const { supabaseAdmin } = require('../utils/supabase');

class CertificateService {
  constructor() {
    // No canvas initialization needed
  }

  // Generate QR code for certificate verification
  async generateQRCode(certificateId, registrationId) {
    const verificationUrl = `${process.env.FRONTEND_URL || 'https://your-app.com'}/verify-certificate/${certificateId}`;
    const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
      width: 150,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    return qrCodeDataUrl;
  }

  // Create certificate HTML
  async createCertificate(registration, event, user) {
    // Generate certificate ID and QR code
    const certificateId = uuidv4();
    const qrCodeDataUrl = await this.generateQRCode(certificateId, registration.id);

    // Format dates
    const eventDate = new Date(event.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const registrationDate = new Date(registration.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Generate HTML certificate
    const certificateHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Certificate of Registration</title>
    <style>
        body {
            margin: 0;
            padding: 40px;
            font-family: 'Arial', sans-serif;
            background: linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 50%, #1A1A1A 100%);
            color: white;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .certificate {
            width: 800px;
            height: 600px;
            border: 8px solid #4A90E2;
            border-radius: 20px;
            padding: 40px;
            position: relative;
            background: linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 50%, #1A1A1A 100%);
            box-shadow: 0 20px 40px rgba(0,0,0,0.5);
        }
        .inner-border {
            border: 2px solid #FFFFFF;
            border-radius: 15px;
            padding: 30px;
            height: calc(100% - 60px);
            position: relative;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .title {
            font-size: 36px;
            font-weight: bold;
            color: #FFFFFF;
            margin-bottom: 10px;
            letter-spacing: 2px;
        }
        .subtitle {
            font-size: 18px;
            color: #B0B0B0;
            margin-bottom: 20px;
        }
        .divider {
            width: 300px;
            height: 3px;
            background: #4A90E2;
            margin: 0 auto 30px;
        }
        .event-title {
            font-size: 28px;
            font-weight: bold;
            color: #4A90E2;
            text-align: center;
            margin-bottom: 20px;
        }
        .certify-text {
            font-size: 18px;
            text-align: center;
            margin-bottom: 15px;
            color: #FFFFFF;
        }
        .participant-name {
            font-size: 32px;
            font-weight: bold;
            color: #4A90E2;
            text-align: center;
            margin: 20px 0;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .event-details {
            text-align: center;
            margin: 30px 0;
            line-height: 1.8;
        }
        .detail-item {
            font-size: 16px;
            color: #B0B0B0;
            margin: 8px 0;
        }
        .qr-section {
            position: absolute;
            bottom: 20px;
            right: 20px;
            text-align: center;
        }
        .qr-code {
            width: 100px;
            height: 100px;
            border: 2px solid #4A90E2;
            border-radius: 8px;
        }
        .qr-label {
            font-size: 12px;
            color: #FFFFFF;
            margin-top: 5px;
        }
        .footer {
            position: absolute;
            bottom: 20px;
            left: 20px;
            font-size: 14px;
            color: #B0B0B0;
        }
        .organization {
            position: absolute;
            bottom: 60px;
            right: 20px;
            font-size: 18px;
            font-weight: bold;
            color: #4A90E2;
        }
        .certificate-id {
            position: absolute;
            bottom: 40px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 12px;
            color: #808080;
        }
    </style>
</head>
<body>
    <div class="certificate">
        <div class="inner-border">
            <div class="header">
                <div class="title">CERTIFICATE OF REGISTRATION</div>
                <div class="divider"></div>
            </div>
            
            <div class="event-title">${event.title}</div>
            
            <div class="certify-text">This is to certify that</div>
            
            <div class="participant-name">${user.name}</div>
            
            <div class="certify-text">has successfully registered for the above event</div>
            
            <div class="event-details">
                <div class="detail-item"><strong>Date:</strong> ${eventDate}</div>
                <div class="detail-item"><strong>Venue:</strong> ${event.venue}</div>
                ${event.club && event.club.name ? `<div class="detail-item"><strong>Organized by:</strong> ${event.club.name}</div>` : ''}
                <div class="detail-item"><strong>Registration Date:</strong> ${registrationDate}</div>
            </div>
            
            <div class="qr-section">
                <img src="${qrCodeDataUrl}" alt="QR Code" class="qr-code">
                <div class="qr-label">Scan to Verify</div>
            </div>
            
            <div class="footer">
                This certificate is digitally generated and verified.
            </div>
            
            <div class="organization">
                College Events Platform
            </div>
            
            <div class="certificate-id">
                Certificate ID: ${certificateId}
            </div>
        </div>
    </div>
</body>
</html>`;

    // Save certificate to database
    await this.saveCertificateRecord(certificateId, registration.id, event.id, user.id);

    return {
      certificateId,
      html: certificateHtml,
      qrCode: qrCodeDataUrl
    };
  }

  // Save certificate record to database
  async saveCertificateRecord(certificateId, registrationId, eventId, userId) {
    try {
      const { error } = await supabaseAdmin
        .from('certificates')
        .insert([{
          id: certificateId,
          registration_id: registrationId,
          event_id: eventId,
          user_id: userId,
          issued_at: new Date().toISOString(),
          status: 'active'
        }]);

      if (error) {
        console.error('Error saving certificate record:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in saveCertificateRecord:', error);
      throw error;
    }
  }

  // Verify certificate
  async verifyCertificate(certificateId) {
    try {
      const { data: certificate, error } = await supabaseAdmin
        .from('certificates')
        .select(`
          *,
          registration:registrations(
            id,
            status,
            created_at
          ),
          event:events(
            id,
            title,
            date,
            venue,
            club:clubs(name)
          ),
          user:users(
            id,
            name,
            email
          )
        `)
        .eq('id', certificateId)
        .eq('status', 'active')
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return { valid: false, message: 'Certificate not found' };
        }
        throw error;
      }

      return {
        valid: true,
        certificate,
        message: 'Certificate is valid'
      };
    } catch (error) {
      console.error('Error verifying certificate:', error);
      return { valid: false, message: 'Error verifying certificate' };
    }
  }
}

module.exports = new CertificateService();