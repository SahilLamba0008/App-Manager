import userTasks from "@/models/userTasks";
import { extractTokenPayload } from "@/utils/functions";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const cookies = request.cookies.get("userToken");
    // console.log("cookies---", cookies?.value);
    const auth = cookies?.value;
    if (!auth) {
      console.log("Unauthorized --", auth);
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    const userId = await extractTokenPayload(auth);

    const taskList = await userTasks.find({ user_id: userId });

    if (!taskList) {
      return new Response(
        JSON.stringify({ message: "Tasks with this user id not found" }),
        {
          status: 401,
        }
      );
    }
    return new Response(JSON.stringify(taskList), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Unauthorized Error" }), {
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

    const deletedTask = await userTasks.deleteOne({ _id: taskId });

    if (deletedTask) {
      return new Response(
        JSON.stringify({ message: "Task deleted successfully" }),
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
