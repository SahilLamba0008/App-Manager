import userTasks from "@/models/userTasks";
import { extractTokenPayload } from "@/utils/functions";
import { NextRequest } from "next/server";

export async function GET(request: any) {
  try {
    const auth = request.cookies.get("userToken") || "";
    if (!auth) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }

    const userId = await extractTokenPayload(auth);

    const taskList = await userTasks.find({
      user_id: userId,
      taskStatus: true,
    });
    // console.log(userId, taskList);

    if (!taskList) {
      return new Response("Completed Tasks with this user id not found", {
        status: 401,
      });
    }

    return new Response(JSON.stringify(taskList), {
      status: 200,
    });
  } catch (error) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }
}

export async function DELETE(req: Request | NextRequest) {
  try {
    const urlParams = new URL(req.url!);
    const taskId = urlParams.searchParams.get("id");

    if (!taskId) {
      return new Response(JSON.stringify({ message: "Task ID is required" }), {
        status: 400,
      });
    }

    const task = await userTasks.findOne({ _id: taskId });
    if (!task) {
      return new Response(JSON.stringify({ message: "Task not found" }), {
        status: 404,
      });
    }

    const deleteTask = await userTasks.deleteOne({ _id: taskId });

    // console.log(deleteTask, taskId, urlParams);

    if (deleteTask) {
      return new Response(
        JSON.stringify({ message: "Task Deleted successfully" }),
        {
          status: 200,
        }
      );
    } else {
      return new Response(
        JSON.stringify({ message: "Unexpected error. Please try again." }),
        { status: 500 }
      );
    }
  } catch (error) {
    console.log(error);
  }
}

export async function PATCH(req: Request | NextRequest) {
  // console.log("Patch Req");
  try {
    const urlParams = new URL(req.url!);
    const taskId = urlParams.searchParams.get("id");
    // console.log(urlParams, taskId);

    if (!taskId) {
      return new Response(JSON.stringify({ message: "Task ID is required" }), {
        status: 400,
      });
    }

    // console.log("Patch req task", taskId);
    const task = await userTasks.findOne({ _id: taskId });
    if (!task) {
      return new Response(JSON.stringify({ message: "Task not found" }), {
        status: 404,
      });
    }

    const updateTask = await userTasks.updateOne(
      { _id: taskId },
      {
        $set: { taskStatus: false },
      }
    );

    // console.log(updateTask, taskId, urlParams);

    if (updateTask) {
      return new Response(
        JSON.stringify({ message: "Task Updated successfully" }),
        {
          status: 200,
        }
      );
    } else {
      return new Response(
        JSON.stringify({ message: "Unexpected error. Please try again." }),
        { status: 500 }
      );
    }
  } catch (error) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }
}

export const dynamic = "force-dynamic";
