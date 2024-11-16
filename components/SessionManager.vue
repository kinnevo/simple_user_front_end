// components/SessionManager.vue
<template>
    <div class="p-4">
        <div v-if="!sessionStore.sessionId">
            <button @click="handleCreateSession" class="bg-blue-500 text-white px-4 py-2 rounded"
                :disabled="sessionStore.loading">
                Start New Session
            </button>
        </div>

        <div v-else class="space-y-4">
            <div class="flex space-x-4 items-center">
                <button @click="() => handleMoveStage('previous')"
                    :disabled="sessionStore.currentStage === 1 || sessionStore.loading"
                    class="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50">
                    Previous
                </button>

                <span class="text-lg font-bold">
                    Stage {{ sessionStore.currentStage }}
                </span>

                <button @click="() => handleMoveStage('next')"
                    :disabled="sessionStore.currentStage === 3 || sessionStore.loading"
                    class="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50">
                    Next
                </button>
            </div>

            <div class="border p-4 rounded">
                <h2 class="text-xl font-bold mb-4">Stage {{ sessionStore.currentStage }} Data</h2>
                <textarea v-model="stageData" class="w-full h-32 p-2 border rounded"
                    placeholder="Enter stage data as JSON"></textarea>
                <button @click="saveStageData" :disabled="sessionStore.loading"
                    class="mt-2 bg-green-500 text-white px-4 py-2 rounded">
                    Save Stage Data
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useSessionStore } from '@/store/session';
import type { StageDirection } from '@/types/session';

const sessionStore = useSessionStore();
const stageData = ref('{}');

watch(() => sessionStore.currentStage, () => {
    stageData.value = JSON.stringify(
        sessionStore.stages[sessionStore.currentStage] || {},
        null,
        2
    );
});

const handleCreateSession = async (): Promise<void> => {
    try {
        await sessionStore.createSession();
    } catch (error) {
        console.error('Failed to create session:', error);
    }
};

const handleMoveStage = async (direction: StageDirection): Promise<void> => {
    try {
        await sessionStore.moveStage(direction);
    } catch (error) {
        console.error('Failed to move stage:', error);
    }
};

const saveStageData = async (): Promise<void> => {
    try {
        const parsedData = JSON.parse(stageData.value);
        await sessionStore.updateStage(sessionStore.currentStage, parsedData);
    } catch (error) {
        console.error('Error saving stage data:', error);
        alert('Invalid JSON data');
    }
};
</script>