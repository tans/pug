const { incSended } = require("./state");
const request = require("./request");
module.exports = {
  send: async (bot, task) => {
    if (!task) {
      return;
    }
    if (task.type == "msg") {
      if (task.rid) {
        let room = await bot.Room.find({ id: task.rid });
        await room?.say(task.text);
      } else {
        let contact = await bot.Contact.find({ id: task.toId });
        await contact?.say(task.text);
      }
      incSended(1);
    }

    if (task.type == "sync-room") {
      let room = await bot.Room.find({ id: task.rid });
      let owner = room.owner();
      await request("/api/sync/room", {
        room: {
          rid: room.id,
          name: await room.topic(),
          ownerId: owner.id,
          ownerName: owner.name(),
        },
      });
    }

    if (task.type == "sync-contact") {
      let contact = await bot.Contact.find({ id: task.toId });
      await request("/api/sync/contact", {
        contact: {
          id: contact.id,
          name: contact.name,
        },
      });
    }
  },
};
