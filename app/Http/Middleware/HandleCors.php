<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class HandleCors
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);
        
        // Add PWA-specific headers for service worker and manifest
        if ($request->is('sw.js')) {
            $response->headers->set('Content-Type', 'application/javascript');
            $response->headers->set('Service-Worker-Allowed', '/');
            $response->headers->set('Cache-Control', 'no-cache, no-store, must-revalidate');
        }
        
        if ($request->is('manifest.json')) {
            $response->headers->set('Content-Type', 'application/manifest+json');
            $response->headers->set('Cache-Control', 'public, max-age=604800'); // Cache for 1 week
        }
        
        return $response;
    }
}