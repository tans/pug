let _data = {
  sended: 0,
  received: 0,
  messages: [],
  name: "",
  account: null,
  botId: "",
  host: "http://pug.minapp.xin",
};

const state = {
  log: () => {
    console.log(
      `[${_data.name}] sended:${_data.sended} received:${_data.received}`,
    );
  },
  data: _data,
  init: (account) => {
    state.set("botId", account.id);
    state.set("account", account);
    state.set("name", account.name());
  },
  get: (attr) => {
    return _data[attr];
  },
  set: (attr, value) => {
    _data[attr] = value;
    return _data;
  },

  incSended: (num) => {
    _data["sended"] = _data["sended"] + num;
    state.log();
    return _data["sended"];
  },
  incReceived: (num) => {
    _data["received"] = _data["received"] + num;
    state.log();
    return _data["received"];
  },
};

module.exports = state;
