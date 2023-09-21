import { CitrusLoanCard } from "@/components/citrus-loan-card"
import { DatePicker } from "@/components/ui/date-picker"
import { Typography } from "@/components/ui/typography"
import supabase from "@/lib/supabase"
import { useEffect, useState } from "react"
import { endOfDay, startOfDay } from "date-fns"

export default function HomePage() {
  const [activities, setActivities] = useState([])
  const [date, setDate] = useState<Date | undefined>(new Date())

  useEffect(() => {
    supabase
      .from("shyft_citrus_activities")
      .select("*")
      .order("created_at", { ascending: false })
      .gt("created_at", startOfDay(date ?? new Date()).toISOString())
      .lt("created_at", endOfDay(date ?? new Date()).toISOString())
      .then(({ data }) => {
        // @ts-ignore
        setActivities(data ?? [])
      })
  }, [date])

  return (
    <>
      <div className="mb-10 flex items-center justify-between">
        <Typography as="h4" level="h6" className="font-bold">
          Citrus Loan Tracker
        </Typography>
        <DatePicker selected={date} onSelect={setDate} />
      </div>
      <div className="mx-auto max-w-2xl space-y-6">
        {activities.map((activity) => (
          // @ts-ignore
          <CitrusLoanCard key={activity.id} activity={activity} />
        ))}
      </div>
    </>
  )
}
