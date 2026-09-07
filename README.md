# Flux AI Generator API

A Node.js Express API wrapper for the Flux AI image generator service. This API provides clean, easy-to-use endpoints to generate AI images.

## Features

- ✨ Simple REST API endpoints
- 🎨 Support for multiple styles and aspect ratios
- 🧹 Clean JSON responses
- 📝 Both GET and POST request methods
- 🚀 Fast and lightweight
- 🛡️ CORS enabled

## Installation

1. Clone the repository
```bash
git clone https://github.com/MR-MAHABUB-004/flux-ai-generator-api.git
cd flux-ai-generator-api
```

2. Install dependencies
```bash
npm install
```

3. Create `.env` file (optional)
```bash
cp .env.example .env
```

4. Start the server
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Usage

### Health Check
```bash
GET http://localhost:5000/health
```

Response:
```json
{
  "status": "API is running"
}
```

### Generate Image (GET Request)

```bash
GET http://localhost:5000/api/gen?prompt=A boy anime name Itachi&style=Anime&aspect=1:1&token=1.4Ph8CqarwBlOJr90wSwqdo140KH0ehEv7aiREAiVSyOU_Hyc2FruXMBXecHHL40_EdAddovB5Oi0pQiYJH-XRn-C9TeN7LNKFLrS24u6ZENT9fYB4prLbEEMNL9-fdUs4SNg3xWObyMMbeH4JZodQX2yY_Yics7tOHbp5E0oh1573d7YKAqkHzNlxxOi3Uz_vcb-YWq-Ig5IGxCvJuLKiJbhndTfjUTOHXALDmC2VCeW1X2fozTpmUqcxwjuVHGFEQHfTn3-6A_j9-8wEA0w4QfHdHbdnOXon9G7rs9HI0N5RhQvXwLiRlXlKB3qCQw26enGzrqMEWxv_gamJg1PkKT3vevqkKWv-shZl5Mzg0eUKFG0hkqHpFdIss455vKBH2EWDj2ymfO8U5RU6il3_XZ53ix3QTj-EL73M3JAu63-3FN37OuozQM8Aby3wQBAn510E_sfMdoqR1KUxdJLpFZnFATyP88L1NUhizHDauoJGH2P3cbBYb3-31iMeQLe4GewqDzLWtf4hWfzrb5E6v4Zzy6JxGpbGwVY24LzOnp0IHHMYEuzR28oT_c44nnVGfnTA554NvCB39BQg3v8UEx-Jn53wrlaCRs9_UOZdNMK_IYtHJbrmlxrwuVJF1ppe9YUSBO7cGrdn33pHVjFAML6zeKdQR6uMw8UXgun-aOdiXml_T7SzKBWHzF-X7q0.cDBLenrzTk8Rd8FngRl5mg.48d5d110912ddccaac5692d8564d447834b1b8130b5fa1e9351fc87f0ce2c4a1
```

**Query Parameters:**
- `prompt` (required): Description of the image you want to generate
- `style` (optional): Style of the image (default: "Anime")
- `aspect` (optional): Aspect ratio (default: "1:1")
- `token` (required): Turnstile token from Flux AI

**Example Response:**
```json
{
  "status": "success",
  "message": "Image generated",
  "imageUrl": "https://access.vheer.com/results/EB7VOQch_1788788437294.jpg",
  "downloadUrl": "https://app.bookmarkmanager.net/live/downloader?url=...",
  "timestamp": "2026-09-07T10:30:45.123Z"
}
```

### Generate Image (POST Request)

```bash
curl -X POST http://localhost:5000/api/gen \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A boy anime name Itachi",
    "style": "Anime",
    "aspect": "1:1",
    "token": "1.4Ph8CqarwBlOJr90wSwqdo140KH0ehEv7aiREAiVSyOU_Hyc2FruXMBXecHHL40_EdAddovB5Oi0pQiYJH-XRn-C9TeN7LNKFLrS24u6ZENT9fYB4prLbEEMNL9-fdUs4SNg3xWObyMMbeH4JZodQX2yY_Yics7tOHbp5E0oh1573d7YKAqkHzNlxxOi3Uz_vcb-YWq-Ig5IGxCvJuLKiJbhndTfjUTOHXALDmC2VCeW1X2fozTpmUqcxwjuVHGFEQHfTn3-6A_j9-8wEA0w4QfHdHbdnOXon9G7rs9HI0N5RhQvXwLiRlXlKB3qCQw26enGzrqMEWxv_gamJg1PkKT3vevqkKWv-shZl5Mzg0eUKFG0hkqHpFdIss455vKBH2EWDj2ymfO8U5RU6il3_XZ53ix3QTj-EL73M3JAu63-3FN37OuozQM8Aby3wQBAn510E_sfMdoqR1KUxdJLpFZnFATyP88L1NUhizHDauoJGH2P3cbBYb3-31iMeQLe4GewqDzLWtf4hWfzrb5E6v4Zzy6JxGpbGwVY24LzOnp0IHHMYEuzR28oT_c44nnVGfnTA554NvCB39BQg3v8UEx-Jn53wrlaCRs9_UOZdNMK_IYtHJbrmlxrwuVJF1ppe9YUSBO7cGrdn33pHVjFAML6zeKdQR6uMw8UXgun-aOdiXml_T7SzKBWHzF-X7q0.cDBLenrzTk8Rd8FngRl5mg.48d5d110912ddccaac5692d8564d447834b1b8130b5fa1e9351fc87f0ce2c4a1"
  }'
```

**Request Body Parameters:**
- `prompt` (required): Description of the image
- `style` (optional): Style of the image (default: "Anime")
- `aspect` (optional): Aspect ratio (default: "1:1")
- `token` (required): Turnstile token

**Example Response:**
```json
{
  "status": "success",
  "message": "Image generated",
  "imageUrl": "https://access.vheer.com/results/EB7VOQch_1788788437294.jpg",
  "downloadUrl": "https://app.bookmarkmanager.net/live/downloader?url=...",
  "timestamp": "2026-09-07T10:30:45.123Z"
}
```

## Error Handling

### Missing Prompt
```bash
GET http://localhost:5000/api/gen?token=YOUR_TOKEN
```

Response:
```json
{
  "status": "error",
  "msg": "Prompt is required",
  "example": "/api/gen?prompt=A boy anime&style=Anime&aspect=1:1&token=YOUR_TOKEN"
}
```

### Missing Token
```bash
GET http://localhost:5000/api/gen?prompt=test
```

Response:
```json
{
  "status": "error",
  "msg": "Turnstile token is required"
}
```

### Server Error
```json
{
  "status": "error",
  "message": "Error description",
  "timestamp": "2026-09-07T10:30:45.123Z"
}
```

## Configuration

Edit the `server.js` file to customize:
- API port (default: 5000)
- CORS settings
- Response formatting
- Additional middleware

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
NODE_ENV=development
```

## Project Structure

```
flux-ai-generator-api/
├── server.js           # Main application file
├── package.json        # Project dependencies
├── .env.example        # Environment variables template
└── README.md          # Documentation
```

## Response Format

All responses follow this clean JSON format:

```json
{
  "status": "success|error",
  "message": "Human-readable message",
  "imageUrl": "URL of generated image",
  "downloadUrl": "Download link for the image",
  "timestamp": "ISO 8601 timestamp"
}
```

## Styles Available

- Anime
- Realistic
- Abstract
- Cyberpunk
- And more...

## Aspect Ratios

- 1:1 (Square)
- 16:9 (Widescreen)
- 9:16 (Portrait)
- 4:3 (Classic)
- 3:4 (Vertical)

## Troubleshooting

### Connection refused
- Make sure the server is running: `npm start`
- Check if port 5000 is available or change it in `.env`

### Invalid token
- Tokens may expire; get a fresh one from the Flux AI website
- Ensure you're using a valid Turnstile token

### CORS errors
- CORS is enabled by default
- Check your frontend origin is allowed in `server.js`

## License

MIT

## Contributing

Feel free to submit issues and enhancement requests!

## Support

For issues related to:
- **This API**: Create an issue on GitHub
- **Flux AI**: Visit https://www.flux-2-ai.net
