import { GoogleGenAI, Type } from "@google/genai";

export const generateCreativeGroupNames = async (
  groupsOfNames: string[][]
): Promise<string[]> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.warn("Gemini API Key is missing. Skipping AI generation.");
      return groupsOfNames.map((_, i) => `Team ${i + 1}`);
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
      I have divided people into ${groupsOfNames.length} teams.
      Here are the members for each team:
      ${JSON.stringify(groupsOfNames)}
      
      Please generate a creative, fun, and motivating team name for each group based on a random cohesive theme (e.g., Animals, Space, Superheroes, Elements, Colors).
      Return ONLY a JSON array of strings containing the team names in the same order.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];

    return JSON.parse(text) as string[];

  } catch (error) {
    console.error("Failed to generate group names:", error);
    // Fallback names if AI fails
    return groupsOfNames.map((_, i) => `Team ${i + 1}`);
  }
};
