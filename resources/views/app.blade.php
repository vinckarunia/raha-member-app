<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    
    <!-- CSRF Token for forms if needed -->
    <meta name="csrf-token" content="{{ csrf_token() }}">
    
    <!-- App Title -->
    <title>{{ config('app.name', 'Portal Jemaat GKI Raha') }}</title>
    
    <!-- PWA Meta Tags -->
    <meta name="theme-color" content="#4F46E5">
    <meta name="description" content="Portal Jemaat GKI Raha - Akses profil dan informasi jemaat">
    
    <!-- Apple Touch Icon -->
    <link rel="apple-touch-icon" href="/icon-192x192.png">
    
    <!-- PWA Manifest -->
    <link rel="manifest" href="/manifest.json">
    
    <!-- Fonts (Optional - Google Fonts) -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Vite Assets -->
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
</head>
<body class="antialiased">
    <!-- React app will mount here -->
    <div id="root"></div>
    
    <!-- Register Service Worker for PWA (Production only) -->
    <script>
        // Only register service worker in production
        const isProduction = !window.location.hostname.includes('localhost') && 
                           !window.location.hostname.includes('127.0.0.1');
        
        if ('serviceWorker' in navigator && isProduction) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('ServiceWorker registered:', registration);
                    })
                    .catch(error => {
                        console.log('ServiceWorker registration failed:', error);
                    });
            });
        }
    </script>
</body>
</html>