const { incSended } = require("./state");
const request = require("./request");
module.exports = {
  send: async (bot, task) => {
    if (!task) {
      return;
    }
    if (task.type == "msg") {
      if (task.roomid) {
        let room = await bot.Room.find({ id: task.roomid });
        await room?.say(task.text);
      } else {
        let contact = await bot.Contact.find({ id: task.toid });
        await contact?.say(task.text);
      }
      incSended(1);
    }

    if (task.type == "sync-room") {
      let room = await bot.Room.find({ id: task.roomid });
      let owner = room.owner();
      await request("/api/sync/room", {
        id: room.id,
        topic: room.topic(),
        ownerid: owner.id,
      });
    }

    if (task.type == "sync-contact") {
      let contact = await bot.Contact.find({ id: task.toid });
      await request("/api/sync/contact", {
        id: contact.id,
        name: contact.name,
      });
    }
  },
};
