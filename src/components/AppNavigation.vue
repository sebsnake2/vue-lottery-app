<template>
  <nav class="navigation">
    <RouterLink to="/">
      Home
    </RouterLink>

    <RouterLink to="/about">
      About
    </RouterLink>

    <RouterLink to="/users">
      Users
    </RouterLink>

    <RouterLink to="/login">
      Login
    </RouterLink>
  </nav>
</template>

<style scoped lang="scss">
.navigation {
  display: flex;
  gap: 1.25rem;

  a {
    color: rgba(255, 255, 255, 0.75);
    text-decoration: none;
  }

  a:hover,
  a.router-link-active {
    color: #fff;
  }

  a.router-link-active {
    font-weight: 600;
  }
}
</style>