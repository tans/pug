const state = require("./state");
const Task = require("./task");
const request = require("./request");
module.exports = {
  loop: async (bot) => {
    // 执行发送任务
    setInterval(function () {
      (async () => {
        try {
          console.log('-')
          let { task } = await request("/api/task");
          console.log(task)
          await Task.send(bot, task);
        } catch (error) {
          console.error(error);
        }
      })();
    }, 3200);

    // 上传消息
    setInterval(function () {
      (async () => {
        try {
          let messages = state.get("messages");
          if (messages.length > 0) {
            let __messages = [...messages];
            state.set("messages", []);
            await request("/api/messages", { messages: __messages });
            state.incReceived(__messages.length);
          }
        } catch (error) {
          console.error(error);
        }
      })();
    }, 2000);
  },
};
