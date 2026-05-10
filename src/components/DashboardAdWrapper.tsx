'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import AdBanner from '@/components/AdBanner'

export default function DashboardAdWrapper() {
  const [isPremium, setIsPremium] = useState(true) // default true to prevent flash
  const [loaded, setLoaded] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('users').select('subscription_tier').eq('id', user.id).single()
      setIsPremium(data?.subscription_tier === 'premium')
      setLoaded(true)
    }
    check()
  }, [])

  if (!loaded || isPremium) return null

  return <AdBanner isPremium={isPremium} />
}
