import { findIndex } from 'lodash';

const state = {
  notifications: []
};

const getters = {
  notifications: state => state.notifications,
  notifsByActionContext: ({ notifications }) => actionContext =>
    notifications.filter(notif => notif.actionContext == actionContext)
};

const sevMap = {
  fatal: 'failed',
  info: '',
  error: 'reported'
};

const actions = {
  handleError(
    { commit },
    { service, severity, error, actionContext, timeout }
  ) {
    let errMsg = `${service} ${sevMap[severity] || ''}: `;
    if (error instanceof Response) {
      const err = error.error || JSON.stringify(error);
      errMsg += err.status += (err.statusText && ` - ${err.statusText}`) || '';
    } else {
      errMsg += error.message || error.toString();
    }
    const cancelAt = timeout && Date.now() + timeout;
    commit('notify', {
      service,
      severity: severity || 'error',
      error: errMsg,
      actionContext,
      cancelAt
    });
    if (cancelAt) {
      setTimeout(() => {
        commit('notify', { service, cancelAt });
      }, timeout);
    }
  }
};

const mutations = {
  notify(state, payload) {
    let notifs = [...state.notifications];
    const idx = findIndex(notifs, payload);
    if (idx > -1) {
      notifs.splice(idx, 1);
    }
    payload.error && notifs.push(payload);
    state.notifications = notifs;
  }
};

// appModule
export default {
  state,
  getters,
  actions,
  mutations
};
