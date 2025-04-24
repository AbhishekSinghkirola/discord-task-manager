import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { Project } from "../models/Project.js";

export const createProject = asyncHandler(async (req, res) => {
  const { name, description, deadline, teamMembersLimit } = req.body;

  // Check if user is ADMIN
  if (req.loggedInUser.role !== "ADMIN") {
    throw new ApiError(403, "Only admins can create projects");
  }

  const project = await Project.create({
    name,
    description,
    deadline: new Date(deadline),
    teamMembersLimit,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "Project created successfully", project));
});

export const getAllProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find();
  return res
    .status(200)
    .json(new ApiResponse(200, "Projects fetched successfully", projects));
});

export const getProjectById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const project = await Project.findById(id);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Project fetched successfully", project));
});

export const updateProject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, deadline, teamMembersLimit, status } = req.body;

  // Check if user is ADMIN
  if (req.loggedInUser.role !== "ADMIN") {
    throw new ApiError(403, "Only admins can update projects");
  }

  // Check if project exists
  const existingProject = await Project.findById(id);
  if (!existingProject) {
    throw new ApiError(404, "Project not found");
  }

  const updateData = {};
  if (name) updateData.name = name;
  if (description) updateData.description = description;
  if (deadline) updateData.deadline = new Date(deadline);
  if (teamMembersLimit !== undefined)
    updateData.teamMembersLimit = teamMembersLimit;
  if (status && ["ONGOING", "EXPIRED"].includes(status))
    updateData.status = status;

  // Update the project
  const updatedProject = await Project.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true } // Return the updated document
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Project updated successfully", updatedProject));
});
