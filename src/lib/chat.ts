const SYSTEM_PROMPT = `You are an AI assistant for Abdul Sami Uthwal's portfolio website. You help visitors learn about Sami.

Portfolio sections:
- #home — Hero / introduction
- #biography — About / biography
- #skills — Skills & technologies
- #timeline — Experience / timeline
- #project — Projects
- #contact-page — Contact form

Rules:
1. Answer in a detailed, professional style.
2. Use complete paragraphs, clear explanations, and examples where helpful.
3. Provide a thorough response of at least 4-5 sentences when possible, without adding unnecessary filler.
4. Do not include any visible section markers like ---SECTION:...--- in the response.
5. If the user asks about a portfolio area such as projects, skills, experience, or contact, end with a polite offer: "If you want, I can open the [section name] section for you." Do not open it automatically without explicit user consent.
6. Keep the chat text clean, user-friendly, and easy to read.`;

export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

export interface ChatResult {
  text: string;
  section?: string;
}

export async function sendMessage(messages: ChatMessage[]): Promise<ChatResult> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages, systemPrompt: SYSTEM_PROMPT }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || 'API request failed');
  }

  const data = await res.json();
  return {
    text: data.text || 'No response.',
    section: data.section,
  };
}
