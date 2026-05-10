'use client'

import { useState, useEffect } from 'react'
import { Smartphone, Download, Bell, BellOff, Laptop } from 'lucide-react'

export default function DeviceSettings() {
  const [installPrompt, setInstallPrompt] = useState<any>(null)
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [notificationStatus, setNotificationStatus] = useState<NotificationPermission>('default')

  useEffect(() => {
    // Listen for PWA install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      setInstallPrompt(e)
    })

    // Check notification status
    if ('Notification' in window) {
      setNotificationStatus(Notification.permission)
      setNotificationsEnabled(Notification.permission === 'granted')
    }
  }, [])

  const handleInstallClick = async () => {
    if (!installPrompt) {
      alert("App is already installed, or your browser doesn't support automatic installation. You can usually install it from your browser's share or settings menu ('Add to Home Screen').")
      return
    }
    
    installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') {
      setInstallPrompt(null)
    }
  }

  const toggleNotifications = async () => {
    if (!('Notification' in window)) {
      alert("This browser does not support desktop notifications")
      return
    }

    if (notificationsEnabled) {
      // Browsers don't let websites revoke permissions, only users can.
      alert("To disable notifications, please click the lock icon next to the URL bar and change the notification setting.")
      return
    }

    const permission = await Notification.requestPermission()
    setNotificationStatus(permission)
    
    if (permission === 'granted') {
      setNotificationsEnabled(true)
      new Notification('StopGoon', {
        body: 'Notifications successfully enabled! We will remind you to check in.',
        icon: '/icon.svg'
      })
    } else {
      alert("Notification permission denied. Please enable it in your browser settings if you change your mind.")
    }
  }

  return (
    <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm mb-6">
      <div className="flex items-center gap-3 mb-5">
        <Smartphone className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        <h2 className="text-lg font-bold">Device & App Settings</h2>
      </div>

      <div className="space-y-6">
        {/* App Install */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Install App
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-[280px] sm:max-w-md">
              Add StopGoon to your home screen or desktop for quick access and a full-screen native experience.
            </p>
          </div>
          <button 
            onClick={handleInstallClick}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Install App</span>
          </button>
        </div>

        <div className="h-px bg-slate-200 dark:bg-slate-800 w-full" />

        {/* Notifications */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Push Notifications
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-[280px] sm:max-w-md">
              Get daily check-in reminders and alerts directly to your phone or computer.
            </p>
          </div>
          <button
            onClick={toggleNotifications}
            className={`w-12 h-7 rounded-full transition-colors relative flex-shrink-0 ${
              notificationsEnabled ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'
            }`}
          >
            <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all shadow-sm ${
              notificationsEnabled ? 'left-6' : 'left-1'
            }`} />
          </button>
        </div>
      </div>
    </section>
  )
}
