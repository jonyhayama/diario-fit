<template>
  <form @submit.prevent="handleSubmit">
    <div v-if="status === 'error' && !!error">
      {{ error }}
    </div>

    <label>User</label>
    <input type="email" v-model="user.email" />

    <label>Password</label>
    <input type="password" v-model="user.password" />

    <button type="submit" :disabled="['processing'].includes(status)">Login</button>
  </form>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      user: {
        email: '',
        password: ''
      }
    }
  },
  computed: {
    ...mapGetters('authentication', ['status', 'error', 'isSignedIn'])
  },
  methods: {
    async handleSubmit() {
      await this.$store.dispatch('authentication/signIn', this.user);
      if( this.isSignedIn ) {
        this.$router.push({ name: 'dashboard' });
      }
    }
  }
}
</script>