"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, BarChartIcon as ChartSquare, Lightbulb, TrendingUp } from "lucide-react"
import type { ParameterConfig, SimulationResults } from "@/lib/types"
import DashboardView from "./dashboard-view"
import DetailedCalculationView from "./detailed-calculation-view"
import InsightsView from "./insights-view"
import InflationAnalysisView from "./inflation-analysis-view"

interface ResultsPanelProps {
  results: SimulationResults
  parameters: ParameterConfig
  showDetails: boolean
}

export default function ResultsPanel({ results, parameters, showDetails }: ResultsPanelProps) {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <Card className="h-full shadow-lg border-primary/20 bg-card">
      <CardHeader className="bg-muted pb-4 border-b border-primary/20">
        <CardTitle className="text-primary">Resultados</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full rounded-none border-b grid grid-cols-4 bg-transparent">
            <TabsTrigger
              value="dashboard"
              className="rounded-none py-3 flex gap-2 data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-primary"
            >
              <BarChart className="h-5 w-5" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger
              value="calculation"
              className="rounded-none py-3 flex gap-2 data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-primary"
            >
              <ChartSquare className="h-5 w-5" />
              <span className="hidden sm:inline">Cálculo Detallado</span>
            </TabsTrigger>
            <TabsTrigger
              value="insights"
              className="rounded-none py-3 flex gap-2 data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-primary"
            >
              <Lightbulb className="h-5 w-5" />
              <span className="hidden sm:inline">Insights</span>
            </TabsTrigger>
            {parameters.model === "inflation" && (
              <TabsTrigger
                value="inflation"
                className="rounded-none py-3 flex gap-2 data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-primary"
              >
                <TrendingUp className="h-5 w-5" />
                <span className="hidden sm:inline">Inflación</span>
              </TabsTrigger>
            )}
          </TabsList>
          <TabsContent value="dashboard" className="p-6 focus-visible:outline-none focus-visible:ring-0">
            <DashboardView results={results} parameters={parameters} />
          </TabsContent>
          <TabsContent value="calculation" className="p-6 focus-visible:outline-none focus-visible:ring-0">
            <DetailedCalculationView results={results} parameters={parameters} showDetails={showDetails} />
          </TabsContent>
          <TabsContent value="insights" className="p-6 focus-visible:outline-none focus-visible:ring-0">
            <InsightsView results={results} parameters={parameters} />
          </TabsContent>
          {parameters.model === "inflation" && (
            <TabsContent value="inflation" className="p-6 focus-visible:outline-none focus-visible:ring-0">
              <InflationAnalysisView results={results} parameters={parameters} />
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  )
}
