import { GoogleGenerativeAI } from "@google/generative-ai";
import logger from './logger';

const apiKey = process.env.GEMINI_API_KEY || "MOCK_KEY";
const genAI = new GoogleGenerativeAI(apiKey);

export async function classifyEvent(summary: string, description: string) {
  try {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY') {
      return fallbackClassifier(summary, description);
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
      Analyze the following calendar event and classify it into one of these categories: [Travel, Medical, Social, Deep Work, Personal, Meeting].
      Recommend buffer times and any necessary preparation tasks.
      
      Summary: ${summary}
      Description: ${description}

      Return ONLY a JSON object with the following schema:
      {
        "category": "string",
        "buffer_before_minutes": number,
        "buffer_after_minutes": number,
        "prep_task": "string | null",
        "prep_duration_minutes": number,
        "reason": "string"
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return JSON.parse(text);
  } catch (error) {
    logger.error("Error calling Gemini API:", error);
    return fallbackClassifier(summary, description);
  }
}

function fallbackClassifier(summary: string, description: string) {
  const s = summary.toLowerCase();
  
  if (s.includes('flight') || s.includes('departure')) {
    return {
      category: 'Travel',
      buffer_before_minutes: 120,
      buffer_after_minutes: 60,
      prep_task: 'Pack for flight',
      prep_duration_minutes: 90,
      reason: 'Detected flight event via keyword matching'
    };
  }

  if (s.includes('doctor') || s.includes('dentist') || s.includes('appointment') || s.includes('medical')) {
    return {
      category: 'Medical',
      buffer_before_minutes: 30,
      buffer_after_minutes: 15,
      prep_task: 'Prepare medical history',
      prep_duration_minutes: 15,
      reason: 'Detected medical appointment via keyword matching'
    };
  }

  if (s.includes('lunch') || s.includes('dinner') || s.includes('party') || s.includes('coffee')) {
    return {
      category: 'Social',
      buffer_before_minutes: 15,
      buffer_after_minutes: 15,
      prep_task: null,
      prep_duration_minutes: 0,
      reason: 'Detected social event via keyword matching'
    };
  }

  return {
    category: 'Other',
    buffer_before_minutes: 0,
    buffer_after_minutes: 0,
    prep_task: null,
    prep_duration_minutes: 0,
    reason: 'Generic event'
  };
}
