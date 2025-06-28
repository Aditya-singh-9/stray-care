const crypto = require('crypto');

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

module.exports = async (req, res) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required payment verification fields' 
      });
    }

    // Create signature for verification
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    console.log('Verifying payment signature...');
    console.log('Expected:', expectedSignature);
    console.log('Received:', razorpay_signature);

    // Verify signature
    const isValid = expectedSignature === razorpay_signature;

    // Set CORS headers
    Object.keys(corsHeaders).forEach(key => {
      res.setHeader(key, corsHeaders[key]);
    });

    if (isValid) {
      console.log('✅ Payment verification successful');
      
      // Here you can save payment details to database
      // await database.savePayment({...})
      
      return res.status(200).json({
        success: true,
        verified: true,
        message: 'Payment verified successfully'
      });
    } else {
      console.log('❌ Payment verification failed');
      
      return res.status(400).json({
        success: false,
        verified: false,
        message: 'Payment verification failed'
      });
    }

  } catch (error) {
    console.error('Error verifying payment:', error);
    
    // Set CORS headers
    Object.keys(corsHeaders).forEach(key => {
      res.setHeader(key, corsHeaders[key]);
    });

    return res.status(500).json({
      success: false,
      verified: false,
      error: error.message || 'Payment verification failed'
    });
  }
};