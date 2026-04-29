/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./Web/Components/BaseTemplate.ts":
/*!****************************************!*\
  !*** ./Web/Components/BaseTemplate.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports) => {


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


/***/ }),

/***/ "./Web/Components/DialogContainerTemplate.ts":
/*!***************************************************!*\
  !*** ./Web/Components/DialogContainerTemplate.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


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


/***/ }),

/***/ "./Web/Components/EpisodeDetails.ts":
/*!******************************************!*\
  !*** ./Web/Components/EpisodeDetails.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


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


/***/ }),

/***/ "./Web/Components/ListElementTemplate.ts":
/*!***********************************************!*\
  !*** ./Web/Components/ListElementTemplate.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


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


/***/ }),

/***/ "./Web/Components/PopupTitleTemplate.ts":
/*!**********************************************!*\
  !*** ./Web/Components/PopupTitleTemplate.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


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


/***/ }),

/***/ "./Web/Components/PreviewButtonTemplate.ts":
/*!*************************************************!*\
  !*** ./Web/Components/PreviewButtonTemplate.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


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


/***/ }),

/***/ "./Web/Components/QuickActions/FavoriteIconTemplate.ts":
/*!*************************************************************!*\
  !*** ./Web/Components/QuickActions/FavoriteIconTemplate.ts ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


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


/***/ }),

/***/ "./Web/Components/QuickActions/PlayStateIconTemplate.ts":
/*!**************************************************************!*\
  !*** ./Web/Components/QuickActions/PlayStateIconTemplate.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


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


/***/ }),

/***/ "./Web/Components/SeasonListElementTemplate.ts":
/*!*****************************************************!*\
  !*** ./Web/Components/SeasonListElementTemplate.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


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


/***/ }),

/***/ "./Web/Endpoints.ts":
/*!**************************!*\
  !*** ./Web/Endpoints.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports) => {


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


/***/ }),

/***/ "./Web/ListElementFactory.ts":
/*!***********************************!*\
  !*** ./Web/ListElementFactory.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


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


/***/ }),

/***/ "./Web/Models/ItemType.ts":
/*!********************************!*\
  !*** ./Web/Models/ItemType.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports) => {


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


/***/ }),

/***/ "./Web/Models/PlaybackProgressInfo.ts":
/*!********************************************!*\
  !*** ./Web/Models/PlaybackProgressInfo.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports) => {


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


/***/ }),

/***/ "./Web/Models/PluginSettings.ts":
/*!**************************************!*\
  !*** ./Web/Models/PluginSettings.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DefaultPluginSettings = void 0;
const ItemType_1 = __webpack_require__(/*! ./ItemType */ "./Web/Models/ItemType.ts");
exports.DefaultPluginSettings = {
    EnabledItemTypes: [ItemType_1.ItemType.Series, ItemType_1.ItemType.BoxSet, ItemType_1.ItemType.Movie, ItemType_1.ItemType.Folder, ItemType_1.ItemType.Video],
    BlurDescription: false,
    BlurThumbnail: false,
};


/***/ }),

/***/ "./Web/Models/ServerSettings.ts":
/*!**************************************!*\
  !*** ./Web/Models/ServerSettings.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DefaultServerSettings = void 0;
exports.DefaultServerSettings = {
    MinResumePct: 5,
    MaxResumePct: 90,
    MinResumeDurationSeconds: 300
};


/***/ }),

/***/ "./Web/Services/AuthService.ts":
/*!*************************************!*\
  !*** ./Web/Services/AuthService.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports) => {


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


/***/ }),

/***/ "./Web/Services/DataFetcher.ts":
/*!*************************************!*\
  !*** ./Web/Services/DataFetcher.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


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
                // save the media id of the currently played video
                if (this.programDataStore.activeMediaSourceId !== playingInfo.MediaSourceId)
                    this.programDataStore.activeMediaSourceId = playingInfo.MediaSourceId;
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
                    const episode = this.programDataStore.getItemById(playingInfo.MediaSourceId);
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


/***/ }),

/***/ "./Web/Services/Logger.ts":
/*!********************************!*\
  !*** ./Web/Services/Logger.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports) => {


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


/***/ }),

/***/ "./Web/Services/PlaybackHandler.ts":
/*!*****************************************!*\
  !*** ./Web/Services/PlaybackHandler.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


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


/***/ }),

/***/ "./Web/Services/ProgramDataStore.ts":
/*!******************************************!*\
  !*** ./Web/Services/ProgramDataStore.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


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
        return this.seasons.find(season => season.episodes.some(episode => episode.Id === this.activeMediaSourceId));
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


/***/ })

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
                showingSeasonList = true;
                popupTitle.setVisible(false);
                contentDiv.innerHTML = '';
                listElementFactory.createSeasonElements(programDataStore.seasons, contentDiv, programDataStore.activeSeason.IndexNumber, popupTitle);
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
                        popupTitle.setText(programDataStore.activeSeason.seasonName);
                        popupTitle.setVisible(true);
                        listElementFactory.createEpisodeElements(programDataStore.activeSeason.episodes, contentDiv);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Z0JBQzNFLElBQUksaUJBQWlCO29CQUNqQixPQUFNO2dCQUNWLElBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLHVCQUF1QixDQUFDO29CQUNqRCxPQUFNO2dCQUNWLGlCQUFpQixFQUFFO1lBQ3ZCLENBQUMsQ0FBQztRQUNOLENBQUM7SUFDTCxDQUFDO0lBQ0QsU0FBUyxlQUFlO1FBQ3BCLHVEQUF1RDtRQUN2RCxXQUFXLENBQUMsa0JBQWtCLENBQUMsRUFBRSxDQUFDO1FBRWxDLElBQUksUUFBUSxDQUFDLGNBQWMsQ0FBQyx5QkFBeUIsQ0FBQztZQUNsRCxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLHlCQUF5QixDQUFDLENBQUM7UUFDakYsSUFBSSxRQUFRLENBQUMsY0FBYyxDQUFDLGlCQUFpQixDQUFDO1lBQzFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUV6RSxzQkFBc0IsR0FBRyxLQUFLLEVBQUMsNEJBQTRCO1FBQzNELElBQUksd0JBQXdCLEVBQUU7WUFDMUIsd0JBQXdCLEVBQUU7WUFDMUIsd0JBQXdCLEdBQUcsSUFBSTtTQUNsQztJQUNMLENBQUM7SUFFRCxTQUFTLHNCQUFzQjtRQUMzQixPQUFPLFFBQVEsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUMsYUFBYSxDQUFDLHFCQUFxQixDQUFDLEtBQUssSUFBSTtJQUMzRixDQUFDO0FBQ0wsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL1dlYi9Db21wb25lbnRzL0Jhc2VUZW1wbGF0ZS50cyIsIndlYnBhY2s6Ly8vLi9XZWIvQ29tcG9uZW50cy9EaWFsb2dDb250YWluZXJUZW1wbGF0ZS50cyIsIndlYnBhY2s6Ly8vLi9XZWIvQ29tcG9uZW50cy9FcGlzb2RlRGV0YWlscy50cyIsIndlYnBhY2s6Ly8vLi9XZWIvQ29tcG9uZW50cy9MaXN0RWxlbWVudFRlbXBsYXRlLnRzIiwid2VicGFjazovLy8uL1dlYi9Db21wb25lbnRzL1BvcHVwVGl0bGVUZW1wbGF0ZS50cyIsIndlYnBhY2s6Ly8vLi9XZWIvQ29tcG9uZW50cy9QcmV2aWV3QnV0dG9uVGVtcGxhdGUudHMiLCJ3ZWJwYWNrOi8vLy4vV2ViL0NvbXBvbmVudHMvUXVpY2tBY3Rpb25zL0Zhdm9yaXRlSWNvblRlbXBsYXRlLnRzIiwid2VicGFjazovLy8uL1dlYi9Db21wb25lbnRzL1F1aWNrQWN0aW9ucy9QbGF5U3RhdGVJY29uVGVtcGxhdGUudHMiLCJ3ZWJwYWNrOi8vLy4vV2ViL0NvbXBvbmVudHMvU2Vhc29uTGlzdEVsZW1lbnRUZW1wbGF0ZS50cyIsIndlYnBhY2s6Ly8vLi9XZWIvRW5kcG9pbnRzLnRzIiwid2VicGFjazovLy8uL1dlYi9MaXN0RWxlbWVudEZhY3RvcnkudHMiLCJ3ZWJwYWNrOi8vLy4vV2ViL01vZGVscy9JdGVtVHlwZS50cyIsIndlYnBhY2s6Ly8vLi9XZWIvTW9kZWxzL1BsYXliYWNrUHJvZ3Jlc3NJbmZvLnRzIiwid2VicGFjazovLy8uL1dlYi9Nb2RlbHMvUGx1Z2luU2V0dGluZ3MudHMiLCJ3ZWJwYWNrOi8vLy4vV2ViL01vZGVscy9TZXJ2ZXJTZXR0aW5ncy50cyIsIndlYnBhY2s6Ly8vLi9XZWIvU2VydmljZXMvQXV0aFNlcnZpY2UudHMiLCJ3ZWJwYWNrOi8vLy4vV2ViL1NlcnZpY2VzL0RhdGFGZXRjaGVyLnRzIiwid2VicGFjazovLy8uL1dlYi9TZXJ2aWNlcy9Mb2dnZXIudHMiLCJ3ZWJwYWNrOi8vLy4vV2ViL1NlcnZpY2VzL1BsYXliYWNrSGFuZGxlci50cyIsIndlYnBhY2s6Ly8vLi9XZWIvU2VydmljZXMvUHJvZ3JhbURhdGFTdG9yZS50cyIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vV2ViL0luUGxheWVyUHJldmlldy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgYWJzdHJhY3QgY2xhc3MgQmFzZVRlbXBsYXRlIHtcbiAgICAvKlxuICAgICAqIHRoZSBIVE1MIGJhc2VkIElEIG9mIHRoZSBuZXcgZ2VuZXJhdGVkIEVsZW1lbnRcbiAgICAgKi9cbiAgICBwcml2YXRlIGVsZW1lbnRJZDogc3RyaW5nO1xuXG4gICAgcHJvdGVjdGVkIGNvbnN0cnVjdG9yKHByaXZhdGUgY29udGFpbmVyOiBIVE1MRWxlbWVudCwgcHJpdmF0ZSBwb3NpdGlvbkFmdGVySW5kZXg6IG51bWJlcikgeyB9XG5cbiAgICBwdWJsaWMgZ2V0Q29udGFpbmVyKCk6IEhUTUxFbGVtZW50IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udGFpbmVyO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRQb3NpdGlvbkFmdGVySW5kZXgoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucG9zaXRpb25BZnRlckluZGV4O1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBzZXRFbGVtZW50SWQoZWxlbWVudElkOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5lbGVtZW50SWQgPSBlbGVtZW50SWQ7XG4gICAgfVxuXG4gICAgcHVibGljIGdldEVsZW1lbnRJZCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50SWQ7XG4gICAgfVxuICAgIFxuICAgIHB1YmxpYyBnZXRFbGVtZW50KCk6IEhUTUxFbGVtZW50IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Q29udGFpbmVyKCkucXVlcnlTZWxlY3RvcihgIyR7dGhpcy5nZXRFbGVtZW50SWQoKX1gKTtcbiAgICB9XG5cbiAgICBhYnN0cmFjdCBnZXRUZW1wbGF0ZSguLi5jbGlja0hhbmRsZXJzOiBGdW5jdGlvbltdKTogc3RyaW5nO1xuXG4gICAgYWJzdHJhY3QgcmVuZGVyKC4uLmNsaWNrSGFuZGxlcnM6IEZ1bmN0aW9uW10pOiB2b2lkO1xuXG4gICAgcHJvdGVjdGVkIGFkZEVsZW1lbnRUb0NvbnRhaW5lciguLi5jbGlja0hhbmRsZXJzOiBGdW5jdGlvbltdKTogSFRNTEVsZW1lbnQge1xuICAgICAgICAvLyBBZGQgRWxlbWVudCBhcyB0aGUgZmlyc3QgY2hpbGQgaWYgcG9zaXRpb24gaXMgbmVnYXRpdmVcbiAgICAgICAgaWYgKHRoaXMuZ2V0UG9zaXRpb25BZnRlckluZGV4KCkgPCAwICYmIHRoaXMuZ2V0Q29udGFpbmVyKCkuaGFzQ2hpbGROb2RlcygpKSB7XG4gICAgICAgICAgICB0aGlzLmdldENvbnRhaW5lcigpLmZpcnN0RWxlbWVudENoaWxkLmJlZm9yZSh0aGlzLnN0cmluZ1RvTm9kZSh0aGlzLmdldFRlbXBsYXRlKC4uLmNsaWNrSGFuZGxlcnMpKSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRFbGVtZW50KCk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIEFkZCBFbGVtZW50IGlmIGNvbnRhaW5lciBpcyBlbXB0eVxuICAgICAgICBpZiAoIXRoaXMuZ2V0Q29udGFpbmVyKCkuaGFzQ2hpbGROb2RlcygpKSB7XG4gICAgICAgICAgICB0aGlzLmdldENvbnRhaW5lcigpLmlubmVySFRNTCA9IHRoaXMuZ2V0VGVtcGxhdGUoLi4uY2xpY2tIYW5kbGVycyk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRFbGVtZW50KCk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY2hpbGRCZWZvcmUgPSB0aGlzLmdldENvbnRhaW5lcigpLmxhc3RFbGVtZW50Q2hpbGRcbiAgICAgICAgaWYgKHRoaXMuZ2V0Q29udGFpbmVyKCkuY2hpbGRyZW4ubGVuZ3RoID4gdGhpcy5nZXRQb3NpdGlvbkFmdGVySW5kZXgoKSAmJiB0aGlzLmdldFBvc2l0aW9uQWZ0ZXJJbmRleCgpID49IDApXG4gICAgICAgICAgICBjaGlsZEJlZm9yZSA9IHRoaXMuZ2V0Q29udGFpbmVyKCkuY2hpbGRyZW5bdGhpcy5nZXRQb3NpdGlvbkFmdGVySW5kZXgoKV07XG4gICAgICAgIFxuICAgICAgICBjaGlsZEJlZm9yZS5hZnRlcih0aGlzLnN0cmluZ1RvTm9kZSh0aGlzLmdldFRlbXBsYXRlKC4uLmNsaWNrSGFuZGxlcnMpKSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RWxlbWVudCgpO1xuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIHN0cmluZ1RvTm9kZSh0ZW1wbGF0ZVN0cmluZzogc3RyaW5nKTogTm9kZSB7XG4gICAgICAgIGxldCBwbGFjZWhvbGRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBwbGFjZWhvbGRlci5pbm5lckhUTUwgPSB0ZW1wbGF0ZVN0cmluZztcbiAgICAgICAgcmV0dXJuIHBsYWNlaG9sZGVyLmZpcnN0RWxlbWVudENoaWxkO1xuICAgIH1cbn0iLCJpbXBvcnQge0Jhc2VUZW1wbGF0ZX0gZnJvbSBcIi4vQmFzZVRlbXBsYXRlXCI7XG5cbmV4cG9ydCBjbGFzcyBEaWFsb2dDb250YWluZXJUZW1wbGF0ZSBleHRlbmRzIEJhc2VUZW1wbGF0ZSB7XG4gICAgZGlhbG9nQmFja2Ryb3BJZCA9ICdkaWFsb2dCYWNrZHJvcCdcbiAgICBkaWFsb2dDb250YWluZXJJZCA9ICdkaWFsb2dDb250YWluZXInXG4gICAgcG9wdXBDb250ZW50Q29udGFpbmVySWQgPSAncG9wdXBDb250ZW50Q29udGFpbmVyJ1xuICAgIHBvcHVwRm9jdXNDb250YWluZXJJZCA9ICdwb3B1cEZvY3VzQ29udGFpbmVyJ1xuICAgIFxuICAgIGNvbnN0cnVjdG9yKGNvbnRhaW5lcjogSFRNTEVsZW1lbnQsIHBvc2l0aW9uQWZ0ZXJJbmRleDogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKGNvbnRhaW5lciwgcG9zaXRpb25BZnRlckluZGV4KTtcbiAgICAgICAgdGhpcy5zZXRFbGVtZW50SWQoJ3ByZXZpZXdQb3B1cCcpO1xuICAgIH1cblxuICAgIGdldFRlbXBsYXRlKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBgXG4gICAgICAgICAgICA8ZGl2IGlkPVwiJHt0aGlzLmdldEVsZW1lbnRJZCgpfVwiPlxuICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCIke3RoaXMuZGlhbG9nQmFja2Ryb3BJZH1cIiBjbGFzcz1cImRpYWxvZ0JhY2tkcm9wIGRpYWxvZ0JhY2tkcm9wT3BlbmVkXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBpZD1cIiR7dGhpcy5kaWFsb2dDb250YWluZXJJZH1cIiBjbGFzcz1cImRpYWxvZ0NvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPVwiJHt0aGlzLnBvcHVwRm9jdXNDb250YWluZXJJZH1cIiBcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVwiZm9jdXNjb250YWluZXIgZGlhbG9nIGFjdGlvbnNoZWV0LW5vdC1mdWxsc2NyZWVuIGFjdGlvblNoZWV0IGNlbnRlcmVkRGlhbG9nIG9wZW5lZCBwcmV2aWV3UG9wdXAgYWN0aW9uU2hlZXRDb250ZW50XCIgXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLWhpc3Rvcnk9XCJ0cnVlXCIgXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLXJlbW92ZW9uY2xvc2U9XCJ0cnVlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPVwiJHt0aGlzLnBvcHVwQ29udGVudENvbnRhaW5lcklkfVwiIGNsYXNzPVwiYWN0aW9uU2hlZXRTY3JvbGxlciBzY3JvbGxZIHByZXZpZXdQb3B1cFNjcm9sbGVyXCIvPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICBgO1xuICAgIH1cblxuICAgIHB1YmxpYyByZW5kZXIoKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHJlbmRlcmVkRWxlbWVudDogSFRNTEVsZW1lbnQgPSB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcigpO1xuICAgICAgICByZW5kZXJlZEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZTogTW91c2VFdmVudCk6IGFueSA9PiB7XG4gICAgICAgICAgICB0aGlzLmdldENvbnRhaW5lcigpLnJlbW92ZUNoaWxkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuZ2V0RWxlbWVudElkKCkpKVxuICAgICAgICB9KTtcbiAgICB9XG59IiwiaW1wb3J0IHtCYXNlVGVtcGxhdGV9IGZyb20gXCIuL0Jhc2VUZW1wbGF0ZVwiO1xuaW1wb3J0IHtCYXNlSXRlbX0gZnJvbSBcIi4uL01vZGVscy9FcGlzb2RlXCI7XG5cbmV4cG9ydCBjbGFzcyBFcGlzb2RlRGV0YWlsc1RlbXBsYXRlIGV4dGVuZHMgQmFzZVRlbXBsYXRlIHtcbiAgICBjb25zdHJ1Y3Rvcihjb250YWluZXI6IEhUTUxFbGVtZW50LCBwb3NpdGlvbkFmdGVySW5kZXg6IG51bWJlciwgcHJpdmF0ZSBlcGlzb2RlOiBCYXNlSXRlbSkge1xuICAgICAgICBzdXBlcihjb250YWluZXIsIHBvc2l0aW9uQWZ0ZXJJbmRleCk7XG4gICAgICAgIHRoaXMuc2V0RWxlbWVudElkKGBlcGlzb2RlLSR7ZXBpc29kZS5JZH1gKTtcbiAgICB9XG5cbiAgICBnZXRUZW1wbGF0ZSgpOiBzdHJpbmcge1xuICAgICAgICAvLyBsYW5ndWFnZT1IVE1MXG4gICAgICAgIHJldHVybiBgXG4gICAgICAgICAgICA8ZGl2IGlkPVwiJHt0aGlzLmdldEVsZW1lbnRJZCgpfS1kZXRhaWxzXCIgY2xhc3M9XCJpdGVtTWlzY0luZm8gaXRlbU1pc2NJbmZvLXByaW1hcnkgcHJldmlld0VwaXNvZGVEZXRhaWxzXCI+XG4gICAgICAgICAgICAgICAgJHt0aGlzLmVwaXNvZGUuUHJlbWllcmVEYXRlID8gYDxkaXYgY2xhc3M9XCJtZWRpYUluZm9JdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgICR7KG5ldyBEYXRlKHRoaXMuZXBpc29kZS5QcmVtaWVyZURhdGUpKS50b0xvY2FsZURhdGVTdHJpbmcodGhpcy5nZXRMb2NhbGUoKSl9XG4gICAgICAgICAgICAgICAgPC9kaXY+YCA6ICcnfVxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtZWRpYUluZm9JdGVtXCI+JHt0aGlzLmZvcm1hdFJ1blRpbWUodGhpcy5lcGlzb2RlLlJ1blRpbWVUaWNrcyl9PC9kaXY+XG4gICAgICAgICAgICAgICAgJHt0aGlzLmVwaXNvZGUuQ29tbXVuaXR5UmF0aW5nID8gYDxkaXYgY2xhc3M9XCJzdGFyUmF0aW5nQ29udGFpbmVyIG1lZGlhSW5mb0l0ZW1cIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJtYXRlcmlhbC1pY29ucyBzdGFySWNvbiBzdGFyXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAke3RoaXMuZXBpc29kZS5Db21tdW5pdHlSYXRpbmcudG9GaXhlZCgxKX1cbiAgICAgICAgICAgICAgICA8L2Rpdj5gIDogJyd9XG4gICAgICAgICAgICAgICAgJHt0aGlzLmVwaXNvZGUuQ3JpdGljUmF0aW5nID8gYDxkaXYgY2xhc3M9XCJtZWRpYUluZm9JdGVtIG1lZGlhSW5mb0NyaXRpY1JhdGluZyAke3RoaXMuZXBpc29kZS5Dcml0aWNSYXRpbmcgPj0gNjAgPyAnbWVkaWFJbmZvQ3JpdGljUmF0aW5nRnJlc2gnIDogJ21lZGlhSW5mb0NyaXRpY1JhdGluZ1JvdHRlbid9XCI+XG4gICAgICAgICAgICAgICAgICAgICR7dGhpcy5lcGlzb2RlLkNyaXRpY1JhdGluZ31cbiAgICAgICAgICAgICAgICA8L2Rpdj5gIDogJyd9XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImVuZHNBdCBtZWRpYUluZm9JdGVtXCI+JHt0aGlzLmZvcm1hdEVuZFRpbWUodGhpcy5lcGlzb2RlLlJ1blRpbWVUaWNrcywgdGhpcy5lcGlzb2RlLlVzZXJEYXRhLlBsYXliYWNrUG9zaXRpb25UaWNrcyl9PC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgYDtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVuZGVyKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcigpO1xuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIGdldExvY2FsZSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gbmF2aWdhdG9yLmxhbmd1YWdlc1xuICAgICAgICAgICAgPyBuYXZpZ2F0b3IubGFuZ3VhZ2VzWzBdIC8vIEB0cy1pZ25vcmUgZm9yIHVzZXJMYW5ndWFnZSAodGhpcyBhZGRzIHN1cHBvcnQgZm9yIElFKSBUT0RPOiBNb3ZlIHRvIGludGVyZmFjZVxuICAgICAgICAgICAgOiAobmF2aWdhdG9yLmxhbmd1YWdlIHx8IG5hdmlnYXRvci51c2VyTGFuZ3VhZ2UpO1xuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIGZvcm1hdFJ1blRpbWUodGlja3M6IG51bWJlcik6IHN0cmluZyB7XG4gICAgICAgIC8vIGZvcm1hdCB0aGUgdGlja3MgdG8gYSBzdHJpbmcgd2l0aCBtaW51dGVzIGFuZCBob3Vyc1xuICAgICAgICB0aWNrcyAvPSAxMDAwMDsgLy8gY29udmVydCBmcm9tIG1pY3Jvc2Vjb25kcyB0byBtaWxsaXNlY29uZHNcbiAgICAgICAgbGV0IGhvdXJzOiBudW1iZXIgPSBNYXRoLmZsb29yKCh0aWNrcyAvIDEwMDAgLyAzNjAwKSAlIDI0KTtcbiAgICAgICAgbGV0IG1pbnV0ZXM6IG51bWJlciA9IE1hdGguZmxvb3IoKHRpY2tzIC8gMTAwMCAvIDYwKSAlIDYwKTtcbiAgICAgICAgbGV0IGhvdXJzU3RyaW5nOiBzdHJpbmcgPSBob3VycyA+IDAgPyBgJHtob3Vyc31oIGAgOiAnJztcbiAgICAgICAgcmV0dXJuIGAke2hvdXJzU3RyaW5nfSR7bWludXRlc31tYDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGZvcm1hdEVuZFRpbWUocnVudGltZVRpY2tzOiBudW1iZXIsIHBsYXliYWNrUG9zaXRpb25UaWNrczogbnVtYmVyKTogc3RyaW5nIHtcbiAgICAgICAgLy8gY29udmVydCBmcm9tIG1pY3Jvc2Vjb25kcyB0byBtaWxsaXNlY29uZHNcbiAgICAgICAgcnVudGltZVRpY2tzIC89IDEwMDAwO1xuICAgICAgICBwbGF5YmFja1Bvc2l0aW9uVGlja3MgLz0gMTAwMDA7XG4gICAgICAgIFxuICAgICAgICBsZXQgdGlja3M6IG51bWJlciA9IERhdGUubm93KCkgKyAocnVudGltZVRpY2tzKTtcbiAgICAgICAgdGlja3MgLT0gKG5ldyBEYXRlKCkpLmdldFRpbWV6b25lT2Zmc2V0KCkgKiA2MCAqIDEwMDA7IC8vIGFkanVzdCBmb3IgdGltZXpvbmVcbiAgICAgICAgdGlja3MgLT0gcGxheWJhY2tQb3NpdGlvblRpY2tzOyAvLyBzdWJ0cmFjdCB0aGUgcGxheWJhY2sgcG9zaXRpb25cbiAgICAgICAgXG4gICAgICAgIGxldCBob3Vyczogc3RyaW5nID0gdGhpcy56ZXJvUGFkKE1hdGguZmxvb3IoKHRpY2tzIC8gMTAwMCAvIDM2MDApICUgMjQpKTtcbiAgICAgICAgbGV0IG1pbnV0ZXM6IHN0cmluZyA9IHRoaXMuemVyb1BhZChNYXRoLmZsb29yKCh0aWNrcyAvIDEwMDAgLyA2MCkgJSA2MCkpO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGBFbmRzIGF0ICR7aG91cnN9OiR7bWludXRlc31gO1xuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIHplcm9QYWQobnVtOiBudW1iZXIsIHBsYWNlczogbnVtYmVyID0gMik6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBTdHJpbmcobnVtKS5wYWRTdGFydChwbGFjZXMsICcwJyk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHtCYXNlVGVtcGxhdGV9IGZyb20gXCIuL0Jhc2VUZW1wbGF0ZVwiXG5pbXBvcnQge0Zhdm9yaXRlSWNvblRlbXBsYXRlfSBmcm9tIFwiLi9RdWlja0FjdGlvbnMvRmF2b3JpdGVJY29uVGVtcGxhdGVcIlxuaW1wb3J0IHtQbGF5U3RhdGVJY29uVGVtcGxhdGV9IGZyb20gXCIuL1F1aWNrQWN0aW9ucy9QbGF5U3RhdGVJY29uVGVtcGxhdGVcIlxuaW1wb3J0IHtQbGF5YmFja0hhbmRsZXJ9IGZyb20gXCIuLi9TZXJ2aWNlcy9QbGF5YmFja0hhbmRsZXJcIlxuaW1wb3J0IHtFcGlzb2RlRGV0YWlsc1RlbXBsYXRlfSBmcm9tIFwiLi9FcGlzb2RlRGV0YWlsc1wiXG5pbXBvcnQge1Byb2dyYW1EYXRhU3RvcmV9IGZyb20gXCIuLi9TZXJ2aWNlcy9Qcm9ncmFtRGF0YVN0b3JlXCJcbmltcG9ydCB7QmFzZUl0ZW19IGZyb20gXCIuLi9Nb2RlbHMvRXBpc29kZVwiXG5pbXBvcnQge0l0ZW1UeXBlfSBmcm9tIFwiLi4vTW9kZWxzL0l0ZW1UeXBlXCJcblxuZXhwb3J0IGNsYXNzIExpc3RFbGVtZW50VGVtcGxhdGUgZXh0ZW5kcyBCYXNlVGVtcGxhdGUge1xuICAgIHByaXZhdGUgcmVhZG9ubHkgcXVpY2tBY3Rpb25Db250YWluZXI6IEhUTUxFbGVtZW50XG4gICAgcHJpdmF0ZSBwbGF5U3RhdGVJY29uOiBQbGF5U3RhdGVJY29uVGVtcGxhdGVcbiAgICBwcml2YXRlIGZhdm9yaXRlSWNvbjogRmF2b3JpdGVJY29uVGVtcGxhdGVcblxuICAgIGNvbnN0cnVjdG9yKGNvbnRhaW5lcjogSFRNTEVsZW1lbnQsIHBvc2l0aW9uQWZ0ZXJJbmRleDogbnVtYmVyLCBwcml2YXRlIGl0ZW06IEJhc2VJdGVtLCBwcml2YXRlIHBsYXliYWNrSGFuZGxlcjogUGxheWJhY2tIYW5kbGVyLCBwcml2YXRlIHByb2dyYW1EYXRhU3RvcmU6IFByb2dyYW1EYXRhU3RvcmUpIHtcbiAgICAgICAgc3VwZXIoY29udGFpbmVyLCBwb3NpdGlvbkFmdGVySW5kZXgpXG4gICAgICAgIHRoaXMuc2V0RWxlbWVudElkKGBlcGlzb2RlLSR7aXRlbS5JZH1gKVxuXG4gICAgICAgIC8vIGNyZWF0ZSB0ZW1wIHF1aWNrIGFjdGlvbiBjb250YWluZXJcbiAgICAgICAgdGhpcy5xdWlja0FjdGlvbkNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG5cbiAgICAgICAgLy8gY3JlYXRlIHF1aWNrIGFjdGlvbnNcbiAgICAgICAgdGhpcy5wbGF5U3RhdGVJY29uID0gbmV3IFBsYXlTdGF0ZUljb25UZW1wbGF0ZSh0aGlzLnF1aWNrQWN0aW9uQ29udGFpbmVyLCAtMSwgdGhpcy5pdGVtKVxuICAgICAgICB0aGlzLmZhdm9yaXRlSWNvbiA9IG5ldyBGYXZvcml0ZUljb25UZW1wbGF0ZSh0aGlzLnF1aWNrQWN0aW9uQ29udGFpbmVyLCAwLCB0aGlzLml0ZW0pXG4gICAgfVxuXG4gICAgZ2V0VGVtcGxhdGUoKTogc3RyaW5nIHtcbiAgICAgICAgLy8gYWRkIHF1aWNrIGFjdGlvbnNcbiAgICAgICAgdGhpcy5wbGF5U3RhdGVJY29uLnJlbmRlcigpXG4gICAgICAgIHRoaXMuZmF2b3JpdGVJY29uLnJlbmRlcigpXG5cbiAgICAgICAgLy8gYWRkIGVwaXNvZGUgZGV0YWlscy9pbmZvXG4gICAgICAgIGNvbnN0IGRldGFpbHNDb250YWluZXI6IEhUTUxEaXZFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICAgICAgY29uc3QgZGV0YWlsczogRXBpc29kZURldGFpbHNUZW1wbGF0ZSA9IG5ldyBFcGlzb2RlRGV0YWlsc1RlbXBsYXRlKGRldGFpbHNDb250YWluZXIsIC0xLCB0aGlzLml0ZW0pXG4gICAgICAgIGRldGFpbHMucmVuZGVyKClcblxuICAgICAgICBjb25zdCBiYWNrZ3JvdW5kSW1hZ2VTdHlsZTogc3RyaW5nID0gYGJhY2tncm91bmQtaW1hZ2U6IHVybCgnLi4vSXRlbXMvJHt0aGlzLml0ZW0uSWR9L0ltYWdlcy9QcmltYXJ5P3RhZz0ke3RoaXMuaXRlbS5JbWFnZVRhZ3MuUHJpbWFyeX0nKWBcblxuICAgICAgICAvLyBsYW5ndWFnZT1IVE1MXG4gICAgICAgIHJldHVybiBgXG4gICAgICAgICAgICAgPGRpdiBpZD1cIiR7dGhpcy5nZXRFbGVtZW50SWQoKX1cIlxuICAgICAgICAgICAgICAgICAgY2xhc3M9XCJsaXN0SXRlbSBsaXN0SXRlbS1idXR0b24gYWN0aW9uU2hlZXRNZW51SXRlbSBlbWJ5LWJ1dHRvbiBwcmV2aWV3TGlzdEl0ZW1cIlxuICAgICAgICAgICAgICAgICAgaXM9XCJlbWJ5LWJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICBkYXRhLWlkPVwiJHt0aGlzLml0ZW0uSWR9XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInByZXZpZXdFcGlzb2RlQ29udGFpbmVyIGZsZXhcIj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImxpc3RJdGVtIHByZXZpZXdFcGlzb2RlVGl0bGVcIiB0eXBlPVwiYnV0dG9uXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAkeyhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pdGVtLkluZGV4TnVtYmVyICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvZ3JhbURhdGFTdG9yZS50eXBlICE9PSBJdGVtVHlwZS5Nb3ZpZVxuICAgICAgICAgICAgICAgICAgICAgICAgKSA/IGA8c3Bhbj4ke3RoaXMuaXRlbS5JbmRleE51bWJlcn08L3NwYW4+YCA6ICcnfVxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImxpc3RJdGVtQm9keSBhY3Rpb25zaGVldExpc3RJdGVtQm9keVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiYWN0aW9uU2hlZXRJdGVtVGV4dFwiPiR7dGhpcy5pdGVtLk5hbWV9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicHJldmlld1F1aWNrQWN0aW9uQ29udGFpbmVyIGZsZXhcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICR7dGhpcy5xdWlja0FjdGlvbkNvbnRhaW5lci5pbm5lckhUTUx9XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInByZXZpZXdMaXN0SXRlbUNvbnRlbnQgaGlkZVwiPlxuICAgICAgICAgICAgICAgICAgICAke2RldGFpbHNDb250YWluZXIuaW5uZXJIVE1MfVxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmxleFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNhcmQgb3ZlcmZsb3dCYWNrZHJvcENhcmQgY2FyZC1ob3ZlcmFibGUgY2FyZC13aXRodXNlcmRhdGEgcHJldmlld0VwaXNvZGVJbWFnZUNhcmRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2FyZEJveFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2FyZFNjYWxhYmxlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2FyZFBhZGRlciBjYXJkUGFkZGVyLW92ZXJmbG93QmFja2Ryb3AgbGF6eS1oaWRkZW4tY2hpbGRyZW5cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImNhcmRJbWFnZUljb24gbWF0ZXJpYWwtaWNvbnMgdHZcIiBhcmlhLWhpZGRlbj1cInRydWVcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJwcmV2aWV3RXBpc29kZUltYWdlQ2FyZC0ke3RoaXMuaXRlbS5JZH1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cImNhcmRJbWFnZUNvbnRhaW5lciBjYXJkQ29udGVudCBpdGVtQWN0aW9uIGxhenkgYmx1cmhhc2hlZCBsYXp5LWltYWdlLWZhZGVpbi1mYXN0ICR7dGhpcy5wcm9ncmFtRGF0YVN0b3JlLnBsdWdpblNldHRpbmdzLkJsdXJUaHVtYm5haWwgPyAnYmx1cicgOiAnJ31cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLWFjdGlvbj1cImxpbmtcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT1cIiR7YmFja2dyb3VuZEltYWdlU3R5bGV9XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7dGhpcy5pdGVtLlVzZXJEYXRhLlBsYXllZFBlcmNlbnRhZ2UgPyBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgPGRpdiBjbGFzcz1cImlubmVyQ2FyZEZvb3RlciBmdWxsSW5uZXJDYXJkRm9vdGVyIGlubmVyQ2FyZEZvb3RlckNsZWFyIGl0ZW1Qcm9ncmVzc0JhclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaXRlbVByb2dyZXNzQmFyRm9yZWdyb3VuZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT1cIndpZHRoOiR7dGhpcy5pdGVtLlVzZXJEYXRhLlBsYXllZFBlcmNlbnRhZ2V9JTtcIj4gICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5gIDogJydcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7dGhpcy5pdGVtLklkICE9PSB0aGlzLnByb2dyYW1EYXRhU3RvcmUuYWN0aXZlTWVkaWFTb3VyY2VJZCA/IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGA8ZGl2IGNsYXNzPVwiY2FyZE92ZXJsYXlDb250YWluZXIgaXRlbUFjdGlvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLWFjdGlvbj1cImxpbmtcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInN0YXJ0LWVwaXNvZGUtJHt0aGlzLml0ZW0uSWR9XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpcz1cInBhcGVyLWljb24tYnV0dG9uLWxpZ2h0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cImNhcmRPdmVybGF5QnV0dG9uIGNhcmRPdmVybGF5QnV0dG9uLWhvdmVyIGl0ZW1BY3Rpb24gcGFwZXItaWNvbi1idXR0b24tbGlnaHQgY2FyZE92ZXJsYXlGYWItcHJpbWFyeVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS1hY3Rpb249XCJyZXN1bWVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnMgY2FyZE92ZXJsYXlCdXR0b25JY29uIGNhcmRPdmVybGF5QnV0dG9uSWNvbi1ob3ZlciBwbGF5X2Fycm93XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PmAgOiAnJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwcmV2aWV3RXBpc29kZURlc2NyaXB0aW9uICR7dGhpcy5wcm9ncmFtRGF0YVN0b3JlLnBsdWdpblNldHRpbmdzLkJsdXJEZXNjcmlwdGlvbiA/ICdibHVyJyA6ICcnfVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7dGhpcy5pdGVtLkRlc2NyaXB0aW9uID8/ICdsb2FkaW5nLi4uJ31cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgYFxuICAgIH1cblxuICAgIHB1YmxpYyByZW5kZXIoY2xpY2tIYW5kbGVyOiBGdW5jdGlvbik6IHZvaWQge1xuICAgICAgICBjb25zdCByZW5kZXJlZEVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIoKVxuICAgICAgICByZW5kZXJlZEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4gY2xpY2tIYW5kbGVyKGUpKVxuXG4gICAgICAgIGlmICh0aGlzLml0ZW0uSWQgIT09IHRoaXMucHJvZ3JhbURhdGFTdG9yZS5hY3RpdmVNZWRpYVNvdXJjZUlkKSB7XG4gICAgICAgICAgICAvLyBhZGQgZXZlbnQgaGFuZGxlciB0byBzdGFydCB0aGUgcGxheWJhY2sgb2YgdGhpcyBlcGlzb2RlXG4gICAgICAgICAgICBjb25zdCBlcGlzb2RlSW1hZ2VDYXJkOiBIVE1MRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGBzdGFydC1lcGlzb2RlLSR7dGhpcy5pdGVtLklkfWApXG4gICAgICAgICAgICBlcGlzb2RlSW1hZ2VDYXJkLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gdGhpcy5wbGF5YmFja0hhbmRsZXIucGxheSh0aGlzLml0ZW0uSWQsIHRoaXMuaXRlbS5Vc2VyRGF0YS5QbGF5YmFja1Bvc2l0aW9uVGlja3MpKVxuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IHtCYXNlVGVtcGxhdGV9IGZyb20gXCIuL0Jhc2VUZW1wbGF0ZVwiO1xuaW1wb3J0IHtQcm9ncmFtRGF0YVN0b3JlfSBmcm9tIFwiLi4vU2VydmljZXMvUHJvZ3JhbURhdGFTdG9yZVwiO1xuaW1wb3J0IHtJdGVtVHlwZX0gZnJvbSBcIi4uL01vZGVscy9JdGVtVHlwZVwiO1xuXG5leHBvcnQgY2xhc3MgUG9wdXBUaXRsZVRlbXBsYXRlIGV4dGVuZHMgQmFzZVRlbXBsYXRlIHtcbiAgICBjb25zdHJ1Y3Rvcihjb250YWluZXI6IEhUTUxFbGVtZW50LCBwb3NpdGlvbkFmdGVySW5kZXg6IG51bWJlciwgcHJpdmF0ZSBwcm9ncmFtRGF0YVN0b3JlOiBQcm9ncmFtRGF0YVN0b3JlKSB7XG4gICAgICAgIHN1cGVyKGNvbnRhaW5lciwgcG9zaXRpb25BZnRlckluZGV4KVxuICAgICAgICB0aGlzLnNldEVsZW1lbnRJZCgncG9wdXBUaXRsZUNvbnRhaW5lcicpXG4gICAgfVxuXG4gICAgZ2V0VGVtcGxhdGUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIGBcbiAgICAgICAgICAgIDxkaXYgaWQ9XCIke3RoaXMuZ2V0RWxlbWVudElkKCl9XCIgY2xhc3M9XCJhY3Rpb25TaGVldFRpdGxlIGxpc3RJdGVtIHByZXZpZXdQb3B1cFRpdGxlXCI+XG4gICAgICAgICAgICAgICAgJHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ncmFtRGF0YVN0b3JlLnR5cGUgPT09IEl0ZW1UeXBlLlNlcmllcyAmJiB0aGlzLnByb2dyYW1EYXRhU3RvcmUuc2Vhc29ucy5sZW5ndGggPiAxID8gXG4gICAgICAgICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cImFjdGlvbnNoZWV0TWVudUl0ZW1JY29uIGxpc3RJdGVtSWNvbiBsaXN0SXRlbUljb24tdHJhbnNwYXJlbnQgbWF0ZXJpYWwtaWNvbnMga2V5Ym9hcmRfYmFja3NwYWNlXCI+PC9zcGFuPicgOiBcbiAgICAgICAgICAgICAgICAgICAgJydcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgPGgxIGNsYXNzPVwiYWN0aW9uU2hlZXRUaXRsZVwiPjwvaDE+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgYFxuICAgIH1cblxuICAgIHB1YmxpYyByZW5kZXIoY2xpY2tIYW5kbGVyOiBGdW5jdGlvbikge1xuICAgICAgICBjb25zdCByZW5kZXJlZEVsZW1lbnQgPSB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcigpO1xuICAgICAgICBcbiAgICAgICAgc3dpdGNoICh0aGlzLnByb2dyYW1EYXRhU3RvcmUudHlwZSkge1xuICAgICAgICAgICAgY2FzZSBJdGVtVHlwZS5TZXJpZXM6XG4gICAgICAgICAgICAgICAgcmVuZGVyZWRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IGNsaWNrSGFuZGxlcihlKSlcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSBJdGVtVHlwZS5Cb3hTZXQ6XG4gICAgICAgICAgICBjYXNlIEl0ZW1UeXBlLkZvbGRlcjpcbiAgICAgICAgICAgICAgICByZW5kZXJlZEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4gZS5zdG9wUHJvcGFnYXRpb24oKSlcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIHB1YmxpYyBzZXRUZXh0KHRleHQ6IHN0cmluZykge1xuICAgICAgICB0aGlzLmdldEVsZW1lbnQoKS5xdWVyeVNlbGVjdG9yKCdoMScpLmlubmVyVGV4dCA9IHRleHRcbiAgICB9XG4gICAgXG4gICAgcHVibGljIHNldFZpc2libGUoaXNWaXNpYmxlOiBib29sZWFuKSB7XG4gICAgICAgIGNvbnN0IHJlbmRlcmVkRWxlbWVudCA9IHRoaXMuZ2V0RWxlbWVudCgpXG4gICAgICAgIGlmIChpc1Zpc2libGUpIHtcbiAgICAgICAgICAgIHJlbmRlcmVkRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJyk7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcmVuZGVyZWRFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2hpZGUnKTtcbiAgICB9XG59XG4iLCJpbXBvcnQge0Jhc2VUZW1wbGF0ZX0gZnJvbSBcIi4vQmFzZVRlbXBsYXRlXCI7XG5cbmV4cG9ydCBjbGFzcyBQcmV2aWV3QnV0dG9uVGVtcGxhdGUgZXh0ZW5kcyBCYXNlVGVtcGxhdGUge1xuICAgIGNvbnN0cnVjdG9yKGNvbnRhaW5lcjogSFRNTEVsZW1lbnQsIHBvc2l0aW9uQWZ0ZXJJbmRleDogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKGNvbnRhaW5lciwgcG9zaXRpb25BZnRlckluZGV4KTtcbiAgICAgICAgdGhpcy5zZXRFbGVtZW50SWQoJ3BvcHVwUHJldmlld0J1dHRvbicpO1xuICAgIH1cblxuICAgIGdldFRlbXBsYXRlKCk6IHN0cmluZyB7XG4gICAgICAgIC8vIGxhbmd1YWdlPUhUTUxcbiAgICAgICAgcmV0dXJuIGBcbiAgICAgICAgICAgIDxidXR0b24gaWQ9XCIke3RoaXMuZ2V0RWxlbWVudElkKCl9XCIgY2xhc3M9XCJhdXRvU2l6ZSBwYXBlci1pY29uLWJ1dHRvbi1saWdodFwiIGlzPVwicGFwZXItaWNvbi1idXR0b24tbGlnaHRcIlxuICAgICAgICAgICAgICAgICAgICB0aXRsZT1cIkVwaXNvZGUgUHJldmlld1wiPlxuICAgICAgICAgICAgICAgIDwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPlxuICAgICAgICAgICAgICAgIDxzdmcgaWQ9XCJzdmcxXCJcbiAgICAgICAgICAgICAgICAgICAgIHdpZHRoPVwiMjRcIlxuICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0PVwiMjRcIlxuICAgICAgICAgICAgICAgICAgICAgdmlld0JveD1cIjAgMCA2IDRcIlxuICAgICAgICAgICAgICAgICAgICAgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPlxuICAgICAgICAgICAgICAgICAgICA8ZyBpZD1cImxheWVyMVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHJlY3QgaWQ9XCJyZWN0NDdcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9XCJmaWxsOm5vbmU7ZmlsbC1vcGFjaXR5OjE7ZmlsbC1ydWxlOm5vbnplcm87c3Ryb2tlOmN1cnJlbnRDb2xvcjtzdHJva2Utd2lkdGg6MC40NzY0Njc7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtwYWludC1vcmRlcjpzdHJva2UgbWFya2VycyBmaWxsXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoPVwiMy43NTY4Njc2XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodD1cIjIuMTY5MzY2MVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4PVwiMC4yMzgyMzMwM1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5PVwiMS44MjU3MzM1XCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggaWQ9XCJyZWN0NDctNVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT1cImZpbGw6bm9uZTtzdHJva2U6Y3VycmVudENvbG9yO3N0cm9rZS13aWR0aDowLjQ3NjU5NztzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3BhaW50LW9yZGVyOnN0cm9rZSBtYXJrZXJzIGZpbGxcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZD1cIm0gMS4wMjkxNDM3LDEuMDMyMDQ4MiBoIDMuNzUyODk5MSB2IDIuMTcyMjM5NCBsIDAuMDA2NzYsLTIuMTU3MjU5NSB6XCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggaWQ9XCJyZWN0NDctOFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT1cImZpbGw6bm9uZTtzdHJva2U6Y3VycmVudENvbG9yO3N0cm9rZS13aWR0aDowLjQ3NzQyNztzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3BhaW50LW9yZGVyOnN0cm9rZSBtYXJrZXJzIGZpbGxcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZD1cIm0gMS44MjI4NjE0LDAuMjM4NzEzMzYgaCAzLjc1OTI1OSBWIDIuNDEwMTIxMSBsIC0wLjAwNjgsLTIuMTcxNDA3NzQgelwiLz5cbiAgICAgICAgICAgICAgICAgICAgPC9nPlxuICAgICAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIGA7XG4gICAgfVxuXG4gICAgcHVibGljIHJlbmRlcihjbGlja0hhbmRsZXI6IEZ1bmN0aW9uKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHJlbmRlcmVkRWxlbWVudDogSFRNTEVsZW1lbnQgPSB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcigpO1xuICAgICAgICByZW5kZXJlZEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKTogYW55ID0+IGNsaWNrSGFuZGxlcigpKTtcbiAgICB9XG59IiwiaW1wb3J0IHtCYXNlVGVtcGxhdGV9IGZyb20gXCIuLi9CYXNlVGVtcGxhdGVcIlxuaW1wb3J0IHtCYXNlSXRlbX0gZnJvbSBcIi4uLy4uL01vZGVscy9FcGlzb2RlXCJcblxuZXhwb3J0IGNsYXNzIEZhdm9yaXRlSWNvblRlbXBsYXRlIGV4dGVuZHMgQmFzZVRlbXBsYXRlIHtcbiAgICBjb25zdHJ1Y3Rvcihjb250YWluZXI6IEhUTUxFbGVtZW50LCBwb3NpdGlvbkFmdGVySW5kZXg6IG51bWJlciwgcHJpdmF0ZSBlcGlzb2RlOiBCYXNlSXRlbSkge1xuICAgICAgICBzdXBlcihjb250YWluZXIsIHBvc2l0aW9uQWZ0ZXJJbmRleClcbiAgICAgICAgdGhpcy5zZXRFbGVtZW50SWQoJ2Zhdm9yaXRlQnV0dG9uLScgKyBlcGlzb2RlLklkKVxuICAgIH1cblxuICAgIGdldFRlbXBsYXRlKCk6IHN0cmluZyB7XG4gICAgICAgIC8vIGxhbmd1YWdlPUhUTUxcbiAgICAgICAgcmV0dXJuIGBcbiAgICAgICAgICAgIDxidXR0b24gaWQ9XCIke3RoaXMuZ2V0RWxlbWVudElkKCl9XCJcbiAgICAgICAgICAgICAgICAgICAgaXM9XCJlbWJ5LXJhdGluZ2J1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICBjbGFzcz1cIml0ZW1BY3Rpb24gcGFwZXItaWNvbi1idXR0b24tbGlnaHQgZW1ieS1idXR0b25cIlxuICAgICAgICAgICAgICAgICAgICBkYXRhLWFjdGlvbj1cIm5vbmVcIlxuICAgICAgICAgICAgICAgICAgICBkYXRhLWlkPVwiJHt0aGlzLmVwaXNvZGU/LklkID8/ICcnfVwiXG4gICAgICAgICAgICAgICAgICAgIGRhdGEtc2VydmVyaWQ9XCIke3RoaXMuZXBpc29kZT8uU2VydmVySWQgPz8gJyd9XCJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS1pdGVtdHlwZT1cIkVwaXNvZGVcIlxuICAgICAgICAgICAgICAgICAgICBkYXRhLWxpa2VzPVwiXCJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS1pc2Zhdm9yaXRlPVwiJHt0aGlzLmVwaXNvZGU/LlVzZXJEYXRhPy5Jc0Zhdm9yaXRlID8/IGZhbHNlfVwiXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlPVwiQWRkIHRvIGZhdm9yaXRlc1wiPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnMgZmF2b3JpdGVcIj48L3NwYW4+XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgYFxuICAgIH1cblxuICAgIHB1YmxpYyByZW5kZXIoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKClcbiAgICB9XG59XG4iLCJpbXBvcnQge0Jhc2VUZW1wbGF0ZX0gZnJvbSBcIi4uL0Jhc2VUZW1wbGF0ZVwiXG5pbXBvcnQge0Jhc2VJdGVtfSBmcm9tIFwiLi4vLi4vTW9kZWxzL0VwaXNvZGVcIlxuXG5leHBvcnQgY2xhc3MgUGxheVN0YXRlSWNvblRlbXBsYXRlIGV4dGVuZHMgQmFzZVRlbXBsYXRlIHtcbiAgICBjb25zdHJ1Y3Rvcihjb250YWluZXI6IEhUTUxFbGVtZW50LCBwb3NpdGlvbkFmdGVySW5kZXg6IG51bWJlciwgcHJpdmF0ZSBlcGlzb2RlOiBCYXNlSXRlbSkge1xuICAgICAgICBzdXBlcihjb250YWluZXIsIHBvc2l0aW9uQWZ0ZXJJbmRleClcbiAgICAgICAgdGhpcy5zZXRFbGVtZW50SWQoJ3BsYXlTdGF0ZUJ1dHRvbi0nICsgdGhpcy5lcGlzb2RlLklkKVxuICAgIH1cblxuICAgIGdldFRlbXBsYXRlKCk6IHN0cmluZyB7XG4gICAgICAgIC8vIGxhbmd1YWdlPUhUTUxcbiAgICAgICAgcmV0dXJuIGBcbiAgICAgICAgICAgIDxidXR0b24gaWQ9XCIke3RoaXMuZ2V0RWxlbWVudElkKCl9XCJcbiAgICAgICAgICAgICAgICAgICAgaXM9XCJlbWJ5LXBsYXlzdGF0ZWJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICBkYXRhLWFjdGlvbj1cIm5vbmVcIlxuICAgICAgICAgICAgICAgICAgICBjbGFzcz1cIml0ZW1BY3Rpb24gcGFwZXItaWNvbi1idXR0b24tbGlnaHQgZW1ieS1idXR0b25cIlxuICAgICAgICAgICAgICAgICAgICBkYXRhLWlkPVwiJHt0aGlzLmVwaXNvZGU/LklkID8/ICcnfVwiIFxuICAgICAgICAgICAgICAgICAgICBkYXRhLXNlcnZlcmlkPVwiJHt0aGlzLmVwaXNvZGU/LlNlcnZlcklkID8/ICcnfVwiXG4gICAgICAgICAgICAgICAgICAgIGRhdGEtaXRlbXR5cGU9XCJFcGlzb2RlXCJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS1saWtlcz1cIlwiXG4gICAgICAgICAgICAgICAgICAgIGRhdGEtcGxheWVkPVwiJHt0aGlzLmVwaXNvZGU/LlVzZXJEYXRhPy5QbGF5ZWQgPz8gZmFsc2V9XCJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU9XCJNYXJrIHBsYXllZFwiPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnMgY2hlY2sgcGxheXN0YXRlYnV0dG9uLWljb24tJHt0aGlzLmVwaXNvZGU/LlVzZXJEYXRhPy5QbGF5ZWQgPyBcInBsYXllZFwiIDogXCJ1bnBsYXllZFwifVwiPjwvc3Bhbj5cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICBgXG4gICAgfVxuXG4gICAgcHVibGljIHJlbmRlcigpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIoKVxuICAgIH1cbn1cbiIsImltcG9ydCB7QmFzZVRlbXBsYXRlfSBmcm9tIFwiLi9CYXNlVGVtcGxhdGVcIjtcbmltcG9ydCB7U2Vhc29ufSBmcm9tIFwiLi4vTW9kZWxzL1NlYXNvblwiO1xuXG5leHBvcnQgY2xhc3MgU2Vhc29uTGlzdEVsZW1lbnRUZW1wbGF0ZSBleHRlbmRzIEJhc2VUZW1wbGF0ZSB7XG4gICAgY29uc3RydWN0b3IoY29udGFpbmVyOiBIVE1MRWxlbWVudCwgcG9zaXRpb25BZnRlckluZGV4OiBudW1iZXIsIHByaXZhdGUgc2Vhc29uOiBTZWFzb24sIHByaXZhdGUgaXNDdXJyZW50U2Vhc29uOiBib29sZWFuKSB7XG4gICAgICAgIHN1cGVyKGNvbnRhaW5lciwgcG9zaXRpb25BZnRlckluZGV4KTtcbiAgICAgICAgdGhpcy5zZXRFbGVtZW50SWQoYGVwaXNvZGUtJHtzZWFzb24uc2Vhc29uSWR9YCk7XG4gICAgfVxuXG4gICAgZ2V0VGVtcGxhdGUoKTogc3RyaW5nIHtcbiAgICAgICAgLy8gbGFuZ3VhZ2U9SFRNTFxuICAgICAgICByZXR1cm4gYFxuICAgICAgICAgICAgPGRpdiBpZD1cIiR7dGhpcy5nZXRFbGVtZW50SWQoKX1cIlxuICAgICAgICAgICAgICAgICBjbGFzcz1cImxpc3RJdGVtIGxpc3RJdGVtLWJ1dHRvbiBhY3Rpb25TaGVldE1lbnVJdGVtIGVtYnktYnV0dG9uIHByZXZpZXdMaXN0SXRlbVwiXG4gICAgICAgICAgICAgICAgIGlzPVwiZW1ieS1idXR0b25cIlxuICAgICAgICAgICAgICAgICBkYXRhLWlkPVwiJHt0aGlzLnNlYXNvbi5zZWFzb25JZH1cIj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwibGlzdEl0ZW0gcHJldmlld0VwaXNvZGVUaXRsZVwiIHR5cGU9XCJidXR0b25cIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCIke3RoaXMuaXNDdXJyZW50U2Vhc29uID8gXCJtYXRlcmlhbC1pY29ucyBjaGVja1wiIDogXCJcIn1cIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsaXN0SXRlbUJvZHkgYWN0aW9uc2hlZXRMaXN0SXRlbUJvZHlcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiYWN0aW9uU2hlZXRJdGVtVGV4dFwiPiR7dGhpcy5zZWFzb24uc2Vhc29uTmFtZX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIGA7XG4gICAgfVxuXG4gICAgcHVibGljIHJlbmRlcihjbGlja0hhbmRsZXI6IEZ1bmN0aW9uKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHJlbmRlcmVkRWxlbWVudDogSFRNTEVsZW1lbnQgPSB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcigpO1xuICAgICAgICByZW5kZXJlZEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZTogTW91c2VFdmVudCk6IHZvaWQgPT4gY2xpY2tIYW5kbGVyKGUpKTtcbiAgICB9XG59IiwiZXhwb3J0IGVudW0gRW5kcG9pbnRzIHtcbiAgICBCQVNFID0gXCJJblBsYXllclByZXZpZXdcIixcbiAgICBFUElTT0RFX0lORk8gPSBcIi9Vc2Vycy97dXNlcklkfS9JdGVtcy97ZXBpc29kZUlkfVwiLFxuICAgIEVQSVNPREVfREVTQ1JJUFRJT04gPSBcIi9JdGVtcy97ZXBpc29kZUlkfVwiLFxuICAgIFBMQVlfTUVESUEgPSBcIi9Vc2Vycy97dXNlcklkfS97ZGV2aWNlSWR9L0l0ZW1zL3tlcGlzb2RlSWR9L1BsYXkve3RpY2tzfVwiLFxuICAgIFNFUlZFUl9TRVRUSU5HUyA9IFwiL1NlcnZlclNldHRpbmdzXCJcbn0iLCJpbXBvcnQge0xpc3RFbGVtZW50VGVtcGxhdGV9IGZyb20gXCIuL0NvbXBvbmVudHMvTGlzdEVsZW1lbnRUZW1wbGF0ZVwiO1xuaW1wb3J0IHtCYXNlSXRlbX0gZnJvbSBcIi4vTW9kZWxzL0VwaXNvZGVcIjtcbmltcG9ydCB7UHJvZ3JhbURhdGFTdG9yZX0gZnJvbSBcIi4vU2VydmljZXMvUHJvZ3JhbURhdGFTdG9yZVwiO1xuaW1wb3J0IHtTZWFzb259IGZyb20gXCIuL01vZGVscy9TZWFzb25cIjtcbmltcG9ydCB7U2Vhc29uTGlzdEVsZW1lbnRUZW1wbGF0ZX0gZnJvbSBcIi4vQ29tcG9uZW50cy9TZWFzb25MaXN0RWxlbWVudFRlbXBsYXRlXCI7XG5pbXBvcnQge1BvcHVwVGl0bGVUZW1wbGF0ZX0gZnJvbSBcIi4vQ29tcG9uZW50cy9Qb3B1cFRpdGxlVGVtcGxhdGVcIjtcbmltcG9ydCB7UGxheWJhY2tIYW5kbGVyfSBmcm9tIFwiLi9TZXJ2aWNlcy9QbGF5YmFja0hhbmRsZXJcIjtcbmltcG9ydCB7RW5kcG9pbnRzfSBmcm9tIFwiLi9FbmRwb2ludHNcIjtcblxuZXhwb3J0IGNsYXNzIExpc3RFbGVtZW50RmFjdG9yeSB7XG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBwbGF5YmFja0hhbmRsZXI6IFBsYXliYWNrSGFuZGxlciwgcHJpdmF0ZSBwcm9ncmFtRGF0YVN0b3JlOiBQcm9ncmFtRGF0YVN0b3JlKSB7IH1cbiAgICBcbiAgICBwdWJsaWMgYXN5bmMgY3JlYXRlRXBpc29kZUVsZW1lbnRzKGVwaXNvZGVzOiBCYXNlSXRlbVtdLCBwYXJlbnREaXY6IEhUTUxFbGVtZW50KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGNvbnN0IGRpc3BsYXlFcGlzb2RlcyA9IHRoaXMucmVzb2x2ZURpc3BsYXlFcGlzb2RlcyhlcGlzb2RlcylcbiAgICAgICAgXG4gICAgICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCBkaXNwbGF5RXBpc29kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGVwaXNvZGUgPSBkaXNwbGF5RXBpc29kZXNbaV1cbiAgICAgICAgICAgIGNvbnN0IGVwaXNvZGVMaXN0RWxlbWVudFRlbXBsYXRlID0gbmV3IExpc3RFbGVtZW50VGVtcGxhdGUocGFyZW50RGl2LCBpLCBlcGlzb2RlLCB0aGlzLnBsYXliYWNrSGFuZGxlciwgdGhpcy5wcm9ncmFtRGF0YVN0b3JlKTtcbiAgICAgICAgICAgIGVwaXNvZGVMaXN0RWxlbWVudFRlbXBsYXRlLnJlbmRlcihhc3luYyAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gaGlkZSBlcGlzb2RlIGNvbnRlbnQgZm9yIGFsbCBleGlzdGluZyBlcGlzb2RlcyBpbiB0aGUgcHJldmlldyBsaXN0XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5wcmV2aWV3TGlzdEl0ZW1Db250ZW50XCIpLmZvckVhY2goKGVsZW1lbnQ6IEVsZW1lbnQpOiB2b2lkID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdoaWRlJyk7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWRMaXN0SXRlbScpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGNvbnN0IGVwaXNvZGVDb250YWluZXI6IEVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbZGF0YS1pZD1cIiR7ZXBpc29kZS5JZH1cIl1gKS5xdWVyeVNlbGVjdG9yKCcucHJldmlld0xpc3RJdGVtQ29udGVudCcpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIGxvYWQgZXBpc29kZSBkZXNjcmlwdGlvblxuICAgICAgICAgICAgICAgIGlmICghZXBpc29kZS5EZXNjcmlwdGlvbikge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB1cmwgPSBBcGlDbGllbnQuZ2V0VXJsKGAvJHtFbmRwb2ludHMuQkFTRX0ke0VuZHBvaW50cy5FUElTT0RFX0RFU0NSSVBUSU9OfWBcbiAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKCd7ZXBpc29kZUlkfScsIGVwaXNvZGUuSWQpKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgQXBpQ2xpZW50LmFqYXgoeyB0eXBlOiAnR0VUJywgdXJsLCBkYXRhVHlwZTogJ2pzb24nIH0pXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5ld0Rlc2NyaXB0aW9uOiBzdHJpbmcgPSByZXN1bHQ/LkRlc2NyaXB0aW9uXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2dyYW1EYXRhU3RvcmUudXBkYXRlSXRlbSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAuLi5lcGlzb2RlLFxuICAgICAgICAgICAgICAgICAgICAgICAgRGVzY3JpcHRpb246IG5ld0Rlc2NyaXB0aW9uXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIGVwaXNvZGVDb250YWluZXIucXVlcnlTZWxlY3RvcignLnByZXZpZXdFcGlzb2RlRGVzY3JpcHRpb24nKS50ZXh0Q29udGVudCA9IG5ld0Rlc2NyaXB0aW9uXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIHNob3cgZXBpc29kZSBjb250ZW50IGZvciB0aGUgc2VsZWN0ZWQgZXBpc29kZVxuICAgICAgICAgICAgICAgIGVwaXNvZGVDb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpO1xuICAgICAgICAgICAgICAgIGVwaXNvZGVDb250YWluZXIuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWRMaXN0SXRlbScpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIHNjcm9sbCB0byB0aGUgc2VsZWN0ZWQgZXBpc29kZVxuICAgICAgICAgICAgICAgIGVwaXNvZGVDb250YWluZXIucGFyZW50RWxlbWVudC5zY3JvbGxJbnRvVmlldyh7IGJsb2NrOiBcInN0YXJ0XCIgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKGVwaXNvZGUuSWQgPT09IHRoaXMucHJvZ3JhbURhdGFTdG9yZS5hY3RpdmVNZWRpYVNvdXJjZUlkKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZXBpc29kZU5vZGU6IEVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbZGF0YS1pZD1cIiR7ZXBpc29kZS5JZH1cIl1gKS5xdWVyeVNlbGVjdG9yKCcucHJldmlld0xpc3RJdGVtQ29udGVudCcpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIHByZWxvYWQgZXBpc29kZSBkZXNjcmlwdGlvbiBmb3IgdGhlIGN1cnJlbnRseSBwbGF5aW5nIGVwaXNvZGVcbiAgICAgICAgICAgICAgICBpZiAoIWVwaXNvZGUuRGVzY3JpcHRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdXJsID0gQXBpQ2xpZW50LmdldFVybChgLyR7RW5kcG9pbnRzLkJBU0V9JHtFbmRwb2ludHMuRVBJU09ERV9ERVNDUklQVElPTn1gXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgne2VwaXNvZGVJZH0nLCBlcGlzb2RlLklkKSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IEFwaUNsaWVudC5hamF4KHsgdHlwZTogJ0dFVCcsIHVybCwgZGF0YVR5cGU6ICdqc29uJyB9KVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXdEZXNjcmlwdGlvbjogc3RyaW5nID0gcmVzdWx0Py5EZXNjcmlwdGlvblxuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvZ3JhbURhdGFTdG9yZS51cGRhdGVJdGVtKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLmVwaXNvZGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBEZXNjcmlwdGlvbjogbmV3RGVzY3JpcHRpb25cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgZXBpc29kZU5vZGUucXVlcnlTZWxlY3RvcignLnByZXZpZXdFcGlzb2RlRGVzY3JpcHRpb24nKS50ZXh0Q29udGVudCA9IG5ld0Rlc2NyaXB0aW9uXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGVwaXNvZGVOb2RlLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKTtcbiAgICAgICAgICAgICAgICBlcGlzb2RlTm9kZS5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZExpc3RJdGVtJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgcHVibGljIGNyZWF0ZVNlYXNvbkVsZW1lbnRzKHNlYXNvbnM6IFNlYXNvbltdLCBwYXJlbnREaXY6IEhUTUxFbGVtZW50LCBjdXJyZW50U2Vhc29uSW5kZXg6IG51bWJlciwgdGl0bGVDb250YWluZXI6IFBvcHVwVGl0bGVUZW1wbGF0ZSk6IHZvaWQge1xuICAgICAgICBzZWFzb25zLnNvcnQoKGEsIGIpID0+IGEuSW5kZXhOdW1iZXIgLSBiLkluZGV4TnVtYmVyKVxuICAgICAgICBcbiAgICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IHNlYXNvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHNlYXNvbiA9IG5ldyBTZWFzb25MaXN0RWxlbWVudFRlbXBsYXRlKHBhcmVudERpdiwgaSwgc2Vhc29uc1tpXSwgc2Vhc29uc1tpXS5JbmRleE51bWJlciA9PT0gY3VycmVudFNlYXNvbkluZGV4KTtcbiAgICAgICAgICAgIHNlYXNvbi5yZW5kZXIoKGU6IE1vdXNlRXZlbnQpOiB2b2lkID0+IHtcbiAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHRpdGxlQ29udGFpbmVyLnNldFRleHQoc2Vhc29uc1tpXS5zZWFzb25OYW1lKTtcbiAgICAgICAgICAgICAgICB0aXRsZUNvbnRhaW5lci5zZXRWaXNpYmxlKHRydWUpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHBhcmVudERpdi5pbm5lckhUTUwgPSBcIlwiOyAvLyByZW1vdmUgb2xkIGNvbnRlbnRcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZUVwaXNvZGVFbGVtZW50cyhzZWFzb25zW2ldLmVwaXNvZGVzLCBwYXJlbnREaXYpLnRoZW4oKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZXNvbHZlRGlzcGxheUVwaXNvZGVzKGVwaXNvZGVzOiBCYXNlSXRlbVtdKTogQmFzZUl0ZW1bXSB7XG4gICAgICAgIGNvbnN0IHF1ZXVlSWRzOiBzdHJpbmdbXSA9IHRoaXMucHJvZ3JhbURhdGFTdG9yZS5ub3dQbGF5aW5nUXVldWVJZHMgPz8gW11cbiAgICAgICAgaWYgKHRoaXMucHJvZ3JhbURhdGFTdG9yZS5pc1NodWZmbGVBY3RpdmUoKSAmJiBxdWV1ZUlkcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBlcGlzb2RlTWFwID0gbmV3IE1hcDxzdHJpbmcsIEJhc2VJdGVtPihlcGlzb2Rlcy5tYXAoKGVwaXNvZGU6IEJhc2VJdGVtKTogW3N0cmluZywgQmFzZUl0ZW1dID0+IFtlcGlzb2RlLklkLCBlcGlzb2RlXSkpXG4gICAgICAgICAgICByZXR1cm4gcXVldWVJZHNcbiAgICAgICAgICAgICAgICAubWFwKChpZDogc3RyaW5nKTogQmFzZUl0ZW0gPT4gZXBpc29kZU1hcC5nZXQoaWQpKVxuICAgICAgICAgICAgICAgIC5maWx0ZXIoKGVwaXNvZGUpOiBlcGlzb2RlIGlzIEJhc2VJdGVtID0+IEJvb2xlYW4oZXBpc29kZSkpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gWy4uLmVwaXNvZGVzXS5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwYXJlbnRDb21wYXJlOiBudW1iZXIgPSAoYS5QYXJlbnRJbmRleE51bWJlciA/PyAwKSAtIChiLlBhcmVudEluZGV4TnVtYmVyID8/IDApXG4gICAgICAgICAgICBpZiAocGFyZW50Q29tcGFyZSAhPT0gMClcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyZW50Q29tcGFyZVxuICAgICAgICAgICAgcmV0dXJuIChhLkluZGV4TnVtYmVyID8/IDApIC0gKGIuSW5kZXhOdW1iZXIgPz8gMClcbiAgICAgICAgfSlcbiAgICB9XG59XG4iLCJleHBvcnQgZW51bSBJdGVtVHlwZSB7XG4gICAgQWdncmVnYXRlRm9sZGVyLFxuICAgIEF1ZGlvLFxuICAgIEF1ZGlvQm9vayxcbiAgICBCYXNlUGx1Z2luRm9sZGVyLFxuICAgIEJvb2ssXG4gICAgQm94U2V0LFxuICAgIENoYW5uZWwsXG4gICAgQ2hhbm5lbEZvbGRlckl0ZW0sXG4gICAgQ29sbGVjdGlvbkZvbGRlcixcbiAgICBFcGlzb2RlLFxuICAgIEZvbGRlcixcbiAgICBHZW5yZSxcbiAgICBNYW51YWxQbGF5bGlzdHNGb2xkZXIsXG4gICAgTW92aWUsXG4gICAgTGl2ZVR2Q2hhbm5lbCxcbiAgICBMaXZlVHZQcm9ncmFtLFxuICAgIE11c2ljQWxidW0sXG4gICAgTXVzaWNBcnRpc3QsXG4gICAgTXVzaWNHZW5yZSxcbiAgICBNdXNpY1ZpZGVvLFxuICAgIFBlcnNvbixcbiAgICBQaG90byxcbiAgICBQaG90b0FsYnVtLFxuICAgIFBsYXlsaXN0LFxuICAgIFBsYXlsaXN0c0ZvbGRlcixcbiAgICBQcm9ncmFtLFxuICAgIFJlY29yZGluZyxcbiAgICBTZWFzb24sXG4gICAgU2VyaWVzLFxuICAgIFN0dWRpbyxcbiAgICBUcmFpbGVyLFxuICAgIFR2Q2hhbm5lbCxcbiAgICBUdlByb2dyYW0sXG4gICAgVXNlclJvb3RGb2xkZXIsXG4gICAgVXNlclZpZXcsXG4gICAgVmlkZW8sXG4gICAgWWVhclxufSIsImltcG9ydCB7QmFzZUl0ZW19IGZyb20gXCIuL0VwaXNvZGVcIjtcblxuZXhwb3J0IGVudW0gUGxheU1ldGhvZCB7XG4gICAgVHJhbnNjb2RlID0gMCxcbiAgICBEaXJlY3RTdHJlYW0gPSAxLFxuICAgIERpcmVjdFBsYXkgPSAyXG59XG5cbmV4cG9ydCBlbnVtIFJlcGVhdE1vZGUge1xuICAgIFJlcGVhdE5vbmUgPSAwLFxuICAgIFJlcGVhdEFsbCA9IDEsXG4gICAgUmVwZWF0T25lID0gMlxufVxuXG5leHBvcnQgZW51bSBQbGF5YmFja09yZGVyIHtcbiAgICBEZWZhdWx0ID0gMCxcbiAgICBTaHVmZmxlID0gMVxufVxuXG5leHBvcnQgdHlwZSBRdWV1ZUl0ZW0gPSB7XG4gICAgSWQ6IHN0cmluZztcbiAgICBQbGF5bGlzdEl0ZW1JZDogc3RyaW5nO1xufVxuXG5leHBvcnQgdHlwZSBQbGF5YmFja1Byb2dyZXNzSW5mbyA9IHtcbiAgICBDYW5TZWVrOiBib29sZWFuO1xuICAgIEl0ZW06IEJhc2VJdGVtO1xuICAgIEl0ZW1JZDogc3RyaW5nO1xuICAgIFNlc3Npb25JZDogc3RyaW5nO1xuICAgIE1lZGlhU291cmNlSWQ6IHN0cmluZztcbiAgICBBdWRpb1N0cmVhbUluZGV4OiBudW1iZXIgfCBudWxsO1xuICAgIFN1YnRpdGxlU3RyZWFtSW5kZXg6IG51bWJlciB8IG51bGw7XG4gICAgSXNQYXVzZWQ6IGJvb2xlYW47XG4gICAgSXNNdXRlZDogYm9vbGVhbjtcbiAgICBQb3NpdGlvblRpY2tzOiBudW1iZXIgfCBudWxsO1xuICAgIFBsYXliYWNrU3RhcnRUaW1lVGlja3M6IG51bWJlciB8IG51bGw7XG4gICAgVm9sdW1lTGV2ZWw6IG51bWJlciB8IG51bGw7XG4gICAgQnJpZ2h0bmVzczogbnVtYmVyIHwgbnVsbDtcbiAgICBBc3BlY3RSYXRpbzogc3RyaW5nO1xuICAgIFBsYXlNZXRob2Q6IFBsYXlNZXRob2Q7XG4gICAgTGl2ZVN0cmVhbUlkOiBzdHJpbmc7XG4gICAgUGxheVNlc3Npb25JZDogc3RyaW5nO1xuICAgIFJlcGVhdE1vZGU6IFJlcGVhdE1vZGU7XG4gICAgUGxheWJhY2tPcmRlcjogUGxheWJhY2tPcmRlcjtcbiAgICBOb3dQbGF5aW5nUXVldWU6IFF1ZXVlSXRlbVtdO1xuICAgIFBsYXlsaXN0SXRlbUlkOiBzdHJpbmc7XG59IiwiaW1wb3J0IHtJdGVtVHlwZX0gZnJvbSBcIi4vSXRlbVR5cGVcIjtcblxuZXhwb3J0IHR5cGUgUGx1Z2luU2V0dGluZ3MgPSB7XG4gICAgRW5hYmxlZEl0ZW1UeXBlczogSXRlbVR5cGVbXSxcbiAgICBCbHVyRGVzY3JpcHRpb246IGJvb2xlYW4sXG4gICAgQmx1clRodW1ibmFpbDogYm9vbGVhbixcbn1cblxuZXhwb3J0IGNvbnN0IERlZmF1bHRQbHVnaW5TZXR0aW5nczogUGx1Z2luU2V0dGluZ3MgPSB7XG4gICAgRW5hYmxlZEl0ZW1UeXBlczogW0l0ZW1UeXBlLlNlcmllcywgSXRlbVR5cGUuQm94U2V0LCBJdGVtVHlwZS5Nb3ZpZSwgSXRlbVR5cGUuRm9sZGVyLCBJdGVtVHlwZS5WaWRlb10sXG4gICAgQmx1ckRlc2NyaXB0aW9uOiBmYWxzZSxcbiAgICBCbHVyVGh1bWJuYWlsOiBmYWxzZSxcbn0iLCJleHBvcnQgdHlwZSBTZXJ2ZXJTZXR0aW5ncyA9IHtcbiAgICBNaW5SZXN1bWVQY3Q6IG51bWJlciwgXG4gICAgTWF4UmVzdW1lUGN0OiBudW1iZXIsIFxuICAgIE1pblJlc3VtZUR1cmF0aW9uU2Vjb25kczogbnVtYmVyXG59XG5cbmV4cG9ydCBjb25zdCBEZWZhdWx0U2VydmVyU2V0dGluZ3M6IFNlcnZlclNldHRpbmdzID0ge1xuICAgIE1pblJlc3VtZVBjdDogNSxcbiAgICBNYXhSZXN1bWVQY3Q6IDkwLFxuICAgIE1pblJlc3VtZUR1cmF0aW9uU2Vjb25kczogMzAwXG59IiwiZXhwb3J0IGNsYXNzIEF1dGhTZXJ2aWNlIHtcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9hdXRoSGVhZGVyOiBzdHJpbmcgPSAnQXV0aG9yaXphdGlvbic7XG4gICAgcHJpdmF0ZSBfYXV0aEhlYWRlclZhbHVlOiBzdHJpbmcgPSAnJztcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRBdXRoSGVhZGVyS2V5KCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hdXRoSGVhZGVyO1xuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIGdldEF1dGhIZWFkZXJWYWx1ZSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5fYXV0aEhlYWRlclZhbHVlO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXRBdXRoSGVhZGVyVmFsdWUodmFsdWU6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICB0aGlzLl9hdXRoSGVhZGVyVmFsdWUgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWRkQXV0aEhlYWRlckludG9IdHRwUmVxdWVzdChyZXF1ZXN0OiBYTUxIdHRwUmVxdWVzdCk6IHZvaWQge1xuICAgICAgICByZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIodGhpcy5fYXV0aEhlYWRlciwgdGhpcy5nZXRBdXRoSGVhZGVyVmFsdWUoKSk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHtQcm9ncmFtRGF0YVN0b3JlfSBmcm9tIFwiLi9Qcm9ncmFtRGF0YVN0b3JlXCI7XG5pbXBvcnQge0F1dGhTZXJ2aWNlfSBmcm9tIFwiLi9BdXRoU2VydmljZVwiO1xuaW1wb3J0IHtMb2dnZXJ9IGZyb20gXCIuL0xvZ2dlclwiO1xuaW1wb3J0IHtCYXNlSXRlbSwgSXRlbUR0b30gZnJvbSBcIi4uL01vZGVscy9FcGlzb2RlXCI7XG5pbXBvcnQge1NlYXNvbn0gZnJvbSBcIi4uL01vZGVscy9TZWFzb25cIjtcbmltcG9ydCB7SXRlbVR5cGV9IGZyb20gXCIuLi9Nb2RlbHMvSXRlbVR5cGVcIjtcbmltcG9ydCB7UGxheWJhY2tPcmRlciwgUGxheWJhY2tQcm9ncmVzc0luZm99IGZyb20gXCIuLi9Nb2RlbHMvUGxheWJhY2tQcm9ncmVzc0luZm9cIjtcblxuLyoqXG4gKiBUaGUgY2xhc3NlcyB3aGljaCBkZXJpdmVzIGZyb20gdGhpcyBpbnRlcmZhY2UsIHdpbGwgcHJvdmlkZSB0aGUgZnVuY3Rpb25hbGl0eSB0byBoYW5kbGUgdGhlIGRhdGEgaW5wdXQgZnJvbSB0aGUgc2VydmVyIGlmIHRoZSBQbGF5YmFja1N0YXRlIGlzIGNoYW5nZWQuXG4gKi9cbmV4cG9ydCBjbGFzcyBEYXRhRmV0Y2hlciB7XG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBwcm9ncmFtRGF0YVN0b3JlOiBQcm9ncmFtRGF0YVN0b3JlLCBwcml2YXRlIGF1dGhTZXJ2aWNlOiBBdXRoU2VydmljZSwgcHJpdmF0ZSBsb2dnZXI6IExvZ2dlcikge1xuICAgICAgICBjb25zdCB7ZmV0Y2g6IG9yaWdpbmFsRmV0Y2h9ID0gd2luZG93XG4gICAgICAgIHdpbmRvdy5mZXRjaCA9IGFzeW5jICguLi5hcmdzKTogUHJvbWlzZTxSZXNwb25zZT4gPT4ge1xuICAgICAgICAgICAgY29uc3Qge29yaWdpbn0gPSB3aW5kb3cubG9jYXRpb247XG4gICAgICAgICAgICBsZXQgcmVzb3VyY2UgPSBhcmdzWzBdIGFzIFJlcXVlc3RJbmZvO1xuICAgICAgICAgICAgY29uc3QgY29uZmlnOiBSZXF1ZXN0SW5pdCA9IGFyZ3NbMV0gPz8ge307XG5cbiAgICAgICAgICAgIGNvbnN0IHRvVXJsID0gKGlucHV0OiBSZXF1ZXN0SW5mbyk6IFVSTCA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGlucHV0IGluc3RhbmNlb2YgVVJMKSByZXR1cm4gaW5wdXQ7XG4gICAgICAgICAgICAgICAgaWYgKGlucHV0IGluc3RhbmNlb2YgUmVxdWVzdCkgcmV0dXJuIG5ldyBVUkwoaW5wdXQudXJsKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFVSTChTdHJpbmcoaW5wdXQpLCBvcmlnaW4pO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYgKGNvbmZpZyAmJiBjb25maWcuaGVhZGVycykge1xuICAgICAgICAgICAgICAgIHRoaXMuYXV0aFNlcnZpY2Uuc2V0QXV0aEhlYWRlclZhbHVlKGNvbmZpZy5oZWFkZXJzW3RoaXMuYXV0aFNlcnZpY2UuZ2V0QXV0aEhlYWRlcktleSgpXSA/PyAnJylcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgdXJsOiBVUkwgPSB0b1VybChyZXNvdXJjZSk7XG4gICAgICAgICAgICBjb25zdCB1cmxQYXRobmFtZTogc3RyaW5nID0gdXJsLnBhdGhuYW1lO1xuXG4gICAgICAgICAgICAvLyBQcm9jZXNzIGRhdGEgZnJvbSBQT1NUIHJlcXVlc3RzXG4gICAgICAgICAgICAvLyBFbmRwb2ludDogL1Nlc3Npb25zL1BsYXlpbmdcbiAgICAgICAgICAgIGlmIChjb25maWcuYm9keSAmJiB0eXBlb2YgY29uZmlnLmJvZHkgPT09ICdzdHJpbmcnICYmIHVybFBhdGhuYW1lLmluY2x1ZGVzKCdTZXNzaW9ucy9QbGF5aW5nJykpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwbGF5aW5nSW5mbzogUGxheWJhY2tQcm9ncmVzc0luZm8gPSBKU09OLnBhcnNlKGNvbmZpZy5ib2R5KVxuXG4gICAgICAgICAgICAgICAgLy8gc2F2ZSB0aGUgbWVkaWEgaWQgb2YgdGhlIGN1cnJlbnRseSBwbGF5ZWQgdmlkZW9cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wcm9ncmFtRGF0YVN0b3JlLmFjdGl2ZU1lZGlhU291cmNlSWQgIT09IHBsYXlpbmdJbmZvLk1lZGlhU291cmNlSWQpXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvZ3JhbURhdGFTdG9yZS5hY3RpdmVNZWRpYVNvdXJjZUlkID0gcGxheWluZ0luZm8uTWVkaWFTb3VyY2VJZFxuXG4gICAgICAgICAgICAgICAgY29uc3QgcGxheWJhY2tPcmRlclJhdyA9IHBsYXlpbmdJbmZvLlBsYXliYWNrT3JkZXIgYXMgdW5rbm93biBhcyBQbGF5YmFja09yZGVyIHwgc3RyaW5nXG4gICAgICAgICAgICAgICAgY29uc3QgcGxheWJhY2tPcmRlckZyb21FbnVtID0gdHlwZW9mIHBsYXliYWNrT3JkZXJSYXcgPT09ICdudW1iZXInXG4gICAgICAgICAgICAgICAgICAgID8gUGxheWJhY2tPcmRlcltwbGF5YmFja09yZGVyUmF3XVxuICAgICAgICAgICAgICAgICAgICA6IHBsYXliYWNrT3JkZXJSYXdcbiAgICAgICAgICAgICAgICBjb25zdCBwbGF5YmFja09yZGVyOiBzdHJpbmcgPSBwbGF5YmFja09yZGVyRnJvbUVudW0gPz8gJ0RlZmF1bHQnXG4gICAgICAgICAgICAgICAgY29uc3Qgbm93UGxheWluZ1F1ZXVlSWRzOiBzdHJpbmdbXSA9IChwbGF5aW5nSW5mby5Ob3dQbGF5aW5nUXVldWUgPz8gW10pXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoKHF1ZXVlSXRlbSkgPT4gcXVldWVJdGVtPy5JZClcbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlcigoaWQpOiBpZCBpcyBzdHJpbmcgPT4gQm9vbGVhbihpZCkpXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9ncmFtRGF0YVN0b3JlLnNldFBsYXliYWNrT3JkZXIocGxheWJhY2tPcmRlcilcbiAgICAgICAgICAgICAgICB0aGlzLnByb2dyYW1EYXRhU3RvcmUuc2V0Tm93UGxheWluZ1F1ZXVlKG5vd1BsYXlpbmdRdWV1ZUlkcylcbiAgICAgICAgICAgICAgICB2b2lkIHRoaXMucHJvZ3JhbURhdGFTdG9yZS5lbnN1cmVJdGVtc0xvYWRlZEJ5SWRzKG5vd1BsYXlpbmdRdWV1ZUlkcylcblxuICAgICAgICAgICAgICAgIC8vIEVuZHBvaW50OiAvU2Vzc2lvbnMvUGxheWluZy9Qcm9ncmVzc1xuICAgICAgICAgICAgICAgIGlmICh1cmxQYXRobmFtZS5pbmNsdWRlcygnUHJvZ3Jlc3MnKSkge1xuICAgICAgICAgICAgICAgICAgICAvLyB1cGRhdGUgdGhlIHBsYXliYWNrIHByb2dyZXNzIG9mIHRoZSBjdXJyZW50bHkgcGxheWVkIHZpZGVvXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGVwaXNvZGU6IEJhc2VJdGVtID0gdGhpcy5wcm9ncmFtRGF0YVN0b3JlLmdldEl0ZW1CeUlkKHBsYXlpbmdJbmZvLk1lZGlhU291cmNlSWQpXG4gICAgICAgICAgICAgICAgICAgIGlmIChlcGlzb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwbGF5ZWRQZXJjZW50YWdlID0gZXBpc29kZS5SdW5UaW1lVGlja3MgPiAwID8gKHBsYXlpbmdJbmZvLlBvc2l0aW9uVGlja3MgLyBlcGlzb2RlLlJ1blRpbWVUaWNrcykgKiAxMDAgOiAwXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwbGF5ZWQgPSBwbGF5ZWRQZXJjZW50YWdlID49IHRoaXMucHJvZ3JhbURhdGFTdG9yZS5zZXJ2ZXJTZXR0aW5ncy5NYXhSZXN1bWVQY3RcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ncmFtRGF0YVN0b3JlLnVwZGF0ZUl0ZW0oe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLmVwaXNvZGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgVXNlckRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4uZXBpc29kZS5Vc2VyRGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUGxheWJhY2tQb3NpdGlvblRpY2tzOiBwbGF5aW5nSW5mby5Qb3NpdGlvblRpY2tzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBQbGF5ZWRQZXJjZW50YWdlOiBwbGF5ZWRQZXJjZW50YWdlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBQbGF5ZWQ6IHBsYXllZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh1cmxQYXRobmFtZS5pbmNsdWRlcygnRXBpc29kZXMnKSkge1xuICAgICAgICAgICAgICAgIC8vIHJlbW92ZSBuZXcgJ3N0YXJ0SXRlbUlkJyBhbmQgJ2xpbWl0JyBxdWVyeSBwYXJhbWV0ZXIsIHRvIHN0aWxsIGdldCB0aGUgZnVsbCBsaXN0IG9mIGVwaXNvZGVzXG4gICAgICAgICAgICAgICAgY29uc3QgY2xlYW5lZFVSTCA9IHVybC5ocmVmLnJlcGxhY2UoL3N0YXJ0SXRlbUlkPVteJl0rJj8vLCAnJykucmVwbGFjZSgvbGltaXQ9W14mXSsmPy8sICcnKVxuICAgICAgICAgICAgICAgIHJlc291cmNlID0gdG9VcmwoY2xlYW5lZFVSTCkudG9TdHJpbmcoKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCByZXNwb25zZTogUmVzcG9uc2UgPSBhd2FpdCBvcmlnaW5hbEZldGNoKHJlc291cmNlLCBjb25maWcpXG5cbiAgICAgICAgICAgIGlmICh1cmxQYXRobmFtZS5pbmNsdWRlcygnRXBpc29kZXMnKSkge1xuICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKCdSZWNlaXZlZCBFcGlzb2RlcycpXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgcmVzcG9uc2UuY2xvbmUoKS5qc29uKCkudGhlbigoZGF0YTogSXRlbUR0byk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2dyYW1EYXRhU3RvcmUudHlwZSA9IEl0ZW1UeXBlLlNlcmllc1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2dyYW1EYXRhU3RvcmUuc2Vhc29ucyA9IHRoaXMuZ2V0Rm9ybWF0dGVkRXBpc29kZURhdGEoZGF0YSlcbiAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHVybFBhdGhuYW1lLmluY2x1ZGVzKCdVc2VyJykgJiYgdXJsUGF0aG5hbWUuaW5jbHVkZXMoJ0l0ZW1zJykgJiYgdXJsLnNlYXJjaC5pbmNsdWRlcygnUGFyZW50SWQnKSkge1xuICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKCdSZWNlaXZlZCBJdGVtcyB3aXRoIFBhcmVudElkJylcbiAgICAgICAgICAgICAgICByZXNwb25zZS5jbG9uZSgpLmpzb24oKS50aGVuKChkYXRhOiBJdGVtRHRvKTogdm9pZCA9PiB0aGlzLnNhdmVJdGVtRGF0YShkYXRhLCB1cmwuc2VhcmNoUGFyYW1zLmdldCgnUGFyZW50SWQnKSkpXG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAodXJsUGF0aG5hbWUuaW5jbHVkZXMoJ1VzZXInKSAmJiB1cmxQYXRobmFtZS5pbmNsdWRlcygnSXRlbXMnKSkge1xuICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKCdSZWNlaXZlZCBJdGVtcyB3aXRob3V0IFBhcmVudElkJylcblxuICAgICAgICAgICAgICAgIHJlc3BvbnNlLmNsb25lKCkuanNvbigpLnRoZW4oKGRhdGE6IEJhc2VJdGVtKTogdm9pZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKCdSZWNlaXZlZCBzaW5nbGUgaXRlbSBkYXRhIC0+IFNldHRpbmcgQm94U2V0IG5hbWUnKVxuXG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoSXRlbVR5cGVbZGF0YS5UeXBlXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBJdGVtVHlwZS5Cb3hTZXQ6XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIEl0ZW1UeXBlLkZvbGRlcjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2dyYW1EYXRhU3RvcmUuYm94U2V0TmFtZSA9IGRhdGEuTmFtZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvZ3JhbURhdGFTdG9yZS5hY3RpdmVNZWRpYVNvdXJjZUlkID0gZGF0YS5JZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIEl0ZW1UeXBlLk1vdmllOiAvLyBjb3VsZCBiZSBzaW5nbGUgdmlkZW8gKGUuZy4gc3RhcnRlZCBmcm9tIGRhc2hib2FyZClcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgSXRlbVR5cGUuVmlkZW86XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zYXZlSXRlbURhdGEoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBJdGVtczogW2RhdGFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUb3RhbFJlY29yZENvdW50OiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTdGFydEluZGV4OiAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodXJsUGF0aG5hbWUuaW5jbHVkZXMoJ1BsYXllZEl0ZW1zJykpIHtcbiAgICAgICAgICAgICAgICAvLyB1cGRhdGUgdGhlIHBsYXllZCBzdGF0ZSBvZiB0aGUgZXBpc29kZVxuICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKCdSZWNlaXZlZCBQbGF5ZWRJdGVtcycpXG5cbiAgICAgICAgICAgICAgICBjb25zdCBpdGVtSWQ6IHN0cmluZyA9IGV4dHJhY3RLZXlGcm9tU3RyaW5nKHVybFBhdGhuYW1lLCAnUGxheWVkSXRlbXMvJylcbiAgICAgICAgICAgICAgICBjb25zdCBjaGFuZ2VkSXRlbTogQmFzZUl0ZW0gPSB0aGlzLnByb2dyYW1EYXRhU3RvcmUuZ2V0SXRlbUJ5SWQoaXRlbUlkKVxuICAgICAgICAgICAgICAgIGlmICghY2hhbmdlZEl0ZW0pIHJldHVyblxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHJlc3BvbnNlLmNsb25lKCkuanNvbigpLnRoZW4oKGRhdGEpID0+IGNoYW5nZWRJdGVtLlVzZXJEYXRhLlBsYXllZCA9IGRhdGFbXCJQbGF5ZWRcIl0pXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9ncmFtRGF0YVN0b3JlLnVwZGF0ZUl0ZW0oY2hhbmdlZEl0ZW0pXG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAodXJsUGF0aG5hbWUuaW5jbHVkZXMoJ0Zhdm9yaXRlSXRlbXMnKSkge1xuICAgICAgICAgICAgICAgIC8vIHVwZGF0ZSB0aGUgZmF2b3VyaXRlIHN0YXRlIG9mIHRoZSBlcGlzb2RlXG4gICAgICAgICAgICAgICAgdGhpcy5sb2dnZXIuZGVidWcoJ1JlY2VpdmVkIEZhdm9yaXRlSXRlbXMnKVxuXG4gICAgICAgICAgICAgICAgY29uc3QgaXRlbUlkOiBzdHJpbmcgPSBleHRyYWN0S2V5RnJvbVN0cmluZyh1cmxQYXRobmFtZSwgJ0Zhdm9yaXRlSXRlbXMvJyk7XG4gICAgICAgICAgICAgICAgY29uc3QgY2hhbmdlZEl0ZW06IEJhc2VJdGVtID0gdGhpcy5wcm9ncmFtRGF0YVN0b3JlLmdldEl0ZW1CeUlkKGl0ZW1JZCk7XG4gICAgICAgICAgICAgICAgaWYgKCFjaGFuZ2VkSXRlbSkgcmV0dXJuXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHJlc3BvbnNlLmNsb25lKCkuanNvbigpLnRoZW4oKGRhdGEpID0+IGNoYW5nZWRJdGVtLlVzZXJEYXRhLklzRmF2b3JpdGUgPSBkYXRhW1wiSXNGYXZvcml0ZVwiXSk7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9ncmFtRGF0YVN0b3JlLnVwZGF0ZUl0ZW0oY2hhbmdlZEl0ZW0pXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBleHRyYWN0S2V5RnJvbVN0cmluZyhzZWFyY2hTdHJpbmc6IHN0cmluZywgc3RhcnRTdHJpbmc6IHN0cmluZywgZW5kU3RyaW5nOiBzdHJpbmcgPSAnJyk6IHN0cmluZyB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3RhcnRJbmRleDogbnVtYmVyID0gc2VhcmNoU3RyaW5nLmluZGV4T2Yoc3RhcnRTdHJpbmcpICsgc3RhcnRTdHJpbmcubGVuZ3RoXG4gICAgICAgICAgICAgICAgaWYgKGVuZFN0cmluZyAhPT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZW5kSW5kZXg6IG51bWJlciA9IHNlYXJjaFN0cmluZy5pbmRleE9mKGVuZFN0cmluZywgc3RhcnRJbmRleClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlYXJjaFN0cmluZy5zdWJzdHJpbmcoc3RhcnRJbmRleCwgZW5kSW5kZXgpXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlYXJjaFN0cmluZy5zdWJzdHJpbmcoc3RhcnRJbmRleClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBwdWJsaWMgc2F2ZUl0ZW1EYXRhKGl0ZW1EdG86IEl0ZW1EdG8sIHBhcmVudElkOiBzdHJpbmcgPSAnJyk6IHZvaWQge1xuICAgICAgICBpZiAoIWl0ZW1EdG8gfHwgIWl0ZW1EdG8uSXRlbXMgfHwgaXRlbUR0by5JdGVtcy5sZW5ndGggPT09IDApXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgXG4gICAgICAgIGNvbnN0IGZpcnN0SXRlbSA9IGl0ZW1EdG8uSXRlbXMuYXQoMClcbiAgICAgICAgY29uc3QgaXRlbUR0b1R5cGU6IEl0ZW1UeXBlID0gSXRlbVR5cGVbZmlyc3RJdGVtPy5UeXBlXVxuICAgICAgICBzd2l0Y2ggKGl0ZW1EdG9UeXBlKSB7XG4gICAgICAgICAgICBjYXNlIEl0ZW1UeXBlLkVwaXNvZGU6XG4gICAgICAgICAgICAgICAgLy8gZG8gbm90IG92ZXJ3cml0ZSBkYXRhIGlmIHdlIG9ubHkgcmVjZWl2ZSBvbmUgaXRlbSB3aGljaCBhbHJlYWR5IGV4aXN0c1xuICAgICAgICAgICAgICAgIGlmIChpdGVtRHRvLkl0ZW1zLmxlbmd0aCA+IDEgfHwgIXRoaXMucHJvZ3JhbURhdGFTdG9yZS5zZWFzb25zLmZsYXRNYXAoc2Vhc29uID0+IHNlYXNvbi5lcGlzb2Rlcykuc29tZShlcGlzb2RlID0+IGVwaXNvZGUuSWQgPT09IGZpcnN0SXRlbS5JZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ncmFtRGF0YVN0b3JlLnR5cGUgPSBJdGVtVHlwZS5TZXJpZXNcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ncmFtRGF0YVN0b3JlLnNlYXNvbnMgPSB0aGlzLmdldEZvcm1hdHRlZEVwaXNvZGVEYXRhKGl0ZW1EdG8pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlIEl0ZW1UeXBlLk1vdmllOlxuICAgICAgICAgICAgICAgIGlmIChpdGVtRHRvLkl0ZW1zLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ncmFtRGF0YVN0b3JlLnR5cGUgPSB0aGlzLnByb2dyYW1EYXRhU3RvcmUuYWN0aXZlTWVkaWFTb3VyY2VJZCAhPT0gJycgJiYgdGhpcy5wcm9ncmFtRGF0YVN0b3JlLmFjdGl2ZU1lZGlhU291cmNlSWQgPT09IHBhcmVudElkID8gSXRlbVR5cGUuQm94U2V0IDogSXRlbVR5cGUuTW92aWVcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ncmFtRGF0YVN0b3JlLm1vdmllcyA9IGl0ZW1EdG8uSXRlbXMubWFwKChtb3ZpZSwgaWR4KSA9PiAoe1xuICAgICAgICAgICAgICAgICAgICAgICAgLi4ubW92aWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBJbmRleE51bWJlcjogaWR4ICsgMVxuICAgICAgICAgICAgICAgICAgICB9KSlcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gZG8gbm90IG92ZXJ3cml0ZSBkYXRhIGlmIHdlIG9ubHkgcmVjZWl2ZSBvbmUgaXRlbSB3aGljaCBhbHJlYWR5IGV4aXN0c1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5wcm9ncmFtRGF0YVN0b3JlLm1vdmllcy5zb21lKG1vdmllID0+IG1vdmllLklkID09PSBmaXJzdEl0ZW0uSWQpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5wcm9ncmFtRGF0YVN0b3JlLm1vdmllcy5zb21lKG1vdmllID0+IG1vdmllLlNvcnROYW1lID09PSBmaXJzdEl0ZW0uU29ydE5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2dyYW1EYXRhU3RvcmUudHlwZSA9IHRoaXMucHJvZ3JhbURhdGFTdG9yZS5hY3RpdmVNZWRpYVNvdXJjZUlkICE9PSAnJyAmJiB0aGlzLnByb2dyYW1EYXRhU3RvcmUuYWN0aXZlTWVkaWFTb3VyY2VJZCA9PT0gcGFyZW50SWQgPyBJdGVtVHlwZS5Cb3hTZXQgOiBJdGVtVHlwZS5Nb3ZpZVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvZ3JhbURhdGFTdG9yZS5tb3ZpZXMgPSBpdGVtRHRvLkl0ZW1zLm1hcCgobW92aWUsIGlkeCkgPT4gKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLm1vdmllLFxuICAgICAgICAgICAgICAgICAgICAgICAgSW5kZXhOdW1iZXI6IGlkeCArIDFcbiAgICAgICAgICAgICAgICAgICAgfSkpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlIEl0ZW1UeXBlLlZpZGVvOlxuICAgICAgICAgICAgICAgIGlmIChpdGVtRHRvLkl0ZW1zLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ncmFtRGF0YVN0b3JlLnR5cGUgPSB0aGlzLnByb2dyYW1EYXRhU3RvcmUuYWN0aXZlTWVkaWFTb3VyY2VJZCAhPT0gJycgJiYgdGhpcy5wcm9ncmFtRGF0YVN0b3JlLmFjdGl2ZU1lZGlhU291cmNlSWQgPT09IHBhcmVudElkID8gSXRlbVR5cGUuRm9sZGVyIDogSXRlbVR5cGUuVmlkZW9cbiAgICAgICAgICAgICAgICAgICAgaXRlbUR0by5JdGVtcy5zb3J0KChhLCBiKSA9PiAoYS5Tb3J0TmFtZSAmJiBiLlNvcnROYW1lKSA/IGEuU29ydE5hbWUubG9jYWxlQ29tcGFyZShiLlNvcnROYW1lKSA6IDApXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvZ3JhbURhdGFTdG9yZS5tb3ZpZXMgPSBpdGVtRHRvLkl0ZW1zLm1hcCgodmlkZW8sIGlkeCkgPT4gKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLnZpZGVvLFxuICAgICAgICAgICAgICAgICAgICAgICAgSW5kZXhOdW1iZXI6IGlkeCArIDFcbiAgICAgICAgICAgICAgICAgICAgfSkpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIGRvIG5vdCBvdmVyd3JpdGUgZGF0YSBpZiB3ZSBvbmx5IHJlY2VpdmUgb25lIGl0ZW0gd2hpY2ggYWxyZWFkeSBleGlzdHNcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMucHJvZ3JhbURhdGFTdG9yZS5tb3ZpZXMuc29tZSh2aWRlbyA9PiB2aWRlby5JZCA9PT0gZmlyc3RJdGVtLklkKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMucHJvZ3JhbURhdGFTdG9yZS5tb3ZpZXMuc29tZSh2aWRlbyA9PiB2aWRlby5Tb3J0TmFtZSA9PT0gZmlyc3RJdGVtLlNvcnROYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ncmFtRGF0YVN0b3JlLnR5cGUgPSB0aGlzLnByb2dyYW1EYXRhU3RvcmUuYWN0aXZlTWVkaWFTb3VyY2VJZCAhPT0gJycgJiYgdGhpcy5wcm9ncmFtRGF0YVN0b3JlLmFjdGl2ZU1lZGlhU291cmNlSWQgPT09IHBhcmVudElkID8gSXRlbVR5cGUuRm9sZGVyIDogSXRlbVR5cGUuVmlkZW9cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpdGVtRHRvLkl0ZW1zLnNvcnQoKGEsIGIpID0+IChhLlNvcnROYW1lICYmIGIuU29ydE5hbWUpID8gYS5Tb3J0TmFtZS5sb2NhbGVDb21wYXJlKGIuU29ydE5hbWUpIDogMClcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ncmFtRGF0YVN0b3JlLm1vdmllcyA9IGl0ZW1EdG8uSXRlbXMubWFwKCh2aWRlbywgaWR4KSA9PiAoe1xuICAgICAgICAgICAgICAgICAgICAgICAgLi4udmlkZW8sXG4gICAgICAgICAgICAgICAgICAgICAgICBJbmRleE51bWJlcjogaWR4ICsgMVxuICAgICAgICAgICAgICAgICAgICB9KSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHRoaXMubG9nZ2VyLmVycm9yKFwiQ291bGRuJ3Qgc2F2ZSBpdGVtcyBmcm9tIHJlc3BvbnNlXCIsIGl0ZW1EdG8pO1xuICAgIH1cbiAgICBcbiAgICBwdWJsaWMgZ2V0Rm9ybWF0dGVkRXBpc29kZURhdGEgPSAoaXRlbUR0bzogSXRlbUR0bykgPT4ge1xuICAgICAgICBjb25zdCBlcGlzb2RlRGF0YTogQmFzZUl0ZW1bXSA9IGl0ZW1EdG8uSXRlbXNcbiAgICAgICAgXG4gICAgICAgIC8vIGdldCBhbGwgZGlmZmVyZW50IHNlYXNvbklkc1xuICAgICAgICBjb25zdCBzZWFzb25JZHM6IFNldDxzdHJpbmc+ID0gbmV3IFNldDxzdHJpbmc+KGVwaXNvZGVEYXRhLm1hcCgoZXBpc29kZTogQmFzZUl0ZW0pOiBzdHJpbmcgPT4gZXBpc29kZS5TZWFzb25JZCkpXG5cbiAgICAgICAgLy8gZ3JvdXAgdGhlIGVwaXNvZGVzIGJ5IHNlYXNvbklkXG4gICAgICAgIGNvbnN0IGdyb3VwOiBSZWNvcmQ8c3RyaW5nLCBCYXNlSXRlbVtdPiA9IGdyb3VwQnkoZXBpc29kZURhdGEsIChlcGlzb2RlOiBCYXNlSXRlbSk6IHN0cmluZyA9PiBlcGlzb2RlLlNlYXNvbklkKVxuXG4gICAgICAgIGNvbnN0IHNlYXNvbnM6IFNlYXNvbltdID0gW11cbiAgICAgICAgY29uc3QgaXRlcmF0b3I6IEl0ZXJhYmxlSXRlcmF0b3I8c3RyaW5nPiA9IHNlYXNvbklkcy52YWx1ZXMoKVxuICAgICAgICBsZXQgdmFsdWU6IEl0ZXJhdG9yUmVzdWx0PHN0cmluZz4gPSBpdGVyYXRvci5uZXh0KClcbiAgICAgICAgd2hpbGUgKCF2YWx1ZS5kb25lKSB7XG4gICAgICAgICAgICBjb25zdCBzZWFzb25JZDogc3RyaW5nID0gdmFsdWUudmFsdWVcbiAgICAgICAgICAgIGNvbnN0IHNlYXNvbjogU2Vhc29uID0ge1xuICAgICAgICAgICAgICAgIHNlYXNvbklkOiBzZWFzb25JZCxcbiAgICAgICAgICAgICAgICBzZWFzb25OYW1lOiBncm91cFtzZWFzb25JZF0uYXQoMCkuU2Vhc29uTmFtZSxcbiAgICAgICAgICAgICAgICBlcGlzb2RlczogZ3JvdXBbc2Vhc29uSWRdLFxuICAgICAgICAgICAgICAgIEluZGV4TnVtYmVyOiBzZWFzb25zLmxlbmd0aFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBzZWFzb25zLnB1c2goc2Vhc29uKVxuICAgICAgICAgICAgdmFsdWUgPSBpdGVyYXRvci5uZXh0KClcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzZWFzb25zXG4gICAgICAgIFxuICAgICAgICBmdW5jdGlvbiBncm91cEJ5PFQ+KGFycjogVFtdLCBmbjogKGl0ZW06IFQpID0+IGFueSk6IFJlY29yZDxzdHJpbmcsIFRbXT4ge1xuICAgICAgICAgICAgcmV0dXJuIGFyci5yZWR1Y2U8UmVjb3JkPHN0cmluZywgVFtdPj4oKHByZXY6IFJlY29yZDxzdHJpbmcsIFRbXT4sIGN1cnI6IFQpOiB7fSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZ3JvdXBLZXkgPSBmbihjdXJyKVxuICAgICAgICAgICAgICAgIGNvbnN0IGdyb3VwOiBUW10gPSBwcmV2W2dyb3VwS2V5XSB8fCBbXVxuICAgICAgICAgICAgICAgIGdyb3VwLnB1c2goY3VycilcbiAgICAgICAgICAgICAgICByZXR1cm4geyAuLi5wcmV2LCBbZ3JvdXBLZXldOiBncm91cCB9XG4gICAgICAgICAgICB9LCB7fSlcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBMb2dnZXIge1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgbG9nX3ByZWZpeDogc3RyaW5nID0gXCJbSW5QbGF5ZXJFcGlzb2RlUHJldmlld11cIikge1xuICAgIH1cblxuICAgIHB1YmxpYyBkZWJ1Zyhtc2c6IHN0cmluZywgLi4uZGV0YWlsczogYW55W10pOiB2b2lkIHtcbiAgICAgICAgLy8gY29uc29sZS5kZWJ1ZyhgJHt0aGlzLmxvZ19wcmVmaXh9ICR7bXNnfWAsIGRldGFpbHMpO1xuICAgIH1cblxuICAgIHB1YmxpYyBlcnJvcihtc2c6IHN0cmluZywgLi4uZGV0YWlsczogYW55W10pOiB2b2lkIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihgJHt0aGlzLmxvZ19wcmVmaXh9ICR7bXNnfWAsIGRldGFpbHMpO1xuICAgIH1cblxuICAgIHB1YmxpYyBpbmZvKG1zZzogc3RyaW5nLCAuLi5kZXRhaWxzOiBhbnlbXSk6IHZvaWQge1xuICAgICAgICBjb25zb2xlLmluZm8oYCR7dGhpcy5sb2dfcHJlZml4fSAke21zZ31gLCBkZXRhaWxzKTtcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7TG9nZ2VyfSBmcm9tIFwiLi9Mb2dnZXJcIjtcbmltcG9ydCB7RW5kcG9pbnRzfSBmcm9tIFwiLi4vRW5kcG9pbnRzXCI7XG5cbmV4cG9ydCBjbGFzcyBQbGF5YmFja0hhbmRsZXIge1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgbG9nZ2VyOiBMb2dnZXIpIHsgfVxuXG4gICAgYXN5bmMgcGxheShlcGlzb2RlSWQ6IHN0cmluZywgc3RhcnRQb3NpdGlvblRpY2tzOiBudW1iZXIpOiBQcm9taXNlPHZvaWQgfCBSZXNwb25zZT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgdXJsID0gQXBpQ2xpZW50LmdldFVybChgLyR7RW5kcG9pbnRzLkJBU0V9JHtFbmRwb2ludHMuUExBWV9NRURJQX1gXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoJ3t1c2VySWR9JywgQXBpQ2xpZW50LmdldEN1cnJlbnRVc2VySWQoKSlcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgne2RldmljZUlkfScsIEFwaUNsaWVudC5kZXZpY2VJZCgpKVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKCd7ZXBpc29kZUlkfScsIGVwaXNvZGVJZClcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgne3RpY2tzfScsIHN0YXJ0UG9zaXRpb25UaWNrcy50b1N0cmluZygpKSlcblxuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IEFwaUNsaWVudC5hamF4KHsgdHlwZTogJ0dFVCcsIHVybCB9KVxuICAgICAgICB9IGNhdGNoIChleCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9nZ2VyLmVycm9yKGBDb3VsZG4ndCBzdGFydCB0aGUgcGxheWJhY2sgb2YgYW4gZXBpc29kZWAsIGV4KVxuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCB7UHJvZ3JhbURhdGF9IGZyb20gXCIuLi9Nb2RlbHMvUHJvZ3JhbURhdGFcIjtcbmltcG9ydCB7U2Vhc29ufSBmcm9tIFwiLi4vTW9kZWxzL1NlYXNvblwiO1xuaW1wb3J0IHtCYXNlSXRlbX0gZnJvbSBcIi4uL01vZGVscy9FcGlzb2RlXCI7XG5pbXBvcnQge0l0ZW1UeXBlfSBmcm9tIFwiLi4vTW9kZWxzL0l0ZW1UeXBlXCI7XG5pbXBvcnQge0RlZmF1bHRQbHVnaW5TZXR0aW5ncywgUGx1Z2luU2V0dGluZ3N9IGZyb20gXCIuLi9Nb2RlbHMvUGx1Z2luU2V0dGluZ3NcIjtcbmltcG9ydCB7RGVmYXVsdFNlcnZlclNldHRpbmdzLCBTZXJ2ZXJTZXR0aW5nc30gZnJvbSBcIi4uL01vZGVscy9TZXJ2ZXJTZXR0aW5nc1wiO1xuXG5leHBvcnQgY2xhc3MgUHJvZ3JhbURhdGFTdG9yZSB7XG4gICAgcHJpdmF0ZSBfcHJvZ3JhbURhdGE6IFByb2dyYW1EYXRhXG4gICAgcHJpdmF0ZSBwbGF5YmFja1N0YXRlTGlzdGVuZXJzOiBTZXQ8KCkgPT4gdm9pZD4gPSBuZXcgU2V0KClcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLl9wcm9ncmFtRGF0YSA9IHtcbiAgICAgICAgICAgIGFjdGl2ZU1lZGlhU291cmNlSWQ6ICcnLFxuICAgICAgICAgICAgYm94U2V0TmFtZTogJycsXG4gICAgICAgICAgICBwbGF5YmFja09yZGVyOiAnRGVmYXVsdCcsXG4gICAgICAgICAgICBub3dQbGF5aW5nUXVldWVJZHM6IFtdLFxuICAgICAgICAgICAgbm93UGxheWluZ1F1ZXVlVmVyc2lvbjogMCxcbiAgICAgICAgICAgIHR5cGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIG1vdmllczogW10sXG4gICAgICAgICAgICBzZWFzb25zOiBbXSxcbiAgICAgICAgICAgIHBsdWdpblNldHRpbmdzOiBEZWZhdWx0UGx1Z2luU2V0dGluZ3MsXG4gICAgICAgICAgICBzZXJ2ZXJTZXR0aW5nczogRGVmYXVsdFNlcnZlclNldHRpbmdzXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IGFjdGl2ZU1lZGlhU291cmNlSWQoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Byb2dyYW1EYXRhLmFjdGl2ZU1lZGlhU291cmNlSWRcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0IGFjdGl2ZU1lZGlhU291cmNlSWQoYWN0aXZlTWVkaWFTb3VyY2VJZDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuX3Byb2dyYW1EYXRhLmFjdGl2ZU1lZGlhU291cmNlSWQgPSBhY3RpdmVNZWRpYVNvdXJjZUlkXG4gICAgfVxuXG4gICAgcHVibGljIGdldCBhY3RpdmVTZWFzb24oKTogU2Vhc29uIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2Vhc29ucy5maW5kKHNlYXNvbiA9PiBzZWFzb24uZXBpc29kZXMuc29tZShlcGlzb2RlID0+IGVwaXNvZGUuSWQgPT09IHRoaXMuYWN0aXZlTWVkaWFTb3VyY2VJZCkpXG4gICAgfVxuICAgIFxuICAgIHB1YmxpYyBnZXQgdHlwZSgpOiBJdGVtVHlwZSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wcm9ncmFtRGF0YS50eXBlXG4gICAgfVxuICAgIFxuICAgIHB1YmxpYyBzZXQgdHlwZSh0eXBlOiBJdGVtVHlwZSkge1xuICAgICAgICB0aGlzLl9wcm9ncmFtRGF0YS50eXBlID0gdHlwZVxuICAgIH1cbiAgICBcbiAgICBwdWJsaWMgZ2V0IGJveFNldE5hbWUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Byb2dyYW1EYXRhLmJveFNldE5hbWVcbiAgICB9XG4gICAgXG4gICAgcHVibGljIHNldCBib3hTZXROYW1lKGJveFNldE5hbWU6IHN0cmluZykge1xuICAgICAgICB0aGlzLl9wcm9ncmFtRGF0YS5ib3hTZXROYW1lID0gYm94U2V0TmFtZVxuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgcGxheWJhY2tPcmRlcigpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5fcHJvZ3JhbURhdGEucGxheWJhY2tPcmRlclxuICAgIH1cblxuICAgIHB1YmxpYyBzZXRQbGF5YmFja09yZGVyKHBsYXliYWNrT3JkZXI6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICBjb25zdCBub3JtYWxpemVkT3JkZXI6IHN0cmluZyA9IHBsYXliYWNrT3JkZXIgPz8gJ0RlZmF1bHQnXG4gICAgICAgIGlmICh0aGlzLl9wcm9ncmFtRGF0YS5wbGF5YmFja09yZGVyID09PSBub3JtYWxpemVkT3JkZXIpXG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgICB0aGlzLl9wcm9ncmFtRGF0YS5wbGF5YmFja09yZGVyID0gbm9ybWFsaXplZE9yZGVyXG4gICAgICAgIHRoaXMubm90aWZ5UGxheWJhY2tTdGF0ZUNoYW5nZWQoKVxuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgbm93UGxheWluZ1F1ZXVlSWRzKCk6IHN0cmluZ1tdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Byb2dyYW1EYXRhLm5vd1BsYXlpbmdRdWV1ZUlkc1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgbm93UGxheWluZ1F1ZXVlVmVyc2lvbigpOiBudW1iZXIgfCBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5fcHJvZ3JhbURhdGEubm93UGxheWluZ1F1ZXVlVmVyc2lvblxuICAgIH1cblxuICAgIHB1YmxpYyBzZXROb3dQbGF5aW5nUXVldWUoaWRzOiBzdHJpbmdbXSk6IHZvaWQge1xuICAgICAgICBjb25zdCBub3JtYWxpemVkSWRzOiBzdHJpbmdbXSA9IChpZHMgPz8gW10pLmZpbHRlcigoaWQ6IHN0cmluZyk6IGJvb2xlYW4gPT4gQm9vbGVhbihpZCkpXG4gICAgICAgIGlmICh0aGlzLmFycmF5c0VxdWFsKHRoaXMuX3Byb2dyYW1EYXRhLm5vd1BsYXlpbmdRdWV1ZUlkcywgbm9ybWFsaXplZElkcykpXG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgICB0aGlzLl9wcm9ncmFtRGF0YS5ub3dQbGF5aW5nUXVldWVJZHMgPSBub3JtYWxpemVkSWRzXG4gICAgICAgIHRoaXMuX3Byb2dyYW1EYXRhLm5vd1BsYXlpbmdRdWV1ZVZlcnNpb24gPSBEYXRlLm5vdygpXG4gICAgICAgIHRoaXMubm90aWZ5UGxheWJhY2tTdGF0ZUNoYW5nZWQoKVxuICAgIH1cblxuICAgIHB1YmxpYyBpc1NodWZmbGVBY3RpdmUoKTogYm9vbGVhbiB7XG4gICAgICAgIGNvbnN0IHBsYXliYWNrT3JkZXIgPSAodGhpcy5fcHJvZ3JhbURhdGEucGxheWJhY2tPcmRlciA/PyAnJykudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIHJldHVybiBwbGF5YmFja09yZGVyID09PSAnc2h1ZmZsZScgfHwgcGxheWJhY2tPcmRlciA9PT0gJ3JhbmRvbSdcbiAgICB9XG5cbiAgICBwdWJsaWMgc3Vic2NyaWJlUGxheWJhY2tTdGF0ZUNoYW5nZWQobGlzdGVuZXI6ICgpID0+IHZvaWQpOiAoKSA9PiB2b2lkIHtcbiAgICAgICAgdGhpcy5wbGF5YmFja1N0YXRlTGlzdGVuZXJzLmFkZChsaXN0ZW5lcilcbiAgICAgICAgcmV0dXJuICgpID0+IHRoaXMucGxheWJhY2tTdGF0ZUxpc3RlbmVycy5kZWxldGUobGlzdGVuZXIpXG4gICAgfVxuICAgIFxuICAgIHB1YmxpYyBnZXQgbW92aWVzKCk6IEJhc2VJdGVtW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5fcHJvZ3JhbURhdGEubW92aWVzXG4gICAgfVxuICAgIFxuICAgIHB1YmxpYyBzZXQgbW92aWVzKG1vdmllczogQmFzZUl0ZW1bXSkge1xuICAgICAgICB0aGlzLl9wcm9ncmFtRGF0YS5tb3ZpZXMgPSBtb3ZpZXNcbiAgICAgICAgdGhpcy5fcHJvZ3JhbURhdGEuc2Vhc29ucyA9IFtdXG4gICAgfVxuXG4gICAgcHVibGljIGdldCBzZWFzb25zKCk6IFNlYXNvbltdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Byb2dyYW1EYXRhLnNlYXNvbnNcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0IHNlYXNvbnMoc2Vhc29uczogU2Vhc29uW10pIHtcbiAgICAgICAgdGhpcy5fcHJvZ3JhbURhdGEuc2Vhc29ucyA9IHNlYXNvbnNcbiAgICAgICAgdGhpcy5fcHJvZ3JhbURhdGEubW92aWVzID0gW11cbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IHBsdWdpblNldHRpbmdzKCk6IFBsdWdpblNldHRpbmdzIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Byb2dyYW1EYXRhLnBsdWdpblNldHRpbmdzXG4gICAgfVxuXG4gICAgcHVibGljIHNldCBwbHVnaW5TZXR0aW5ncyhzZXR0aW5nczogUGx1Z2luU2V0dGluZ3MpIHtcbiAgICAgICAgdGhpcy5fcHJvZ3JhbURhdGEucGx1Z2luU2V0dGluZ3MgPSBzZXR0aW5nc1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgc2VydmVyU2V0dGluZ3MoKTogU2VydmVyU2V0dGluZ3Mge1xuICAgICAgICByZXR1cm4gdGhpcy5fcHJvZ3JhbURhdGEuc2VydmVyU2V0dGluZ3NcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0IHNlcnZlclNldHRpbmdzKHNldHRpbmdzOiBTZXJ2ZXJTZXR0aW5ncykge1xuICAgICAgICB0aGlzLl9wcm9ncmFtRGF0YS5zZXJ2ZXJTZXR0aW5ncyA9IHNldHRpbmdzXG4gICAgfVxuICAgIFxuICAgIHB1YmxpYyBnZXQgZGF0YUlzQWxsb3dlZEZvclByZXZpZXcoKSB7XG4gICAgICAgIGlmICghdGhpcy5hbGxvd2VkUHJldmlld1R5cGVzLmluY2x1ZGVzKHRoaXMudHlwZSkpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgXG4gICAgICAgIHN3aXRjaCAodGhpcy50eXBlKSB7XG4gICAgICAgICAgICBjYXNlIEl0ZW1UeXBlLlNlcmllczpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hY3RpdmVTZWFzb24uZXBpc29kZXMubGVuZ3RoID49IDFcbiAgICAgICAgICAgIGNhc2UgSXRlbVR5cGUuTW92aWU6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgICAgIGNhc2UgSXRlbVR5cGUuQm94U2V0OlxuICAgICAgICAgICAgY2FzZSBJdGVtVHlwZS5Gb2xkZXI6XG4gICAgICAgICAgICBjYXNlIEl0ZW1UeXBlLlZpZGVvOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm1vdmllcy5sZW5ndGggPj0gMVxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBwdWJsaWMgZ2V0IGFsbG93ZWRQcmV2aWV3VHlwZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBsdWdpblNldHRpbmdzLkVuYWJsZWRJdGVtVHlwZXNcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0SXRlbUJ5SWQoaXRlbUlkOiBzdHJpbmcpOiBCYXNlSXRlbSB7XG4gICAgICAgIHN3aXRjaCAodGhpcy50eXBlKSB7XG4gICAgICAgICAgICBjYXNlIEl0ZW1UeXBlLlNlcmllczpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zZWFzb25zXG4gICAgICAgICAgICAgICAgICAgIC5mbGF0TWFwKHNlYXNvbiA9PiBzZWFzb24uZXBpc29kZXMpXG4gICAgICAgICAgICAgICAgICAgIC5maW5kKGVwaXNvZGUgPT4gZXBpc29kZS5JZCA9PT0gaXRlbUlkKVxuICAgICAgICAgICAgY2FzZSBJdGVtVHlwZS5Cb3hTZXQ6XG4gICAgICAgICAgICBjYXNlIEl0ZW1UeXBlLk1vdmllOlxuICAgICAgICAgICAgY2FzZSBJdGVtVHlwZS5Gb2xkZXI6XG4gICAgICAgICAgICBjYXNlIEl0ZW1UeXBlLlZpZGVvOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm1vdmllcy5maW5kKG1vdmllID0+IG1vdmllLklkID09PSBpdGVtSWQpXG4gICAgICAgICAgICBkZWZhdWx0OiBcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgdXBkYXRlSXRlbShpdGVtVG9VcGRhdGU6IEJhc2VJdGVtKTogdm9pZCB7XG4gICAgICAgIHN3aXRjaCAodGhpcy50eXBlKSB7XG4gICAgICAgICAgICBjYXNlIEl0ZW1UeXBlLlNlcmllczoge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzZWFzb246IFNlYXNvbiA9IHRoaXMuc2Vhc29ucy5maW5kKHNlYXNvbiA9PiBzZWFzb24uc2Vhc29uSWQgPT09IGl0ZW1Ub1VwZGF0ZS5TZWFzb25JZClcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWFzb25zID0gW1xuICAgICAgICAgICAgICAgICAgICAgICAgLi4uIHRoaXMuc2Vhc29ucy5maWx0ZXIoc2Vhc29uID0+IHNlYXNvbi5zZWFzb25JZCAhPT0gaXRlbVRvVXBkYXRlLlNlYXNvbklkKSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLnNlYXNvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcGlzb2RlczogWy4uLiBzZWFzb24uZXBpc29kZXMuZmlsdGVyKGVwaXNvZGUgPT4gZXBpc29kZS5JZCAhPT0gaXRlbVRvVXBkYXRlLklkKSwgaXRlbVRvVXBkYXRlXVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlIEl0ZW1UeXBlLkJveFNldDpcbiAgICAgICAgICAgIGNhc2UgSXRlbVR5cGUuTW92aWU6XG4gICAgICAgICAgICBjYXNlIEl0ZW1UeXBlLkZvbGRlcjpcbiAgICAgICAgICAgIGNhc2UgSXRlbVR5cGUuVmlkZW86XG4gICAgICAgICAgICAgICAgdGhpcy5tb3ZpZXMgPSBbLi4uIHRoaXMubW92aWVzLmZpbHRlcihtb3ZpZSA9PiBtb3ZpZS5JZCAhPT0gaXRlbVRvVXBkYXRlLklkKSwgaXRlbVRvVXBkYXRlXVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGhhc0l0ZW0oaXRlbUlkOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIEJvb2xlYW4odGhpcy5nZXRJdGVtQnlJZChpdGVtSWQpKVxuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBlbnN1cmVJdGVtc0xvYWRlZEJ5SWRzKGlkczogc3RyaW5nW10pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgY29uc3QgbWlzc2luZ0lkczogc3RyaW5nW10gPSAoaWRzID8/IFtdKS5maWx0ZXIoKGlkOiBzdHJpbmcpOiBib29sZWFuID0+IEJvb2xlYW4oaWQpICYmICF0aGlzLmhhc0l0ZW0oaWQpKVxuICAgICAgICBpZiAobWlzc2luZ0lkcy5sZW5ndGggPT09IDApXG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgICBjb25zdCB1c2VySWQ6IHN0cmluZyA9IEFwaUNsaWVudC5nZXRDdXJyZW50VXNlcklkPy4oKVxuICAgICAgICBpZiAoIXVzZXJJZClcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgQXBpQ2xpZW50LmdldEl0ZW1zKHVzZXJJZCwgeyBJZHM6IG1pc3NpbmdJZHMuam9pbignLCcpIH0pXG4gICAgICAgIGNvbnN0IGl0ZW1zOiBCYXNlSXRlbVtdID0gKHJlc3BvbnNlPy5JdGVtcyA/PyBbXSkubWFwKChpdGVtKSA9PiBpdGVtIGFzIEJhc2VJdGVtKVxuICAgICAgICBpZiAoaXRlbXMubGVuZ3RoID09PSAwKVxuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgdGhpcy5tZXJnZUl0ZW1zKGl0ZW1zKVxuICAgICAgICB0aGlzLm5vdGlmeVBsYXliYWNrU3RhdGVDaGFuZ2VkKClcbiAgICB9XG5cbiAgICBwcml2YXRlIG1lcmdlSXRlbXMoaXRlbXM6IEJhc2VJdGVtW10pOiB2b2lkIHtcbiAgICAgICAgaXRlbXMuZm9yRWFjaCgoaXRlbTogQmFzZUl0ZW0pOiB2b2lkID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGl0ZW1UeXBlOiBJdGVtVHlwZSA9IEl0ZW1UeXBlW2l0ZW0uVHlwZSBhcyBrZXlvZiB0eXBlb2YgSXRlbVR5cGVdXG4gICAgICAgICAgICBzd2l0Y2ggKGl0ZW1UeXBlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBJdGVtVHlwZS5FcGlzb2RlOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1lcmdlRXBpc29kZUl0ZW0oaXRlbSlcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICBjYXNlIEl0ZW1UeXBlLkJveFNldDpcbiAgICAgICAgICAgICAgICBjYXNlIEl0ZW1UeXBlLk1vdmllOlxuICAgICAgICAgICAgICAgIGNhc2UgSXRlbVR5cGUuRm9sZGVyOlxuICAgICAgICAgICAgICAgIGNhc2UgSXRlbVR5cGUuVmlkZW86XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy50eXBlKVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50eXBlID0gaXRlbVR5cGVcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3ZpZXMgPSBbLi4udGhpcy5tb3ZpZXMuZmlsdGVyKG1vdmllID0+IG1vdmllLklkICE9PSBpdGVtLklkKSwgaXRlbV1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUl0ZW0oaXRlbSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBwcml2YXRlIG1lcmdlRXBpc29kZUl0ZW0oaXRlbTogQmFzZUl0ZW0pOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLnR5cGUpXG4gICAgICAgICAgICB0aGlzLnR5cGUgPSBJdGVtVHlwZS5TZXJpZXNcblxuICAgICAgICBpZiAoIWl0ZW0uU2Vhc29uSWQpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlSXRlbShpdGVtKVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzZWFzb25JbmRleCA9IHRoaXMuc2Vhc29ucy5maW5kSW5kZXgoc2Vhc29uID0+IHNlYXNvbi5zZWFzb25JZCA9PT0gaXRlbS5TZWFzb25JZClcbiAgICAgICAgaWYgKHNlYXNvbkluZGV4ID09PSAtMSkge1xuICAgICAgICAgICAgdGhpcy5zZWFzb25zID0gW1xuICAgICAgICAgICAgICAgIC4uLnRoaXMuc2Vhc29ucyxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHNlYXNvbklkOiBpdGVtLlNlYXNvbklkLFxuICAgICAgICAgICAgICAgICAgICBzZWFzb25OYW1lOiBpdGVtLlNlYXNvbk5hbWUsXG4gICAgICAgICAgICAgICAgICAgIGVwaXNvZGVzOiBbaXRlbV0sXG4gICAgICAgICAgICAgICAgICAgIEluZGV4TnVtYmVyOiB0aGlzLnNlYXNvbnMubGVuZ3RoXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzZWFzb24gPSB0aGlzLnNlYXNvbnNbc2Vhc29uSW5kZXhdXG4gICAgICAgIGNvbnN0IHVwZGF0ZWRTZWFzb246IFNlYXNvbiA9IHtcbiAgICAgICAgICAgIC4uLnNlYXNvbixcbiAgICAgICAgICAgIGVwaXNvZGVzOiBbLi4uc2Vhc29uLmVwaXNvZGVzLmZpbHRlcihlcGlzb2RlID0+IGVwaXNvZGUuSWQgIT09IGl0ZW0uSWQpLCBpdGVtXVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2Vhc29ucyA9IFtcbiAgICAgICAgICAgIC4uLnRoaXMuc2Vhc29ucy5zbGljZSgwLCBzZWFzb25JbmRleCksXG4gICAgICAgICAgICB1cGRhdGVkU2Vhc29uLFxuICAgICAgICAgICAgLi4udGhpcy5zZWFzb25zLnNsaWNlKHNlYXNvbkluZGV4ICsgMSlcbiAgICAgICAgXVxuICAgIH1cblxuICAgIHByaXZhdGUgbm90aWZ5UGxheWJhY2tTdGF0ZUNoYW5nZWQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMucGxheWJhY2tTdGF0ZUxpc3RlbmVycy5mb3JFYWNoKGxpc3RlbmVyID0+IGxpc3RlbmVyKCkpXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhcnJheXNFcXVhbChhOiBzdHJpbmdbXSwgYjogc3RyaW5nW10pOiBib29sZWFuIHtcbiAgICAgICAgaWYgKGEubGVuZ3RoICE9PSBiLmxlbmd0aClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChhW2ldICE9PSBiW2ldKVxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgfVxufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsImltcG9ydCB7TG9nZ2VyfSBmcm9tIFwiLi9TZXJ2aWNlcy9Mb2dnZXJcIjtcbmltcG9ydCB7QXV0aFNlcnZpY2V9IGZyb20gXCIuL1NlcnZpY2VzL0F1dGhTZXJ2aWNlXCI7XG5pbXBvcnQge1ByZXZpZXdCdXR0b25UZW1wbGF0ZX0gZnJvbSBcIi4vQ29tcG9uZW50cy9QcmV2aWV3QnV0dG9uVGVtcGxhdGVcIjtcbmltcG9ydCB7UHJvZ3JhbURhdGFTdG9yZX0gZnJvbSBcIi4vU2VydmljZXMvUHJvZ3JhbURhdGFTdG9yZVwiO1xuaW1wb3J0IHtEaWFsb2dDb250YWluZXJUZW1wbGF0ZX0gZnJvbSBcIi4vQ29tcG9uZW50cy9EaWFsb2dDb250YWluZXJUZW1wbGF0ZVwiO1xuaW1wb3J0IHtQbGF5YmFja0hhbmRsZXJ9IGZyb20gXCIuL1NlcnZpY2VzL1BsYXliYWNrSGFuZGxlclwiO1xuaW1wb3J0IHtMaXN0RWxlbWVudEZhY3Rvcnl9IGZyb20gXCIuL0xpc3RFbGVtZW50RmFjdG9yeVwiO1xuaW1wb3J0IHtQb3B1cFRpdGxlVGVtcGxhdGV9IGZyb20gXCIuL0NvbXBvbmVudHMvUG9wdXBUaXRsZVRlbXBsYXRlXCI7XG5pbXBvcnQge0RhdGFGZXRjaGVyfSBmcm9tIFwiLi9TZXJ2aWNlcy9EYXRhRmV0Y2hlclwiO1xuaW1wb3J0IHtJdGVtVHlwZX0gZnJvbSBcIi4vTW9kZWxzL0l0ZW1UeXBlXCI7XG5pbXBvcnQgeyBQbHVnaW5TZXR0aW5ncyB9IGZyb20gXCIuL01vZGVscy9QbHVnaW5TZXR0aW5nc1wiO1xuaW1wb3J0IHtTZXJ2ZXJTZXR0aW5nc30gZnJvbSBcIi4vTW9kZWxzL1NlcnZlclNldHRpbmdzXCI7XG5pbXBvcnQge0VuZHBvaW50c30gZnJvbSBcIi4vRW5kcG9pbnRzXCI7XG5cbi8vIGxvYWQgYW5kIGluamVjdCBpblBsYXllclByZXZpZXcuY3NzIGludG8gdGhlIHBhZ2Vcbi8qXG4gKiBJbmplY3Qgc3R5bGUgdG8gYmUgdXNlZCBmb3IgdGhlIHByZXZpZXcgcG9wdXBcbiAqL1xubGV0IGluUGxheWVyUHJldmlld1N0eWxlOiBIVE1MU3R5bGVFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKVxuaW5QbGF5ZXJQcmV2aWV3U3R5bGUuaWQgPSAnaW5QbGF5ZXJQcmV2aWV3U3R5bGUnXG5pblBsYXllclByZXZpZXdTdHlsZS50ZXh0Q29udGVudCA9IGBcbi5zZWxlY3RlZExpc3RJdGVtIHtcbiAgICBoZWlnaHQ6IGF1dG87XG59XG4ucHJldmlld0xpc3RJdGVtIHtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uOyBcbiAgICBhbGlnbi1pdGVtczogZmxleC1zdGFydDtcbn1cbi5wcmV2aWV3TGlzdEl0ZW1Db250ZW50IHtcbiAgICB3aWR0aDogMTAwJTsgXG4gICAgbWluLWhlaWdodDogMTUuNXZoOyBcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7IFxuICAgIGRpc3BsYXk6IGZsZXg7IFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG59XG4ucHJldmlld1BvcHVwIHtcbiAgICBhbmltYXRpb246IDE0MG1zIGVhc2Utb3V0IDBzIDEgbm9ybWFsIGJvdGggcnVubmluZyBzY2FsZXVwOyBcbiAgICBwb3NpdGlvbjogZml4ZWQ7IFxuICAgIG1hcmdpbjogMHB4OyBcbiAgICBib3R0b206IDEuNXZoOyBcbiAgICBsZWZ0OiA1MHZ3OyBcbiAgICB3aWR0aDogNDh2dztcbn1cbi5wcmV2aWV3UG9wdXBUaXRsZSB7XG4gICAgbWF4LWhlaWdodDogNHZoO1xufVxuLnByZXZpZXdQb3B1cFNjcm9sbGVyIHtcbiAgICBtYXgtaGVpZ2h0OiA2MHZoO1xufVxuLnByZXZpZXdRdWlja0FjdGlvbkNvbnRhaW5lciB7XG4gICAgbWFyZ2luLWxlZnQ6IGF1dG87IFxuICAgIG1hcmdpbi1yaWdodDogMWVtO1xufVxuLnByZXZpZXdFcGlzb2RlQ29udGFpbmVyIHtcbiAgICB3aWR0aDogMTAwJTtcbn1cbi5wcmV2aWV3RXBpc29kZVRpdGxlIHtcbiAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcbn1cbi5wcmV2aWV3RXBpc29kZUltYWdlQ2FyZCB7XG4gICAgbWF4LXdpZHRoOiAzMCU7XG59XG4ucHJldmlld0VwaXNvZGVEZXNjcmlwdGlvbiB7XG4gICAgbWFyZ2luLWxlZnQ6IDAuNWVtOyBcbiAgICBtYXJnaW4tdG9wOiAxZW07IFxuICAgIG1hcmdpbi1yaWdodDogMS41ZW07IFxuICAgIGRpc3BsYXk6IGJsb2NrO1xufVxuLnByZXZpZXdFcGlzb2RlRGV0YWlscyB7XG4gICAgbWFyZ2luLWxlZnQ6IDFlbTsgXG4gICAganVzdGlmeS1jb250ZW50OiBzdGFydCAhaW1wb3J0YW50O1xufVxuLmJsdXIge1xuICAgIGZpbHRlcjogYmx1cig2cHgpOyBcbiAgICB0cmFuc2l0aW9uOiBmaWx0ZXIgMC4zcyBlYXNlOyBcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG59XG4uYmx1cjpob3ZlciB7XG4gICAgZmlsdGVyOiBibHVyKDApO1xufVxuLnByZXZpZXdFcGlzb2RlSW1hZ2VDYXJkOmhvdmVyIC5ibHVyIHtcbiAgICBmaWx0ZXI6IGJsdXIoMCk7XG59XG5gXG5kb2N1bWVudD8uaGVhZD8uYXBwZW5kQ2hpbGQoaW5QbGF5ZXJQcmV2aWV3U3R5bGUpXG5cbi8vIGluaXQgc2VydmljZXMgYW5kIGhlbHBlcnNcbmNvbnN0IGxvZ2dlcjogTG9nZ2VyID0gbmV3IExvZ2dlcigpXG5jb25zdCBhdXRoU2VydmljZTogQXV0aFNlcnZpY2UgPSBuZXcgQXV0aFNlcnZpY2UoKVxuY29uc3QgcHJvZ3JhbURhdGFTdG9yZTogUHJvZ3JhbURhdGFTdG9yZSA9IG5ldyBQcm9ncmFtRGF0YVN0b3JlKClcbm5ldyBEYXRhRmV0Y2hlcihwcm9ncmFtRGF0YVN0b3JlLCBhdXRoU2VydmljZSwgbG9nZ2VyKVxuY29uc3QgcGxheWJhY2tIYW5kbGVyOiBQbGF5YmFja0hhbmRsZXIgPSBuZXcgUGxheWJhY2tIYW5kbGVyKGxvZ2dlcilcbmNvbnN0IGxpc3RFbGVtZW50RmFjdG9yeSA9IG5ldyBMaXN0RWxlbWVudEZhY3RvcnkocGxheWJhY2tIYW5kbGVyLCBwcm9ncmFtRGF0YVN0b3JlKVxuXG5mdW5jdGlvbiBpbml0aWFsaXplKCkge1xuICAgIC8vIEVuc3VyZSBBcGlDbGllbnQgZXhpc3RzIGFuZCB1c2VyIGlzIGxvZ2dlZCBpblxuICAgIGlmICh0eXBlb2YgQXBpQ2xpZW50ID09PSAndW5kZWZpbmVkJyB8fCAhQXBpQ2xpZW50LmdldEN1cnJlbnRVc2VySWQ/LigpKSB7XG4gICAgICAgIHNldFRpbWVvdXQoaW5pdGlhbGl6ZSwgMzAwKSAvLyBJbmNyZWFzZWQgcmV0cnkgZGVsYXkgc2xpZ2h0bHlcbiAgICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgQXBpQ2xpZW50LmdldFBsdWdpbkNvbmZpZ3VyYXRpb24oJzczODMzZDVmLTBiY2ItNDVkYy1hYjhiLTdjZTY2OGY0MzQ1ZCcpXG4gICAgICAgIC50aGVuKChjb25maWc6IFBsdWdpblNldHRpbmdzKSA9PiBwcm9ncmFtRGF0YVN0b3JlLnBsdWdpblNldHRpbmdzID0gY29uZmlnKVxuXG4gICAgY29uc3Qgc2VydmVyU2V0dGluZ3NVcmwgPSBBcGlDbGllbnQuZ2V0VXJsKGAvJHtFbmRwb2ludHMuQkFTRX0ke0VuZHBvaW50cy5TRVJWRVJfU0VUVElOR1N9YClcbiAgICBBcGlDbGllbnQuYWpheCh7IHR5cGU6ICdHRVQnLCB1cmw6IHNlcnZlclNldHRpbmdzVXJsLCBkYXRhVHlwZTogJ2pzb24nIH0pXG4gICAgICAgIC50aGVuKChjb25maWc6IFNlcnZlclNldHRpbmdzKSA9PiBwcm9ncmFtRGF0YVN0b3JlLnNlcnZlclNldHRpbmdzID0gY29uZmlnKVxufVxuaW5pdGlhbGl6ZSgpXG5cbmNvbnN0IHZpZGVvUGF0aHM6IHN0cmluZ1tdID0gWycvdmlkZW8nXVxubGV0IHByZXZpb3VzUm91dGVQYXRoOiBzdHJpbmcgPSBudWxsXG5sZXQgcHJldmlld0NvbnRhaW5lckxvYWRlZDogYm9vbGVhbiA9IGZhbHNlXG5sZXQgcGxheWJhY2tTdGF0ZVVuc3Vic2NyaWJlOiAoKCkgPT4gdm9pZCkgfCBudWxsID0gbnVsbFxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndmlld3Nob3cnLCB2aWV3U2hvd0V2ZW50SGFuZGxlcilcblxuZnVuY3Rpb24gdmlld1Nob3dFdmVudEhhbmRsZXIoKTogdm9pZCB7XG4gICAgY29uc3QgY3VycmVudFJvdXRlUGF0aDogc3RyaW5nID0gZ2V0TG9jYXRpb25QYXRoKClcblxuICAgIGZ1bmN0aW9uIGdldExvY2F0aW9uUGF0aCgpOiBzdHJpbmcge1xuICAgICAgICBjb25zdCBsb2NhdGlvbjogc3RyaW5nID0gd2luZG93LmxvY2F0aW9uLnRvU3RyaW5nKClcbiAgICAgICAgY29uc3QgY3VycmVudFJvdXRlSW5kZXg6IG51bWJlciA9IGxvY2F0aW9uLmxhc3RJbmRleE9mKCcvJylcbiAgICAgICAgcmV0dXJuIGxvY2F0aW9uLnN1YnN0cmluZyhjdXJyZW50Um91dGVJbmRleClcbiAgICB9XG5cbiAgICAvLyBJbml0aWFsIGF0dGVtcHQgdG8gbG9hZCB0aGUgdmlkZW8gdmlldyBvciBzY2hlZHVsZSByZXRyaWVzLlxuICAgIGF0dGVtcHRMb2FkVmlkZW9WaWV3KClcbiAgICBwcmV2aW91c1JvdXRlUGF0aCA9IGN1cnJlbnRSb3V0ZVBhdGhcblxuICAgIC8vIFRoaXMgZnVuY3Rpb24gYXR0ZW1wdHMgdG8gbG9hZCB0aGUgdmlkZW8gdmlldywgcmV0cnlpbmcgdXAgdG8gMyB0aW1lcyBpZiBuZWNlc3NhcnkuXG4gICAgZnVuY3Rpb24gYXR0ZW1wdExvYWRWaWRlb1ZpZXcocmV0cnlDb3VudCA9IDApOiB2b2lkIHtcbiAgICAgICAgaWYgKHZpZGVvUGF0aHMuaW5jbHVkZXMoY3VycmVudFJvdXRlUGF0aCkpIHtcbiAgICAgICAgICAgIGlmIChwcm9ncmFtRGF0YVN0b3JlLmRhdGFJc0FsbG93ZWRGb3JQcmV2aWV3KSB7XG4gICAgICAgICAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIHByZXZpZXcgY29udGFpbmVyIGlzIGFscmVhZHkgbG9hZGVkIGJlZm9yZSBsb2FkaW5nXG4gICAgICAgICAgICAgICAgaWYgKCFwcmV2aWV3Q29udGFpbmVyTG9hZGVkICYmICFpc1ByZXZpZXdCdXR0b25DcmVhdGVkKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgbG9hZFZpZGVvVmlldygpXG4gICAgICAgICAgICAgICAgICAgIHByZXZpZXdDb250YWluZXJMb2FkZWQgPSB0cnVlIC8vIFNldCBmbGFnIHRvIHRydWUgYWZ0ZXIgbG9hZGluZ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAocmV0cnlDb3VudCA8IDMpIHsgLy8gUmV0cnkgdXAgdG8gMyB0aW1lc1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsb2dnZXIuZGVidWcoYFJldHJ5ICMke3JldHJ5Q291bnQgKyAxfWApXG4gICAgICAgICAgICAgICAgICAgIGF0dGVtcHRMb2FkVmlkZW9WaWV3KHJldHJ5Q291bnQgKyAxKVxuICAgICAgICAgICAgICAgIH0sIDEwMDAwKSAvLyBXYWl0IDEwIHNlY29uZHMgZm9yIGVhY2ggcmV0cnlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh2aWRlb1BhdGhzLmluY2x1ZGVzKHByZXZpb3VzUm91dGVQYXRoKSkge1xuICAgICAgICAgICAgdW5sb2FkVmlkZW9WaWV3KClcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBsb2FkVmlkZW9WaWV3KCk6IHZvaWQge1xuICAgICAgICAvLyBhZGQgcHJldmlldyBidXR0b24gdG8gdGhlIHBhZ2VcbiAgICAgICAgY29uc3QgcGFyZW50OiBIVE1MRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idXR0b25zJykubGFzdEVsZW1lbnRDaGlsZC5wYXJlbnRFbGVtZW50OyAvLyBsYXN0RWxlbWVudENoaWxkLnBhcmVudEVsZW1lbnQgaXMgdXNlZCBmb3IgY2FzdGluZyBmcm9tIEVsZW1lbnQgdG8gSFRNTEVsZW1lbnRcbiAgICAgICAgXG4gICAgICAgIGxldCBpbmRleDogbnVtYmVyID0gQXJyYXkuZnJvbShwYXJlbnQuY2hpbGRyZW4pLmZpbmRJbmRleCgoY2hpbGQ6IEVsZW1lbnQpOiBib29sZWFuID0+IGNoaWxkLmNsYXNzTGlzdC5jb250YWlucyhcImJ0blVzZXJSYXRpbmdcIikpO1xuICAgICAgICAvLyBpZiBpbmRleCBpcyBpbnZhbGlkIHRyeSB0byB1c2UgdGhlIG9sZCBwb3NpdGlvbiAodXNlZCBpbiBKZWxseWZpbiAxMC44LjEyKVxuICAgICAgICBpZiAoaW5kZXggPT09IC0xKVxuICAgICAgICAgICAgaW5kZXggPSBBcnJheS5mcm9tKHBhcmVudC5jaGlsZHJlbikuZmluZEluZGV4KChjaGlsZDogRWxlbWVudCk6IGJvb2xlYW4gPT4gY2hpbGQuY2xhc3NMaXN0LmNvbnRhaW5zKFwib3NkVGltZVRleHRcIikpXG5cbiAgICAgICAgY29uc3QgcHJldmlld0J1dHRvbjogUHJldmlld0J1dHRvblRlbXBsYXRlID0gbmV3IFByZXZpZXdCdXR0b25UZW1wbGF0ZShwYXJlbnQsIGluZGV4KVxuICAgICAgICBwcmV2aWV3QnV0dG9uLnJlbmRlcihwcmV2aWV3QnV0dG9uQ2xpY2tIYW5kbGVyKVxuXG4gICAgICAgIGZ1bmN0aW9uIHByZXZpZXdCdXR0b25DbGlja0hhbmRsZXIoKTogdm9pZCB7XG4gICAgICAgICAgICBjb25zdCBkaWFsb2dDb250YWluZXI6IERpYWxvZ0NvbnRhaW5lclRlbXBsYXRlID0gbmV3IERpYWxvZ0NvbnRhaW5lclRlbXBsYXRlKGRvY3VtZW50LmJvZHksIGRvY3VtZW50LmJvZHkuY2hpbGRyZW4ubGVuZ3RoIC0gMSlcbiAgICAgICAgICAgIGRpYWxvZ0NvbnRhaW5lci5yZW5kZXIoKVxuXG4gICAgICAgICAgICBjb25zdCBjb250ZW50RGl2OiBIVE1MRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwb3B1cENvbnRlbnRDb250YWluZXInKVxuXG4gICAgICAgICAgICBjb25zdCBwb3B1cFRpdGxlOiBQb3B1cFRpdGxlVGVtcGxhdGUgPSBuZXcgUG9wdXBUaXRsZVRlbXBsYXRlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwb3B1cEZvY3VzQ29udGFpbmVyJyksIC0xLCBwcm9ncmFtRGF0YVN0b3JlKVxuICAgICAgICAgICAgbGV0IHNob3dpbmdTZWFzb25MaXN0OiBib29sZWFuID0gZmFsc2VcblxuICAgICAgICAgICAgY29uc3QgcmVuZGVyU2Vhc29uTGlzdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgICAgICBzaG93aW5nU2Vhc29uTGlzdCA9IHRydWVcbiAgICAgICAgICAgICAgICBwb3B1cFRpdGxlLnNldFZpc2libGUoZmFsc2UpXG4gICAgICAgICAgICAgICAgY29udGVudERpdi5pbm5lckhUTUwgPSAnJ1xuICAgICAgICAgICAgICAgIGxpc3RFbGVtZW50RmFjdG9yeS5jcmVhdGVTZWFzb25FbGVtZW50cyhwcm9ncmFtRGF0YVN0b3JlLnNlYXNvbnMsIGNvbnRlbnREaXYsIHByb2dyYW1EYXRhU3RvcmUuYWN0aXZlU2Vhc29uLkluZGV4TnVtYmVyLCBwb3B1cFRpdGxlKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCByZW5kZXJFcGlzb2RlTGlzdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgICAgICBzaG93aW5nU2Vhc29uTGlzdCA9IGZhbHNlXG4gICAgICAgICAgICAgICAgY29udGVudERpdi5pbm5lckhUTUwgPSAnJ1xuXG4gICAgICAgICAgICAgICAgY29uc3QgaXNTaHVmZmxlUXVldWUgPSBwcm9ncmFtRGF0YVN0b3JlLmlzU2h1ZmZsZUFjdGl2ZSgpICYmIHByb2dyYW1EYXRhU3RvcmUubm93UGxheWluZ1F1ZXVlSWRzLmxlbmd0aCA+IDBcblxuICAgICAgICAgICAgICAgIHN3aXRjaCAocHJvZ3JhbURhdGFTdG9yZS50eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgSXRlbVR5cGUuU2VyaWVzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNTaHVmZmxlUXVldWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3B1cFRpdGxlLnNldFRleHQoJ1VwIE5leHQgKFNodWZmbGUgUXVldWUpJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3B1cFRpdGxlLnNldFZpc2libGUodHJ1ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBhbGxFcGlzb2RlcyA9IHByb2dyYW1EYXRhU3RvcmUuc2Vhc29ucy5mbGF0TWFwKHNlYXNvbiA9PiBzZWFzb24uZXBpc29kZXMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlzdEVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVwaXNvZGVFbGVtZW50cyhhbGxFcGlzb2RlcywgY29udGVudERpdilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3B1cFRpdGxlLnNldFRleHQocHJvZ3JhbURhdGFTdG9yZS5hY3RpdmVTZWFzb24uc2Vhc29uTmFtZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvcHVwVGl0bGUuc2V0VmlzaWJsZSh0cnVlKVxuICAgICAgICAgICAgICAgICAgICAgICAgbGlzdEVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVwaXNvZGVFbGVtZW50cyhwcm9ncmFtRGF0YVN0b3JlLmFjdGl2ZVNlYXNvbi5lcGlzb2RlcywgY29udGVudERpdilcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY2FzZSBJdGVtVHlwZS5Nb3ZpZTpcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvcHVwVGl0bGUuc2V0VGV4dCgnJylcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvcHVwVGl0bGUuc2V0VmlzaWJsZShmYWxzZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpc3RFbGVtZW50RmFjdG9yeS5jcmVhdGVFcGlzb2RlRWxlbWVudHMocHJvZ3JhbURhdGFTdG9yZS5tb3ZpZXMuZmlsdGVyKG1vdmllID0+IG1vdmllLklkID09PSBwcm9ncmFtRGF0YVN0b3JlLmFjdGl2ZU1lZGlhU291cmNlSWQpLCBjb250ZW50RGl2KVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBJdGVtVHlwZS5WaWRlbzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvcHVwVGl0bGUuc2V0VGV4dCgnJylcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvcHVwVGl0bGUuc2V0VmlzaWJsZShmYWxzZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpc3RFbGVtZW50RmFjdG9yeS5jcmVhdGVFcGlzb2RlRWxlbWVudHMocHJvZ3JhbURhdGFTdG9yZS5tb3ZpZXMsIGNvbnRlbnREaXYpXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBjYXNlIEl0ZW1UeXBlLkJveFNldDpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBJdGVtVHlwZS5Gb2xkZXI6XG4gICAgICAgICAgICAgICAgICAgICAgICBwb3B1cFRpdGxlLnNldFRleHQocHJvZ3JhbURhdGFTdG9yZS5ib3hTZXROYW1lKVxuICAgICAgICAgICAgICAgICAgICAgICAgcG9wdXBUaXRsZS5zZXRWaXNpYmxlKHRydWUpXG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0RWxlbWVudEZhY3RvcnkuY3JlYXRlRXBpc29kZUVsZW1lbnRzKHByb2dyYW1EYXRhU3RvcmUubW92aWVzLCBjb250ZW50RGl2KVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBzY3JvbGwgdG8gdGhlIGVwaXNvZGUgdGhhdCBpcyBjdXJyZW50bHkgcGxheWluZ1xuICAgICAgICAgICAgICAgIGNvbnN0IGFjdGl2ZUl0ZW0gPSBjb250ZW50RGl2LnF1ZXJ5U2VsZWN0b3IoJy5zZWxlY3RlZExpc3RJdGVtJylcbiAgICAgICAgICAgICAgICBpZiAoIWFjdGl2ZUl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKFwiQ291bGRuJ3QgZmluZCBhY3RpdmUgbWVkaWEgc291cmNlIGVsZW1lbnQgaW4gcHJldmlldyBsaXN0LiBUaGlzIHNob3VsZCBuZXZlciBoYXBwZW5cIiwgcHJvZ3JhbURhdGFTdG9yZSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYWN0aXZlSXRlbT8ucGFyZW50RWxlbWVudC5zY3JvbGxJbnRvVmlldygpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHBvcHVwVGl0bGUucmVuZGVyKChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgICAgICAgIHJlbmRlclNlYXNvbkxpc3QoKVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgcmVuZGVyRXBpc29kZUxpc3QoKVxuXG4gICAgICAgICAgICBpZiAocGxheWJhY2tTdGF0ZVVuc3Vic2NyaWJlKVxuICAgICAgICAgICAgICAgIHBsYXliYWNrU3RhdGVVbnN1YnNjcmliZSgpXG4gICAgICAgICAgICBwbGF5YmFja1N0YXRlVW5zdWJzY3JpYmUgPSBwcm9ncmFtRGF0YVN0b3JlLnN1YnNjcmliZVBsYXliYWNrU3RhdGVDaGFuZ2VkKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoc2hvd2luZ1NlYXNvbkxpc3QpXG4gICAgICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgICAgIGlmICghZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BvcHVwQ29udGVudENvbnRhaW5lcicpKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgICAgICByZW5kZXJFcGlzb2RlTGlzdCgpXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIHVubG9hZFZpZGVvVmlldygpOiB2b2lkIHtcbiAgICAgICAgLy8gQ2xlYXIgb2xkIGRhdGEgYW5kIHJlc2V0IHByZXZpZXdDb250YWluZXJMb2FkZWQgZmxhZ1xuICAgICAgICBhdXRoU2VydmljZS5zZXRBdXRoSGVhZGVyVmFsdWUoXCJcIilcblxuICAgICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkaWFsb2dCYWNrZHJvcENvbnRhaW5lclwiKSlcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkaWFsb2dCYWNrZHJvcENvbnRhaW5lclwiKSlcbiAgICAgICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGlhbG9nQ29udGFpbmVyXCIpKVxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRpYWxvZ0NvbnRhaW5lclwiKSlcbiAgICAgICAgXG4gICAgICAgIHByZXZpZXdDb250YWluZXJMb2FkZWQgPSBmYWxzZSAvLyBSZXNldCBmbGFnIHdoZW4gdW5sb2FkaW5nXG4gICAgICAgIGlmIChwbGF5YmFja1N0YXRlVW5zdWJzY3JpYmUpIHtcbiAgICAgICAgICAgIHBsYXliYWNrU3RhdGVVbnN1YnNjcmliZSgpXG4gICAgICAgICAgICBwbGF5YmFja1N0YXRlVW5zdWJzY3JpYmUgPSBudWxsXG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gaXNQcmV2aWV3QnV0dG9uQ3JlYXRlZCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idXR0b25zJykucXVlcnlTZWxlY3RvcignI3BvcHVwUHJldmlld0J1dHRvbicpICE9PSBudWxsXG4gICAgfVxufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9