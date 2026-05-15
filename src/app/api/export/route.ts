import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { rateLimit } from '@/utils/rate-limit'

export async function GET(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  const { allowed } = rateLimit(`export:${ip}`, 3, 60000)
  if (!allowed) {
    return NextResponse.json({ error: 'Too Many Requests' }, { status: 429, headers: { 'Retry-After': '60' } })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check if premium
  const { data: profile } = await supabase.from('users').select('subscription_tier').eq('id', user.id).single()
  if (profile?.subscription_tier !== 'premium') {
    return NextResponse.json({ error: 'Premium feature only' }, { status: 403 })
  }

  try {
    // Fetch all user data
    const [
      { data: checkins },
      { data: relapses },
      { data: urges },
      { data: journals }
    ] = await Promise.all([
      supabase.from('daily_checkins').select('*').eq('user_id', user.id),
      supabase.from('relapses').select('*').eq('user_id', user.id),
      supabase.from('urge_logs').select('*').eq('user_id', user.id),
      supabase.from('journal_entries').select('*').eq('user_id', user.id)
    ])

    const exportData = {
      export_date: new Date().toISOString(),
      user_id: user.id,
      stats: {
        total_checkins: checkins?.length || 0,
        total_relapses: relapses?.length || 0,
        total_urges: urges?.length || 0,
        total_journals: journals?.length || 0,
      },
      data: {
        checkins: checkins || [],
        relapses: relapses || [],
        urges: urges || [],
        journals: journals || []
      }
    }

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="stopgoon_backup_${new Date().toISOString().split('T')[0]}.json"`,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to export data' }, { status: 500 })
  }
}
