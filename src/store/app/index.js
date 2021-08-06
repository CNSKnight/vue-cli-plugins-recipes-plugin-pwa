import { findIndex } from 'lodash/fp';

const state = {
  notifications: [],
};

const getters = {
  notifications: (state) => state.notifications,
  notifsByActionContext:
    ({ notifications }) =>
    (actionContext) =>
      notifications.filter((notif) => notif.actionContext == actionContext),
};

const sevMap = {
  fatal: 'failed',
  info: '',
  error: 'reported',
};

const actions = {
  handleError(
    { commit },
    { service, severity, error, actionContext, timeout }
  ) {
    let errMsg;
    service = `${service} ${sevMap[severity] || ''}`;
    if (error instanceof Response) {
      const err = error.message || JSON.stringify(error);
      errMsg = err.status += (err.statusText && ` - ${err.statusText}`) || '';
    } else {
      errMsg = error.message || error.toString();
    }
    const cancelAt = timeout && Date.now() + timeout;
    commit('notify', {
      service,
      severity: severity || 'error',
      message: errMsg,
      actionContext,
      cancelAt,
    });
    if (cancelAt) {
      setTimeout(() => {
        commit('notify', { service, cancelAt });
      }, timeout);
    }
  },

  clearNotifs({ commit }) {
    commit('clearState');
  },

  // pass in eg {actionContext: 'sample-context'} or {service: 'abc:xyz'}
  clearNotif({ state, commit }, matches) {
    const idx = findIndex(matches)(state.notifications);
    if (idx != -1) {
      commit('ejectIndex', idx);
    }
  },
};

const mutations = {
  notify(state, payload) {
    let notifs = [...state.notifications];
    const idx = findIndex(payload)(notifs);
    if (idx > -1) {
      notifs.splice(idx, 1);
    }
    payload.message && notifs.push(payload);
    state.notifications = notifs;
  },
  ejectIndex(state, idx) {
    let notifs = [...state.notifications];
    notifs.splice(idx, 1);
    state.notifications = notifs;
  },
  clearState(state) {
    state.notifications = [];
  },
};

// appModule
export default {
  state,
  getters,
  actions,
  mutations,
};
