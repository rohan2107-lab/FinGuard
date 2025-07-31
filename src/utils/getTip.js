import axios from 'axios';

const GEMINI_API_KEY = "AIzaSyBfFgUvb_QcHJA17-ghvV-12eJsTRm6AfI"; // naya api key add kiye hai..

export const getFinanceTip = async (username = 'User') => {
  const prompt = `Give a short, one-line financial tip about budgeting, saving, or avoiding scams for a user named ${username}. Keep it useful and practical.`;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.candidates?.[0]?.content?.parts?.[0]?.text || '💡 Always track your spending.';
  } catch (error) {
    console.error('Gemini API error:', error.response?.data || error.message);
    return '💡 Save first, spend later — your future self will thank you.';
  }
};
