# Zhang Family Trip Guide: Yellowstone & Grand Teton

An interactive single-file web app for the Zhang family's Oct 3–12, 2026 trip with Kevin, Elena, Bing, Ken and Helen. It has:

- **Explore exhibits:** a museum-style tour where every place is an exhibit, grouped into five galleries. Each exhibit has a placard, key facts, things to look for and an audio guide, and you can stamp a trip passport as you visit.
- **Trip overview:** a map of the whole trip with every day's route, plus the travelers.
- **Day by day:** each day's timed rundown, stop cards and route map, plus a Thu–Sat swap for picking the Grand Teton day.
- **Field log:** a wildlife spotting log that records who spotted each animal and keeps a family tally, plus every day's field notes in one place, downloadable as text.
- **Checklist & packing:** reconfirmation tasks, an October packing list, and confirmed travel and lodging.
- **Tools:** Old Faithful eruption countdown, trip trivia quiz with a family scoreboard, expense splitter with settle-up, safety and useful info, and settings (appearance including dark mode, text size, clear saved data).
- **Everywhere:** a Now / Next banner on trip days, a trip progress bar, search across the whole guide (⌘K / Ctrl+K or `/`), favorite exhibits, badges in the Field log, and share links for days and exhibits.
- Each day page also has route length, sunrise, sunset and golden-hour times, a field-notes box, and a "Print this day" link. Links like `#day/teton` or `#exhibit/oxbow` open a page directly, and the browser back button works.

Exhibit groupings live in `ROOMS`, and the "Look for" lists in `LOOK`.

## Files

| File | Contents |
|---|---|
| `index.html` | The whole app: HTML, CSS, JS and trip data. It has no dependencies and no build step. |
| `README.md` | This page. |
| `img/<place>.jpg` | Optional photos, for example `img/oldfaithful.jpg` or `img/oxbow.jpg`. The keys are the names in `P`. Add each key to the `PHOTOS` set in `index.html` too; the photo then replaces that place's drawn illustration. |

## Run it locally

Open `index.html` in any browser. That's all you need.

## Create the repo

1. Create a new **private** repo, for example `yellowstone-trip-guide`. Keep it private because the app contains the Airbnb address, flight numbers and names.
2. Add `index.html` (the **Trip Guide** tab, saved as `index.html`) and this README.
3. Optional: to host it, go to **Settings → Pages → Deploy from a branch → `main` / root**. The site will be at `https://<user>.github.io/yellowstone-trip-guide/`. A Pages site is public even when the repo is private on some plans, so remove the personal details first if that applies to you.

## Make your own trip

All the trip data lives in the `<script>` block of `index.html`:

- `FAMILY`: the travelers' names, used by the expense splitter, the spotting log and trivia. You can also change them in the app under **Tools → Split expenses → Edit travelers**.
- `P`: places, as `[lat, lon, name, introduction]`.
- `FIXED`, `SHARED`, `TAIL`: days, each with a route `path` (place keys), `stops` (`[placeKey, plan, optional?]`), times and tips.
- `SHARED_DATES`: the dates whose days can be swapped with each other.
- `BOOKINGS`, `CHECKS`: the booking table and the checklist.
- `B`, `BASEMAP`, `LEGS`: the map. `BASEMAP` is an embedded Esri World Topo snapshot covering exactly the area in `B`, and `LEGS` holds road routes from OSRM (OpenStreetMap) as encoded polylines. Both are pre-rendered, so the maps work offline and inside Slack. For a different region, re-capture the basemap for the new `B` and re-fetch the legs; otherwise the maps fall back to a plain background with straight lines.

Map credits: Basemap © Esri, USGS, NPS and other contributors. Roads © OpenStreetMap contributors, routed with OSRM.

Photo credits: 27 photos from Wikimedia Commons, used under public-domain and Creative Commons licenses. See [`img/CREDITS.md`](img/CREDITS.md) for each author and license.

Progress and checkmarks are saved in the browser's `localStorage` under the key `ys-guide`.
