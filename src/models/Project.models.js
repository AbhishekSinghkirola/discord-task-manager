import mongoose, { Schema } from "mongoose";
import PROJECT_STATUS from "../constant.js"
 
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
    status: {
      type: String,
      enum : PROJECT_STATUS,
      default: "ONGOING"
    }
  },
  {
    timestamps: true,
  }
);

export const Project = mongoose.model("Project", projectSchema);
