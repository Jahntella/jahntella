/* Jahntella World of Sweet service worker v1
   Network-first navigation: never freeze a release catalog or cache streaming audio.
   Only the offline fallback and small icon are precached. */
const CACHE='jahntella-app-shell-v2';
const CORE=['/offline.html','/app-icons/jahntella-192.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('jahntella-app-shell-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET'||new URL(request.url).origin!==self.location.origin)return;
  if(request.mode!=='navigate')return; // Never intercept MP3, MP4, images, or app API requests.
  event.respondWith(fetch(request).catch(()=>caches.match('/offline.html')));
});
