import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: '*',  // Only use this for development!
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-API-Key', 'Authorization'],
  credentials: true
}));
app.use(express.json());

const MOBILE_MONEY_API = {
  BASE_URL: 'https://api.mobilemoneyapi.io/v1',
  CONSUMER_KEY: '2c108fhgdqmphhuk0lohr07dqv',
  CONSUMER_SECRET: 'm33ue3o3jfoh539fmuceduetj73k2j7m35rg239q7n64nhr3b1o',
  API_KEY: 'aSFvTaqes75C9A0mjIBPJ65ABPmXBN378ZGLCKdy'
};

// Mobile Money Link endpoint
app.post('/api/mobile-money/link', async (req, res) => {
  try {
    const { mobileNumber, userId } = req.body;

    if (!mobileNumber || !userId) {
      return res.status(400).json({ 
        error: 'Mobile number and user ID are required' 
      });
    }

    // Make request to Mobile Money API
    const response = await axios.post(
      `${MOBILE_MONEY_API.BASE_URL}/accounts/link`,
      {
        accountHolderMsisdn: mobileNumber,  // Changed from mobileNumber
        accountHolderId: userId,            // Changed from userId
        accountHolderIdType: "PERSONAL",    // Added required field
        accountIdentifier: mobileNumber,    // Added required field
        accountIdentifierType: "MSISDN",    // Added required field
        requestDate: new Date().toISOString() // Added required field
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': MOBILE_MONEY_API.API_KEY,
          'Authorization': `Basic ${Buffer.from(
            `${MOBILE_MONEY_API.CONSUMER_KEY}:${MOBILE_MONEY_API.CONSUMER_SECRET}`
          ).toString('base64')}`,
          'X-Date': new Date().toUTCString(),  // Added required header
          'X-Reference-Id': userId             // Added required header
        }
      }
    );

    // Return standardized response
    res.json({
      linkReference: response.data.linkReference || response.data.serverCorrelationId,
      status: response.data.status || 'PENDING',
      serverCorrelationId: response.data.serverCorrelationId
    });

  } catch (error: any) {
    console.error('Error linking mobile money account:', error.response?.data || error);
    res.status(500).json({ 
      error: 'Failed to link mobile money account',
      details: error.response?.data || (error instanceof Error ? error.message : 'Unknown error')
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
