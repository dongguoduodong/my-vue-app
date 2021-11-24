import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user_id: 123
  },
  modules: {
    app,
    settings,
    user
  },
  getters
})