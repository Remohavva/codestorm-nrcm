const certificateService = require('../services/certificateService');
const { supabaseAdmin } = require('../utils/supabase');

// Generate certificate for a registration
const generateCertificate = async (req, res, next) => {
  try {
    const { registrationId } = req.params;
    const userId = req.user.id;

    // Get registration details with event and user info
    const { data: registration, error: regError } = await supabaseAdmin
      .from('registrations')
      .select(`
        *,
        event:events(
          id,
          title,
          description,
          date,
          venue,
          club:clubs(
            id,
            name,
            lead:users!lead_id(name)
          )
        ),
        user:users(
          id,
          name,
          email
        )
      `)
      .eq('id', registrationId)
      .eq('user_id', userId)
      .eq('status', 'registered')
      .single();

    if (regError) {
      if (regError.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Registration not found or not accessible'
        });
      }
      throw regError;
    }

    // Check if certificate already exists
    const { data: existingCert, error: certError } = await supabaseAdmin
      .from('certificates')
      .select('id')
      .eq('registration_id', registrationId)
      .eq('status', 'active')
      .single();

    if (existingCert) {
      return res.status(400).json({
        success: false,
        message: 'Certificate already exists for this registration',
        certificateId: existingCert.id
      });
    }

    // Generate certificate
    const certificate = await certificateService.createCertificate(
      registration,
      registration.event,
      registration.user
    );

    res.json({
      success: true,
      message: 'Certificate generated successfully',
      data: {
        certificateId: certificate.certificateId,
        downloadUrl: `/api/certificates/${certificate.certificateId}/download`
      }
    });

  } catch (error) {
    next(error);
  }
};

// Download certificate
const downloadCertificate = async (req, res, next) => {
  try {
    const { certificateId } = req.params;

    // Get certificate details
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
        return res.status(404).json({
          success: false,
          message: 'Certificate not found'
        });
      }
      throw error;
    }

    // Regenerate certificate (since we don't store the HTML)
    const certificateData = await certificateService.createCertificate(
      certificate.registration,
      certificate.event,
      certificate.user
    );

    // Set headers for HTML download
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Disposition', `attachment; filename="certificate-${certificate.event.title.replace(/[^a-zA-Z0-9]/g, '-')}.html"`);
    
    res.send(certificateData.html);

  } catch (error) {
    next(error);
  }
};

// Verify certificate
const verifyCertificate = async (req, res, next) => {
  try {
    const { certificateId } = req.params;

    const verification = await certificateService.verifyCertificate(certificateId);

    if (!verification.valid) {
      return res.status(404).json({
        success: false,
        message: verification.message
      });
    }

    res.json({
      success: true,
      message: verification.message,
      data: {
        certificate: {
          id: verification.certificate.id,
          issuedAt: verification.certificate.issued_at,
          event: {
            title: verification.certificate.event.title,
            date: verification.certificate.event.date,
            venue: verification.certificate.event.venue,
            organizer: verification.certificate.event.club?.name
          },
          participant: {
            name: verification.certificate.user.name,
            email: verification.certificate.user.email
          },
          registration: {
            date: verification.certificate.registration.created_at,
            status: verification.certificate.registration.status
          }
        }
      }
    });

  } catch (error) {
    next(error);
  }
};

// Get user's certificates
const getUserCertificates = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const { data: certificates, error } = await supabaseAdmin
      .from('certificates')
      .select(`
        *,
        event:events(
          id,
          title,
          date,
          venue,
          club:clubs(name)
        )
      `)
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('issued_at', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      data: {
        certificates: certificates.map(cert => ({
          id: cert.id,
          issuedAt: cert.issued_at,
          event: {
            title: cert.event.title,
            date: cert.event.date,
            venue: cert.event.venue,
            organizer: cert.event.club?.name
          },
          downloadUrl: `/api/certificates/${cert.id}/download`,
          verifyUrl: `/api/certificates/${cert.id}/verify`
        }))
      }
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateCertificate,
  downloadCertificate,
  verifyCertificate,
  getUserCertificates
};