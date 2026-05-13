import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '../../lib/supabase/server'

export default async function MembersPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const role = profile?.role ?? 'member'
  const canManage = role === 'owner' || role === 'admin'

  const { data: members, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, phone, role, created_at')
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen bg-[#050303] px-4 py-8 text-white md:px-8">
      <section className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-4 border-b border-yellow-900/40 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-yellow-500">
              Divine Family
            </p>

            <h1 className="mt-3 text-3xl font-bold md:text-5xl">
              Members
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-300">
              Family directory for registered members.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="rounded-full border border-yellow-700/70 px-4 py-2 text-sm text-yellow-300 hover:bg-yellow-700/20"
          >
            Dashboard
          </Link>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-900/40 bg-red-950/30 p-4 text-red-300">
            Error loading members: {error.message}
          </div>
        )}

        <div className="mt-8 overflow-hidden rounded-2xl border border-yellow-900/40 bg-[#120707]">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-black/40 text-xs uppercase tracking-widest text-yellow-400">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Joined</th>
              </tr>
            </thead>

            <tbody>
              {members?.map((member) => (
                <tr
                  key={member.id}
                  className="border-t border-yellow-900/20 text-gray-200"
                >
                  <td className="px-4 py-3">
                    {member.full_name || 'No name'}
                  </td>

                  <td className="px-4 py-3">
                    {member.email || 'No email'}
                  </td>

                  <td className="px-4 py-3">
                    {member.phone || '—'}
                  </td>

                  <td className="px-4 py-3">
                    <span className="rounded-full bg-yellow-500 px-3 py-1 text-xs font-bold text-black">
                      {member.role}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-gray-400">
                    {new Date(member.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}

              {members?.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-6 text-center text-gray-400"
                  >
                    No members yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {!canManage && (
          <p className="mt-4 text-xs text-gray-500">
            You can view members. Only owners and admins will manage roles later.
          </p>
        )}
      </section>
    </main>
  )
}