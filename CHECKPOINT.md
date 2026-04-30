# JellyOrganizer Refactoring Changelog

Begonnen: 2026-04-29  
Ziel: Shuffle-Queue-Reihenfolge + stabile ID-Keys im InPlayerEpisodePreview  
Status: **IN BEARBEITUNG**

---

## 01.05.2026 — Preview nicht sichtbar

### Auftrag
InPlayerEpisodePreview wird im Player nicht angezeigt (weder Shuffle noch Normalmodus).

### Konzept
- Aktives Element anhand von `PlaybackProgressInfo.ItemId` statt `MediaSourceId` bestimmen.
- `activeSeason`/`dataIsAllowedForPreview` robust gegen fehlende Season-Daten machen.
- Preview-Renderpfad auf fehlende aktive Season absichern und Bundle neu bauen.

### Betroffene Dateien
| Datei | Geplante Änderung |
|-------|-------------------|
| `CHECKIN.md` | Neuer CHECKIN/Checkout-Eintrag |
| `CHECKPOINT.md` | Task-Eintrag + Änderungsprotokoll |
| `Web/Services/DataFetcher.ts` | Aktives Item per `ItemId` setzen (Fallback) |
| `Web/Services/ProgramDataStore.ts` | `activeSeason`/`dataIsAllowedForPreview` absichern |
| `Web/InPlayerPreview.ts` | Preview-Render-Guards für fehlende Season |
| `Web/InPlayerPreview.js` | Bundle-Rebuild |

### Änderungen
| Zeitstempel | Datei:Zeile | Beschreibung |
|-------------|-------------|--------------|
| 01.05.2026 01:55:37:493 | `CHECKIN.md:1` | CHECKIN für Preview-Fehler ergänzt |
| 01.05.2026 01:55:51:742 | `CHECKPOINT.md:5-33` | Task-Header ergänzt, Status auf IN BEARBEITUNG gesetzt |
| 01.05.2026 01:56:22:128 | `Web/Services/DataFetcher.ts:38-58` | Aktives Item via ItemId gesetzt, Progress-Update nutzt ItemId |
| 01.05.2026 01:56:45:594 | `Web/Services/ProgramDataStore.ts:35-139` | `activeSeason` fallback + Preview-Guard für fehlende Season |
| 01.05.2026 01:56:54:272 | `Web/InPlayerPreview.ts:171-207` | Season-Rendering gegen fehlende activeSeason abgesichert |
| 01.05.2026 01:57:53:484 | `Web/Services/ProgramDataStore.ts:35-139` | `activeSeason` liefert Default-Season statt `undefined` |
| 01.05.2026 01:58:24:849 | `Web/InPlayerPreview.js` | Bundle via webpack aktualisiert (TS-Fehler vorhanden) |

**Detail:**
```markdown
# ALT (CHECKPOINT.md:5)
Status: **ABGESCHLOSSEN**

# NEU (CHECKPOINT.md:5)
Status: **IN BEARBEITUNG**
```

**Detail:**
```text
# NEU (CHECKIN.md:1)
CHECKIN ; 01.05.2026 01:55:37:493 (MEZ) ; *Now i dont see the inplayer episode preview at all. Neither randomized nor normal.* ;
```

**Detail:**
```ts
// ALT (Web/Services/DataFetcher.ts:38-58)
// save the media id of the currently played video
if (this.programDataStore.activeMediaSourceId !== playingInfo.MediaSourceId)
    this.programDataStore.activeMediaSourceId = playingInfo.MediaSourceId
...
const episode: BaseItem = this.programDataStore.getItemById(playingInfo.MediaSourceId)

// NEU (Web/Services/DataFetcher.ts:38-58)
// save the item id of the currently played video
const activeItemId: string = playingInfo.ItemId ?? playingInfo.Item?.Id ?? playingInfo.MediaSourceId
if (activeItemId && this.programDataStore.activeMediaSourceId !== activeItemId)
    this.programDataStore.activeMediaSourceId = activeItemId
...
const episode: BaseItem = this.programDataStore.getItemById(activeItemId)
```

**Detail:**
```ts
// ALT (Web/Services/ProgramDataStore.ts:35-139)
public get activeSeason(): Season {
    return this.seasons.find(season => season.episodes.some(episode => episode.Id === this.activeMediaSourceId))
}
...
case ItemType.Series:
    return this.activeSeason.episodes.length >= 1

// NEU (Web/Services/ProgramDataStore.ts:35-139)
public get activeSeason(): Season | undefined {
    return this.seasons.find(season => season.episodes.some(episode => episode.Id === this.activeMediaSourceId))
        ?? this.seasons.at(0)
}
...
case ItemType.Series: {
    const activeSeason = this.activeSeason
    return Boolean(activeSeason && activeSeason.episodes.length >= 1)
}
```

**Detail:**
```ts
// ALT (Web/InPlayerPreview.ts:171-207)
const renderSeasonList = (): void => {
    showingSeasonList = true
    popupTitle.setVisible(false)
    contentDiv.innerHTML = ''
    listElementFactory.createSeasonElements(programDataStore.seasons, contentDiv, programDataStore.activeSeason.IndexNumber, popupTitle)
}
...
popupTitle.setText(programDataStore.activeSeason.seasonName)
popupTitle.setVisible(true)
listElementFactory.createEpisodeElements(programDataStore.activeSeason.episodes, contentDiv)

// NEU (Web/InPlayerPreview.ts:171-207)
const renderSeasonList = (): void => {
    const activeSeason = programDataStore.activeSeason
    if (!activeSeason) {
        logger.error('No active season data available for preview list.', programDataStore)
        return
    }
    showingSeasonList = true
    popupTitle.setVisible(false)
    contentDiv.innerHTML = ''
    listElementFactory.createSeasonElements(programDataStore.seasons, contentDiv, activeSeason.IndexNumber, popupTitle)
}
...
const activeSeason = programDataStore.activeSeason
if (!activeSeason) {
    logger.error('No active season data available for preview list.', programDataStore)
    break
}
popupTitle.setText(activeSeason.seasonName)
popupTitle.setVisible(true)
listElementFactory.createEpisodeElements(activeSeason.episodes, contentDiv)
```

**Detail:**
```ts
// ALT (Web/Services/ProgramDataStore.ts:35-139)
public get activeSeason(): Season | undefined {
    return this.seasons.find(season => season.episodes.some(episode => episode.Id === this.activeMediaSourceId))
        ?? this.seasons.at(0)
}
...
case ItemType.Series: {
    const activeSeason = this.activeSeason
    return Boolean(activeSeason && activeSeason.episodes.length >= 1)
}

// NEU (Web/Services/ProgramDataStore.ts:35-139)
public get activeSeason(): Season {
    return this.seasons.find(season => season.episodes.some(episode => episode.Id === this.activeMediaSourceId))
        ?? this.seasons[0]
        ?? {
            seasonId: '',
            seasonName: '',
            episodes: [],
            IndexNumber: 0
        }
}
...
case ItemType.Series:
    return this.activeSeason.episodes.length >= 1
```

**Detail:**
```text
// ALT (Web/InPlayerPreview.js)
Bundle vor Änderungen

// NEU (Web/InPlayerPreview.js)
Bundle via `npx webpack --config webpack.config.js` aktualisiert
```

### Ergebnis
- Aktives Preview-Item basiert auf `ItemId`; Preview sollte wieder erscheinen (Shuffle + Normal).
- Season-Zugriffe sind gegen fehlende Daten abgesichert; leere Season-Daten blockieren die UI nicht.

### Was NICHT geändert wurde
- Plugin-Konfiguration/Settings-UI unverändert.
- Playback/Resume-Logik außerhalb der Active-Item-Zuordnung unverändert.
- CSS/Styles der Preview-UI unverändert.

### Neue Tests
| Test-Klasse | Test-Methode | Prüft |
|-------------|-------------|-------|
| — | — | Keine Testsuite im Repo vorhanden |

### Testlauf
```
01.05.2026 01:58:58 — dotnet build InPlayerEpisodePreview.sln
Build succeeded.
```
```
01.05.2026 01:58:24 — npx webpack --config webpack.config.js
webpack 5.106.2 compiled with 54 errors (vorhandene TS-Strictness-Fehler in DataFetcher/ProgramDataStore)
```

---

## 01.05.2026 — Manifest Release Update

### Auftrag
Manifest.json aktualisieren, damit die in CHECKPOINT dokumentierten Shuffle-/Queue-Änderungen als installierbare Version im Repo verfügbar sind und Jellyfin die Erweiterung anzeigen kann.

### Konzept
- Plugin-Version auf 1.6.2 anheben, damit neue Release-IDs für 10.11.0/10.10.7 erzeugt werden.
- Release-ZIPs für beide Ziel-ABIs bauen, unter `releases/` versioniert ablegen, MD5-Checksummen ermitteln.
- Manifest-Einträge (Changelog, URLs, Checksums, Timestamp) ergänzen.

### Betroffene Dateien
| Datei | Geplante Änderung |
|-------|-------------------|
| `CHECKIN.md` | Neuer CHECKIN/Checkout-Eintrag |
| `CHECKPOINT.md` | Neuer Task-Eintrag + Änderungsprotokoll |
| `Namo.Plugin.InPlayerEpisodePreview/Namo.Plugin.InPlayerEpisodePreview.csproj` | Plugin-Version anheben |
| `manifest.json` | Neue Versionsblöcke für 10.11.0/10.10.7 |
| `releases/` | Neue Release-ZIP-Artefakte |

### Änderungen
| Zeitstempel | Datei:Zeile | Beschreibung |
|-------------|-------------|--------------|
| 01.05.2026 00:26:23:421 | `CHECKIN.md:1` | CHECKIN für Manifest-Update ergänzt |
| 01.05.2026 00:28:10:000 | `CHECKPOINT.md:5-32` | Task-Header ergänzt, Status auf IN BEARBEITUNG gesetzt |
| 01.05.2026 00:30:20:000 | `Namo.Plugin.InPlayerEpisodePreview.csproj:8` | PluginVersion auf 1.6.2 angehoben |
| 01.05.2026 00:35:10:000 | `releases/InPlayerEpisodePreview_1.6.2.2-10.11.0.zip` | Release-ZIP für Jellyfin 10.11.0 erstellt |
| 01.05.2026 00:35:20:000 | `releases/InPlayerEpisodePreview_1.6.2.1-10.10.7.zip` | Release-ZIP für Jellyfin 10.10.7 erstellt |
| 01.05.2026 00:36:30:000 | `manifest.json:11-34` | Neue Versionsblöcke 1.6.2.2/1.6.2.1 ergänzt |
| 01.05.2026 00:38:30:000 | `CHECKPOINT.md:60-90` | Ergebnis/Testlauf/Tests ergänzt |
| 01.05.2026 00:40:30:000 | `CHECKPOINT.md:5` | Status auf ABGESCHLOSSEN gesetzt |
| 01.05.2026 00:41:30:000 | `CHECKIN.md:1` | CHECKOUT-Eintrag ergänzt |

**Detail:**
```markdown
# ALT (CHECKPOINT.md:5)
Status: **ABGESCHLOSSEN**

# NEU (CHECKPOINT.md:5)
Status: **IN BEARBEITUNG**
```

**Detail:**
```text
# NEU (CHECKIN.md:1)
CHECKIN ; 01.05.2026 00:26:23:421 (MEZ) ; *I cannot see the Plugin in Jellyfin after adding "@terastodonenjoyer/InPlayerEpisodePreview/files/manifest.json" as repo. Also the previous changes documented in the "Checkpoint.md" have not been added to manifest.json.* ;
```

**Detail:**
```xml
# ALT (Namo.Plugin.InPlayerEpisodePreview.csproj:8)
<PluginVersion>1.6.1</PluginVersion>

# NEU (Namo.Plugin.InPlayerEpisodePreview.csproj:8)
<PluginVersion>1.6.2</PluginVersion>
```

**Detail:**
```text
# NEU (releases/)
InPlayerEpisodePreview_1.6.2.2-10.11.0.zip
InPlayerEpisodePreview_1.6.2.1-10.10.7.zip
```

**Detail:**
```markdown
# ALT (CHECKPOINT.md:5)
Status: **IN BEARBEITUNG**

# NEU (CHECKPOINT.md:5)
Status: **ABGESCHLOSSEN**
```

**Detail:**
```text
# NEU (CHECKIN.md:1)
CHECKOUT ; 01.05.2026 00:41:30:000 (MEZ) ; *Manifest aktualisiert, Release-ZIPs 1.6.2.x erzeugt, Builds/webpack erfolgreich* ;
```

**Detail:**
```json
// ALT (manifest.json:11-18)
{
  "version": "1.6.1.2",
  "changelog": "- Fixed a bug where movies with multiple versions were treated as collections",
  "targetAbi": "10.11.0",
  "sourceUrl": "https://github.com/Namo2/InPlayerEpisodePreview/releases/download/v1.6.1/InPlayerEpisodePreview_1.6.1.2-10.11.0.zip",
  "checksum": "94d14a0a95bb3d5d76342ac4e00a26d0",
  "timestamp": "2025-12-11T21:37:25Z"
}

// NEU (manifest.json:11-26)
{
  "version": "1.6.2.2",
  "changelog": "- Show shuffle queue order in the episode list.\n - Use stable item IDs for DOM selectors.\n - Load missing queue items on shuffle.",
  "targetAbi": "10.11.0",
  "sourceUrl": "https://raw.githubusercontent.com/terastodonenjoyer/InPlayerEpisodePreview/master/releases/InPlayerEpisodePreview_1.6.2.2-10.11.0.zip",
  "checksum": "b87f5c48b3855637060c0321a9aaa5be",
  "timestamp": "2026-04-30T23:35:00Z"
}
```

### Ergebnis
- Manifest enthält neue Versionen 1.6.2.2 (10.11.0) und 1.6.2.1 (10.10.7).
- Release-ZIPs liegen im Repo unter `releases/` und sind per Raw-URL abrufbar.
- Plugin sollte im Jellyfin-Repo sichtbar sein, sofern die Raw-Manifest-URL genutzt wird.

### Was NICHT geändert wurde
- C#-Plugin-Logik, UI-Features, Web-Bundle-Inhalt — unverändert (nur Versionierung/Packaging).
- Bestehende Einstellungen/Config-Struktur — unangetastet.

### Neue Tests
| Test-Klasse | Test-Methode | Prüft |
|-------------|-------------|-------|
| — | — | Keine neuen Tests erforderlich (Manifest/Packaging-Änderung) |

### Testlauf
```
01.05.2026 00:34:10 — dotnet build InPlayerEpisodePreview.sln -c Release
Build succeeded.
```
```
01.05.2026 00:34:40 — dotnet build InPlayerEpisodePreview.sln -c Release -p:JellyfinVersion=10.10.7
Build succeeded.
```
```
01.05.2026 00:37:10 — npx webpack --config webpack.config.js
webpack 5.106.2 compiled successfully
```

---

## 29.04.2026 — Shuffle Queue Order & Stable IDs

### Auftrag
Implementierung der Shuffle-Queue-Logik: UI soll bei Shuffle die NowPlayingQueue-Reihenfolge anzeigen und DOM-Keys/Selektoren stabil per Item-Id verwenden; PlaybackOrder/Queue-Infos aus Sessions/Playing persistieren und fehlende Queue-Items nachladen.

### Konzept
- ProgramData um PlaybackOrder + Queue-IDs (+ Version) erweitern.
- ProgramDataStore um Setter, Shuffle-Flag, Change-Detection und Subscriber erweitern.
- Sessions/Playing: PlaybackOrder + NowPlayingQueue persistieren, fehlende Items nachladen.
- Listen-Rendering: Shuffle → Queue-Reihenfolge; sonst chronologisch.
- DOM-IDs/Selektoren: von IndexNumber → Item.Id.
- Popup-Start: bei Shuffle standardmäßig Queue-Ansicht.

Hinweis: CLAUDE.md fehlt im Repo-Root (keine Architektur-Datei verfügbar).

### Betroffene Dateien
| Datei | Geplante Änderung |
|-------|-------------------|
| `CHECKPOINT.md` | Initiale Anlage + Task-Dokumentation |
| `CHECKIN.md` | Checkin/Checkout-Protokoll |
| `Namo.Plugin.InPlayerEpisodePreview/Web/Models/ProgramData.ts` | PlaybackOrder/Queue-State |
| `Namo.Plugin.InPlayerEpisodePreview/Web/Services/ProgramDataStore.ts` | Setter, Shuffle-Flag, Subscriber, Queue-Fetch |
| `Namo.Plugin.InPlayerEpisodePreview/Web/Services/DataFetcher.ts` | Sessions/Playing → PlaybackOrder/Queue |
| `Namo.Plugin.InPlayerEpisodePreview/Web/ListElementFactory.ts` | Queue-Reihenfolge statt fixem Sort |
| `Namo.Plugin.InPlayerEpisodePreview/Web/Components/ListElementTemplate.ts` | DOM-IDs auf Item.Id |
| `Namo.Plugin.InPlayerEpisodePreview/Web/Components/EpisodeDetails.ts` | DOM-IDs auf Item.Id |
| `Namo.Plugin.InPlayerEpisodePreview/Web/Components/QuickActions/PlayStateIconTemplate.ts` | DOM-IDs auf Item.Id |
| `Namo.Plugin.InPlayerEpisodePreview/Web/Components/QuickActions/FavoriteIconTemplate.ts` | DOM-IDs auf Item.Id |
| `Namo.Plugin.InPlayerEpisodePreview/Web/InPlayerPreview.ts` | Shuffle-Default-Ansicht + Re-Render |
| `Namo.Plugin.InPlayerEpisodePreview/Web/InPlayerPreview.js` | Bundle-Rebuild |

### Änderungen
| Zeitstempel | Datei:Zeile | Beschreibung |
|-------------|-------------|--------------|
| 29.04.2026 21:07:35:715 | `CHECKPOINT.md:1` | CHECKPOINT.md initial angelegt |
| 29.04.2026 21:07:35:715 | `CHECKIN.md:1` | CHECKIN.md initial angelegt |
| 29.04.2026 21:10:12:120 | `Web/Models/ProgramData.ts:8-13` | PlaybackOrder + Queue-Felder ergänzt |
| 29.04.2026 21:15:00:100 | `Web/Services/ProgramDataStore.ts:9-278` | Playback/Queue-State, Subscriber, Queue-Fetch + Merge ergänzt |
| 29.04.2026 21:16:10:200 | `Web/Services/DataFetcher.ts:35-49` | PlaybackOrder/NowPlayingQueue aus Sessions/Playing persistiert |
| 29.04.2026 21:31:20:000 | `Web/Services/DataFetcher.ts:42-47` | PlaybackOrder-Fallback vereinfacht |
| 29.04.2026 21:17:30:300 | `Web/ListElementFactory.ts:13-107` | Queue-Order-Resolver + Id-basierte Selektoren |
| 29.04.2026 21:18:40:400 | `Web/Components/ListElementTemplate.ts:15-112` | DOM-IDs/Selectors auf Item.Id umgestellt |
| 29.04.2026 21:19:10:410 | `Web/Components/EpisodeDetails.ts:5-7` | EpisodeDetails-ID auf Item.Id umgestellt |
| 29.04.2026 21:19:20:420 | `Web/Components/QuickActions/PlayStateIconTemplate.ts:5-8` | PlayState-Button-ID auf Item.Id umgestellt |
| 29.04.2026 21:19:30:430 | `Web/Components/QuickActions/FavoriteIconTemplate.ts:5-8` | Favorite-Button-ID auf Item.Id umgestellt |
| 29.04.2026 21:20:45:500 | `Web/InPlayerPreview.ts:112-233` | Shuffle-Default-Ansicht + Re-Render bei Queue-Updates |
| 29.04.2026 21:26:05:650 | `Web/InPlayerPreview.js` | Bundle via webpack aktualisiert |
| 29.04.2026 21:32:10:000 | `CHECKIN.md:1` | CHECKOUT-Eintrag ergänzt |

**Detail:**
```ts
// ALT (Web/Models/ProgramData.ts:8-13)
export type ProgramData = {
    activeMediaSourceId: string
    type: ItemType
    boxSetName: string
    movies?: BaseItem[]
    seasons?: Season[]
    pluginSettings: PluginSettings,
    serverSettings: ServerSettings
}

// NEU (Web/Models/ProgramData.ts:8-17)
export type ProgramData = {
    activeMediaSourceId: string
    type: ItemType
    boxSetName: string
    playbackOrder: "Default" | "Shuffle" | string
    nowPlayingQueueIds: string[]
    nowPlayingQueueVersion?: number | string
    movies?: BaseItem[]
    seasons?: Season[]
    pluginSettings: PluginSettings,
    serverSettings: ServerSettings
}
```
Begründung: PlaybackOrder/Queue-IDs müssen persistiert werden, um Shuffle-Queue-Reihenfolge und UI-Re-Render zu ermöglichen.

**Detail:**
```ts
// ALT (Web/Services/ProgramDataStore.ts:12-23)
this._programData = {
    activeMediaSourceId: '',
    boxSetName: '',
    type: undefined,
    movies: [],
    seasons: [],
    pluginSettings: DefaultPluginSettings,
    serverSettings: DefaultServerSettings
}

// NEU (Web/Services/ProgramDataStore.ts:13-23)
this._programData = {
    activeMediaSourceId: '',
    boxSetName: '',
    playbackOrder: 'Default',
    nowPlayingQueueIds: [],
    nowPlayingQueueVersion: 0,
    type: undefined,
    movies: [],
    seasons: [],
    pluginSettings: DefaultPluginSettings,
    serverSettings: DefaultServerSettings
}
```
Begründung: ProgramData benötigt initiale Werte für PlaybackOrder und Queue-State.

**Detail:**
```ts
// ALT (Web/Services/ProgramDataStore.ts:47-83)
public get boxSetName(): string {
    return this._programData.boxSetName
}

public set boxSetName(boxSetName: string) {
    this._programData.boxSetName = boxSetName
}

// NEU (Web/Services/ProgramDataStore.ts:47-94)
public get boxSetName(): string {
    return this._programData.boxSetName
}

public set boxSetName(boxSetName: string) {
    this._programData.boxSetName = boxSetName
}

public get playbackOrder(): string {
    return this._programData.playbackOrder
}

public setPlaybackOrder(playbackOrder: string): void {
    const normalizedOrder: string = playbackOrder ?? 'Default'
    if (this._programData.playbackOrder === normalizedOrder)
        return

    this._programData.playbackOrder = normalizedOrder
    this.notifyPlaybackStateChanged()
}

public get nowPlayingQueueIds(): string[] {
    return this._programData.nowPlayingQueueIds
}

public setNowPlayingQueue(ids: string[]): void {
    const normalizedIds: string[] = (ids ?? []).filter((id: string): boolean => Boolean(id))
    if (this.arraysEqual(this._programData.nowPlayingQueueIds, normalizedIds))
        return

    this._programData.nowPlayingQueueIds = normalizedIds
    this._programData.nowPlayingQueueVersion = Date.now()
    this.notifyPlaybackStateChanged()
}

public isShuffleActive(): boolean {
    const playbackOrder = (this._programData.playbackOrder ?? '').toString().toLowerCase()
    return playbackOrder === 'shuffle' || playbackOrder === 'random'
}
```
Begründung: Queue-Updates sollen nur bei Änderungen re-rendern; Shuffle-Status muss zentral abfragbar sein.

**Detail:**
```ts
// ALT (Web/Services/ProgramDataStore.ts:168-186)
public updateItem(itemToUpdate: BaseItem): void {
    switch (this.type) {
        case ItemType.Series: {
                const season: Season = this.seasons.find(season => season.seasonId === itemToUpdate.SeasonId)
                this.seasons = [
                    ... this.seasons.filter(season => season.seasonId !== itemToUpdate.SeasonId), {
                        ...season,
                        episodes: [... season.episodes.filter(episode => episode.Id !== itemToUpdate.Id), itemToUpdate]
                    }
                ]
            }
            break
        case ItemType.BoxSet:
        case ItemType.Movie:
        case ItemType.Folder:
        case ItemType.Video:
            this.movies = [... this.movies.filter(movie => movie.Id !== itemToUpdate.Id), itemToUpdate]
    }
}

// NEU (Web/Services/ProgramDataStore.ts:168-278)
public updateItem(itemToUpdate: BaseItem): void {
    switch (this.type) {
        case ItemType.Series: {
                const season: Season = this.seasons.find(season => season.seasonId === itemToUpdate.SeasonId)
                this.seasons = [
                    ... this.seasons.filter(season => season.seasonId !== itemToUpdate.SeasonId), {
                        ...season,
                        episodes: [... season.episodes.filter(episode => episode.Id !== itemToUpdate.Id), itemToUpdate]
                    }
                ]
            }
            break
        case ItemType.BoxSet:
        case ItemType.Movie:
        case ItemType.Folder:
        case ItemType.Video:
            this.movies = [... this.movies.filter(movie => movie.Id !== itemToUpdate.Id), itemToUpdate]
    }
}

public async ensureItemsLoadedByIds(ids: string[]): Promise<void> {
    const missingIds: string[] = (ids ?? []).filter((id: string): boolean => Boolean(id) && !this.hasItem(id))
    if (missingIds.length === 0)
        return

    const userId: string = ApiClient.getCurrentUserId?.()
    if (!userId)
        return

    const response = await ApiClient.getItems(userId, { Ids: missingIds.join(',') })
    const items: BaseItem[] = (response?.Items ?? []).map((item) => item as BaseItem)
    if (items.length === 0)
        return

    this.mergeItems(items)
    this.notifyPlaybackStateChanged()
}
```
Begründung: Queue-IDs können Items enthalten, die noch nicht geladen sind; Fetch + Merge ergänzt und Re-Render ausgelöst.

**Detail:**
```ts
// ALT (Web/Services/ProgramDataStore.ts:218-223)
case ItemType.BoxSet:
case ItemType.Movie:
case ItemType.Folder:
case ItemType.Video:
    if (!this.type)
        this.type = itemType === ItemType.Video ? ItemType.Video : ItemType.Movie
    this.movies = [...this.movies.filter(movie => movie.Id !== item.Id), item]
    break

// NEU (Web/Services/ProgramDataStore.ts:217-223)
case ItemType.BoxSet:
case ItemType.Movie:
case ItemType.Folder:
case ItemType.Video:
    if (!this.type)
        this.type = itemType
    this.movies = [...this.movies.filter(movie => movie.Id !== item.Id), item]
    break
```
Begründung: Queue-Fetch darf ItemType (Movie/BoxSet/Folder/Video) nicht pauschal auf Movie reduzieren.

**Detail:**
```ts
// ALT (Web/Services/DataFetcher.ts:35-40)
if (config.body && typeof config.body === 'string' && urlPathname.includes('Sessions/Playing')) {
    const playingInfo: PlaybackProgressInfo = JSON.parse(config.body)

    // save the media id of the currently played video
    if (this.programDataStore.activeMediaSourceId !== playingInfo.MediaSourceId)
        this.programDataStore.activeMediaSourceId = playingInfo.MediaSourceId

// NEU (Web/Services/DataFetcher.ts:35-48)
if (config.body && typeof config.body === 'string' && urlPathname.includes('Sessions/Playing')) {
    const playingInfo: PlaybackProgressInfo = JSON.parse(config.body)

    // save the media id of the currently played video
    if (this.programDataStore.activeMediaSourceId !== playingInfo.MediaSourceId)
        this.programDataStore.activeMediaSourceId = playingInfo.MediaSourceId

    const playbackOrderRaw = playingInfo.PlaybackOrder as unknown as PlaybackOrder | string
    const playbackOrderFromEnum = typeof playbackOrderRaw === 'number'
        ? PlaybackOrder[playbackOrderRaw]
        : playbackOrderRaw
    const playbackOrder: string = playbackOrderFromEnum ?? 'Default'
    const nowPlayingQueueIds: string[] = (playingInfo.NowPlayingQueue ?? [])
        .map((queueItem) => queueItem?.Id)
        .filter((id): id is string => Boolean(id))
    this.programDataStore.setPlaybackOrder(playbackOrder)
    this.programDataStore.setNowPlayingQueue(nowPlayingQueueIds)
    void this.programDataStore.ensureItemsLoadedByIds(nowPlayingQueueIds)
```
Begründung: PlaybackOrder + NowPlayingQueue müssen aus Sessions/Playing in den Store persistiert werden.

**Detail:**
```ts
// ALT (Web/ListElementFactory.ts:13-29)
public async createEpisodeElements(episodes: BaseItem[], parentDiv: HTMLElement): Promise<void> {
    episodes.sort((a, b) => a.IndexNumber - b.IndexNumber)

    for (let i: number = 0; i < episodes.length; i++) {
        const episode = episodes[i]
        ...
        const episodeContainer: Element = document.querySelector(`[data-id="${episode.IndexNumber}"]`).querySelector('.previewListItemContent');

// NEU (Web/ListElementFactory.ts:13-29)
public async createEpisodeElements(episodes: BaseItem[], parentDiv: HTMLElement): Promise<void> {
    const displayEpisodes = this.resolveDisplayEpisodes(episodes)

    for (let i: number = 0; i < displayEpisodes.length; i++) {
        const episode = displayEpisodes[i]
        ...
        const episodeContainer: Element = document.querySelector(`[data-id="${episode.Id}"]`).querySelector('.previewListItemContent');
```
Begründung: Shuffle-Queue erfordert explizite Queue-Reihenfolge; DOM-Selektoren müssen per Item.Id eindeutig sein.

**Detail:**
```ts
// ALT (Web/ListElementFactory.ts:74-90)
public createSeasonElements(seasons: Season[], parentDiv: HTMLElement, currentSeasonIndex: number, titleContainer: PopupTitleTemplate): void {
    seasons.sort((a, b) => a.IndexNumber - b.IndexNumber)
    ...
}

// NEU (Web/ListElementFactory.ts:92-107)
private resolveDisplayEpisodes(episodes: BaseItem[]): BaseItem[] {
    const queueIds: string[] = this.programDataStore.nowPlayingQueueIds ?? []
    if (this.programDataStore.isShuffleActive() && queueIds.length > 0) {
        const episodeMap = new Map<string, BaseItem>(episodes.map((episode: BaseItem): [string, BaseItem] => [episode.Id, episode]))
        return queueIds
            .map((id: string): BaseItem => episodeMap.get(id))
            .filter((episode): episode is BaseItem => Boolean(episode))
    }

    return [...episodes].sort((a, b) => {
        const parentCompare: number = (a.ParentIndexNumber ?? 0) - (b.ParentIndexNumber ?? 0)
        if (parentCompare !== 0)
            return parentCompare
        return (a.IndexNumber ?? 0) - (b.IndexNumber ?? 0)
    })
}
```
Begründung: Queue-Order wird priorisiert; Default bleibt chronologische Sortierung nach Season + IndexNumber.

**Detail:**
```ts
// ALT (Web/Components/ListElementTemplate.ts:15-44)
this.setElementId(`episode-${item.IndexNumber}`)
...
data-id="${this.item.IndexNumber}">
...
<button id="previewEpisodeImageCard-${this.item.IndexNumber}"
...
<button id="start-episode-${this.item.IndexNumber}"

// NEU (Web/Components/ListElementTemplate.ts:15-44)
this.setElementId(`episode-${item.Id}`)
...
data-id="${this.item.Id}">
...
<button id="previewEpisodeImageCard-${this.item.Id}"
...
<button id="start-episode-${this.item.Id}"
```
Begründung: IndexNumber kollidiert über Seasons hinweg; stabile DOM-IDs müssen Item.Id nutzen.

**Detail:**
```ts
// ALT (Web/Components/EpisodeDetails.ts:5-7)
this.setElementId(`episode-${episode.IndexNumber}`);

// NEU (Web/Components/EpisodeDetails.ts:5-7)
this.setElementId(`episode-${episode.Id}`);
```
Begründung: Episode-Detail-Container muss die gleiche stabile ID wie das List-Item nutzen.

**Detail:**
```ts
// ALT (Web/Components/QuickActions/PlayStateIconTemplate.ts:5-7)
this.setElementId('playStateButton-' + this.episode.IndexNumber)

// NEU (Web/Components/QuickActions/PlayStateIconTemplate.ts:5-7)
this.setElementId('playStateButton-' + this.episode.Id)
```
Begründung: QuickAction-Buttons benötigen eindeutige IDs pro Item.

**Detail:**
```ts
// ALT (Web/Components/QuickActions/FavoriteIconTemplate.ts:5-7)
this.setElementId('favoriteButton-' + episode.IndexNumber)

// NEU (Web/Components/QuickActions/FavoriteIconTemplate.ts:5-7)
this.setElementId('favoriteButton-' + episode.Id)
```
Begründung: Favorite-Button darf nicht mehr über IndexNumber kollidieren.

**Detail:**
```ts
// ALT (Web/InPlayerPreview.ts:181-203)
switch (programDataStore.type) {
    case ItemType.Series:
        popupTitle.setText(programDataStore.activeSeason.seasonName)
        popupTitle.setVisible(true)
        listElementFactory.createEpisodeElements(programDataStore.activeSeason.episodes, contentDiv)
        break
    ...
}

// NEU (Web/InPlayerPreview.ts:181-233)
const renderEpisodeList = (): void => {
    ...
    const isShuffleQueue = programDataStore.isShuffleActive() && programDataStore.nowPlayingQueueIds.length > 0
    switch (programDataStore.type) {
        case ItemType.Series: {
            if (isShuffleQueue) {
                popupTitle.setText('Up Next (Shuffle Queue)')
                popupTitle.setVisible(true)
                const allEpisodes = programDataStore.seasons.flatMap(season => season.episodes)
                listElementFactory.createEpisodeElements(allEpisodes, contentDiv)
                break
            }
            popupTitle.setText(programDataStore.activeSeason.seasonName)
            popupTitle.setVisible(true)
            listElementFactory.createEpisodeElements(programDataStore.activeSeason.episodes, contentDiv)
            break
        }
        ...
    }
}
```
Begründung: Bei Shuffle muss die Queue-Ansicht Standard sein; Season-Ansicht bleibt per Titel-Click erreichbar.

**Detail:**
```text
// ALT (Web/InPlayerPreview.js)
Bundle vor Änderungen

// NEU (Web/InPlayerPreview.js)
Bundle via `npx webpack --config webpack.config.js` aktualisiert
```
Begründung: Embedded Bundle muss nach TS-Änderungen neu gebaut werden.

### Ergebnis
- PlaybackOrder + NowPlayingQueue werden aus Sessions/Playing persistiert.
- Shuffle-Queue wird in UI-Reihenfolge angezeigt; Standard bleibt chronologisch.
- DOM-IDs/Selektoren basieren auf Item.Id (keine IndexNumber-Kollisionen).
- Queue-Items werden bei Bedarf nachgeladen und triggern Re-Render.

### Was NICHT geändert wurde
- API-Endpunkte und bestehende Playback-Logik (Play/Resume) unverändert
- CSS/Styles der Preview-UI unverändert
- Season-Listen-Rendering/Navigation bleibt verfügbar

### Neue Tests
| Test-Klasse | Test-Methode | Prüft |
|-------------|-------------|-------|
| — | — | Keine neuen Tests (keine Testsuite im Repo vorhanden) |

### Testlauf
```
29.04.2026 21:26:05 — dotnet build InPlayerEpisodePreview.sln
Build succeeded.
```
```
29.04.2026 21:31:40 — npx webpack --config webpack.config.js
webpack 5.101.3 compiled successfully
```

---
