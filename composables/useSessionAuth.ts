// composables/useSessionAuth.ts
import type { User } from '@/types/session';

export const useSessionAuth = () => {
    const user = useCookie('user-token');

    const isAuthenticated = computed(() => {
        return !!user.value;
    });

    return {
        isAuthenticated
    };
};