<template>
  <p>Hello {{ currentUser.email }}! you're logged in! <button @click="signOut">Sign out</button></p>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  computed: {
    ...mapGetters('authentication', ['currentUser']),
  },
  methods: {
    async signOut() {
      await this.$store.dispatch('authentication/signOut');
      this.$router.push({ path: '/' });
    }
  }
}
</script>