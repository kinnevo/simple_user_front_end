// components/StageContent.vue
<template>
    <div class="space-y-4">
        <div v-if="stage === 1">
            <h2 class="text-xl font-semibold mb-4">Stage 1: Técnica Persona</h2>
            <!-- Add your stage 1 specific content -->
            <table class="w-full">
                <tbody>
                    <tr>
                        <td class="w-1/2">
                            <img src="/images/1_tecnica_persona.png" alt="Stage 1" class="w-full h-auto">
                        </td>
                        <td class="w-1/2">
                            <ChatBox systemPromptID="Técnica Persona" />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-else-if="stage === 2">
            <h2 class="text-xl font-semibold mb-4">Stage 2: Mapa de Empatía</h2>
            <!-- Add your stage 2 specific content -->
            <table class="w-full">
                <tbody>
                    <tr>
                        <td class="w-1/2">
                            <img src="/images/2_mapa_empatia.png" alt="Stage 2" class="w-full h-auto">
                        </td>
                        <td class="w-1/2">
                            <ChatBox systemPromptID="JTBD" />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-else-if="stage === 3">
            <h2 class="text-xl font-semibold mb-4">Stage 3: Jobs to be Done(JTBD)</h2>
            <!-- Add your stage 3 specific content -->
            <table class="w-full">
                <tbody>
                    <tr>
                        <td class="w-1/2">
                            <img src="/images/3_jtbd.png" alt="Stage 4" class="w-full h-auto">
                        </td>
                        <td class="w-1/2">
                            <ChatBox systemPromptID="what_if" />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-else-if="stage === 4">
            <h2 class="text-xl font-semibold mb-4">Stage 4: What if...</h2>
            <!-- Add your stage 4 specific content -->
            <table class="w-full">
                <tbody>
                    <tr>
                        <td class="w-1/2">
                            <img src="/images/4_what_if.png" alt="Stage 4" class="w-full h-auto">
                        </td>
                        <td class="w-1/2">
                            <ChatBox systemPromptID="what_if" />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-else-if="stage === 5">
            <h2 class="text-xl font-semibold mb-4">Stage 5: Value Proposition Canvas</h2>
            <!-- Add your stage 5 specific content -->
            <table class="w-full">
                <tbody>
                    <tr>
                        <td class="w-1/2">
                            <img src="/images/5_value_proposition_canvas.png" alt="Stage 5" class="w-full h-auto">
                        </td>
                        <td class="w-1/2">
                            <ChatBox systemPromptID="JTBD" />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-else-if="stage === 6">
            <h2 class="text-xl font-semibold mb-4">Stage 6: OKRs</h2>
            <!-- Add your stage 6 specific content -->
            <table class="w-full">
                <tbody>
                    <tr>
                        <td class="w-1/2">
                            <img src="/images/6_okr.png" alt="Stage 6" class="w-full h-auto">
                        </td>
                        <td class="w-1/2">
                            <ChatBox systemPromptID="OKR" />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-else-if="stage === 7">
            <h2 class="text-xl font-semibold mb-4">Stage 7: Experiments</h2>
            <!-- Add your stage 7 specific content -->
            <table class="w-full">
                <tbody>
                    <tr>
                        <td class="w-1/2">
                            <img src="/images/7_experiment.png" alt="Stage 7" class="w-full h-auto">
                        </td>
                        <td class="w-1/2">
                            <ChatBox systemPromptID="Experiment" />
                        </td>
                    </tr>
                </tbody>
            </table>
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
