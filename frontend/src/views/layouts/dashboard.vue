<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  async created() {
    await this.ensureUserAuthentication();
  },
  methods: {
    async ensureUserAuthentication() {
      if (this.$store.getters['authentication/status'] === 'idle'){
        await this.$store.dispatch('authentication/checkAuthentication');
        if (!this.$store.getters['authentication/isSignedIn']) {
          await this.$store.dispatch('authentication/signOut');
          this.$router.push({ path: '/' });
        }
      }
    }
  }
}
</script>