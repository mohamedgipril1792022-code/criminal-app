const V='tasgeel-v1.2.0',F=['./','index.html','manifest.json','icon-192-v3.png','icon-512-v3.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.allSettled(F.map(u=>c.add(u)))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;
 const same=new URL(r.url).origin===location.origin;
 if(r.mode==='navigate'||(same&&/\/(index\.html)?$/.test(new URL(r.url).pathname))){
  // الصفحة نفسها: الشبكة أولاً (عشان اللابتوب ياخد آخر نسخة دايماً)، والكاش عند انقطاع النت
  e.respondWith(fetch(r).then(res=>{if(res&&res.ok){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}return res}).catch(()=>caches.match(r,{ignoreSearch:true}).then(h=>h||caches.match('index.html'))));return}
 e.respondWith(caches.open(V).then(c=>c.match(r,{ignoreSearch:true}).then(hit=>{
  const net=fetch(r).then(res=>{if(res&&res.ok&&same)c.put(r,res.clone());return res}).catch(()=>hit);
  return hit||net})))});
