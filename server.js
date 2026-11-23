const app = require('./app');
const config = require('./config');
const logger = require('./utils/logger');

const server = app.listen(config.port, () => {
  logger.info(`========================================================`);
  logger.info(`🚀 Document-Schema Backend is actively running!`);
  logger.info(`📡 Server listening on: http://localhost:${config.port}`);
  logger.info(`📄 API Health Check:   http://localhost:${config.port}/api/health`);
  logger.info(`📋 Document Schema:     http://localhost:${config.port}/api/schema`);
  logger.info(`🌐 Web Dashboard:       http://localhost:${config.port}/`);
  logger.info(`========================================================`);
});