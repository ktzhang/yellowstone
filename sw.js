// Offline support. On install this saves the guide, its photos, icons and fonts. After that everything is
// answered from the cache, and the page itself is refreshed in the background when there's signal.
// If you replace a photo or icon under the same name, bump CACHE so phones fetch it again.
const CACHE = "trip-guide-v3";
const PAGE = "./", ROOT = new URL(PAGE, location.href).pathname;

self.addEventListener("install", event => event.waitUntil((async () => {
	const cache = await caches.open(CACHE);
	const addAny = urls => Promise.all(urls.map(u => cache.add(u).catch(() => {})));
	const page = await fetch(PAGE, { cache: "no-cache" });
	if (!page.ok) throw new Error(`Couldn't fetch the guide (${page.status})`);
	const html = await page.clone().text();
	await cache.addAll(["manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png"]);
	// Photos are listed in the PHOTOS set in index.html. A missing photo shouldn't block offline use.
	const photoList = html.match(/const PHOTOS = new Set\(\[([^\]]*)\]\)/)?.[1] || "";
	const photos = [...photoList.matchAll(/"([\w-]+)"/g)].map(m => `img/${m[1]}.jpg`);
	await addAny(photos);
	// Fonts are optional too: without them the guide falls back to system fonts.
	const fontCss = html.match(/https:\/\/fonts\.googleapis\.com\/css2[^"]+/)?.[0].replaceAll("&amp;", "&");
	try {
		const css = fontCss && await fetch(fontCss);
		if (css?.ok) {
			await cache.put(fontCss, css.clone());
			const files = new Set((await css.text()).match(/https:\/\/fonts\.gstatic\.com\/[^)\s'"]+/g));
			await addAny([...files]);
		}
	} catch (e) {}
	// Saved last, so a page in the cache means everything else made it too.
	await cache.put(PAGE, page);
	await self.skipWaiting();
})()));

self.addEventListener("activate", event => event.waitUntil((async () => {
	// Other sites can share this origin (e.g. GitHub Pages project sites), so only clear this guide's old caches.
	for (const key of await caches.keys()) if (key.startsWith("trip-guide-") && key !== CACHE) await caches.delete(key);
	await self.clients.claim();
	for (const client of await self.clients.matchAll({ type: "window" })) client.postMessage("offline-ready");
})()));

self.addEventListener("fetch", event => {
	const req = event.request, url = new URL(req.url);
	if (req.method !== "GET") return;
	const own = url.origin === location.origin, font = /^fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
	const nav = req.mode === "navigate";
	if (!own && !font) return;
	if (nav && url.pathname !== ROOT && url.pathname !== ROOT + "index.html") return;
	const key = nav ? PAGE : req;
	event.respondWith((async () => {
		const cache = await caches.open(CACHE);
		const hit = await cache.match(key, { ignoreVary: true });
		if (hit && !nav) return hit;
		// The page is checked against the server, not the browser's HTTP cache, so a new version is saved on the first
		// visit after it's published. An open page is told, so it can offer a reload.
		const ver = r => r.headers.get("etag") || r.headers.get("last-modified");
		const fresh = fetch(nav ? new Request(req.url, { cache: "no-cache", credentials: "same-origin" }) : req).then(async res => {
			if (res.ok) {
				await cache.put(key, res.clone());
				if (nav && hit && ver(res) && ver(res) !== ver(hit)) (await self.clients.get(event.resultingClientId || event.clientId))?.postMessage("updated");
			}
			return res;
		});
		if (!hit) return fresh;
		event.waitUntil(fresh.catch(() => {}));
		return hit;
	})());
});
