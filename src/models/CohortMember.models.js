import mongoose, {Schema} from "mongoose";

const cohortMemberSchema = new Schema(
    {
        cohortId: {
            type: Schema.Types.ObjectId,
            ref: "Cohort", 
            required: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
)

export const CohortMember = mongoose.model("CohortMember", cohortMemberSchema);