import { Client, GatewayIntentBits, PermissionsBitField } from "discord.js";
import dotenv from "dotenv";
import logger from "./logger.js";
import { DISCORD_CHANNEL_MAPPING, DISCORD_CHANNEL_TYPES } from "../constants/project.constants.js"
dotenv.config();

const GUILD_ID = process.env.DISCORD_GUILD_ID;
let guildCache = new Map();

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once("ready", () => {
  logger.info(`🤖 Bot logged in as ${client.user.tag}`);
});

const loginBot = async () => {
  try {
    return client.login(process.env.DISCORD_BOT_TOKEN);
  } catch (error) {
    throw error;
  }
};

const getDiscordGuild = async (guildId) => {
  try {
    if (guildCache.has(guildId)) {
      return guildCache.get(guildId);
    }

    const guild = await client.guilds.fetch(guildId);
    guildCache.set(guildId, guild);
    return guild;
  } catch (error) {
    throw error;
  }
};

const createDiscordRole = async (roleName, color) => {
  try {
    const existingRole = await getDiscordRoleByName(roleName);

    if (existingRole) {
      throw new Error("Role already exists");
    }

    const guild = await getDiscordGuild(GUILD_ID);
    const role = await guild.roles.create({
      name: roleName,
      color: color,
      reason: "Role created for team",
    });

    return role;
  } catch (error) {
    throw error;
  }
};

const getDiscordRoleByName = async (roleName) => {
  try {
    const guild = await getDiscordGuild(GUILD_ID);
    const roles = await guild.roles.fetch();

    const role = roles.find(
      (role) => role.name.toLowerCase() === roleName.toLowerCase()
    );

    return role;
  } catch (error) {
    throw error;
  }
};

const createChannelForRoles = async (
  roleId,
  teamName,
  channelType = "TEXT",
  parentId = null
) => {
  try {
    if (!DISCORD_CHANNEL_TYPES.includes(channelType.toUpperCase())) {
      throw new Error("Invalid channel type provided.");
    }

    const type = DISCORD_CHANNEL_MAPPING[channelType.toUpperCase()];

    const guild = await getDiscordGuild(GUILD_ID);

    const permissionOverwrites = [
      {
        id: guild.roles.everyone.id, // Disable everyone access
        deny: [PermissionsBitField.Flags.ViewChannel],
      },
      {
        id: client.user.id, // allow bot access
        allow: [
          PermissionsBitField.Flags.ViewChannel,
          PermissionsBitField.Flags.ManageChannels,
          PermissionsBitField.Flags.SendMessages,
          PermissionsBitField.Flags.Connect,
          PermissionsBitField.Flags.Speak,
        ],
      },
      {
        id: roleId,
        allow: [
          PermissionsBitField.Flags.ViewChannel,
          PermissionsBitField.Flags.SendMessages,
          PermissionsBitField.Flags.Connect,
          PermissionsBitField.Flags.Speak,
        ],
      },
    ];

    const channelOptions = {
      name: teamName,
      type: type,
    };

    if (type !== 4) {
      if (!parentId) {
        throw new Error("Parent ID is required for non-category channels");
      }

      channelOptions.parent = parentId;
      channelOptions.permissionOverwrites = permissionOverwrites;
    }

    const channel = await guild.channels.create(channelOptions);

    return channel;
  } catch (error) {
    throw error;
  }
};

const deleteDiscordRole = async (roleId) => {
  try {
    const guild = await getDiscordGuild(GUILD_ID);
    const role = guild.roles.cache.get(roleId);

    if (!role) {
      throw new Error("Role not found");
    }

    await role.delete("Role deleted for team");

    return true;
  } catch (error) {
    throw error;
  }
};

const deleteDiscordChannel = async (channelId) => {
  try {
    const guild = await getDiscordGuild(GUILD_ID);
    const channel = guild.channels.cache.get(channelId);

    if (!channel) {
      throw new Error("Channel not found");
    }

    await channel.delete("Channel deleted for team");

    return true;
  } catch (error) {
    throw error;
  }
};

const getDiscordChannelByName = async (channelName, channelType) => {
  try {
    if (!DISCORD_CHANNEL_TYPES.includes(channelType?.toUpperCase())) {
      throw new Error("Invalid channel type provided.");
    }

    const type = DISCORD_CHANNEL_MAPPING[channelType.toUpperCase()];

    const guild = await getDiscordGuild(GUILD_ID);
    const channels = await guild.channels.fetch();

    const channel = channels.find(
      (channel) =>
        channel.name.toLowerCase() === channelName.toLowerCase() &&
        channel.type === type
    );

    return channel;
  } catch (error) {
    throw error;
  }
};

export {
  client,
  loginBot,
  getDiscordGuild,
  createDiscordRole,
  getDiscordRoleByName,
  createChannelForRoles,
  deleteDiscordRole,
  deleteDiscordChannel,
  getDiscordChannelByName,
};
