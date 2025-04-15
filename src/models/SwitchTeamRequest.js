import mongoose, { Schema } from "mongoose";
import { SWITCH_TEAM_REQUEST_STATUS } from "../constant.js";

const switchTeamRequestSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
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
