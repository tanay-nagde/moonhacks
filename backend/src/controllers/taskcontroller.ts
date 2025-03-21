
import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asynchandler";
import { isAuthenticated } from "../middleware/authmiddleware";
import ApiError from "../utils/ApiError";
import { TaskModel, ITask } from "../models/Task.model";
import { TaskSubmissionModel, ITaskSubmission } from "../models/TaskSubmission.model";
import { IUser } from "../models/User.model";

/**
 * Create a new task (Any user can create)
 */
export const createTask = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { title, description, dueDate } = req.body;

  const newTask = await TaskModel.create({
    title,
    description,
    dueDate,
    createdBy: (req.user as IUser)._id, // Ensure AuthRequest type is set in middleware
  });

  res.status(201).json({
    success: true,
    data: newTask,
  });
});

/**
 * Get task by ID
 */
export const getTaskById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const task = await TaskModel.findById(id).populate("assignedTo");

  if (!task) {
    return next(new ApiError(404, "Task not found"));
  }

  res.status(200).json({
    success: true,
    data: task,
  });
});

/**
 * Update task details
 */
export const updateTask = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const updatedTask = await TaskModel.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

  if (!updatedTask) {
    return next(new ApiError(404, "Task not found"));
  }

  res.status(200).json({
    success: true,
    data: updatedTask,
  });
});

/**
 * Delete task (Admins only)
 */
export const deleteTask = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  if (!(req as any).user || ((req as any).user as IUser).role !== "admin") {
    return next(new ApiError(403, "Forbidden: Only admins can delete tasks"));
  }

  const deletedTask = await TaskModel.findByIdAndDelete(id);

  if (!deletedTask) {
    return next(new ApiError(404, "Task not found"));
  }

  res.status(200).json({
    success: true,
    message: "Task deleted successfully",
  });
});

/**
 * Assign a task to a user
 */
export const assignTask = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { assignedTo } = req.body; // User ID to assign the task

  const task = await TaskModel.findByIdAndUpdate(id, { assignedTo }, { new: true });

  if (!task) {
    return next(new ApiError(404, "Task not found"));
  }

  res.status(200).json({
    success: true,
    message: "Task assigned successfully",
    data: task,
  });
});

/**
 * Submit a task (Task assignee submits the task)
 */
export const submitTask = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params; // Task ID
  const { submissionFile, submissionText } = req.body; // Submission details

  const task = await TaskModel.findById(id);
  if (!task) {
    return next(new ApiError(404, "Task not found"));
  }

  if (!task.assignedTo || (task.assignedTo.toString() !== (req as any).user._id.toString())) {
    return next(new ApiError(403, "You are not assigned to this task"));
  }

  const submission = await TaskSubmissionModel.create({
    taskId: id,
    submittedBy: (req as any).user._id,
    submissionFile,
    submissionText,
    status: "pending", // Default status before review
  });

  res.status(200).json({
    success: true,
    message: "Task submitted successfully",
    data: submission,
  });
});

/**
 * Review a submitted task (Only assigned reviewer/admin)
 */
export const reviewTask = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { submissionId } = req.params;
  const { status, feedback } = req.body; // Status should be "accepted" or "rejected"

  const submission = await TaskSubmissionModel.findById(submissionId);
  if (!submission) {
    return next(new ApiError(404, "Submission not found"));
  }

  const task = await TaskModel.findById(submission.taskId);
  if (!task) {
    return next(new ApiError(404, "Task not found"));
  }

  if (!req.user  || (req.user as IUser).role !== "admin") {
    return next(new ApiError(403, "Only admins can review tasks"));
  }

    // note:- strong validation from frontend needed
    submission.reviewStatus = status;
    submission.reviewComments = feedback;
    await submission.save();
    res.status(200).json({
        success: true,
        message: `Task submission ${status} successfully`,
        data: submission,
      });


    
});
