// components/StageContent.vue
<template>
    <div class="space-y-4">
        <div v-if="stage === 1">
            <h2 class="text-xl font-semibold mb-4">Stage 1: Técnica Persona</h2>
            <!-- Add your stage 1 specific content -->
            <img src="/images/1_tecnica_persona.png" alt="Stage 1" class="w-full h-auto">
            <!--
            <ChatBox />
            -->
        </div>

        <div v-else-if="stage === 2">
            <h2 class="text-xl font-semibold mb-4">Stage 2: Mapa de Empatía</h2>
            <!-- Add your stage 2 specific content -->
            <img src="/images/2_mapa_empatia.png" alt="Stage 2" class="w-full h-auto">
        </div>

        <div v-else-if="stage === 3">
            <h2 class="text-xl font-semibold mb-4">Stage 3: Jobs to be Done(JTBD)</h2>
            <!-- Add your stage 3 specific content -->
        </div>

        <div v-else-if="stage === 4">
            <h2 class="text-xl font-semibold mb-4">Stage 4: What if...</h2>
            <!-- Add your stage 4 specific content -->
        </div>

        <div v-else-if="stage === 5">
            <h2 class="text-xl font-semibold mb-4">Stage 5: Value Proposition Canvas</h2>
            <!-- Add your stage 5 specific content -->
        </div>

        <div v-else-if="stage === 6">
            <h2 class="text-xl font-semibold mb-4">Stage 6: OKRs</h2>
            <!-- Add your stage 6 specific content -->
        </div>

        <div v-else-if="stage === 7">
            <h2 class="text-xl font-semibold mb-4">Stage 7: Experiments</h2>
            <!-- Add your stage 7 specific content -->
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
