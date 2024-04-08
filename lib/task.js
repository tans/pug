const { incSended } = require("./state");
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
  },
};
