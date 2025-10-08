import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
    // In a real app, you might want to show this error to the user in a more graceful way.
    // For this tool, we'll assume the key is set and throw an error if not.
    console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const CODE_REVIEW_PROMPT = `
You are an expert senior software engineer and an automated code review assistant.
Your task is to analyze the provided code snippet and give detailed, constructive feedback.

Analyze the code for the following:
1.  **Potential Bugs:** Identify any logic errors, race conditions, or edge cases that could lead to bugs.
2.  **Performance Issues:** Suggest optimizations for slow or inefficient code.
3.  **Readability & Maintainability:** Comment on code clarity, naming conventions, and overall structure.
4.  **Best Practices & Style:** Check for adherence to language-specific best practices and common style guides.
5.  **Security Vulnerabilities:** Point out any potential security risks (e.g., injection flaws, insecure handling of data).

Provide your feedback in Markdown format. Structure your review with the following sections:
- ### Overall Summary
- ### Potential Bugs
- ### Performance Improvements
- ### Readability & Maintainability
- ### Best Practices & Style
- ### Security Concerns

For each point, explain the issue clearly and provide a code suggestion for how to fix it, if applicable.
If a section has no issues, state "No issues found."
Be concise and actionable.
`;

export const reviewCode = async (code: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: code,
            config: {
                systemInstruction: CODE_REVIEW_PROMPT,
            }
        });

        return response.text;
    } catch (error) {
        console.error("Error reviewing code with Gemini:", error);
        if (error instanceof Error) {
            return `An error occurred while reviewing the code: ${error.message}`;
        }
        return "An unknown error occurred while reviewing the code.";
    }
};