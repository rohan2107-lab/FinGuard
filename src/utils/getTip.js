// Ensure your API key is stored securely, e.g., in a .env file, and is not exposed client-side.
const OPENROUTER_API_KEY = "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";
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEEPSEEK_MODEL = "tngtech/deepseek-r1t2-chimera:free";

export const getFinanceTip = async (username = 'User') => {
  const prompt = `Give a short, one-line financial tip about budgeting, saving, or avoiding scams for a user named ${username}. Keep it useful and practical.`;

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": DEEPSEEK_MODEL,
        "messages": [
          {
            "role": "user",
            "content": prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenRouter API error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '💡 Always track your spending.';

  } catch (error) {
    console.error('API error:', error.message);
    return '💡 Save first, spend later — your future self will thank you.';
  }
};