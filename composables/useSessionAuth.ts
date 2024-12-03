// composables/useSessionAuth.ts
import type { Username } from '@/types/session';

export const useSessionAuth = () => {
    const username = useCookie('username');

    const isAuthenticated = computed(() => {
        return !!username.value;
    });

    return {
        isAuthenticated
    };
};