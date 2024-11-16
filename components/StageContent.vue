// components/StageContent.vue
<template>
    <div class="space-y-4">
        <div v-if="stage === 1">
            <h2 class="text-xl font-semibold mb-4">Stage 1: Basic Information</h2>
            <!-- Add your stage 1 specific content -->
        </div>

        <div v-else-if="stage === 2">
            <h2 class="text-xl font-semibold mb-4">Stage 2: Details</h2>
            <!-- Add your stage 2 specific content -->
        </div>

        <div v-else-if="stage === 3">
            <h2 class="text-xl font-semibold mb-4">Stage 3: Confirmation</h2>
            <!-- Add your stage 3 specific content -->
        </div>

        <button @click="saveStageData" class="px-4 py-2 bg-green-500 text-white rounded">
            Save Progress
        </button>
    </div>
</template>

<script setup lang="ts">
import type { StageData } from '@/types/session';

const props = defineProps<{
    stage: number,
    data: Record<string, any>
}>();

const emit = defineEmits<{
    (e: 'update', data: StageData): void;
}>();

const saveStageData = () => {
    // Implement your stage-specific data collection logic
    const stageData: StageData = {
        // Collect and format your stage data
    };
    emit('update', stageData);
};
</script>
