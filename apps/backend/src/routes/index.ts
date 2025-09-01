import { Router } from 'express';
import authRoutes from './auth';
import dishRoutes from './dishes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/dishes', dishRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
    statusCode: 200
  });
});

export default router;
