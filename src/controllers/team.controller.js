import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { Team } from "../models/Team.models.js";
import {
  creatTeamOnDiscord,
  deleteTeamOnDiscord,
} from "../utils/team-service.js";
import mongoose from "mongoose";
import { Project } from "../models/Project.models.js";

export const createTeam = asyncHandler(async (req, res) => {
  try {
    const { name, projectId, teamRole } = req.body;

    const existingTeam = await Team.findOne({ name, projectId });

    if (existingTeam) {
      throw new ApiError(409, "Team already exists for this project.");
    }

    const existingRole = await Team.findOne({
      projectId,
      "teamRole.name": teamRole.name,
    });

    if (existingRole) {
      throw new ApiError(409, "Team role already exists.");
    }

    const project = await Project.findById(projectId);

    const discordTeam = await creatTeamOnDiscord({
      projectName: project.name,
      teamName: name,
      roleName: teamRole.name,
      roleColor: teamRole.color,
    });

    const newTeam = await Team.create({
      name,
      projectId,
      teamRole: {
        name: teamRole.name,
        color: teamRole.color,
      },
      discordDetails: discordTeam,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, "Team created successfully", newTeam[0]));
  } catch (error) {
    throw error;
  }
});

export const getTeamsById = asyncHandler(async (req, res) => {
  const { teamId } = req.params;
  const teams = await Team.findById(teamId);

  return res
    .status(200)
    .json(new ApiResponse(200, "Teams fetched successfully.", teams));
});

export const getTeamsByProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const teams = await Team.find({ projectId });

  return res
    .status(200)
    .json(new ApiResponse(200, "Teams fetched successfully.", teams));
});

export const deleteTeam = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { teamId } = req.params;

    const existingTeam = await Team.findById(teamId);

    if (!existingTeam) {
      throw new ApiError(404, "Team does not exist.");
    }

    await deleteTeamOnDiscord(existingTeam.discordTeamsDetails);

    await existingTeam.deleteOne();

    // throw new Error("breaking...");

    await session.commitTransaction();
    session.endSession();

    return res
      .status(200)
      .json(new ApiResponse(200, "Team deleted successfully."));
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});
