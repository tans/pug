const Wechaty = require("wechaty");
const { PuppetXp } = require("wechaty-puppet-xp");
const state = require("./state");
const { loop } = require("./loop");
const request = require("./request");
const puppet = new PuppetXp();
const { WechatyBuilder } = Wechaty;

const utils = require("./utils");
const task = require("./task");

const bot = WechatyBuilder.build({
  puppet: puppet,
  name: "bot",
});

state.set("bot", bot);
bot.on("login", async (account) => {
  state.init(account);
  await loop(bot);

  try {
    await request("/api/sync/bot", {
      bot: { name: account.name(), wid: account.id },
    });

    utils.sleep(5000);

    let rooms = [];
    for (let room of await bot.Room.findAll()) {
      let owner = room.owner();
      rooms.push({
        rid: room.id,
        name: await room.topic(),
        ownerId: owner.id,
        ownerName: owner.name(),
      });
    }
    await request("/api/sync/rooms", { rooms });
  } catch (err) {
    console.error(err);
  }
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
    rid: room?.id,
    toId: to?.id,
    fromId: from?.id,
    type: msg.type().toString(),
    fromName: from?.name(),
    date: msg.date(),
  });
});

bot.on("room-join", async (room, inviteeList, inviter) => {
  try {
    // todo , only bot join
    await task.send(bot, "sync-room");

    await request("/api/sync/room-join", {
      room: { rid: room.id },
      inviteeList: inviteeList.map((invitee) => {
        return {
          wid: invitee.id,
          name: invitee.name(),
        };
      }),
      inviter: {
        wid: inviter.id,
        name: inviter.name(),
      },
    });
  } catch (err) {
    console.error(err);
  }
});

module.exports = {
  start: () => {
    bot.start().catch(console.error);
  },
};
