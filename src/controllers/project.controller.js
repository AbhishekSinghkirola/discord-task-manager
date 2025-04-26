import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { Project } from "../models/Project.models.js";
import { PROJECT_STATUS } from "../constants/project.constants.js";
import { getProjectByUserHelper, assignTeam, isUserInMultipleProjects, isUserAlreadyInProject } from "../utils/project-serivce.js"

export const createProject = asyncHandler(async (req, res) => {
  //validation
  const { name, description, deadline, minTeamMemberLimit, maxTeamMemberLimit } = req.body;
  const { cohortId } = req.params;

  // Check if user is ADMIN
  if (req.loggedInUser.role !== "ADMIN") {
    throw new ApiError(403, "Only admins can create projects");
  }

  const project = await Project.create({
    name,
    description,
    deadline: new Date(deadline),
    minTeamMemberLimit,
    maxTeamMemberLimit,
    cohortId
  });

  if (!project) {
    throw new ApiError(500, "Project creation failed!");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, "Project created successfully", project));
});


export const getProjectById = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Project fetched successfully", project));
});


export const getProjectsByCohort = asyncHandler(async (req, res) => {
  const { cohortId } = req.params;

  const projects = await Project.find({ cohortId }).select("name", "description", "deadline");
  if (!projects) {
    throw new ApiError(404, "Projects not found");
  }

  return res 
    .status(200)
    .json(new ApiResponse(200, "Projects fetched successfully", projects));
});


export const getProjectsByUser = asyncHandler(async (req, res) => {
  const { _id } = req.loggedInUser;

  const projects = await getProjectByUserHelper(_id);

  return res
    .status(200)
    .json(new ApiResponse(200, "Projects fetched successfully", projectDetails));
});


export const selectProject = asyncHandler(async (req, res) => {
  // is student logged in (by middleware)
  const { projectId, cohortId } = req.params;
  const { _id } = req.loggedInUser;

  //is user part of any other project ?
  if (isUserInMultipleProjects(_id, cohortId)) {
    throw new ApiError(400, "You can enroll in one project at a time in a cohort");
  }

  //is user already part of this project ?
  if(isUserAlreadyInProject(_id, projectId)){
    throw new ApiError(400, "You are already enrolled in this project")
  }

  //assign Team
  const team = assignTeam(req, res, projectId, _id, cohortId);

  if (!team) {
    throw new ApiError(500, "Error while assigning Team");
  }

  return res
         .status(200)
         .json(new ApiResponse(200,"Team successfully assigned",team));
})


export const switchTeam = asyncHandler(async (res, req) => {

})

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
  if (status && Object.values(PROJECT_STATUS).includes(status))
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
