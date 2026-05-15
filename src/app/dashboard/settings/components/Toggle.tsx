'use client'

type ToggleProps = {
  enabled: boolean
  onChange: (enabled: boolean) => void
  label: string
  description?: string
  activeColor?: string
}

export default function Toggle({ enabled, onChange, label, description, activeColor = 'bg-indigo-600' }: ToggleProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="font-medium">{label}</p>
        {description && <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={label}
        onClick={() => onChange(!enabled)}
        className={`w-12 h-7 rounded-full transition-colors relative ${
          enabled ? activeColor : 'bg-slate-200 dark:bg-slate-700'
        }`}
      >
        <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all shadow-sm ${
          enabled ? 'left-6' : 'left-1'
        }`} />
      </button>
    </div>
  )
}
