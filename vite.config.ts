import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const geminiKey = env.GEMINI_API_KEY;

  return {
    plugins: [
      react(),
      // Local dev only: handles /api/chat so chatbot works on localhost
      // On Vercel production, the real /api/chat.js serverless function is used
      ...(mode === 'development' ? [{
        name: 'local-api',
        configureServer(server: any) {
          server.middlewares.use('/api/chat', async (req: any, res: any) => {
            if (req.method !== 'POST') {
              res.statusCode = 405;
              res.end(JSON.stringify({ error: 'Method Not Allowed' }));
              return;
            }
            if (!geminiKey) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Missing GEMINI_API_KEY in .env.local' }));
              return;
            }
            const chunks: Buffer[] = [];
            for await (const chunk of req) chunks.push(chunk);
            const body = JSON.parse(Buffer.concat(chunks).toString());
            const { messages, systemPrompt } = body;
            if (!Array.isArray(messages)) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Invalid payload' }));
              return;
            }
            const contents = messages.map((msg: { role: string; text: string }) => ({
              role: msg.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: msg.text }],
            }));
            try {
              const geminiRes = await fetch(
                'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent',
                {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', 'x-goog-api-key': geminiKey },
                  body: JSON.stringify({
                    system_instruction: systemPrompt ? { parts: [{ text: systemPrompt }] } : undefined,
                    contents,
                  }),
                }
              );
              if (!geminiRes.ok) {
                const errText = await geminiRes.text();
                res.statusCode = geminiRes.status;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: errText }));
                return;
              }
              const data = await geminiRes.json() as any;
              const raw: string = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response.';
              const sectionMatch = raw.match(/---SECTION:(#[a-z-]+)---/);
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                text: raw.replace(/---SECTION:(#[a-z-]+)---/, '').trim(),
                section: sectionMatch ? sectionMatch[1] : undefined,
              }));
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }));
            }
          });
        },
      }] : []),
    ],
  };
});
