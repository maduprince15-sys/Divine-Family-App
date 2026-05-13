import { NextResponse } from 'next/server'
import { createClient } from '../../../../lib/supabase/server'

const allowedRoles = [
  'owner',
  'admin',
  'moderator',
  'secretary',
  'financial_manager',
  'member',
]

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { memberId, role } = body

    if (!memberId || !role) {
      return NextResponse.json(
        { error: 'memberId and role are required' },
        { status: 400 }
      )
    }

    if (!allowedRoles.includes(role)) {
      return NextResponse.json({ error: 'Invalid role.' }, { status: 400 })
    }

    const { data: currentProfile, error: currentProfileError } = await supabase
      .from('profiles')
      .select('id, role')
      .eq('id', user.id)
      .single()

    if (currentProfileError || !currentProfile) {
      return NextResponse.json(
        { error: 'Current profile not found.' },
        { status: 404 }
      )
    }

    const currentUserRole = currentProfile.role
    const canManageRoles = currentUserRole === 'owner' || currentUserRole === 'admin'

    if (!canManageRoles) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })
    }

    if (role === 'owner' && currentUserRole !== 'owner') {
      return NextResponse.json(
        { error: 'Only owner can assign owner role.' },
        { status: 403 }
      )
    }

    if (memberId === user.id && currentUserRole === 'owner' && role !== 'owner') {
      return NextResponse.json(
        { error: 'You cannot remove your own owner role.' },
        { status: 403 }
      )
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', memberId)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update member role error:', error)
    return NextResponse.json(
      { error: 'Something went wrong while updating the role.' },
      { status: 500 }
    )
  }
}