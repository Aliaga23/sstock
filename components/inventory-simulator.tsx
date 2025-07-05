"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SimulatorView from "@/components/simulator-view"
import ExamplesView from "@/components/examples-view"
import { useMediaQuery } from "@/hooks/use-media-query"
import type { ParameterConfig, Example } from "@/lib/types"
import { calculateResults } from "@/lib/calculator"
import { defaultParameters, examples } from "@/lib/data"
import ConfigurationPanel from "@/components/configuration-panel"

export default function InventorySimulator() {
  const [activeTab, setActiveTab] = useState<string>("configuration")
  const [parameters, setParameters] = useState<ParameterConfig>(defaultParameters)
  const [results, setResults] = useState(calculateResults(parameters))
  const [showDetails, setShowDetails] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")

  useEffect(() => {
    setResults(calculateResults(parameters))
  }, [parameters])

  const handleCalculate = () => {
    setResults(calculateResults(parameters))
  }

  const handleApplyExample = (example: Example) => {
    setParameters(example.parameters)
    setActiveTab("simulator")
  }

  const handleContinueToSimulator = () => {
    setActiveTab("simulator")
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-muted">
      <header className="border-b border-primary/20 bg-gradient-to-r from-muted via-muted/90 to-primary/10 shadow-lg">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-primary p-2 rounded-md shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                >
                  <path d="M20 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"></path>
                  <path d="M20 17a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"></path>
                  <path d="M6 11a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"></path>
                  <path d="M6 6h8v4h8v8h-8v-4H6V6Z"></path>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-primary">SmartStock</h1>
                <p className="text-xs text-muted-foreground mt-1">Optimización de Inventario</p>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-muted/50 px-3 py-1 rounded-md border border-primary/10 text-sm">
                <span className="text-muted-foreground">V.:</span> <span className="text-primary font-medium">1.0</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-center mb-8">
            <TabsList className="w-full max-w-lg h-12 sm:h-14 p-1 sm:p-1.5 rounded-full bg-muted/60 backdrop-blur-sm shadow-xl border border-primary/10 flex">
              <TabsTrigger
                value="configuration"
                className="flex-1 h-full py-1 sm:py-2 px-2 sm:px-6 text-sm sm:text-base font-medium rounded-full transition-all duration-300 
                data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg
                data-[state=active]:scale-105 data-[state=active]:font-semibold
                hover:bg-muted/80 hover:text-primary/90
                flex items-center justify-center gap-1 sm:gap-3"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="flex-shrink-0"
                >
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <span className="truncate">Configuración</span>
              </TabsTrigger>
              <TabsTrigger
                value="simulator"
                className="flex-1 h-full py-1 sm:py-2 px-2 sm:px-6 text-sm sm:text-base font-medium rounded-full transition-all duration-300 
                data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg
                data-[state=active]:scale-105 data-[state=active]:font-semibold
                hover:bg-muted/80 hover:text-primary/90
                flex items-center justify-center gap-1 sm:gap-3"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="flex-shrink-0"
                >
                  <path d="M3 3v18h18"></path>
                  <path d="M7 12v5"></path>
                  <path d="M11 8v9"></path>
                  <path d="M15 16v1"></path>
                  <path d="M19 4v13"></path>
                </svg>
                <span className="truncate">Simulador</span>
              </TabsTrigger>
              <TabsTrigger
                value="examples"
                className="flex-1 h-full py-1 sm:py-2 px-2 sm:px-6 text-sm sm:text-base font-medium rounded-full transition-all duration-300 
                data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg
                data-[state=active]:scale-105 data-[state=active]:font-semibold
                hover:bg-muted/80 hover:text-primary/90
                flex items-center justify-center gap-1 sm:gap-3"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="flex-shrink-0"
                >
                  <rect width="8" height="8" x="2" y="2" rx="2"></rect>
                  <path d="M14 2c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2"></path>
                  <path d="M20 2c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2"></path>
                  <path d="M10 18H5c-1.7 0-3-1.3-3-3v-1"></path>
                  <polyline points="7 21 10 18 7 15"></polyline>
                  <rect width="8" height="8" x="14" y="14" rx="2"></rect>
                </svg>
                <span className="truncate">Ejemplos</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="configuration" className="mt-0">
            <ConfigurationPanel
              parameters={parameters}
              setParameters={setParameters}
              showDetails={showDetails}
              setShowDetails={setShowDetails}
              onCalculate={handleCalculate}
              onContinue={handleContinueToSimulator}
            />
          </TabsContent>

          <TabsContent value="simulator" className="mt-0">
            <div className="max-w-6xl mx-auto">
              <SimulatorView.ResultsPanel results={results} parameters={parameters} showDetails={showDetails} />
            </div>
          </TabsContent>

          <TabsContent value="examples" className="mt-0">
            <ExamplesView examples={examples} onApplyExample={handleApplyExample} />
          </TabsContent>
        </div>
      </Tabs>

      <footer className="border-t border-primary/20 py-4 bg-muted">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          Pantry Predictor © {new Date().getFullYear()} - Simulador de Gestión de Inventario
        </div>
      </footer>
    </div>
  )
}
