const CACHE_NAME = 'todo-cache-v1';
const urlsToCache = [
  '/',
  '/ToDoList/index.html',
  '/ToDoList/style.css',
  '/ToDoList/main.js',
  '/ToDoList/manifest.json',
  '/ToDoList/icons/icono.png'
];

// Instalación del Service Worker y almacenamiento de los recursos en caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache)
          .catch(err => {
            console.error('Error al agregar recursos a la caché:', err);
            // Puedes listar los recursos que fallaron si es necesario
            urlsToCache.forEach(url => {
              fetch(url).catch(fetchError => {
                console.error(`Error al intentar obtener ${url}:`, fetchError);
              });
            });
          });
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
