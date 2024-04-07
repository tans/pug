const Wechaty = require("wechaty");
const { PuppetXp } = require("wechaty-puppet-xp");

const puppet = new PuppetXp();
const { WechatyBuilder } = Wechaty;

const bot = WechatyBuilder.build({
    puppet: puppet,
    name: "bot",
});

bot.on("message", async (msg) => {
    let text = msg.text();
    if (text == "ping") {
        await msg.say("pong");
    }
});

bot.start().catch(console.error);
