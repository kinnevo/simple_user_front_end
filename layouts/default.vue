<template>
    <div>
        <!-- Top Ribbon Menu -->
        <nav class="navbar">
            <ul class="menu">
                <li><a href="/">Home</a></li>
                <li><a href="/fast_innovation">Fast Innovation</a></li>
                <li><a href="/about">About</a></li>
            </ul>
            <div class="auth-buttons">
                <nuxt-link to="/login">Login</nuxt-link>
            </div>
        </nav>
    </div>
</template>




<style scoped>
.navbar {
    display: flex;
    justify-content: space-between;
    background-color: #2c3e50;
    padding: 10px;
    color: white;
}

.menu {
    display: flex;
    list-style-type: none;
    margin: 0;
    padding: 0;
}

.menu li {
    margin-right: 15px;
}

.menu li a {
    color: white;
    text-decoration: none;
}

.auth-buttons {
    display: flex;
    align-items: center;
}

.auth-buttons a {
    color: white;
    margin-left: 10px;
    text-decoration: none;
}

.container {
    padding: 2rem;
}

.navigation {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
}

.nav-link {
    text-decoration: none;
    color: #333;
    padding: 0.5rem 1rem;
    border-radius: 4px;
}

.nav-link:hover {
    background-color: #f0f0f0;
}
</style>