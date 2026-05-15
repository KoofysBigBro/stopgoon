'use client'

import { Accessibility, Eye } from 'lucide-react'
import Toggle from './Toggle'

type AccessibilitySectionProps = {
  motion: string
  setMotion: (v: string) => void
  highContrast: boolean
  setHighContrast: (v: boolean) => void
  saveSetting: (field: string, value: string | boolean) => void
}

export default function AccessibilitySection({ motion, setMotion, highContrast, setHighContrast, saveSetting }: AccessibilitySectionProps) {
  return (
    <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <Accessibility className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        <h2 className="text-lg font-bold">Accessibility</h2>
      </div>

      <div className="space-y-4">
        <Toggle
          enabled={motion === 'reduced'}
          onChange={(v) => {
            const newVal = v ? 'reduced' : 'normal'
            setMotion(newVal)
            saveSetting('motion', newVal)
          }}
          label="Reduced Motion"
          description="Minimize animations throughout the app"
        />

        <div className="flex items-center justify-between py-3 border-t border-slate-100 dark:border-slate-800">
          <div>
            <p className="font-medium flex items-center gap-2">
              <Eye className="w-4 h-4 text-slate-400" />
              High Contrast
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Increase text contrast for readability</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={highContrast}
            aria-label="High contrast"
            onClick={() => {
              const newVal = !highContrast
              setHighContrast(newVal)
              saveSetting('high_contrast', newVal)
            }}
            className={`w-12 h-7 rounded-full transition-colors relative ${
              highContrast ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'
            }`}
          >
            <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all shadow-sm ${
              highContrast ? 'left-6' : 'left-1'
            }`} />
          </button>
        </div>
      </div>
    </section>
  )
}
