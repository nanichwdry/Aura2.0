import express from 'express';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import db from './db.ts';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.get('/api/messages', (req, res) => {
    try {
      const messages = db.prepare('SELECT * FROM messages ORDER BY timestamp ASC').all();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch messages' });
    }
  });

  app.post('/api/messages', (req, res) => {
    const { role, content } = req.body;
    try {
      const info = db.prepare('INSERT INTO messages (role, content) VALUES (?, ?)').run(role, content);
      res.json({ id: info.lastInsertRowid });
    } catch (error) {
      res.status(500).json({ error: 'Failed to save message' });
    }
  });

  app.delete('/api/messages', (req, res) => {
    try {
      db.prepare('DELETE FROM messages').run();
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to clear messages' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
