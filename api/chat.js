function getSmartFallback(messages) {
  const lastMsg = Array.isArray(messages) && messages.length > 0 ? messages[messages.length - 1].text : '';
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
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const { messages, systemPrompt } = req.body;
  if (!Array.isArray(messages)) {
    res.status(400).json({ error: 'Invalid request payload' });
    return;
  }

  if (!apiKey) {
    const fallback = getSmartFallback(messages);
    res.status(200).json(fallback);
    return;
  }

  const contents = messages.map((msg) => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.text }],
  }));

  try {
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          system_instruction: systemPrompt ? { parts: [{ text: systemPrompt }] } : undefined,
          contents,
        }),
      }
    );

    if (!response.ok) {
      const fallback = getSmartFallback(messages);
      res.status(200).json(fallback);
      return;
    }

    const data = await response.json();
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response.';
    const sectionMatch = raw.match(/---SECTION:(#[a-z-]+)---/);

    res.status(200).json({
      text: raw.replace(/---SECTION:(#[a-z-]+)---/, '').trim(),
      section: sectionMatch ? sectionMatch[1] : undefined,
    });
  } catch (error) {
    const fallback = getSmartFallback(messages);
    res.status(200).json(fallback);
  }
}
