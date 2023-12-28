import { cookies } from "next/headers";
import Completed from "@/components/Page/Completed";

export default async function Page() {
  const host = process.env.NEXT_PUBLIC_HOST + "/api/taskslist/completed";
  const res = await fetch(host, {
    cache: "no-store",
    headers: {
      cookie: cookies().toString(),
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  const data = await res.json();

  return (
    <div className="flex-1 bg-[#212121] border-2 border-[#323232] rounded-2xl">
      <Completed taskList={data} />
    </div>
  );
}
