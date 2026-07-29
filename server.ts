import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json({ limit: '15mb' }));

// Initialize GoogleGenAI client lazy / guard
function getGenAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is missing.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Teacher Chat API
app.post('/api/teacher/chat', async (req, res) => {
  try {
    const { messages, subject, gradeLevel, style } = req.body;
    const ai = getGenAIClient();

    const systemInstruction = `You are "Professor Maya", a warm, encouraging, highly skilled AI Teacher and Academic Tutor.
Subject Context: ${subject || 'General Studies'}
Grade / Level: ${gradeLevel || 'High School'}
Tutoring Style: ${style || 'Socratic & Interactive'}

Guidelines:
1. Speak with enthusiasm, clarity, and patience.
2. If teaching a step, ask a guiding question at the end to check understanding.
3. Format math formulas cleanly using LaTeX ($...$ for inline, $$...$$ for block).
4. Use clear formatting with Markdown lists and bold text for key terms.
5. Keep explanations digestible, encouraging, and clear.`;

    const contents = (messages || []).map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ response: response.text || 'I apologize, I could not generate a response.' });
  } catch (error: any) {
    console.error('Teacher chat error:', error);
    res.status(500).json({ error: error.message || 'Error processing teacher request' });
  }
});

// Step-by-Step Problem Solver API
app.post('/api/teacher/solve', async (req, res) => {
  try {
    const { problemText, imageBase64, subject, gradeLevel } = req.body;
    const ai = getGenAIClient();

    const systemInstruction = `You are an expert academic problem solver and master teacher.
You will analyze the problem provided and generate a thorough, structured, step-by-step solution.

Format your JSON output strictly according to the requested schema. Ensure formulas use standard LaTeX math syntax.`;

    const parts: any[] = [];
    if (problemText) {
      parts.push({ text: `Subject: ${subject || 'Auto-detect'}\nGrade Level: ${gradeLevel || 'High School'}\n\nProblem Statement:\n${problemText}` });
    }
    if (imageBase64) {
      const mimeMatch = imageBase64.match(/^data:(image\/[a-zA-Z+]+);base64,/);
      const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');
      parts.push({
        inlineData: {
          mimeType,
          data: cleanBase64,
        },
      });
    }

    if (parts.length === 0) {
      res.status(400).json({ error: 'Please provide a problem text or image.' });
      return;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: { parts },
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: 'Short descriptive title of the problem' },
            topic: { type: Type.STRING, description: 'Academic subject or topic area' },
            difficulty: { type: Type.STRING, description: 'Difficulty level (Easy, Medium, Hard, Advanced)' },
            conceptSummary: { type: Type.STRING, description: 'Key core concept or formula required' },
            givenData: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'List of given facts, variables, or conditions',
            },
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  stepNumber: { type: Type.INTEGER },
                  heading: { type: Type.STRING, description: 'Step action summary' },
                  explanation: { type: Type.STRING, description: 'Detailed step-by-step reasoning' },
                  formula: { type: Type.STRING, description: 'LaTeX or math expression if applicable' },
                  tip: { type: Type.STRING, description: 'Helpful hint or common pitfall to avoid' },
                },
                required: ['stepNumber', 'heading', 'explanation'],
              },
            },
            finalAnswer: { type: Type.STRING, description: 'Clear final result or conclusion' },
            verification: { type: Type.STRING, description: 'Quick sanity check or alternative check' },
          },
          required: ['title', 'topic', 'conceptSummary', 'steps', 'finalAnswer'],
        },
      },
    });

    const solutionData = JSON.parse(response.text || '{}');
    res.json(solutionData);
  } catch (error: any) {
    console.error('Solve problem error:', error);
    res.status(500).json({ error: error.message || 'Failed to solve problem' });
  }
});

// Quiz Generator API
app.post('/api/teacher/quiz', async (req, res) => {
  try {
    const { topic, subject, gradeLevel, count } = req.body;
    const ai = getGenAIClient();

    const prompt = `Generate a ${count || 3}-question practice quiz for:
Subject: ${subject || 'General'}
Topic: ${topic || 'General Concepts'}
Grade Level: ${gradeLevel || 'High School'}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              correctOptionIndex: { type: Type.INTEGER },
              explanation: { type: Type.STRING },
              hint: { type: Type.STRING },
            },
            required: ['question', 'options', 'correctOptionIndex', 'explanation'],
          },
        },
      },
    });

    const quizData = JSON.parse(response.text || '[]');
    res.json({ questions: quizData });
  } catch (error: any) {
    console.error('Quiz generator error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate practice quiz' });
  }
});

// Setup Vite or Static File Serving
async function startServer() {
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
