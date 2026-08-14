import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const geminiKey = env.GEMINI_API_KEY;

  return {
    base: './',
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

            const getSmartFallback = (msgs: any[]) => {
              const lastMsg = msgs.length > 0 ? msgs[msgs.length - 1].text : '';
              const q = (lastMsg || '').toLowerCase();
              if (q.includes('skill') || q.includes('stack') || q.includes('tech') || q.includes('language')) {
                return {
                  text: "ABDUL SAMI UTHWAL specializes in Full Stack Development & AI Engineering!\n\n• **Frontend**: React, TypeScript, Next.js, Vite, Tailwind CSS, Three.js, GSAP\n• **Backend**: Node.js, Express, Python, REST APIs\n• **AI/ML**: Gemini API, OpenAI API, RAG Pipelines\n• **Databases & Cloud**: PostgreSQL, MongoDB, Firebase, Vercel, Docker\n\nWould you like me to open his Tech Stacks section?",
                  section: "#skills"
                };
              }
              if (q.includes('project') || q.includes('work') || q.includes('portfolio') || q.includes('build')) {
                return {
                  text: "ABDUL SAMI UTHWAL has built high-impact projects including AI Web Applications, 3D Interactive Portfolios, and Full Stack SaaS platforms!\n\nWould you like me to open the Projects section for you?",
                  section: "#project"
                };
              }
              if (q.includes('contact') || q.includes('hire') || q.includes('email') || q.includes('reach') || q.includes('phone')) {
                return {
                  text: "You can reach ABDUL SAMI UTHWAL directly:\n\n• **Email**: abdulsamiuthwal@gmail.com\n• **GitHub**: github.com/abdulsamiuthwal-eng\n\nWould you like me to open the Contact page for you?",
                  section: "#contact-page"
                };
              }
              if (q.includes('experience') || q.includes('education') || q.includes('background') || q.includes('timeline')) {
                return {
                  text: "ABDUL SAMI UTHWAL is a Software & AI Engineer with extensive experience building scalable web applications and AI solutions.\n\nWould you like me to open his Timeline & Experience section?",
                  section: "#timeline"
                };
              }
              return {
                text: "Hello! I am Abdul Sami Uthwal's AI Assistant 🤖\n\nI can tell you about his **Skills**, **Projects**, **Experience**, or **Contact details**. What would you like to know?",
              };
            };

            if (!geminiKey) {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(getSmartFallback(messages)));
              return;
            }

            const contents = messages.map((msg: { role: string; text: string }) => ({
              role: msg.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: msg.text }],
            }));
            try {
              const geminiRes = await fetch(
                'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent',
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
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(getSmartFallback(messages)));
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
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(getSmartFallback(messages)));
            }
          });
        },
      }] : []),
    ],
  };
});
