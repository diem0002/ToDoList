const CACHE_NAME = 'todo-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css', // Asegúrate de que este nombre coincida con tu archivo CSS
  '/main.js', // Asegúrate de que este nombre coincida con tu archivo JavaScript
  '/manifest.json',
  '/icons/icono.png' // Asegúrate de que esta ruta sea correcta
];

// Instalación del Service Worker y almacenamiento de los recursos en caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Intercepta las solicitudes de red y sirve los recursos almacenados en caché
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
