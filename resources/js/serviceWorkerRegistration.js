/**
 * Service Worker Registration untuk Laravel + React
 * Portal Jemaat GKI Raha
 */

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
  window.location.hostname === '[::1]' ||
  window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

export function register(config) {
  // Cek apakah browser support service worker
  if (!('serviceWorker' in navigator)) {
    console.log('[PWA] Service Worker tidak didukung browser ini');
    return;
  }

  window.addEventListener('load', () => {
    // Path ke service worker (di folder public Laravel)
    const swUrl = '/sw.js';

    if (isLocalhost) {
      // Di localhost, cek service worker tapi tidak cache agresif
      checkValidServiceWorker(swUrl, config);
      
      navigator.serviceWorker.ready.then(() => {
        console.log(
          '[PWA] App berjalan di localhost. Service Worker aktif tapi tidak aggressive caching.'
        );
      });
    } else {
      // Di production, register service worker penuh
      registerValidSW(swUrl, config);
    }
  });
}

function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      console.log('[PWA] Service Worker berhasil diregister');
      
      // Cek update service worker
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // Ada update tersedia
              console.log('[PWA] Update tersedia! Reload untuk mendapat versi terbaru.');
              
              // Callback jika ada
              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
              
              // Optional: Auto-update setelah beberapa detik
              setTimeout(() => {
                if (window.confirm('Versi baru tersedia! Reload sekarang?')) {
                  registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
                  window.location.reload();
                }
              }, 1000);
            } else {
              // Pertama kali install
              console.log('[PWA] Konten berhasil di-cache untuk offline!');
              
              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
      
      // Cek update setiap 1 jam
      setInterval(() => {
        registration.update();
      }, 60 * 60 * 1000);
    })
    .catch((error) => {
      console.error('[PWA] Registrasi Service Worker gagal:', error);
    });
}

function checkValidServiceWorker(swUrl, config) {
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then((response) => {
      const contentType = response.headers.get('content-type');
      
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        // Service worker tidak ditemukan
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            console.log('[PWA] Service Worker tidak valid, di-unregister');
            window.location.reload();
          });
        });
      } else {
        // Service worker valid
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log('[PWA] Tidak ada internet. App dalam mode offline.');
    });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
        console.log('[PWA] Service Worker berhasil di-unregister');
      })
      .catch((error) => {
        console.error('[PWA] Error unregister:', error.message);
      });
  }
}

/**
 * Helper untuk cek apakah app sedang standalone (installed)
 */
export function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  );
}

/**
 * Helper untuk show install prompt
 */
let deferredPrompt;

export function setupInstallPrompt(callback) {
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent default browser install prompt
    e.preventDefault();
    
    // Simpan event untuk digunakan nanti
    deferredPrompt = e;
    
    // Callback ke app untuk show custom install button
    if (callback) {
      callback(true);
    }
    
    console.log('[PWA] Install prompt tersedia');
  });
  
  // Detect saat user install app
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    console.log('[PWA] App berhasil diinstall!');
    
    if (callback) {
      callback(false);
    }
  });
}

export async function promptInstall() {
  if (!deferredPrompt) {
    console.log('[PWA] Install prompt tidak tersedia');
    return false;
  }
  
  // Show install prompt
  deferredPrompt.prompt();
  
  // Wait for user response
  const { outcome } = await deferredPrompt.userChoice;
  console.log(`[PWA] User ${outcome === 'accepted' ? 'menerima' : 'menolak'} install prompt`);
  
  // Reset prompt
  deferredPrompt = null;
  
  return outcome === 'accepted';
}