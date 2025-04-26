import mongoose, {Schema} from "mongoose";

const cohortSchema = new Schema(
    {
        name: { 
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        duration: {
            type: Date,
            required: true
        },
        guildId: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

export const Cohort = mongoose.model("Cohort", cohortSchema);