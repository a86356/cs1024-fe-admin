import state from './state';
import mutations from './mutations';
import actions from './actions';
import getters from './getters';

export default {
  namespaced: 'breadcrumb',  //多出的一行
  state,
  mutations,
  actions,
  getters
};
