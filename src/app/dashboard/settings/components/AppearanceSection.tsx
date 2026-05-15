'use client'

import { Palette, Sun, Moon, Type } from 'lucide-react'
import { useTheme } from 'next-themes'

type AppearanceSectionProps = {
  fontScale: string
  setFontScale: (v: string) => void
  saveSetting: (field: string, value: string | boolean) => void
}

export default function AppearanceSection({ fontScale, setFontScale, saveSetting }: AppearanceSectionProps) {
  const { theme, setTheme } = useTheme()

  return (
    <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <Palette className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        <h2 className="text-lg font-bold">Appearance</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="text-sm font-semibold block mb-3">Theme</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => { setTheme('light'); saveSetting('theme', 'light') }}
              className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                theme === 'light'
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <Sun className="w-5 h-5 text-amber-500" />
              <div className="text-left">
                <p className="font-semibold text-sm text-foreground">Light</p>
                <p className="text-xs text-muted">Calm &amp; warm</p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => { setTheme('dark'); saveSetting('theme', 'dark') }}
              className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                theme === 'dark'
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <Moon className="w-5 h-5 text-indigo-500" />
              <div className="text-left">
                <p className="font-semibold text-sm text-foreground">Dark</p>
                <p className="text-xs text-muted">Immersive focus</p>
              </div>
            </button>
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold block mb-3">
            <Type className="w-4 h-4 inline mr-1.5" />
            Text Size
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'normal', label: 'Normal', size: 'text-sm' },
              { value: 'large', label: 'Large', size: 'text-base' },
              { value: 'xlarge', label: 'Extra Large', size: 'text-lg' },
            ].map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => { setFontScale(opt.value); saveSetting('font_scale', opt.value) }}
                className={`py-3 rounded-xl border-2 font-medium transition-all ${opt.size} ${
                  fontScale === opt.value
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >{opt.label}</button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
