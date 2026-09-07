const express = require('express');
const axios = require('axios');
const FormData = require('form-data');
const crypto = require('crypto');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Generate turnstile token similar to your curl
function generateTurnstileToken() {
    // Use the exact same token structure as your curl
    const baseToken = "1.4Ph8CqarwBlOJr90wSwqdo140KH0ehEv7aiREAiVSyOU_Hyc2FruXMBXecHHL40_EdAddovB5Oi0pQiYJH-XRn-C9TeN7LNKFLrS24u6ZENT9fYB4prLbEEMNL9-fdUs4SNg3xWObyMMbeH4JZodQX2yY_Yics7tOHbp5E0oh1573d7YKAqkHzNlxxOi3Uz_vcb-YWq-Ig5IGxCvJuLKiJbhndTfjUTOHXALDmC2VCeW1X2fozTpmUqcxwjuVHGFEQHfTn3-6A_j9-8wEA0w4QfHdHbdnOXon9G7rs9HI0N5RhQvXwLiRlXlKB3qCQw26enGzrqMEWxv_gamJg1PkKT3vevqkKWv-shZl5Mzg0eUKFG0hkqHpFdIss455vKBH2EWDj2ymfO8U5RU6il3_XZ53ix3QTj-EL73M3JAu63-3FN37OuozQM8Aby3wQBAn510E_sfMdoqR1KUxdJLpFZnFATyP88L1NUhizHDauoJGH2P3cbBYb3-31iMeQLe4GewqDzLWtf4hWfzrb5E6v4Zzy6JxGpbGwVY24LzOnp0IHHMYEuzR28oT_c44nnVGfnTA554NvCB39BQg3v8UEx-Jn53wrlaCRs9_UOZdNMK_IYtHJbrmlxrwuVJF1ppe9YUSBO7cGrdn33pHVjFAML6zeKdQR6uMw8UXgun-aOdiXml_T7SzKBWHzF-X7q0.cDBLenrzTk8Rd8FngRl5mg.48d5d110912ddccaac5692d8564d447834b1b8130b5fa1e9351fc87f0ce2c4a1";
    
    return baseToken;
}

// Generate random cookies
function generateCookies() {
    const timestamp = Math.floor(Date.now() / 1000);
    const gaId = Math.floor(1000000000 + Math.random() * 999999999);
    
    return `_ga_4QKTPV2WZ7=GS2.1.s${timestamp}$o1$g0$t${timestamp}$j60$l0$h0; _ga=GA1.1.${gaId}.${timestamp}`;
}

// GET endpoint for image generation
app.get('/generate', async (req, res) => {
    try {
        const { prompt, style = 'Anime', aspect = '1:1' } = req.query;
        
        if (!prompt) {
            return res.status(400).json({
                status: 'error',
                msg: 'Prompt is required. Use: /generate?prompt=YOUR_PROMPT',
                data: null
            });
        }
        
        // Create form data exactly like your curl
        const formData = new FormData();
        formData.append('style', style);
        formData.append('prompt', prompt);
        formData.append('aspect', aspect);
        formData.append('turnstile_token', generateTurnstileToken());
        
        // Make request with EXACT headers from your curl
        const response = await axios.post('https://www.flux-2-ai.net/generator', formData, {
            headers: {
                'Host': 'www.flux-2-ai.net',
                'Connection': 'keep-alive',
                'sec-ch-ua-platform': '"Android"',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 13; TECNO BG7 Build/TP1A.220624.014) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.7922.200 Mobile Safari/537.36',
                'sec-ch-ua': '"Not=A?Brand";v="99", "Android WebView";v="151", "Chromium";v="151"',
                'sec-ch-ua-mobile': '?1',
                'Accept': '*/*',
                'Origin': 'https://www.flux-2-ai.net',
                'X-Requested-With': 'mark.via.gp',
                'Sec-Fetch-Site': 'same-origin',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Dest': 'empty',
                'Referer': 'https://www.flux-2-ai.net/',
                'Accept-Encoding': 'gzip, deflate, zstd',
                'Accept-Language': 'en-US,en;q=0.9',
                'Cookie': generateCookies(),
                ...formData.getHeaders()
            },
            maxRedirects: 5,
            timeout: 30000,
            decompress: true
        });
        
        if (response.data && response.data.status === 'success') {
            const cleanResponse = {
                status: 'success',
                msg: 'success',
                data: {
                    pic: response.data.pic,
                    downloadUrl: response.data.downloadUrl,
                    prompt: prompt,
                    style: style,
                    aspect: aspect
                }
            };
            
            return res.status(200).json(cleanResponse);
        } else {
            throw new Error('Failed to generate image');
        }
        
    } catch (error) {
        console.error('Generation error:', error.response?.data || error.message);
        
        return res.status(500).json({
            status: 'error',
            msg: error.response?.data?.msg || error.message || 'Internal server error',
            data: null
        });
    }
});

// POST endpoint
app.post('/generate', async (req, res) => {
    try {
        const { prompt, style = 'Anime', aspect = '1:1' } = req.body;
        
        if (!prompt) {
            return res.status(400).json({
                status: 'error',
                msg: 'Prompt is required',
                data: null
            });
        }
        
        const formData = new FormData();
        formData.append('style', style);
        formData.append('prompt', prompt);
        formData.append('aspect', aspect);
        formData.append('turnstile_token', generateTurnstileToken());
        
        const response = await axios.post('https://www.flux-2-ai.net/generator', formData, {
            headers: {
                'Host': 'www.flux-2-ai.net',
                'Connection': 'keep-alive',
                'sec-ch-ua-platform': '"Android"',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 13; TECNO BG7 Build/TP1A.220624.014) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.7922.200 Mobile Safari/537.36',
                'sec-ch-ua': '"Not=A?Brand";v="99", "Android WebView";v="151", "Chromium";v="151"',
                'sec-ch-ua-mobile': '?1',
                'Accept': '*/*',
                'Origin': 'https://www.flux-2-ai.net',
                'X-Requested-With': 'mark.via.gp',
                'Sec-Fetch-Site': 'same-origin',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Dest': 'empty',
                'Referer': 'https://www.flux-2-ai.net/',
                'Accept-Encoding': 'gzip, deflate, zstd',
                'Accept-Language': 'en-US,en;q=0.9',
                'Cookie': generateCookies(),
                ...formData.getHeaders()
            },
            maxRedirects: 5,
            timeout: 30000,
            decompress: true
        });
        
        if (response.data && response.data.status === 'success') {
            return res.status(200).json({
                status: 'success',
                msg: 'success',
                data: response.data
            });
        } else {
            throw new Error('Failed to generate image');
        }
        
    } catch (error) {
        console.error('Generation error:', error.response?.data || error.message);
        
        return res.status(500).json({
            status: 'error',
            msg: error.response?.data?.msg || error.message || 'Internal server error',
            data: null
        });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'success',
        msg: 'API is running',
        data: {
            uptime: process.uptime(),
            timestamp: new Date().toISOString()
        }
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        status: 'success',
        msg: 'Flux-2 AI Generator API',
        data: {
            endpoints: {
                generate: '/generate?prompt=YOUR_PROMPT&style=Anime&aspect=1:1',
                health: '/health'
            }
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Flux-2 AI Generator API running on port ${PORT}`);
    console.log(`🎨 Test: http://localhost:${PORT}/generate?prompt=A%20boy%20anime%20name%20Itachi`);
});
