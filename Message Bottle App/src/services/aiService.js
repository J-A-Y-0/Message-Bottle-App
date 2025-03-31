import { api } from './api';

const OPENAI_API_KEY = 'YOUR_API_KEY'; // In production, this should be stored securely
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// AI service for chat functionality
export const aiService = {
  // Analyze chat history and generate personality
  analyzePersonality: async (messages) => {
    try {
      const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'Analyze the following chat history and create a personality profile. Include traits, speaking style, and common phrases.'
            },
            {
              role: 'user',
              content: JSON.stringify(messages)
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      });

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error analyzing personality:', error);
      throw new Error('Failed to analyze personality');
    }
  },

  // Generate AI response based on personality and context
  generateResponse: async (personality, context, lastMessage) => {
    try {
      const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: `You are an AI with the following personality: ${personality}. 
                       Respond in a way that matches this personality and maintains conversation context.`
            },
            {
              role: 'user',
              content: `Context: ${context}\nLast message: ${lastMessage}`
            }
          ],
          temperature: 0.8,
          max_tokens: 150
        })
      });

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error generating response:', error);
      throw new Error('Failed to generate response');
    }
  }
}; 