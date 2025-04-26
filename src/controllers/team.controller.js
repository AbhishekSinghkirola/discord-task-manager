import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { Team } from "../models/Team.js";
import { creatTeamOnDiscord } from "../utils/team-service.js";
import mongoose from "mongoose";
import { Project } from "../models/Project.js";

export const createTeam = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, projectId, teamRole } = req.body;

    const existingTeam = await Team.findOne({ name, projectId }).session(
      session
    );

    if (existingTeam) {
      throw new ApiError(409, "Team already exists for this project.");
    }

    const existingRole = await Team.findOne({
      projectId,
      "teamRole.name": teamRole.name,
    }).session(session);

    if (existingRole) {
      throw new ApiError(409, "Team role already exists.");
    }

    const newTeam = await Team.create(
      [
        {
          name,
          projectId,
          teamRole: {
            name: teamRole.name,
            color: teamRole.color,
          },
        },
      ],
      { session }
    );

    const project = await Project.findById(projectId).session(session);

    await creatTeamOnDiscord({
      projectName: project.name,
      teamName: name,
      roleName: teamRole.name,
      roleColor: teamRole.color,
    });

    await session.commitTransaction();
    session.endSession();

    return res
      .status(200)
      .json(new ApiResponse(200, "Team created successfully", newTeam[0]));
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});
