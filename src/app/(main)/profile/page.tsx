import ProfileForm from "@/components/profile/ProfileForm"
import {profileUsers} from "@/data/profileData"

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<any>
}) {
  let sp = (await searchParams) as any
  let role = ["student", "instructor", "admin"].includes(sp?.role)
    ? sp.role
    : "student"
  let user = (profileUsers as any)[role] || profileUsers.student
  let joined = new Date(user?.joined || "").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  let info = [
    {label: "Email", value: user?.email || ""},
    {
      label: "Role",
      value:
        (user?.role || "").charAt(0).toUpperCase() +
        (user?.role || "").slice(1),
    },
    {label: "Joined", value: joined},
  ]

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="fade-up flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl dark:text-zinc-100">
          Account Settings
        </h1>
        <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-semibold capitalize text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
          {user?.role}
        </span>
      </div>
      <p
        className="fade-up mt-1 text-sm text-gray-500 dark:text-zinc-400"
        style={{animationDelay: "60ms"}}
      >
        Manage your profile and password.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {info.map((item: any, i: number) => (
          <div
            key={item.label}
            className="fade-up rounded-xl border border-gray-200 bg-white p-4 transition-colors duration-200 hover:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-950"
            style={{animationDelay: `${120 + i * 60}ms`}}
          >
            <p className="text-xs font-medium text-gray-500 dark:text-zinc-400">
              {item.label}
            </p>
            <p className="mt-1 truncate text-sm font-semibold text-gray-900 dark:text-zinc-100">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="fade-up mt-6" style={{animationDelay: "320ms"}}>
        <ProfileForm user={user} />
      </div>
    </main>
  )
}
