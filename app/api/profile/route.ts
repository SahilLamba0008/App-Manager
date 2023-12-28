import user from "@/models/user";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(request: Request | NextRequest) {
  try {
    const auth = cookies().get("userToken") || "";
    if (!auth) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }

    const { id } = jwt.verify(auth.value, process.env.JWT_SECRET!) as any;

    const userExist = await user.findOne({ _id: id });

    if (!userExist) {
      return new Response("User not found", {
        status: 401,
      });
    }

    return new Response(JSON.stringify(userExist), {
      status: 200,
    });
  } catch (error) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }
}

export const dynamic = "force-dynamic";
