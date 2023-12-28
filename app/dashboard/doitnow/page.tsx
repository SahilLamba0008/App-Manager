import { cookies } from "next/headers";
import DoItNow from "@/components/Page/DoItNow";

export default async function Page() {
  const host = process.env.NEXT_PUBLIC_HOST + "/api/taskslist/doitnow";
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
      <DoItNow taskList={data} />
    </div>
  );
}
