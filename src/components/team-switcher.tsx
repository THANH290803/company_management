"use client"

import * as React from "react"
// import { ChevronsUpDown, Plus } from "lucide-react"
import axios from "axios"

import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  // useSidebar,
} from "@/components/ui/sidebar"

interface Company {
  _id: string
  name: string
  is_headquarter: boolean
  phone: string
  email: string
}


export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string
    logo: React.ElementType
    plan: string
  }[]
}) {
  // const { isMobile } = useSidebar()
  const [activeTeam] = React.useState(teams[0])

  const [companyData, setCompanyData] = React.useState<Company | null>(null)

  React.useEffect(() => {
    const token = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")
  
    if (storedUser && token) {
      const user = JSON.parse(storedUser)
      const companyId = user.company_id // 👈 lấy từ user.company_id
      console.log(companyId)
  
      if (companyId) {
        axios.get(`https://qthl-group.onrender.com/api/company/${companyId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setCompanyData(response.data)
        })
        .catch((error) => {
          console.error("Error fetching company data:", error)
        })
      }
    }
  }, [])  


  if (!activeTeam || !companyData) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <activeTeam.logo className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeTeam.name}
                </span>
                <span className="truncate text-xs">{companyData.is_headquarter ? "Trụ sở chính" : "Chi nhánh"}</span>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
