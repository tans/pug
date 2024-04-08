const fetch = require("node-fetch");
const state = require("./state");

module.export = async (route, body) => {
  body.botid = state.get("botid");
  let host = state.get("host");
  let res = await fetch(host + route, {
    method: "POST",
    data: JSON.stringify(body),
  });

  return res.json();
};
