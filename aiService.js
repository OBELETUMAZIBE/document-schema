class AIService {
  // Tokenize & remove stop words
  tokenize(text) {
    if (!text) return [];
    return text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/).filter(w => w.length > 2 && !STOP_WORDS.has(w));
  }

  // Extractive Summarization using TextRank & Frequency Salience
  generateSummary(text, maxSentences = 4) {
    const sentences = this.sentenceTokenize(text);
    if (sentences.length <= maxSentences) {
      return { summary: sentences.join(' '), keyPoints: sentences, sentenceCount: sentences.length };
    }

    const words = this.tokenize(text);
    const wordFreq = {};
    words.forEach(w => { wordFreq[w] = (wordFreq[w] || 0) + 1; });

    const scored = sentences.map((sentence, idx) => {
      const sentWords = this.tokenize(sentence);
      let score = 0;
      sentWords.forEach(w => { score += (wordFreq[w] || 0); });
      score = sentWords.length > 0 ? score / Math.sqrt(sentWords.length) : 0;
      if (idx === 0) score *= 1.3;
      return { idx, sentence, score };
    });

    const top = [...scored].sort((a, b) => b.score - a.score).slice(0, maxSentences).sort((a, b) => a.idx - b.idx);
    return {
      summary: top.map(s => s.sentence).join(' '),
      keyPoints: top.map(s => s.sentence),
      sentenceCount: sentences.length
    };
  }

  // RAG / Question Answering over document chunks
  async askQuestion({ query, documents }) {
    const queryTokens = this.tokenize(query);
    const queryTf = this.computeTf(queryTokens);
    const candidateChunks = [];

    documents.forEach(doc => {
      const chunks = this.chunkText(doc.content || '', 120, 30);
      chunks.forEach(chunk => {
        const chunkTf = this.computeTf(this.tokenize(chunk.text));
        const sim = this.cosineSimilarity(queryTf, chunkTf);
        let overlap = 0;
        queryTokens.forEach(t => { if (chunk.text.toLowerCase().includes(t)) overlap++; });
        const score = sim * 0.7 + (overlap / Math.max(1, queryTokens.length)) * 0.3;

        if (score > 0.05) {
          candidateChunks.push({ documentId: doc.id, documentTitle: doc.title, text: chunk.text, score });
        }
      });
    });

    candidateChunks.sort((a, b) => b.score - a.score);
    const topChunks = candidateChunks.slice(0, 3);
    const answer = this.synthesizeNativeAnswer(query, topChunks);

    return {
      query,
      answer,
      citations: topChunks.map(c => ({ documentId: c.documentId, documentTitle: c.documentTitle, passage: c.text })),
      confidence: topChunks[0] ? Math.min(0.95, parseFloat(topChunks[0].score.toFixed(2))) : 0,
      provider: 'Native-Intelligent-RAG'
    };
  }

  // Named Entity Recognition (NER)
  extractEntities(text) {
    const emails = [...new Set(text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [])];
    const monetary = [...new Set(text.match(/(?:\$|€|£|USD|EUR|GBP)\s?\d+(?:,\d{3})*(?:\.\d{2})?/gi) || [])];
    const dates = [...new Set(text.match(/\b(?:\d{4}-\d{2}-\d{2}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2}(?:,\s+\d{4})?)\b/gi) || [])];
    return { emails, monetary, dates };
  }
}