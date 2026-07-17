export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'Missing Gemini API key' });
    return;
  }

  const { messages, systemPrompt } = req.body;
  if (!Array.isArray(messages)) {
    res.status(400).json({ error: 'Invalid request payload' });
    return;
  }

  const contents = [
    ...(systemPrompt ? [{ role: 'user', parts: [{ text: systemPrompt }] }] : []),
    ...messages.map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.text }],
    })),
  ];

  try {
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({ contents }),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      res.status(response.status).json({ error: text || 'Gemini request failed' });
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
    res.status(500).json({ error: (error instanceof Error ? error.message : 'Unknown error') });
  }
}
