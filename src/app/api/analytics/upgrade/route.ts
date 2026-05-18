import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { rateLimit } from '@/utils/rate-limit';
import { getClientIp } from '@/utils/request';
import { logApiError } from '@/utils/api-error';

const ALLOWED_EVENTS = new Set([
  'upgrade_page_viewed',
  'upgrade_plan_selected',
  'upgrade_checkout_started',
  'upgrade_checkout_error',
  'upgrade_checkout_completed',
]);

type UpgradeEventBody = {
  name?: string;
  data?: Record<string, string | number | boolean>;
};

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const ipRate = rateLimit(`upgrade-analytics:ip:${ip}`, 60, 60000);
    if (!ipRate.allowed) {
      return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json().catch(() => ({}))) as UpgradeEventBody;
    const name = typeof body.name === 'string' ? body.name : '';
    if (!ALLOWED_EVENTS.has(name)) {
      return NextResponse.json({ error: 'Invalid event name' }, { status: 400 });
    }

    const metadata = body.data && typeof body.data === 'object' ? body.data : {};

    const { error } = await supabase.from('upgrade_funnel_events').insert({
      user_id: user.id,
      event_name: name,
      metadata,
    });

    if (error) {
      logApiError('/api/analytics/upgrade', error, { stage: 'insert_event', name, userId: user.id });
      return NextResponse.json({ error: 'Failed to log event' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    logApiError('/api/analytics/upgrade', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
