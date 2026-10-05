# Yellowstone & Grand Teton Trip Guide

An interactive single-file web app for a family trip to Yellowstone and Grand Teton, Oct 3–12, 2026. It has:

- **Trip overview:** a map of the whole trip with every day's route, plus the travelers. On wide screens the day list sits beside the map, and **Expand map** opens it full-screen.
- **Explore exhibits:** a museum-style tour where every place is an exhibit, grouped into five galleries. Each exhibit has a placard, key facts, things to look for and an audio guide, and you can stamp a trip passport as you visit.
- **Day by day:** each day's timed rundown, stop cards with a tour guide (background, more facts and a Listen button), an expandable route map and a weather forecast for every stop, plus a Thu–Sat swap for picking the Grand Teton day that shows cloud cover and rain at Jenny Lake and Oxbow Bend for each date.
- **Field log:** a wildlife spotting log that records who spotted each animal and keeps a family tally, plus every day's field notes in one place, downloadable as text.
- **Checklist & packing:** reconfirmation tasks, an October packing list, and confirmed travel and lodging.
- **Tools:** Old Faithful eruption countdown, trip trivia quiz with a family scoreboard, expense splitter with settle-up, safety and useful info, settings (appearance including dark mode, text size, animal tracks, clear saved data), and credits for the photos, maps and weather.
- **Everywhere:** a Now / Next banner on trip days with the current temperature and any National Weather Service alert, a trip progress bar, search across the whole guide (⌘K / Ctrl+K or `/`), favorite exhibits, badges in the Field log, share links for days and exhibits, and a bear, moose, fox, hare, squirrel or raven, seen from above, that walks across the page leaving its tracks (Walking, Still or Off in Settings).
- **Offline:** opened from a website, the guide saves itself, its photos and fonts on the device and keeps working without signal. It can also be added to the home screen.
- Each day page also has route length, sunrise, sunset and golden-hour times, a field-notes box, and a "Print this day" link. Links like `#day/teton` or `#exhibit/oxbow` open a page directly, and the browser back button works.

Exhibit groupings live in `ROOMS`, and the "Look for" lists in `LOOK`.

## Files

| File | Contents |
|---|---|
| `index.html` | The whole app: HTML, CSS, JS and trip data. It has no dependencies and no build step. |
| `README.md` | This page. |
| `sw.js` | Offline support: saves the guide, photos and fonts on the first visit, then serves them from the device. |
| `manifest.webmanifest`, `icons/` | Name and icons for adding the guide to a home screen. |
| `img/<place>.jpg` | Optional photos, for example `img/oldfaithful.jpg` or `img/oxbow.jpg`. The keys are the names in `P`. Add each key to the `PHOTOS` set in `index.html` too; the photo then replaces that place's drawn illustration. |

## Run it locally

Open `index.html` in any browser. That's all you need.

Offline saving only works when the guide is served from a website. To try it locally, run `python3 -m http.server` in this folder and open http://localhost:8000.

## Weather

Weather comes from two free services that need no API key and allow requests from any site (`Access-Control-Allow-Origin: *`):

- **Forecasts:** [Open-Meteo](https://open-meteo.com/). One request covers every place in the itinerary for the rest of the trip, in °F and Mountain Time. The terms allow non-commercial use up to 10,000 calls a day, and the data is licensed CC BY 4.0, so everywhere a forecast appears the page says **"Weather data by Open-Meteo.com"** with a link.
- **Alerts:** the [National Weather Service API](https://www.weather.gov/documentation/services-web-api) (`/alerts/active?point=<lat>,<lon>`), for today's location only, credited **"Alerts: National Weather Service"**. Open-Meteo has no alerts, and NWS forecasts only reach 7 days ahead, so they aren't used.

Coverage in the parks is spotty, so weather never blocks the page:

- The last good response is cached in `localStorage` under its own key, `ys-weather`, with the time it was fetched. Pages render from the cache first and refresh in the background.
- The page refetches on load when the cache is more than 30 minutes old, when the browser comes back online, and when the tab becomes visible again. Switching pages inside the guide doesn't refetch.
- Panels show "Updated 7:40 a.m." and add "may be out of date" after three hours. A failed fetch keeps the cached copy. With no cache, the day page links to forecast.weather.gov instead.

## Host it

1. Keep this repo private. Older commits and this README still contain the personal details.
2. Copy only `index.html`, `sw.js`, `manifest.webmanifest`, `icons/` and `img/` to a static host with HTTPS, for example a separate public GitHub repo with Pages turned on, Netlify or Cloudflare Pages.
3. On each phone, open the private link once while you have signal. The guide then has your details and works offline.

## Personal details and the private link

The family name, travelers, flight numbers, the Airbnb address and the home city aren't in `index.html`, so the guide can be hosted on a public website. They come from a private link, `<site address>/#trip=<code>`. Opening it once saves the details on that device; the part after `#` is never sent to the website. Without the link, the guide says "your friends" and "their flight" instead.

- Share the link only with the group: **Tools → Settings → Trip details → Share private link**.
- On iPhone, a copy added to the home screen has its own storage, so open that copy and paste the link into the same setting.
- The code is base64url-encoded JSON: `family` (surname), `travelers` and `guests` (lists of names), `arr`/`dep` (the guests' flight numbers), `out1`/`out2`/`home` (your flights home and home city), and `addr`/`addrShort` (the Airbnb address, full and short). Every field is optional; the `TRIP` object in `index.html` shows where each one appears.

## Make your own trip

All the trip data lives in the `<script>` block of `index.html`:

- `FAMILY`: the travelers' names from the private link, used by the expense splitter, the spotting log and trivia. You can also change them in the app under **Tools → Split expenses → Edit travelers**.
- `P`: places, as `[lat, lon, name, introduction]`.
- `GUIDE`: each place's background story and extra facts, shown on the day pages and exhibits.
- `FIXED`, `SHARED`, `TAIL`: days, each with a route `path` (place keys), `stops` (`[placeKey, plan, optional?]`), times and tips.
- `SHARED_DATES`: the dates whose days can be swapped with each other.
- `BOOKINGS`, `CHECKS`: the booking table and the checklist.
- `B`, `BASEMAP`, `LEGS`: the map. `BASEMAP` is an embedded Esri World Topo snapshot covering exactly the area in `B`, and `LEGS` holds road routes from OSRM (OpenStreetMap) as encoded polylines. Both are pre-rendered, so the maps work offline and inside Slack. For a different region, re-capture the basemap for the new `B` and re-fetch the legs; otherwise the maps fall back to a plain background with straight lines.

## Data sources and credits

The app's **Tools → Credits** section (link: `#credits`) carries all of these:

| What | Source | Credit line |
|---|---|---|
| Photos | 28 photos from Wikimedia Commons, under public-domain and Creative Commons licenses | Each photo's title, author and license, from [`img/CREDITS.md`](img/CREDITS.md) |
| Basemap | Esri World Topographic Map snapshot | "Basemap © Esri, USGS, NPS and other contributors" |
| Roads | OpenStreetMap, routed with OSRM | "Roads © OpenStreetMap contributors, routed with OSRM" |
| Forecasts | [Open-Meteo](https://open-meteo.com/), CC BY 4.0 | "Weather data by Open-Meteo.com", linked, wherever forecasts appear |
| Alerts | [National Weather Service API](https://www.weather.gov/documentation/services-web-api) | "Alerts: National Weather Service" |

`PHOTO_CREDITS` in `index.html` mirrors `img/CREDITS.md`; update both when you change a photo.

Progress and checkmarks are saved in the browser's `localStorage` under the key `ys-guide2`, the details from the private link under `ys-guide-trip`, and the weather cache under `ys-weather`.
