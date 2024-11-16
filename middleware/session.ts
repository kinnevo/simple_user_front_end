// middleware/session.ts
export default defineNuxtRouteMiddleware(async (to) => {
    const authStore = useAuthStore();
    const sessionStore = useSessionStore();

    console.log('Auth status:', authStore.isAuthenticated);

    if (!authStore.isAuthenticated) {
        console.log('Not authenticated, redirecting to login');
        return navigateTo('/login');
    }

    const sessionId = to.query.sessionId as string;

    if (sessionId && !sessionStore.isSessionActive) {
        try {
            await sessionStore.loadSession(sessionId);
        } catch (error) {
            return navigateTo('/');
        }
    }
});