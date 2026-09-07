const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Flux AI Generator API endpoint
const FLUX_API_URL = 'https://www.flux-2-ai.net/generator';

// Helper function to make Flux AI request
async function generateImage(prompt, style = 'Anime', aspect = '1:1', turnstileToken) {
  try {
    const formData = new FormData();
    formData.append('style', style);
    formData.append('prompt', prompt);
    formData.append('aspect', aspect);
    formData.append('turnstile_token', turnstileToken);

    const response = await axios.post(FLUX_API_URL, formData, {
      headers: {
        'Host': 'www.flux-2-ai.net',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 13; TECNO BG7 Build/TP1A.220624.014) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.7922.200 Mobile Safari/537.36',
        'Origin': 'https://www.flux-2-ai.net',
        'Referer': 'https://www.flux-2-ai.net/',
        'Accept-Encoding': 'gzip, deflate, zstd',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });

    return response.data;
  } catch (error) {
    throw new Error(`Flux AI API Error: ${error.message}`);
  }
}

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'API is running' });
});

// Generate image endpoint
// Usage: /api/gen?prompt=A boy anime&style=Anime&aspect=1:1&token=YOUR_TOKEN
app.get('/api/gen', async (req, res) => {
  try {
    const { prompt, style = 'Anime', aspect = '1:1', token } = req.query;

    // Validate required parameters
    if (!prompt) {
      return res.status(400).json({
        status: 'error',
        msg: 'Prompt is required',
        example: '/api/gen?prompt=A boy anime&style=Anime&aspect=1:1&token=YOUR_TOKEN'
      });
    }

    if (!token) {
      return res.status(400).json({
        status: 'error',
        msg: 'Turnstile token is required',
        example: '/api/gen?prompt=A boy anime&style=Anime&aspect=1:1&token=YOUR_TOKEN'
      });
    }

    // Call Flux AI API
    const result = await generateImage(prompt, style, aspect, token);

    // Clean JSON response
    const cleanResponse = {
      status: result.status || 'unknown',
      message: result.msg || result.message || 'Image generated',
      imageUrl: result.pic || null,
      downloadUrl: result.downloadUrl || null,
      timestamp: new Date().toISOString()
    };

    res.json(cleanResponse);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// POST endpoint alternative
// Usage: POST /api/gen with JSON body
app.post('/api/gen', async (req, res) => {
  try {
    const { prompt, style = 'Anime', aspect = '1:1', token } = req.body;

    // Validate required parameters
    if (!prompt) {
      return res.status(400).json({
        status: 'error',
        msg: 'Prompt is required'
      });
    }

    if (!token) {
      return res.status(400).json({
        status: 'error',
        msg: 'Turnstile token is required'
      });
    }

    // Call Flux AI API
    const result = await generateImage(prompt, style, aspect, token);

    // Clean JSON response
    const cleanResponse = {
      status: result.status || 'unknown',
      message: result.msg || result.message || 'Image generated',
      imageUrl: result.pic || null,
      downloadUrl: result.downloadUrl || null,
      timestamp: new Date().toISOString()
    };

    res.json(cleanResponse);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint not found',
    availableEndpoints: [
      'GET /health',
      'GET /api/gen?prompt=...&style=Anime&aspect=1:1&token=...',
      'POST /api/gen (JSON body required)'
    ]
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Flux AI Generator API is running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation:`);
  console.log(`   GET  http://localhost:${PORT}/api/gen?prompt=YOUR_PROMPT&style=Anime&aspect=1:1&token=YOUR_TOKEN`);
  console.log(`   POST http://localhost:${PORT}/api/gen (with JSON body)`);
});
