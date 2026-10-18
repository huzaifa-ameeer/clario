const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"


const buildPrompt = (text) => {
  return `You are an expert document analyst and study-notes creator.
Transform the following document content into beautiful, well-structured,
easy-to-understand notes.

Rules:
- Organize content into meaningful sections with clear, descriptive headings.
- Use concise bullet points to explain key concepts, facts, findings, and conclusions.
- Use subheadings to group related information logically.
- Highlight important terms, definitions, formulas, and key takeaways.
- Include examples only when they help explain a concept.
- Preserve important technical details, facts, and the original meaning.
- Remove unnecessary repetition and irrelevant information.
- Make the notes visually organized, readable, and useful for studying.
- Use simple, clear language without oversimplifying complex concepts.
- Do not invent information that is not present in the document.
- Return valid JSON only, with no markdown fences or extra explanations.

Required JSON structure:
{
  "title": "A suitable title for the notes",
  "description": "A short overview of the document",
  "sections": [
    {
      "heading": "Section heading",
      "content": [
        {
          "type": "paragraph",
          "text": "A short introduction to the topic."
        },
        {
          "type": "bullet",
          "text": "An important point or explanation."
        },
        {
          "type": "definition",
          "term": "Important term",
          "meaning": "Its clear and accurate definition."
        },
        {
          "type": "example",
          "text": "A relevant example, when available."
        }
      ]
    }
  ],
  "keyTakeaways": [
    "The most important thing to remember."
  ]
}

Include only content types that are relevant to the document.
Create enough sections to cover the important material without unnecessary
fragmentation. Keep the notes concise but informative.

Document content:
"""
${text}
"""`;
};


export const analyzeText = async (text) => {
    if (!text || !text.trim()) {
        throw new Error("No text content to analyze")
    }

    const response = await fetch(`${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            contents: [
                {
                    parts: [
                        {
                            text: buildPrompt(text)
                        }
                    ]
                }
            ]
        })
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.error?.message || `Gemini API error with status ${response.status}`)
    }

    const data = await response.json()
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text

    if (!raw) {
        throw new Error("Empty response from Gemini")
    }

    const cleaned = raw.replace(/```json|```/g, "").trim()

    try {
        const bullets = JSON.parse(cleaned)
        if (!Array.isArray(bullets)) {
            throw new Error("Response is not an array")
        }
        return bullets
    } catch {
        throw new Error("Failed to parse AI response into bullet points")
    }
}
