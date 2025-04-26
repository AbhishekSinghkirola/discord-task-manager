import mongoose, { Schema } from "mongoose";
import { SWITCH_TEAM_REQUEST_STATUS } from "../constants/project.constants.js";

const switchTeamRequestSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    teamId: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    status: {
      type: String,
      enum: SWITCH_TEAM_REQUEST_STATUS,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const SwitchTeamRequest = mongoose.model(
  "SwitchTeamRequest",
  switchTeamRequestSchema
);
