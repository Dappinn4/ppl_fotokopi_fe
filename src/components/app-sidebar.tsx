import { House, Package, ChevronUp, ChevronRight, Cog,  FileChartColumnIncreasing } from 'lucide-react';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarMenuBadge,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  
} from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Menu items
interface SubItem {
  name: string;
  url: string;
  notification?: number;
}

interface Project {
  name: string;
  url: string;
  icon: React.ComponentType;
  subItems: SubItem[];
}

const projects: Project[] = [
  {
    name: 'Beranda',
    url: '/',
    icon: House,
    subItems: [],
  },
  {
    name: 'Inventaris',
    url: '/inventory',
    icon: Package,
    subItems: [],
  },
  {
    name: 'Laporan',
    url: '/laporan-harian',
    icon: FileChartColumnIncreasing,
    subItems: [],
  }
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" className="h-full flex flex-col">
      <SidebarContent className="flex flex-col h-full">
        {/* Dummy Logo Section */}
        <div className="flex items-center justify-center h-25">
        <Image src="/LogoDummy.png" alt="Logo" className="h-auto w-auto" width={100} height={100} />
        </div>

        <SidebarGroup className="flex-grow">
            <Separator className='mb-4' />
          <SidebarGroupContent className="flex-grow"> {/* Allows main content to expand */}
            <SidebarMenu>
              {projects.map((project) => (
                <Collapsible key={project.name} defaultOpen={false} className="group/collapsible">
                  <SidebarMenuItem>
                    {project.subItems && project.subItems.length > 0 ? (
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="flex items-center justify-between space-x-2 hover:bg-gray-100 pe-5 ps-0 py-2 rounded-md">
                          <div className="flex items-center space-x-2">
                            <project.icon />
                            <span className='ps-2'>{project.name}</span>
                          </div>
                          <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                    ) : (
                      <a href={project.url} className="flex items-center justify-between space-x-2 hover:bg-gray-100 py-2 rounded-md">
                        <div className="flex items-center space-x-2">
                          <project.icon />
                          <span className='ps-2'>{project.name}</span>
                        </div>
                      </a>
                    )}

                    {project.subItems && project.subItems.length > 0 && (
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {project.subItems.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.name}>
                              <SidebarMenuSubButton asChild>
                                <a href={subItem.url} className="block py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                                  {subItem.name}
                                  {subItem.notification && subItem.notification > 0 && (
                                    <SidebarMenuBadge>{subItem.notification}</SidebarMenuBadge>
                                  )}
                                </a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    )}
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Sidebar Footer */}
        <SidebarFooter className="flex-shrink-0">
          <Separator />
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <Cog />Settings
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                  <DropdownMenuItem>
                    <span>Account</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>History</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Help</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}