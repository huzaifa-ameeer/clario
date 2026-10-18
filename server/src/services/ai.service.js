const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models"

const DEFAULT_MODELS = [
    "gemini-3.8-flash",
    "gemini-3.7-flash",
    "gemini-3.6-flash",
    "gemini-3.5-flash"
]

const getModels = () => {
    const fromEnv = process.env.GEMINI_MODELS
        ?.split(",")
        .map((model) => model.trim())
        .filter(Boolean)

    return fromEnv?.length ? fromEnv : DEFAULT_MODELS
}


const buildPrompt = (text) => {
  return `You are an expert document analyst. Read the document below and turn it into a set of sharp, engaging bullet points.

Rules:
- Return a short, catchy title that captures the essence of the document.
- Return 8 to 12 bullet points.
- Each bullet must be one single line (max ~20 words), punchy and straight to the point.
- Lead with the insight, fact, number, or takeaway — no filler like "This document says" or "It is important to note".
- Use strong, active language; make every bullet feel valuable on its own.
- Cover the key ideas, facts, findings, conclusions, and action items in order of importance.
- Surface interesting numbers, comparisons, or surprises when present.
- Do not invent information that is not in the document.
- No markdown, no asterisks, no numbering inside the bullet text — plain sentences only.
- Return valid JSON only, with no explanation outside the JSON.

Required JSON structure:
{
  "title": "A catchy title for the document",
  "bullets": [
    "First powerful bullet point.",
    "Second powerful bullet point."
  ]
}

Document content:
"""
${text}
"""`;
};


const callModel = async (model, text) => {
    const response = await fetch(`${GEMINI_API_URL}/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`, {
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

    const parsed = JSON.parse(cleaned)

    if (
        !parsed ||
        typeof parsed !== "object" ||
        typeof parsed.title !== "string" ||
        !Array.isArray(parsed.bullets) ||
        parsed.bullets.length === 0
    ) {
        throw new Error("Unexpected AI response format")
    }

    return parsed
}

export const analyzeText = async (text) => {
    if (!text || !text.trim()) {
        throw new Error("No text content to analyze")
    }

    const models = getModels()
    const errors = []

    for (const model of models) {
        try {
            return await callModel(model, text)
        } catch (error) {
            errors.push(`${model}: ${error.message}`)
        }
    }

    throw new Error(`All Gemini models failed. ${errors.join(" | ")}`)
}
