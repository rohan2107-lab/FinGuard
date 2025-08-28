// newsApi.js

// Ensure this key is not hardcoded in a real app.
const OPENROUTER_API_KEY = "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"; 
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEEPSEEK_MODEL = "tngtech/deepseek-r1t2-chimera:free";

export const getFinancialNews = async (topic) => {
  const prompt = `
    As a financial news analyst, provide a detailed and up-to-date news report on the topic of "${topic}". The report should be formatted as a JSON object with the following structure:
    1.  "title": A headline for the news digest (e.g., "Latest Updates on RBI & Banking Schemes").
    2.  "articles": An array of objects. Each object represents a news article and should have the following keys:
        - "articleTitle": A concise title for the news story.
        - "source": The likely source of this news (e.g., "RBI Press Release", "Economic Times", "Local Punjab News").
        - "date": A recent date in "DD MMM YYYY" format.
        - "summary": A short, one-paragraph summary of the key details.
        - "details": A more detailed, multi-paragraph section with in-depth information.
        
    Cover topics like: daily digital fraud, RBI news and updates, PSB (Public Sector Bank) news, new government schemes, loan news, and new tax policies. Ensure the content is fresh and relevant.
    Do not include any text outside the JSON object.
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
            "content": "You are a specialized financial news analyst, providing accurate and structured news summaries in a strict JSON format."
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
    // Use a safety check and JSON.parse to handle the string output
    return JSON.parse(data.choices?.[0]?.message?.content);
  } catch (error) {
    console.error('API Error:', error.message);
    return null; 
  }
};