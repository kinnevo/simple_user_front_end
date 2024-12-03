// stores/session.ts
import { defineStore } from 'pinia';

const MAX_STAGES = 7; // Define maximum number of stages

interface SessionState {
    sessionStage: number;
    sessionId: string | null;
    user: {
        username: string;
    } | null;
    loading: boolean;
}

export const useSessionStore = defineStore('session', {
    state: (): SessionState => ({
        sessionStage: 1,
        sessionId: null,
        user: null,
        loading: false
    }),

    actions: {
        setLoading(value: boolean) {
            this.loading = value;
        },

        async createSession() {
            try {
                const response = await $fetch<{ _id: string }>('http://localhost:8000/api/sessions', {
                    method: 'POST',
                    headers: {
                        'accept': 'application/json',
                    }
                });


                this.sessionId = response._id;
                return response._id;
            } catch (error) {
                console.error('Failed to create session:', error);
                throw error;
            }
        },

        setSession(session: Partial<SessionState>) {
            console.log('Setting session with:', session); // Debug log

            if (session.sessionStage) this.sessionStage = session.sessionStage;
            if (session.sessionId) this.sessionId = session.sessionId;
            if (session.user) this.user = session.user;
        },

        async moveStage(direction: 'next' | 'previous') {
            try {
                const newStage = direction === 'next'
                    ? this.sessionStage + 1
                    : this.sessionStage - 1;

                // Validate stage bounds
                if (newStage < 1 || newStage > MAX_STAGES) {
                    throw new Error(`Cannot move ${direction}. Stage limit reached.`);
                }

                this.setLoading(true);

                // Then call API
                await $fetch(`http://localhost:8000/api/sessions/${this.sessionId}/move/${direction}`, {
                    method: 'PUT',
                    body: JSON.stringify({ stage: newStage }),
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                // Update state after successful API call
                this.sessionStage = newStage;

            } catch (error) {
                console.error(`Failed to move ${direction}:`, error);
                throw error;
            } finally {
                this.setLoading(false);
            }
        },

        clearSession() {
            this.sessionStage = 1;
            this.sessionId = null;
            this.user = null;
        },

        async logout() {
            try {
                if (this.sessionId) {
                    // Call your API to close the session
                    await $fetch(`http://localhost:8000/api/sessions/${this.sessionId}`, {
                        method: 'DELETE'
                    });
                }
            } catch (error) {
                console.error('Error closing session:', error);
            } finally {
                this.clearSession();
            }
        },

        async updateStage(stage: number) {
            this.sessionStage = stage;
            // Add any API calls or additional logic needed
        }
    },

    getters: {
        hasActiveSession: (state) => !!state.sessionId,
        canMoveNext: (state) => state.sessionStage < MAX_STAGES,
        canMovePrevious: (state) => state.sessionStage > 1
    }
});