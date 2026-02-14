import express from 'express';
import dotenv from 'dotenv';
import { corsMiddleware, errorHandler, requestLogger } from './middleware.js';
import routes from './routes.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;
// Middleware
app.use(express.json());
app.use(corsMiddleware);
app.use(requestLogger);
// Routes
app.use('/api', routes);
// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString()
    });
});
// Error handling
app.use(errorHandler);
app.listen(PORT, () => {
    console.log(`✅ AI UI Generator Backend running on http://localhost:${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/health`);
    console.log(`🔌 API endpoint: http://localhost:${PORT}/api`);
});
