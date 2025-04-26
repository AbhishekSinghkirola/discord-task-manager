import { asyncHandler } from "./async-handler.js";
import { ApiError } from "./api-error.js";
import { TeamMember } from "../models/TeamMember.models.js"
import mongoose, { mongo } from "mongoose";
import { Project } from "../models/Project.models.js";
import { Team } from "../models/Team.models.js";

export const getProjectByUserHelper = asyncHandler(async (_id) => {
    //teamMember -> team -> project
    const projects = await TeamMember.find({ userId: _id })
        .populate({
            path: "teamId",
            populate: {
                path: "projectId",
                model: "Project"
            }
        });


    if (!projects) {
        throw new ApiError(404, "Project not found");
    }

    const projectDetails = projects.map(project => project.teamId?.projectId);

    return projectDetails;
})


const assignTeamHelper = asyncHandler(async (team, userId) => {
    const teamMember = await TeamMember.create({
        teamId: team._id,
        userId: userId
    })

    if(!teamMember){
        throw new ApiError(500, "Failed to assign team");
    }

    return team._id;
})


const getMaxTeamSize = asyncHandler(async (projectId) => {
    const project = await Project.findById(projectId).select("maxTeamMemberLimit");

    if(!project){
        throw new ApiError(404, "Project not found");
    }

    return project.maxTeamMemberLimit;
})


const getTeams = asyncHandler(async (projectId) => {
    const teams = Team.find({projectId}).select("_id","name");

    if(!teams){
        throw new ApiError(404, "Teams not found");
    }

    for(let i=0;i<teams.lenght;i++){
        const teamMembers = await TeamMember.find({teamId: teams[i]._id})
        const memberCount = teamMembers.lenght; 

        teams[i].memberCount = memberCount;
    }

    return teams;
})


// randomly assign team => assign roles and teams on discord
export const assignTeam = asyncHandler( async(projectId, userId) => {
    //fetch teams
    const teams = getTeams(projectId); 
    const maxTeamSize = getMaxTeamSize(projectId);

    //Filter out all full teams
    const availableTeams = teams.filter(team => team.memberCount < maxTeamSize);

    //check if all existing teams are full
    if(availableTeams.length === 0){
        for(let i=0;i<newTeamsCount;i++){
            const team = await Team.create({
                name: '',
                projectId
            });

            if(!team){
                throw new ApiError(500, "Error while creating a team");
            }
        }

        return assignTeam(projectId, userId);
    }
 
    //calculate ratio for teams that are not full
    const notFullTeamRatio = availableTeams.length/teams.length;
    let assignedTeam;

    if(notFullTeamRatio >= 0.6){
        //random assigment
        const randIdx = Math.floor(Math.random() * availableTeams.length);
        assignedTeam = assignTeamHelper(availableTeams[randIdx], userId);
    }
    else{
        //Assign to team with fewer members
        availableTeams.sort((a,b) => a.memberCount - b.memberCount);
        const minMember = availableTeams[0].memberCount;
        const minMemberTeams = availableTeams.filter(team => team.memberCount <= minMember);

        const randIdx = Math.floor(Math.random() * minMemberTeams.length);
        assignedTeam = assignTeamHelper(minMemberTeams[randIdx], userId);
    }

    return assignedTeam;
})


export const isUserAlreadyInProject = asyncHandler(async(userId, projectId) => {
    
})


//lookup -> unwind -> match
export const isUserInMultipleProjects = asyncHandler(async (userId, cohortId) => { 
    const projects = await TeamMember.aggregate([
        { $match: {userId: mongoose.Types.ObjectId(userId)}},

        //1. join with Team
        {
            $lookup: {
                from: 'teams',
                localField: 'teamId',
                foreignField: '_id',
                as: 'team'
            }
        },

        //2. Unwind the team array
        { $unwind: '$team'},

        //3. join with project
        {
            $lookup: {
                from: 'projects',
                localField: 'team.projectId',
                foreignField: '_id',
                as: 'project'
            }
        },

        //4. Unwind
        { $unwind: '$project' },

        //5. filter results with deadline and cohortId
        { $match: {
            'project.deadline' : { $gt: new Date.now() },
            'project.cohortId': mongoose.Types.ObjectId(cohortId) 
          }
        },

        //6. project only needed fields
        {
            $project: {
                _id: 0,
                userId: 1,
                'project.cohortId': 1
            }
        }
    ]);
  
    return projects.length > 0;
})
  