/**
 * PromptCraft - AI Service
 * Puter.js integration with AI-generated questions
 */

const AIService = {
    model: 'gpt-4o-mini',

    async init() {
        console.log('AI Service initialized with Puter.js');
    },

    async detectPromptType(prompt) {
        return PromptEngine.detectType(prompt);
    },

    /**
     * Generate context-specific questions using AI
     */
    async generateQuestions(prompt, type) {
        const typeLabel = PromptEngine.getTypeLabel(type);

        const systemPrompt = `You are a prompt engineering expert. Your task is to generate 4-5 clarifying questions that will help create a more detailed and effective prompt.

RULES:
1. Generate questions SPECIFIC to the user's prompt, not generic questions
2. Each question should help uncover important details missing from the prompt
3. Questions should be in JSON format with types: "mcq", "yesno", or "chips"
4. MCQ questions should have 3-5 relevant options based on the context
5. Chips allow multiple selections and should have 4-7 options
6. Make questions easy to answer with clicks, not typing

RESPONSE FORMAT (valid JSON array only, no markdown):
[
  {
    "id": "unique_id",
    "type": "mcq",
    "question": "Your question here?",
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"]
  },
  {
    "id": "unique_id2",
    "type": "yesno",
    "question": "Yes or no question here?"
  },
  {
    "id": "unique_id3",
    "type": "chips",
    "question": "Select multiple options?",
    "options": ["Tag 1", "Tag 2", "Tag 3", "Tag 4", "Tag 5"],
    "multiSelect": true
  }
]`;

        const userMessage = `User's prompt: "${prompt}"
Prompt category: ${typeLabel}

Generate 4-5 clarifying questions SPECIFIC to this prompt that will help create a comprehensive, detailed version. Focus on what's missing or unclear in their request.

Return ONLY the JSON array, no other text.`;

        try {
            const response = await puter.ai.chat([
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userMessage }
            ], { model: this.model });

            const text = typeof response === 'string' ? response :
                response?.message?.content || String(response);

            // Parse JSON from response
            const jsonMatch = text.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                const questions = JSON.parse(jsonMatch[0]);
                return this.validateQuestions(questions);
            }

            throw new Error('Invalid response format');
        } catch (error) {
            console.error('AI Question generation error:', error);
            // Fallback to basic questions if AI fails
            return this.getFallbackQuestions(type);
        }
    },

    validateQuestions(questions) {
        return questions.map((q, index) => ({
            id: q.id || `q_${index}`,
            type: ['mcq', 'yesno', 'chips'].includes(q.type) ? q.type : 'mcq',
            question: q.question || 'Please provide more details',
            options: q.options || ['Option 1', 'Option 2', 'Option 3'],
            multiSelect: q.multiSelect || false
        })).slice(0, 6); // Max 6 questions
    },

    getFallbackQuestions(type) {
        return [
            {
                id: 'detail_level',
                type: 'mcq',
                question: 'How detailed should the result be?',
                options: ['Brief overview', 'Moderate detail', 'Very comprehensive', 'Step-by-step guide']
            },
            {
                id: 'purpose',
                type: 'mcq',
                question: 'What is the main purpose?',
                options: ['Learning/Education', 'Professional work', 'Personal project', 'Quick reference']
            },
            {
                id: 'include_examples',
                type: 'yesno',
                question: 'Should it include examples?'
            }
        ];
    },

    async enhancePrompt(originalPrompt, type, answers) {
        const systemPrompt = PromptEngine.getSystemPrompt(type);
        const userMessage = PromptEngine.buildEnhancementRequest(originalPrompt, type, answers);

        try {
            const response = await puter.ai.chat([
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userMessage }
            ], { model: this.model });

            if (typeof response === 'string') {
                return response.trim();
            } else if (response?.message?.content) {
                return response.message.content.trim();
            }
            return String(response).trim();
        } catch (error) {
            console.error('AI Enhancement error:', error);
            throw new Error('Failed to enhance prompt. Please try again.');
        }
    }
};

window.AIService = AIService;
