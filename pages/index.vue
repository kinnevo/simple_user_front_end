<template>
    <div class="container">
        <h1>Welcome to Our Site</h1>
        <p>This is the home page of our application.</p>

        <nav class="menu">
            <NuxtLink v-if="sessionStore?.session" :to="`/stage/1?sessionId=${sessionStore?.session?.id}`"
                class="menu-item">
                This is the section for a logged in user

                Go to Stage 1
            </NuxtLink>
            <p v-else>Please log in to access stages</p>
        </nav>
    </div>
</template>

<script setup>
import { useSessionStore } from '~/stores/session';
const sessionStore = useSessionStore() || {};
</script>

<style scoped>
.menu {
    margin-top: 2rem;
}

.menu-item {
    padding: 0.5rem 1rem;
    background-color: #4CAF50;
    color: white;
    text-decoration: none;
    border-radius: 4px;
}
</style>
