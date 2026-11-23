/**
 * Formal Document Schema Definition (JSON Schema Draft-07)
 */
const DOCUMENT_SCHEMA = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "Document",
  description: "Core Document Schema for AI-Powered Intelligent Document Management System",
  type: "object",
  required: ["id", "title", "originalName", "mimeType", "size", "currentVersion", "createdAt"],
  properties: {
    id: { type: "string", format: "uuid", description: "Unique document ID" },
    title: { type: "string", description: "Human-readable title" },
    description: { type: "string" },
    originalName: { type: "string" },
    mimeType: { type: "string" },
    size: { type: "integer", minimum: 0 },
    filePath: { type: "string" },
    category: {
      type: "string",
      enum: [
        "Legal & Contracts",
        "Financial & Invoicing",
        "Technical & Engineering",
        "Human Resources & Team",
        "Product & Strategy",
        "Operations & Security",
        "General"
      ]
    },
    tags: { type: "array", items: { type: "string" } },
    uploaderId: { type: "string" },
    teamId: { type: ["string", "null"] },
    isPublic: { type: "boolean", default: false },
    currentVersion: { type: "integer", default: 1 },
    versions: {
      type: "array",
      items: {
        properties: {
          version: { type: "integer" },
          filePath: { type: "string" },
          size: { type: "integer" },
          changeLog: { type: "string" },
          uploadedAt: { type: "string", format: "date-time" }
        }
      }
    },
    content: { type: "string", description: "Extracted plaintext for search & RAG" },
    aiData: {
      type: "object",
      properties: {
        summary: { type: "string", description: "Executive TextRank summary" },
        keyPoints: { type: "array", items: { type: "string" } },
        confidence: { type: "number" },
        entities: {
          properties: {
            emails: { type: "array" },
            monetary: { type: "array" },
            dates: { type: "array" },
            organizations: { type: "array" }
          }
        },
        readability: {
          properties: {
            readingGrade: { type: "string" },
            estimatedReadingTimeMinutes: { type: "integer" },
            fleschScore: { type: "number" }
          }
        },
        sentiment: {
          properties: {
            overall: { type: "string", enum: ["positive", "neutral", "negative"] },
            polarityScore: { type: "number" }
          }
        }
      }
    },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" }
  }
};

module.exports = { DOCUMENT_SCHEMA };