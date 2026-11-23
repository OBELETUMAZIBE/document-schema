const express = require('../express');
const authRoutes = require('./authRoutes');
const teamRoutes = require('./teamRoutes');
const documentRoutes = require('./documentRoutes');
const aiRoutes = require('./aiRoutes');
const commentRoutes = require('./commentRoutes');
const auditRoutes = require('./auditRoutes');
const { DOCUMENT_SCHEMA } = require('../models/documentSchema');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/teams', teamRoutes);
router.use('/documents', documentRoutes);
router.use('/ai', aiRoutes);
router.use('/', commentRoutes);
router.use('/audit', auditRoutes);

// Dedicated Document Schema endpoint
router.get('/schema', (req, res) => {
  res.json({ success: true, name: "Document schema", version: "1.0.0", schema: DOCUMENT_SCHEMA });
});

// System Health Check
router.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString(), service: 'Document Schema Backend' });
});

module.exports = router;