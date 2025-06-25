"use client"

import { trpc } from "@/trpc/clent"

export default function Home() {
  const { data }  = trpc.hello.useQuery({ text: "antonio" })
  console.log(data)
  return (
    <div>
      Client component says: {data?.greeting}
    </div>
  )
}