'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

type UpdateMemberRoleProps = {
  memberId: string
  currentRole: string
  currentUserRole: string
  isCurrentUser: boolean
}

const roles = [
  { value: 'member', label: 'Member' },
  { value: 'moderator', label: 'Moderator' },
  { value: 'secretary', label: 'Secretary' },
  { value: 'financial_manager', label: 'Financial Manager' },
  { value: 'admin', label: 'Admin' },
  { value: 'owner', label: 'Owner' },
]

export default function UpdateMemberRole({
  memberId,
  currentRole,
  currentUserRole,
  isCurrentUser,
}: UpdateMemberRoleProps) {
  const router = useRouter()
  const [role, setRole] = useState(currentRole)
  const [message, setMessage] = useState('')
  const [isPending, startTransition] = useTransition()

  const canChangeOwner = currentUserRole === 'owner'

  async function updateRole() {
    setMessage('')

    if (!canChangeOwner && role === 'owner') {
      setMessage('Only the owner can assign owner role.')
      return
    }

    if (isCurrentUser && currentUserRole === 'owner' && role !== 'owner') {
      setMessage('You cannot remove your own owner role here.')
      return
    }

    startTransition(async () => {
      const response = await fetch('/api/members/update-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId, role }),
      })

      const result = await response.json()

      if (!response.ok) {
        setMessage(result.error || 'Role update failed.')
        return
      }

      setMessage('Role updated.')
      router.refresh()
    })
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        <select
          value={role}
          onChange={(event) => setRole(event.target.value)}
          disabled={isPending}
          className="rounded-full border border-yellow-800 bg-black px-3 py-2 text-xs text-white outline-none"
        >
          {roles.map((item) => {
            if (item.value === 'owner' && !canChangeOwner) {
              return null
            }

            return (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            )
          })}
        </select>

        <button
          type="button"
          onClick={updateRole}
          disabled={isPending || role === currentRole}
          className="rounded-full bg-yellow-500 px-4 py-2 text-xs font-bold text-black hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? 'Saving...' : 'Save'}
        </button>
      </div>

      {message && (
        <p className="text-xs text-yellow-300">
          {message}
        </p>
      )}
    </div>
  )
}