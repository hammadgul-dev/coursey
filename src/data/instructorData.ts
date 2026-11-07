import {LayoutDashboard, BookOpen, PlusSquare, UserCog} from "lucide-react"

export let sidebarLinks = [
  {
    label: "Dashboard",
    href: "/instructor-dashboard",
    icon: LayoutDashboard,
    active: true,
  },
  {label: "My Courses", href: "#my-courses", icon: BookOpen, active: false},
  {
    label: "Create Course",
    href: "/instructor-dashboard/create-course",
    icon: PlusSquare,
    active: false,
  },
  {
    label: "Profile",
    href: "/profile",
    icon: UserCog,
    active: false,
  },
]
