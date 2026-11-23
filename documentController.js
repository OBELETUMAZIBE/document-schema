const documentService = require('../services/documentService');
const { DOCUMENT_SCHEMA } = require('../models/documentSchema');

const documentController = {
  // Expose Schema definition
  getSchema(req, res) {
    res.json({ success: true, schemaName: 'Document', schema: DOCUMENT_SCHEMA });
  },

  // Upload, extract text, and run AI analysis
  async upload(req, res, next) {
    try {
      const { title, description, teamId, isPublic, textContent, tags } = req.body;
      let file = req.file;

      if (!file && textContent) {
        // Direct text ingestion support
        file = { originalname: `${title || 'document'}.txt`, textContent };
      }

      const document = await documentService.createDocument({
        file,
        title,
        description,
        teamId,
        isPublic,
        customTags: tags
      });

      res.status(201).json({ success: true, document });
    } catch (err) {
      next(err);
    }
  },

  // List documents with search & category filters
  list(req, res, next) {
    const { teamId, category, tag, search } = req.query;
    const documents = documentService.getDocuments({ teamId, category, tag, search });
    res.json({ success: true, count: documents.length, documents });
  }
};