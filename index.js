const express = require('express');
const axios = require('axios');
const FormData = require('form-data');
const crypto = require('crypto');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Generate random user agent for Android
function generateUserAgent() {
    const androidVersions = ['13', '12', '11', '10', '14'];
    const devices = [
        'TECNO BG7', 'Samsung SM-G991B', 'Xiaomi Mi 11', 'OnePlus 9 Pro', 
        'Google Pixel 6', 'OPPO CPH2211', 'vivo V2050', 'Realme RMX3085',
        'TECNO BG6', 'Infinix X6812', 'Redmi Note 12', 'Motorola Edge 40'
    ];
    const chromeVersions = ['151.0.7922.200', '150.0.7902.100', '149.0.7881.50', '148.0.7867.200'];
    const buildNumbers = ['TP1A.220624.014', 'SP1A.210812.016', 'RP1A.200720.011', 'SQ3A.220705.004'];
    
    const android = androidVersions[Math.floor(Math.random() * androidVersions.length)];
    const device = devices[Math.floor(Math.random() * devices.length)];
    const chrome = chromeVersions[Math.floor(Math.random() * chromeVersions.length)];
    const build = buildNumbers[Math.floor(Math.random() * buildNumbers.length)];
    
    return `Mozilla/5.0 (Linux; Android ${android}; ${device} Build/${build}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${chrome} Mobile Safari/537.36`;
}

// Generate random browser identifiers
function generateBrowserHeaders() {
    const userAgent = generateUserAgent();
    const chromeVersion = '151';
    const webViewVersion = '151';
    const secChUa = `"Not=A?Brand";v="99", "Android WebView";v="${webViewVersion}", "Chromium";v="${chromeVersion}"`;
    
    return {
        'Host': 'www.flux-2-ai.net',
        'Connection': 'keep-alive',
        'sec-ch-ua-platform': '"Android"',
        'User-Agent': userAgent,
        'sec-ch-ua': secChUa,
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
        'Cookie': generateCookies()
    };
}

// Generate cookies
function generateCookies() {
    const timestamp = Math.floor(Date.now() / 1000);
    const gaId1 = Math.floor(1000000000 + Math.random() * 999999999);
    const gaId2 = Math.floor(1000000000 + Math.random() * 999999999);
    
    return `_ga_4QKTPV2WZ7=GS2.1.s${timestamp}$o1$g0$t${timestamp}$j60$l0$h0; _ga=GA1.1.${gaId1}.${timestamp}`;
}

// Generate turnstile token
function generateTurnstileToken() {
    const randomPart = crypto.randomBytes(48).toString('base64').replace(/[^a-zA-Z0-9]/g, '');
    const timestamp = Date.now();
    const hashInput = `${timestamp}${randomPart}flux2ai_${Math.random()}`;
    const hashPart = crypto.createHash('sha256').update(hashInput).digest('hex');
    
    // Simulate Cloudflare Turnstile token structure
    return `1.${randomPart.substring(0, 60)}.${hashPart.substring(0, 80)}.${crypto.randomBytes(8).toString('hex')}`;
}

// GET endpoint for image generation
app.get('/generate', async (req, res) => {
    try {
        const { prompt, style = 'Anime', aspect = '1:1' } = req.query;
        
        // Validate inputs
        if (!prompt) {
            return res.status(400).json({
                status: 'error',
                msg: 'Prompt is required. Use: /generate?prompt=YOUR_PROMPT',
                data: null
            });
        }
        
        // Validate aspect ratio
        const validAspects = ['1:1', '16:9', '9:16', '4:3', '3:4', '21:9', '9:21', '2:3', '3:2'];
        if (!validAspects.includes(aspect)) {
            return res.status(400).json({
                status: 'error',
                msg: `Invalid aspect ratio. Valid options: ${validAspects.join(', ')}`,
                data: null
            });
        }
        
        // Create form data
        const formData = new FormData();
        formData.append('style', style);
        formData.append('prompt', prompt);
        formData.append('aspect', aspect);
        formData.append('turnstile_token', generateTurnstileToken());
        
        // Make request to Flux-2 AI
        const response = await axios.post('https://www.flux-2-ai.net/generator', formData, {
            headers: {
                ...generateBrowserHeaders(),
                ...formData.getHeaders()
            },
            maxRedirects: 5,
            timeout: 30000
        });
        
        if (response.data && response.data.status === 'success') {
            // Clean response
            const cleanResponse = {
                status: 'success',
                msg: 'Image generated successfully',
                data: {
                    image_url: response.data.pic,
                    download_url: response.data.downloadUrl,
                    prompt: prompt,
                    style: style,
                    aspect: aspect,
                    generated_at: new Date().toISOString()
                }
            };
            
            return res.status(200).json(cleanResponse);
        } else {
            throw new Error('Failed to generate image');
        }
        
    } catch (error) {
        console.error('Generation error:', error.message);
        
        return res.status(500).json({
            status: 'error',
            msg: error.message || 'Internal server error',
            data: null
        });
    }
});

// POST endpoint for image generation (also available)
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
        
        const validAspects = ['1:1', '16:9', '9:16', '4:3', '3:4', '21:9', '9:21', '2:3', '3:2'];
        if (!validAspects.includes(aspect)) {
            return res.status(400).json({
                status: 'error',
                msg: 'Invalid aspect ratio',
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
                ...generateBrowserHeaders(),
                ...formData.getHeaders()
            },
            maxRedirects: 5,
            timeout: 30000
        });
        
        if (response.data && response.data.status === 'success') {
            const cleanResponse = {
                status: 'success',
                msg: 'Image generated successfully',
                data: {
                    image_url: response.data.pic,
                    download_url: response.data.downloadUrl,
                    prompt: prompt,
                    style: style,
                    aspect: aspect,
                    generated_at: new Date().toISOString()
                }
            };
            
            return res.status(200).json(cleanResponse);
        } else {
            throw new Error('Failed to generate image');
        }
        
    } catch (error) {
        console.error('Generation error:', error.message);
        
        return res.status(500).json({
            status: 'error',
            msg: error.message || 'Internal server error',
            data: null
        });
    }
});

// Direct image redirect endpoint
app.get('/image', async (req, res) => {
    try {
        const { prompt, style = 'Anime', aspect = '1:1' } = req.query;
        
        if (!prompt) {
            return res.status(400).json({
                status: 'error',
                msg: 'Prompt is required. Use: /image?prompt=YOUR_PROMPT',
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
                ...generateBrowserHeaders(),
                ...formData.getHeaders()
            },
            maxRedirects: 5,
            timeout: 30000
        });
        
        if (response.data && response.data.status === 'success' && response.data.pic) {
            // Redirect directly to the image
            return res.redirect(302, response.data.pic);
        } else {
            throw new Error('Failed to generate image');
        }
        
    } catch (error) {
        console.error('Generation error:', error.message);
        
        return res.status(500).json({
            status: 'error',
            msg: error.message || 'Internal server error',
            data: null
        });
    }
});

// Endpoint to get available styles (GET)
app.get('/styles', (req, res) => {
    const styles = [
        { id: 1, name: 'Anime', description: 'Japanese anime style' },
        { id: 2, name: 'Realistic', description: 'Photo-realistic images' },
        { id: 3, name: '3D', description: '3D rendered images' },
        { id: 4, name: 'Pixel Art', description: 'Retro pixel art style' },
        { id: 5, name: 'Cartoon', description: 'Cartoon style illustrations' },
        { id: 6, name: 'Watercolor', description: 'Watercolor painting style' },
        { id: 7, name: 'Oil Painting', description: 'Classical oil painting' },
        { id: 8, name: 'Cyberpunk', description: 'Futuristic cyberpunk theme' },
        { id: 9, name: 'Fantasy', description: 'Fantasy and magical style' },
        { id: 10, name: 'Minimalist', description: 'Simple minimalist design' }
    ];
    
    res.json({
        status: 'success',
        msg: 'Available styles retrieved successfully',
        data: {
            count: styles.length,
            styles: styles
        }
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'success',
        msg: 'API is running',
        data: {
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
            memory_usage: process.memoryUsage().heapUsed / 1024 / 1024
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
                generate_get: '/generate?prompt=YOUR_PROMPT&style=Anime&aspect=1:1',
                generate_post: '/generate (POST with JSON body)',
                image_direct: '/image?prompt=YOUR_PROMPT',
                styles: '/styles',
                health: '/health'
            },
            documentation: {
                parameters: {
                    prompt: 'Required - Text description of the image to generate',
                    style: 'Optional - Art style (default: Anime)',
                    aspect: 'Optional - Aspect ratio (default: 1:1)'
                }
            }
        }
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('=============================================');
    console.log('🚀 Flux-2 AI Generator API');
    console.log('=============================================');
    console.log(`📍 Server running on: http://localhost:${PORT}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    console.log(`🎨 Generate: http://localhost:${PORT}/generate?prompt=Your+Prompt`);
    console.log('=============================================');
});
