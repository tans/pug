let _data = {
  sended: 0,
  received: 0,
  messages: "",
  name: "",
  account: null,
  botid: "",
  host: "http://pugai.minapp.xin",
};

module.exports = {
  log: () => {
    console.log(
      `[${_data.name}] sended:${_data.sended} received:${_data.received}`,
    );
  },
  data: _data,
  login: (account) => {
    this.set("botid", account.id);
    this.set("account", account);
    this.set("name", account.name());
  },
  get: (attr) => {
    return _data[attr];
  },
  set: (attr, value) => {
    _data[_attr] = value;
    return _data;
  },

  incSended: (num) => {
    _data["sended"] = _data["sended"] + num;
    this.log();
    return _data["sended"];
  },
  incReceived: (num) => {
    _data["received"] = _data["received"] + num;
    this.log();
    return _data["received"];
  },
};
