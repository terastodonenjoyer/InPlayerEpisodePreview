import {ProgramData} from "../Models/ProgramData";
import {Season} from "../Models/Season";
import {BaseItem} from "../Models/Episode";
import {ItemType} from "../Models/ItemType";
import {DefaultPluginSettings, PluginSettings} from "../Models/PluginSettings";
import {DefaultServerSettings, ServerSettings} from "../Models/ServerSettings";

export class ProgramDataStore {
    private _programData: ProgramData
    private playbackStateListeners: Set<() => void> = new Set()
    private static readonly EMPTY_SEASON: Season = {
        seasonId: '',
        seasonName: '',
        episodes: [],
        IndexNumber: 0
    }

    constructor() {
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
    }

    public get activeMediaSourceId(): string {
        return this._programData.activeMediaSourceId
    }

    public set activeMediaSourceId(activeMediaSourceId: string) {
        this._programData.activeMediaSourceId = activeMediaSourceId
    }

    public get activeSeason(): Season {
        return this.seasons.find(season => season.episodes.some(episode => episode.Id === this.activeMediaSourceId))
            ?? this.seasons[0]
            ?? ProgramDataStore.EMPTY_SEASON
    }
    
    public get type(): ItemType {
        return this._programData.type
    }
    
    public set type(type: ItemType) {
        this._programData.type = type
    }
    
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

    public get nowPlayingQueueVersion(): number | string {
        return this._programData.nowPlayingQueueVersion
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

    public subscribePlaybackStateChanged(listener: () => void): () => void {
        this.playbackStateListeners.add(listener)
        return () => this.playbackStateListeners.delete(listener)
    }
    
    public get movies(): BaseItem[] {
        return this._programData.movies
    }
    
    public set movies(movies: BaseItem[]) {
        this._programData.movies = movies
        this._programData.seasons = []
    }

    public get seasons(): Season[] {
        return this._programData.seasons
    }

    public set seasons(seasons: Season[]) {
        this._programData.seasons = seasons
        this._programData.movies = []
    }

    public get pluginSettings(): PluginSettings {
        return this._programData.pluginSettings
    }

    public set pluginSettings(settings: PluginSettings) {
        this._programData.pluginSettings = settings
    }

    public get serverSettings(): ServerSettings {
        return this._programData.serverSettings
    }

    public set serverSettings(settings: ServerSettings) {
        this._programData.serverSettings = settings
    }
    
    public get dataIsAllowedForPreview() {
        if (!this.allowedPreviewTypes.includes(this.type))
            return false
        
        switch (this.type) {
            case ItemType.Series:
                return this.activeSeason.episodes.length >= 1
            case ItemType.Movie:
                return true
            case ItemType.BoxSet:
            case ItemType.Folder:
            case ItemType.Video:
                return this.movies.length >= 1
            default:
                return false
        }
    }
    
    public get allowedPreviewTypes() {
        return this.pluginSettings.EnabledItemTypes
    }

    public getItemById(itemId: string): BaseItem {
        switch (this.type) {
            case ItemType.Series:
                return this.seasons
                    .flatMap(season => season.episodes)
                    .find(episode => episode.Id === itemId)
            case ItemType.BoxSet:
            case ItemType.Movie:
            case ItemType.Folder:
            case ItemType.Video:
                return this.movies.find(movie => movie.Id === itemId)
            default: 
                return undefined
        }
    }

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

    public hasItem(itemId: string): boolean {
        return Boolean(this.getItemById(itemId))
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

    private mergeItems(items: BaseItem[]): void {
        items.forEach((item: BaseItem): void => {
            const itemType: ItemType = ItemType[item.Type as keyof typeof ItemType]
            switch (itemType) {
                case ItemType.Episode:
                    this.mergeEpisodeItem(item)
                    break
                case ItemType.BoxSet:
                case ItemType.Movie:
                case ItemType.Folder:
                case ItemType.Video:
                    if (!this.type)
                        this.type = itemType
                    this.movies = [...this.movies.filter(movie => movie.Id !== item.Id), item]
                    break
                default:
                    this.updateItem(item)
            }
        })
    }

    private mergeEpisodeItem(item: BaseItem): void {
        if (!this.type)
            this.type = ItemType.Series

        if (!item.SeasonId) {
            this.updateItem(item)
            return
        }

        const seasonIndex = this.seasons.findIndex(season => season.seasonId === item.SeasonId)
        if (seasonIndex === -1) {
            this.seasons = [
                ...this.seasons,
                {
                    seasonId: item.SeasonId,
                    seasonName: item.SeasonName,
                    episodes: [item],
                    IndexNumber: this.seasons.length
                }
            ]
            return
        }

        const season = this.seasons[seasonIndex]
        const updatedSeason: Season = {
            ...season,
            episodes: [...season.episodes.filter(episode => episode.Id !== item.Id), item]
        }
        this.seasons = [
            ...this.seasons.slice(0, seasonIndex),
            updatedSeason,
            ...this.seasons.slice(seasonIndex + 1)
        ]
    }

    private notifyPlaybackStateChanged(): void {
        this.playbackStateListeners.forEach(listener => listener())
    }

    private arraysEqual(a: string[], b: string[]): boolean {
        if (a.length !== b.length)
            return false
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i])
                return false
        }
        return true
    }
}
