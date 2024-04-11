const Wechaty = require("wechaty");
const { PuppetXp } = require("wechaty-puppet-xp");
const state = require("./state");
const { loop } = require("./loop");
const request = require("./request");
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

  await request("/api/sync/bot", {
    bot: { name: account.name(), wid: account.id },
  });
  let rooms = [];
  for (let room of await bot.Room.findAll()) {
    let owner = room.owner();
    rooms.push({
      bot: {
        rid: room.id,
        name: await room.topic(),
        ownerId: owner.id,
        ownerName: owner.name(),
      },
    });
  }
  await request("/api/sync/rooms", { rooms });
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
    roomId: room?.id,
    toId: to?.id,
    fromId: from?.id,
    fromName: from?.name(),
    date: msg.date(),
  });
});

module.exports = {
  start: () => {
    bot.start().catch(console.error);
  },
};
