# Translation review needed

Stage 9 introduced UI strings for `ko` / `en` / `ja` / `zh-CN`. The following still need professional review or are intentionally left on Korean fallback.

## Safety / regulatory copy (priority)

- Dynamic reasons from `evaluateActivityStatus` (wind/wave/prohibited place messages) remain Korean until reason codes are introduced.
- Spot `cautionText`, `restrictionDescription`, and weather warning titles from source data.
- `safety.machineTranslatedNotice` and on-site priority disclaimers in non-Korean locales.
- Environment / plogging danger notes stored on mock route data.

## Content fields without full localized records

- Partner place names/descriptions (mostly Korean source data).
- Waste point and plogging route names/descriptions.
- Fish species dictionary (`src/data/i18n/fishSpecies.ts`) — only partial coverage; unknown names fall back to Korean original (no invented English/scientific names).
- Fishing spot `names` / `descriptions` — only a subset of spots have non-Korean entries.

## Product / UX copy to polish

- Schedule share text builders (`formatScheduleShareText`, `formatActivityShareText`).
- Remaining form labels inside fishing/plogging/partner result forms.
- Business-hours status badges and some partner detail panel strings.
- Delay hints from `compareScheduleTiming` / `formatDelayHint`.

## Out of scope

- Tide / 물때 strings (feature removed).
- “못난이 수산물” terminology (excluded from product scope).

## How to re-check

```bash
npm run check:i18n
```
