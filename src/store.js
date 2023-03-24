import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    actions: {
        // 异步操作函數
    },
    getters: {
        // 狀態計算函數
    },
    state: {
        loggedIn: false,
        username: '',
    },
    mutations: {
        login(state, username) {
            state.loggedIn = true;
            state.username = username;
        },
        logout(state) {
            state.loggedIn = false;
            state.username = '';
        },
    },
});