'use client'

import { useState, useEffect } from 'react'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { Activity } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

export default function UrgeIntensityChart() {
  const [data, setData] = useState<{date: string, intensity: number}[]>([])
  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Initialize the last 7 days with 0 intensity
      const last7Days: { dateObj: Date; date: string; intensity: number }[] = []
      for (let i = 6; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        last7Days.push({
          dateObj: d,
          date: d.toLocaleDateString('en-US', { weekday: 'short' }),
          intensity: 0
        })
      }

      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      
      const { data: logs } = await supabase
        .from('urge_logs')
        .select('intensity, created_at')
        .eq('user_id', user.id)
        .gte('created_at', weekAgo.toISOString())

      if (logs) {
        logs.forEach(log => {
          const logDate = new Date(log.created_at)
          const dayMatch = last7Days.find(d => 
            d.dateObj.getDate() === logDate.getDate() && 
            d.dateObj.getMonth() === logDate.getMonth()
          )
          if (dayMatch) {
            dayMatch.intensity = Math.max(dayMatch.intensity, log.intensity)
          }
        })
      }

      setData(last7Days.map(d => ({ date: d.date, intensity: d.intensity })))
    } catch {
      // fallback to empty chart
    }
  }
  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Urge Intensity
          </h3>
          <p className="text-sm text-muted">Your struggle levels over the past week.</p>
        </div>
      </div>
      
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorIntensity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: 'var(--muted)' }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: 'var(--muted)' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--surface)', 
                borderColor: 'var(--border)',
                borderRadius: '12px',
                boxShadow: 'var(--shadow-md)'
              }}
              itemStyle={{ color: 'var(--foreground)' }}
            />
            <Area 
              type="monotone" 
              dataKey="intensity" 
              stroke="var(--primary)" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorIntensity)" 
              activeDot={{ r: 6, strokeWidth: 0, fill: 'var(--primary)' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
