/**
 * PromptCraft - LocalStorage Management
 */

const Storage = {
    KEYS: { HISTORY: 'promptcraft_history', PREFERENCES: 'promptcraft_prefs' },

    saveToHistory(entry) {
        const history = this.getHistory();
        const newEntry = {
            id: Date.now().toString(),
            original: entry.original,
            enhanced: entry.enhanced,
            type: entry.type,
            answers: entry.answers || {},
            timestamp: new Date().toISOString()
        };
        history.unshift(newEntry);
        if (history.length > 50) history.pop();
        localStorage.setItem(this.KEYS.HISTORY, JSON.stringify(history));
        return newEntry;
    },

    getHistory() {
        try {
            const data = localStorage.getItem(this.KEYS.HISTORY);
            return data ? JSON.parse(data) : [];
        } catch (e) { return []; }
    },

    getHistoryById(id) {
        return this.getHistory().find(entry => entry.id === id) || null;
    },

    deleteFromHistory(id) {
        const history = this.getHistory().filter(entry => entry.id !== id);
        localStorage.setItem(this.KEYS.HISTORY, JSON.stringify(history));
    },

    clearHistory() {
        localStorage.setItem(this.KEYS.HISTORY, JSON.stringify([]));
    },

    getPreferences() {
        try {
            const data = localStorage.getItem(this.KEYS.PREFERENCES);
            return data ? JSON.parse(data) : { defaultModel: 'gpt-4o-mini', autoSaveHistory: true };
        } catch (e) { return {}; }
    },

    savePreferences(prefs) {
        localStorage.setItem(this.KEYS.PREFERENCES, JSON.stringify({ ...this.getPreferences(), ...prefs }));
    }
};

window.Storage = Storage;
