import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { SectionCards } from "@/components/Chart/section-cards"
import { ChartAreaInteractive } from "@/components/Chart/chart-area-interactive"
import { PieChart1 } from "@/components/Chart/pie-chart"
import { BarChart1 } from "@/components/Chart/bar-chart"
import { LineChart1 } from "@/components/Chart/line-chart"

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar className="h-auto" />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
            <SectionCards />
          </div>
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50">
                <PieChart1 />
            </div>
            <div className="aspect-video rounded-xl bg-muted/50">
                <BarChart1 />
            </div>
            <div className="aspect-video rounded-xl bg-muted/50">
                <LineChart1 />
            </div>
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
            <ChartAreaInteractive />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
