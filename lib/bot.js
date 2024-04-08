const Wechaty = require("wechaty");
const { PuppetXp } = require("wechaty-puppet-xp");
const state = require("./state");
const {loop} = require('./loop')
const puppet = new PuppetXp();
const { WechatyBuilder } = Wechaty;

const bot = WechatyBuilder.build({
  puppet: puppet,
  name: "bot",
});

state.set("bot", bot);
bot.on("login", async (account) => {
  state.init(account);
  await loop(bot);
});

bot.on("message", async (msg) => {
  let text = msg.text();
  if (text == "ping") {
    await msg.say("pong - local");
  }

  let from = msg.talker();
  let to = msg.listener();
  let room = msg.room();

  state.get("messages").push({
    wid: state.get("account").id,
    text: text,
    roomid: room?.id,
    toid: to?.id,
    fromid: from?.id,
    date: msg.date(),
  });
});

module.exports = {
  start: () => {
    bot.start().catch(console.error);
  },
};
