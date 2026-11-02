/* Villa China · service worker v3
   Las páginas (.html) siempre se piden frescas a internet; la copia guardada solo se usa sin conexión. */
const CACHE="villa-china-v3";
const BASE=["./","index.html","panel.html","manifest.webmanifest","panel.webmanifest","icon-192.png","icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(BASE.map(u=>new Request(u,{cache:"reload"}))).catch(()=>{})));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const r=e.request, u=new URL(r.url);
  if(r.method!=="GET"||u.origin!==location.origin)return;          // Firebase y otros servicios van directo
  const esPagina=r.mode==="navigate"||/\.html$|\/$/.test(u.pathname)||u.pathname.endsWith("sw.js");
  e.respondWith(fetch(r,esPagina?{cache:"no-store"}:{}).then(res=>{if(res.ok){const c=res.clone();caches.open(CACHE).then(x=>x.put(r,c))}return res})
    .catch(()=>caches.match(r).then(m=>m||caches.match("index.html"))));
});
