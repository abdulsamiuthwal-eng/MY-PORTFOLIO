export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const { text } = req.body || {};
  if (!text || typeof text !== 'string') {
    res.status(400).json({ error: 'Text parameter is required' });
    return;
  }

  const apiKey = process.env.ELEVENLABS_API_KEY || 'sk_73393b6f0b98c45870eb0ffefd8bde6a725b83ff5c6d9621';
  const voiceId = process.env.ELEVENLABS_VOICE_ID || 't4U671CQHG58R11znrVj';

  // Clean Markdown & system tokens for silky natural speech
  const cleanText = text
    .replace(/---SECTION:[^-\s]+---/gi, '')
    .replace(/[*#`_~]/g, '')
    .replace(/•/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleanText) {
    res.status(400).json({ error: 'Clean text is empty' });
    return;
  }

  try {
    const elevenResponse = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg',
        },
        body: JSON.stringify({
          text: cleanText,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.8,
            style: 0.15,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!elevenResponse.ok) {
      const errorText = await elevenResponse.text();
      console.error('ElevenLabs API error:', elevenResponse.status, errorText);
      res.status(elevenResponse.status).json({ error: 'ElevenLabs synthesis failed', details: errorText });
      return;
    }

    const audioBuffer = await elevenResponse.arrayBuffer();
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
    res.status(200).send(Buffer.from(audioBuffer));
  } catch (error) {
    console.error('TTS endpoint error:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
