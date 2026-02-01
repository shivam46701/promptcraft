/**
 * PromptCraft - Prompt Engineering Engine
 * Builds comprehensive prompts from user answers
 */

const PromptEngine = {
    // System prompts for different categories
    systemPrompts: {
        chat: `You are an expert prompt engineer. Transform the user's simple prompt into a comprehensive, detailed prompt that will get excellent results from AI assistants like ChatGPT or Claude.

Based on the user's preferences, create a prompt that includes:
- Clear role/persona for the AI
- Specific context and background
- Detailed requirements and constraints
- Output format specifications
- Any requested elements (examples, structure, etc.)

Make the enhanced prompt self-contained and ready to copy-paste.`,

        coding: `You are an expert prompt engineer specializing in code generation prompts. Transform the user's simple prompt into a comprehensive prompt that will generate high-quality code.

Based on the user's preferences, create a prompt that includes:
- Specific programming language and version
- Required functionality in detail
- Code structure and organization requirements
- Error handling, validation, and edge cases
- Documentation and commenting style
- Any additional elements requested (tests, types, etc.)

Make the enhanced prompt clear and actionable for code generation.`,

        app: `You are an expert prompt engineer for application development. Transform the user's simple app idea into a comprehensive development prompt.

Based on the user's preferences, create a prompt that includes:
- Detailed application requirements and features
- Technology stack specifications
- Architecture and design patterns
- User authentication and authorization needs
- Database and data model requirements
- API design and integrations
- UI/UX considerations
- Scalability and performance requirements

Make the enhanced prompt suitable for building a complete application.`,

        image: `You are an expert prompt engineer for AI image generation (Midjourney, DALL-E, Stable Diffusion). Transform the user's simple description into a detailed image generation prompt.

Based on the user's preferences, create a prompt that includes:
- Subject description with specific details
- Art style and medium specifications
- Mood, atmosphere, and color palette
- Composition and framing
- Lighting setup and effects
- Technical quality parameters
- Negative prompt suggestions if applicable

Format: Keep the prompt flowing naturally, with technical specs at the end.`,

        video: `You are an expert prompt engineer for AI video generation (Runway, Pika, Sora). Transform the user's simple description into a detailed video generation prompt.

Based on the user's preferences, create a prompt that includes:
- Scene description with specific details
- Camera movement and angles
- Duration and pacing
- Visual style and mood
- Motion and action descriptions
- Transition suggestions
- Audio/music style if applicable
- Technical quality parameters

Make the enhanced prompt suitable for AI video generation tools.`,

        research: `You are an expert prompt engineer for research and analysis tasks. Transform the user's simple query into a comprehensive research prompt.

Based on the user's preferences, create a prompt that includes:
- Clear research objective and scope
- Specific questions to address
- Required depth and perspective
- Data and evidence requirements
- Analysis methodology
- Output format and structure
- Deliverables and key sections

Make the enhanced prompt suitable for thorough research and analysis.`
    },

    buildEnhancementRequest(originalPrompt, promptType, answers) {
        const answersSummary = Object.entries(answers)
            .map(([key, value]) => {
                const displayValue = Array.isArray(value) ? value.join(', ') : value;
                return `- ${this.formatKey(key)}: ${displayValue}`;
            })
            .join('\n');

        return `Original prompt: "${originalPrompt}"

User preferences:
${answersSummary}

Please create an enhanced, comprehensive prompt based on these specifications. Output ONLY the enhanced prompt, nothing else.`;
    },

    formatKey(key) {
        return key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim();
    },

    getSystemPrompt(type) {
        return this.systemPrompts[type] || this.systemPrompts.chat;
    },

    // Detect prompt type from user input
    detectType(prompt) {
        const lower = prompt.toLowerCase();

        const patterns = {
            coding: /\b(code|function|api|script|debug|fix|implement|class|method|algorithm|program|developer|backend|frontend|database|sql|query)\b/,
            app: /\b(app|application|website|platform|system|build|create|develop|clone|dashboard|portal|saas|mobile app|web app)\b/,
            image: /\b(image|picture|photo|illustration|art|draw|design|visual|portrait|landscape|render|3d|painting|anime|realistic)\b/,
            video: /\b(video|animation|footage|clip|scene|cinematic|motion|film|movie|trailer|commercial|vfx)\b/,
            research: /\b(research|analyze|study|report|compare|investigate|explore|explain|understand|review|evaluate|assess)\b/
        };

        for (const [type, pattern] of Object.entries(patterns)) {
            if (pattern.test(lower)) return type;
        }

        return 'chat';
    },

    getTypeLabel(type) {
        const labels = {
            chat: '💬 Chat / Writing',
            coding: '💻 Coding',
            app: '📱 App Building',
            image: '🎨 Image Generation',
            video: '🎬 Video Generation',
            research: '🔬 Research / Analysis'
        };
        return labels[type] || labels.chat;
    }
};

window.PromptEngine = PromptEngine;
