// store/session.ts
import { defineStore } from 'pinia';

interface SessionState {
    session: string | null;
    user: any | null;
    stage: number;
    loading: boolean;
}

interface StageData {
    stage: number;
}

const MAX_STAGES = 7; // adjust number as needed

export const useSessionStore = defineStore('session', {
    state: (): SessionState => ({
        session: null,
        user: null,
        stage: 1,
        loading: false
    }),

    getters: {
        isSessionActive: (state) => state.session !== null,
        canMoveNext(): boolean {
            return this.stage < MAX_STAGES;
        },
        canMovePrevious(): boolean {
            return this.stage > 1;
        }
    },

    actions: {
        setSession(sessionData: any) {
            this.session = sessionData.sessionId
            this.user = sessionData.user
            this.stage = sessionData.stage || 1
        },

        clearSession() {
            this.session = null
            this.user = null
            this.stage = 1
        },

        async moveStage(direction: 'next' | 'previous') {
            if (direction === 'next' && !this.canMoveNext) return;
            if (direction === 'previous' && !this.canMovePrevious) return;

            this.loading = true;
            try {
                const newStage = direction === 'next' ? this.stage + 1 : this.stage - 1;
                await fetch(`/api/sessions/${this.session}/stage`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ stage: newStage })
                });
                this.stage = newStage;
            } finally {
                this.loading = false;
            }
        },

        async updateStage(data: StageData) {
            this.loading = true;
            try {
                await fetch(`/api/sessions/${this.session}/stage`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                this.stage = data.stage;
            } finally {
                this.loading = false;
            }
        },

        async loadSession(sessionId: string) {
            this.loading = true;
            try {
                const response = await fetch(`/api/sessions/${sessionId}`); // adjust API endpoint as needed
                this.session = await response.json();
            } finally {
                this.loading = false;
            }
        },

        async createSession() {
            const response = await fetch('/api/sessions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const data = await response.json()
            this.setSession(data.sessionId)
            return data.sessionId
        },

        logout() {
            this.user = null;
            this.session = null;
            navigateTo('/login');
        },
    }
});