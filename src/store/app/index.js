import { findIndex } from 'lodash';

const state = {
  notifications: []
};

const getters = {
  notifications: state => state.notifications,
  localNotifs: ({ notifications }) => (context) => {
    return notifications.filter(
      notif => notif.context == context
    );
  }
};

const actions = {
  handleError({ commit }, { service, severity, error, context, timeout, parent = context }) {
    let errMsg = service + ' failed: ';
    if (error instanceof Response) {
      const err = error.error || JSON.stringify(error);
      errMsg += `${err.status} - ${err.statusText || ''}`;
    } else {
      errMsg += error.message || error.toString();
    }
    const cancelAt = timeout && Date.now() + timeout;
    commit('notify', {
      service,
      severity: severity || 'error',
      error: errMsg,
      context,
      cancelAt
    });
    if (cancelAt) {
      setTimeout(() => {
        commit('notify', { service, cancelAt });
      }, timeout)
    }

    if (parent && parent.setMessages) {
      if (error.status !== 403 && error.status !== 404) {
        const infoIcon = `<i class="material-icons">info</i>`;
        const msgIcon = `<span title="${service}">${infoIcon}</span>`;
        const notif = `${msgIcon} ${errMsg}`;
        parent.setMessages(`<div class="acap_warning">${notif}</div>`);
      }
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
