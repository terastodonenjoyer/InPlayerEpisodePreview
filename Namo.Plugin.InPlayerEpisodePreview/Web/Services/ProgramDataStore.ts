import {ProgramData} from "../Models/ProgramData";
import {Season} from "../Models/Season";
import {BaseItem} from "../Models/Episode";
import {ItemType} from "../Models/ItemType";
import {DefaultPluginSettings, PluginSettings} from "../Models/PluginSettings";
import {DefaultServerSettings, ServerSettings} from "../Models/ServerSettings";
import {PlaybackOrder} from "../Models/PlaybackProgressInfo";

export class ProgramDataStore {
    private _programData: ProgramData

    constructor() {
        this._programData = {
            activeMediaSourceId: '',
            boxSetName: '',
            type: undefined,
            movies: [],
            seasons: [],
            playbackOrder: PlaybackOrder.Default,
            nowPlayingQueue: [],
            queueItems: [],
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

    public get activeSeason(): Season | undefined {
        return this.seasons.find(season => season.episodes.some(episode => episode.Id === this.activeMediaSourceId))
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

    public get playbackOrder(): PlaybackOrder {
        return this._programData.playbackOrder
    }

    public set playbackOrder(order: PlaybackOrder) {
        this._programData.playbackOrder = order
    }

    public get nowPlayingQueue(): string[] {
        return this._programData.nowPlayingQueue
    }

    public set nowPlayingQueue(queueIds: string[]) {
        this._programData.nowPlayingQueue = queueIds
    }

    public get isShuffleMode(): boolean {
        return this.playbackOrder === PlaybackOrder.Shuffle
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
                return this.seasons.flatMap(season => season.episodes).length > 0 || this.queueOrderedItems.length > 0
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

    public get queueOrderedItems(): BaseItem[] {
        if (!this.nowPlayingQueue || this.nowPlayingQueue.length === 0) {
            return []
        }

        const allItemsById = new Map<string, BaseItem>(this.allLoadedItems.map(item => [item.Id, item]))
        return this.nowPlayingQueue
            .map(queueItemId => allItemsById.get(queueItemId))
            .filter(item => !!item)
    }

    public getMissingQueueItemIds(): string[] {
        if (!this.nowPlayingQueue || this.nowPlayingQueue.length === 0) {
            return []
        }

        const allItemsById = new Set<string>(this.allLoadedItems.map(item => item.Id))
        return this.nowPlayingQueue.filter(queueItemId => !allItemsById.has(queueItemId))
    }

    public mergeQueueItems(items: BaseItem[]): void {
        if (!items || items.length === 0) {
            return
        }

        const existingQueueItemsById = new Map<string, BaseItem>(this._programData.queueItems.map(item => [item.Id, item]))
        for (const item of items) {
            existingQueueItemsById.set(item.Id, item)
            const existingItem = this.getItemById(item.Id)
            if (existingItem) {
                this.updateItem({
                    ...existingItem,
                    ...item
                })
            }
        }

        this._programData.queueItems = Array.from(existingQueueItemsById.values())
    }

    public getItemById(itemId: string): BaseItem {
        switch (this.type) {
            case ItemType.Series:
                return this.seasons
                    .flatMap(season => season.episodes)
                    .find(episode => episode.Id === itemId)
                    ?? this._programData.queueItems.find(item => item.Id === itemId)
            case ItemType.BoxSet:
            case ItemType.Movie:
            case ItemType.Folder:
            case ItemType.Video:
                return this.movies.find(movie => movie.Id === itemId)
                    ?? this._programData.queueItems.find(item => item.Id === itemId)
            default: 
                return undefined
        }
    }

    public updateItem(itemToUpdate: BaseItem): void {
        switch (this.type) {
            case ItemType.Series: {
                    const season: Season = this.seasons.find(season => season.seasonId === itemToUpdate.SeasonId)
                    if (!season) {
                        this._programData.queueItems = [
                            ...this._programData.queueItems.filter(item => item.Id !== itemToUpdate.Id),
                            itemToUpdate
                        ]
                        break
                    }
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

        const shouldTrackInQueueItems = this._programData.nowPlayingQueue.includes(itemToUpdate.Id)
            || this._programData.queueItems.some(item => item.Id === itemToUpdate.Id)

        if (shouldTrackInQueueItems) {
            this._programData.queueItems = [
                ...this._programData.queueItems.filter(item => item.Id !== itemToUpdate.Id),
                itemToUpdate
            ]
        }
    }

    private get allLoadedItems(): BaseItem[] {
        const baseItems = this.type === ItemType.Series
            ? this.seasons.flatMap(season => season.episodes)
            : this.movies

        const allItemsById = new Map<string, BaseItem>(baseItems.map(item => [item.Id, item]))
        this._programData.queueItems.forEach(item => allItemsById.set(item.Id, item))
        return Array.from(allItemsById.values())
    }
}
