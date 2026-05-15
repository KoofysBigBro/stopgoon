'use client'

import { useState } from 'react'
import { Download, Crown, FileJson } from 'lucide-react'
import Link from 'next/link'

export default function DataExport({ isPremium }: { isPremium: boolean }) {
  const [isExporting, setIsExporting] = useState(false)
  const [exportError, setExportError] = useState<string | null>(null)

  const handleExport = async () => {
    if (!isPremium) return
    setExportError(null)
    setIsExporting(true)
    try {
      const res = await fetch('/api/export')
      if (!res.ok) throw new Error('Export failed')
      
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `stopgoon_backup_${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (e) {
      setExportError('Failed to export data. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 md:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-500">
          <Download className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Data Export & Backup</h2>
          <p className="text-sm text-muted">Download a complete backup of your journals, stats, and history.</p>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl bg-background border border-border p-6 flex flex-col md:flex-row items-center gap-6 text-center md:text-left justify-between">
        {!isPremium && (
          <div className="absolute inset-0 z-20 backdrop-blur-sm bg-background/60 flex items-center justify-center p-6 text-center">
            <div className="flex flex-col items-center">
              <Crown className="w-6 h-6 text-amber-400 mb-2" />
              <p className="font-bold text-sm mb-2">Premium Feature</p>
              <Link href="/dashboard/upgrade" className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg font-bold transition-all">
                Unlock Backups
              </Link>
            </div>
          </div>
        )}

        <div className={`flex items-center gap-4 ${!isPremium ? 'opacity-30 pointer-events-none filter blur-sm' : ''}`}>
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 flex-shrink-0">
            <FileJson className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold">JSON Archive</h3>
            <p className="text-sm text-muted">Includes all journals, check-ins, relapses, and urges.</p>
          </div>
        </div>

        {exportError && (
          <p className="text-sm text-red-500 mb-2 text-center">{exportError}</p>
        )}
        <button 
          onClick={handleExport}
          disabled={!isPremium || isExporting}
          className={`px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors ${
            !isPremium ? 'opacity-30 pointer-events-none' : 
            isExporting ? 'bg-surface-hover text-muted cursor-not-allowed' : 
            'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          {isExporting ? 'Exporting...' : <><Download className="w-4 h-4" /> Export Data</>}
        </button>
      </div>
    </div>
  )
}
