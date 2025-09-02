import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ success: true, message: 'coupons routes coming in Sprint 2' });
});

export default router;
