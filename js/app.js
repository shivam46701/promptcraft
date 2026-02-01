/**
 * PromptCraft - Main Application Controller
 */

const App = {
    state: {
        currentStep: 1,
        originalPrompt: '',
        promptType: null, // null means not selected
        questions: [],
        currentQuestionIndex: 0,
        answers: {},
        enhancedPrompt: ''
    },

    elements: {},

    init() {
        this.cacheElements();
        this.bindEvents();
        this.loadHistory();
        AIService.init();
        console.log('PromptCraft initialized');
    },

    cacheElements() {
        this.elements = {
            promptInput: document.getElementById('promptInput'),
            analyzeBtn: document.getElementById('analyzeBtn'),
            detectedType: document.getElementById('detectedType'),
            inputSection: document.getElementById('inputSection'),
            questionsSection: document.getElementById('questionsSection'),
            questionContainer: document.getElementById('questionContainer'),
            questionProgress: document.getElementById('questionProgress'),
            prevQuestion: document.getElementById('prevQuestion'),
            nextQuestion: document.getElementById('nextQuestion'),
            outputSection: document.getElementById('outputSection'),
            enhancedPrompt: document.getElementById('enhancedPrompt'),
            copyBtn: document.getElementById('copyBtn'),
            regenerateBtn: document.getElementById('regenerateBtn'),
            newPromptBtn: document.getElementById('newPromptBtn'),
            loadingOverlay: document.getElementById('loadingOverlay'),
            loadingText: document.getElementById('loadingText'),
            historyToggle: document.getElementById('historyToggle'),
            historySidebar: document.getElementById('historySidebar'),
            historyList: document.getElementById('historyList'),
            clearHistory: document.getElementById('clearHistory'),
            toast: document.getElementById('toast'),
            toastMessage: document.getElementById('toastMessage'),
            categoryChips: document.getElementById('categoryChips')
        };
    },

    bindEvents() {
        // Main actions
        this.elements.analyzeBtn.addEventListener('click', () => this.analyzePrompt());
        this.elements.promptInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.analyzePrompt();
            }
        });

        // Category chips
        this.elements.categoryChips.querySelectorAll('.creator-btn').forEach(chip => {
            chip.addEventListener('click', () => this.selectCategory(chip));
        });

        // Question navigation
        this.elements.prevQuestion.addEventListener('click', () => this.prevQuestion());
        this.elements.nextQuestion.addEventListener('click', () => this.nextQuestion());

        // Output actions
        this.elements.copyBtn.addEventListener('click', () => this.copyToClipboard());
        this.elements.regenerateBtn.addEventListener('click', () => this.regenerate());
        this.elements.newPromptBtn.addEventListener('click', () => this.reset());

        // History
        this.elements.historyToggle.addEventListener('click', () => this.toggleHistory());
        this.elements.clearHistory.addEventListener('click', () => this.clearHistory());

        // Close sidebar on outside click
        document.addEventListener('click', (e) => {
            if (this.elements.historySidebar.classList.contains('open') &&
                !this.elements.historySidebar.contains(e.target) &&
                !this.elements.historyToggle.contains(e.target)) {
                this.elements.historySidebar.classList.remove('open');
            }
        });
    },

    selectCategory(chip) {
        // Remove selected from all chips
        this.elements.categoryChips.querySelectorAll('.creator-btn').forEach(c => {
            c.classList.remove('selected');
        });
        // Add selected to clicked chip
        chip.classList.add('selected');
        this.state.promptType = chip.dataset.type;
    },

    async analyzePrompt() {
        const prompt = this.elements.promptInput.value.trim();
        if (!prompt) {
            this.showToast('Please enter a prompt first');
            return;
        }

        // Check if category is selected
        if (!this.state.promptType) {
            this.showToast('Please select a category (Image, Video, Code, etc.)');
            return;
        }

        this.state.originalPrompt = prompt;
        this.showLoading('Generating personalized questions for your prompt...');

        try {
            // Use selected type (no auto-detection)
            const typeLabel = PromptEngine.getTypeLabel(this.state.promptType);

            // Show selected type
            this.elements.detectedType.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                    <path d="M22 4L12 14.01l-3-3"/>
                </svg>
                Detected: ${PromptEngine.getTypeLabel(this.state.promptType)}
            `;
            this.elements.detectedType.classList.add('visible');

            // Get questions
            this.state.questions = await AIService.generateQuestions(prompt, this.state.promptType);
            this.state.currentQuestionIndex = 0;
            this.state.answers = {};

            this.hideLoading();
            this.showQuestionsSection();
        } catch (error) {
            this.hideLoading();
            this.showToast('Error analyzing prompt. Please try again.');
            console.error(error);
        }
    },

    showQuestionsSection() {
        this.elements.inputSection.classList.add('hidden');
        this.elements.questionsSection.classList.remove('hidden');
        this.renderCurrentQuestion();
    },

    renderCurrentQuestion() {
        const question = this.state.questions[this.state.currentQuestionIndex];
        const currentAnswer = this.state.answers[question.id];

        this.elements.questionContainer.innerHTML = '';
        this.elements.questionContainer.appendChild(
            Questions.renderQuestion(question, currentAnswer)
        );

        // Update progress
        const current = this.state.currentQuestionIndex + 1;
        const total = this.state.questions.length;
        this.elements.questionProgress.textContent = `${current}/${total}`;

        // Update nav buttons
        this.elements.prevQuestion.disabled = this.state.currentQuestionIndex === 0;

        const isLast = this.state.currentQuestionIndex === this.state.questions.length - 1;
        this.elements.nextQuestion.innerHTML = isLast
            ? `Generate <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>`
            : `Next <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5l7 7-7 7"/></svg>`;
    },

    prevQuestion() {
        this.saveCurrentAnswer();
        if (this.state.currentQuestionIndex > 0) {
            this.state.currentQuestionIndex--;
            this.renderCurrentQuestion();
        }
    },

    async nextQuestion() {
        this.saveCurrentAnswer();

        if (this.state.currentQuestionIndex < this.state.questions.length - 1) {
            this.state.currentQuestionIndex++;
            this.renderCurrentQuestion();
        } else {
            await this.generateEnhancedPrompt();
        }
    },

    saveCurrentAnswer() {
        const question = this.state.questions[this.state.currentQuestionIndex];
        const answer = Questions.getAnswer(question.id);
        if (answer !== null) {
            this.state.answers[question.id] = answer;
        }
    },

    async generateEnhancedPrompt() {
        this.showLoading('Crafting your enhanced prompt...');

        try {
            const enhanced = await AIService.enhancePrompt(
                this.state.originalPrompt,
                this.state.promptType,
                this.state.answers
            );

            this.state.enhancedPrompt = enhanced;
            this.elements.enhancedPrompt.textContent = enhanced;

            // Save to history
            Storage.saveToHistory({
                original: this.state.originalPrompt,
                enhanced: enhanced,
                type: this.state.promptType,
                answers: this.state.answers
            });
            this.loadHistory();

            this.hideLoading();
            this.showOutputSection();
        } catch (error) {
            this.hideLoading();
            this.showToast('Error generating prompt. Please try again.');
            console.error(error);
        }
    },

    showOutputSection() {
        this.elements.questionsSection.classList.add('hidden');
        this.elements.outputSection.classList.remove('hidden');
    },

    async copyToClipboard() {
        try {
            await navigator.clipboard.writeText(this.state.enhancedPrompt);
            this.showToast('Copied to clipboard!', 'success');
        } catch (error) {
            this.showToast('Failed to copy');
        }
    },

    async regenerate() {
        await this.generateEnhancedPrompt();
    },

    reset() {
        this.state = {
            currentStep: 1,
            originalPrompt: '',
            promptType: null,
            questions: [],
            currentQuestionIndex: 0,
            answers: {},
            enhancedPrompt: ''
        };

        this.elements.promptInput.value = '';
        this.elements.detectedType.classList.remove('visible');
        this.elements.outputSection.classList.add('hidden');
        this.elements.questionsSection.classList.add('hidden');
        this.elements.inputSection.classList.remove('hidden');

        // Clear category selection
        this.elements.categoryChips.querySelectorAll('.creator-btn').forEach(c => {
            c.classList.remove('selected');
        });

        this.elements.promptInput.focus();
    },

    // History functions
    toggleHistory() {
        this.elements.historySidebar.classList.toggle('open');
    },

    loadHistory() {
        const history = Storage.getHistory();

        if (history.length === 0) {
            this.elements.historyList.innerHTML = `
                <div class="history-empty">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <p>No prompts yet</p>
                </div>
            `;
            return;
        }

        this.elements.historyList.innerHTML = history.map(item => `
            <div class="history-item" data-id="${item.id}">
                <div class="original">${this.escapeHtml(item.original)}</div>
                <div class="enhanced">${this.escapeHtml(item.enhanced.substring(0, 100))}...</div>
                <div class="meta">
                    <span class="type-badge">${PromptEngine.getTypeLabel(item.type)}</span>
                    <span class="date">${this.formatDate(item.timestamp)}</span>
                </div>
            </div>
        `).join('');

        // Bind click events
        this.elements.historyList.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', () => this.loadFromHistory(item.dataset.id));
        });
    },

    loadFromHistory(id) {
        const item = Storage.getHistoryById(id);
        if (!item) return;

        this.state.enhancedPrompt = item.enhanced;
        this.state.originalPrompt = item.original;
        this.state.promptType = item.type;

        this.elements.enhancedPrompt.textContent = item.enhanced;
        this.elements.inputSection.classList.add('hidden');
        this.elements.questionsSection.classList.add('hidden');
        this.elements.outputSection.classList.remove('hidden');
        this.elements.historySidebar.classList.remove('open');
    },

    clearHistory() {
        if (confirm('Clear all prompt history?')) {
            Storage.clearHistory();
            this.loadHistory();
            this.showToast('History cleared');
        }
    },

    // Utilities
    showLoading(text) {
        this.elements.loadingText.textContent = text;
        this.elements.loadingOverlay.classList.remove('hidden');
    },

    hideLoading() {
        this.elements.loadingOverlay.classList.add('hidden');
    },

    showToast(message, type = '') {
        this.elements.toastMessage.textContent = message;
        this.elements.toast.className = 'toast visible' + (type ? ` ${type}` : '');
        setTimeout(() => {
            this.elements.toast.classList.remove('visible');
        }, 3000);
    },

    escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },

    formatDate(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => App.init());
