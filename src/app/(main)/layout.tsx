import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import {getNavUser} from "@/lib/nav"

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let navUser = await getNavUser()

  return (
    <>
      <Navbar user={navUser} />
      {children}
      <Footer />
    </>
  )
}
