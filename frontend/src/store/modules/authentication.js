import Api from "@/services/api";

export default {
  namespaced: true,
  state: {
    currentUser: {},
    signedIn: false,
    status: 'idle',
    error: ''
  },
  getters: {
    currentUser: (state) => state.currentUser,
    isSignedIn: (state) => state.signedIn,
    status: (state) => state.status,
    error: (state) => state.error
  },
  actions: {
    async signIn({ commit, dispatch }, params) {
      commit('SET_STATUS', 'processing');
      try{
        const { data } = await Api.plain.post('signin', params);
        if (!data.csrf) {
          throw { response: { data: { error: "Token not found" } } }
        }
        
        localStorage.csrf = data.csrf;
        localStorage.signedIn = true;
        dispatch('fetchCurrentUser');
        commit('SET_SIGNED_IN', true);
      } catch (err) {
        const error = err?.response?.data?.error || 'Unknown error';
        commit('SET_STATUS', 'error');
        commit('SET_SIGNED_IN', false);
        commit('SET_ERROR', error);
      }
    },

    async checkAuthentication({ dispatch, commit, getters }){
      if (!localStorage.signedIn || !localStorage.csrf){
        commit('RESET_USER');
        return;
      }

      await dispatch('fetchCurrentUser');
      if (getters.currentUser?.email) {
        commit('SET_SIGNED_IN', true);
      } else {
        commit('RESET_USER');
      }
    },

    async fetchCurrentUser({ commit }) {
      commit('SET_STATUS', 'processing');
      try{
        const { data } = await Api.secured.get('v1/me');
        
        commit('SET_STATUS', 'success');
        commit('SET_CURRENT_USER', data);
      } catch (err) {
        const error = err?.response?.data?.error || 'Unknown error';
        commit('SET_STATUS', 'error');
        commit('SET_ERROR', error);
        commit('SET_CURRENT_USER', {});
      }
    },

    async signOut({ commit }) {
      commit('SET_STATUS', 'processing');
      await Api.secured.delete('signin');

      commit('SET_STATUS', 'success');
      commit('SET_SIGNED_IN', false);
      commit('SET_CURRENT_USER', {});
    }
  },
  mutations: {
    SET_CURRENT_USER(state, user) {
      state.currentUser = user;
    },
    SET_SIGNED_IN(state, signedIn) {
      state.signedIn = signedIn;
    },
    SET_STATUS(state, status) {
      state.status = status;
    },
    SET_ERROR(state, message) {
      state.error = message;
    },
    RESET_USER(state) {
      state.currentUser = {};
      state.status = 'success';
    }
  },
};
