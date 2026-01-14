import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import type { SearchResult } from "../ai/types";

export class VectorStore {
  private db: Database.Database;

  constructor(workspacePath: string) {
    // Store vector DB in workspace's .mindrian folder
    const mindrianDir = path.join(workspacePath, ".mindrian");
    if (!fs.existsSync(mindrianDir)) {
      fs.mkdirSync(mindrianDir, { recursive: true });
    }

    const dbPath = path.join(mindrianDir, "vectors.db");
    this.db = new Database(dbPath);
    this.initialize();
  }

  private initialize() {
    // Create documents table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY,
        path TEXT UNIQUE NOT NULL,
        content TEXT NOT NULL,
        summary TEXT,
        updated_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS embeddings (
        doc_id TEXT PRIMARY KEY,
        embedding BLOB NOT NULL,
        FOREIGN KEY (doc_id) REFERENCES documents(id) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_documents_path ON documents(path);
      CREATE INDEX IF NOT EXISTS idx_documents_updated ON documents(updated_at);
    `);
  }

  async upsert(
    docId: string,
    filePath: string,
    content: string,
    embedding: number[]
  ) {
    const embedBuffer = Buffer.from(new Float32Array(embedding).buffer);

    const upsertDoc = this.db.prepare(`
      INSERT OR REPLACE INTO documents (id, path, content, updated_at)
      VALUES (?, ?, ?, ?)
    `);

    const upsertEmbed = this.db.prepare(`
      INSERT OR REPLACE INTO embeddings (doc_id, embedding)
      VALUES (?, ?)
    `);

    const transaction = this.db.transaction(() => {
      upsertDoc.run(docId, filePath, content, Date.now());
      upsertEmbed.run(docId, embedBuffer);
    });

    transaction();
  }

  async search(
    queryEmbedding: number[],
    topK: number = 5
  ): Promise<SearchResult[]> {
    const queryBuffer = Buffer.from(new Float32Array(queryEmbedding).buffer);

    // Get all documents with embeddings
    const stmt = this.db.prepare(`
      SELECT d.path, d.content, e.embedding
      FROM documents d
      JOIN embeddings e ON d.id = e.doc_id
    `);

    const rows = stmt.all() as Array<{
      path: string;
      content: string;
      embedding: Buffer;
    }>;

    // Calculate cosine similarity (embeddings are already normalized)
    const results = rows.map((row) => {
      const docEmbedding = new Float32Array(row.embedding.buffer);
      const queryEmbed = new Float32Array(queryBuffer.buffer);

      // Dot product (since vectors are normalized, this is cosine similarity)
      let similarity = 0;
      for (let i = 0; i < queryEmbed.length && i < docEmbedding.length; i++) {
        similarity += queryEmbed[i] * docEmbedding[i];
      }

      return {
        path: row.path,
        content: row.content,
        similarity,
      };
    });

    // Sort by similarity and return top K
    return results.sort((a, b) => b.similarity - a.similarity).slice(0, topK);
  }

  async deleteByPath(filePath: string) {
    this.db.prepare("DELETE FROM documents WHERE path = ?").run(filePath);
  }

  async count(): Promise<number> {
    const result = this.db
      .prepare("SELECT COUNT(*) as count FROM documents")
      .get() as { count: number };
    return result.count;
  }

  close() {
    this.db.close();
  }
}
