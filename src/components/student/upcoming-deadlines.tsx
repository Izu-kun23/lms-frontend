"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function UpcomingDeadlines() {
  // This would typically come from API data
  // For now, showing placeholder structure
  const deadlines = [
    { type: "Assignment", title: "Math Homework", due: "Jan 30, 2025" },
    { type: "Quiz", title: "Science Quiz", due: "Feb 5, 2025" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Deadlines</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="mb-2 text-sm font-medium">Overview:</div>
            <div className="text-2xl font-bold">2</div>
            <div className="text-xs text-muted-foreground">Due this week</div>
          </div>
          <div className="space-y-3 pt-4 border-t">
            {deadlines.map((deadline, index) => (
              <div key={index} className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-medium">{deadline.title}</div>
                  <div className="text-xs text-muted-foreground">{deadline.type}</div>
                </div>
                <div className="text-xs text-muted-foreground">{deadline.due}</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


