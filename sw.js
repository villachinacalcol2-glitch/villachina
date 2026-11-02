/* Villa China · service worker: primero internet; si no hay conexión, muestra la última versión guardada */
const CACHE="villa-china-v2";
const BASE=["./","index.html","panel.html","manifest.webmanifest","panel.webmanifest","icon-192.png","icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(BASE).catch(()=>{})));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener("fetch",e=>{
  const r=e.request;
  if(r.method!=="GET"||new URL(r.url).origin!==location.origin)return;   // Firebase y otros servicios van directo
  e.respondWith(fetch(r).then(res=>{const copia=res.clone();caches.open(CACHE).then(c=>c.put(r,copia));return res}).catch(()=>caches.match(r).then(m=>m||caches.match("index.html"))));
});
