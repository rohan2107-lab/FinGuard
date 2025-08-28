// api.js

const OPENROUTER_API_KEY = "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"; // Use a secure environment variable
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEEPSEEK_MODEL = "tngtech/deepseek-r1t2-chimera:free";

export const getFinanceArticle = async (topic) => {
  const prompt = `
    Please write a comprehensive article about "${topic}" in a friendly, practical tone. The article should be structured as a JSON object with the following keys:
    1.  "title": A catchy title.
    2.  "summary": A brief, one-paragraph summary of the article.
    3.  "sections": An array of objects. Each object should have a "heading" and "content" key for different sections of the article.
    4.  "keyTakeaways": An array of 3-5 bullet points summarizing the most important points.

    Ensure all content is well-formatted and fits within the JSON structure. Do not include any text outside the JSON object.
  `;

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
            "role": "system",
            "content": "You are a financial expert. Provide accurate, well-structured, and easy-to-understand articles in JSON format."
          },
          {
            "role": "user",
            "content": prompt,
          },
        ],
        "response_format": { "type": "json_object" }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenRouter API error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return JSON.parse(data.choices?.[0]?.message?.content);

  } catch (error) {
    console.error('API Error:', error.message);
    return null; // Handle error gracefully in the UI
  }
};