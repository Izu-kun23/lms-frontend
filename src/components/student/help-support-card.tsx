"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function HelpSupportCard() {
  return (
    <Card className="bg-linear-to-br from-blue-500 to-blue-600 text-white border-0">
      <CardHeader>
        <CardTitle className="text-white">Need Help?</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-white/90 text-center">
            Contact your instructor or support team for assistance
          </p>
          <Button variant="secondary" className="w-full">
            Get Support
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}


