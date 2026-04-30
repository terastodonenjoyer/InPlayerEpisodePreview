/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./Web/Components/BaseTemplate.ts"
/*!****************************************!*\
  !*** ./Web/Components/BaseTemplate.ts ***!
  \****************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BaseTemplate = void 0;
class BaseTemplate {
    container;
    positionAfterIndex;
    /*
     * the HTML based ID of the new generated Element
     */
    elementId;
    constructor(container, positionAfterIndex) {
        this.container = container;
        this.positionAfterIndex = positionAfterIndex;
    }
    getContainer() {
        return this.container;
    }
    getPositionAfterIndex() {
        return this.positionAfterIndex;
    }
    setElementId(elementId) {
        this.elementId = elementId;
    }
    getElementId() {
        return this.elementId;
    }
    getElement() {
        return this.getContainer().querySelector(`#${this.getElementId()}`);
    }
    addElementToContainer(...clickHandlers) {
        // Add Element as the first child if position is negative
        if (this.getPositionAfterIndex() < 0 && this.getContainer().hasChildNodes()) {
            this.getContainer().firstElementChild.before(this.stringToNode(this.getTemplate(...clickHandlers)));
            return this.getElement();
        }
        // Add Element if container is empty
        if (!this.getContainer().hasChildNodes()) {
            this.getContainer().innerHTML = this.getTemplate(...clickHandlers);
            return this.getElement();
        }
        let childBefore = this.getContainer().lastElementChild;
        if (this.getContainer().children.length > this.getPositionAfterIndex() && this.getPositionAfterIndex() >= 0)
            childBefore = this.getContainer().children[this.getPositionAfterIndex()];
        childBefore.after(this.stringToNode(this.getTemplate(...clickHandlers)));
        return this.getElement();
    }
    stringToNode(templateString) {
        let placeholder = document.createElement('div');
        placeholder.innerHTML = templateString;
        return placeholder.firstElementChild;
    }
}
exports.BaseTemplate = BaseTemplate;


/***/ },

/***/ "./Web/Components/DialogContainerTemplate.ts"
/*!***************************************************!*\
  !*** ./Web/Components/DialogContainerTemplate.ts ***!
  \***************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DialogContainerTemplate = void 0;
const BaseTemplate_1 = __webpack_require__(/*! ./BaseTemplate */ "./Web/Components/BaseTemplate.ts");
class DialogContainerTemplate extends BaseTemplate_1.BaseTemplate {
    dialogBackdropId = 'dialogBackdrop';
    dialogContainerId = 'dialogContainer';
    popupContentContainerId = 'popupContentContainer';
    popupFocusContainerId = 'popupFocusContainer';
    constructor(container, positionAfterIndex) {
        super(container, positionAfterIndex);
        this.setElementId('previewPopup');
    }
    getTemplate() {
        return `
            <div id="${this.getElementId()}">
                <div id="${this.dialogBackdropId}" class="dialogBackdrop dialogBackdropOpened"></div>
                <div id="${this.dialogContainerId}" class="dialogContainer">
                    <div id="${this.popupFocusContainerId}" 
                        class="focuscontainer dialog actionsheet-not-fullscreen actionSheet centeredDialog opened previewPopup actionSheetContent" 
                        data-history="true" 
                        data-removeonclose="true">
                        <div id="${this.popupContentContainerId}" class="actionSheetScroller scrollY previewPopupScroller"/>
                    </div>
                </div>
            </div>
        `;
    }
    render() {
        const renderedElement = this.addElementToContainer();
        renderedElement.addEventListener('click', (e) => {
            this.getContainer().removeChild(document.getElementById(this.getElementId()));
        });
    }
}
exports.DialogContainerTemplate = DialogContainerTemplate;


/***/ },

/***/ "./Web/Components/EpisodeDetails.ts"
/*!******************************************!*\
  !*** ./Web/Components/EpisodeDetails.ts ***!
  \******************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EpisodeDetailsTemplate = void 0;
const BaseTemplate_1 = __webpack_require__(/*! ./BaseTemplate */ "./Web/Components/BaseTemplate.ts");
class EpisodeDetailsTemplate extends BaseTemplate_1.BaseTemplate {
    episode;
    constructor(container, positionAfterIndex, episode) {
        super(container, positionAfterIndex);
        this.episode = episode;
        this.setElementId(`episode-${episode.Id}`);
    }
    getTemplate() {
        // language=HTML
        return `
            <div id="${this.getElementId()}-details" class="itemMiscInfo itemMiscInfo-primary previewEpisodeDetails">
                ${this.episode.PremiereDate ? `<div class="mediaInfoItem">
                    ${(new Date(this.episode.PremiereDate)).toLocaleDateString(this.getLocale())}
                </div>` : ''}
                <div class="mediaInfoItem">${this.formatRunTime(this.episode.RunTimeTicks)}</div>
                ${this.episode.CommunityRating ? `<div class="starRatingContainer mediaInfoItem">
                    <span class="material-icons starIcon star" aria-hidden="true"></span>
                    ${this.episode.CommunityRating.toFixed(1)}
                </div>` : ''}
                ${this.episode.CriticRating ? `<div class="mediaInfoItem mediaInfoCriticRating ${this.episode.CriticRating >= 60 ? 'mediaInfoCriticRatingFresh' : 'mediaInfoCriticRatingRotten'}">
                    ${this.episode.CriticRating}
                </div>` : ''}
                <div class="endsAt mediaInfoItem">${this.formatEndTime(this.episode.RunTimeTicks, this.episode.UserData.PlaybackPositionTicks)}</div>
            </div>
        `;
    }
    render() {
        this.addElementToContainer();
    }
    getLocale() {
        return navigator.languages
            ? navigator.languages[0] // @ts-ignore for userLanguage (this adds support for IE) TODO: Move to interface
            : (navigator.language || navigator.userLanguage);
    }
    formatRunTime(ticks) {
        // format the ticks to a string with minutes and hours
        ticks /= 10000; // convert from microseconds to milliseconds
        let hours = Math.floor((ticks / 1000 / 3600) % 24);
        let minutes = Math.floor((ticks / 1000 / 60) % 60);
        let hoursString = hours > 0 ? `${hours}h ` : '';
        return `${hoursString}${minutes}m`;
    }
    formatEndTime(runtimeTicks, playbackPositionTicks) {
        // convert from microseconds to milliseconds
        runtimeTicks /= 10000;
        playbackPositionTicks /= 10000;
        let ticks = Date.now() + (runtimeTicks);
        ticks -= (new Date()).getTimezoneOffset() * 60 * 1000; // adjust for timezone
        ticks -= playbackPositionTicks; // subtract the playback position
        let hours = this.zeroPad(Math.floor((ticks / 1000 / 3600) % 24));
        let minutes = this.zeroPad(Math.floor((ticks / 1000 / 60) % 60));
        return `Ends at ${hours}:${minutes}`;
    }
    zeroPad(num, places = 2) {
        return String(num).padStart(places, '0');
    }
}
exports.EpisodeDetailsTemplate = EpisodeDetailsTemplate;


/***/ },

/***/ "./Web/Components/ListElementTemplate.ts"
/*!***********************************************!*\
  !*** ./Web/Components/ListElementTemplate.ts ***!
  \***********************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ListElementTemplate = void 0;
const BaseTemplate_1 = __webpack_require__(/*! ./BaseTemplate */ "./Web/Components/BaseTemplate.ts");
const FavoriteIconTemplate_1 = __webpack_require__(/*! ./QuickActions/FavoriteIconTemplate */ "./Web/Components/QuickActions/FavoriteIconTemplate.ts");
const PlayStateIconTemplate_1 = __webpack_require__(/*! ./QuickActions/PlayStateIconTemplate */ "./Web/Components/QuickActions/PlayStateIconTemplate.ts");
const EpisodeDetails_1 = __webpack_require__(/*! ./EpisodeDetails */ "./Web/Components/EpisodeDetails.ts");
const ItemType_1 = __webpack_require__(/*! ../Models/ItemType */ "./Web/Models/ItemType.ts");
class ListElementTemplate extends BaseTemplate_1.BaseTemplate {
    item;
    playbackHandler;
    programDataStore;
    quickActionContainer;
    playStateIcon;
    favoriteIcon;
    constructor(container, positionAfterIndex, item, playbackHandler, programDataStore) {
        super(container, positionAfterIndex);
        this.item = item;
        this.playbackHandler = playbackHandler;
        this.programDataStore = programDataStore;
        this.setElementId(`episode-${item.Id}`);
        // create temp quick action container
        this.quickActionContainer = document.createElement('div');
        // create quick actions
        this.playStateIcon = new PlayStateIconTemplate_1.PlayStateIconTemplate(this.quickActionContainer, -1, this.item);
        this.favoriteIcon = new FavoriteIconTemplate_1.FavoriteIconTemplate(this.quickActionContainer, 0, this.item);
    }
    getTemplate() {
        // add quick actions
        this.playStateIcon.render();
        this.favoriteIcon.render();
        // add episode details/info
        const detailsContainer = document.createElement('div');
        const details = new EpisodeDetails_1.EpisodeDetailsTemplate(detailsContainer, -1, this.item);
        details.render();
        const backgroundImageStyle = `background-image: url('../Items/${this.item.Id}/Images/Primary?tag=${this.item.ImageTags.Primary}')`;
        // language=HTML
        return `
             <div id="${this.getElementId()}"
                  class="listItem listItem-button actionSheetMenuItem emby-button previewListItem"
                  is="emby-button"
                  data-id="${this.item.Id}">
                <div class="previewEpisodeContainer flex">
                    <button class="listItem previewEpisodeTitle" type="button">
                        ${(this.item.IndexNumber &&
            this.programDataStore.type !== ItemType_1.ItemType.Movie) ? `<span>${this.item.IndexNumber}</span>` : ''}
                        <div class="listItemBody actionsheetListItemBody">
                            <span class="actionSheetItemText">${this.item.Name}</span>
                        </div>
                    </button>
                    <div class="previewQuickActionContainer flex">
                        ${this.quickActionContainer.innerHTML}
                    </div>
                </div>

                <div class="previewListItemContent hide">
                    ${detailsContainer.innerHTML}
                    <div class="flex">
                        <div class="card overflowBackdropCard card-hoverable card-withuserdata previewEpisodeImageCard">
                            <div class="cardBox">
                                <div class="cardScalable">
                                    <div class="cardPadder cardPadder-overflowBackdrop lazy-hidden-children">
                                        <span class="cardImageIcon material-icons tv" aria-hidden="true"/>
                                    </div>
                                    <button id="previewEpisodeImageCard-${this.item.Id}"
                                            class="cardImageContainer cardContent itemAction lazy blurhashed lazy-image-fadein-fast ${this.programDataStore.pluginSettings.BlurThumbnail ? 'blur' : ''}"
                                            data-action="link"
                                            style="${backgroundImageStyle}">
                                    </button>
                                    ${this.item.UserData.PlayedPercentage ?
            `<div class="innerCardFooter fullInnerCardFooter innerCardFooterClear itemProgressBar">
                                            <div class="itemProgressBarForeground"
                                                style="width:${this.item.UserData.PlayedPercentage}%;">           
                                            </div>
                                        </div>` : ''}
                                    ${this.item.Id !== this.programDataStore.activeMediaSourceId ?
            `<div class="cardOverlayContainer itemAction"
                                             data-action="link">
                                            <button id="start-episode-${this.item.Id}"
                                                    is="paper-icon-button-light"
                                                    class="cardOverlayButton cardOverlayButton-hover itemAction paper-icon-button-light cardOverlayFab-primary"
                                                    data-action="resume">
                                                <span class="material-icons cardOverlayButtonIcon cardOverlayButtonIcon-hover play_arrow"
                                                    aria-hidden="true"/>
                                            </button>
                                        </div>` : ''}
                                </div>
                            </div>
                        </div>
                        <span class="previewEpisodeDescription ${this.programDataStore.pluginSettings.BlurDescription ? 'blur' : ''}">
                            ${this.item.Description ?? 'loading...'}
                        </span>
                    </div>
                </div>
            </div>
        `;
    }
    render(clickHandler) {
        const renderedElement = this.addElementToContainer();
        renderedElement.addEventListener('click', (e) => clickHandler(e));
        if (this.item.Id !== this.programDataStore.activeMediaSourceId) {
            // add event handler to start the playback of this episode
            const episodeImageCard = document.getElementById(`start-episode-${this.item.Id}`);
            episodeImageCard.addEventListener('click', () => this.playbackHandler.play(this.item.Id, this.item.UserData.PlaybackPositionTicks));
        }
    }
}
exports.ListElementTemplate = ListElementTemplate;


/***/ },

/***/ "./Web/Components/PopupTitleTemplate.ts"
/*!**********************************************!*\
  !*** ./Web/Components/PopupTitleTemplate.ts ***!
  \**********************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PopupTitleTemplate = void 0;
const BaseTemplate_1 = __webpack_require__(/*! ./BaseTemplate */ "./Web/Components/BaseTemplate.ts");
const ItemType_1 = __webpack_require__(/*! ../Models/ItemType */ "./Web/Models/ItemType.ts");
class PopupTitleTemplate extends BaseTemplate_1.BaseTemplate {
    programDataStore;
    constructor(container, positionAfterIndex, programDataStore) {
        super(container, positionAfterIndex);
        this.programDataStore = programDataStore;
        this.setElementId('popupTitleContainer');
    }
    getTemplate() {
        return `
            <div id="${this.getElementId()}" class="actionSheetTitle listItem previewPopupTitle">
                ${this.programDataStore.type === ItemType_1.ItemType.Series && this.programDataStore.seasons.length > 1 ?
            '<span class="actionsheetMenuItemIcon listItemIcon listItemIcon-transparent material-icons keyboard_backspace"></span>' :
            ''}
                <h1 class="actionSheetTitle"></h1>
            </div>
        `;
    }
    render(clickHandler) {
        const renderedElement = this.addElementToContainer();
        switch (this.programDataStore.type) {
            case ItemType_1.ItemType.Series:
                renderedElement.addEventListener('click', (e) => clickHandler(e));
                break;
            case ItemType_1.ItemType.BoxSet:
            case ItemType_1.ItemType.Folder:
                renderedElement.addEventListener('click', (e) => e.stopPropagation());
                break;
        }
    }
    setText(text) {
        this.getElement().querySelector('h1').innerText = text;
    }
    setVisible(isVisible) {
        const renderedElement = this.getElement();
        if (isVisible) {
            renderedElement.classList.remove('hide');
            return;
        }
        renderedElement.classList.add('hide');
    }
}
exports.PopupTitleTemplate = PopupTitleTemplate;


/***/ },

/***/ "./Web/Components/PreviewButtonTemplate.ts"
/*!*************************************************!*\
  !*** ./Web/Components/PreviewButtonTemplate.ts ***!
  \*************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PreviewButtonTemplate = void 0;
const BaseTemplate_1 = __webpack_require__(/*! ./BaseTemplate */ "./Web/Components/BaseTemplate.ts");
class PreviewButtonTemplate extends BaseTemplate_1.BaseTemplate {
    constructor(container, positionAfterIndex) {
        super(container, positionAfterIndex);
        this.setElementId('popupPreviewButton');
    }
    getTemplate() {
        // language=HTML
        return `
            <button id="${this.getElementId()}" class="autoSize paper-icon-button-light" is="paper-icon-button-light"
                    title="Episode Preview">
                <!-- Created with Inkscape (http://www.inkscape.org/) -->
                <svg id="svg1"
                     width="24"
                     height="24"
                     viewBox="0 0 6 4"
                     xmlns="http://www.w3.org/2000/svg">
                    <g id="layer1">
                        <rect id="rect47"
                              style="fill:none;fill-opacity:1;fill-rule:nonzero;stroke:currentColor;stroke-width:0.476467;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;paint-order:stroke markers fill"
                              width="3.7568676"
                              height="2.1693661"
                              x="0.23823303"
                              y="1.8257335"/>
                        <path id="rect47-5"
                              style="fill:none;stroke:currentColor;stroke-width:0.476597;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;paint-order:stroke markers fill"
                              d="m 1.0291437,1.0320482 h 3.7528991 v 2.1722394 l 0.00676,-2.1572595 z"/>
                        <path id="rect47-8"
                              style="fill:none;stroke:currentColor;stroke-width:0.477427;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;paint-order:stroke markers fill"
                              d="m 1.8228614,0.23871336 h 3.759259 V 2.4101211 l -0.0068,-2.17140774 z"/>
                    </g>
                </svg>
            </button>
        `;
    }
    render(clickHandler) {
        const renderedElement = this.addElementToContainer();
        renderedElement.addEventListener('click', () => clickHandler());
    }
}
exports.PreviewButtonTemplate = PreviewButtonTemplate;


/***/ },

/***/ "./Web/Components/QuickActions/FavoriteIconTemplate.ts"
/*!*************************************************************!*\
  !*** ./Web/Components/QuickActions/FavoriteIconTemplate.ts ***!
  \*************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FavoriteIconTemplate = void 0;
const BaseTemplate_1 = __webpack_require__(/*! ../BaseTemplate */ "./Web/Components/BaseTemplate.ts");
class FavoriteIconTemplate extends BaseTemplate_1.BaseTemplate {
    episode;
    constructor(container, positionAfterIndex, episode) {
        super(container, positionAfterIndex);
        this.episode = episode;
        this.setElementId('favoriteButton-' + episode.Id);
    }
    getTemplate() {
        // language=HTML
        return `
            <button id="${this.getElementId()}"
                    is="emby-ratingbutton"
                    type="button"
                    class="itemAction paper-icon-button-light emby-button"
                    data-action="none"
                    data-id="${this.episode?.Id ?? ''}"
                    data-serverid="${this.episode?.ServerId ?? ''}"
                    data-itemtype="Episode"
                    data-likes=""
                    data-isfavorite="${this.episode?.UserData?.IsFavorite ?? false}"
                    title="Add to favorites">
                <span class="material-icons favorite"></span>
            </button>
        `;
    }
    render() {
        this.addElementToContainer();
    }
}
exports.FavoriteIconTemplate = FavoriteIconTemplate;


/***/ },

/***/ "./Web/Components/QuickActions/PlayStateIconTemplate.ts"
/*!**************************************************************!*\
  !*** ./Web/Components/QuickActions/PlayStateIconTemplate.ts ***!
  \**************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlayStateIconTemplate = void 0;
const BaseTemplate_1 = __webpack_require__(/*! ../BaseTemplate */ "./Web/Components/BaseTemplate.ts");
class PlayStateIconTemplate extends BaseTemplate_1.BaseTemplate {
    episode;
    constructor(container, positionAfterIndex, episode) {
        super(container, positionAfterIndex);
        this.episode = episode;
        this.setElementId('playStateButton-' + this.episode.Id);
    }
    getTemplate() {
        // language=HTML
        return `
            <button id="${this.getElementId()}"
                    is="emby-playstatebutton"
                    type="button"
                    data-action="none"
                    class="itemAction paper-icon-button-light emby-button"
                    data-id="${this.episode?.Id ?? ''}" 
                    data-serverid="${this.episode?.ServerId ?? ''}"
                    data-itemtype="Episode"
                    data-likes=""
                    data-played="${this.episode?.UserData?.Played ?? false}"
                    title="Mark played">
                <span class="material-icons check playstatebutton-icon-${this.episode?.UserData?.Played ? "played" : "unplayed"}"></span>
            </button>
        `;
    }
    render() {
        this.addElementToContainer();
    }
}
exports.PlayStateIconTemplate = PlayStateIconTemplate;


/***/ },

/***/ "./Web/Components/SeasonListElementTemplate.ts"
/*!*****************************************************!*\
  !*** ./Web/Components/SeasonListElementTemplate.ts ***!
  \*****************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SeasonListElementTemplate = void 0;
const BaseTemplate_1 = __webpack_require__(/*! ./BaseTemplate */ "./Web/Components/BaseTemplate.ts");
class SeasonListElementTemplate extends BaseTemplate_1.BaseTemplate {
    season;
    isCurrentSeason;
    constructor(container, positionAfterIndex, season, isCurrentSeason) {
        super(container, positionAfterIndex);
        this.season = season;
        this.isCurrentSeason = isCurrentSeason;
        this.setElementId(`episode-${season.seasonId}`);
    }
    getTemplate() {
        // language=HTML
        return `
            <div id="${this.getElementId()}"
                 class="listItem listItem-button actionSheetMenuItem emby-button previewListItem"
                 is="emby-button"
                 data-id="${this.season.seasonId}">
                <button class="listItem previewEpisodeTitle" type="button">
                    <span class="${this.isCurrentSeason ? "material-icons check" : ""}"></span>
                    <div class="listItemBody actionsheetListItemBody">
                        <span class="actionSheetItemText">${this.season.seasonName}</span>
                    </div>
                </button>
            </div>
        `;
    }
    render(clickHandler) {
        const renderedElement = this.addElementToContainer();
        renderedElement.addEventListener('click', (e) => clickHandler(e));
    }
}
exports.SeasonListElementTemplate = SeasonListElementTemplate;


/***/ },

/***/ "./Web/Endpoints.ts"
/*!**************************!*\
  !*** ./Web/Endpoints.ts ***!
  \**************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Endpoints = void 0;
var Endpoints;
(function (Endpoints) {
    Endpoints["BASE"] = "InPlayerPreview";
    Endpoints["EPISODE_INFO"] = "/Users/{userId}/Items/{episodeId}";
    Endpoints["EPISODE_DESCRIPTION"] = "/Items/{episodeId}";
    Endpoints["PLAY_MEDIA"] = "/Users/{userId}/{deviceId}/Items/{episodeId}/Play/{ticks}";
    Endpoints["SERVER_SETTINGS"] = "/ServerSettings";
})(Endpoints || (exports.Endpoints = Endpoints = {}));


/***/ },

/***/ "./Web/ListElementFactory.ts"
/*!***********************************!*\
  !*** ./Web/ListElementFactory.ts ***!
  \***********************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ListElementFactory = void 0;
const ListElementTemplate_1 = __webpack_require__(/*! ./Components/ListElementTemplate */ "./Web/Components/ListElementTemplate.ts");
const SeasonListElementTemplate_1 = __webpack_require__(/*! ./Components/SeasonListElementTemplate */ "./Web/Components/SeasonListElementTemplate.ts");
const Endpoints_1 = __webpack_require__(/*! ./Endpoints */ "./Web/Endpoints.ts");
class ListElementFactory {
    playbackHandler;
    programDataStore;
    constructor(playbackHandler, programDataStore) {
        this.playbackHandler = playbackHandler;
        this.programDataStore = programDataStore;
    }
    async createEpisodeElements(episodes, parentDiv) {
        const displayEpisodes = this.resolveDisplayEpisodes(episodes);
        for (let i = 0; i < displayEpisodes.length; i++) {
            const episode = displayEpisodes[i];
            const episodeListElementTemplate = new ListElementTemplate_1.ListElementTemplate(parentDiv, i, episode, this.playbackHandler, this.programDataStore);
            episodeListElementTemplate.render(async (e) => {
                e.stopPropagation();
                // hide episode content for all existing episodes in the preview list
                document.querySelectorAll(".previewListItemContent").forEach((element) => {
                    element.classList.add('hide');
                    element.classList.remove('selectedListItem');
                });
                const episodeContainer = document.querySelector(`[data-id="${episode.Id}"]`).querySelector('.previewListItemContent');
                // load episode description
                if (!episode.Description) {
                    const url = ApiClient.getUrl(`/${Endpoints_1.Endpoints.BASE}${Endpoints_1.Endpoints.EPISODE_DESCRIPTION}`
                        .replace('{episodeId}', episode.Id));
                    const result = await ApiClient.ajax({ type: 'GET', url, dataType: 'json' });
                    const newDescription = result?.Description;
                    this.programDataStore.updateItem({
                        ...episode,
                        Description: newDescription
                    });
                    episodeContainer.querySelector('.previewEpisodeDescription').textContent = newDescription;
                }
                // show episode content for the selected episode
                episodeContainer.classList.remove('hide');
                episodeContainer.classList.add('selectedListItem');
                // scroll to the selected episode
                episodeContainer.parentElement.scrollIntoView({ block: "start" });
            });
            if (episode.Id === this.programDataStore.activeMediaSourceId) {
                const episodeNode = document.querySelector(`[data-id="${episode.Id}"]`).querySelector('.previewListItemContent');
                // preload episode description for the currently playing episode
                if (!episode.Description) {
                    const url = ApiClient.getUrl(`/${Endpoints_1.Endpoints.BASE}${Endpoints_1.Endpoints.EPISODE_DESCRIPTION}`
                        .replace('{episodeId}', episode.Id));
                    const result = await ApiClient.ajax({ type: 'GET', url, dataType: 'json' });
                    const newDescription = result?.Description;
                    this.programDataStore.updateItem({
                        ...episode,
                        Description: newDescription
                    });
                    episodeNode.querySelector('.previewEpisodeDescription').textContent = newDescription;
                }
                episodeNode.classList.remove('hide');
                episodeNode.classList.add('selectedListItem');
            }
        }
    }
    createSeasonElements(seasons, parentDiv, currentSeasonIndex, titleContainer) {
        seasons.sort((a, b) => a.IndexNumber - b.IndexNumber);
        for (let i = 0; i < seasons.length; i++) {
            const season = new SeasonListElementTemplate_1.SeasonListElementTemplate(parentDiv, i, seasons[i], seasons[i].IndexNumber === currentSeasonIndex);
            season.render((e) => {
                e.stopPropagation();
                titleContainer.setText(seasons[i].seasonName);
                titleContainer.setVisible(true);
                parentDiv.innerHTML = ""; // remove old content
                this.createEpisodeElements(seasons[i].episodes, parentDiv).then();
            });
        }
    }
    resolveDisplayEpisodes(episodes) {
        const queueIds = this.programDataStore.nowPlayingQueueIds ?? [];
        if (this.programDataStore.isShuffleActive() && queueIds.length > 0) {
            const episodeMap = new Map(episodes.map((episode) => [episode.Id, episode]));
            return queueIds
                .map((id) => episodeMap.get(id))
                .filter((episode) => Boolean(episode));
        }
        return [...episodes].sort((a, b) => {
            const parentCompare = (a.ParentIndexNumber ?? 0) - (b.ParentIndexNumber ?? 0);
            if (parentCompare !== 0)
                return parentCompare;
            return (a.IndexNumber ?? 0) - (b.IndexNumber ?? 0);
        });
    }
}
exports.ListElementFactory = ListElementFactory;


/***/ },

/***/ "./Web/Models/ItemType.ts"
/*!********************************!*\
  !*** ./Web/Models/ItemType.ts ***!
  \********************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ItemType = void 0;
var ItemType;
(function (ItemType) {
    ItemType[ItemType["AggregateFolder"] = 0] = "AggregateFolder";
    ItemType[ItemType["Audio"] = 1] = "Audio";
    ItemType[ItemType["AudioBook"] = 2] = "AudioBook";
    ItemType[ItemType["BasePluginFolder"] = 3] = "BasePluginFolder";
    ItemType[ItemType["Book"] = 4] = "Book";
    ItemType[ItemType["BoxSet"] = 5] = "BoxSet";
    ItemType[ItemType["Channel"] = 6] = "Channel";
    ItemType[ItemType["ChannelFolderItem"] = 7] = "ChannelFolderItem";
    ItemType[ItemType["CollectionFolder"] = 8] = "CollectionFolder";
    ItemType[ItemType["Episode"] = 9] = "Episode";
    ItemType[ItemType["Folder"] = 10] = "Folder";
    ItemType[ItemType["Genre"] = 11] = "Genre";
    ItemType[ItemType["ManualPlaylistsFolder"] = 12] = "ManualPlaylistsFolder";
    ItemType[ItemType["Movie"] = 13] = "Movie";
    ItemType[ItemType["LiveTvChannel"] = 14] = "LiveTvChannel";
    ItemType[ItemType["LiveTvProgram"] = 15] = "LiveTvProgram";
    ItemType[ItemType["MusicAlbum"] = 16] = "MusicAlbum";
    ItemType[ItemType["MusicArtist"] = 17] = "MusicArtist";
    ItemType[ItemType["MusicGenre"] = 18] = "MusicGenre";
    ItemType[ItemType["MusicVideo"] = 19] = "MusicVideo";
    ItemType[ItemType["Person"] = 20] = "Person";
    ItemType[ItemType["Photo"] = 21] = "Photo";
    ItemType[ItemType["PhotoAlbum"] = 22] = "PhotoAlbum";
    ItemType[ItemType["Playlist"] = 23] = "Playlist";
    ItemType[ItemType["PlaylistsFolder"] = 24] = "PlaylistsFolder";
    ItemType[ItemType["Program"] = 25] = "Program";
    ItemType[ItemType["Recording"] = 26] = "Recording";
    ItemType[ItemType["Season"] = 27] = "Season";
    ItemType[ItemType["Series"] = 28] = "Series";
    ItemType[ItemType["Studio"] = 29] = "Studio";
    ItemType[ItemType["Trailer"] = 30] = "Trailer";
    ItemType[ItemType["TvChannel"] = 31] = "TvChannel";
    ItemType[ItemType["TvProgram"] = 32] = "TvProgram";
    ItemType[ItemType["UserRootFolder"] = 33] = "UserRootFolder";
    ItemType[ItemType["UserView"] = 34] = "UserView";
    ItemType[ItemType["Video"] = 35] = "Video";
    ItemType[ItemType["Year"] = 36] = "Year";
})(ItemType || (exports.ItemType = ItemType = {}));


/***/ },

/***/ "./Web/Models/PlaybackProgressInfo.ts"
/*!********************************************!*\
  !*** ./Web/Models/PlaybackProgressInfo.ts ***!
  \********************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlaybackOrder = exports.RepeatMode = exports.PlayMethod = void 0;
var PlayMethod;
(function (PlayMethod) {
    PlayMethod[PlayMethod["Transcode"] = 0] = "Transcode";
    PlayMethod[PlayMethod["DirectStream"] = 1] = "DirectStream";
    PlayMethod[PlayMethod["DirectPlay"] = 2] = "DirectPlay";
})(PlayMethod || (exports.PlayMethod = PlayMethod = {}));
var RepeatMode;
(function (RepeatMode) {
    RepeatMode[RepeatMode["RepeatNone"] = 0] = "RepeatNone";
    RepeatMode[RepeatMode["RepeatAll"] = 1] = "RepeatAll";
    RepeatMode[RepeatMode["RepeatOne"] = 2] = "RepeatOne";
})(RepeatMode || (exports.RepeatMode = RepeatMode = {}));
var PlaybackOrder;
(function (PlaybackOrder) {
    PlaybackOrder[PlaybackOrder["Default"] = 0] = "Default";
    PlaybackOrder[PlaybackOrder["Shuffle"] = 1] = "Shuffle";
})(PlaybackOrder || (exports.PlaybackOrder = PlaybackOrder = {}));


/***/ },

/***/ "./Web/Models/PluginSettings.ts"
/*!**************************************!*\
  !*** ./Web/Models/PluginSettings.ts ***!
  \**************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DefaultPluginSettings = void 0;
const ItemType_1 = __webpack_require__(/*! ./ItemType */ "./Web/Models/ItemType.ts");
exports.DefaultPluginSettings = {
    EnabledItemTypes: [ItemType_1.ItemType.Series, ItemType_1.ItemType.BoxSet, ItemType_1.ItemType.Movie, ItemType_1.ItemType.Folder, ItemType_1.ItemType.Video],
    BlurDescription: false,
    BlurThumbnail: false,
};


/***/ },

/***/ "./Web/Models/ServerSettings.ts"
/*!**************************************!*\
  !*** ./Web/Models/ServerSettings.ts ***!
  \**************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DefaultServerSettings = void 0;
exports.DefaultServerSettings = {
    MinResumePct: 5,
    MaxResumePct: 90,
    MinResumeDurationSeconds: 300
};


/***/ },

/***/ "./Web/Services/AuthService.ts"
/*!*************************************!*\
  !*** ./Web/Services/AuthService.ts ***!
  \*************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
class AuthService {
    _authHeader = 'Authorization';
    _authHeaderValue = '';
    constructor() {
    }
    getAuthHeaderKey() {
        return this._authHeader;
    }
    getAuthHeaderValue() {
        return this._authHeaderValue;
    }
    setAuthHeaderValue(value) {
        this._authHeaderValue = value;
    }
    addAuthHeaderIntoHttpRequest(request) {
        request.setRequestHeader(this._authHeader, this.getAuthHeaderValue());
    }
}
exports.AuthService = AuthService;


/***/ },

/***/ "./Web/Services/DataFetcher.ts"
/*!*************************************!*\
  !*** ./Web/Services/DataFetcher.ts ***!
  \*************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DataFetcher = void 0;
const ItemType_1 = __webpack_require__(/*! ../Models/ItemType */ "./Web/Models/ItemType.ts");
const PlaybackProgressInfo_1 = __webpack_require__(/*! ../Models/PlaybackProgressInfo */ "./Web/Models/PlaybackProgressInfo.ts");
/**
 * The classes which derives from this interface, will provide the functionality to handle the data input from the server if the PlaybackState is changed.
 */
class DataFetcher {
    programDataStore;
    authService;
    logger;
    constructor(programDataStore, authService, logger) {
        this.programDataStore = programDataStore;
        this.authService = authService;
        this.logger = logger;
        const { fetch: originalFetch } = window;
        window.fetch = async (...args) => {
            const { origin } = window.location;
            let resource = args[0];
            const config = args[1] ?? {};
            const toUrl = (input) => {
                if (input instanceof URL)
                    return input;
                if (input instanceof Request)
                    return new URL(input.url);
                return new URL(String(input), origin);
            };
            if (config && config.headers) {
                this.authService.setAuthHeaderValue(config.headers[this.authService.getAuthHeaderKey()] ?? '');
            }
            const url = toUrl(resource);
            const urlPathname = url.pathname;
            // Process data from POST requests
            // Endpoint: /Sessions/Playing
            if (config.body && typeof config.body === 'string' && urlPathname.includes('Sessions/Playing')) {
                const playingInfo = JSON.parse(config.body);
                // save the item id of the currently played video
                const activeItemId = playingInfo.ItemId ?? playingInfo.Item?.Id ?? playingInfo.MediaSourceId;
                if (activeItemId && this.programDataStore.activeMediaSourceId !== activeItemId)
                    this.programDataStore.activeMediaSourceId = activeItemId;
                const playbackOrderRaw = playingInfo.PlaybackOrder;
                const playbackOrderFromEnum = typeof playbackOrderRaw === 'number'
                    ? PlaybackProgressInfo_1.PlaybackOrder[playbackOrderRaw]
                    : playbackOrderRaw;
                const playbackOrder = playbackOrderFromEnum ?? 'Default';
                const nowPlayingQueueIds = (playingInfo.NowPlayingQueue ?? [])
                    .map((queueItem) => queueItem?.Id)
                    .filter((id) => Boolean(id));
                this.programDataStore.setPlaybackOrder(playbackOrder);
                this.programDataStore.setNowPlayingQueue(nowPlayingQueueIds);
                void this.programDataStore.ensureItemsLoadedByIds(nowPlayingQueueIds);
                // Endpoint: /Sessions/Playing/Progress
                if (urlPathname.includes('Progress')) {
                    // update the playback progress of the currently played video
                    const episode = this.programDataStore.getItemById(activeItemId);
                    if (episode) {
                        const playedPercentage = episode.RunTimeTicks > 0 ? (playingInfo.PositionTicks / episode.RunTimeTicks) * 100 : 0;
                        const played = playedPercentage >= this.programDataStore.serverSettings.MaxResumePct;
                        this.programDataStore.updateItem({
                            ...episode,
                            UserData: {
                                ...episode.UserData,
                                PlaybackPositionTicks: playingInfo.PositionTicks,
                                PlayedPercentage: playedPercentage,
                                Played: played
                            }
                        });
                    }
                }
            }
            if (urlPathname.includes('Episodes')) {
                // remove new 'startItemId' and 'limit' query parameter, to still get the full list of episodes
                const cleanedURL = url.href.replace(/startItemId=[^&]+&?/, '').replace(/limit=[^&]+&?/, '');
                resource = toUrl(cleanedURL).toString();
            }
            const response = await originalFetch(resource, config);
            if (urlPathname.includes('Episodes')) {
                this.logger.debug('Received Episodes');
                response.clone().json().then((data) => {
                    this.programDataStore.type = ItemType_1.ItemType.Series;
                    this.programDataStore.seasons = this.getFormattedEpisodeData(data);
                });
            }
            else if (urlPathname.includes('User') && urlPathname.includes('Items') && url.search.includes('ParentId')) {
                this.logger.debug('Received Items with ParentId');
                response.clone().json().then((data) => this.saveItemData(data, url.searchParams.get('ParentId')));
            }
            else if (urlPathname.includes('User') && urlPathname.includes('Items')) {
                this.logger.debug('Received Items without ParentId');
                response.clone().json().then((data) => {
                    this.logger.debug('Received single item data -> Setting BoxSet name');
                    switch (ItemType_1.ItemType[data.Type]) {
                        case ItemType_1.ItemType.BoxSet:
                        case ItemType_1.ItemType.Folder:
                            this.programDataStore.boxSetName = data.Name;
                            this.programDataStore.activeMediaSourceId = data.Id;
                            break;
                        case ItemType_1.ItemType.Movie: // could be single video (e.g. started from dashboard)
                        case ItemType_1.ItemType.Video:
                            this.saveItemData({
                                Items: [data],
                                TotalRecordCount: 1,
                                StartIndex: 0
                            });
                            break;
                    }
                });
            }
            else if (urlPathname.includes('PlayedItems')) {
                // update the played state of the episode
                this.logger.debug('Received PlayedItems');
                const itemId = extractKeyFromString(urlPathname, 'PlayedItems/');
                const changedItem = this.programDataStore.getItemById(itemId);
                if (!changedItem)
                    return;
                response.clone().json().then((data) => changedItem.UserData.Played = data["Played"]);
                this.programDataStore.updateItem(changedItem);
            }
            else if (urlPathname.includes('FavoriteItems')) {
                // update the favourite state of the episode
                this.logger.debug('Received FavoriteItems');
                const itemId = extractKeyFromString(urlPathname, 'FavoriteItems/');
                const changedItem = this.programDataStore.getItemById(itemId);
                if (!changedItem)
                    return;
                response.clone().json().then((data) => changedItem.UserData.IsFavorite = data["IsFavorite"]);
                this.programDataStore.updateItem(changedItem);
            }
            return response;
            function extractKeyFromString(searchString, startString, endString = '') {
                const startIndex = searchString.indexOf(startString) + startString.length;
                if (endString !== '') {
                    const endIndex = searchString.indexOf(endString, startIndex);
                    return searchString.substring(startIndex, endIndex);
                }
                return searchString.substring(startIndex);
            }
        };
    }
    saveItemData(itemDto, parentId = '') {
        if (!itemDto || !itemDto.Items || itemDto.Items.length === 0)
            return;
        const firstItem = itemDto.Items.at(0);
        const itemDtoType = ItemType_1.ItemType[firstItem?.Type];
        switch (itemDtoType) {
            case ItemType_1.ItemType.Episode:
                // do not overwrite data if we only receive one item which already exists
                if (itemDto.Items.length > 1 || !this.programDataStore.seasons.flatMap(season => season.episodes).some(episode => episode.Id === firstItem.Id)) {
                    this.programDataStore.type = ItemType_1.ItemType.Series;
                    this.programDataStore.seasons = this.getFormattedEpisodeData(itemDto);
                }
                break;
            case ItemType_1.ItemType.Movie:
                if (itemDto.Items.length > 1) {
                    this.programDataStore.type = this.programDataStore.activeMediaSourceId !== '' && this.programDataStore.activeMediaSourceId === parentId ? ItemType_1.ItemType.BoxSet : ItemType_1.ItemType.Movie;
                    this.programDataStore.movies = itemDto.Items.map((movie, idx) => ({
                        ...movie,
                        IndexNumber: idx + 1
                    }));
                    break;
                }
                // do not overwrite data if we only receive one item which already exists
                if (!this.programDataStore.movies.some(movie => movie.Id === firstItem.Id)) {
                    if (!this.programDataStore.movies.some(movie => movie.SortName === firstItem.SortName)) {
                        this.programDataStore.type = this.programDataStore.activeMediaSourceId !== '' && this.programDataStore.activeMediaSourceId === parentId ? ItemType_1.ItemType.BoxSet : ItemType_1.ItemType.Movie;
                    }
                    this.programDataStore.movies = itemDto.Items.map((movie, idx) => ({
                        ...movie,
                        IndexNumber: idx + 1
                    }));
                }
                break;
            case ItemType_1.ItemType.Video:
                if (itemDto.Items.length > 1) {
                    this.programDataStore.type = this.programDataStore.activeMediaSourceId !== '' && this.programDataStore.activeMediaSourceId === parentId ? ItemType_1.ItemType.Folder : ItemType_1.ItemType.Video;
                    itemDto.Items.sort((a, b) => (a.SortName && b.SortName) ? a.SortName.localeCompare(b.SortName) : 0);
                    this.programDataStore.movies = itemDto.Items.map((video, idx) => ({
                        ...video,
                        IndexNumber: idx + 1
                    }));
                    break;
                }
                // do not overwrite data if we only receive one item which already exists
                if (!this.programDataStore.movies.some(video => video.Id === firstItem.Id)) {
                    if (!this.programDataStore.movies.some(video => video.SortName === firstItem.SortName)) {
                        this.programDataStore.type = this.programDataStore.activeMediaSourceId !== '' && this.programDataStore.activeMediaSourceId === parentId ? ItemType_1.ItemType.Folder : ItemType_1.ItemType.Video;
                    }
                    itemDto.Items.sort((a, b) => (a.SortName && b.SortName) ? a.SortName.localeCompare(b.SortName) : 0);
                    this.programDataStore.movies = itemDto.Items.map((video, idx) => ({
                        ...video,
                        IndexNumber: idx + 1
                    }));
                }
                break;
        }
        // this.logger.error("Couldn't save items from response", itemDto);
    }
    getFormattedEpisodeData = (itemDto) => {
        const episodeData = itemDto.Items;
        // get all different seasonIds
        const seasonIds = new Set(episodeData.map((episode) => episode.SeasonId));
        // group the episodes by seasonId
        const group = groupBy(episodeData, (episode) => episode.SeasonId);
        const seasons = [];
        const iterator = seasonIds.values();
        let value = iterator.next();
        while (!value.done) {
            const seasonId = value.value;
            const season = {
                seasonId: seasonId,
                seasonName: group[seasonId].at(0).SeasonName,
                episodes: group[seasonId],
                IndexNumber: seasons.length
            };
            seasons.push(season);
            value = iterator.next();
        }
        return seasons;
        function groupBy(arr, fn) {
            return arr.reduce((prev, curr) => {
                const groupKey = fn(curr);
                const group = prev[groupKey] || [];
                group.push(curr);
                return { ...prev, [groupKey]: group };
            }, {});
        }
    };
}
exports.DataFetcher = DataFetcher;


/***/ },

/***/ "./Web/Services/Logger.ts"
/*!********************************!*\
  !*** ./Web/Services/Logger.ts ***!
  \********************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Logger = void 0;
class Logger {
    log_prefix;
    constructor(log_prefix = "[InPlayerEpisodePreview]") {
        this.log_prefix = log_prefix;
    }
    debug(msg, ...details) {
        // console.debug(`${this.log_prefix} ${msg}`, details);
    }
    error(msg, ...details) {
        console.error(`${this.log_prefix} ${msg}`, details);
    }
    info(msg, ...details) {
        console.info(`${this.log_prefix} ${msg}`, details);
    }
}
exports.Logger = Logger;


/***/ },

/***/ "./Web/Services/PlaybackHandler.ts"
/*!*****************************************!*\
  !*** ./Web/Services/PlaybackHandler.ts ***!
  \*****************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlaybackHandler = void 0;
const Endpoints_1 = __webpack_require__(/*! ../Endpoints */ "./Web/Endpoints.ts");
class PlaybackHandler {
    logger;
    constructor(logger) {
        this.logger = logger;
    }
    async play(episodeId, startPositionTicks) {
        try {
            const url = ApiClient.getUrl(`/${Endpoints_1.Endpoints.BASE}${Endpoints_1.Endpoints.PLAY_MEDIA}`
                .replace('{userId}', ApiClient.getCurrentUserId())
                .replace('{deviceId}', ApiClient.deviceId())
                .replace('{episodeId}', episodeId)
                .replace('{ticks}', startPositionTicks.toString()));
            return await ApiClient.ajax({ type: 'GET', url });
        }
        catch (ex) {
            return this.logger.error(`Couldn't start the playback of an episode`, ex);
        }
    }
}
exports.PlaybackHandler = PlaybackHandler;


/***/ },

/***/ "./Web/Services/ProgramDataStore.ts"
/*!******************************************!*\
  !*** ./Web/Services/ProgramDataStore.ts ***!
  \******************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProgramDataStore = void 0;
const ItemType_1 = __webpack_require__(/*! ../Models/ItemType */ "./Web/Models/ItemType.ts");
const PluginSettings_1 = __webpack_require__(/*! ../Models/PluginSettings */ "./Web/Models/PluginSettings.ts");
const ServerSettings_1 = __webpack_require__(/*! ../Models/ServerSettings */ "./Web/Models/ServerSettings.ts");
class ProgramDataStore {
    _programData;
    playbackStateListeners = new Set();
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
            pluginSettings: PluginSettings_1.DefaultPluginSettings,
            serverSettings: ServerSettings_1.DefaultServerSettings
        };
    }
    get activeMediaSourceId() {
        return this._programData.activeMediaSourceId;
    }
    set activeMediaSourceId(activeMediaSourceId) {
        this._programData.activeMediaSourceId = activeMediaSourceId;
    }
    get activeSeason() {
        return this.seasons.find(season => season.episodes.some(episode => episode.Id === this.activeMediaSourceId))
            ?? this.seasons[0]
            ?? {
                seasonId: '',
                seasonName: '',
                episodes: [],
                IndexNumber: 0
            };
    }
    get type() {
        return this._programData.type;
    }
    set type(type) {
        this._programData.type = type;
    }
    get boxSetName() {
        return this._programData.boxSetName;
    }
    set boxSetName(boxSetName) {
        this._programData.boxSetName = boxSetName;
    }
    get playbackOrder() {
        return this._programData.playbackOrder;
    }
    setPlaybackOrder(playbackOrder) {
        const normalizedOrder = playbackOrder ?? 'Default';
        if (this._programData.playbackOrder === normalizedOrder)
            return;
        this._programData.playbackOrder = normalizedOrder;
        this.notifyPlaybackStateChanged();
    }
    get nowPlayingQueueIds() {
        return this._programData.nowPlayingQueueIds;
    }
    get nowPlayingQueueVersion() {
        return this._programData.nowPlayingQueueVersion;
    }
    setNowPlayingQueue(ids) {
        const normalizedIds = (ids ?? []).filter((id) => Boolean(id));
        if (this.arraysEqual(this._programData.nowPlayingQueueIds, normalizedIds))
            return;
        this._programData.nowPlayingQueueIds = normalizedIds;
        this._programData.nowPlayingQueueVersion = Date.now();
        this.notifyPlaybackStateChanged();
    }
    isShuffleActive() {
        const playbackOrder = (this._programData.playbackOrder ?? '').toString().toLowerCase();
        return playbackOrder === 'shuffle' || playbackOrder === 'random';
    }
    subscribePlaybackStateChanged(listener) {
        this.playbackStateListeners.add(listener);
        return () => this.playbackStateListeners.delete(listener);
    }
    get movies() {
        return this._programData.movies;
    }
    set movies(movies) {
        this._programData.movies = movies;
        this._programData.seasons = [];
    }
    get seasons() {
        return this._programData.seasons;
    }
    set seasons(seasons) {
        this._programData.seasons = seasons;
        this._programData.movies = [];
    }
    get pluginSettings() {
        return this._programData.pluginSettings;
    }
    set pluginSettings(settings) {
        this._programData.pluginSettings = settings;
    }
    get serverSettings() {
        return this._programData.serverSettings;
    }
    set serverSettings(settings) {
        this._programData.serverSettings = settings;
    }
    get dataIsAllowedForPreview() {
        if (!this.allowedPreviewTypes.includes(this.type))
            return false;
        switch (this.type) {
            case ItemType_1.ItemType.Series:
                return this.activeSeason.episodes.length >= 1;
            case ItemType_1.ItemType.Movie:
                return true;
            case ItemType_1.ItemType.BoxSet:
            case ItemType_1.ItemType.Folder:
            case ItemType_1.ItemType.Video:
                return this.movies.length >= 1;
            default:
                return false;
        }
    }
    get allowedPreviewTypes() {
        return this.pluginSettings.EnabledItemTypes;
    }
    getItemById(itemId) {
        switch (this.type) {
            case ItemType_1.ItemType.Series:
                return this.seasons
                    .flatMap(season => season.episodes)
                    .find(episode => episode.Id === itemId);
            case ItemType_1.ItemType.BoxSet:
            case ItemType_1.ItemType.Movie:
            case ItemType_1.ItemType.Folder:
            case ItemType_1.ItemType.Video:
                return this.movies.find(movie => movie.Id === itemId);
            default:
                return undefined;
        }
    }
    updateItem(itemToUpdate) {
        switch (this.type) {
            case ItemType_1.ItemType.Series:
                {
                    const season = this.seasons.find(season => season.seasonId === itemToUpdate.SeasonId);
                    this.seasons = [
                        ...this.seasons.filter(season => season.seasonId !== itemToUpdate.SeasonId), {
                            ...season,
                            episodes: [...season.episodes.filter(episode => episode.Id !== itemToUpdate.Id), itemToUpdate]
                        }
                    ];
                }
                break;
            case ItemType_1.ItemType.BoxSet:
            case ItemType_1.ItemType.Movie:
            case ItemType_1.ItemType.Folder:
            case ItemType_1.ItemType.Video:
                this.movies = [...this.movies.filter(movie => movie.Id !== itemToUpdate.Id), itemToUpdate];
        }
    }
    hasItem(itemId) {
        return Boolean(this.getItemById(itemId));
    }
    async ensureItemsLoadedByIds(ids) {
        const missingIds = (ids ?? []).filter((id) => Boolean(id) && !this.hasItem(id));
        if (missingIds.length === 0)
            return;
        const userId = ApiClient.getCurrentUserId?.();
        if (!userId)
            return;
        const response = await ApiClient.getItems(userId, { Ids: missingIds.join(',') });
        const items = (response?.Items ?? []).map((item) => item);
        if (items.length === 0)
            return;
        this.mergeItems(items);
        this.notifyPlaybackStateChanged();
    }
    mergeItems(items) {
        items.forEach((item) => {
            const itemType = ItemType_1.ItemType[item.Type];
            switch (itemType) {
                case ItemType_1.ItemType.Episode:
                    this.mergeEpisodeItem(item);
                    break;
                case ItemType_1.ItemType.BoxSet:
                case ItemType_1.ItemType.Movie:
                case ItemType_1.ItemType.Folder:
                case ItemType_1.ItemType.Video:
                    if (!this.type)
                        this.type = itemType;
                    this.movies = [...this.movies.filter(movie => movie.Id !== item.Id), item];
                    break;
                default:
                    this.updateItem(item);
            }
        });
    }
    mergeEpisodeItem(item) {
        if (!this.type)
            this.type = ItemType_1.ItemType.Series;
        if (!item.SeasonId) {
            this.updateItem(item);
            return;
        }
        const seasonIndex = this.seasons.findIndex(season => season.seasonId === item.SeasonId);
        if (seasonIndex === -1) {
            this.seasons = [
                ...this.seasons,
                {
                    seasonId: item.SeasonId,
                    seasonName: item.SeasonName,
                    episodes: [item],
                    IndexNumber: this.seasons.length
                }
            ];
            return;
        }
        const season = this.seasons[seasonIndex];
        const updatedSeason = {
            ...season,
            episodes: [...season.episodes.filter(episode => episode.Id !== item.Id), item]
        };
        this.seasons = [
            ...this.seasons.slice(0, seasonIndex),
            updatedSeason,
            ...this.seasons.slice(seasonIndex + 1)
        ];
    }
    notifyPlaybackStateChanged() {
        this.playbackStateListeners.forEach(listener => listener());
    }
    arraysEqual(a, b) {
        if (a.length !== b.length)
            return false;
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i])
                return false;
        }
        return true;
    }
}
exports.ProgramDataStore = ProgramDataStore;


/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!********************************!*\
  !*** ./Web/InPlayerPreview.ts ***!
  \********************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const Logger_1 = __webpack_require__(/*! ./Services/Logger */ "./Web/Services/Logger.ts");
const AuthService_1 = __webpack_require__(/*! ./Services/AuthService */ "./Web/Services/AuthService.ts");
const PreviewButtonTemplate_1 = __webpack_require__(/*! ./Components/PreviewButtonTemplate */ "./Web/Components/PreviewButtonTemplate.ts");
const ProgramDataStore_1 = __webpack_require__(/*! ./Services/ProgramDataStore */ "./Web/Services/ProgramDataStore.ts");
const DialogContainerTemplate_1 = __webpack_require__(/*! ./Components/DialogContainerTemplate */ "./Web/Components/DialogContainerTemplate.ts");
const PlaybackHandler_1 = __webpack_require__(/*! ./Services/PlaybackHandler */ "./Web/Services/PlaybackHandler.ts");
const ListElementFactory_1 = __webpack_require__(/*! ./ListElementFactory */ "./Web/ListElementFactory.ts");
const PopupTitleTemplate_1 = __webpack_require__(/*! ./Components/PopupTitleTemplate */ "./Web/Components/PopupTitleTemplate.ts");
const DataFetcher_1 = __webpack_require__(/*! ./Services/DataFetcher */ "./Web/Services/DataFetcher.ts");
const ItemType_1 = __webpack_require__(/*! ./Models/ItemType */ "./Web/Models/ItemType.ts");
const Endpoints_1 = __webpack_require__(/*! ./Endpoints */ "./Web/Endpoints.ts");
// load and inject inPlayerPreview.css into the page
/*
 * Inject style to be used for the preview popup
 */
let inPlayerPreviewStyle = document.createElement('style');
inPlayerPreviewStyle.id = 'inPlayerPreviewStyle';
inPlayerPreviewStyle.textContent = `
.selectedListItem {
    height: auto;
}
.previewListItem {
    flex-direction: column; 
    align-items: flex-start;
}
.previewListItemContent {
    width: 100%; 
    min-height: 15.5vh; 
    position: relative; 
    display: flex; 
    flex-direction: column;
}
.previewPopup {
    animation: 140ms ease-out 0s 1 normal both running scaleup; 
    position: fixed; 
    margin: 0px; 
    bottom: 1.5vh; 
    left: 50vw; 
    width: 48vw;
}
.previewPopupTitle {
    max-height: 4vh;
}
.previewPopupScroller {
    max-height: 60vh;
}
.previewQuickActionContainer {
    margin-left: auto; 
    margin-right: 1em;
}
.previewEpisodeContainer {
    width: 100%;
}
.previewEpisodeTitle {
    pointer-events: none;
}
.previewEpisodeImageCard {
    max-width: 30%;
}
.previewEpisodeDescription {
    margin-left: 0.5em; 
    margin-top: 1em; 
    margin-right: 1.5em; 
    display: block;
}
.previewEpisodeDetails {
    margin-left: 1em; 
    justify-content: start !important;
}
.blur {
    filter: blur(6px); 
    transition: filter 0.3s ease; 
    display: inline-block;
}
.blur:hover {
    filter: blur(0);
}
.previewEpisodeImageCard:hover .blur {
    filter: blur(0);
}
`;
document?.head?.appendChild(inPlayerPreviewStyle);
// init services and helpers
const logger = new Logger_1.Logger();
const authService = new AuthService_1.AuthService();
const programDataStore = new ProgramDataStore_1.ProgramDataStore();
new DataFetcher_1.DataFetcher(programDataStore, authService, logger);
const playbackHandler = new PlaybackHandler_1.PlaybackHandler(logger);
const listElementFactory = new ListElementFactory_1.ListElementFactory(playbackHandler, programDataStore);
function initialize() {
    // Ensure ApiClient exists and user is logged in
    if (typeof ApiClient === 'undefined' || !ApiClient.getCurrentUserId?.()) {
        setTimeout(initialize, 300); // Increased retry delay slightly
        return;
    }
    ApiClient.getPluginConfiguration('73833d5f-0bcb-45dc-ab8b-7ce668f4345d')
        .then((config) => programDataStore.pluginSettings = config);
    const serverSettingsUrl = ApiClient.getUrl(`/${Endpoints_1.Endpoints.BASE}${Endpoints_1.Endpoints.SERVER_SETTINGS}`);
    ApiClient.ajax({ type: 'GET', url: serverSettingsUrl, dataType: 'json' })
        .then((config) => programDataStore.serverSettings = config);
}
initialize();
const videoPaths = ['/video'];
let previousRoutePath = null;
let previewContainerLoaded = false;
let playbackStateUnsubscribe = null;
document.addEventListener('viewshow', viewShowEventHandler);
function viewShowEventHandler() {
    const currentRoutePath = getLocationPath();
    function getLocationPath() {
        const location = window.location.toString();
        const currentRouteIndex = location.lastIndexOf('/');
        return location.substring(currentRouteIndex);
    }
    // Initial attempt to load the video view or schedule retries.
    attemptLoadVideoView();
    previousRoutePath = currentRoutePath;
    // This function attempts to load the video view, retrying up to 3 times if necessary.
    function attemptLoadVideoView(retryCount = 0) {
        if (videoPaths.includes(currentRoutePath)) {
            if (programDataStore.dataIsAllowedForPreview) {
                // Check if the preview container is already loaded before loading
                if (!previewContainerLoaded && !isPreviewButtonCreated()) {
                    loadVideoView();
                    previewContainerLoaded = true; // Set flag to true after loading
                }
            }
            else if (retryCount < 3) { // Retry up to 3 times
                setTimeout(() => {
                    logger.debug(`Retry #${retryCount + 1}`);
                    attemptLoadVideoView(retryCount + 1);
                }, 10000); // Wait 10 seconds for each retry
            }
        }
        else if (videoPaths.includes(previousRoutePath)) {
            unloadVideoView();
        }
    }
    function loadVideoView() {
        // add preview button to the page
        const parent = document.querySelector('.buttons').lastElementChild.parentElement; // lastElementChild.parentElement is used for casting from Element to HTMLElement
        let index = Array.from(parent.children).findIndex((child) => child.classList.contains("btnUserRating"));
        // if index is invalid try to use the old position (used in Jellyfin 10.8.12)
        if (index === -1)
            index = Array.from(parent.children).findIndex((child) => child.classList.contains("osdTimeText"));
        const previewButton = new PreviewButtonTemplate_1.PreviewButtonTemplate(parent, index);
        previewButton.render(previewButtonClickHandler);
        function previewButtonClickHandler() {
            const dialogContainer = new DialogContainerTemplate_1.DialogContainerTemplate(document.body, document.body.children.length - 1);
            dialogContainer.render();
            const contentDiv = document.getElementById('popupContentContainer');
            const popupTitle = new PopupTitleTemplate_1.PopupTitleTemplate(document.getElementById('popupFocusContainer'), -1, programDataStore);
            let showingSeasonList = false;
            const renderSeasonList = () => {
                const activeSeason = programDataStore.activeSeason;
                if (!activeSeason) {
                    logger.error('No active season data available for preview list.', programDataStore);
                    return;
                }
                showingSeasonList = true;
                popupTitle.setVisible(false);
                contentDiv.innerHTML = '';
                listElementFactory.createSeasonElements(programDataStore.seasons, contentDiv, activeSeason.IndexNumber, popupTitle);
            };
            const renderEpisodeList = () => {
                showingSeasonList = false;
                contentDiv.innerHTML = '';
                const isShuffleQueue = programDataStore.isShuffleActive() && programDataStore.nowPlayingQueueIds.length > 0;
                switch (programDataStore.type) {
                    case ItemType_1.ItemType.Series: {
                        if (isShuffleQueue) {
                            popupTitle.setText('Up Next (Shuffle Queue)');
                            popupTitle.setVisible(true);
                            const allEpisodes = programDataStore.seasons.flatMap(season => season.episodes);
                            listElementFactory.createEpisodeElements(allEpisodes, contentDiv);
                            break;
                        }
                        const activeSeason = programDataStore.activeSeason;
                        if (!activeSeason) {
                            logger.error('No active season data available for preview list.', programDataStore);
                            break;
                        }
                        popupTitle.setText(activeSeason.seasonName);
                        popupTitle.setVisible(true);
                        listElementFactory.createEpisodeElements(activeSeason.episodes, contentDiv);
                        break;
                    }
                    case ItemType_1.ItemType.Movie:
                        popupTitle.setText('');
                        popupTitle.setVisible(false);
                        listElementFactory.createEpisodeElements(programDataStore.movies.filter(movie => movie.Id === programDataStore.activeMediaSourceId), contentDiv);
                        break;
                    case ItemType_1.ItemType.Video:
                        popupTitle.setText('');
                        popupTitle.setVisible(false);
                        listElementFactory.createEpisodeElements(programDataStore.movies, contentDiv);
                        break;
                    case ItemType_1.ItemType.BoxSet:
                    case ItemType_1.ItemType.Folder:
                        popupTitle.setText(programDataStore.boxSetName);
                        popupTitle.setVisible(true);
                        listElementFactory.createEpisodeElements(programDataStore.movies, contentDiv);
                        break;
                }
                // scroll to the episode that is currently playing
                const activeItem = contentDiv.querySelector('.selectedListItem');
                if (!activeItem) {
                    logger.error("Couldn't find active media source element in preview list. This should never happen", programDataStore);
                }
                activeItem?.parentElement.scrollIntoView();
            };
            popupTitle.render((e) => {
                e.stopPropagation();
                renderSeasonList();
            });
            renderEpisodeList();
            if (playbackStateUnsubscribe)
                playbackStateUnsubscribe();
            playbackStateUnsubscribe = programDataStore.subscribePlaybackStateChanged(() => {
                if (showingSeasonList)
                    return;
                if (!document.getElementById('popupContentContainer'))
                    return;
                renderEpisodeList();
            });
        }
    }
    function unloadVideoView() {
        // Clear old data and reset previewContainerLoaded flag
        authService.setAuthHeaderValue("");
        if (document.getElementById("dialogBackdropContainer"))
            document.body.removeChild(document.getElementById("dialogBackdropContainer"));
        if (document.getElementById("dialogContainer"))
            document.body.removeChild(document.getElementById("dialogContainer"));
        previewContainerLoaded = false; // Reset flag when unloading
        if (playbackStateUnsubscribe) {
            playbackStateUnsubscribe();
            playbackStateUnsubscribe = null;
        }
    }
    function isPreviewButtonCreated() {
        return document.querySelector('.buttons').querySelector('#popupPreviewButton') !== null;
    }
}

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LGlCQUFpQixFQUFFO1lBRW5CLElBQUksd0JBQXdCO2dCQUN4Qix3QkFBd0IsRUFBRTtZQUM5Qix3QkFBd0IsR0FBRyxnQkFBZ0IsQ0FBQyw2QkFBNkIsQ0FBQyxHQUFHLEVBQUU7Z0JBQzNFLElBQUksaUJBQWlCO29CQUNqQixPQUFNO2dCQUNWLElBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLHVCQUF1QixDQUFDO29CQUNqRCxPQUFNO2dCQUNWLGlCQUFpQixFQUFFO1lBQ3ZCLENBQUMsQ0FBQztRQUNOLENBQUM7SUFDTCxDQUFDO0lBQ0QsU0FBUyxlQUFlO1FBQ3BCLHVEQUF1RDtRQUN2RCxXQUFXLENBQUMsa0JBQWtCLENBQUMsRUFBRSxDQUFDO1FBRWxDLElBQUksUUFBUSxDQUFDLGNBQWMsQ0FBQyx5QkFBeUIsQ0FBQztZQUNsRCxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLHlCQUF5QixDQUFDLENBQUM7UUFDakYsSUFBSSxRQUFRLENBQUMsY0FBYyxDQUFDLGlCQUFpQixDQUFDO1lBQzFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUV6RSxzQkFBc0IsR0FBRyxLQUFLLEVBQUMsNEJBQTRCO1FBQzNELElBQUksd0JBQXdCLEVBQUUsQ0FBQztZQUMzQix3QkFBd0IsRUFBRTtZQUMxQix3QkFBd0IsR0FBRyxJQUFJO1FBQ25DLENBQUM7SUFDTCxDQUFDO0lBRUQsU0FBUyxzQkFBc0I7UUFDM0IsT0FBTyxRQUFRLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLElBQUk7SUFDM0YsQ0FBQztBQUNMLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9XZWIvQ29tcG9uZW50cy9CYXNlVGVtcGxhdGUudHMiLCJ3ZWJwYWNrOi8vLy4vV2ViL0NvbXBvbmVudHMvRGlhbG9nQ29udGFpbmVyVGVtcGxhdGUudHMiLCJ3ZWJwYWNrOi8vLy4vV2ViL0NvbXBvbmVudHMvRXBpc29kZURldGFpbHMudHMiLCJ3ZWJwYWNrOi8vLy4vV2ViL0NvbXBvbmVudHMvTGlzdEVsZW1lbnRUZW1wbGF0ZS50cyIsIndlYnBhY2s6Ly8vLi9XZWIvQ29tcG9uZW50cy9Qb3B1cFRpdGxlVGVtcGxhdGUudHMiLCJ3ZWJwYWNrOi8vLy4vV2ViL0NvbXBvbmVudHMvUHJldmlld0J1dHRvblRlbXBsYXRlLnRzIiwid2VicGFjazovLy8uL1dlYi9Db21wb25lbnRzL1F1aWNrQWN0aW9ucy9GYXZvcml0ZUljb25UZW1wbGF0ZS50cyIsIndlYnBhY2s6Ly8vLi9XZWIvQ29tcG9uZW50cy9RdWlja0FjdGlvbnMvUGxheVN0YXRlSWNvblRlbXBsYXRlLnRzIiwid2VicGFjazovLy8uL1dlYi9Db21wb25lbnRzL1NlYXNvbkxpc3RFbGVtZW50VGVtcGxhdGUudHMiLCJ3ZWJwYWNrOi8vLy4vV2ViL0VuZHBvaW50cy50cyIsIndlYnBhY2s6Ly8vLi9XZWIvTGlzdEVsZW1lbnRGYWN0b3J5LnRzIiwid2VicGFjazovLy8uL1dlYi9Nb2RlbHMvSXRlbVR5cGUudHMiLCJ3ZWJwYWNrOi8vLy4vV2ViL01vZGVscy9QbGF5YmFja1Byb2dyZXNzSW5mby50cyIsIndlYnBhY2s6Ly8vLi9XZWIvTW9kZWxzL1BsdWdpblNldHRpbmdzLnRzIiwid2VicGFjazovLy8uL1dlYi9Nb2RlbHMvU2VydmVyU2V0dGluZ3MudHMiLCJ3ZWJwYWNrOi8vLy4vV2ViL1NlcnZpY2VzL0F1dGhTZXJ2aWNlLnRzIiwid2VicGFjazovLy8uL1dlYi9TZXJ2aWNlcy9EYXRhRmV0Y2hlci50cyIsIndlYnBhY2s6Ly8vLi9XZWIvU2VydmljZXMvTG9nZ2VyLnRzIiwid2VicGFjazovLy8uL1dlYi9TZXJ2aWNlcy9QbGF5YmFja0hhbmRsZXIudHMiLCJ3ZWJwYWNrOi8vLy4vV2ViL1NlcnZpY2VzL1Byb2dyYW1EYXRhU3RvcmUudHMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLy8uL1dlYi9JblBsYXllclByZXZpZXcudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGFic3RyYWN0IGNsYXNzIEJhc2VUZW1wbGF0ZSB7XG4gICAgLypcbiAgICAgKiB0aGUgSFRNTCBiYXNlZCBJRCBvZiB0aGUgbmV3IGdlbmVyYXRlZCBFbGVtZW50XG4gICAgICovXG4gICAgcHJpdmF0ZSBlbGVtZW50SWQ6IHN0cmluZztcblxuICAgIHByb3RlY3RlZCBjb25zdHJ1Y3Rvcihwcml2YXRlIGNvbnRhaW5lcjogSFRNTEVsZW1lbnQsIHByaXZhdGUgcG9zaXRpb25BZnRlckluZGV4OiBudW1iZXIpIHsgfVxuXG4gICAgcHVibGljIGdldENvbnRhaW5lcigpOiBIVE1MRWxlbWVudCB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRhaW5lcjtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0UG9zaXRpb25BZnRlckluZGV4KCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLnBvc2l0aW9uQWZ0ZXJJbmRleDtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgc2V0RWxlbWVudElkKGVsZW1lbnRJZDogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZWxlbWVudElkID0gZWxlbWVudElkO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRFbGVtZW50SWQoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudElkO1xuICAgIH1cbiAgICBcbiAgICBwdWJsaWMgZ2V0RWxlbWVudCgpOiBIVE1MRWxlbWVudCB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldENvbnRhaW5lcigpLnF1ZXJ5U2VsZWN0b3IoYCMke3RoaXMuZ2V0RWxlbWVudElkKCl9YCk7XG4gICAgfVxuXG4gICAgYWJzdHJhY3QgZ2V0VGVtcGxhdGUoLi4uY2xpY2tIYW5kbGVyczogRnVuY3Rpb25bXSk6IHN0cmluZztcblxuICAgIGFic3RyYWN0IHJlbmRlciguLi5jbGlja0hhbmRsZXJzOiBGdW5jdGlvbltdKTogdm9pZDtcblxuICAgIHByb3RlY3RlZCBhZGRFbGVtZW50VG9Db250YWluZXIoLi4uY2xpY2tIYW5kbGVyczogRnVuY3Rpb25bXSk6IEhUTUxFbGVtZW50IHtcbiAgICAgICAgLy8gQWRkIEVsZW1lbnQgYXMgdGhlIGZpcnN0IGNoaWxkIGlmIHBvc2l0aW9uIGlzIG5lZ2F0aXZlXG4gICAgICAgIGlmICh0aGlzLmdldFBvc2l0aW9uQWZ0ZXJJbmRleCgpIDwgMCAmJiB0aGlzLmdldENvbnRhaW5lcigpLmhhc0NoaWxkTm9kZXMoKSkge1xuICAgICAgICAgICAgdGhpcy5nZXRDb250YWluZXIoKS5maXJzdEVsZW1lbnRDaGlsZC5iZWZvcmUodGhpcy5zdHJpbmdUb05vZGUodGhpcy5nZXRUZW1wbGF0ZSguLi5jbGlja0hhbmRsZXJzKSkpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RWxlbWVudCgpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvLyBBZGQgRWxlbWVudCBpZiBjb250YWluZXIgaXMgZW1wdHlcbiAgICAgICAgaWYgKCF0aGlzLmdldENvbnRhaW5lcigpLmhhc0NoaWxkTm9kZXMoKSkge1xuICAgICAgICAgICAgdGhpcy5nZXRDb250YWluZXIoKS5pbm5lckhUTUwgPSB0aGlzLmdldFRlbXBsYXRlKC4uLmNsaWNrSGFuZGxlcnMpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RWxlbWVudCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGNoaWxkQmVmb3JlID0gdGhpcy5nZXRDb250YWluZXIoKS5sYXN0RWxlbWVudENoaWxkXG4gICAgICAgIGlmICh0aGlzLmdldENvbnRhaW5lcigpLmNoaWxkcmVuLmxlbmd0aCA+IHRoaXMuZ2V0UG9zaXRpb25BZnRlckluZGV4KCkgJiYgdGhpcy5nZXRQb3NpdGlvbkFmdGVySW5kZXgoKSA+PSAwKVxuICAgICAgICAgICAgY2hpbGRCZWZvcmUgPSB0aGlzLmdldENvbnRhaW5lcigpLmNoaWxkcmVuW3RoaXMuZ2V0UG9zaXRpb25BZnRlckluZGV4KCldO1xuICAgICAgICBcbiAgICAgICAgY2hpbGRCZWZvcmUuYWZ0ZXIodGhpcy5zdHJpbmdUb05vZGUodGhpcy5nZXRUZW1wbGF0ZSguLi5jbGlja0hhbmRsZXJzKSkpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmdldEVsZW1lbnQoKTtcbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSBzdHJpbmdUb05vZGUodGVtcGxhdGVTdHJpbmc6IHN0cmluZyk6IE5vZGUge1xuICAgICAgICBsZXQgcGxhY2Vob2xkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgcGxhY2Vob2xkZXIuaW5uZXJIVE1MID0gdGVtcGxhdGVTdHJpbmc7XG4gICAgICAgIHJldHVybiBwbGFjZWhvbGRlci5maXJzdEVsZW1lbnRDaGlsZDtcbiAgICB9XG59IiwiaW1wb3J0IHtCYXNlVGVtcGxhdGV9IGZyb20gXCIuL0Jhc2VUZW1wbGF0ZVwiO1xuXG5leHBvcnQgY2xhc3MgRGlhbG9nQ29udGFpbmVyVGVtcGxhdGUgZXh0ZW5kcyBCYXNlVGVtcGxhdGUge1xuICAgIGRpYWxvZ0JhY2tkcm9wSWQgPSAnZGlhbG9nQmFja2Ryb3AnXG4gICAgZGlhbG9nQ29udGFpbmVySWQgPSAnZGlhbG9nQ29udGFpbmVyJ1xuICAgIHBvcHVwQ29udGVudENvbnRhaW5lcklkID0gJ3BvcHVwQ29udGVudENvbnRhaW5lcidcbiAgICBwb3B1cEZvY3VzQ29udGFpbmVySWQgPSAncG9wdXBGb2N1c0NvbnRhaW5lcidcbiAgICBcbiAgICBjb25zdHJ1Y3Rvcihjb250YWluZXI6IEhUTUxFbGVtZW50LCBwb3NpdGlvbkFmdGVySW5kZXg6IG51bWJlcikge1xuICAgICAgICBzdXBlcihjb250YWluZXIsIHBvc2l0aW9uQWZ0ZXJJbmRleCk7XG4gICAgICAgIHRoaXMuc2V0RWxlbWVudElkKCdwcmV2aWV3UG9wdXAnKTtcbiAgICB9XG5cbiAgICBnZXRUZW1wbGF0ZSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gYFxuICAgICAgICAgICAgPGRpdiBpZD1cIiR7dGhpcy5nZXRFbGVtZW50SWQoKX1cIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGlkPVwiJHt0aGlzLmRpYWxvZ0JhY2tkcm9wSWR9XCIgY2xhc3M9XCJkaWFsb2dCYWNrZHJvcCBkaWFsb2dCYWNrZHJvcE9wZW5lZFwiPjwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCIke3RoaXMuZGlhbG9nQ29udGFpbmVySWR9XCIgY2xhc3M9XCJkaWFsb2dDb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBpZD1cIiR7dGhpcy5wb3B1cEZvY3VzQ29udGFpbmVySWR9XCIgXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cImZvY3VzY29udGFpbmVyIGRpYWxvZyBhY3Rpb25zaGVldC1ub3QtZnVsbHNjcmVlbiBhY3Rpb25TaGVldCBjZW50ZXJlZERpYWxvZyBvcGVuZWQgcHJldmlld1BvcHVwIGFjdGlvblNoZWV0Q29udGVudFwiIFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS1oaXN0b3J5PVwidHJ1ZVwiIFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS1yZW1vdmVvbmNsb3NlPVwidHJ1ZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBpZD1cIiR7dGhpcy5wb3B1cENvbnRlbnRDb250YWluZXJJZH1cIiBjbGFzcz1cImFjdGlvblNoZWV0U2Nyb2xsZXIgc2Nyb2xsWSBwcmV2aWV3UG9wdXBTY3JvbGxlclwiLz5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgYDtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVuZGVyKCk6IHZvaWQge1xuICAgICAgICBjb25zdCByZW5kZXJlZEVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIoKTtcbiAgICAgICAgcmVuZGVyZWRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGU6IE1vdXNlRXZlbnQpOiBhbnkgPT4ge1xuICAgICAgICAgICAgdGhpcy5nZXRDb250YWluZXIoKS5yZW1vdmVDaGlsZChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmdldEVsZW1lbnRJZCgpKSlcbiAgICAgICAgfSk7XG4gICAgfVxufSIsImltcG9ydCB7QmFzZVRlbXBsYXRlfSBmcm9tIFwiLi9CYXNlVGVtcGxhdGVcIjtcbmltcG9ydCB7QmFzZUl0ZW19IGZyb20gXCIuLi9Nb2RlbHMvRXBpc29kZVwiO1xuXG5leHBvcnQgY2xhc3MgRXBpc29kZURldGFpbHNUZW1wbGF0ZSBleHRlbmRzIEJhc2VUZW1wbGF0ZSB7XG4gICAgY29uc3RydWN0b3IoY29udGFpbmVyOiBIVE1MRWxlbWVudCwgcG9zaXRpb25BZnRlckluZGV4OiBudW1iZXIsIHByaXZhdGUgZXBpc29kZTogQmFzZUl0ZW0pIHtcbiAgICAgICAgc3VwZXIoY29udGFpbmVyLCBwb3NpdGlvbkFmdGVySW5kZXgpO1xuICAgICAgICB0aGlzLnNldEVsZW1lbnRJZChgZXBpc29kZS0ke2VwaXNvZGUuSWR9YCk7XG4gICAgfVxuXG4gICAgZ2V0VGVtcGxhdGUoKTogc3RyaW5nIHtcbiAgICAgICAgLy8gbGFuZ3VhZ2U9SFRNTFxuICAgICAgICByZXR1cm4gYFxuICAgICAgICAgICAgPGRpdiBpZD1cIiR7dGhpcy5nZXRFbGVtZW50SWQoKX0tZGV0YWlsc1wiIGNsYXNzPVwiaXRlbU1pc2NJbmZvIGl0ZW1NaXNjSW5mby1wcmltYXJ5IHByZXZpZXdFcGlzb2RlRGV0YWlsc1wiPlxuICAgICAgICAgICAgICAgICR7dGhpcy5lcGlzb2RlLlByZW1pZXJlRGF0ZSA/IGA8ZGl2IGNsYXNzPVwibWVkaWFJbmZvSXRlbVwiPlxuICAgICAgICAgICAgICAgICAgICAkeyhuZXcgRGF0ZSh0aGlzLmVwaXNvZGUuUHJlbWllcmVEYXRlKSkudG9Mb2NhbGVEYXRlU3RyaW5nKHRoaXMuZ2V0TG9jYWxlKCkpfVxuICAgICAgICAgICAgICAgIDwvZGl2PmAgOiAnJ31cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWVkaWFJbmZvSXRlbVwiPiR7dGhpcy5mb3JtYXRSdW5UaW1lKHRoaXMuZXBpc29kZS5SdW5UaW1lVGlja3MpfTwvZGl2PlxuICAgICAgICAgICAgICAgICR7dGhpcy5lcGlzb2RlLkNvbW11bml0eVJhdGluZyA/IGA8ZGl2IGNsYXNzPVwic3RhclJhdGluZ0NvbnRhaW5lciBtZWRpYUluZm9JdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnMgc3Rhckljb24gc3RhclwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgJHt0aGlzLmVwaXNvZGUuQ29tbXVuaXR5UmF0aW5nLnRvRml4ZWQoMSl9XG4gICAgICAgICAgICAgICAgPC9kaXY+YCA6ICcnfVxuICAgICAgICAgICAgICAgICR7dGhpcy5lcGlzb2RlLkNyaXRpY1JhdGluZyA/IGA8ZGl2IGNsYXNzPVwibWVkaWFJbmZvSXRlbSBtZWRpYUluZm9Dcml0aWNSYXRpbmcgJHt0aGlzLmVwaXNvZGUuQ3JpdGljUmF0aW5nID49IDYwID8gJ21lZGlhSW5mb0NyaXRpY1JhdGluZ0ZyZXNoJyA6ICdtZWRpYUluZm9Dcml0aWNSYXRpbmdSb3R0ZW4nfVwiPlxuICAgICAgICAgICAgICAgICAgICAke3RoaXMuZXBpc29kZS5Dcml0aWNSYXRpbmd9XG4gICAgICAgICAgICAgICAgPC9kaXY+YCA6ICcnfVxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJlbmRzQXQgbWVkaWFJbmZvSXRlbVwiPiR7dGhpcy5mb3JtYXRFbmRUaW1lKHRoaXMuZXBpc29kZS5SdW5UaW1lVGlja3MsIHRoaXMuZXBpc29kZS5Vc2VyRGF0YS5QbGF5YmFja1Bvc2l0aW9uVGlja3MpfTwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIGA7XG4gICAgfVxuXG4gICAgcHVibGljIHJlbmRlcigpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIoKTtcbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSBnZXRMb2NhbGUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIG5hdmlnYXRvci5sYW5ndWFnZXNcbiAgICAgICAgICAgID8gbmF2aWdhdG9yLmxhbmd1YWdlc1swXSAvLyBAdHMtaWdub3JlIGZvciB1c2VyTGFuZ3VhZ2UgKHRoaXMgYWRkcyBzdXBwb3J0IGZvciBJRSkgVE9ETzogTW92ZSB0byBpbnRlcmZhY2VcbiAgICAgICAgICAgIDogKG5hdmlnYXRvci5sYW5ndWFnZSB8fCBuYXZpZ2F0b3IudXNlckxhbmd1YWdlKTtcbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSBmb3JtYXRSdW5UaW1lKHRpY2tzOiBudW1iZXIpOiBzdHJpbmcge1xuICAgICAgICAvLyBmb3JtYXQgdGhlIHRpY2tzIHRvIGEgc3RyaW5nIHdpdGggbWludXRlcyBhbmQgaG91cnNcbiAgICAgICAgdGlja3MgLz0gMTAwMDA7IC8vIGNvbnZlcnQgZnJvbSBtaWNyb3NlY29uZHMgdG8gbWlsbGlzZWNvbmRzXG4gICAgICAgIGxldCBob3VyczogbnVtYmVyID0gTWF0aC5mbG9vcigodGlja3MgLyAxMDAwIC8gMzYwMCkgJSAyNCk7XG4gICAgICAgIGxldCBtaW51dGVzOiBudW1iZXIgPSBNYXRoLmZsb29yKCh0aWNrcyAvIDEwMDAgLyA2MCkgJSA2MCk7XG4gICAgICAgIGxldCBob3Vyc1N0cmluZzogc3RyaW5nID0gaG91cnMgPiAwID8gYCR7aG91cnN9aCBgIDogJyc7XG4gICAgICAgIHJldHVybiBgJHtob3Vyc1N0cmluZ30ke21pbnV0ZXN9bWA7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBmb3JtYXRFbmRUaW1lKHJ1bnRpbWVUaWNrczogbnVtYmVyLCBwbGF5YmFja1Bvc2l0aW9uVGlja3M6IG51bWJlcik6IHN0cmluZyB7XG4gICAgICAgIC8vIGNvbnZlcnQgZnJvbSBtaWNyb3NlY29uZHMgdG8gbWlsbGlzZWNvbmRzXG4gICAgICAgIHJ1bnRpbWVUaWNrcyAvPSAxMDAwMDtcbiAgICAgICAgcGxheWJhY2tQb3NpdGlvblRpY2tzIC89IDEwMDAwO1xuICAgICAgICBcbiAgICAgICAgbGV0IHRpY2tzOiBudW1iZXIgPSBEYXRlLm5vdygpICsgKHJ1bnRpbWVUaWNrcyk7XG4gICAgICAgIHRpY2tzIC09IChuZXcgRGF0ZSgpKS5nZXRUaW1lem9uZU9mZnNldCgpICogNjAgKiAxMDAwOyAvLyBhZGp1c3QgZm9yIHRpbWV6b25lXG4gICAgICAgIHRpY2tzIC09IHBsYXliYWNrUG9zaXRpb25UaWNrczsgLy8gc3VidHJhY3QgdGhlIHBsYXliYWNrIHBvc2l0aW9uXG4gICAgICAgIFxuICAgICAgICBsZXQgaG91cnM6IHN0cmluZyA9IHRoaXMuemVyb1BhZChNYXRoLmZsb29yKCh0aWNrcyAvIDEwMDAgLyAzNjAwKSAlIDI0KSk7XG4gICAgICAgIGxldCBtaW51dGVzOiBzdHJpbmcgPSB0aGlzLnplcm9QYWQoTWF0aC5mbG9vcigodGlja3MgLyAxMDAwIC8gNjApICUgNjApKTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiBgRW5kcyBhdCAke2hvdXJzfToke21pbnV0ZXN9YDtcbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSB6ZXJvUGFkKG51bTogbnVtYmVyLCBwbGFjZXM6IG51bWJlciA9IDIpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gU3RyaW5nKG51bSkucGFkU3RhcnQocGxhY2VzLCAnMCcpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7QmFzZVRlbXBsYXRlfSBmcm9tIFwiLi9CYXNlVGVtcGxhdGVcIlxuaW1wb3J0IHtGYXZvcml0ZUljb25UZW1wbGF0ZX0gZnJvbSBcIi4vUXVpY2tBY3Rpb25zL0Zhdm9yaXRlSWNvblRlbXBsYXRlXCJcbmltcG9ydCB7UGxheVN0YXRlSWNvblRlbXBsYXRlfSBmcm9tIFwiLi9RdWlja0FjdGlvbnMvUGxheVN0YXRlSWNvblRlbXBsYXRlXCJcbmltcG9ydCB7UGxheWJhY2tIYW5kbGVyfSBmcm9tIFwiLi4vU2VydmljZXMvUGxheWJhY2tIYW5kbGVyXCJcbmltcG9ydCB7RXBpc29kZURldGFpbHNUZW1wbGF0ZX0gZnJvbSBcIi4vRXBpc29kZURldGFpbHNcIlxuaW1wb3J0IHtQcm9ncmFtRGF0YVN0b3JlfSBmcm9tIFwiLi4vU2VydmljZXMvUHJvZ3JhbURhdGFTdG9yZVwiXG5pbXBvcnQge0Jhc2VJdGVtfSBmcm9tIFwiLi4vTW9kZWxzL0VwaXNvZGVcIlxuaW1wb3J0IHtJdGVtVHlwZX0gZnJvbSBcIi4uL01vZGVscy9JdGVtVHlwZVwiXG5cbmV4cG9ydCBjbGFzcyBMaXN0RWxlbWVudFRlbXBsYXRlIGV4dGVuZHMgQmFzZVRlbXBsYXRlIHtcbiAgICBwcml2YXRlIHJlYWRvbmx5IHF1aWNrQWN0aW9uQ29udGFpbmVyOiBIVE1MRWxlbWVudFxuICAgIHByaXZhdGUgcGxheVN0YXRlSWNvbjogUGxheVN0YXRlSWNvblRlbXBsYXRlXG4gICAgcHJpdmF0ZSBmYXZvcml0ZUljb246IEZhdm9yaXRlSWNvblRlbXBsYXRlXG5cbiAgICBjb25zdHJ1Y3Rvcihjb250YWluZXI6IEhUTUxFbGVtZW50LCBwb3NpdGlvbkFmdGVySW5kZXg6IG51bWJlciwgcHJpdmF0ZSBpdGVtOiBCYXNlSXRlbSwgcHJpdmF0ZSBwbGF5YmFja0hhbmRsZXI6IFBsYXliYWNrSGFuZGxlciwgcHJpdmF0ZSBwcm9ncmFtRGF0YVN0b3JlOiBQcm9ncmFtRGF0YVN0b3JlKSB7XG4gICAgICAgIHN1cGVyKGNvbnRhaW5lciwgcG9zaXRpb25BZnRlckluZGV4KVxuICAgICAgICB0aGlzLnNldEVsZW1lbnRJZChgZXBpc29kZS0ke2l0ZW0uSWR9YClcblxuICAgICAgICAvLyBjcmVhdGUgdGVtcCBxdWljayBhY3Rpb24gY29udGFpbmVyXG4gICAgICAgIHRoaXMucXVpY2tBY3Rpb25Db250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuXG4gICAgICAgIC8vIGNyZWF0ZSBxdWljayBhY3Rpb25zXG4gICAgICAgIHRoaXMucGxheVN0YXRlSWNvbiA9IG5ldyBQbGF5U3RhdGVJY29uVGVtcGxhdGUodGhpcy5xdWlja0FjdGlvbkNvbnRhaW5lciwgLTEsIHRoaXMuaXRlbSlcbiAgICAgICAgdGhpcy5mYXZvcml0ZUljb24gPSBuZXcgRmF2b3JpdGVJY29uVGVtcGxhdGUodGhpcy5xdWlja0FjdGlvbkNvbnRhaW5lciwgMCwgdGhpcy5pdGVtKVxuICAgIH1cblxuICAgIGdldFRlbXBsYXRlKCk6IHN0cmluZyB7XG4gICAgICAgIC8vIGFkZCBxdWljayBhY3Rpb25zXG4gICAgICAgIHRoaXMucGxheVN0YXRlSWNvbi5yZW5kZXIoKVxuICAgICAgICB0aGlzLmZhdm9yaXRlSWNvbi5yZW5kZXIoKVxuXG4gICAgICAgIC8vIGFkZCBlcGlzb2RlIGRldGFpbHMvaW5mb1xuICAgICAgICBjb25zdCBkZXRhaWxzQ29udGFpbmVyOiBIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgICAgIGNvbnN0IGRldGFpbHM6IEVwaXNvZGVEZXRhaWxzVGVtcGxhdGUgPSBuZXcgRXBpc29kZURldGFpbHNUZW1wbGF0ZShkZXRhaWxzQ29udGFpbmVyLCAtMSwgdGhpcy5pdGVtKVxuICAgICAgICBkZXRhaWxzLnJlbmRlcigpXG5cbiAgICAgICAgY29uc3QgYmFja2dyb3VuZEltYWdlU3R5bGU6IHN0cmluZyA9IGBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoJy4uL0l0ZW1zLyR7dGhpcy5pdGVtLklkfS9JbWFnZXMvUHJpbWFyeT90YWc9JHt0aGlzLml0ZW0uSW1hZ2VUYWdzLlByaW1hcnl9JylgXG5cbiAgICAgICAgLy8gbGFuZ3VhZ2U9SFRNTFxuICAgICAgICByZXR1cm4gYFxuICAgICAgICAgICAgIDxkaXYgaWQ9XCIke3RoaXMuZ2V0RWxlbWVudElkKCl9XCJcbiAgICAgICAgICAgICAgICAgIGNsYXNzPVwibGlzdEl0ZW0gbGlzdEl0ZW0tYnV0dG9uIGFjdGlvblNoZWV0TWVudUl0ZW0gZW1ieS1idXR0b24gcHJldmlld0xpc3RJdGVtXCJcbiAgICAgICAgICAgICAgICAgIGlzPVwiZW1ieS1idXR0b25cIlxuICAgICAgICAgICAgICAgICAgZGF0YS1pZD1cIiR7dGhpcy5pdGVtLklkfVwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwcmV2aWV3RXBpc29kZUNvbnRhaW5lciBmbGV4XCI+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJsaXN0SXRlbSBwcmV2aWV3RXBpc29kZVRpdGxlXCIgdHlwZT1cImJ1dHRvblwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgJHsoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaXRlbS5JbmRleE51bWJlciAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2dyYW1EYXRhU3RvcmUudHlwZSAhPT0gSXRlbVR5cGUuTW92aWVcbiAgICAgICAgICAgICAgICAgICAgICAgICkgPyBgPHNwYW4+JHt0aGlzLml0ZW0uSW5kZXhOdW1iZXJ9PC9zcGFuPmAgOiAnJ31cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsaXN0SXRlbUJvZHkgYWN0aW9uc2hlZXRMaXN0SXRlbUJvZHlcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImFjdGlvblNoZWV0SXRlbVRleHRcIj4ke3RoaXMuaXRlbS5OYW1lfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInByZXZpZXdRdWlja0FjdGlvbkNvbnRhaW5lciBmbGV4XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAke3RoaXMucXVpY2tBY3Rpb25Db250YWluZXIuaW5uZXJIVE1MfVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwcmV2aWV3TGlzdEl0ZW1Db250ZW50IGhpZGVcIj5cbiAgICAgICAgICAgICAgICAgICAgJHtkZXRhaWxzQ29udGFpbmVyLmlubmVySFRNTH1cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZsZXhcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjYXJkIG92ZXJmbG93QmFja2Ryb3BDYXJkIGNhcmQtaG92ZXJhYmxlIGNhcmQtd2l0aHVzZXJkYXRhIHByZXZpZXdFcGlzb2RlSW1hZ2VDYXJkXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNhcmRCb3hcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNhcmRTY2FsYWJsZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNhcmRQYWRkZXIgY2FyZFBhZGRlci1vdmVyZmxvd0JhY2tkcm9wIGxhenktaGlkZGVuLWNoaWxkcmVuXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJjYXJkSW1hZ2VJY29uIG1hdGVyaWFsLWljb25zIHR2XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwicHJldmlld0VwaXNvZGVJbWFnZUNhcmQtJHt0aGlzLml0ZW0uSWR9XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJjYXJkSW1hZ2VDb250YWluZXIgY2FyZENvbnRlbnQgaXRlbUFjdGlvbiBsYXp5IGJsdXJoYXNoZWQgbGF6eS1pbWFnZS1mYWRlaW4tZmFzdCAke3RoaXMucHJvZ3JhbURhdGFTdG9yZS5wbHVnaW5TZXR0aW5ncy5CbHVyVGh1bWJuYWlsID8gJ2JsdXInIDogJyd9XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS1hY3Rpb249XCJsaW5rXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9XCIke2JhY2tncm91bmRJbWFnZVN0eWxlfVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke3RoaXMuaXRlbS5Vc2VyRGF0YS5QbGF5ZWRQZXJjZW50YWdlID8gXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYDxkaXYgY2xhc3M9XCJpbm5lckNhcmRGb290ZXIgZnVsbElubmVyQ2FyZEZvb3RlciBpbm5lckNhcmRGb290ZXJDbGVhciBpdGVtUHJvZ3Jlc3NCYXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIml0ZW1Qcm9ncmVzc0JhckZvcmVncm91bmRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9XCJ3aWR0aDoke3RoaXMuaXRlbS5Vc2VyRGF0YS5QbGF5ZWRQZXJjZW50YWdlfSU7XCI+ICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+YCA6ICcnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke3RoaXMuaXRlbS5JZCAhPT0gdGhpcy5wcm9ncmFtRGF0YVN0b3JlLmFjdGl2ZU1lZGlhU291cmNlSWQgPyBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgPGRpdiBjbGFzcz1cImNhcmRPdmVybGF5Q29udGFpbmVyIGl0ZW1BY3Rpb25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS1hY3Rpb249XCJsaW5rXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJzdGFydC1lcGlzb2RlLSR7dGhpcy5pdGVtLklkfVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXM9XCJwYXBlci1pY29uLWJ1dHRvbi1saWdodFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJjYXJkT3ZlcmxheUJ1dHRvbiBjYXJkT3ZlcmxheUJ1dHRvbi1ob3ZlciBpdGVtQWN0aW9uIHBhcGVyLWljb24tYnV0dG9uLWxpZ2h0IGNhcmRPdmVybGF5RmFiLXByaW1hcnlcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEtYWN0aW9uPVwicmVzdW1lXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cIm1hdGVyaWFsLWljb25zIGNhcmRPdmVybGF5QnV0dG9uSWNvbiBjYXJkT3ZlcmxheUJ1dHRvbkljb24taG92ZXIgcGxheV9hcnJvd1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJpYS1oaWRkZW49XCJ0cnVlXCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5gIDogJydcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicHJldmlld0VwaXNvZGVEZXNjcmlwdGlvbiAke3RoaXMucHJvZ3JhbURhdGFTdG9yZS5wbHVnaW5TZXR0aW5ncy5CbHVyRGVzY3JpcHRpb24gPyAnYmx1cicgOiAnJ31cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAke3RoaXMuaXRlbS5EZXNjcmlwdGlvbiA/PyAnbG9hZGluZy4uLid9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIGBcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVuZGVyKGNsaWNrSGFuZGxlcjogRnVuY3Rpb24pOiB2b2lkIHtcbiAgICAgICAgY29uc3QgcmVuZGVyZWRFbGVtZW50OiBIVE1MRWxlbWVudCA9IHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKClcbiAgICAgICAgcmVuZGVyZWRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IGNsaWNrSGFuZGxlcihlKSlcblxuICAgICAgICBpZiAodGhpcy5pdGVtLklkICE9PSB0aGlzLnByb2dyYW1EYXRhU3RvcmUuYWN0aXZlTWVkaWFTb3VyY2VJZCkge1xuICAgICAgICAgICAgLy8gYWRkIGV2ZW50IGhhbmRsZXIgdG8gc3RhcnQgdGhlIHBsYXliYWNrIG9mIHRoaXMgZXBpc29kZVxuICAgICAgICAgICAgY29uc3QgZXBpc29kZUltYWdlQ2FyZDogSFRNTEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgc3RhcnQtZXBpc29kZS0ke3RoaXMuaXRlbS5JZH1gKVxuICAgICAgICAgICAgZXBpc29kZUltYWdlQ2FyZC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHRoaXMucGxheWJhY2tIYW5kbGVyLnBsYXkodGhpcy5pdGVtLklkLCB0aGlzLml0ZW0uVXNlckRhdGEuUGxheWJhY2tQb3NpdGlvblRpY2tzKSlcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCB7QmFzZVRlbXBsYXRlfSBmcm9tIFwiLi9CYXNlVGVtcGxhdGVcIjtcbmltcG9ydCB7UHJvZ3JhbURhdGFTdG9yZX0gZnJvbSBcIi4uL1NlcnZpY2VzL1Byb2dyYW1EYXRhU3RvcmVcIjtcbmltcG9ydCB7SXRlbVR5cGV9IGZyb20gXCIuLi9Nb2RlbHMvSXRlbVR5cGVcIjtcblxuZXhwb3J0IGNsYXNzIFBvcHVwVGl0bGVUZW1wbGF0ZSBleHRlbmRzIEJhc2VUZW1wbGF0ZSB7XG4gICAgY29uc3RydWN0b3IoY29udGFpbmVyOiBIVE1MRWxlbWVudCwgcG9zaXRpb25BZnRlckluZGV4OiBudW1iZXIsIHByaXZhdGUgcHJvZ3JhbURhdGFTdG9yZTogUHJvZ3JhbURhdGFTdG9yZSkge1xuICAgICAgICBzdXBlcihjb250YWluZXIsIHBvc2l0aW9uQWZ0ZXJJbmRleClcbiAgICAgICAgdGhpcy5zZXRFbGVtZW50SWQoJ3BvcHVwVGl0bGVDb250YWluZXInKVxuICAgIH1cblxuICAgIGdldFRlbXBsYXRlKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBgXG4gICAgICAgICAgICA8ZGl2IGlkPVwiJHt0aGlzLmdldEVsZW1lbnRJZCgpfVwiIGNsYXNzPVwiYWN0aW9uU2hlZXRUaXRsZSBsaXN0SXRlbSBwcmV2aWV3UG9wdXBUaXRsZVwiPlxuICAgICAgICAgICAgICAgICR7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvZ3JhbURhdGFTdG9yZS50eXBlID09PSBJdGVtVHlwZS5TZXJpZXMgJiYgdGhpcy5wcm9ncmFtRGF0YVN0b3JlLnNlYXNvbnMubGVuZ3RoID4gMSA/IFxuICAgICAgICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJhY3Rpb25zaGVldE1lbnVJdGVtSWNvbiBsaXN0SXRlbUljb24gbGlzdEl0ZW1JY29uLXRyYW5zcGFyZW50IG1hdGVyaWFsLWljb25zIGtleWJvYXJkX2JhY2tzcGFjZVwiPjwvc3Bhbj4nIDogXG4gICAgICAgICAgICAgICAgICAgICcnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIDxoMSBjbGFzcz1cImFjdGlvblNoZWV0VGl0bGVcIj48L2gxPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIGBcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVuZGVyKGNsaWNrSGFuZGxlcjogRnVuY3Rpb24pIHtcbiAgICAgICAgY29uc3QgcmVuZGVyZWRFbGVtZW50ID0gdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIoKTtcbiAgICAgICAgXG4gICAgICAgIHN3aXRjaCAodGhpcy5wcm9ncmFtRGF0YVN0b3JlLnR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgSXRlbVR5cGUuU2VyaWVzOlxuICAgICAgICAgICAgICAgIHJlbmRlcmVkRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiBjbGlja0hhbmRsZXIoZSkpXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgSXRlbVR5cGUuQm94U2V0OlxuICAgICAgICAgICAgY2FzZSBJdGVtVHlwZS5Gb2xkZXI6XG4gICAgICAgICAgICAgICAgcmVuZGVyZWRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IGUuc3RvcFByb3BhZ2F0aW9uKCkpXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBwdWJsaWMgc2V0VGV4dCh0ZXh0OiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5nZXRFbGVtZW50KCkucXVlcnlTZWxlY3RvcignaDEnKS5pbm5lclRleHQgPSB0ZXh0XG4gICAgfVxuICAgIFxuICAgIHB1YmxpYyBzZXRWaXNpYmxlKGlzVmlzaWJsZTogYm9vbGVhbikge1xuICAgICAgICBjb25zdCByZW5kZXJlZEVsZW1lbnQgPSB0aGlzLmdldEVsZW1lbnQoKVxuICAgICAgICBpZiAoaXNWaXNpYmxlKSB7XG4gICAgICAgICAgICByZW5kZXJlZEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpO1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJlbmRlcmVkRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdoaWRlJyk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHtCYXNlVGVtcGxhdGV9IGZyb20gXCIuL0Jhc2VUZW1wbGF0ZVwiO1xuXG5leHBvcnQgY2xhc3MgUHJldmlld0J1dHRvblRlbXBsYXRlIGV4dGVuZHMgQmFzZVRlbXBsYXRlIHtcbiAgICBjb25zdHJ1Y3Rvcihjb250YWluZXI6IEhUTUxFbGVtZW50LCBwb3NpdGlvbkFmdGVySW5kZXg6IG51bWJlcikge1xuICAgICAgICBzdXBlcihjb250YWluZXIsIHBvc2l0aW9uQWZ0ZXJJbmRleCk7XG4gICAgICAgIHRoaXMuc2V0RWxlbWVudElkKCdwb3B1cFByZXZpZXdCdXR0b24nKTtcbiAgICB9XG5cbiAgICBnZXRUZW1wbGF0ZSgpOiBzdHJpbmcge1xuICAgICAgICAvLyBsYW5ndWFnZT1IVE1MXG4gICAgICAgIHJldHVybiBgXG4gICAgICAgICAgICA8YnV0dG9uIGlkPVwiJHt0aGlzLmdldEVsZW1lbnRJZCgpfVwiIGNsYXNzPVwiYXV0b1NpemUgcGFwZXItaWNvbi1idXR0b24tbGlnaHRcIiBpcz1cInBhcGVyLWljb24tYnV0dG9uLWxpZ2h0XCJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU9XCJFcGlzb2RlIFByZXZpZXdcIj5cbiAgICAgICAgICAgICAgICA8IS0tIENyZWF0ZWQgd2l0aCBJbmtzY2FwZSAoaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvKSAtLT5cbiAgICAgICAgICAgICAgICA8c3ZnIGlkPVwic3ZnMVwiXG4gICAgICAgICAgICAgICAgICAgICB3aWR0aD1cIjI0XCJcbiAgICAgICAgICAgICAgICAgICAgIGhlaWdodD1cIjI0XCJcbiAgICAgICAgICAgICAgICAgICAgIHZpZXdCb3g9XCIwIDAgNiA0XCJcbiAgICAgICAgICAgICAgICAgICAgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj5cbiAgICAgICAgICAgICAgICAgICAgPGcgaWQ9XCJsYXllcjFcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxyZWN0IGlkPVwicmVjdDQ3XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPVwiZmlsbDpub25lO2ZpbGwtb3BhY2l0eToxO2ZpbGwtcnVsZTpub256ZXJvO3N0cm9rZTpjdXJyZW50Q29sb3I7c3Ryb2tlLXdpZHRoOjAuNDc2NDY3O3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtZGFzaGFycmF5Om5vbmU7cGFpbnQtb3JkZXI6c3Ryb2tlIG1hcmtlcnMgZmlsbFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aD1cIjMuNzU2ODY3NlwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ9XCIyLjE2OTM2NjFcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeD1cIjAuMjM4MjMzMDNcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeT1cIjEuODI1NzMzNVwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGlkPVwicmVjdDQ3LTVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9XCJmaWxsOm5vbmU7c3Ryb2tlOmN1cnJlbnRDb2xvcjtzdHJva2Utd2lkdGg6MC40NzY1OTc7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtwYWludC1vcmRlcjpzdHJva2UgbWFya2VycyBmaWxsXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGQ9XCJtIDEuMDI5MTQzNywxLjAzMjA0ODIgaCAzLjc1Mjg5OTEgdiAyLjE3MjIzOTQgbCAwLjAwNjc2LC0yLjE1NzI1OTUgelwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGlkPVwicmVjdDQ3LThcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9XCJmaWxsOm5vbmU7c3Ryb2tlOmN1cnJlbnRDb2xvcjtzdHJva2Utd2lkdGg6MC40Nzc0Mjc7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtwYWludC1vcmRlcjpzdHJva2UgbWFya2VycyBmaWxsXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGQ9XCJtIDEuODIyODYxNCwwLjIzODcxMzM2IGggMy43NTkyNTkgViAyLjQxMDEyMTEgbCAtMC4wMDY4LC0yLjE3MTQwNzc0IHpcIi8+XG4gICAgICAgICAgICAgICAgICAgIDwvZz5cbiAgICAgICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICBgO1xuICAgIH1cblxuICAgIHB1YmxpYyByZW5kZXIoY2xpY2tIYW5kbGVyOiBGdW5jdGlvbik6IHZvaWQge1xuICAgICAgICBjb25zdCByZW5kZXJlZEVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIoKTtcbiAgICAgICAgcmVuZGVyZWRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCk6IGFueSA9PiBjbGlja0hhbmRsZXIoKSk7XG4gICAgfVxufSIsImltcG9ydCB7QmFzZVRlbXBsYXRlfSBmcm9tIFwiLi4vQmFzZVRlbXBsYXRlXCJcbmltcG9ydCB7QmFzZUl0ZW19IGZyb20gXCIuLi8uLi9Nb2RlbHMvRXBpc29kZVwiXG5cbmV4cG9ydCBjbGFzcyBGYXZvcml0ZUljb25UZW1wbGF0ZSBleHRlbmRzIEJhc2VUZW1wbGF0ZSB7XG4gICAgY29uc3RydWN0b3IoY29udGFpbmVyOiBIVE1MRWxlbWVudCwgcG9zaXRpb25BZnRlckluZGV4OiBudW1iZXIsIHByaXZhdGUgZXBpc29kZTogQmFzZUl0ZW0pIHtcbiAgICAgICAgc3VwZXIoY29udGFpbmVyLCBwb3NpdGlvbkFmdGVySW5kZXgpXG4gICAgICAgIHRoaXMuc2V0RWxlbWVudElkKCdmYXZvcml0ZUJ1dHRvbi0nICsgZXBpc29kZS5JZClcbiAgICB9XG5cbiAgICBnZXRUZW1wbGF0ZSgpOiBzdHJpbmcge1xuICAgICAgICAvLyBsYW5ndWFnZT1IVE1MXG4gICAgICAgIHJldHVybiBgXG4gICAgICAgICAgICA8YnV0dG9uIGlkPVwiJHt0aGlzLmdldEVsZW1lbnRJZCgpfVwiXG4gICAgICAgICAgICAgICAgICAgIGlzPVwiZW1ieS1yYXRpbmdidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJpdGVtQWN0aW9uIHBhcGVyLWljb24tYnV0dG9uLWxpZ2h0IGVtYnktYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS1hY3Rpb249XCJub25lXCJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS1pZD1cIiR7dGhpcy5lcGlzb2RlPy5JZCA/PyAnJ31cIlxuICAgICAgICAgICAgICAgICAgICBkYXRhLXNlcnZlcmlkPVwiJHt0aGlzLmVwaXNvZGU/LlNlcnZlcklkID8/ICcnfVwiXG4gICAgICAgICAgICAgICAgICAgIGRhdGEtaXRlbXR5cGU9XCJFcGlzb2RlXCJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS1saWtlcz1cIlwiXG4gICAgICAgICAgICAgICAgICAgIGRhdGEtaXNmYXZvcml0ZT1cIiR7dGhpcy5lcGlzb2RlPy5Vc2VyRGF0YT8uSXNGYXZvcml0ZSA/PyBmYWxzZX1cIlxuICAgICAgICAgICAgICAgICAgICB0aXRsZT1cIkFkZCB0byBmYXZvcml0ZXNcIj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cIm1hdGVyaWFsLWljb25zIGZhdm9yaXRlXCI+PC9zcGFuPlxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIGBcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVuZGVyKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcigpXG4gICAgfVxufVxuIiwiaW1wb3J0IHtCYXNlVGVtcGxhdGV9IGZyb20gXCIuLi9CYXNlVGVtcGxhdGVcIlxuaW1wb3J0IHtCYXNlSXRlbX0gZnJvbSBcIi4uLy4uL01vZGVscy9FcGlzb2RlXCJcblxuZXhwb3J0IGNsYXNzIFBsYXlTdGF0ZUljb25UZW1wbGF0ZSBleHRlbmRzIEJhc2VUZW1wbGF0ZSB7XG4gICAgY29uc3RydWN0b3IoY29udGFpbmVyOiBIVE1MRWxlbWVudCwgcG9zaXRpb25BZnRlckluZGV4OiBudW1iZXIsIHByaXZhdGUgZXBpc29kZTogQmFzZUl0ZW0pIHtcbiAgICAgICAgc3VwZXIoY29udGFpbmVyLCBwb3NpdGlvbkFmdGVySW5kZXgpXG4gICAgICAgIHRoaXMuc2V0RWxlbWVudElkKCdwbGF5U3RhdGVCdXR0b24tJyArIHRoaXMuZXBpc29kZS5JZClcbiAgICB9XG5cbiAgICBnZXRUZW1wbGF0ZSgpOiBzdHJpbmcge1xuICAgICAgICAvLyBsYW5ndWFnZT1IVE1MXG4gICAgICAgIHJldHVybiBgXG4gICAgICAgICAgICA8YnV0dG9uIGlkPVwiJHt0aGlzLmdldEVsZW1lbnRJZCgpfVwiXG4gICAgICAgICAgICAgICAgICAgIGlzPVwiZW1ieS1wbGF5c3RhdGVidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS1hY3Rpb249XCJub25lXCJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJpdGVtQWN0aW9uIHBhcGVyLWljb24tYnV0dG9uLWxpZ2h0IGVtYnktYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS1pZD1cIiR7dGhpcy5lcGlzb2RlPy5JZCA/PyAnJ31cIiBcbiAgICAgICAgICAgICAgICAgICAgZGF0YS1zZXJ2ZXJpZD1cIiR7dGhpcy5lcGlzb2RlPy5TZXJ2ZXJJZCA/PyAnJ31cIlxuICAgICAgICAgICAgICAgICAgICBkYXRhLWl0ZW10eXBlPVwiRXBpc29kZVwiXG4gICAgICAgICAgICAgICAgICAgIGRhdGEtbGlrZXM9XCJcIlxuICAgICAgICAgICAgICAgICAgICBkYXRhLXBsYXllZD1cIiR7dGhpcy5lcGlzb2RlPy5Vc2VyRGF0YT8uUGxheWVkID8/IGZhbHNlfVwiXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlPVwiTWFyayBwbGF5ZWRcIj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cIm1hdGVyaWFsLWljb25zIGNoZWNrIHBsYXlzdGF0ZWJ1dHRvbi1pY29uLSR7dGhpcy5lcGlzb2RlPy5Vc2VyRGF0YT8uUGxheWVkID8gXCJwbGF5ZWRcIiA6IFwidW5wbGF5ZWRcIn1cIj48L3NwYW4+XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgYFxuICAgIH1cblxuICAgIHB1YmxpYyByZW5kZXIoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKClcbiAgICB9XG59XG4iLCJpbXBvcnQge0Jhc2VUZW1wbGF0ZX0gZnJvbSBcIi4vQmFzZVRlbXBsYXRlXCI7XG5pbXBvcnQge1NlYXNvbn0gZnJvbSBcIi4uL01vZGVscy9TZWFzb25cIjtcblxuZXhwb3J0IGNsYXNzIFNlYXNvbkxpc3RFbGVtZW50VGVtcGxhdGUgZXh0ZW5kcyBCYXNlVGVtcGxhdGUge1xuICAgIGNvbnN0cnVjdG9yKGNvbnRhaW5lcjogSFRNTEVsZW1lbnQsIHBvc2l0aW9uQWZ0ZXJJbmRleDogbnVtYmVyLCBwcml2YXRlIHNlYXNvbjogU2Vhc29uLCBwcml2YXRlIGlzQ3VycmVudFNlYXNvbjogYm9vbGVhbikge1xuICAgICAgICBzdXBlcihjb250YWluZXIsIHBvc2l0aW9uQWZ0ZXJJbmRleCk7XG4gICAgICAgIHRoaXMuc2V0RWxlbWVudElkKGBlcGlzb2RlLSR7c2Vhc29uLnNlYXNvbklkfWApO1xuICAgIH1cblxuICAgIGdldFRlbXBsYXRlKCk6IHN0cmluZyB7XG4gICAgICAgIC8vIGxhbmd1YWdlPUhUTUxcbiAgICAgICAgcmV0dXJuIGBcbiAgICAgICAgICAgIDxkaXYgaWQ9XCIke3RoaXMuZ2V0RWxlbWVudElkKCl9XCJcbiAgICAgICAgICAgICAgICAgY2xhc3M9XCJsaXN0SXRlbSBsaXN0SXRlbS1idXR0b24gYWN0aW9uU2hlZXRNZW51SXRlbSBlbWJ5LWJ1dHRvbiBwcmV2aWV3TGlzdEl0ZW1cIlxuICAgICAgICAgICAgICAgICBpcz1cImVtYnktYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgZGF0YS1pZD1cIiR7dGhpcy5zZWFzb24uc2Vhc29uSWR9XCI+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImxpc3RJdGVtIHByZXZpZXdFcGlzb2RlVGl0bGVcIiB0eXBlPVwiYnV0dG9uXCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiJHt0aGlzLmlzQ3VycmVudFNlYXNvbiA/IFwibWF0ZXJpYWwtaWNvbnMgY2hlY2tcIiA6IFwiXCJ9XCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibGlzdEl0ZW1Cb2R5IGFjdGlvbnNoZWV0TGlzdEl0ZW1Cb2R5XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImFjdGlvblNoZWV0SXRlbVRleHRcIj4ke3RoaXMuc2Vhc29uLnNlYXNvbk5hbWV9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICBgO1xuICAgIH1cblxuICAgIHB1YmxpYyByZW5kZXIoY2xpY2tIYW5kbGVyOiBGdW5jdGlvbik6IHZvaWQge1xuICAgICAgICBjb25zdCByZW5kZXJlZEVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIoKTtcbiAgICAgICAgcmVuZGVyZWRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGU6IE1vdXNlRXZlbnQpOiB2b2lkID0+IGNsaWNrSGFuZGxlcihlKSk7XG4gICAgfVxufSIsImV4cG9ydCBlbnVtIEVuZHBvaW50cyB7XG4gICAgQkFTRSA9IFwiSW5QbGF5ZXJQcmV2aWV3XCIsXG4gICAgRVBJU09ERV9JTkZPID0gXCIvVXNlcnMve3VzZXJJZH0vSXRlbXMve2VwaXNvZGVJZH1cIixcbiAgICBFUElTT0RFX0RFU0NSSVBUSU9OID0gXCIvSXRlbXMve2VwaXNvZGVJZH1cIixcbiAgICBQTEFZX01FRElBID0gXCIvVXNlcnMve3VzZXJJZH0ve2RldmljZUlkfS9JdGVtcy97ZXBpc29kZUlkfS9QbGF5L3t0aWNrc31cIixcbiAgICBTRVJWRVJfU0VUVElOR1MgPSBcIi9TZXJ2ZXJTZXR0aW5nc1wiXG59IiwiaW1wb3J0IHtMaXN0RWxlbWVudFRlbXBsYXRlfSBmcm9tIFwiLi9Db21wb25lbnRzL0xpc3RFbGVtZW50VGVtcGxhdGVcIjtcbmltcG9ydCB7QmFzZUl0ZW19IGZyb20gXCIuL01vZGVscy9FcGlzb2RlXCI7XG5pbXBvcnQge1Byb2dyYW1EYXRhU3RvcmV9IGZyb20gXCIuL1NlcnZpY2VzL1Byb2dyYW1EYXRhU3RvcmVcIjtcbmltcG9ydCB7U2Vhc29ufSBmcm9tIFwiLi9Nb2RlbHMvU2Vhc29uXCI7XG5pbXBvcnQge1NlYXNvbkxpc3RFbGVtZW50VGVtcGxhdGV9IGZyb20gXCIuL0NvbXBvbmVudHMvU2Vhc29uTGlzdEVsZW1lbnRUZW1wbGF0ZVwiO1xuaW1wb3J0IHtQb3B1cFRpdGxlVGVtcGxhdGV9IGZyb20gXCIuL0NvbXBvbmVudHMvUG9wdXBUaXRsZVRlbXBsYXRlXCI7XG5pbXBvcnQge1BsYXliYWNrSGFuZGxlcn0gZnJvbSBcIi4vU2VydmljZXMvUGxheWJhY2tIYW5kbGVyXCI7XG5pbXBvcnQge0VuZHBvaW50c30gZnJvbSBcIi4vRW5kcG9pbnRzXCI7XG5cbmV4cG9ydCBjbGFzcyBMaXN0RWxlbWVudEZhY3Rvcnkge1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcGxheWJhY2tIYW5kbGVyOiBQbGF5YmFja0hhbmRsZXIsIHByaXZhdGUgcHJvZ3JhbURhdGFTdG9yZTogUHJvZ3JhbURhdGFTdG9yZSkgeyB9XG4gICAgXG4gICAgcHVibGljIGFzeW5jIGNyZWF0ZUVwaXNvZGVFbGVtZW50cyhlcGlzb2RlczogQmFzZUl0ZW1bXSwgcGFyZW50RGl2OiBIVE1MRWxlbWVudCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBjb25zdCBkaXNwbGF5RXBpc29kZXMgPSB0aGlzLnJlc29sdmVEaXNwbGF5RXBpc29kZXMoZXBpc29kZXMpXG4gICAgICAgIFxuICAgICAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgZGlzcGxheUVwaXNvZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBlcGlzb2RlID0gZGlzcGxheUVwaXNvZGVzW2ldXG4gICAgICAgICAgICBjb25zdCBlcGlzb2RlTGlzdEVsZW1lbnRUZW1wbGF0ZSA9IG5ldyBMaXN0RWxlbWVudFRlbXBsYXRlKHBhcmVudERpdiwgaSwgZXBpc29kZSwgdGhpcy5wbGF5YmFja0hhbmRsZXIsIHRoaXMucHJvZ3JhbURhdGFTdG9yZSk7XG4gICAgICAgICAgICBlcGlzb2RlTGlzdEVsZW1lbnRUZW1wbGF0ZS5yZW5kZXIoYXN5bmMgKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIGhpZGUgZXBpc29kZSBjb250ZW50IGZvciBhbGwgZXhpc3RpbmcgZXBpc29kZXMgaW4gdGhlIHByZXZpZXcgbGlzdFxuICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIucHJldmlld0xpc3RJdGVtQ29udGVudFwiKS5mb3JFYWNoKChlbGVtZW50OiBFbGVtZW50KTogdm9pZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaGlkZScpO1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkTGlzdEl0ZW0nKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBjb25zdCBlcGlzb2RlQ29udGFpbmVyOiBFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEtaWQ9XCIke2VwaXNvZGUuSWR9XCJdYCkucXVlcnlTZWxlY3RvcignLnByZXZpZXdMaXN0SXRlbUNvbnRlbnQnKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBsb2FkIGVwaXNvZGUgZGVzY3JpcHRpb25cbiAgICAgICAgICAgICAgICBpZiAoIWVwaXNvZGUuRGVzY3JpcHRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdXJsID0gQXBpQ2xpZW50LmdldFVybChgLyR7RW5kcG9pbnRzLkJBU0V9JHtFbmRwb2ludHMuRVBJU09ERV9ERVNDUklQVElPTn1gXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgne2VwaXNvZGVJZH0nLCBlcGlzb2RlLklkKSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IEFwaUNsaWVudC5hamF4KHsgdHlwZTogJ0dFVCcsIHVybCwgZGF0YVR5cGU6ICdqc29uJyB9KVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXdEZXNjcmlwdGlvbjogc3RyaW5nID0gcmVzdWx0Py5EZXNjcmlwdGlvblxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ncmFtRGF0YVN0b3JlLnVwZGF0ZUl0ZW0oe1xuICAgICAgICAgICAgICAgICAgICAgICAgLi4uZXBpc29kZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIERlc2NyaXB0aW9uOiBuZXdEZXNjcmlwdGlvblxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICBlcGlzb2RlQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5wcmV2aWV3RXBpc29kZURlc2NyaXB0aW9uJykudGV4dENvbnRlbnQgPSBuZXdEZXNjcmlwdGlvblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBzaG93IGVwaXNvZGUgY29udGVudCBmb3IgdGhlIHNlbGVjdGVkIGVwaXNvZGVcbiAgICAgICAgICAgICAgICBlcGlzb2RlQ29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKTtcbiAgICAgICAgICAgICAgICBlcGlzb2RlQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkTGlzdEl0ZW0nKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBzY3JvbGwgdG8gdGhlIHNlbGVjdGVkIGVwaXNvZGVcbiAgICAgICAgICAgICAgICBlcGlzb2RlQ29udGFpbmVyLnBhcmVudEVsZW1lbnQuc2Nyb2xsSW50b1ZpZXcoeyBibG9jazogXCJzdGFydFwiIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmIChlcGlzb2RlLklkID09PSB0aGlzLnByb2dyYW1EYXRhU3RvcmUuYWN0aXZlTWVkaWFTb3VyY2VJZCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGVwaXNvZGVOb2RlOiBFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEtaWQ9XCIke2VwaXNvZGUuSWR9XCJdYCkucXVlcnlTZWxlY3RvcignLnByZXZpZXdMaXN0SXRlbUNvbnRlbnQnKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBwcmVsb2FkIGVwaXNvZGUgZGVzY3JpcHRpb24gZm9yIHRoZSBjdXJyZW50bHkgcGxheWluZyBlcGlzb2RlXG4gICAgICAgICAgICAgICAgaWYgKCFlcGlzb2RlLkRlc2NyaXB0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHVybCA9IEFwaUNsaWVudC5nZXRVcmwoYC8ke0VuZHBvaW50cy5CQVNFfSR7RW5kcG9pbnRzLkVQSVNPREVfREVTQ1JJUFRJT059YFxuICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoJ3tlcGlzb2RlSWR9JywgZXBpc29kZS5JZCkpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBBcGlDbGllbnQuYWpheCh7IHR5cGU6ICdHRVQnLCB1cmwsIGRhdGFUeXBlOiAnanNvbicgfSlcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV3RGVzY3JpcHRpb246IHN0cmluZyA9IHJlc3VsdD8uRGVzY3JpcHRpb25cblxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2dyYW1EYXRhU3RvcmUudXBkYXRlSXRlbSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAuLi5lcGlzb2RlLFxuICAgICAgICAgICAgICAgICAgICAgICAgRGVzY3JpcHRpb246IG5ld0Rlc2NyaXB0aW9uXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIGVwaXNvZGVOb2RlLnF1ZXJ5U2VsZWN0b3IoJy5wcmV2aWV3RXBpc29kZURlc2NyaXB0aW9uJykudGV4dENvbnRlbnQgPSBuZXdEZXNjcmlwdGlvblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBlcGlzb2RlTm9kZS5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJyk7XG4gICAgICAgICAgICAgICAgZXBpc29kZU5vZGUuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWRMaXN0SXRlbScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIHB1YmxpYyBjcmVhdGVTZWFzb25FbGVtZW50cyhzZWFzb25zOiBTZWFzb25bXSwgcGFyZW50RGl2OiBIVE1MRWxlbWVudCwgY3VycmVudFNlYXNvbkluZGV4OiBudW1iZXIsIHRpdGxlQ29udGFpbmVyOiBQb3B1cFRpdGxlVGVtcGxhdGUpOiB2b2lkIHtcbiAgICAgICAgc2Vhc29ucy5zb3J0KChhLCBiKSA9PiBhLkluZGV4TnVtYmVyIC0gYi5JbmRleE51bWJlcilcbiAgICAgICAgXG4gICAgICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCBzZWFzb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBzZWFzb24gPSBuZXcgU2Vhc29uTGlzdEVsZW1lbnRUZW1wbGF0ZShwYXJlbnREaXYsIGksIHNlYXNvbnNbaV0sIHNlYXNvbnNbaV0uSW5kZXhOdW1iZXIgPT09IGN1cnJlbnRTZWFzb25JbmRleCk7XG4gICAgICAgICAgICBzZWFzb24ucmVuZGVyKChlOiBNb3VzZUV2ZW50KTogdm9pZCA9PiB7XG4gICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB0aXRsZUNvbnRhaW5lci5zZXRUZXh0KHNlYXNvbnNbaV0uc2Vhc29uTmFtZSk7XG4gICAgICAgICAgICAgICAgdGl0bGVDb250YWluZXIuc2V0VmlzaWJsZSh0cnVlKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBwYXJlbnREaXYuaW5uZXJIVE1MID0gXCJcIjsgLy8gcmVtb3ZlIG9sZCBjb250ZW50XG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVFcGlzb2RlRWxlbWVudHMoc2Vhc29uc1tpXS5lcGlzb2RlcywgcGFyZW50RGl2KS50aGVuKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgcmVzb2x2ZURpc3BsYXlFcGlzb2RlcyhlcGlzb2RlczogQmFzZUl0ZW1bXSk6IEJhc2VJdGVtW10ge1xuICAgICAgICBjb25zdCBxdWV1ZUlkczogc3RyaW5nW10gPSB0aGlzLnByb2dyYW1EYXRhU3RvcmUubm93UGxheWluZ1F1ZXVlSWRzID8/IFtdXG4gICAgICAgIGlmICh0aGlzLnByb2dyYW1EYXRhU3RvcmUuaXNTaHVmZmxlQWN0aXZlKCkgJiYgcXVldWVJZHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29uc3QgZXBpc29kZU1hcCA9IG5ldyBNYXA8c3RyaW5nLCBCYXNlSXRlbT4oZXBpc29kZXMubWFwKChlcGlzb2RlOiBCYXNlSXRlbSk6IFtzdHJpbmcsIEJhc2VJdGVtXSA9PiBbZXBpc29kZS5JZCwgZXBpc29kZV0pKVxuICAgICAgICAgICAgcmV0dXJuIHF1ZXVlSWRzXG4gICAgICAgICAgICAgICAgLm1hcCgoaWQ6IHN0cmluZyk6IEJhc2VJdGVtID0+IGVwaXNvZGVNYXAuZ2V0KGlkKSlcbiAgICAgICAgICAgICAgICAuZmlsdGVyKChlcGlzb2RlKTogZXBpc29kZSBpcyBCYXNlSXRlbSA9PiBCb29sZWFuKGVwaXNvZGUpKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFsuLi5lcGlzb2Rlc10uc29ydCgoYSwgYikgPT4ge1xuICAgICAgICAgICAgY29uc3QgcGFyZW50Q29tcGFyZTogbnVtYmVyID0gKGEuUGFyZW50SW5kZXhOdW1iZXIgPz8gMCkgLSAoYi5QYXJlbnRJbmRleE51bWJlciA/PyAwKVxuICAgICAgICAgICAgaWYgKHBhcmVudENvbXBhcmUgIT09IDApXG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcmVudENvbXBhcmVcbiAgICAgICAgICAgIHJldHVybiAoYS5JbmRleE51bWJlciA/PyAwKSAtIChiLkluZGV4TnVtYmVyID8/IDApXG4gICAgICAgIH0pXG4gICAgfVxufVxuIiwiZXhwb3J0IGVudW0gSXRlbVR5cGUge1xuICAgIEFnZ3JlZ2F0ZUZvbGRlcixcbiAgICBBdWRpbyxcbiAgICBBdWRpb0Jvb2ssXG4gICAgQmFzZVBsdWdpbkZvbGRlcixcbiAgICBCb29rLFxuICAgIEJveFNldCxcbiAgICBDaGFubmVsLFxuICAgIENoYW5uZWxGb2xkZXJJdGVtLFxuICAgIENvbGxlY3Rpb25Gb2xkZXIsXG4gICAgRXBpc29kZSxcbiAgICBGb2xkZXIsXG4gICAgR2VucmUsXG4gICAgTWFudWFsUGxheWxpc3RzRm9sZGVyLFxuICAgIE1vdmllLFxuICAgIExpdmVUdkNoYW5uZWwsXG4gICAgTGl2ZVR2UHJvZ3JhbSxcbiAgICBNdXNpY0FsYnVtLFxuICAgIE11c2ljQXJ0aXN0LFxuICAgIE11c2ljR2VucmUsXG4gICAgTXVzaWNWaWRlbyxcbiAgICBQZXJzb24sXG4gICAgUGhvdG8sXG4gICAgUGhvdG9BbGJ1bSxcbiAgICBQbGF5bGlzdCxcbiAgICBQbGF5bGlzdHNGb2xkZXIsXG4gICAgUHJvZ3JhbSxcbiAgICBSZWNvcmRpbmcsXG4gICAgU2Vhc29uLFxuICAgIFNlcmllcyxcbiAgICBTdHVkaW8sXG4gICAgVHJhaWxlcixcbiAgICBUdkNoYW5uZWwsXG4gICAgVHZQcm9ncmFtLFxuICAgIFVzZXJSb290Rm9sZGVyLFxuICAgIFVzZXJWaWV3LFxuICAgIFZpZGVvLFxuICAgIFllYXJcbn0iLCJpbXBvcnQge0Jhc2VJdGVtfSBmcm9tIFwiLi9FcGlzb2RlXCI7XG5cbmV4cG9ydCBlbnVtIFBsYXlNZXRob2Qge1xuICAgIFRyYW5zY29kZSA9IDAsXG4gICAgRGlyZWN0U3RyZWFtID0gMSxcbiAgICBEaXJlY3RQbGF5ID0gMlxufVxuXG5leHBvcnQgZW51bSBSZXBlYXRNb2RlIHtcbiAgICBSZXBlYXROb25lID0gMCxcbiAgICBSZXBlYXRBbGwgPSAxLFxuICAgIFJlcGVhdE9uZSA9IDJcbn1cblxuZXhwb3J0IGVudW0gUGxheWJhY2tPcmRlciB7XG4gICAgRGVmYXVsdCA9IDAsXG4gICAgU2h1ZmZsZSA9IDFcbn1cblxuZXhwb3J0IHR5cGUgUXVldWVJdGVtID0ge1xuICAgIElkOiBzdHJpbmc7XG4gICAgUGxheWxpc3RJdGVtSWQ6IHN0cmluZztcbn1cblxuZXhwb3J0IHR5cGUgUGxheWJhY2tQcm9ncmVzc0luZm8gPSB7XG4gICAgQ2FuU2VlazogYm9vbGVhbjtcbiAgICBJdGVtOiBCYXNlSXRlbTtcbiAgICBJdGVtSWQ6IHN0cmluZztcbiAgICBTZXNzaW9uSWQ6IHN0cmluZztcbiAgICBNZWRpYVNvdXJjZUlkOiBzdHJpbmc7XG4gICAgQXVkaW9TdHJlYW1JbmRleDogbnVtYmVyIHwgbnVsbDtcbiAgICBTdWJ0aXRsZVN0cmVhbUluZGV4OiBudW1iZXIgfCBudWxsO1xuICAgIElzUGF1c2VkOiBib29sZWFuO1xuICAgIElzTXV0ZWQ6IGJvb2xlYW47XG4gICAgUG9zaXRpb25UaWNrczogbnVtYmVyIHwgbnVsbDtcbiAgICBQbGF5YmFja1N0YXJ0VGltZVRpY2tzOiBudW1iZXIgfCBudWxsO1xuICAgIFZvbHVtZUxldmVsOiBudW1iZXIgfCBudWxsO1xuICAgIEJyaWdodG5lc3M6IG51bWJlciB8IG51bGw7XG4gICAgQXNwZWN0UmF0aW86IHN0cmluZztcbiAgICBQbGF5TWV0aG9kOiBQbGF5TWV0aG9kO1xuICAgIExpdmVTdHJlYW1JZDogc3RyaW5nO1xuICAgIFBsYXlTZXNzaW9uSWQ6IHN0cmluZztcbiAgICBSZXBlYXRNb2RlOiBSZXBlYXRNb2RlO1xuICAgIFBsYXliYWNrT3JkZXI6IFBsYXliYWNrT3JkZXI7XG4gICAgTm93UGxheWluZ1F1ZXVlOiBRdWV1ZUl0ZW1bXTtcbiAgICBQbGF5bGlzdEl0ZW1JZDogc3RyaW5nO1xufSIsImltcG9ydCB7SXRlbVR5cGV9IGZyb20gXCIuL0l0ZW1UeXBlXCI7XG5cbmV4cG9ydCB0eXBlIFBsdWdpblNldHRpbmdzID0ge1xuICAgIEVuYWJsZWRJdGVtVHlwZXM6IEl0ZW1UeXBlW10sXG4gICAgQmx1ckRlc2NyaXB0aW9uOiBib29sZWFuLFxuICAgIEJsdXJUaHVtYm5haWw6IGJvb2xlYW4sXG59XG5cbmV4cG9ydCBjb25zdCBEZWZhdWx0UGx1Z2luU2V0dGluZ3M6IFBsdWdpblNldHRpbmdzID0ge1xuICAgIEVuYWJsZWRJdGVtVHlwZXM6IFtJdGVtVHlwZS5TZXJpZXMsIEl0ZW1UeXBlLkJveFNldCwgSXRlbVR5cGUuTW92aWUsIEl0ZW1UeXBlLkZvbGRlciwgSXRlbVR5cGUuVmlkZW9dLFxuICAgIEJsdXJEZXNjcmlwdGlvbjogZmFsc2UsXG4gICAgQmx1clRodW1ibmFpbDogZmFsc2UsXG59IiwiZXhwb3J0IHR5cGUgU2VydmVyU2V0dGluZ3MgPSB7XG4gICAgTWluUmVzdW1lUGN0OiBudW1iZXIsIFxuICAgIE1heFJlc3VtZVBjdDogbnVtYmVyLCBcbiAgICBNaW5SZXN1bWVEdXJhdGlvblNlY29uZHM6IG51bWJlclxufVxuXG5leHBvcnQgY29uc3QgRGVmYXVsdFNlcnZlclNldHRpbmdzOiBTZXJ2ZXJTZXR0aW5ncyA9IHtcbiAgICBNaW5SZXN1bWVQY3Q6IDUsXG4gICAgTWF4UmVzdW1lUGN0OiA5MCxcbiAgICBNaW5SZXN1bWVEdXJhdGlvblNlY29uZHM6IDMwMFxufSIsImV4cG9ydCBjbGFzcyBBdXRoU2VydmljZSB7XG4gICAgcHJpdmF0ZSByZWFkb25seSBfYXV0aEhlYWRlcjogc3RyaW5nID0gJ0F1dGhvcml6YXRpb24nO1xuICAgIHByaXZhdGUgX2F1dGhIZWFkZXJWYWx1ZTogc3RyaW5nID0gJyc7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0QXV0aEhlYWRlcktleSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5fYXV0aEhlYWRlcjtcbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSBnZXRBdXRoSGVhZGVyVmFsdWUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2F1dGhIZWFkZXJWYWx1ZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0QXV0aEhlYWRlclZhbHVlKHZhbHVlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fYXV0aEhlYWRlclZhbHVlID0gdmFsdWU7XG4gICAgfVxuXG4gICAgcHVibGljIGFkZEF1dGhIZWFkZXJJbnRvSHR0cFJlcXVlc3QocmVxdWVzdDogWE1MSHR0cFJlcXVlc3QpOiB2b2lkIHtcbiAgICAgICAgcmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKHRoaXMuX2F1dGhIZWFkZXIsIHRoaXMuZ2V0QXV0aEhlYWRlclZhbHVlKCkpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7UHJvZ3JhbURhdGFTdG9yZX0gZnJvbSBcIi4vUHJvZ3JhbURhdGFTdG9yZVwiO1xuaW1wb3J0IHtBdXRoU2VydmljZX0gZnJvbSBcIi4vQXV0aFNlcnZpY2VcIjtcbmltcG9ydCB7TG9nZ2VyfSBmcm9tIFwiLi9Mb2dnZXJcIjtcbmltcG9ydCB7QmFzZUl0ZW0sIEl0ZW1EdG99IGZyb20gXCIuLi9Nb2RlbHMvRXBpc29kZVwiO1xuaW1wb3J0IHtTZWFzb259IGZyb20gXCIuLi9Nb2RlbHMvU2Vhc29uXCI7XG5pbXBvcnQge0l0ZW1UeXBlfSBmcm9tIFwiLi4vTW9kZWxzL0l0ZW1UeXBlXCI7XG5pbXBvcnQge1BsYXliYWNrT3JkZXIsIFBsYXliYWNrUHJvZ3Jlc3NJbmZvfSBmcm9tIFwiLi4vTW9kZWxzL1BsYXliYWNrUHJvZ3Jlc3NJbmZvXCI7XG5cbi8qKlxuICogVGhlIGNsYXNzZXMgd2hpY2ggZGVyaXZlcyBmcm9tIHRoaXMgaW50ZXJmYWNlLCB3aWxsIHByb3ZpZGUgdGhlIGZ1bmN0aW9uYWxpdHkgdG8gaGFuZGxlIHRoZSBkYXRhIGlucHV0IGZyb20gdGhlIHNlcnZlciBpZiB0aGUgUGxheWJhY2tTdGF0ZSBpcyBjaGFuZ2VkLlxuICovXG5leHBvcnQgY2xhc3MgRGF0YUZldGNoZXIge1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcHJvZ3JhbURhdGFTdG9yZTogUHJvZ3JhbURhdGFTdG9yZSwgcHJpdmF0ZSBhdXRoU2VydmljZTogQXV0aFNlcnZpY2UsIHByaXZhdGUgbG9nZ2VyOiBMb2dnZXIpIHtcbiAgICAgICAgY29uc3Qge2ZldGNoOiBvcmlnaW5hbEZldGNofSA9IHdpbmRvd1xuICAgICAgICB3aW5kb3cuZmV0Y2ggPSBhc3luYyAoLi4uYXJncyk6IFByb21pc2U8UmVzcG9uc2U+ID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHtvcmlnaW59ID0gd2luZG93LmxvY2F0aW9uO1xuICAgICAgICAgICAgbGV0IHJlc291cmNlID0gYXJnc1swXSBhcyBSZXF1ZXN0SW5mbztcbiAgICAgICAgICAgIGNvbnN0IGNvbmZpZzogUmVxdWVzdEluaXQgPSBhcmdzWzFdID8/IHt9O1xuXG4gICAgICAgICAgICBjb25zdCB0b1VybCA9IChpbnB1dDogUmVxdWVzdEluZm8pOiBVUkwgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChpbnB1dCBpbnN0YW5jZW9mIFVSTCkgcmV0dXJuIGlucHV0O1xuICAgICAgICAgICAgICAgIGlmIChpbnB1dCBpbnN0YW5jZW9mIFJlcXVlc3QpIHJldHVybiBuZXcgVVJMKGlucHV0LnVybCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBVUkwoU3RyaW5nKGlucHV0KSwgb3JpZ2luKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmIChjb25maWcgJiYgY29uZmlnLmhlYWRlcnMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmF1dGhTZXJ2aWNlLnNldEF1dGhIZWFkZXJWYWx1ZShjb25maWcuaGVhZGVyc1t0aGlzLmF1dGhTZXJ2aWNlLmdldEF1dGhIZWFkZXJLZXkoKV0gPz8gJycpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHVybDogVVJMID0gdG9VcmwocmVzb3VyY2UpO1xuICAgICAgICAgICAgY29uc3QgdXJsUGF0aG5hbWU6IHN0cmluZyA9IHVybC5wYXRobmFtZTtcblxuICAgICAgICAgICAgLy8gUHJvY2VzcyBkYXRhIGZyb20gUE9TVCByZXF1ZXN0c1xuICAgICAgICAgICAgLy8gRW5kcG9pbnQ6IC9TZXNzaW9ucy9QbGF5aW5nXG4gICAgICAgICAgICBpZiAoY29uZmlnLmJvZHkgJiYgdHlwZW9mIGNvbmZpZy5ib2R5ID09PSAnc3RyaW5nJyAmJiB1cmxQYXRobmFtZS5pbmNsdWRlcygnU2Vzc2lvbnMvUGxheWluZycpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcGxheWluZ0luZm86IFBsYXliYWNrUHJvZ3Jlc3NJbmZvID0gSlNPTi5wYXJzZShjb25maWcuYm9keSlcblxuICAgICAgICAgICAgICAgIC8vIHNhdmUgdGhlIGl0ZW0gaWQgb2YgdGhlIGN1cnJlbnRseSBwbGF5ZWQgdmlkZW9cbiAgICAgICAgICAgICAgICBjb25zdCBhY3RpdmVJdGVtSWQ6IHN0cmluZyA9IHBsYXlpbmdJbmZvLkl0ZW1JZCA/PyBwbGF5aW5nSW5mby5JdGVtPy5JZCA/PyBwbGF5aW5nSW5mby5NZWRpYVNvdXJjZUlkXG4gICAgICAgICAgICAgICAgaWYgKGFjdGl2ZUl0ZW1JZCAmJiB0aGlzLnByb2dyYW1EYXRhU3RvcmUuYWN0aXZlTWVkaWFTb3VyY2VJZCAhPT0gYWN0aXZlSXRlbUlkKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2dyYW1EYXRhU3RvcmUuYWN0aXZlTWVkaWFTb3VyY2VJZCA9IGFjdGl2ZUl0ZW1JZFxuXG4gICAgICAgICAgICAgICAgY29uc3QgcGxheWJhY2tPcmRlclJhdyA9IHBsYXlpbmdJbmZvLlBsYXliYWNrT3JkZXIgYXMgdW5rbm93biBhcyBQbGF5YmFja09yZGVyIHwgc3RyaW5nXG4gICAgICAgICAgICAgICAgY29uc3QgcGxheWJhY2tPcmRlckZyb21FbnVtID0gdHlwZW9mIHBsYXliYWNrT3JkZXJSYXcgPT09ICdudW1iZXInXG4gICAgICAgICAgICAgICAgICAgID8gUGxheWJhY2tPcmRlcltwbGF5YmFja09yZGVyUmF3XVxuICAgICAgICAgICAgICAgICAgICA6IHBsYXliYWNrT3JkZXJSYXdcbiAgICAgICAgICAgICAgICBjb25zdCBwbGF5YmFja09yZGVyOiBzdHJpbmcgPSBwbGF5YmFja09yZGVyRnJvbUVudW0gPz8gJ0RlZmF1bHQnXG4gICAgICAgICAgICAgICAgY29uc3Qgbm93UGxheWluZ1F1ZXVlSWRzOiBzdHJpbmdbXSA9IChwbGF5aW5nSW5mby5Ob3dQbGF5aW5nUXVldWUgPz8gW10pXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoKHF1ZXVlSXRlbSkgPT4gcXVldWVJdGVtPy5JZClcbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlcigoaWQpOiBpZCBpcyBzdHJpbmcgPT4gQm9vbGVhbihpZCkpXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9ncmFtRGF0YVN0b3JlLnNldFBsYXliYWNrT3JkZXIocGxheWJhY2tPcmRlcilcbiAgICAgICAgICAgICAgICB0aGlzLnByb2dyYW1EYXRhU3RvcmUuc2V0Tm93UGxheWluZ1F1ZXVlKG5vd1BsYXlpbmdRdWV1ZUlkcylcbiAgICAgICAgICAgICAgICB2b2lkIHRoaXMucHJvZ3JhbURhdGFTdG9yZS5lbnN1cmVJdGVtc0xvYWRlZEJ5SWRzKG5vd1BsYXlpbmdRdWV1ZUlkcylcblxuICAgICAgICAgICAgICAgIC8vIEVuZHBvaW50OiAvU2Vzc2lvbnMvUGxheWluZy9Qcm9ncmVzc1xuICAgICAgICAgICAgICAgIGlmICh1cmxQYXRobmFtZS5pbmNsdWRlcygnUHJvZ3Jlc3MnKSkge1xuICAgICAgICAgICAgICAgICAgICAvLyB1cGRhdGUgdGhlIHBsYXliYWNrIHByb2dyZXNzIG9mIHRoZSBjdXJyZW50bHkgcGxheWVkIHZpZGVvXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGVwaXNvZGU6IEJhc2VJdGVtID0gdGhpcy5wcm9ncmFtRGF0YVN0b3JlLmdldEl0ZW1CeUlkKGFjdGl2ZUl0ZW1JZClcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVwaXNvZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBsYXllZFBlcmNlbnRhZ2UgPSBlcGlzb2RlLlJ1blRpbWVUaWNrcyA+IDAgPyAocGxheWluZ0luZm8uUG9zaXRpb25UaWNrcyAvIGVwaXNvZGUuUnVuVGltZVRpY2tzKSAqIDEwMCA6IDBcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBsYXllZCA9IHBsYXllZFBlcmNlbnRhZ2UgPj0gdGhpcy5wcm9ncmFtRGF0YVN0b3JlLnNlcnZlclNldHRpbmdzLk1heFJlc3VtZVBjdFxuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2dyYW1EYXRhU3RvcmUudXBkYXRlSXRlbSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4uZXBpc29kZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBVc2VyRGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi5lcGlzb2RlLlVzZXJEYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBQbGF5YmFja1Bvc2l0aW9uVGlja3M6IHBsYXlpbmdJbmZvLlBvc2l0aW9uVGlja3MsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFBsYXllZFBlcmNlbnRhZ2U6IHBsYXllZFBlcmNlbnRhZ2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFBsYXllZDogcGxheWVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHVybFBhdGhuYW1lLmluY2x1ZGVzKCdFcGlzb2RlcycpKSB7XG4gICAgICAgICAgICAgICAgLy8gcmVtb3ZlIG5ldyAnc3RhcnRJdGVtSWQnIGFuZCAnbGltaXQnIHF1ZXJ5IHBhcmFtZXRlciwgdG8gc3RpbGwgZ2V0IHRoZSBmdWxsIGxpc3Qgb2YgZXBpc29kZXNcbiAgICAgICAgICAgICAgICBjb25zdCBjbGVhbmVkVVJMID0gdXJsLmhyZWYucmVwbGFjZSgvc3RhcnRJdGVtSWQ9W14mXSsmPy8sICcnKS5yZXBsYWNlKC9saW1pdD1bXiZdKyY/LywgJycpXG4gICAgICAgICAgICAgICAgcmVzb3VyY2UgPSB0b1VybChjbGVhbmVkVVJMKS50b1N0cmluZygpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlOiBSZXNwb25zZSA9IGF3YWl0IG9yaWdpbmFsRmV0Y2gocmVzb3VyY2UsIGNvbmZpZylcblxuICAgICAgICAgICAgaWYgKHVybFBhdGhuYW1lLmluY2x1ZGVzKCdFcGlzb2RlcycpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2dnZXIuZGVidWcoJ1JlY2VpdmVkIEVwaXNvZGVzJylcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICByZXNwb25zZS5jbG9uZSgpLmpzb24oKS50aGVuKChkYXRhOiBJdGVtRHRvKTogdm9pZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvZ3JhbURhdGFTdG9yZS50eXBlID0gSXRlbVR5cGUuU2VyaWVzXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvZ3JhbURhdGFTdG9yZS5zZWFzb25zID0gdGhpcy5nZXRGb3JtYXR0ZWRFcGlzb2RlRGF0YShkYXRhKVxuICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAodXJsUGF0aG5hbWUuaW5jbHVkZXMoJ1VzZXInKSAmJiB1cmxQYXRobmFtZS5pbmNsdWRlcygnSXRlbXMnKSAmJiB1cmwuc2VhcmNoLmluY2x1ZGVzKCdQYXJlbnRJZCcpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2dnZXIuZGVidWcoJ1JlY2VpdmVkIEl0ZW1zIHdpdGggUGFyZW50SWQnKVxuICAgICAgICAgICAgICAgIHJlc3BvbnNlLmNsb25lKCkuanNvbigpLnRoZW4oKGRhdGE6IEl0ZW1EdG8pOiB2b2lkID0+IHRoaXMuc2F2ZUl0ZW1EYXRhKGRhdGEsIHVybC5zZWFyY2hQYXJhbXMuZ2V0KCdQYXJlbnRJZCcpKSlcblxuICAgICAgICAgICAgfSBlbHNlIGlmICh1cmxQYXRobmFtZS5pbmNsdWRlcygnVXNlcicpICYmIHVybFBhdGhuYW1lLmluY2x1ZGVzKCdJdGVtcycpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2dnZXIuZGVidWcoJ1JlY2VpdmVkIEl0ZW1zIHdpdGhvdXQgUGFyZW50SWQnKVxuXG4gICAgICAgICAgICAgICAgcmVzcG9uc2UuY2xvbmUoKS5qc29uKCkudGhlbigoZGF0YTogQmFzZUl0ZW0pOiB2b2lkID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2dnZXIuZGVidWcoJ1JlY2VpdmVkIHNpbmdsZSBpdGVtIGRhdGEgLT4gU2V0dGluZyBCb3hTZXQgbmFtZScpXG5cbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChJdGVtVHlwZVtkYXRhLlR5cGVdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIEl0ZW1UeXBlLkJveFNldDpcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgSXRlbVR5cGUuRm9sZGVyOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvZ3JhbURhdGFTdG9yZS5ib3hTZXROYW1lID0gZGF0YS5OYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ncmFtRGF0YVN0b3JlLmFjdGl2ZU1lZGlhU291cmNlSWQgPSBkYXRhLklkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgSXRlbVR5cGUuTW92aWU6IC8vIGNvdWxkIGJlIHNpbmdsZSB2aWRlbyAoZS5nLiBzdGFydGVkIGZyb20gZGFzaGJvYXJkKVxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBJdGVtVHlwZS5WaWRlbzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNhdmVJdGVtRGF0YSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEl0ZW1zOiBbZGF0YV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRvdGFsUmVjb3JkQ291bnQ6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFN0YXJ0SW5kZXg6IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSBlbHNlIGlmICh1cmxQYXRobmFtZS5pbmNsdWRlcygnUGxheWVkSXRlbXMnKSkge1xuICAgICAgICAgICAgICAgIC8vIHVwZGF0ZSB0aGUgcGxheWVkIHN0YXRlIG9mIHRoZSBlcGlzb2RlXG4gICAgICAgICAgICAgICAgdGhpcy5sb2dnZXIuZGVidWcoJ1JlY2VpdmVkIFBsYXllZEl0ZW1zJylcblxuICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW1JZDogc3RyaW5nID0gZXh0cmFjdEtleUZyb21TdHJpbmcodXJsUGF0aG5hbWUsICdQbGF5ZWRJdGVtcy8nKVxuICAgICAgICAgICAgICAgIGNvbnN0IGNoYW5nZWRJdGVtOiBCYXNlSXRlbSA9IHRoaXMucHJvZ3JhbURhdGFTdG9yZS5nZXRJdGVtQnlJZChpdGVtSWQpXG4gICAgICAgICAgICAgICAgaWYgKCFjaGFuZ2VkSXRlbSkgcmV0dXJuXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgcmVzcG9uc2UuY2xvbmUoKS5qc29uKCkudGhlbigoZGF0YSkgPT4gY2hhbmdlZEl0ZW0uVXNlckRhdGEuUGxheWVkID0gZGF0YVtcIlBsYXllZFwiXSlcbiAgICAgICAgICAgICAgICB0aGlzLnByb2dyYW1EYXRhU3RvcmUudXBkYXRlSXRlbShjaGFuZ2VkSXRlbSlcblxuICAgICAgICAgICAgfSBlbHNlIGlmICh1cmxQYXRobmFtZS5pbmNsdWRlcygnRmF2b3JpdGVJdGVtcycpKSB7XG4gICAgICAgICAgICAgICAgLy8gdXBkYXRlIHRoZSBmYXZvdXJpdGUgc3RhdGUgb2YgdGhlIGVwaXNvZGVcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlci5kZWJ1ZygnUmVjZWl2ZWQgRmF2b3JpdGVJdGVtcycpXG5cbiAgICAgICAgICAgICAgICBjb25zdCBpdGVtSWQ6IHN0cmluZyA9IGV4dHJhY3RLZXlGcm9tU3RyaW5nKHVybFBhdGhuYW1lLCAnRmF2b3JpdGVJdGVtcy8nKTtcbiAgICAgICAgICAgICAgICBjb25zdCBjaGFuZ2VkSXRlbTogQmFzZUl0ZW0gPSB0aGlzLnByb2dyYW1EYXRhU3RvcmUuZ2V0SXRlbUJ5SWQoaXRlbUlkKTtcbiAgICAgICAgICAgICAgICBpZiAoIWNoYW5nZWRJdGVtKSByZXR1cm5cbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgcmVzcG9uc2UuY2xvbmUoKS5qc29uKCkudGhlbigoZGF0YSkgPT4gY2hhbmdlZEl0ZW0uVXNlckRhdGEuSXNGYXZvcml0ZSA9IGRhdGFbXCJJc0Zhdm9yaXRlXCJdKTtcbiAgICAgICAgICAgICAgICB0aGlzLnByb2dyYW1EYXRhU3RvcmUudXBkYXRlSXRlbShjaGFuZ2VkSXRlbSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlXG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGV4dHJhY3RLZXlGcm9tU3RyaW5nKHNlYXJjaFN0cmluZzogc3RyaW5nLCBzdGFydFN0cmluZzogc3RyaW5nLCBlbmRTdHJpbmc6IHN0cmluZyA9ICcnKTogc3RyaW5nIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzdGFydEluZGV4OiBudW1iZXIgPSBzZWFyY2hTdHJpbmcuaW5kZXhPZihzdGFydFN0cmluZykgKyBzdGFydFN0cmluZy5sZW5ndGhcbiAgICAgICAgICAgICAgICBpZiAoZW5kU3RyaW5nICE9PSAnJykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBlbmRJbmRleDogbnVtYmVyID0gc2VhcmNoU3RyaW5nLmluZGV4T2YoZW5kU3RyaW5nLCBzdGFydEluZGV4KVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VhcmNoU3RyaW5nLnN1YnN0cmluZyhzdGFydEluZGV4LCBlbmRJbmRleClcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gc2VhcmNoU3RyaW5nLnN1YnN0cmluZyhzdGFydEluZGV4KVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIHB1YmxpYyBzYXZlSXRlbURhdGEoaXRlbUR0bzogSXRlbUR0bywgcGFyZW50SWQ6IHN0cmluZyA9ICcnKTogdm9pZCB7XG4gICAgICAgIGlmICghaXRlbUR0byB8fCAhaXRlbUR0by5JdGVtcyB8fCBpdGVtRHRvLkl0ZW1zLmxlbmd0aCA9PT0gMClcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICBcbiAgICAgICAgY29uc3QgZmlyc3RJdGVtID0gaXRlbUR0by5JdGVtcy5hdCgwKVxuICAgICAgICBjb25zdCBpdGVtRHRvVHlwZTogSXRlbVR5cGUgPSBJdGVtVHlwZVtmaXJzdEl0ZW0/LlR5cGVdXG4gICAgICAgIHN3aXRjaCAoaXRlbUR0b1R5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgSXRlbVR5cGUuRXBpc29kZTpcbiAgICAgICAgICAgICAgICAvLyBkbyBub3Qgb3ZlcndyaXRlIGRhdGEgaWYgd2Ugb25seSByZWNlaXZlIG9uZSBpdGVtIHdoaWNoIGFscmVhZHkgZXhpc3RzXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW1EdG8uSXRlbXMubGVuZ3RoID4gMSB8fCAhdGhpcy5wcm9ncmFtRGF0YVN0b3JlLnNlYXNvbnMuZmxhdE1hcChzZWFzb24gPT4gc2Vhc29uLmVwaXNvZGVzKS5zb21lKGVwaXNvZGUgPT4gZXBpc29kZS5JZCA9PT0gZmlyc3RJdGVtLklkKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2dyYW1EYXRhU3RvcmUudHlwZSA9IEl0ZW1UeXBlLlNlcmllc1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2dyYW1EYXRhU3RvcmUuc2Vhc29ucyA9IHRoaXMuZ2V0Rm9ybWF0dGVkRXBpc29kZURhdGEoaXRlbUR0bylcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgSXRlbVR5cGUuTW92aWU6XG4gICAgICAgICAgICAgICAgaWYgKGl0ZW1EdG8uSXRlbXMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2dyYW1EYXRhU3RvcmUudHlwZSA9IHRoaXMucHJvZ3JhbURhdGFTdG9yZS5hY3RpdmVNZWRpYVNvdXJjZUlkICE9PSAnJyAmJiB0aGlzLnByb2dyYW1EYXRhU3RvcmUuYWN0aXZlTWVkaWFTb3VyY2VJZCA9PT0gcGFyZW50SWQgPyBJdGVtVHlwZS5Cb3hTZXQgOiBJdGVtVHlwZS5Nb3ZpZVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2dyYW1EYXRhU3RvcmUubW92aWVzID0gaXRlbUR0by5JdGVtcy5tYXAoKG1vdmllLCBpZHgpID0+ICh7XG4gICAgICAgICAgICAgICAgICAgICAgICAuLi5tb3ZpZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIEluZGV4TnVtYmVyOiBpZHggKyAxXG4gICAgICAgICAgICAgICAgICAgIH0pKVxuICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBkbyBub3Qgb3ZlcndyaXRlIGRhdGEgaWYgd2Ugb25seSByZWNlaXZlIG9uZSBpdGVtIHdoaWNoIGFscmVhZHkgZXhpc3RzXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnByb2dyYW1EYXRhU3RvcmUubW92aWVzLnNvbWUobW92aWUgPT4gbW92aWUuSWQgPT09IGZpcnN0SXRlbS5JZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLnByb2dyYW1EYXRhU3RvcmUubW92aWVzLnNvbWUobW92aWUgPT4gbW92aWUuU29ydE5hbWUgPT09IGZpcnN0SXRlbS5Tb3J0TmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvZ3JhbURhdGFTdG9yZS50eXBlID0gdGhpcy5wcm9ncmFtRGF0YVN0b3JlLmFjdGl2ZU1lZGlhU291cmNlSWQgIT09ICcnICYmIHRoaXMucHJvZ3JhbURhdGFTdG9yZS5hY3RpdmVNZWRpYVNvdXJjZUlkID09PSBwYXJlbnRJZCA/IEl0ZW1UeXBlLkJveFNldCA6IEl0ZW1UeXBlLk1vdmllXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ncmFtRGF0YVN0b3JlLm1vdmllcyA9IGl0ZW1EdG8uSXRlbXMubWFwKChtb3ZpZSwgaWR4KSA9PiAoe1xuICAgICAgICAgICAgICAgICAgICAgICAgLi4ubW92aWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBJbmRleE51bWJlcjogaWR4ICsgMVxuICAgICAgICAgICAgICAgICAgICB9KSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgSXRlbVR5cGUuVmlkZW86XG4gICAgICAgICAgICAgICAgaWYgKGl0ZW1EdG8uSXRlbXMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2dyYW1EYXRhU3RvcmUudHlwZSA9IHRoaXMucHJvZ3JhbURhdGFTdG9yZS5hY3RpdmVNZWRpYVNvdXJjZUlkICE9PSAnJyAmJiB0aGlzLnByb2dyYW1EYXRhU3RvcmUuYWN0aXZlTWVkaWFTb3VyY2VJZCA9PT0gcGFyZW50SWQgPyBJdGVtVHlwZS5Gb2xkZXIgOiBJdGVtVHlwZS5WaWRlb1xuICAgICAgICAgICAgICAgICAgICBpdGVtRHRvLkl0ZW1zLnNvcnQoKGEsIGIpID0+IChhLlNvcnROYW1lICYmIGIuU29ydE5hbWUpID8gYS5Tb3J0TmFtZS5sb2NhbGVDb21wYXJlKGIuU29ydE5hbWUpIDogMClcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ncmFtRGF0YVN0b3JlLm1vdmllcyA9IGl0ZW1EdG8uSXRlbXMubWFwKCh2aWRlbywgaWR4KSA9PiAoe1xuICAgICAgICAgICAgICAgICAgICAgICAgLi4udmlkZW8sXG4gICAgICAgICAgICAgICAgICAgICAgICBJbmRleE51bWJlcjogaWR4ICsgMVxuICAgICAgICAgICAgICAgICAgICB9KSlcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gZG8gbm90IG92ZXJ3cml0ZSBkYXRhIGlmIHdlIG9ubHkgcmVjZWl2ZSBvbmUgaXRlbSB3aGljaCBhbHJlYWR5IGV4aXN0c1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5wcm9ncmFtRGF0YVN0b3JlLm1vdmllcy5zb21lKHZpZGVvID0+IHZpZGVvLklkID09PSBmaXJzdEl0ZW0uSWQpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5wcm9ncmFtRGF0YVN0b3JlLm1vdmllcy5zb21lKHZpZGVvID0+IHZpZGVvLlNvcnROYW1lID09PSBmaXJzdEl0ZW0uU29ydE5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2dyYW1EYXRhU3RvcmUudHlwZSA9IHRoaXMucHJvZ3JhbURhdGFTdG9yZS5hY3RpdmVNZWRpYVNvdXJjZUlkICE9PSAnJyAmJiB0aGlzLnByb2dyYW1EYXRhU3RvcmUuYWN0aXZlTWVkaWFTb3VyY2VJZCA9PT0gcGFyZW50SWQgPyBJdGVtVHlwZS5Gb2xkZXIgOiBJdGVtVHlwZS5WaWRlb1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGl0ZW1EdG8uSXRlbXMuc29ydCgoYSwgYikgPT4gKGEuU29ydE5hbWUgJiYgYi5Tb3J0TmFtZSkgPyBhLlNvcnROYW1lLmxvY2FsZUNvbXBhcmUoYi5Tb3J0TmFtZSkgOiAwKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2dyYW1EYXRhU3RvcmUubW92aWVzID0gaXRlbUR0by5JdGVtcy5tYXAoKHZpZGVvLCBpZHgpID0+ICh7XG4gICAgICAgICAgICAgICAgICAgICAgICAuLi52aWRlbyxcbiAgICAgICAgICAgICAgICAgICAgICAgIEluZGV4TnVtYmVyOiBpZHggKyAxXG4gICAgICAgICAgICAgICAgICAgIH0pKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gdGhpcy5sb2dnZXIuZXJyb3IoXCJDb3VsZG4ndCBzYXZlIGl0ZW1zIGZyb20gcmVzcG9uc2VcIiwgaXRlbUR0byk7XG4gICAgfVxuICAgIFxuICAgIHB1YmxpYyBnZXRGb3JtYXR0ZWRFcGlzb2RlRGF0YSA9IChpdGVtRHRvOiBJdGVtRHRvKSA9PiB7XG4gICAgICAgIGNvbnN0IGVwaXNvZGVEYXRhOiBCYXNlSXRlbVtdID0gaXRlbUR0by5JdGVtc1xuICAgICAgICBcbiAgICAgICAgLy8gZ2V0IGFsbCBkaWZmZXJlbnQgc2Vhc29uSWRzXG4gICAgICAgIGNvbnN0IHNlYXNvbklkczogU2V0PHN0cmluZz4gPSBuZXcgU2V0PHN0cmluZz4oZXBpc29kZURhdGEubWFwKChlcGlzb2RlOiBCYXNlSXRlbSk6IHN0cmluZyA9PiBlcGlzb2RlLlNlYXNvbklkKSlcblxuICAgICAgICAvLyBncm91cCB0aGUgZXBpc29kZXMgYnkgc2Vhc29uSWRcbiAgICAgICAgY29uc3QgZ3JvdXA6IFJlY29yZDxzdHJpbmcsIEJhc2VJdGVtW10+ID0gZ3JvdXBCeShlcGlzb2RlRGF0YSwgKGVwaXNvZGU6IEJhc2VJdGVtKTogc3RyaW5nID0+IGVwaXNvZGUuU2Vhc29uSWQpXG5cbiAgICAgICAgY29uc3Qgc2Vhc29uczogU2Vhc29uW10gPSBbXVxuICAgICAgICBjb25zdCBpdGVyYXRvcjogSXRlcmFibGVJdGVyYXRvcjxzdHJpbmc+ID0gc2Vhc29uSWRzLnZhbHVlcygpXG4gICAgICAgIGxldCB2YWx1ZTogSXRlcmF0b3JSZXN1bHQ8c3RyaW5nPiA9IGl0ZXJhdG9yLm5leHQoKVxuICAgICAgICB3aGlsZSAoIXZhbHVlLmRvbmUpIHtcbiAgICAgICAgICAgIGNvbnN0IHNlYXNvbklkOiBzdHJpbmcgPSB2YWx1ZS52YWx1ZVxuICAgICAgICAgICAgY29uc3Qgc2Vhc29uOiBTZWFzb24gPSB7XG4gICAgICAgICAgICAgICAgc2Vhc29uSWQ6IHNlYXNvbklkLFxuICAgICAgICAgICAgICAgIHNlYXNvbk5hbWU6IGdyb3VwW3NlYXNvbklkXS5hdCgwKS5TZWFzb25OYW1lLFxuICAgICAgICAgICAgICAgIGVwaXNvZGVzOiBncm91cFtzZWFzb25JZF0sXG4gICAgICAgICAgICAgICAgSW5kZXhOdW1iZXI6IHNlYXNvbnMubGVuZ3RoXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHNlYXNvbnMucHVzaChzZWFzb24pXG4gICAgICAgICAgICB2YWx1ZSA9IGl0ZXJhdG9yLm5leHQoKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNlYXNvbnNcbiAgICAgICAgXG4gICAgICAgIGZ1bmN0aW9uIGdyb3VwQnk8VD4oYXJyOiBUW10sIGZuOiAoaXRlbTogVCkgPT4gYW55KTogUmVjb3JkPHN0cmluZywgVFtdPiB7XG4gICAgICAgICAgICByZXR1cm4gYXJyLnJlZHVjZTxSZWNvcmQ8c3RyaW5nLCBUW10+PigocHJldjogUmVjb3JkPHN0cmluZywgVFtdPiwgY3VycjogVCk6IHt9ID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBncm91cEtleSA9IGZuKGN1cnIpXG4gICAgICAgICAgICAgICAgY29uc3QgZ3JvdXA6IFRbXSA9IHByZXZbZ3JvdXBLZXldIHx8IFtdXG4gICAgICAgICAgICAgICAgZ3JvdXAucHVzaChjdXJyKVxuICAgICAgICAgICAgICAgIHJldHVybiB7IC4uLnByZXYsIFtncm91cEtleV06IGdyb3VwIH1cbiAgICAgICAgICAgIH0sIHt9KVxuICAgICAgICB9XG4gICAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIExvZ2dlciB7XG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBsb2dfcHJlZml4OiBzdHJpbmcgPSBcIltJblBsYXllckVwaXNvZGVQcmV2aWV3XVwiKSB7XG4gICAgfVxuXG4gICAgcHVibGljIGRlYnVnKG1zZzogc3RyaW5nLCAuLi5kZXRhaWxzOiBhbnlbXSk6IHZvaWQge1xuICAgICAgICAvLyBjb25zb2xlLmRlYnVnKGAke3RoaXMubG9nX3ByZWZpeH0gJHttc2d9YCwgZGV0YWlscyk7XG4gICAgfVxuXG4gICAgcHVibGljIGVycm9yKG1zZzogc3RyaW5nLCAuLi5kZXRhaWxzOiBhbnlbXSk6IHZvaWQge1xuICAgICAgICBjb25zb2xlLmVycm9yKGAke3RoaXMubG9nX3ByZWZpeH0gJHttc2d9YCwgZGV0YWlscyk7XG4gICAgfVxuXG4gICAgcHVibGljIGluZm8obXNnOiBzdHJpbmcsIC4uLmRldGFpbHM6IGFueVtdKTogdm9pZCB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhgJHt0aGlzLmxvZ19wcmVmaXh9ICR7bXNnfWAsIGRldGFpbHMpO1xuICAgIH1cblxufVxuIiwiaW1wb3J0IHtMb2dnZXJ9IGZyb20gXCIuL0xvZ2dlclwiO1xuaW1wb3J0IHtFbmRwb2ludHN9IGZyb20gXCIuLi9FbmRwb2ludHNcIjtcblxuZXhwb3J0IGNsYXNzIFBsYXliYWNrSGFuZGxlciB7XG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBsb2dnZXI6IExvZ2dlcikgeyB9XG5cbiAgICBhc3luYyBwbGF5KGVwaXNvZGVJZDogc3RyaW5nLCBzdGFydFBvc2l0aW9uVGlja3M6IG51bWJlcik6IFByb21pc2U8dm9pZCB8IFJlc3BvbnNlPiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB1cmwgPSBBcGlDbGllbnQuZ2V0VXJsKGAvJHtFbmRwb2ludHMuQkFTRX0ke0VuZHBvaW50cy5QTEFZX01FRElBfWBcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgne3VzZXJJZH0nLCBBcGlDbGllbnQuZ2V0Q3VycmVudFVzZXJJZCgpKVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKCd7ZGV2aWNlSWR9JywgQXBpQ2xpZW50LmRldmljZUlkKCkpXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoJ3tlcGlzb2RlSWR9JywgZXBpc29kZUlkKVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKCd7dGlja3N9Jywgc3RhcnRQb3NpdGlvblRpY2tzLnRvU3RyaW5nKCkpKVxuXG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgQXBpQ2xpZW50LmFqYXgoeyB0eXBlOiAnR0VUJywgdXJsIH0pXG4gICAgICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5sb2dnZXIuZXJyb3IoYENvdWxkbid0IHN0YXJ0IHRoZSBwbGF5YmFjayBvZiBhbiBlcGlzb2RlYCwgZXgpXG4gICAgICAgIH1cbiAgICB9XG59IiwiaW1wb3J0IHtQcm9ncmFtRGF0YX0gZnJvbSBcIi4uL01vZGVscy9Qcm9ncmFtRGF0YVwiO1xuaW1wb3J0IHtTZWFzb259IGZyb20gXCIuLi9Nb2RlbHMvU2Vhc29uXCI7XG5pbXBvcnQge0Jhc2VJdGVtfSBmcm9tIFwiLi4vTW9kZWxzL0VwaXNvZGVcIjtcbmltcG9ydCB7SXRlbVR5cGV9IGZyb20gXCIuLi9Nb2RlbHMvSXRlbVR5cGVcIjtcbmltcG9ydCB7RGVmYXVsdFBsdWdpblNldHRpbmdzLCBQbHVnaW5TZXR0aW5nc30gZnJvbSBcIi4uL01vZGVscy9QbHVnaW5TZXR0aW5nc1wiO1xuaW1wb3J0IHtEZWZhdWx0U2VydmVyU2V0dGluZ3MsIFNlcnZlclNldHRpbmdzfSBmcm9tIFwiLi4vTW9kZWxzL1NlcnZlclNldHRpbmdzXCI7XG5cbmV4cG9ydCBjbGFzcyBQcm9ncmFtRGF0YVN0b3JlIHtcbiAgICBwcml2YXRlIF9wcm9ncmFtRGF0YTogUHJvZ3JhbURhdGFcbiAgICBwcml2YXRlIHBsYXliYWNrU3RhdGVMaXN0ZW5lcnM6IFNldDwoKSA9PiB2b2lkPiA9IG5ldyBTZXQoKVxuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuX3Byb2dyYW1EYXRhID0ge1xuICAgICAgICAgICAgYWN0aXZlTWVkaWFTb3VyY2VJZDogJycsXG4gICAgICAgICAgICBib3hTZXROYW1lOiAnJyxcbiAgICAgICAgICAgIHBsYXliYWNrT3JkZXI6ICdEZWZhdWx0JyxcbiAgICAgICAgICAgIG5vd1BsYXlpbmdRdWV1ZUlkczogW10sXG4gICAgICAgICAgICBub3dQbGF5aW5nUXVldWVWZXJzaW9uOiAwLFxuICAgICAgICAgICAgdHlwZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgbW92aWVzOiBbXSxcbiAgICAgICAgICAgIHNlYXNvbnM6IFtdLFxuICAgICAgICAgICAgcGx1Z2luU2V0dGluZ3M6IERlZmF1bHRQbHVnaW5TZXR0aW5ncyxcbiAgICAgICAgICAgIHNlcnZlclNldHRpbmdzOiBEZWZhdWx0U2VydmVyU2V0dGluZ3NcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgYWN0aXZlTWVkaWFTb3VyY2VJZCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5fcHJvZ3JhbURhdGEuYWN0aXZlTWVkaWFTb3VyY2VJZFxuICAgIH1cblxuICAgIHB1YmxpYyBzZXQgYWN0aXZlTWVkaWFTb3VyY2VJZChhY3RpdmVNZWRpYVNvdXJjZUlkOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5fcHJvZ3JhbURhdGEuYWN0aXZlTWVkaWFTb3VyY2VJZCA9IGFjdGl2ZU1lZGlhU291cmNlSWRcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IGFjdGl2ZVNlYXNvbigpOiBTZWFzb24ge1xuICAgICAgICByZXR1cm4gdGhpcy5zZWFzb25zLmZpbmQoc2Vhc29uID0+IHNlYXNvbi5lcGlzb2Rlcy5zb21lKGVwaXNvZGUgPT4gZXBpc29kZS5JZCA9PT0gdGhpcy5hY3RpdmVNZWRpYVNvdXJjZUlkKSlcbiAgICAgICAgICAgID8/IHRoaXMuc2Vhc29uc1swXVxuICAgICAgICAgICAgPz8ge1xuICAgICAgICAgICAgICAgIHNlYXNvbklkOiAnJyxcbiAgICAgICAgICAgICAgICBzZWFzb25OYW1lOiAnJyxcbiAgICAgICAgICAgICAgICBlcGlzb2RlczogW10sXG4gICAgICAgICAgICAgICAgSW5kZXhOdW1iZXI6IDBcbiAgICAgICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgcHVibGljIGdldCB0eXBlKCk6IEl0ZW1UeXBlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Byb2dyYW1EYXRhLnR5cGVcbiAgICB9XG4gICAgXG4gICAgcHVibGljIHNldCB0eXBlKHR5cGU6IEl0ZW1UeXBlKSB7XG4gICAgICAgIHRoaXMuX3Byb2dyYW1EYXRhLnR5cGUgPSB0eXBlXG4gICAgfVxuICAgIFxuICAgIHB1YmxpYyBnZXQgYm94U2V0TmFtZSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5fcHJvZ3JhbURhdGEuYm94U2V0TmFtZVxuICAgIH1cbiAgICBcbiAgICBwdWJsaWMgc2V0IGJveFNldE5hbWUoYm94U2V0TmFtZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuX3Byb2dyYW1EYXRhLmJveFNldE5hbWUgPSBib3hTZXROYW1lXG4gICAgfVxuXG4gICAgcHVibGljIGdldCBwbGF5YmFja09yZGVyKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wcm9ncmFtRGF0YS5wbGF5YmFja09yZGVyXG4gICAgfVxuXG4gICAgcHVibGljIHNldFBsYXliYWNrT3JkZXIocGxheWJhY2tPcmRlcjogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IG5vcm1hbGl6ZWRPcmRlcjogc3RyaW5nID0gcGxheWJhY2tPcmRlciA/PyAnRGVmYXVsdCdcbiAgICAgICAgaWYgKHRoaXMuX3Byb2dyYW1EYXRhLnBsYXliYWNrT3JkZXIgPT09IG5vcm1hbGl6ZWRPcmRlcilcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIHRoaXMuX3Byb2dyYW1EYXRhLnBsYXliYWNrT3JkZXIgPSBub3JtYWxpemVkT3JkZXJcbiAgICAgICAgdGhpcy5ub3RpZnlQbGF5YmFja1N0YXRlQ2hhbmdlZCgpXG4gICAgfVxuXG4gICAgcHVibGljIGdldCBub3dQbGF5aW5nUXVldWVJZHMoKTogc3RyaW5nW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5fcHJvZ3JhbURhdGEubm93UGxheWluZ1F1ZXVlSWRzXG4gICAgfVxuXG4gICAgcHVibGljIGdldCBub3dQbGF5aW5nUXVldWVWZXJzaW9uKCk6IG51bWJlciB8IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wcm9ncmFtRGF0YS5ub3dQbGF5aW5nUXVldWVWZXJzaW9uXG4gICAgfVxuXG4gICAgcHVibGljIHNldE5vd1BsYXlpbmdRdWV1ZShpZHM6IHN0cmluZ1tdKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IG5vcm1hbGl6ZWRJZHM6IHN0cmluZ1tdID0gKGlkcyA/PyBbXSkuZmlsdGVyKChpZDogc3RyaW5nKTogYm9vbGVhbiA9PiBCb29sZWFuKGlkKSlcbiAgICAgICAgaWYgKHRoaXMuYXJyYXlzRXF1YWwodGhpcy5fcHJvZ3JhbURhdGEubm93UGxheWluZ1F1ZXVlSWRzLCBub3JtYWxpemVkSWRzKSlcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIHRoaXMuX3Byb2dyYW1EYXRhLm5vd1BsYXlpbmdRdWV1ZUlkcyA9IG5vcm1hbGl6ZWRJZHNcbiAgICAgICAgdGhpcy5fcHJvZ3JhbURhdGEubm93UGxheWluZ1F1ZXVlVmVyc2lvbiA9IERhdGUubm93KClcbiAgICAgICAgdGhpcy5ub3RpZnlQbGF5YmFja1N0YXRlQ2hhbmdlZCgpXG4gICAgfVxuXG4gICAgcHVibGljIGlzU2h1ZmZsZUFjdGl2ZSgpOiBib29sZWFuIHtcbiAgICAgICAgY29uc3QgcGxheWJhY2tPcmRlciA9ICh0aGlzLl9wcm9ncmFtRGF0YS5wbGF5YmFja09yZGVyID8/ICcnKS50b1N0cmluZygpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgcmV0dXJuIHBsYXliYWNrT3JkZXIgPT09ICdzaHVmZmxlJyB8fCBwbGF5YmFja09yZGVyID09PSAncmFuZG9tJ1xuICAgIH1cblxuICAgIHB1YmxpYyBzdWJzY3JpYmVQbGF5YmFja1N0YXRlQ2hhbmdlZChsaXN0ZW5lcjogKCkgPT4gdm9pZCk6ICgpID0+IHZvaWQge1xuICAgICAgICB0aGlzLnBsYXliYWNrU3RhdGVMaXN0ZW5lcnMuYWRkKGxpc3RlbmVyKVxuICAgICAgICByZXR1cm4gKCkgPT4gdGhpcy5wbGF5YmFja1N0YXRlTGlzdGVuZXJzLmRlbGV0ZShsaXN0ZW5lcilcbiAgICB9XG4gICAgXG4gICAgcHVibGljIGdldCBtb3ZpZXMoKTogQmFzZUl0ZW1bXSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wcm9ncmFtRGF0YS5tb3ZpZXNcbiAgICB9XG4gICAgXG4gICAgcHVibGljIHNldCBtb3ZpZXMobW92aWVzOiBCYXNlSXRlbVtdKSB7XG4gICAgICAgIHRoaXMuX3Byb2dyYW1EYXRhLm1vdmllcyA9IG1vdmllc1xuICAgICAgICB0aGlzLl9wcm9ncmFtRGF0YS5zZWFzb25zID0gW11cbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IHNlYXNvbnMoKTogU2Vhc29uW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5fcHJvZ3JhbURhdGEuc2Vhc29uc1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXQgc2Vhc29ucyhzZWFzb25zOiBTZWFzb25bXSkge1xuICAgICAgICB0aGlzLl9wcm9ncmFtRGF0YS5zZWFzb25zID0gc2Vhc29uc1xuICAgICAgICB0aGlzLl9wcm9ncmFtRGF0YS5tb3ZpZXMgPSBbXVxuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgcGx1Z2luU2V0dGluZ3MoKTogUGx1Z2luU2V0dGluZ3Mge1xuICAgICAgICByZXR1cm4gdGhpcy5fcHJvZ3JhbURhdGEucGx1Z2luU2V0dGluZ3NcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0IHBsdWdpblNldHRpbmdzKHNldHRpbmdzOiBQbHVnaW5TZXR0aW5ncykge1xuICAgICAgICB0aGlzLl9wcm9ncmFtRGF0YS5wbHVnaW5TZXR0aW5ncyA9IHNldHRpbmdzXG4gICAgfVxuXG4gICAgcHVibGljIGdldCBzZXJ2ZXJTZXR0aW5ncygpOiBTZXJ2ZXJTZXR0aW5ncyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wcm9ncmFtRGF0YS5zZXJ2ZXJTZXR0aW5nc1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXQgc2VydmVyU2V0dGluZ3Moc2V0dGluZ3M6IFNlcnZlclNldHRpbmdzKSB7XG4gICAgICAgIHRoaXMuX3Byb2dyYW1EYXRhLnNlcnZlclNldHRpbmdzID0gc2V0dGluZ3NcbiAgICB9XG4gICAgXG4gICAgcHVibGljIGdldCBkYXRhSXNBbGxvd2VkRm9yUHJldmlldygpIHtcbiAgICAgICAgaWYgKCF0aGlzLmFsbG93ZWRQcmV2aWV3VHlwZXMuaW5jbHVkZXModGhpcy50eXBlKSlcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICBcbiAgICAgICAgc3dpdGNoICh0aGlzLnR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgSXRlbVR5cGUuU2VyaWVzOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFjdGl2ZVNlYXNvbi5lcGlzb2Rlcy5sZW5ndGggPj0gMVxuICAgICAgICAgICAgY2FzZSBJdGVtVHlwZS5Nb3ZpZTpcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICAgICAgY2FzZSBJdGVtVHlwZS5Cb3hTZXQ6XG4gICAgICAgICAgICBjYXNlIEl0ZW1UeXBlLkZvbGRlcjpcbiAgICAgICAgICAgIGNhc2UgSXRlbVR5cGUuVmlkZW86XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubW92aWVzLmxlbmd0aCA+PSAxXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIHB1YmxpYyBnZXQgYWxsb3dlZFByZXZpZXdUeXBlcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGx1Z2luU2V0dGluZ3MuRW5hYmxlZEl0ZW1UeXBlc1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRJdGVtQnlJZChpdGVtSWQ6IHN0cmluZyk6IEJhc2VJdGVtIHtcbiAgICAgICAgc3dpdGNoICh0aGlzLnR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgSXRlbVR5cGUuU2VyaWVzOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNlYXNvbnNcbiAgICAgICAgICAgICAgICAgICAgLmZsYXRNYXAoc2Vhc29uID0+IHNlYXNvbi5lcGlzb2RlcylcbiAgICAgICAgICAgICAgICAgICAgLmZpbmQoZXBpc29kZSA9PiBlcGlzb2RlLklkID09PSBpdGVtSWQpXG4gICAgICAgICAgICBjYXNlIEl0ZW1UeXBlLkJveFNldDpcbiAgICAgICAgICAgIGNhc2UgSXRlbVR5cGUuTW92aWU6XG4gICAgICAgICAgICBjYXNlIEl0ZW1UeXBlLkZvbGRlcjpcbiAgICAgICAgICAgIGNhc2UgSXRlbVR5cGUuVmlkZW86XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubW92aWVzLmZpbmQobW92aWUgPT4gbW92aWUuSWQgPT09IGl0ZW1JZClcbiAgICAgICAgICAgIGRlZmF1bHQ6IFxuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyB1cGRhdGVJdGVtKGl0ZW1Ub1VwZGF0ZTogQmFzZUl0ZW0pOiB2b2lkIHtcbiAgICAgICAgc3dpdGNoICh0aGlzLnR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgSXRlbVR5cGUuU2VyaWVzOiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNlYXNvbjogU2Vhc29uID0gdGhpcy5zZWFzb25zLmZpbmQoc2Vhc29uID0+IHNlYXNvbi5zZWFzb25JZCA9PT0gaXRlbVRvVXBkYXRlLlNlYXNvbklkKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlYXNvbnMgPSBbXG4gICAgICAgICAgICAgICAgICAgICAgICAuLi4gdGhpcy5zZWFzb25zLmZpbHRlcihzZWFzb24gPT4gc2Vhc29uLnNlYXNvbklkICE9PSBpdGVtVG9VcGRhdGUuU2Vhc29uSWQpLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4uc2Vhc29uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVwaXNvZGVzOiBbLi4uIHNlYXNvbi5lcGlzb2Rlcy5maWx0ZXIoZXBpc29kZSA9PiBlcGlzb2RlLklkICE9PSBpdGVtVG9VcGRhdGUuSWQpLCBpdGVtVG9VcGRhdGVdXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgSXRlbVR5cGUuQm94U2V0OlxuICAgICAgICAgICAgY2FzZSBJdGVtVHlwZS5Nb3ZpZTpcbiAgICAgICAgICAgIGNhc2UgSXRlbVR5cGUuRm9sZGVyOlxuICAgICAgICAgICAgY2FzZSBJdGVtVHlwZS5WaWRlbzpcbiAgICAgICAgICAgICAgICB0aGlzLm1vdmllcyA9IFsuLi4gdGhpcy5tb3ZpZXMuZmlsdGVyKG1vdmllID0+IG1vdmllLklkICE9PSBpdGVtVG9VcGRhdGUuSWQpLCBpdGVtVG9VcGRhdGVdXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgaGFzSXRlbShpdGVtSWQ6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gQm9vbGVhbih0aGlzLmdldEl0ZW1CeUlkKGl0ZW1JZCkpXG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGVuc3VyZUl0ZW1zTG9hZGVkQnlJZHMoaWRzOiBzdHJpbmdbXSk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBjb25zdCBtaXNzaW5nSWRzOiBzdHJpbmdbXSA9IChpZHMgPz8gW10pLmZpbHRlcigoaWQ6IHN0cmluZyk6IGJvb2xlYW4gPT4gQm9vbGVhbihpZCkgJiYgIXRoaXMuaGFzSXRlbShpZCkpXG4gICAgICAgIGlmIChtaXNzaW5nSWRzLmxlbmd0aCA9PT0gMClcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIGNvbnN0IHVzZXJJZDogc3RyaW5nID0gQXBpQ2xpZW50LmdldEN1cnJlbnRVc2VySWQ/LigpXG4gICAgICAgIGlmICghdXNlcklkKVxuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBBcGlDbGllbnQuZ2V0SXRlbXModXNlcklkLCB7IElkczogbWlzc2luZ0lkcy5qb2luKCcsJykgfSlcbiAgICAgICAgY29uc3QgaXRlbXM6IEJhc2VJdGVtW10gPSAocmVzcG9uc2U/Lkl0ZW1zID8/IFtdKS5tYXAoKGl0ZW0pID0+IGl0ZW0gYXMgQmFzZUl0ZW0pXG4gICAgICAgIGlmIChpdGVtcy5sZW5ndGggPT09IDApXG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgICB0aGlzLm1lcmdlSXRlbXMoaXRlbXMpXG4gICAgICAgIHRoaXMubm90aWZ5UGxheWJhY2tTdGF0ZUNoYW5nZWQoKVxuICAgIH1cblxuICAgIHByaXZhdGUgbWVyZ2VJdGVtcyhpdGVtczogQmFzZUl0ZW1bXSk6IHZvaWQge1xuICAgICAgICBpdGVtcy5mb3JFYWNoKChpdGVtOiBCYXNlSXRlbSk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgY29uc3QgaXRlbVR5cGU6IEl0ZW1UeXBlID0gSXRlbVR5cGVbaXRlbS5UeXBlIGFzIGtleW9mIHR5cGVvZiBJdGVtVHlwZV1cbiAgICAgICAgICAgIHN3aXRjaCAoaXRlbVR5cGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIEl0ZW1UeXBlLkVwaXNvZGU6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubWVyZ2VFcGlzb2RlSXRlbShpdGVtKVxuICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgIGNhc2UgSXRlbVR5cGUuQm94U2V0OlxuICAgICAgICAgICAgICAgIGNhc2UgSXRlbVR5cGUuTW92aWU6XG4gICAgICAgICAgICAgICAgY2FzZSBJdGVtVHlwZS5Gb2xkZXI6XG4gICAgICAgICAgICAgICAgY2FzZSBJdGVtVHlwZS5WaWRlbzpcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLnR5cGUpXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnR5cGUgPSBpdGVtVHlwZVxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmllcyA9IFsuLi50aGlzLm1vdmllcy5maWx0ZXIobW92aWUgPT4gbW92aWUuSWQgIT09IGl0ZW0uSWQpLCBpdGVtXVxuICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlSXRlbShpdGVtKVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIHByaXZhdGUgbWVyZ2VFcGlzb2RlSXRlbShpdGVtOiBCYXNlSXRlbSk6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMudHlwZSlcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IEl0ZW1UeXBlLlNlcmllc1xuXG4gICAgICAgIGlmICghaXRlbS5TZWFzb25JZCkge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVJdGVtKGl0ZW0pXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHNlYXNvbkluZGV4ID0gdGhpcy5zZWFzb25zLmZpbmRJbmRleChzZWFzb24gPT4gc2Vhc29uLnNlYXNvbklkID09PSBpdGVtLlNlYXNvbklkKVxuICAgICAgICBpZiAoc2Vhc29uSW5kZXggPT09IC0xKSB7XG4gICAgICAgICAgICB0aGlzLnNlYXNvbnMgPSBbXG4gICAgICAgICAgICAgICAgLi4udGhpcy5zZWFzb25zLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgc2Vhc29uSWQ6IGl0ZW0uU2Vhc29uSWQsXG4gICAgICAgICAgICAgICAgICAgIHNlYXNvbk5hbWU6IGl0ZW0uU2Vhc29uTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgZXBpc29kZXM6IFtpdGVtXSxcbiAgICAgICAgICAgICAgICAgICAgSW5kZXhOdW1iZXI6IHRoaXMuc2Vhc29ucy5sZW5ndGhcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHNlYXNvbiA9IHRoaXMuc2Vhc29uc1tzZWFzb25JbmRleF1cbiAgICAgICAgY29uc3QgdXBkYXRlZFNlYXNvbjogU2Vhc29uID0ge1xuICAgICAgICAgICAgLi4uc2Vhc29uLFxuICAgICAgICAgICAgZXBpc29kZXM6IFsuLi5zZWFzb24uZXBpc29kZXMuZmlsdGVyKGVwaXNvZGUgPT4gZXBpc29kZS5JZCAhPT0gaXRlbS5JZCksIGl0ZW1dXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZWFzb25zID0gW1xuICAgICAgICAgICAgLi4udGhpcy5zZWFzb25zLnNsaWNlKDAsIHNlYXNvbkluZGV4KSxcbiAgICAgICAgICAgIHVwZGF0ZWRTZWFzb24sXG4gICAgICAgICAgICAuLi50aGlzLnNlYXNvbnMuc2xpY2Uoc2Vhc29uSW5kZXggKyAxKVxuICAgICAgICBdXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBub3RpZnlQbGF5YmFja1N0YXRlQ2hhbmdlZCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5wbGF5YmFja1N0YXRlTGlzdGVuZXJzLmZvckVhY2gobGlzdGVuZXIgPT4gbGlzdGVuZXIoKSlcbiAgICB9XG5cbiAgICBwcml2YXRlIGFycmF5c0VxdWFsKGE6IHN0cmluZ1tdLCBiOiBzdHJpbmdbXSk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAoYS5sZW5ndGggIT09IGIubGVuZ3RoKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGFbaV0gIT09IGJbaV0pXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdGlmICghKG1vZHVsZUlkIGluIF9fd2VicGFja19tb2R1bGVzX18pKSB7XG5cdFx0ZGVsZXRlIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdFx0dmFyIGUgPSBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiICsgbW9kdWxlSWQgKyBcIidcIik7XG5cdFx0ZS5jb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnO1xuXHRcdHRocm93IGU7XG5cdH1cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJpbXBvcnQge0xvZ2dlcn0gZnJvbSBcIi4vU2VydmljZXMvTG9nZ2VyXCI7XG5pbXBvcnQge0F1dGhTZXJ2aWNlfSBmcm9tIFwiLi9TZXJ2aWNlcy9BdXRoU2VydmljZVwiO1xuaW1wb3J0IHtQcmV2aWV3QnV0dG9uVGVtcGxhdGV9IGZyb20gXCIuL0NvbXBvbmVudHMvUHJldmlld0J1dHRvblRlbXBsYXRlXCI7XG5pbXBvcnQge1Byb2dyYW1EYXRhU3RvcmV9IGZyb20gXCIuL1NlcnZpY2VzL1Byb2dyYW1EYXRhU3RvcmVcIjtcbmltcG9ydCB7RGlhbG9nQ29udGFpbmVyVGVtcGxhdGV9IGZyb20gXCIuL0NvbXBvbmVudHMvRGlhbG9nQ29udGFpbmVyVGVtcGxhdGVcIjtcbmltcG9ydCB7UGxheWJhY2tIYW5kbGVyfSBmcm9tIFwiLi9TZXJ2aWNlcy9QbGF5YmFja0hhbmRsZXJcIjtcbmltcG9ydCB7TGlzdEVsZW1lbnRGYWN0b3J5fSBmcm9tIFwiLi9MaXN0RWxlbWVudEZhY3RvcnlcIjtcbmltcG9ydCB7UG9wdXBUaXRsZVRlbXBsYXRlfSBmcm9tIFwiLi9Db21wb25lbnRzL1BvcHVwVGl0bGVUZW1wbGF0ZVwiO1xuaW1wb3J0IHtEYXRhRmV0Y2hlcn0gZnJvbSBcIi4vU2VydmljZXMvRGF0YUZldGNoZXJcIjtcbmltcG9ydCB7SXRlbVR5cGV9IGZyb20gXCIuL01vZGVscy9JdGVtVHlwZVwiO1xuaW1wb3J0IHsgUGx1Z2luU2V0dGluZ3MgfSBmcm9tIFwiLi9Nb2RlbHMvUGx1Z2luU2V0dGluZ3NcIjtcbmltcG9ydCB7U2VydmVyU2V0dGluZ3N9IGZyb20gXCIuL01vZGVscy9TZXJ2ZXJTZXR0aW5nc1wiO1xuaW1wb3J0IHtFbmRwb2ludHN9IGZyb20gXCIuL0VuZHBvaW50c1wiO1xuXG4vLyBsb2FkIGFuZCBpbmplY3QgaW5QbGF5ZXJQcmV2aWV3LmNzcyBpbnRvIHRoZSBwYWdlXG4vKlxuICogSW5qZWN0IHN0eWxlIHRvIGJlIHVzZWQgZm9yIHRoZSBwcmV2aWV3IHBvcHVwXG4gKi9cbmxldCBpblBsYXllclByZXZpZXdTdHlsZTogSFRNTFN0eWxlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJylcbmluUGxheWVyUHJldmlld1N0eWxlLmlkID0gJ2luUGxheWVyUHJldmlld1N0eWxlJ1xuaW5QbGF5ZXJQcmV2aWV3U3R5bGUudGV4dENvbnRlbnQgPSBgXG4uc2VsZWN0ZWRMaXN0SXRlbSB7XG4gICAgaGVpZ2h0OiBhdXRvO1xufVxuLnByZXZpZXdMaXN0SXRlbSB7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjsgXG4gICAgYWxpZ24taXRlbXM6IGZsZXgtc3RhcnQ7XG59XG4ucHJldmlld0xpc3RJdGVtQ29udGVudCB7XG4gICAgd2lkdGg6IDEwMCU7IFxuICAgIG1pbi1oZWlnaHQ6IDE1LjV2aDsgXG4gICAgcG9zaXRpb246IHJlbGF0aXZlOyBcbiAgICBkaXNwbGF5OiBmbGV4OyBcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xufVxuLnByZXZpZXdQb3B1cCB7XG4gICAgYW5pbWF0aW9uOiAxNDBtcyBlYXNlLW91dCAwcyAxIG5vcm1hbCBib3RoIHJ1bm5pbmcgc2NhbGV1cDsgXG4gICAgcG9zaXRpb246IGZpeGVkOyBcbiAgICBtYXJnaW46IDBweDsgXG4gICAgYm90dG9tOiAxLjV2aDsgXG4gICAgbGVmdDogNTB2dzsgXG4gICAgd2lkdGg6IDQ4dnc7XG59XG4ucHJldmlld1BvcHVwVGl0bGUge1xuICAgIG1heC1oZWlnaHQ6IDR2aDtcbn1cbi5wcmV2aWV3UG9wdXBTY3JvbGxlciB7XG4gICAgbWF4LWhlaWdodDogNjB2aDtcbn1cbi5wcmV2aWV3UXVpY2tBY3Rpb25Db250YWluZXIge1xuICAgIG1hcmdpbi1sZWZ0OiBhdXRvOyBcbiAgICBtYXJnaW4tcmlnaHQ6IDFlbTtcbn1cbi5wcmV2aWV3RXBpc29kZUNvbnRhaW5lciB7XG4gICAgd2lkdGg6IDEwMCU7XG59XG4ucHJldmlld0VwaXNvZGVUaXRsZSB7XG4gICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG59XG4ucHJldmlld0VwaXNvZGVJbWFnZUNhcmQge1xuICAgIG1heC13aWR0aDogMzAlO1xufVxuLnByZXZpZXdFcGlzb2RlRGVzY3JpcHRpb24ge1xuICAgIG1hcmdpbi1sZWZ0OiAwLjVlbTsgXG4gICAgbWFyZ2luLXRvcDogMWVtOyBcbiAgICBtYXJnaW4tcmlnaHQ6IDEuNWVtOyBcbiAgICBkaXNwbGF5OiBibG9jaztcbn1cbi5wcmV2aWV3RXBpc29kZURldGFpbHMge1xuICAgIG1hcmdpbi1sZWZ0OiAxZW07IFxuICAgIGp1c3RpZnktY29udGVudDogc3RhcnQgIWltcG9ydGFudDtcbn1cbi5ibHVyIHtcbiAgICBmaWx0ZXI6IGJsdXIoNnB4KTsgXG4gICAgdHJhbnNpdGlvbjogZmlsdGVyIDAuM3MgZWFzZTsgXG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xufVxuLmJsdXI6aG92ZXIge1xuICAgIGZpbHRlcjogYmx1cigwKTtcbn1cbi5wcmV2aWV3RXBpc29kZUltYWdlQ2FyZDpob3ZlciAuYmx1ciB7XG4gICAgZmlsdGVyOiBibHVyKDApO1xufVxuYFxuZG9jdW1lbnQ/LmhlYWQ/LmFwcGVuZENoaWxkKGluUGxheWVyUHJldmlld1N0eWxlKVxuXG4vLyBpbml0IHNlcnZpY2VzIGFuZCBoZWxwZXJzXG5jb25zdCBsb2dnZXI6IExvZ2dlciA9IG5ldyBMb2dnZXIoKVxuY29uc3QgYXV0aFNlcnZpY2U6IEF1dGhTZXJ2aWNlID0gbmV3IEF1dGhTZXJ2aWNlKClcbmNvbnN0IHByb2dyYW1EYXRhU3RvcmU6IFByb2dyYW1EYXRhU3RvcmUgPSBuZXcgUHJvZ3JhbURhdGFTdG9yZSgpXG5uZXcgRGF0YUZldGNoZXIocHJvZ3JhbURhdGFTdG9yZSwgYXV0aFNlcnZpY2UsIGxvZ2dlcilcbmNvbnN0IHBsYXliYWNrSGFuZGxlcjogUGxheWJhY2tIYW5kbGVyID0gbmV3IFBsYXliYWNrSGFuZGxlcihsb2dnZXIpXG5jb25zdCBsaXN0RWxlbWVudEZhY3RvcnkgPSBuZXcgTGlzdEVsZW1lbnRGYWN0b3J5KHBsYXliYWNrSGFuZGxlciwgcHJvZ3JhbURhdGFTdG9yZSlcblxuZnVuY3Rpb24gaW5pdGlhbGl6ZSgpIHtcbiAgICAvLyBFbnN1cmUgQXBpQ2xpZW50IGV4aXN0cyBhbmQgdXNlciBpcyBsb2dnZWQgaW5cbiAgICBpZiAodHlwZW9mIEFwaUNsaWVudCA9PT0gJ3VuZGVmaW5lZCcgfHwgIUFwaUNsaWVudC5nZXRDdXJyZW50VXNlcklkPy4oKSkge1xuICAgICAgICBzZXRUaW1lb3V0KGluaXRpYWxpemUsIDMwMCkgLy8gSW5jcmVhc2VkIHJldHJ5IGRlbGF5IHNsaWdodGx5XG4gICAgICAgIHJldHVyblxuICAgIH1cblxuICAgIEFwaUNsaWVudC5nZXRQbHVnaW5Db25maWd1cmF0aW9uKCc3MzgzM2Q1Zi0wYmNiLTQ1ZGMtYWI4Yi03Y2U2NjhmNDM0NWQnKVxuICAgICAgICAudGhlbigoY29uZmlnOiBQbHVnaW5TZXR0aW5ncykgPT4gcHJvZ3JhbURhdGFTdG9yZS5wbHVnaW5TZXR0aW5ncyA9IGNvbmZpZylcblxuICAgIGNvbnN0IHNlcnZlclNldHRpbmdzVXJsID0gQXBpQ2xpZW50LmdldFVybChgLyR7RW5kcG9pbnRzLkJBU0V9JHtFbmRwb2ludHMuU0VSVkVSX1NFVFRJTkdTfWApXG4gICAgQXBpQ2xpZW50LmFqYXgoeyB0eXBlOiAnR0VUJywgdXJsOiBzZXJ2ZXJTZXR0aW5nc1VybCwgZGF0YVR5cGU6ICdqc29uJyB9KVxuICAgICAgICAudGhlbigoY29uZmlnOiBTZXJ2ZXJTZXR0aW5ncykgPT4gcHJvZ3JhbURhdGFTdG9yZS5zZXJ2ZXJTZXR0aW5ncyA9IGNvbmZpZylcbn1cbmluaXRpYWxpemUoKVxuXG5jb25zdCB2aWRlb1BhdGhzOiBzdHJpbmdbXSA9IFsnL3ZpZGVvJ11cbmxldCBwcmV2aW91c1JvdXRlUGF0aDogc3RyaW5nID0gbnVsbFxubGV0IHByZXZpZXdDb250YWluZXJMb2FkZWQ6IGJvb2xlYW4gPSBmYWxzZVxubGV0IHBsYXliYWNrU3RhdGVVbnN1YnNjcmliZTogKCgpID0+IHZvaWQpIHwgbnVsbCA9IG51bGxcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3ZpZXdzaG93Jywgdmlld1Nob3dFdmVudEhhbmRsZXIpXG5cbmZ1bmN0aW9uIHZpZXdTaG93RXZlbnRIYW5kbGVyKCk6IHZvaWQge1xuICAgIGNvbnN0IGN1cnJlbnRSb3V0ZVBhdGg6IHN0cmluZyA9IGdldExvY2F0aW9uUGF0aCgpXG5cbiAgICBmdW5jdGlvbiBnZXRMb2NhdGlvblBhdGgoKTogc3RyaW5nIHtcbiAgICAgICAgY29uc3QgbG9jYXRpb246IHN0cmluZyA9IHdpbmRvdy5sb2NhdGlvbi50b1N0cmluZygpXG4gICAgICAgIGNvbnN0IGN1cnJlbnRSb3V0ZUluZGV4OiBudW1iZXIgPSBsb2NhdGlvbi5sYXN0SW5kZXhPZignLycpXG4gICAgICAgIHJldHVybiBsb2NhdGlvbi5zdWJzdHJpbmcoY3VycmVudFJvdXRlSW5kZXgpXG4gICAgfVxuXG4gICAgLy8gSW5pdGlhbCBhdHRlbXB0IHRvIGxvYWQgdGhlIHZpZGVvIHZpZXcgb3Igc2NoZWR1bGUgcmV0cmllcy5cbiAgICBhdHRlbXB0TG9hZFZpZGVvVmlldygpXG4gICAgcHJldmlvdXNSb3V0ZVBhdGggPSBjdXJyZW50Um91dGVQYXRoXG5cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIGF0dGVtcHRzIHRvIGxvYWQgdGhlIHZpZGVvIHZpZXcsIHJldHJ5aW5nIHVwIHRvIDMgdGltZXMgaWYgbmVjZXNzYXJ5LlxuICAgIGZ1bmN0aW9uIGF0dGVtcHRMb2FkVmlkZW9WaWV3KHJldHJ5Q291bnQgPSAwKTogdm9pZCB7XG4gICAgICAgIGlmICh2aWRlb1BhdGhzLmluY2x1ZGVzKGN1cnJlbnRSb3V0ZVBhdGgpKSB7XG4gICAgICAgICAgICBpZiAocHJvZ3JhbURhdGFTdG9yZS5kYXRhSXNBbGxvd2VkRm9yUHJldmlldykge1xuICAgICAgICAgICAgICAgIC8vIENoZWNrIGlmIHRoZSBwcmV2aWV3IGNvbnRhaW5lciBpcyBhbHJlYWR5IGxvYWRlZCBiZWZvcmUgbG9hZGluZ1xuICAgICAgICAgICAgICAgIGlmICghcHJldmlld0NvbnRhaW5lckxvYWRlZCAmJiAhaXNQcmV2aWV3QnV0dG9uQ3JlYXRlZCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGxvYWRWaWRlb1ZpZXcoKVxuICAgICAgICAgICAgICAgICAgICBwcmV2aWV3Q29udGFpbmVyTG9hZGVkID0gdHJ1ZSAvLyBTZXQgZmxhZyB0byB0cnVlIGFmdGVyIGxvYWRpbmdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHJldHJ5Q291bnQgPCAzKSB7IC8vIFJldHJ5IHVwIHRvIDMgdGltZXNcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmRlYnVnKGBSZXRyeSAjJHtyZXRyeUNvdW50ICsgMX1gKVxuICAgICAgICAgICAgICAgICAgICBhdHRlbXB0TG9hZFZpZGVvVmlldyhyZXRyeUNvdW50ICsgMSlcbiAgICAgICAgICAgICAgICB9LCAxMDAwMCkgLy8gV2FpdCAxMCBzZWNvbmRzIGZvciBlYWNoIHJldHJ5XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodmlkZW9QYXRocy5pbmNsdWRlcyhwcmV2aW91c1JvdXRlUGF0aCkpIHtcbiAgICAgICAgICAgIHVubG9hZFZpZGVvVmlldygpXG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gbG9hZFZpZGVvVmlldygpOiB2b2lkIHtcbiAgICAgICAgLy8gYWRkIHByZXZpZXcgYnV0dG9uIHRvIHRoZSBwYWdlXG4gICAgICAgIGNvbnN0IHBhcmVudDogSFRNTEVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYnV0dG9ucycpLmxhc3RFbGVtZW50Q2hpbGQucGFyZW50RWxlbWVudDsgLy8gbGFzdEVsZW1lbnRDaGlsZC5wYXJlbnRFbGVtZW50IGlzIHVzZWQgZm9yIGNhc3RpbmcgZnJvbSBFbGVtZW50IHRvIEhUTUxFbGVtZW50XG4gICAgICAgIFxuICAgICAgICBsZXQgaW5kZXg6IG51bWJlciA9IEFycmF5LmZyb20ocGFyZW50LmNoaWxkcmVuKS5maW5kSW5kZXgoKGNoaWxkOiBFbGVtZW50KTogYm9vbGVhbiA9PiBjaGlsZC5jbGFzc0xpc3QuY29udGFpbnMoXCJidG5Vc2VyUmF0aW5nXCIpKTtcbiAgICAgICAgLy8gaWYgaW5kZXggaXMgaW52YWxpZCB0cnkgdG8gdXNlIHRoZSBvbGQgcG9zaXRpb24gKHVzZWQgaW4gSmVsbHlmaW4gMTAuOC4xMilcbiAgICAgICAgaWYgKGluZGV4ID09PSAtMSlcbiAgICAgICAgICAgIGluZGV4ID0gQXJyYXkuZnJvbShwYXJlbnQuY2hpbGRyZW4pLmZpbmRJbmRleCgoY2hpbGQ6IEVsZW1lbnQpOiBib29sZWFuID0+IGNoaWxkLmNsYXNzTGlzdC5jb250YWlucyhcIm9zZFRpbWVUZXh0XCIpKVxuXG4gICAgICAgIGNvbnN0IHByZXZpZXdCdXR0b246IFByZXZpZXdCdXR0b25UZW1wbGF0ZSA9IG5ldyBQcmV2aWV3QnV0dG9uVGVtcGxhdGUocGFyZW50LCBpbmRleClcbiAgICAgICAgcHJldmlld0J1dHRvbi5yZW5kZXIocHJldmlld0J1dHRvbkNsaWNrSGFuZGxlcilcblxuICAgICAgICBmdW5jdGlvbiBwcmV2aWV3QnV0dG9uQ2xpY2tIYW5kbGVyKCk6IHZvaWQge1xuICAgICAgICAgICAgY29uc3QgZGlhbG9nQ29udGFpbmVyOiBEaWFsb2dDb250YWluZXJUZW1wbGF0ZSA9IG5ldyBEaWFsb2dDb250YWluZXJUZW1wbGF0ZShkb2N1bWVudC5ib2R5LCBkb2N1bWVudC5ib2R5LmNoaWxkcmVuLmxlbmd0aCAtIDEpXG4gICAgICAgICAgICBkaWFsb2dDb250YWluZXIucmVuZGVyKClcblxuICAgICAgICAgICAgY29uc3QgY29udGVudERpdjogSFRNTEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncG9wdXBDb250ZW50Q29udGFpbmVyJylcblxuICAgICAgICAgICAgY29uc3QgcG9wdXBUaXRsZTogUG9wdXBUaXRsZVRlbXBsYXRlID0gbmV3IFBvcHVwVGl0bGVUZW1wbGF0ZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncG9wdXBGb2N1c0NvbnRhaW5lcicpLCAtMSwgcHJvZ3JhbURhdGFTdG9yZSlcbiAgICAgICAgICAgIGxldCBzaG93aW5nU2Vhc29uTGlzdDogYm9vbGVhbiA9IGZhbHNlXG5cbiAgICAgICAgICAgIGNvbnN0IHJlbmRlclNlYXNvbkxpc3QgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgYWN0aXZlU2Vhc29uID0gcHJvZ3JhbURhdGFTdG9yZS5hY3RpdmVTZWFzb25cbiAgICAgICAgICAgICAgICBpZiAoIWFjdGl2ZVNlYXNvbikge1xuICAgICAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoJ05vIGFjdGl2ZSBzZWFzb24gZGF0YSBhdmFpbGFibGUgZm9yIHByZXZpZXcgbGlzdC4nLCBwcm9ncmFtRGF0YVN0b3JlKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2hvd2luZ1NlYXNvbkxpc3QgPSB0cnVlXG4gICAgICAgICAgICAgICAgcG9wdXBUaXRsZS5zZXRWaXNpYmxlKGZhbHNlKVxuICAgICAgICAgICAgICAgIGNvbnRlbnREaXYuaW5uZXJIVE1MID0gJydcbiAgICAgICAgICAgICAgICBsaXN0RWxlbWVudEZhY3RvcnkuY3JlYXRlU2Vhc29uRWxlbWVudHMocHJvZ3JhbURhdGFTdG9yZS5zZWFzb25zLCBjb250ZW50RGl2LCBhY3RpdmVTZWFzb24uSW5kZXhOdW1iZXIsIHBvcHVwVGl0bGUpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHJlbmRlckVwaXNvZGVMaXN0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgICAgIHNob3dpbmdTZWFzb25MaXN0ID0gZmFsc2VcbiAgICAgICAgICAgICAgICBjb250ZW50RGl2LmlubmVySFRNTCA9ICcnXG5cbiAgICAgICAgICAgICAgICBjb25zdCBpc1NodWZmbGVRdWV1ZSA9IHByb2dyYW1EYXRhU3RvcmUuaXNTaHVmZmxlQWN0aXZlKCkgJiYgcHJvZ3JhbURhdGFTdG9yZS5ub3dQbGF5aW5nUXVldWVJZHMubGVuZ3RoID4gMFxuXG4gICAgICAgICAgICAgICAgc3dpdGNoIChwcm9ncmFtRGF0YVN0b3JlLnR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBJdGVtVHlwZS5TZXJpZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc1NodWZmbGVRdWV1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvcHVwVGl0bGUuc2V0VGV4dCgnVXAgTmV4dCAoU2h1ZmZsZSBRdWV1ZSknKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvcHVwVGl0bGUuc2V0VmlzaWJsZSh0cnVlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGFsbEVwaXNvZGVzID0gcHJvZ3JhbURhdGFTdG9yZS5zZWFzb25zLmZsYXRNYXAoc2Vhc29uID0+IHNlYXNvbi5lcGlzb2RlcylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaXN0RWxlbWVudEZhY3RvcnkuY3JlYXRlRXBpc29kZUVsZW1lbnRzKGFsbEVwaXNvZGVzLCBjb250ZW50RGl2KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGFjdGl2ZVNlYXNvbiA9IHByb2dyYW1EYXRhU3RvcmUuYWN0aXZlU2Vhc29uXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWFjdGl2ZVNlYXNvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcignTm8gYWN0aXZlIHNlYXNvbiBkYXRhIGF2YWlsYWJsZSBmb3IgcHJldmlldyBsaXN0LicsIHByb2dyYW1EYXRhU3RvcmUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHBvcHVwVGl0bGUuc2V0VGV4dChhY3RpdmVTZWFzb24uc2Vhc29uTmFtZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvcHVwVGl0bGUuc2V0VmlzaWJsZSh0cnVlKVxuICAgICAgICAgICAgICAgICAgICAgICAgbGlzdEVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVwaXNvZGVFbGVtZW50cyhhY3RpdmVTZWFzb24uZXBpc29kZXMsIGNvbnRlbnREaXYpXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgSXRlbVR5cGUuTW92aWU6XG4gICAgICAgICAgICAgICAgICAgICAgICBwb3B1cFRpdGxlLnNldFRleHQoJycpXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3B1cFRpdGxlLnNldFZpc2libGUoZmFsc2UpXG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0RWxlbWVudEZhY3RvcnkuY3JlYXRlRXBpc29kZUVsZW1lbnRzKHByb2dyYW1EYXRhU3RvcmUubW92aWVzLmZpbHRlcihtb3ZpZSA9PiBtb3ZpZS5JZCA9PT0gcHJvZ3JhbURhdGFTdG9yZS5hY3RpdmVNZWRpYVNvdXJjZUlkKSwgY29udGVudERpdilcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgSXRlbVR5cGUuVmlkZW86XG4gICAgICAgICAgICAgICAgICAgICAgICBwb3B1cFRpdGxlLnNldFRleHQoJycpXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3B1cFRpdGxlLnNldFZpc2libGUoZmFsc2UpXG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0RWxlbWVudEZhY3RvcnkuY3JlYXRlRXBpc29kZUVsZW1lbnRzKHByb2dyYW1EYXRhU3RvcmUubW92aWVzLCBjb250ZW50RGl2KVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBJdGVtVHlwZS5Cb3hTZXQ6XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgSXRlbVR5cGUuRm9sZGVyOlxuICAgICAgICAgICAgICAgICAgICAgICAgcG9wdXBUaXRsZS5zZXRUZXh0KHByb2dyYW1EYXRhU3RvcmUuYm94U2V0TmFtZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvcHVwVGl0bGUuc2V0VmlzaWJsZSh0cnVlKVxuICAgICAgICAgICAgICAgICAgICAgICAgbGlzdEVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVwaXNvZGVFbGVtZW50cyhwcm9ncmFtRGF0YVN0b3JlLm1vdmllcywgY29udGVudERpdilcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gc2Nyb2xsIHRvIHRoZSBlcGlzb2RlIHRoYXQgaXMgY3VycmVudGx5IHBsYXlpbmdcbiAgICAgICAgICAgICAgICBjb25zdCBhY3RpdmVJdGVtID0gY29udGVudERpdi5xdWVyeVNlbGVjdG9yKCcuc2VsZWN0ZWRMaXN0SXRlbScpXG4gICAgICAgICAgICAgICAgaWYgKCFhY3RpdmVJdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihcIkNvdWxkbid0IGZpbmQgYWN0aXZlIG1lZGlhIHNvdXJjZSBlbGVtZW50IGluIHByZXZpZXcgbGlzdC4gVGhpcyBzaG91bGQgbmV2ZXIgaGFwcGVuXCIsIHByb2dyYW1EYXRhU3RvcmUpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGFjdGl2ZUl0ZW0/LnBhcmVudEVsZW1lbnQuc2Nyb2xsSW50b1ZpZXcoKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBwb3B1cFRpdGxlLnJlbmRlcigoZTogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICAgICAgICByZW5kZXJTZWFzb25MaXN0KClcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIHJlbmRlckVwaXNvZGVMaXN0KClcblxuICAgICAgICAgICAgaWYgKHBsYXliYWNrU3RhdGVVbnN1YnNjcmliZSlcbiAgICAgICAgICAgICAgICBwbGF5YmFja1N0YXRlVW5zdWJzY3JpYmUoKVxuICAgICAgICAgICAgcGxheWJhY2tTdGF0ZVVuc3Vic2NyaWJlID0gcHJvZ3JhbURhdGFTdG9yZS5zdWJzY3JpYmVQbGF5YmFja1N0YXRlQ2hhbmdlZCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHNob3dpbmdTZWFzb25MaXN0KVxuICAgICAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgICAgICBpZiAoIWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwb3B1cENvbnRlbnRDb250YWluZXInKSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICAgICAgcmVuZGVyRXBpc29kZUxpc3QoKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiB1bmxvYWRWaWRlb1ZpZXcoKTogdm9pZCB7XG4gICAgICAgIC8vIENsZWFyIG9sZCBkYXRhIGFuZCByZXNldCBwcmV2aWV3Q29udGFpbmVyTG9hZGVkIGZsYWdcbiAgICAgICAgYXV0aFNlcnZpY2Uuc2V0QXV0aEhlYWRlclZhbHVlKFwiXCIpXG5cbiAgICAgICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGlhbG9nQmFja2Ryb3BDb250YWluZXJcIikpXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGlhbG9nQmFja2Ryb3BDb250YWluZXJcIikpXG4gICAgICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRpYWxvZ0NvbnRhaW5lclwiKSlcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkaWFsb2dDb250YWluZXJcIikpXG4gICAgICAgIFxuICAgICAgICBwcmV2aWV3Q29udGFpbmVyTG9hZGVkID0gZmFsc2UgLy8gUmVzZXQgZmxhZyB3aGVuIHVubG9hZGluZ1xuICAgICAgICBpZiAocGxheWJhY2tTdGF0ZVVuc3Vic2NyaWJlKSB7XG4gICAgICAgICAgICBwbGF5YmFja1N0YXRlVW5zdWJzY3JpYmUoKVxuICAgICAgICAgICAgcGxheWJhY2tTdGF0ZVVuc3Vic2NyaWJlID0gbnVsbFxuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIGlzUHJldmlld0J1dHRvbkNyZWF0ZWQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYnV0dG9ucycpLnF1ZXJ5U2VsZWN0b3IoJyNwb3B1cFByZXZpZXdCdXR0b24nKSAhPT0gbnVsbFxuICAgIH1cbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==