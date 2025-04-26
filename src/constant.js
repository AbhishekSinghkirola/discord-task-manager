export const ROLES = ["ADMIN", "USER"];

export const LOGIN_TYPES = ["EMAIL", "DISCORD"];

export const SWITCH_TEAM_REQUEST_STATUS = ["PENDING", "APPROVED", "REJECTED"];

export const DISCORD_CHANNEL_MAPPING = {
  TEXT: 0,
  VOICE: 2,
  CATEGORY: 4,
};

export const DISCORD_CHANNEL_TYPES = Object.keys(DISCORD_CHANNEL_MAPPING);
