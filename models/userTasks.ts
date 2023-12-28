import mongoose from "mongoose";

const userTaskSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    taskTitle: {
      type: String,
      required: true,
    },
    taskDescription: {
      type: String,
      required: true,
    },
    taskStatus: {
      type: Boolean,
      default: false,
    },
    taskImportant: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models["userTasks"] ||
  mongoose.model("userTasks", userTaskSchema);
