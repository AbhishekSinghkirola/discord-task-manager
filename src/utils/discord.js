import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.MessageContent,
  ],
});

client.once("ready", () => {
  console.log(`🤖 Bot logged in as ${client.user.tag}`);

  const guild = client.guilds.cache.get(process.env.DISCORD_GUILD_ID);

  // console.log(
  //   "guild",
  //   guild.channels.cache.map((channel) => channel)

  // );
});

client.login(process.env.DISCORD_BOT_TOKEN);

export default client;
