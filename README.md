# Zhang Family Trip Guide: Yellowstone & Grand Teton

An interactive single-file web app for the Zhang family's Oct 3–12, 2026 trip with Kevin, Elena, Bing, Ken and Helen. It has:

- **Trip overview:** a map of the whole trip with every day's route, plus the travelers. On wide screens the day list sits beside the map, and **Expand map** opens it full-screen.
- **Explore exhibits:** a museum-style tour where every place is an exhibit, grouped into five galleries. Each exhibit has a placard, key facts, things to look for and an audio guide, and you can stamp a trip passport as you visit.
- **Day by day:** each day's timed rundown, stop cards, an expandable route map and a weather forecast for every stop, plus a Thu–Sat swap for picking the Grand Teton day that shows cloud cover and rain at Jenny Lake and Oxbow Bend for each date.
- **Field log:** a wildlife spotting log that records who spotted each animal and keeps a family tally, plus every day's field notes in one place, downloadable as text.
- **Checklist & packing:** reconfirmation tasks, an October packing list, and confirmed travel and lodging.
- **Tools:** Old Faithful eruption countdown, trip trivia quiz with a family scoreboard, expense splitter with settle-up, safety and useful info, and settings (appearance including dark mode, text size, clear saved data).
- **Everywhere:** a Now / Next banner on trip days with the current temperature and any National Weather Service alert, a trip progress bar, search across the whole guide (⌘K / Ctrl+K or `/`), favorite exhibits, badges in the Field log, and share links for days and exhibits.
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

## Weather

Weather comes from two free services that need no API key and allow requests from any site (`Access-Control-Allow-Origin: *`):

- **Forecasts:** [Open-Meteo](https://open-meteo.com/). One request covers every place in the itinerary for the rest of the trip, in °F and Mountain Time. The terms allow non-commercial use up to 10,000 calls a day, and the data is licensed CC BY 4.0, so everywhere a forecast appears the page says **"Weather data by Open-Meteo.com"** with a link.
- **Alerts:** the [National Weather Service API](https://www.weather.gov/documentation/services-web-api) (`/alerts/active?point=<lat>,<lon>`), for today's location only, credited **"Alerts: National Weather Service"**. Open-Meteo has no alerts, and NWS forecasts only reach 7 days ahead, so they aren't used.

Coverage in the parks is spotty, so weather never blocks the page:

- The last good response is cached in `localStorage` under its own key, `ys-weather`, with the time it was fetched. Pages render from the cache first and refresh in the background.
- The page refetches on load when the cache is more than 30 minutes old, when the browser comes back online, and when the tab becomes visible again. Switching pages inside the guide doesn't refetch.
- Panels show "Updated 7:40 a.m." and add "may be out of date" after three hours. A failed fetch keeps the cached copy. With no cache, the day page links to forecast.weather.gov instead.

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

Progress and checkmarks are saved in the browser's `localStorage` under the key `ys-guide2`, and the weather cache under `ys-weather`.
