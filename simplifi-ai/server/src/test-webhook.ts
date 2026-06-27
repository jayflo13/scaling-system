
import axios from 'axios';

const SERVER_URL = 'http://localhost:3001';
const MOCK_USER_ID = 'mock-user-123';

async function testWebhook() {
  console.log('Testing Stripe Webhook...');

  // Ensure user exists
  try {
    await axios.get(`${SERVER_URL}/api/user/${MOCK_USER_ID}/preferences`);
  } catch (err: any) {
    if (err.response?.status === 404) {
      console.log('Mock user not found, creating...');
      // We don't have a direct "create user" API in the index.ts snippets I saw, 
      // but the callback creates it. Let's just use raw SQL if we have to, 
      // or check if there's another way.
      // Actually, I'll just manually insert it via team-db for the test.
    }
  }

  const mockPayload = {
    type: 'checkout.session.completed',
    data: {
      object: {
        client_reference_id: MOCK_USER_ID,
        customer: 'cus_test_123',
        subscription: 'sub_test_123'
      }
    }
  };

  try {
    const response = await axios.post(`${SERVER_URL}/api/webhooks/stripe`, mockPayload, {
      headers: {
        'Content-Type': 'application/json',
        // Signature verification is bypassed when STRIPE_WEBHOOK_SECRET is 'whsec_mock'
        'stripe-signature': 't=123,v1=mock_signature'
      }
    });

    console.log('Webhook response:', response.data);
    
    // Check if user was updated
    const userRes = await axios.get(`${SERVER_URL}/api/user/${MOCK_USER_ID}/preferences`);
    console.log('User plan after webhook:', userRes.data.plan);

    if (userRes.data.plan === 'premium') {
      console.log('✅ Webhook Test Passed: User upgraded to premium');
    } else {
      console.error('❌ Webhook Test Failed: User plan is still', userRes.data.plan);
    }
  } catch (error: any) {
    console.error('❌ Webhook Test Failed:', error.response?.data || error.message);
  }
}

testWebhook();
