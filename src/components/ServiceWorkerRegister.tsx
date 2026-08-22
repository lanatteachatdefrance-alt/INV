'use client'

import { useEffect } from 'react'

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      !('serviceWorker' in navigator)
    ) {
      return
    }

    const unregisterServiceWorkers = async () => {
      try {
        const registrations =
          await navigator.serviceWorker.getRegistrations()

        for (const registration of registrations) {
          await registration.unregister()
        }

        // Nettoyage des anciens caches PWA
        if ('caches' in window) {
          const cacheNames = await caches.keys()

          await Promise.all(
            cacheNames.map((cacheName) =>
              caches.delete(cacheName)
            )
          )
        }
      } catch (error) {
        console.error(
          'Erreur désactivation PWA:',
          error
        )
      }
    }

    unregisterServiceWorkers()
  }, [])

  return null
}