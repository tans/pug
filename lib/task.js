const { incSended } = require("./state");
const request = require("./request");
const state = require("./state");
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
      await bot.Room.findAll();
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

    if (task.type == "sync-rooms") {
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
    }
    if (task.type == "sync-members") {
      let room = await bot.Room.find({ id: task.rid });
      let contacts = await room.memberAll();
      let members = contacts.map((c) => {
        return {
          rid: task.rid,
          wid: c.id,
          name: c.name(),
        };
      });
      await request("/api/sync/members", {
        members,
      });
    }

    if (task.type == "sync-member") {
      await bot.Contact.findAll();
      let contact = await bot.Contact.find({ id: task.wid });
      if (contact.name()) {
        await request("/api/sync/member", {
          member: {
            wid: task.wid,
            rid: task.rid,
            name: contact.name(),
          },
        });
      }
    }
  },
};
