import {Season} from "./Season";
import {BaseItem} from "./Episode";
import {ItemType} from "./ItemType";
import {PluginSettings} from "./PluginSettings";
import {ServerSettings} from "./ServerSettings";
import {PlaybackOrder} from "./PlaybackProgressInfo";

export type ProgramData = {
    activeMediaSourceId: string
    type: ItemType
    boxSetName: string
    movies?: BaseItem[]
    seasons?: Season[]
    playbackOrder: PlaybackOrder
    nowPlayingQueue: string[]
    queueItems: BaseItem[]
    pluginSettings: PluginSettings,
    serverSettings: ServerSettings
}
