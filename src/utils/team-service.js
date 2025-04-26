import {
  createChannelForRoles,
  createDiscordRole,
  deleteDiscordRole,
  deleteDiscordChannel,
  getDiscordChannelByName,
} from "./discord.js";

export const creatTeamOnDiscord = async ({
  projectName,
  roleName,
  roleColor,
  teamName,
}) => {
  let newRole = null;
  let categoryChannel = null;
  let textChannel = null;
  let voiceChannel = null;
  try {
    newRole = await createDiscordRole(`${projectName} ${roleName}`, roleColor);

    const existingCategoryChannel = await getDiscordChannelByName(
      projectName,
      "CATEGORY"
    );

    if (!existingCategoryChannel) {
      categoryChannel = await createChannelForRoles(
        newRole.id,
        projectName,
        "CATEGORY"
      );
    }

    const categoryChannelId =
      existingCategoryChannel?.id ?? categoryChannel?.id;

    textChannel = await createChannelForRoles(
      newRole.id,
      teamName,
      "TEXT",
      categoryChannelId
    );

    voiceChannel = await createChannelForRoles(
      newRole.id,
      teamName,
      "VOICE",
      categoryChannelId
    );

    return true;
  } catch (error) {
    if (newRole) {
      await deleteDiscordRole(newRole?.id);
    }

    if (categoryChannel) {
      await deleteDiscordChannel(categoryChannel?.id);
    }

    if (textChannel) {
      await deleteDiscordChannel(textChannel?.id);
    }

    if (voiceChannel) {
      await deleteDiscordChannel(voiceChannel?.id);
    }

    throw error;
  }
};
