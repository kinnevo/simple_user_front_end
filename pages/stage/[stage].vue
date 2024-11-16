// pages/stage/[stage].vue
<template>
    <div class="container mx-auto px-4 py-8">
        <div class="mb-8">
            <div class="flex items-center justify-between">
                <h1 class="text-2xl font-bold">Stage {{ stage }}</h1>
                <div class="flex items-center space-x-4">
                    <span class="text-gray-600">{{ user?.name }}</span>
                    <button @click="logout" class="text-red-500">
                        Logout
                    </button>
                </div>
            </div>

            <div class="flex space-x-4 mt-4">
                <button v-if="canMovePrevious" @click="handleMove('previous')" :disabled="loading"
                    class="px-4 py-2 bg-gray-500 text-white rounded">
                    Previous Stage
                </button>

                <button v-if="canMoveNext" @click="handleMove('next')" :disabled="loading"
                    class="px-4 py-2 bg-blue-500 text-white rounded">
                    Next Stage
                </button>
            </div>
        </div>

        <StageContent :stage="stage" :data="{
            stage: stage,
            // Add any other required data properties
        }" @update="handleUpdate" />
    </div>
</template>

<script setup lang="ts">
import { useSessionStore } from '@/stores/session';
import { useSessionAuth } from '@/composables/useSessionAuth';
import type { StageData } from '@/types/session';

const route = useRoute();
const router = useRouter();
const sessionStore = useSessionStore();
const { isAuthenticated } = useSessionAuth();
const user = computed(() => sessionStore.user);
const logout = () => {
    sessionStore.logout()
    router.push('/logout')
}

const stage = parseInt(route.params.stage as string);
const loading = computed(() => sessionStore.loading);
const currentStageData = computed(() => sessionStore.stage);
const canMoveNext = computed(() => sessionStore.canMoveNext);
const canMovePrevious = computed(() => sessionStore.canMovePrevious);

const handleMove = async (direction: 'next' | 'previous') => {
    try {
        await sessionStore.moveStage(direction);
        const newStage = direction === 'next' ? stage + 1 : stage - 1;
        await router.push(`/stage/${newStage}?sessionId=${sessionStore.session?.id}`);
    } catch (error) {
        console.error('Failed to move stage:', error);
    }
};

const handleUpdate = async (data: StageData) => {
    try {
        console.log('Update data:', data);
        await sessionStore.updateStage(data.stage);
    } catch (error) {
        console.error('Failed to update stage:', error);
    }
};

definePageMeta({
    middleware: ['session']
});
</script>
