import mongoose, { Schema } from "mongoose";
import { PROJECT_STATUS } from "../constants/project.constants.js";

const projectSchema = new Schema(
  {
    name: { 
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      required: true,
    }, 
    deadline: {
      type: Date, 
      required: true,
    },
    minTeamMemberLimit: {
      type: Number,
      default: 1,
      required: true
    },
    status: {
      type: String,
      enum: Object.values(PROJECT_STATUS),
      default: PROJECT_STATUS.ONGOING,
    },
    maxTeamMemberLimit: {
      type: Number,
      default: 4,
      required: true
    },
    cohortId: {
      type: Schema.Types.ObjectId,
      ref: "Cohort",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Project = mongoose.model("Project", projectSchema);
