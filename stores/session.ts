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

const MAX_STAGES = 5; // Adjust this number based on your actual maximum stages

export const useSessionStore = defineStore('session', {
    state: (): SessionState => ({
        session: null,
        user: null,
        stage: 1,
        loading: false
    }),

    getters: {
        isSessionActive: (state) => state.session !== null,
        canMoveNext: (state) => state.stage < MAX_STAGES,
        canMovePrevious: (state) => state.stage > 1
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
            try {
                // Add your API call here if needed
                // Example: await $fetch(`/api/session/${this.session.id}/move`, { 
                //     method: 'POST', 
                //     body: { direction } 
                // });
            } finally {
                this.loading = false;
            }
        },

        async updateStage(data: StageData) {
            this.loading = true;
            try {
                // Assuming you have an API call to update the stage data
                await api.updateStage(this.session?.id, data);
                this.stage = data;
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