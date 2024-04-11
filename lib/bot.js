const Wechaty = require("wechaty");
const { PuppetXp } = require("wechaty-puppet-xp");
const state = require("./state");
const { loop } = require("./loop");
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

  let rooms = [];
  for (let room of await bot.Room.findAll()) {
    let owner = room.owner();
    rooms.push({
      id: room.id,
      name: room.topic(),
      ownerId: owner.id,
      ownerName: owner.name(),
    });
  }
  console.log(rooms);
  await request("/api/sync/room", { rooms });
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
