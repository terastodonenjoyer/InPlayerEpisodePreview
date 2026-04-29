import {Season} from "./Season";
import {BaseItem} from "./Episode";
import {ItemType} from "./ItemType";
import {PluginSettings} from "./PluginSettings";
import {ServerSettings} from "./ServerSettings";

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
