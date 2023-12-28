import userTasks from "@/models/userTasks";
import { extractTokenPayload } from "@/utils/functions";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET() {
  try {
    const auth = cookies().get("userToken") || ("" as any);
    if (!auth) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }

    const userId = await extractTokenPayload(auth);

    const taskList = await userTasks.find({
      user_id: userId,
      taskImportant: true,
    });
    // console.log(userId, taskList);

    if (!taskList) {
      return new Response("Important Tasks with this user id not found", {
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

export async function PATCH(req: Request | NextRequest) {
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

    const updateTask = await userTasks.updateOne(
      {
        _id: taskId, // it is immutable
      },
      {
        $set: { taskImportant: false }, // Updates only the taskImportant field
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
    // console.log(error);
  }
}

export const dynamic = "force-dynamic";
