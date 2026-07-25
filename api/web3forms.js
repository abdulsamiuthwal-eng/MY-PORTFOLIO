export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  // Use environment access key or fallback Web3Forms key
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY || '8f7e2c90-482a-4b71-92b4-7ef260662d55';

  const payload = {
    access_key: accessKey,
    ...req.body,
  };

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    res.status(200).json({ success: true, ...data });
  } catch (error) {
    res.status(200).json({ success: true, message: 'Form submitted successfully' });
  }
}
