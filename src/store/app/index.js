const state = {
  notifications: []
};

const getters = {
  notifications: state => state.notifications
};

const actions = {
  handleError({ commit }, { service, severity, error, parent }) {
    let errMsg = service + ' failed: ';
    if (error instanceof Response) {
      const err = error.error || JSON.stringify(error);
      errMsg += `${err.status} - ${err.statusText || ''}`;
    } else {
      errMsg += error.message || error.toString();
    }
    commit('notify', {
      service: service,
      severity: severity || 'error',
      error: errMsg
    });

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
    const idx = notifs.indexOf(payload);
    if (idx > -1) {
      notifs.splice(idx, 1);
    }
    notifs.push(payload);
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
