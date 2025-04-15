import mongoose, { Schema } from "mongoose";

const teamSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    teamRole: {
      name: {
        type: String,
        required: true,
      },
      color: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

export const Team = mongoose.model("Team", teamSchema);
