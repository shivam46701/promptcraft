/**
 * PromptCraft - Dynamic Question System
 * Click-based questions: MCQ, Yes/No, Chips
 */

const Questions = {
    // Question templates by prompt type
    templates: {
        chat: [
            {
                id: 'tone',
                type: 'mcq',
                question: 'What tone should the response have?',
                options: ['Professional & Formal', 'Casual & Friendly', 'Technical & Precise', 'Creative & Engaging', 'Educational & Clear']
            },
            {
                id: 'length',
                type: 'mcq',
                question: 'How detailed should the response be?',
                options: ['Brief (1-2 paragraphs)', 'Moderate (3-5 paragraphs)', 'Comprehensive (detailed explanation)', 'Step-by-step guide']
            },
            {
                id: 'audience',
                type: 'mcq',
                question: 'Who is the target audience?',
                options: ['Beginners / General public', 'Students / Learners', 'Professionals / Experts', 'Technical developers', 'Business executives']
            },
            {
                id: 'examples',
                type: 'yesno',
                question: 'Should the response include examples?'
            },
            {
                id: 'format',
                type: 'chips',
                question: 'What format elements would be helpful?',
                options: ['Bullet points', 'Numbered steps', 'Code snippets', 'Tables', 'Headings', 'Comparisons', 'Analogies'],
                multiSelect: true
            }
        ],
        coding: [
            {
                id: 'language',
                type: 'mcq',
                question: 'What programming language?',
                options: ['Python', 'JavaScript/TypeScript', 'Java', 'C#/.NET', 'Go', 'Rust', 'Other/Multiple']
            },
            {
                id: 'complexity',
                type: 'mcq',
                question: 'What complexity level?',
                options: ['Simple script/function', 'Moderate (multiple functions)', 'Complex (classes/modules)', 'Production-ready architecture']
            },
            {
                id: 'comments',
                type: 'yesno',
                question: 'Include detailed code comments?'
            },
            {
                id: 'errorHandling',
                type: 'yesno',
                question: 'Include error handling and validation?'
            },
            {
                id: 'extras',
                type: 'chips',
                question: 'What additional elements to include?',
                options: ['Unit tests', 'Documentation', 'Type hints', 'Logging', 'Configuration', 'CLI interface'],
                multiSelect: true
            }
        ],
        app: [
            {
                id: 'platform',
                type: 'mcq',
                question: 'What platform is this for?',
                options: ['Web Application', 'Mobile App (iOS/Android)', 'Desktop Application', 'Cross-platform', 'API/Backend Service']
            },
            {
                id: 'stack',
                type: 'mcq',
                question: 'Preferred technology stack?',
                options: ['React/Next.js', 'Vue/Nuxt', 'Angular', 'Flutter/Dart', 'React Native', 'Python/Django/FastAPI', 'Node.js/Express', 'No preference']
            },
            {
                id: 'scale',
                type: 'mcq',
                question: 'Expected scale of the application?',
                options: ['Personal/Hobby project', 'Small team/Startup', 'Medium business', 'Enterprise scale']
            },
            {
                id: 'auth',
                type: 'yesno',
                question: 'Does it need user authentication?'
            },
            {
                id: 'features',
                type: 'chips',
                question: 'Key features to include?',
                options: ['Database', 'Real-time updates', 'File uploads', 'Payments', 'Analytics', 'Admin panel', 'API integration'],
                multiSelect: true
            }
        ],
        image: [
            {
                id: 'style',
                type: 'mcq',
                question: 'What art style do you want?',
                options: ['Photorealistic', 'Digital Art / Illustration', 'Oil Painting / Classical', 'Anime / Manga', 'Minimalist / Flat', '3D Rendered', 'Watercolor / Sketch']
            },
            {
                id: 'mood',
                type: 'mcq',
                question: 'What mood or atmosphere?',
                options: ['Bright & Cheerful', 'Dark & Moody', 'Calm & Serene', 'Energetic & Dynamic', 'Mysterious & Ethereal', 'Warm & Cozy']
            },
            {
                id: 'composition',
                type: 'mcq',
                question: 'What type of composition?',
                options: ['Portrait / Close-up', 'Full scene / Landscape', 'Product shot', 'Abstract / Pattern', 'Character design', 'Environment / Background']
            },
            {
                id: 'lighting',
                type: 'chips',
                question: 'Select lighting preferences:',
                options: ['Natural light', 'Golden hour', 'Dramatic shadows', 'Soft diffused', 'Neon/Cyberpunk', 'Studio lighting', 'Backlit'],
                multiSelect: true
            },
            {
                id: 'quality',
                type: 'chips',
                question: 'Technical quality tags:',
                options: ['4K', '8K', 'Highly detailed', 'Sharp focus', 'Bokeh', 'HDR', 'Octane render'],
                multiSelect: true
            }
        ],
        video: [
            {
                id: 'type',
                type: 'mcq',
                question: 'What type of video?',
                options: ['Cinematic scene', 'Product showcase', 'Animation / Motion graphics', 'Tutorial / Explainer', 'Social media content', 'Music video style']
            },
            {
                id: 'duration',
                type: 'mcq',
                question: 'Approximate duration?',
                options: ['Short (5-15 seconds)', 'Medium (30-60 seconds)', 'Long (1-3 minutes)', 'Extended (3+ minutes)']
            },
            {
                id: 'motion',
                type: 'mcq',
                question: 'Camera movement style?',
                options: ['Static / Locked', 'Smooth pan/tilt', 'Tracking / Follow', 'Drone / Aerial', 'Handheld / Dynamic', 'Time-lapse']
            },
            {
                id: 'audio',
                type: 'yesno',
                question: 'Include audio/music suggestions?'
            },
            {
                id: 'elements',
                type: 'chips',
                question: 'Visual elements to include:',
                options: ['Text overlays', 'Transitions', 'Slow motion', 'Split screen', 'Color grading', 'VFX'],
                multiSelect: true
            }
        ],
        research: [
            {
                id: 'depth',
                type: 'mcq',
                question: 'How deep should the analysis be?',
                options: ['Quick overview', 'Moderate summary', 'In-depth analysis', 'Comprehensive research paper']
            },
            {
                id: 'perspective',
                type: 'mcq',
                question: 'What perspective or approach?',
                options: ['Objective / Neutral', 'Critical analysis', 'Comparative study', 'Historical context', 'Future predictions', 'Practical applications']
            },
            {
                id: 'sources',
                type: 'yesno',
                question: 'Should it reference sources/citations?'
            },
            {
                id: 'data',
                type: 'yesno',
                question: 'Include data, statistics, or metrics?'
            },
            {
                id: 'deliverables',
                type: 'chips',
                question: 'What deliverables do you need?',
                options: ['Executive summary', 'Key findings', 'Recommendations', 'Charts/graphs', 'Action items', 'Bibliography'],
                multiSelect: true
            }
        ]
    },

    getQuestionsForType(type) {
        return this.templates[type] || this.templates.chat;
    },

    renderQuestion(question, currentAnswer = null) {
        const container = document.createElement('div');
        container.className = 'question-item';
        container.dataset.questionId = question.id;

        const title = document.createElement('h3');
        title.className = 'question-title';
        title.textContent = question.question;
        container.appendChild(title);

        switch (question.type) {
            case 'mcq':
                container.appendChild(this.renderMCQ(question, currentAnswer));
                break;
            case 'yesno':
                container.appendChild(this.renderYesNo(question, currentAnswer));
                break;
            case 'chips':
                container.appendChild(this.renderChips(question, currentAnswer));
                break;
        }

        return container;
    },

    renderMCQ(question, currentAnswer) {
        const wrapper = document.createElement('div');
        wrapper.className = 'mcq-options';

        question.options.forEach(option => {
            const optionEl = document.createElement('div');
            optionEl.className = 'mcq-option' + (currentAnswer === option ? ' selected' : '');
            optionEl.dataset.value = option;
            optionEl.innerHTML = `
                <div class="check-circle">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                        <path d="M20 6L9 17l-5-5"/>
                    </svg>
                </div>
                <span>${option}</span>
            `;
            optionEl.addEventListener('click', () => this.selectMCQ(optionEl));
            wrapper.appendChild(optionEl);
        });

        return wrapper;
    },

    renderYesNo(question, currentAnswer) {
        const wrapper = document.createElement('div');
        wrapper.className = 'yesno-container';

        ['Yes', 'No'].forEach(value => {
            const btn = document.createElement('div');
            const isYes = value === 'Yes';
            btn.className = `yesno-btn ${isYes ? 'yes' : 'no'}` + (currentAnswer === value ? ' selected' : '');
            btn.dataset.value = value;
            btn.innerHTML = `
                <div class="icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        ${isYes ? '<path d="M20 6L9 17l-5-5"/>' : '<path d="M18 6L6 18M6 6l12 12"/>'}
                    </svg>
                </div>
                <span>${value}</span>
            `;
            btn.addEventListener('click', () => this.selectYesNo(btn));
            wrapper.appendChild(btn);
        });

        return wrapper;
    },

    renderChips(question, currentAnswer) {
        const wrapper = document.createElement('div');
        wrapper.className = 'chips-container';
        const selected = Array.isArray(currentAnswer) ? currentAnswer : [];

        question.options.forEach(option => {
            const chip = document.createElement('div');
            chip.className = 'chip' + (selected.includes(option) ? ' selected' : '');
            chip.dataset.value = option;
            chip.textContent = option;
            chip.addEventListener('click', () => this.selectChip(chip, question.multiSelect));
            wrapper.appendChild(chip);
        });

        return wrapper;
    },

    selectMCQ(element) {
        element.closest('.mcq-options').querySelectorAll('.mcq-option').forEach(opt => opt.classList.remove('selected'));
        element.classList.add('selected');
    },

    selectYesNo(element) {
        element.closest('.yesno-container').querySelectorAll('.yesno-btn').forEach(btn => btn.classList.remove('selected'));
        element.classList.add('selected');
    },

    selectChip(element, multiSelect) {
        if (multiSelect) {
            element.classList.toggle('selected');
        } else {
            element.closest('.chips-container').querySelectorAll('.chip').forEach(chip => chip.classList.remove('selected'));
            element.classList.add('selected');
        }
    },

    getAnswer(questionId) {
        const container = document.querySelector(`[data-question-id="${questionId}"]`);
        if (!container) return null;

        const mcqSelected = container.querySelector('.mcq-option.selected');
        if (mcqSelected) return mcqSelected.dataset.value;

        const yesnoSelected = container.querySelector('.yesno-btn.selected');
        if (yesnoSelected) return yesnoSelected.dataset.value;

        const chipsSelected = container.querySelectorAll('.chip.selected');
        if (chipsSelected.length > 0) return Array.from(chipsSelected).map(c => c.dataset.value);

        return null;
    }
};

window.Questions = Questions;
