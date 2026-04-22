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
    domSafeItemId;
    constructor(container, positionAfterIndex, item, playbackHandler, programDataStore) {
        super(container, positionAfterIndex);
        this.item = item;
        this.playbackHandler = playbackHandler;
        this.programDataStore = programDataStore;
        this.domSafeItemId = this.toDomSafeId(item.Id);
        this.setElementId(`episode-${this.domSafeItemId}`);
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
                                    <button id="previewEpisodeImageCard-${this.domSafeItemId}"
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
                                            <button id="start-episode-${this.domSafeItemId}"
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
            const episodeImageCard = document.getElementById(`start-episode-${this.domSafeItemId}`);
            episodeImageCard?.addEventListener('click', () => this.playbackHandler.play(this.item.Id, this.item.UserData.PlaybackPositionTicks));
        }
    }
    toDomSafeId(value) {
        return encodeURIComponent(value).replace(/%/g, '_');
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
        const orderedEpisodes = this.resolveDisplayOrder(episodes);
        for (let i = 0; i < orderedEpisodes.length; i++) {
            const episode = orderedEpisodes[i];
            const episodeListElementTemplate = new ListElementTemplate_1.ListElementTemplate(parentDiv, i, episode, this.playbackHandler, this.programDataStore);
            episodeListElementTemplate.render(async (e) => {
                e.stopPropagation();
                // hide episode content for all existing episodes in the preview list
                document.querySelectorAll(".previewListItemContent").forEach((element) => {
                    element.classList.add('hide');
                    element.classList.remove('selectedListItem');
                });
                const episodeContainer = document.querySelector(this.getEpisodeSelectorById(episode.Id))?.querySelector('.previewListItemContent');
                if (!episodeContainer) {
                    return;
                }
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
                const episodeNode = document.querySelector(this.getEpisodeSelectorById(episode.Id))?.querySelector('.previewListItemContent');
                if (!episodeNode) {
                    continue;
                }
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
    resolveDisplayOrder(episodes) {
        const episodesCopy = [...episodes];
        if (!this.programDataStore.isShuffleMode) {
            return this.sortByIndexNumber(episodesCopy);
        }
        const queueOrderedItems = this.programDataStore.queueOrderedItems;
        if (!queueOrderedItems || queueOrderedItems.length === 0) {
            return this.sortByIndexNumber(episodesCopy);
        }
        const requestedEpisodeIds = new Set(episodesCopy.map(episode => episode.Id));
        const queueOrderedSubset = queueOrderedItems.filter(item => requestedEpisodeIds.has(item.Id));
        const queueOrderedIds = new Set(queueOrderedSubset.map(item => item.Id));
        const remainingEpisodes = episodesCopy
            .filter(episode => !queueOrderedIds.has(episode.Id));
        const sortedRemainingEpisodes = this.sortByIndexNumber(remainingEpisodes);
        return [...queueOrderedSubset, ...sortedRemainingEpisodes];
    }
    getEpisodeSelectorById(episodeId) {
        const escapedEpisodeId = typeof CSS !== 'undefined' && typeof CSS.escape === 'function'
            ? CSS.escape(episodeId)
            : episodeId.replace(/["\\]/g, '\\$&');
        return `[data-id="${escapedEpisodeId}"]`;
    }
    sortByIndexNumber(episodes) {
        return episodes.sort((a, b) => (a.IndexNumber ?? Number.MAX_SAFE_INTEGER) - (b.IndexNumber ?? Number.MAX_SAFE_INTEGER));
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
                this.programDataStore.playbackOrder = playingInfo.PlaybackOrder;
                this.programDataStore.nowPlayingQueue = (playingInfo.NowPlayingQueue || []).map(queueItem => queueItem.Id);
                this.fetchMissingQueueItems().then();
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
            else if (urlPathname.includes('User') && urlPathname.includes('Items') && url.searchParams.has('Ids')) {
                this.logger.debug('Received Items by Ids');
                response.clone().json().then((data) => this.programDataStore.mergeQueueItems(data?.Items ?? []));
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
                    this.fetchMissingQueueItems().then();
                }
                break;
            case ItemType_1.ItemType.Movie:
                if (itemDto.Items.length > 1) {
                    this.programDataStore.type = this.programDataStore.activeMediaSourceId !== '' && this.programDataStore.activeMediaSourceId === parentId ? ItemType_1.ItemType.BoxSet : ItemType_1.ItemType.Movie;
                    this.programDataStore.movies = itemDto.Items.map((movie, idx) => ({
                        ...movie,
                        IndexNumber: idx + 1
                    }));
                    this.fetchMissingQueueItems().then();
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
                    this.fetchMissingQueueItems().then();
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
                    this.fetchMissingQueueItems().then();
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
                    this.fetchMissingQueueItems().then();
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
    async fetchMissingQueueItems() {
        const missingQueueItemIds = this.programDataStore.getMissingQueueItemIds();
        if (missingQueueItemIds.length === 0) {
            return;
        }
        try {
            const userId = ApiClient.getCurrentUserId?.();
            if (!userId) {
                return;
            }
            const idsParam = missingQueueItemIds.map(id => encodeURIComponent(id)).join(',');
            const url = ApiClient.getUrl(`/Users/${userId}/Items?Ids=${idsParam}`);
            const itemDto = await ApiClient.ajax({ type: 'GET', url, dataType: 'json' });
            this.programDataStore.mergeQueueItems(itemDto?.Items ?? []);
        }
        catch (ex) {
            this.logger.error(`Couldn't fetch queue items by id`, ex);
        }
    }
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
const PlaybackProgressInfo_1 = __webpack_require__(/*! ../Models/PlaybackProgressInfo */ "./Web/Models/PlaybackProgressInfo.ts");
class ProgramDataStore {
    _programData;
    constructor() {
        this._programData = {
            activeMediaSourceId: '',
            boxSetName: '',
            type: undefined,
            movies: [],
            seasons: [],
            playbackOrder: PlaybackProgressInfo_1.PlaybackOrder.Default,
            nowPlayingQueue: [],
            queueItems: [],
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
    get playbackOrder() {
        return this._programData.playbackOrder;
    }
    set playbackOrder(order) {
        this._programData.playbackOrder = order;
    }
    get nowPlayingQueue() {
        return this._programData.nowPlayingQueue;
    }
    set nowPlayingQueue(queueIds) {
        this._programData.nowPlayingQueue = queueIds;
    }
    get isShuffleMode() {
        return this.playbackOrder === PlaybackProgressInfo_1.PlaybackOrder.Shuffle;
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
                return this.seasons.flatMap(season => season.episodes).length > 0 || this.queueOrderedItems.length > 0;
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
    get queueOrderedItems() {
        if (!this.nowPlayingQueue || this.nowPlayingQueue.length === 0) {
            return [];
        }
        const allItemsById = new Map(this.allLoadedItems.map(item => [item.Id, item]));
        return this.nowPlayingQueue
            .map(queueItemId => allItemsById.get(queueItemId))
            .filter(item => !!item);
    }
    getMissingQueueItemIds() {
        if (!this.nowPlayingQueue || this.nowPlayingQueue.length === 0) {
            return [];
        }
        const allItemsById = new Set(this.allLoadedItems.map(item => item.Id));
        return this.nowPlayingQueue.filter(queueItemId => !allItemsById.has(queueItemId));
    }
    mergeQueueItems(items) {
        if (!items || items.length === 0) {
            return;
        }
        const existingQueueItemsById = new Map(this._programData.queueItems.map(item => [item.Id, item]));
        for (const item of items) {
            existingQueueItemsById.set(item.Id, item);
            const existingItem = this.getItemById(item.Id);
            if (existingItem) {
                this.updateItem({
                    ...existingItem,
                    ...item
                });
            }
        }
        this._programData.queueItems = Array.from(existingQueueItemsById.values());
    }
    getItemById(itemId) {
        switch (this.type) {
            case ItemType_1.ItemType.Series:
                return this.seasons
                    .flatMap(season => season.episodes)
                    .find(episode => episode.Id === itemId)
                    ?? this._programData.queueItems.find(item => item.Id === itemId);
            case ItemType_1.ItemType.BoxSet:
            case ItemType_1.ItemType.Movie:
            case ItemType_1.ItemType.Folder:
            case ItemType_1.ItemType.Video:
                return this.movies.find(movie => movie.Id === itemId)
                    ?? this._programData.queueItems.find(item => item.Id === itemId);
            default:
                return undefined;
        }
    }
    updateItem(itemToUpdate) {
        switch (this.type) {
            case ItemType_1.ItemType.Series:
                {
                    const season = this.seasons.find(season => season.seasonId === itemToUpdate.SeasonId);
                    if (!season) {
                        this._programData.queueItems = [
                            ...this._programData.queueItems.filter(item => item.Id !== itemToUpdate.Id),
                            itemToUpdate
                        ];
                        break;
                    }
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
        const shouldTrackInQueueItems = this._programData.nowPlayingQueue.includes(itemToUpdate.Id)
            || this._programData.queueItems.some(item => item.Id === itemToUpdate.Id);
        if (shouldTrackInQueueItems) {
            this._programData.queueItems = [
                ...this._programData.queueItems.filter(item => item.Id !== itemToUpdate.Id),
                itemToUpdate
            ];
        }
    }
    get allLoadedItems() {
        const baseItems = this.type === ItemType_1.ItemType.Series
            ? this.seasons.flatMap(season => season.episodes)
            : this.movies;
        const allItemsById = new Map(baseItems.map(item => [item.Id, item]));
        this._programData.queueItems.forEach(item => allItemsById.set(item.Id, item));
        return Array.from(allItemsById.values());
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
            contentDiv.innerHTML = ''; // remove old content
            const popupTitle = new PopupTitleTemplate_1.PopupTitleTemplate(document.getElementById('popupFocusContainer'), -1, programDataStore);
            popupTitle.render((e) => {
                e.stopPropagation();
                popupTitle.setVisible(false);
                const contentDiv = document.getElementById('popupContentContainer');
                // delete episode content for all existing episodes in the preview list;
                contentDiv.innerHTML = '';
                listElementFactory.createSeasonElements(programDataStore.seasons, contentDiv, programDataStore.activeSeason?.IndexNumber ?? 0, popupTitle);
            });
            switch (programDataStore.type) {
                case ItemType_1.ItemType.Series:
                    if (programDataStore.isShuffleMode && programDataStore.queueOrderedItems.length > 0) {
                        popupTitle.setText('Now Playing Queue');
                        popupTitle.setVisible(programDataStore.seasons.length > 1);
                        listElementFactory.createEpisodeElements(programDataStore.queueOrderedItems, contentDiv);
                    }
                    else {
                        popupTitle.setText(programDataStore.activeSeason?.seasonName ?? '');
                        popupTitle.setVisible(true);
                        listElementFactory.createEpisodeElements(programDataStore.activeSeason?.episodes ?? [], contentDiv);
                    }
                    break;
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
    }
    function isPreviewButtonCreated() {
        return document.querySelector('.buttons').querySelector('#popupPreviewButton') !== null;
    }
}

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QixDQUFDLENBQUM7UUFDakYsSUFBSSxRQUFRLENBQUMsY0FBYyxDQUFDLGlCQUFpQixDQUFDO1lBQzFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUV6RSxzQkFBc0IsR0FBRyxLQUFLLEVBQUMsNEJBQTRCO0lBQy9ELENBQUM7SUFFRCxTQUFTLHNCQUFzQjtRQUMzQixPQUFPLFFBQVEsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUMsYUFBYSxDQUFDLHFCQUFxQixDQUFDLEtBQUssSUFBSTtJQUMzRixDQUFDO0FBQ0wsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL1dlYi9Db21wb25lbnRzL0Jhc2VUZW1wbGF0ZS50cyIsIndlYnBhY2s6Ly8vLi9XZWIvQ29tcG9uZW50cy9EaWFsb2dDb250YWluZXJUZW1wbGF0ZS50cyIsIndlYnBhY2s6Ly8vLi9XZWIvQ29tcG9uZW50cy9FcGlzb2RlRGV0YWlscy50cyIsIndlYnBhY2s6Ly8vLi9XZWIvQ29tcG9uZW50cy9MaXN0RWxlbWVudFRlbXBsYXRlLnRzIiwid2VicGFjazovLy8uL1dlYi9Db21wb25lbnRzL1BvcHVwVGl0bGVUZW1wbGF0ZS50cyIsIndlYnBhY2s6Ly8vLi9XZWIvQ29tcG9uZW50cy9QcmV2aWV3QnV0dG9uVGVtcGxhdGUudHMiLCJ3ZWJwYWNrOi8vLy4vV2ViL0NvbXBvbmVudHMvUXVpY2tBY3Rpb25zL0Zhdm9yaXRlSWNvblRlbXBsYXRlLnRzIiwid2VicGFjazovLy8uL1dlYi9Db21wb25lbnRzL1F1aWNrQWN0aW9ucy9QbGF5U3RhdGVJY29uVGVtcGxhdGUudHMiLCJ3ZWJwYWNrOi8vLy4vV2ViL0NvbXBvbmVudHMvU2Vhc29uTGlzdEVsZW1lbnRUZW1wbGF0ZS50cyIsIndlYnBhY2s6Ly8vLi9XZWIvRW5kcG9pbnRzLnRzIiwid2VicGFjazovLy8uL1dlYi9MaXN0RWxlbWVudEZhY3RvcnkudHMiLCJ3ZWJwYWNrOi8vLy4vV2ViL01vZGVscy9JdGVtVHlwZS50cyIsIndlYnBhY2s6Ly8vLi9XZWIvTW9kZWxzL1BsYXliYWNrUHJvZ3Jlc3NJbmZvLnRzIiwid2VicGFjazovLy8uL1dlYi9Nb2RlbHMvUGx1Z2luU2V0dGluZ3MudHMiLCJ3ZWJwYWNrOi8vLy4vV2ViL01vZGVscy9TZXJ2ZXJTZXR0aW5ncy50cyIsIndlYnBhY2s6Ly8vLi9XZWIvU2VydmljZXMvQXV0aFNlcnZpY2UudHMiLCJ3ZWJwYWNrOi8vLy4vV2ViL1NlcnZpY2VzL0RhdGFGZXRjaGVyLnRzIiwid2VicGFjazovLy8uL1dlYi9TZXJ2aWNlcy9Mb2dnZXIudHMiLCJ3ZWJwYWNrOi8vLy4vV2ViL1NlcnZpY2VzL1BsYXliYWNrSGFuZGxlci50cyIsIndlYnBhY2s6Ly8vLi9XZWIvU2VydmljZXMvUHJvZ3JhbURhdGFTdG9yZS50cyIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vV2ViL0luUGxheWVyUHJldmlldy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgYWJzdHJhY3QgY2xhc3MgQmFzZVRlbXBsYXRlIHtcbiAgICAvKlxuICAgICAqIHRoZSBIVE1MIGJhc2VkIElEIG9mIHRoZSBuZXcgZ2VuZXJhdGVkIEVsZW1lbnRcbiAgICAgKi9cbiAgICBwcml2YXRlIGVsZW1lbnRJZDogc3RyaW5nO1xuXG4gICAgcHJvdGVjdGVkIGNvbnN0cnVjdG9yKHByaXZhdGUgY29udGFpbmVyOiBIVE1MRWxlbWVudCwgcHJpdmF0ZSBwb3NpdGlvbkFmdGVySW5kZXg6IG51bWJlcikgeyB9XG5cbiAgICBwdWJsaWMgZ2V0Q29udGFpbmVyKCk6IEhUTUxFbGVtZW50IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udGFpbmVyO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRQb3NpdGlvbkFmdGVySW5kZXgoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucG9zaXRpb25BZnRlckluZGV4O1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBzZXRFbGVtZW50SWQoZWxlbWVudElkOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5lbGVtZW50SWQgPSBlbGVtZW50SWQ7XG4gICAgfVxuXG4gICAgcHVibGljIGdldEVsZW1lbnRJZCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50SWQ7XG4gICAgfVxuICAgIFxuICAgIHB1YmxpYyBnZXRFbGVtZW50KCk6IEhUTUxFbGVtZW50IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Q29udGFpbmVyKCkucXVlcnlTZWxlY3RvcihgIyR7dGhpcy5nZXRFbGVtZW50SWQoKX1gKTtcbiAgICB9XG5cbiAgICBhYnN0cmFjdCBnZXRUZW1wbGF0ZSguLi5jbGlja0hhbmRsZXJzOiBGdW5jdGlvbltdKTogc3RyaW5nO1xuXG4gICAgYWJzdHJhY3QgcmVuZGVyKC4uLmNsaWNrSGFuZGxlcnM6IEZ1bmN0aW9uW10pOiB2b2lkO1xuXG4gICAgcHJvdGVjdGVkIGFkZEVsZW1lbnRUb0NvbnRhaW5lciguLi5jbGlja0hhbmRsZXJzOiBGdW5jdGlvbltdKTogSFRNTEVsZW1lbnQge1xuICAgICAgICAvLyBBZGQgRWxlbWVudCBhcyB0aGUgZmlyc3QgY2hpbGQgaWYgcG9zaXRpb24gaXMgbmVnYXRpdmVcbiAgICAgICAgaWYgKHRoaXMuZ2V0UG9zaXRpb25BZnRlckluZGV4KCkgPCAwICYmIHRoaXMuZ2V0Q29udGFpbmVyKCkuaGFzQ2hpbGROb2RlcygpKSB7XG4gICAgICAgICAgICB0aGlzLmdldENvbnRhaW5lcigpLmZpcnN0RWxlbWVudENoaWxkLmJlZm9yZSh0aGlzLnN0cmluZ1RvTm9kZSh0aGlzLmdldFRlbXBsYXRlKC4uLmNsaWNrSGFuZGxlcnMpKSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRFbGVtZW50KCk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIEFkZCBFbGVtZW50IGlmIGNvbnRhaW5lciBpcyBlbXB0eVxuICAgICAgICBpZiAoIXRoaXMuZ2V0Q29udGFpbmVyKCkuaGFzQ2hpbGROb2RlcygpKSB7XG4gICAgICAgICAgICB0aGlzLmdldENvbnRhaW5lcigpLmlubmVySFRNTCA9IHRoaXMuZ2V0VGVtcGxhdGUoLi4uY2xpY2tIYW5kbGVycyk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRFbGVtZW50KCk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY2hpbGRCZWZvcmUgPSB0aGlzLmdldENvbnRhaW5lcigpLmxhc3RFbGVtZW50Q2hpbGRcbiAgICAgICAgaWYgKHRoaXMuZ2V0Q29udGFpbmVyKCkuY2hpbGRyZW4ubGVuZ3RoID4gdGhpcy5nZXRQb3NpdGlvbkFmdGVySW5kZXgoKSAmJiB0aGlzLmdldFBvc2l0aW9uQWZ0ZXJJbmRleCgpID49IDApXG4gICAgICAgICAgICBjaGlsZEJlZm9yZSA9IHRoaXMuZ2V0Q29udGFpbmVyKCkuY2hpbGRyZW5bdGhpcy5nZXRQb3NpdGlvbkFmdGVySW5kZXgoKV07XG4gICAgICAgIFxuICAgICAgICBjaGlsZEJlZm9yZS5hZnRlcih0aGlzLnN0cmluZ1RvTm9kZSh0aGlzLmdldFRlbXBsYXRlKC4uLmNsaWNrSGFuZGxlcnMpKSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RWxlbWVudCgpO1xuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIHN0cmluZ1RvTm9kZSh0ZW1wbGF0ZVN0cmluZzogc3RyaW5nKTogTm9kZSB7XG4gICAgICAgIGxldCBwbGFjZWhvbGRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBwbGFjZWhvbGRlci5pbm5lckhUTUwgPSB0ZW1wbGF0ZVN0cmluZztcbiAgICAgICAgcmV0dXJuIHBsYWNlaG9sZGVyLmZpcnN0RWxlbWVudENoaWxkO1xuICAgIH1cbn0iLCJpbXBvcnQge0Jhc2VUZW1wbGF0ZX0gZnJvbSBcIi4vQmFzZVRlbXBsYXRlXCI7XG5cbmV4cG9ydCBjbGFzcyBEaWFsb2dDb250YWluZXJUZW1wbGF0ZSBleHRlbmRzIEJhc2VUZW1wbGF0ZSB7XG4gICAgZGlhbG9nQmFja2Ryb3BJZCA9ICdkaWFsb2dCYWNrZHJvcCdcbiAgICBkaWFsb2dDb250YWluZXJJZCA9ICdkaWFsb2dDb250YWluZXInXG4gICAgcG9wdXBDb250ZW50Q29udGFpbmVySWQgPSAncG9wdXBDb250ZW50Q29udGFpbmVyJ1xuICAgIHBvcHVwRm9jdXNDb250YWluZXJJZCA9ICdwb3B1cEZvY3VzQ29udGFpbmVyJ1xuICAgIFxuICAgIGNvbnN0cnVjdG9yKGNvbnRhaW5lcjogSFRNTEVsZW1lbnQsIHBvc2l0aW9uQWZ0ZXJJbmRleDogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKGNvbnRhaW5lciwgcG9zaXRpb25BZnRlckluZGV4KTtcbiAgICAgICAgdGhpcy5zZXRFbGVtZW50SWQoJ3ByZXZpZXdQb3B1cCcpO1xuICAgIH1cblxuICAgIGdldFRlbXBsYXRlKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBgXG4gICAgICAgICAgICA8ZGl2IGlkPVwiJHt0aGlzLmdldEVsZW1lbnRJZCgpfVwiPlxuICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCIke3RoaXMuZGlhbG9nQmFja2Ryb3BJZH1cIiBjbGFzcz1cImRpYWxvZ0JhY2tkcm9wIGRpYWxvZ0JhY2tkcm9wT3BlbmVkXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBpZD1cIiR7dGhpcy5kaWFsb2dDb250YWluZXJJZH1cIiBjbGFzcz1cImRpYWxvZ0NvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPVwiJHt0aGlzLnBvcHVwRm9jdXNDb250YWluZXJJZH1cIiBcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVwiZm9jdXNjb250YWluZXIgZGlhbG9nIGFjdGlvbnNoZWV0LW5vdC1mdWxsc2NyZWVuIGFjdGlvblNoZWV0IGNlbnRlcmVkRGlhbG9nIG9wZW5lZCBwcmV2aWV3UG9wdXAgYWN0aW9uU2hlZXRDb250ZW50XCIgXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLWhpc3Rvcnk9XCJ0cnVlXCIgXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLXJlbW92ZW9uY2xvc2U9XCJ0cnVlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPVwiJHt0aGlzLnBvcHVwQ29udGVudENvbnRhaW5lcklkfVwiIGNsYXNzPVwiYWN0aW9uU2hlZXRTY3JvbGxlciBzY3JvbGxZIHByZXZpZXdQb3B1cFNjcm9sbGVyXCIvPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICBgO1xuICAgIH1cblxuICAgIHB1YmxpYyByZW5kZXIoKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHJlbmRlcmVkRWxlbWVudDogSFRNTEVsZW1lbnQgPSB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcigpO1xuICAgICAgICByZW5kZXJlZEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZTogTW91c2VFdmVudCk6IGFueSA9PiB7XG4gICAgICAgICAgICB0aGlzLmdldENvbnRhaW5lcigpLnJlbW92ZUNoaWxkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuZ2V0RWxlbWVudElkKCkpKVxuICAgICAgICB9KTtcbiAgICB9XG59IiwiaW1wb3J0IHtCYXNlVGVtcGxhdGV9IGZyb20gXCIuL0Jhc2VUZW1wbGF0ZVwiO1xuaW1wb3J0IHtCYXNlSXRlbX0gZnJvbSBcIi4uL01vZGVscy9FcGlzb2RlXCI7XG5cbmV4cG9ydCBjbGFzcyBFcGlzb2RlRGV0YWlsc1RlbXBsYXRlIGV4dGVuZHMgQmFzZVRlbXBsYXRlIHtcbiAgICBjb25zdHJ1Y3Rvcihjb250YWluZXI6IEhUTUxFbGVtZW50LCBwb3NpdGlvbkFmdGVySW5kZXg6IG51bWJlciwgcHJpdmF0ZSBlcGlzb2RlOiBCYXNlSXRlbSkge1xuICAgICAgICBzdXBlcihjb250YWluZXIsIHBvc2l0aW9uQWZ0ZXJJbmRleCk7XG4gICAgICAgIHRoaXMuc2V0RWxlbWVudElkKGBlcGlzb2RlLSR7ZXBpc29kZS5JZH1gKTtcbiAgICB9XG5cbiAgICBnZXRUZW1wbGF0ZSgpOiBzdHJpbmcge1xuICAgICAgICAvLyBsYW5ndWFnZT1IVE1MXG4gICAgICAgIHJldHVybiBgXG4gICAgICAgICAgICA8ZGl2IGlkPVwiJHt0aGlzLmdldEVsZW1lbnRJZCgpfS1kZXRhaWxzXCIgY2xhc3M9XCJpdGVtTWlzY0luZm8gaXRlbU1pc2NJbmZvLXByaW1hcnkgcHJldmlld0VwaXNvZGVEZXRhaWxzXCI+XG4gICAgICAgICAgICAgICAgJHt0aGlzLmVwaXNvZGUuUHJlbWllcmVEYXRlID8gYDxkaXYgY2xhc3M9XCJtZWRpYUluZm9JdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgICR7KG5ldyBEYXRlKHRoaXMuZXBpc29kZS5QcmVtaWVyZURhdGUpKS50b0xvY2FsZURhdGVTdHJpbmcodGhpcy5nZXRMb2NhbGUoKSl9XG4gICAgICAgICAgICAgICAgPC9kaXY+YCA6ICcnfVxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtZWRpYUluZm9JdGVtXCI+JHt0aGlzLmZvcm1hdFJ1blRpbWUodGhpcy5lcGlzb2RlLlJ1blRpbWVUaWNrcyl9PC9kaXY+XG4gICAgICAgICAgICAgICAgJHt0aGlzLmVwaXNvZGUuQ29tbXVuaXR5UmF0aW5nID8gYDxkaXYgY2xhc3M9XCJzdGFyUmF0aW5nQ29udGFpbmVyIG1lZGlhSW5mb0l0ZW1cIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJtYXRlcmlhbC1pY29ucyBzdGFySWNvbiBzdGFyXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAke3RoaXMuZXBpc29kZS5Db21tdW5pdHlSYXRpbmcudG9GaXhlZCgxKX1cbiAgICAgICAgICAgICAgICA8L2Rpdj5gIDogJyd9XG4gICAgICAgICAgICAgICAgJHt0aGlzLmVwaXNvZGUuQ3JpdGljUmF0aW5nID8gYDxkaXYgY2xhc3M9XCJtZWRpYUluZm9JdGVtIG1lZGlhSW5mb0NyaXRpY1JhdGluZyAke3RoaXMuZXBpc29kZS5Dcml0aWNSYXRpbmcgPj0gNjAgPyAnbWVkaWFJbmZvQ3JpdGljUmF0aW5nRnJlc2gnIDogJ21lZGlhSW5mb0NyaXRpY1JhdGluZ1JvdHRlbid9XCI+XG4gICAgICAgICAgICAgICAgICAgICR7dGhpcy5lcGlzb2RlLkNyaXRpY1JhdGluZ31cbiAgICAgICAgICAgICAgICA8L2Rpdj5gIDogJyd9XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImVuZHNBdCBtZWRpYUluZm9JdGVtXCI+JHt0aGlzLmZvcm1hdEVuZFRpbWUodGhpcy5lcGlzb2RlLlJ1blRpbWVUaWNrcywgdGhpcy5lcGlzb2RlLlVzZXJEYXRhLlBsYXliYWNrUG9zaXRpb25UaWNrcyl9PC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgYDtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVuZGVyKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcigpO1xuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIGdldExvY2FsZSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gbmF2aWdhdG9yLmxhbmd1YWdlc1xuICAgICAgICAgICAgPyBuYXZpZ2F0b3IubGFuZ3VhZ2VzWzBdIC8vIEB0cy1pZ25vcmUgZm9yIHVzZXJMYW5ndWFnZSAodGhpcyBhZGRzIHN1cHBvcnQgZm9yIElFKSBUT0RPOiBNb3ZlIHRvIGludGVyZmFjZVxuICAgICAgICAgICAgOiAobmF2aWdhdG9yLmxhbmd1YWdlIHx8IG5hdmlnYXRvci51c2VyTGFuZ3VhZ2UpO1xuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIGZvcm1hdFJ1blRpbWUodGlja3M6IG51bWJlcik6IHN0cmluZyB7XG4gICAgICAgIC8vIGZvcm1hdCB0aGUgdGlja3MgdG8gYSBzdHJpbmcgd2l0aCBtaW51dGVzIGFuZCBob3Vyc1xuICAgICAgICB0aWNrcyAvPSAxMDAwMDsgLy8gY29udmVydCBmcm9tIG1pY3Jvc2Vjb25kcyB0byBtaWxsaXNlY29uZHNcbiAgICAgICAgbGV0IGhvdXJzOiBudW1iZXIgPSBNYXRoLmZsb29yKCh0aWNrcyAvIDEwMDAgLyAzNjAwKSAlIDI0KTtcbiAgICAgICAgbGV0IG1pbnV0ZXM6IG51bWJlciA9IE1hdGguZmxvb3IoKHRpY2tzIC8gMTAwMCAvIDYwKSAlIDYwKTtcbiAgICAgICAgbGV0IGhvdXJzU3RyaW5nOiBzdHJpbmcgPSBob3VycyA+IDAgPyBgJHtob3Vyc31oIGAgOiAnJztcbiAgICAgICAgcmV0dXJuIGAke2hvdXJzU3RyaW5nfSR7bWludXRlc31tYDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGZvcm1hdEVuZFRpbWUocnVudGltZVRpY2tzOiBudW1iZXIsIHBsYXliYWNrUG9zaXRpb25UaWNrczogbnVtYmVyKTogc3RyaW5nIHtcbiAgICAgICAgLy8gY29udmVydCBmcm9tIG1pY3Jvc2Vjb25kcyB0byBtaWxsaXNlY29uZHNcbiAgICAgICAgcnVudGltZVRpY2tzIC89IDEwMDAwO1xuICAgICAgICBwbGF5YmFja1Bvc2l0aW9uVGlja3MgLz0gMTAwMDA7XG4gICAgICAgIFxuICAgICAgICBsZXQgdGlja3M6IG51bWJlciA9IERhdGUubm93KCkgKyAocnVudGltZVRpY2tzKTtcbiAgICAgICAgdGlja3MgLT0gKG5ldyBEYXRlKCkpLmdldFRpbWV6b25lT2Zmc2V0KCkgKiA2MCAqIDEwMDA7IC8vIGFkanVzdCBmb3IgdGltZXpvbmVcbiAgICAgICAgdGlja3MgLT0gcGxheWJhY2tQb3NpdGlvblRpY2tzOyAvLyBzdWJ0cmFjdCB0aGUgcGxheWJhY2sgcG9zaXRpb25cbiAgICAgICAgXG4gICAgICAgIGxldCBob3Vyczogc3RyaW5nID0gdGhpcy56ZXJvUGFkKE1hdGguZmxvb3IoKHRpY2tzIC8gMTAwMCAvIDM2MDApICUgMjQpKTtcbiAgICAgICAgbGV0IG1pbnV0ZXM6IHN0cmluZyA9IHRoaXMuemVyb1BhZChNYXRoLmZsb29yKCh0aWNrcyAvIDEwMDAgLyA2MCkgJSA2MCkpO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGBFbmRzIGF0ICR7aG91cnN9OiR7bWludXRlc31gO1xuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIHplcm9QYWQobnVtOiBudW1iZXIsIHBsYWNlczogbnVtYmVyID0gMik6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBTdHJpbmcobnVtKS5wYWRTdGFydChwbGFjZXMsICcwJyk7XG4gICAgfVxufSIsImltcG9ydCB7QmFzZVRlbXBsYXRlfSBmcm9tIFwiLi9CYXNlVGVtcGxhdGVcIlxuaW1wb3J0IHtGYXZvcml0ZUljb25UZW1wbGF0ZX0gZnJvbSBcIi4vUXVpY2tBY3Rpb25zL0Zhdm9yaXRlSWNvblRlbXBsYXRlXCJcbmltcG9ydCB7UGxheVN0YXRlSWNvblRlbXBsYXRlfSBmcm9tIFwiLi9RdWlja0FjdGlvbnMvUGxheVN0YXRlSWNvblRlbXBsYXRlXCJcbmltcG9ydCB7UGxheWJhY2tIYW5kbGVyfSBmcm9tIFwiLi4vU2VydmljZXMvUGxheWJhY2tIYW5kbGVyXCJcbmltcG9ydCB7RXBpc29kZURldGFpbHNUZW1wbGF0ZX0gZnJvbSBcIi4vRXBpc29kZURldGFpbHNcIlxuaW1wb3J0IHtQcm9ncmFtRGF0YVN0b3JlfSBmcm9tIFwiLi4vU2VydmljZXMvUHJvZ3JhbURhdGFTdG9yZVwiXG5pbXBvcnQge0Jhc2VJdGVtfSBmcm9tIFwiLi4vTW9kZWxzL0VwaXNvZGVcIlxuaW1wb3J0IHtJdGVtVHlwZX0gZnJvbSBcIi4uL01vZGVscy9JdGVtVHlwZVwiXG5cbmV4cG9ydCBjbGFzcyBMaXN0RWxlbWVudFRlbXBsYXRlIGV4dGVuZHMgQmFzZVRlbXBsYXRlIHtcbiAgICBwcml2YXRlIHJlYWRvbmx5IHF1aWNrQWN0aW9uQ29udGFpbmVyOiBIVE1MRWxlbWVudFxuICAgIHByaXZhdGUgcGxheVN0YXRlSWNvbjogUGxheVN0YXRlSWNvblRlbXBsYXRlXG4gICAgcHJpdmF0ZSBmYXZvcml0ZUljb246IEZhdm9yaXRlSWNvblRlbXBsYXRlXG4gICAgcHJpdmF0ZSByZWFkb25seSBkb21TYWZlSXRlbUlkOiBzdHJpbmdcblxuICAgIGNvbnN0cnVjdG9yKGNvbnRhaW5lcjogSFRNTEVsZW1lbnQsIHBvc2l0aW9uQWZ0ZXJJbmRleDogbnVtYmVyLCBwcml2YXRlIGl0ZW06IEJhc2VJdGVtLCBwcml2YXRlIHBsYXliYWNrSGFuZGxlcjogUGxheWJhY2tIYW5kbGVyLCBwcml2YXRlIHByb2dyYW1EYXRhU3RvcmU6IFByb2dyYW1EYXRhU3RvcmUpIHtcbiAgICAgICAgc3VwZXIoY29udGFpbmVyLCBwb3NpdGlvbkFmdGVySW5kZXgpXG4gICAgICAgIHRoaXMuZG9tU2FmZUl0ZW1JZCA9IHRoaXMudG9Eb21TYWZlSWQoaXRlbS5JZClcbiAgICAgICAgdGhpcy5zZXRFbGVtZW50SWQoYGVwaXNvZGUtJHt0aGlzLmRvbVNhZmVJdGVtSWR9YClcblxuICAgICAgICAvLyBjcmVhdGUgdGVtcCBxdWljayBhY3Rpb24gY29udGFpbmVyXG4gICAgICAgIHRoaXMucXVpY2tBY3Rpb25Db250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuXG4gICAgICAgIC8vIGNyZWF0ZSBxdWljayBhY3Rpb25zXG4gICAgICAgIHRoaXMucGxheVN0YXRlSWNvbiA9IG5ldyBQbGF5U3RhdGVJY29uVGVtcGxhdGUodGhpcy5xdWlja0FjdGlvbkNvbnRhaW5lciwgLTEsIHRoaXMuaXRlbSlcbiAgICAgICAgdGhpcy5mYXZvcml0ZUljb24gPSBuZXcgRmF2b3JpdGVJY29uVGVtcGxhdGUodGhpcy5xdWlja0FjdGlvbkNvbnRhaW5lciwgMCwgdGhpcy5pdGVtKVxuICAgIH1cblxuICAgIGdldFRlbXBsYXRlKCk6IHN0cmluZyB7XG4gICAgICAgIC8vIGFkZCBxdWljayBhY3Rpb25zXG4gICAgICAgIHRoaXMucGxheVN0YXRlSWNvbi5yZW5kZXIoKVxuICAgICAgICB0aGlzLmZhdm9yaXRlSWNvbi5yZW5kZXIoKVxuXG4gICAgICAgIC8vIGFkZCBlcGlzb2RlIGRldGFpbHMvaW5mb1xuICAgICAgICBjb25zdCBkZXRhaWxzQ29udGFpbmVyOiBIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgICAgIGNvbnN0IGRldGFpbHM6IEVwaXNvZGVEZXRhaWxzVGVtcGxhdGUgPSBuZXcgRXBpc29kZURldGFpbHNUZW1wbGF0ZShkZXRhaWxzQ29udGFpbmVyLCAtMSwgdGhpcy5pdGVtKVxuICAgICAgICBkZXRhaWxzLnJlbmRlcigpXG5cbiAgICAgICAgY29uc3QgYmFja2dyb3VuZEltYWdlU3R5bGU6IHN0cmluZyA9IGBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoJy4uL0l0ZW1zLyR7dGhpcy5pdGVtLklkfS9JbWFnZXMvUHJpbWFyeT90YWc9JHt0aGlzLml0ZW0uSW1hZ2VUYWdzLlByaW1hcnl9JylgXG5cbiAgICAgICAgLy8gbGFuZ3VhZ2U9SFRNTFxuICAgICAgICByZXR1cm4gYFxuICAgICAgICAgICAgPGRpdiBpZD1cIiR7dGhpcy5nZXRFbGVtZW50SWQoKX1cIlxuICAgICAgICAgICAgICAgICBjbGFzcz1cImxpc3RJdGVtIGxpc3RJdGVtLWJ1dHRvbiBhY3Rpb25TaGVldE1lbnVJdGVtIGVtYnktYnV0dG9uIHByZXZpZXdMaXN0SXRlbVwiXG4gICAgICAgICAgICAgICAgIGlzPVwiZW1ieS1idXR0b25cIlxuICAgICAgICAgICAgICAgICBkYXRhLWlkPVwiJHt0aGlzLml0ZW0uSWR9XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInByZXZpZXdFcGlzb2RlQ29udGFpbmVyIGZsZXhcIj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImxpc3RJdGVtIHByZXZpZXdFcGlzb2RlVGl0bGVcIiB0eXBlPVwiYnV0dG9uXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAkeyhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pdGVtLkluZGV4TnVtYmVyICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvZ3JhbURhdGFTdG9yZS50eXBlICE9PSBJdGVtVHlwZS5Nb3ZpZVxuICAgICAgICAgICAgICAgICAgICAgICAgKSA/IGA8c3Bhbj4ke3RoaXMuaXRlbS5JbmRleE51bWJlcn08L3NwYW4+YCA6ICcnfVxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImxpc3RJdGVtQm9keSBhY3Rpb25zaGVldExpc3RJdGVtQm9keVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiYWN0aW9uU2hlZXRJdGVtVGV4dFwiPiR7dGhpcy5pdGVtLk5hbWV9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicHJldmlld1F1aWNrQWN0aW9uQ29udGFpbmVyIGZsZXhcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICR7dGhpcy5xdWlja0FjdGlvbkNvbnRhaW5lci5pbm5lckhUTUx9XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInByZXZpZXdMaXN0SXRlbUNvbnRlbnQgaGlkZVwiPlxuICAgICAgICAgICAgICAgICAgICAke2RldGFpbHNDb250YWluZXIuaW5uZXJIVE1MfVxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmxleFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNhcmQgb3ZlcmZsb3dCYWNrZHJvcENhcmQgY2FyZC1ob3ZlcmFibGUgY2FyZC13aXRodXNlcmRhdGEgcHJldmlld0VwaXNvZGVJbWFnZUNhcmRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2FyZEJveFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2FyZFNjYWxhYmxlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2FyZFBhZGRlciBjYXJkUGFkZGVyLW92ZXJmbG93QmFja2Ryb3AgbGF6eS1oaWRkZW4tY2hpbGRyZW5cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImNhcmRJbWFnZUljb24gbWF0ZXJpYWwtaWNvbnMgdHZcIiBhcmlhLWhpZGRlbj1cInRydWVcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJwcmV2aWV3RXBpc29kZUltYWdlQ2FyZC0ke3RoaXMuZG9tU2FmZUl0ZW1JZH1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cImNhcmRJbWFnZUNvbnRhaW5lciBjYXJkQ29udGVudCBpdGVtQWN0aW9uIGxhenkgYmx1cmhhc2hlZCBsYXp5LWltYWdlLWZhZGVpbi1mYXN0ICR7dGhpcy5wcm9ncmFtRGF0YVN0b3JlLnBsdWdpblNldHRpbmdzLkJsdXJUaHVtYm5haWwgPyAnYmx1cicgOiAnJ31cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLWFjdGlvbj1cImxpbmtcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT1cIiR7YmFja2dyb3VuZEltYWdlU3R5bGV9XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7dGhpcy5pdGVtLlVzZXJEYXRhLlBsYXllZFBlcmNlbnRhZ2UgPyBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgPGRpdiBjbGFzcz1cImlubmVyQ2FyZEZvb3RlciBmdWxsSW5uZXJDYXJkRm9vdGVyIGlubmVyQ2FyZEZvb3RlckNsZWFyIGl0ZW1Qcm9ncmVzc0JhclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaXRlbVByb2dyZXNzQmFyRm9yZWdyb3VuZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT1cIndpZHRoOiR7dGhpcy5pdGVtLlVzZXJEYXRhLlBsYXllZFBlcmNlbnRhZ2V9JTtcIj4gICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5gIDogJydcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7dGhpcy5pdGVtLklkICE9PSB0aGlzLnByb2dyYW1EYXRhU3RvcmUuYWN0aXZlTWVkaWFTb3VyY2VJZCA/IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGA8ZGl2IGNsYXNzPVwiY2FyZE92ZXJsYXlDb250YWluZXIgaXRlbUFjdGlvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLWFjdGlvbj1cImxpbmtcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInN0YXJ0LWVwaXNvZGUtJHt0aGlzLmRvbVNhZmVJdGVtSWR9XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpcz1cInBhcGVyLWljb24tYnV0dG9uLWxpZ2h0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cImNhcmRPdmVybGF5QnV0dG9uIGNhcmRPdmVybGF5QnV0dG9uLWhvdmVyIGl0ZW1BY3Rpb24gcGFwZXItaWNvbi1idXR0b24tbGlnaHQgY2FyZE92ZXJsYXlGYWItcHJpbWFyeVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS1hY3Rpb249XCJyZXN1bWVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnMgY2FyZE92ZXJsYXlCdXR0b25JY29uIGNhcmRPdmVybGF5QnV0dG9uSWNvbi1ob3ZlciBwbGF5X2Fycm93XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PmAgOiAnJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwcmV2aWV3RXBpc29kZURlc2NyaXB0aW9uICR7dGhpcy5wcm9ncmFtRGF0YVN0b3JlLnBsdWdpblNldHRpbmdzLkJsdXJEZXNjcmlwdGlvbiA/ICdibHVyJyA6ICcnfVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7dGhpcy5pdGVtLkRlc2NyaXB0aW9uID8/ICdsb2FkaW5nLi4uJ31cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgYFxuICAgIH1cblxuICAgIHB1YmxpYyByZW5kZXIoY2xpY2tIYW5kbGVyOiBGdW5jdGlvbik6IHZvaWQge1xuICAgICAgICBjb25zdCByZW5kZXJlZEVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIoKVxuICAgICAgICByZW5kZXJlZEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4gY2xpY2tIYW5kbGVyKGUpKVxuXG4gICAgICAgIGlmICh0aGlzLml0ZW0uSWQgIT09IHRoaXMucHJvZ3JhbURhdGFTdG9yZS5hY3RpdmVNZWRpYVNvdXJjZUlkKSB7XG4gICAgICAgICAgICAvLyBhZGQgZXZlbnQgaGFuZGxlciB0byBzdGFydCB0aGUgcGxheWJhY2sgb2YgdGhpcyBlcGlzb2RlXG4gICAgICAgICAgICBjb25zdCBlcGlzb2RlSW1hZ2VDYXJkOiBIVE1MRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGBzdGFydC1lcGlzb2RlLSR7dGhpcy5kb21TYWZlSXRlbUlkfWApXG4gICAgICAgICAgICBlcGlzb2RlSW1hZ2VDYXJkPy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHRoaXMucGxheWJhY2tIYW5kbGVyLnBsYXkodGhpcy5pdGVtLklkLCB0aGlzLml0ZW0uVXNlckRhdGEuUGxheWJhY2tQb3NpdGlvblRpY2tzKSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgdG9Eb21TYWZlSWQodmFsdWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpLnJlcGxhY2UoLyUvZywgJ18nKVxuICAgIH1cbn1cbiIsImltcG9ydCB7QmFzZVRlbXBsYXRlfSBmcm9tIFwiLi9CYXNlVGVtcGxhdGVcIjtcbmltcG9ydCB7UHJvZ3JhbURhdGFTdG9yZX0gZnJvbSBcIi4uL1NlcnZpY2VzL1Byb2dyYW1EYXRhU3RvcmVcIjtcbmltcG9ydCB7SXRlbVR5cGV9IGZyb20gXCIuLi9Nb2RlbHMvSXRlbVR5cGVcIjtcblxuZXhwb3J0IGNsYXNzIFBvcHVwVGl0bGVUZW1wbGF0ZSBleHRlbmRzIEJhc2VUZW1wbGF0ZSB7XG4gICAgY29uc3RydWN0b3IoY29udGFpbmVyOiBIVE1MRWxlbWVudCwgcG9zaXRpb25BZnRlckluZGV4OiBudW1iZXIsIHByaXZhdGUgcHJvZ3JhbURhdGFTdG9yZTogUHJvZ3JhbURhdGFTdG9yZSkge1xuICAgICAgICBzdXBlcihjb250YWluZXIsIHBvc2l0aW9uQWZ0ZXJJbmRleClcbiAgICAgICAgdGhpcy5zZXRFbGVtZW50SWQoJ3BvcHVwVGl0bGVDb250YWluZXInKVxuICAgIH1cblxuICAgIGdldFRlbXBsYXRlKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBgXG4gICAgICAgICAgICA8ZGl2IGlkPVwiJHt0aGlzLmdldEVsZW1lbnRJZCgpfVwiIGNsYXNzPVwiYWN0aW9uU2hlZXRUaXRsZSBsaXN0SXRlbSBwcmV2aWV3UG9wdXBUaXRsZVwiPlxuICAgICAgICAgICAgICAgICR7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvZ3JhbURhdGFTdG9yZS50eXBlID09PSBJdGVtVHlwZS5TZXJpZXMgJiYgdGhpcy5wcm9ncmFtRGF0YVN0b3JlLnNlYXNvbnMubGVuZ3RoID4gMSA/IFxuICAgICAgICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJhY3Rpb25zaGVldE1lbnVJdGVtSWNvbiBsaXN0SXRlbUljb24gbGlzdEl0ZW1JY29uLXRyYW5zcGFyZW50IG1hdGVyaWFsLWljb25zIGtleWJvYXJkX2JhY2tzcGFjZVwiPjwvc3Bhbj4nIDogXG4gICAgICAgICAgICAgICAgICAgICcnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIDxoMSBjbGFzcz1cImFjdGlvblNoZWV0VGl0bGVcIj48L2gxPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIGBcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVuZGVyKGNsaWNrSGFuZGxlcjogRnVuY3Rpb24pIHtcbiAgICAgICAgY29uc3QgcmVuZGVyZWRFbGVtZW50ID0gdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIoKTtcbiAgICAgICAgXG4gICAgICAgIHN3aXRjaCAodGhpcy5wcm9ncmFtRGF0YVN0b3JlLnR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgSXRlbVR5cGUuU2VyaWVzOlxuICAgICAgICAgICAgICAgIHJlbmRlcmVkRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiBjbGlja0hhbmRsZXIoZSkpXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgSXRlbVR5cGUuQm94U2V0OlxuICAgICAgICAgICAgY2FzZSBJdGVtVHlwZS5Gb2xkZXI6XG4gICAgICAgICAgICAgICAgcmVuZGVyZWRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IGUuc3RvcFByb3BhZ2F0aW9uKCkpXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBwdWJsaWMgc2V0VGV4dCh0ZXh0OiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5nZXRFbGVtZW50KCkucXVlcnlTZWxlY3RvcignaDEnKS5pbm5lclRleHQgPSB0ZXh0XG4gICAgfVxuICAgIFxuICAgIHB1YmxpYyBzZXRWaXNpYmxlKGlzVmlzaWJsZTogYm9vbGVhbikge1xuICAgICAgICBjb25zdCByZW5kZXJlZEVsZW1lbnQgPSB0aGlzLmdldEVsZW1lbnQoKVxuICAgICAgICBpZiAoaXNWaXNpYmxlKSB7XG4gICAgICAgICAgICByZW5kZXJlZEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpO1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJlbmRlcmVkRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdoaWRlJyk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHtCYXNlVGVtcGxhdGV9IGZyb20gXCIuL0Jhc2VUZW1wbGF0ZVwiO1xuXG5leHBvcnQgY2xhc3MgUHJldmlld0J1dHRvblRlbXBsYXRlIGV4dGVuZHMgQmFzZVRlbXBsYXRlIHtcbiAgICBjb25zdHJ1Y3Rvcihjb250YWluZXI6IEhUTUxFbGVtZW50LCBwb3NpdGlvbkFmdGVySW5kZXg6IG51bWJlcikge1xuICAgICAgICBzdXBlcihjb250YWluZXIsIHBvc2l0aW9uQWZ0ZXJJbmRleCk7XG4gICAgICAgIHRoaXMuc2V0RWxlbWVudElkKCdwb3B1cFByZXZpZXdCdXR0b24nKTtcbiAgICB9XG5cbiAgICBnZXRUZW1wbGF0ZSgpOiBzdHJpbmcge1xuICAgICAgICAvLyBsYW5ndWFnZT1IVE1MXG4gICAgICAgIHJldHVybiBgXG4gICAgICAgICAgICA8YnV0dG9uIGlkPVwiJHt0aGlzLmdldEVsZW1lbnRJZCgpfVwiIGNsYXNzPVwiYXV0b1NpemUgcGFwZXItaWNvbi1idXR0b24tbGlnaHRcIiBpcz1cInBhcGVyLWljb24tYnV0dG9uLWxpZ2h0XCJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU9XCJFcGlzb2RlIFByZXZpZXdcIj5cbiAgICAgICAgICAgICAgICA8IS0tIENyZWF0ZWQgd2l0aCBJbmtzY2FwZSAoaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvKSAtLT5cbiAgICAgICAgICAgICAgICA8c3ZnIGlkPVwic3ZnMVwiXG4gICAgICAgICAgICAgICAgICAgICB3aWR0aD1cIjI0XCJcbiAgICAgICAgICAgICAgICAgICAgIGhlaWdodD1cIjI0XCJcbiAgICAgICAgICAgICAgICAgICAgIHZpZXdCb3g9XCIwIDAgNiA0XCJcbiAgICAgICAgICAgICAgICAgICAgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj5cbiAgICAgICAgICAgICAgICAgICAgPGcgaWQ9XCJsYXllcjFcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxyZWN0IGlkPVwicmVjdDQ3XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPVwiZmlsbDpub25lO2ZpbGwtb3BhY2l0eToxO2ZpbGwtcnVsZTpub256ZXJvO3N0cm9rZTpjdXJyZW50Q29sb3I7c3Ryb2tlLXdpZHRoOjAuNDc2NDY3O3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtZGFzaGFycmF5Om5vbmU7cGFpbnQtb3JkZXI6c3Ryb2tlIG1hcmtlcnMgZmlsbFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aD1cIjMuNzU2ODY3NlwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ9XCIyLjE2OTM2NjFcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeD1cIjAuMjM4MjMzMDNcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeT1cIjEuODI1NzMzNVwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGlkPVwicmVjdDQ3LTVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9XCJmaWxsOm5vbmU7c3Ryb2tlOmN1cnJlbnRDb2xvcjtzdHJva2Utd2lkdGg6MC40NzY1OTc7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtwYWludC1vcmRlcjpzdHJva2UgbWFya2VycyBmaWxsXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGQ9XCJtIDEuMDI5MTQzNywxLjAzMjA0ODIgaCAzLjc1Mjg5OTEgdiAyLjE3MjIzOTQgbCAwLjAwNjc2LC0yLjE1NzI1OTUgelwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGlkPVwicmVjdDQ3LThcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9XCJmaWxsOm5vbmU7c3Ryb2tlOmN1cnJlbnRDb2xvcjtzdHJva2Utd2lkdGg6MC40Nzc0Mjc7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtwYWludC1vcmRlcjpzdHJva2UgbWFya2VycyBmaWxsXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGQ9XCJtIDEuODIyODYxNCwwLjIzODcxMzM2IGggMy43NTkyNTkgViAyLjQxMDEyMTEgbCAtMC4wMDY4LC0yLjE3MTQwNzc0IHpcIi8+XG4gICAgICAgICAgICAgICAgICAgIDwvZz5cbiAgICAgICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICBgO1xuICAgIH1cblxuICAgIHB1YmxpYyByZW5kZXIoY2xpY2tIYW5kbGVyOiBGdW5jdGlvbik6IHZvaWQge1xuICAgICAgICBjb25zdCByZW5kZXJlZEVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIoKTtcbiAgICAgICAgcmVuZGVyZWRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCk6IGFueSA9PiBjbGlja0hhbmRsZXIoKSk7XG4gICAgfVxufSIsImltcG9ydCB7QmFzZVRlbXBsYXRlfSBmcm9tIFwiLi4vQmFzZVRlbXBsYXRlXCJcbmltcG9ydCB7QmFzZUl0ZW19IGZyb20gXCIuLi8uLi9Nb2RlbHMvRXBpc29kZVwiXG5cbmV4cG9ydCBjbGFzcyBGYXZvcml0ZUljb25UZW1wbGF0ZSBleHRlbmRzIEJhc2VUZW1wbGF0ZSB7XG4gICAgY29uc3RydWN0b3IoY29udGFpbmVyOiBIVE1MRWxlbWVudCwgcG9zaXRpb25BZnRlckluZGV4OiBudW1iZXIsIHByaXZhdGUgZXBpc29kZTogQmFzZUl0ZW0pIHtcbiAgICAgICAgc3VwZXIoY29udGFpbmVyLCBwb3NpdGlvbkFmdGVySW5kZXgpXG4gICAgICAgIHRoaXMuc2V0RWxlbWVudElkKCdmYXZvcml0ZUJ1dHRvbi0nICsgZXBpc29kZS5JZClcbiAgICB9XG5cbiAgICBnZXRUZW1wbGF0ZSgpOiBzdHJpbmcge1xuICAgICAgICAvLyBsYW5ndWFnZT1IVE1MXG4gICAgICAgIHJldHVybiBgXG4gICAgICAgICAgICA8YnV0dG9uIGlkPVwiJHt0aGlzLmdldEVsZW1lbnRJZCgpfVwiXG4gICAgICAgICAgICAgICAgICAgIGlzPVwiZW1ieS1yYXRpbmdidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJpdGVtQWN0aW9uIHBhcGVyLWljb24tYnV0dG9uLWxpZ2h0IGVtYnktYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS1hY3Rpb249XCJub25lXCJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS1pZD1cIiR7dGhpcy5lcGlzb2RlPy5JZCA/PyAnJ31cIlxuICAgICAgICAgICAgICAgICAgICBkYXRhLXNlcnZlcmlkPVwiJHt0aGlzLmVwaXNvZGU/LlNlcnZlcklkID8/ICcnfVwiXG4gICAgICAgICAgICAgICAgICAgIGRhdGEtaXRlbXR5cGU9XCJFcGlzb2RlXCJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS1saWtlcz1cIlwiXG4gICAgICAgICAgICAgICAgICAgIGRhdGEtaXNmYXZvcml0ZT1cIiR7dGhpcy5lcGlzb2RlPy5Vc2VyRGF0YT8uSXNGYXZvcml0ZSA/PyBmYWxzZX1cIlxuICAgICAgICAgICAgICAgICAgICB0aXRsZT1cIkFkZCB0byBmYXZvcml0ZXNcIj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cIm1hdGVyaWFsLWljb25zIGZhdm9yaXRlXCI+PC9zcGFuPlxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIGBcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVuZGVyKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcigpXG4gICAgfVxufSIsImltcG9ydCB7QmFzZVRlbXBsYXRlfSBmcm9tIFwiLi4vQmFzZVRlbXBsYXRlXCJcbmltcG9ydCB7QmFzZUl0ZW19IGZyb20gXCIuLi8uLi9Nb2RlbHMvRXBpc29kZVwiXG5cbmV4cG9ydCBjbGFzcyBQbGF5U3RhdGVJY29uVGVtcGxhdGUgZXh0ZW5kcyBCYXNlVGVtcGxhdGUge1xuICAgIGNvbnN0cnVjdG9yKGNvbnRhaW5lcjogSFRNTEVsZW1lbnQsIHBvc2l0aW9uQWZ0ZXJJbmRleDogbnVtYmVyLCBwcml2YXRlIGVwaXNvZGU6IEJhc2VJdGVtKSB7XG4gICAgICAgIHN1cGVyKGNvbnRhaW5lciwgcG9zaXRpb25BZnRlckluZGV4KVxuICAgICAgICB0aGlzLnNldEVsZW1lbnRJZCgncGxheVN0YXRlQnV0dG9uLScgKyB0aGlzLmVwaXNvZGUuSWQpXG4gICAgfVxuXG4gICAgZ2V0VGVtcGxhdGUoKTogc3RyaW5nIHtcbiAgICAgICAgLy8gbGFuZ3VhZ2U9SFRNTFxuICAgICAgICByZXR1cm4gYFxuICAgICAgICAgICAgPGJ1dHRvbiBpZD1cIiR7dGhpcy5nZXRFbGVtZW50SWQoKX1cIlxuICAgICAgICAgICAgICAgICAgICBpcz1cImVtYnktcGxheXN0YXRlYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgIGRhdGEtYWN0aW9uPVwibm9uZVwiXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzPVwiaXRlbUFjdGlvbiBwYXBlci1pY29uLWJ1dHRvbi1saWdodCBlbWJ5LWJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgIGRhdGEtaWQ9XCIke3RoaXMuZXBpc29kZT8uSWQgPz8gJyd9XCIgXG4gICAgICAgICAgICAgICAgICAgIGRhdGEtc2VydmVyaWQ9XCIke3RoaXMuZXBpc29kZT8uU2VydmVySWQgPz8gJyd9XCJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS1pdGVtdHlwZT1cIkVwaXNvZGVcIlxuICAgICAgICAgICAgICAgICAgICBkYXRhLWxpa2VzPVwiXCJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS1wbGF5ZWQ9XCIke3RoaXMuZXBpc29kZT8uVXNlckRhdGE/LlBsYXllZCA/PyBmYWxzZX1cIlxuICAgICAgICAgICAgICAgICAgICB0aXRsZT1cIk1hcmsgcGxheWVkXCI+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJtYXRlcmlhbC1pY29ucyBjaGVjayBwbGF5c3RhdGVidXR0b24taWNvbi0ke3RoaXMuZXBpc29kZT8uVXNlckRhdGE/LlBsYXllZCA/IFwicGxheWVkXCIgOiBcInVucGxheWVkXCJ9XCI+PC9zcGFuPlxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIGBcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVuZGVyKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcigpXG4gICAgfVxufSIsImltcG9ydCB7QmFzZVRlbXBsYXRlfSBmcm9tIFwiLi9CYXNlVGVtcGxhdGVcIjtcbmltcG9ydCB7U2Vhc29ufSBmcm9tIFwiLi4vTW9kZWxzL1NlYXNvblwiO1xuXG5leHBvcnQgY2xhc3MgU2Vhc29uTGlzdEVsZW1lbnRUZW1wbGF0ZSBleHRlbmRzIEJhc2VUZW1wbGF0ZSB7XG4gICAgY29uc3RydWN0b3IoY29udGFpbmVyOiBIVE1MRWxlbWVudCwgcG9zaXRpb25BZnRlckluZGV4OiBudW1iZXIsIHByaXZhdGUgc2Vhc29uOiBTZWFzb24sIHByaXZhdGUgaXNDdXJyZW50U2Vhc29uOiBib29sZWFuKSB7XG4gICAgICAgIHN1cGVyKGNvbnRhaW5lciwgcG9zaXRpb25BZnRlckluZGV4KTtcbiAgICAgICAgdGhpcy5zZXRFbGVtZW50SWQoYGVwaXNvZGUtJHtzZWFzb24uc2Vhc29uSWR9YCk7XG4gICAgfVxuXG4gICAgZ2V0VGVtcGxhdGUoKTogc3RyaW5nIHtcbiAgICAgICAgLy8gbGFuZ3VhZ2U9SFRNTFxuICAgICAgICByZXR1cm4gYFxuICAgICAgICAgICAgPGRpdiBpZD1cIiR7dGhpcy5nZXRFbGVtZW50SWQoKX1cIlxuICAgICAgICAgICAgICAgICBjbGFzcz1cImxpc3RJdGVtIGxpc3RJdGVtLWJ1dHRvbiBhY3Rpb25TaGVldE1lbnVJdGVtIGVtYnktYnV0dG9uIHByZXZpZXdMaXN0SXRlbVwiXG4gICAgICAgICAgICAgICAgIGlzPVwiZW1ieS1idXR0b25cIlxuICAgICAgICAgICAgICAgICBkYXRhLWlkPVwiJHt0aGlzLnNlYXNvbi5zZWFzb25JZH1cIj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwibGlzdEl0ZW0gcHJldmlld0VwaXNvZGVUaXRsZVwiIHR5cGU9XCJidXR0b25cIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCIke3RoaXMuaXNDdXJyZW50U2Vhc29uID8gXCJtYXRlcmlhbC1pY29ucyBjaGVja1wiIDogXCJcIn1cIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsaXN0SXRlbUJvZHkgYWN0aW9uc2hlZXRMaXN0SXRlbUJvZHlcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiYWN0aW9uU2hlZXRJdGVtVGV4dFwiPiR7dGhpcy5zZWFzb24uc2Vhc29uTmFtZX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIGA7XG4gICAgfVxuXG4gICAgcHVibGljIHJlbmRlcihjbGlja0hhbmRsZXI6IEZ1bmN0aW9uKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHJlbmRlcmVkRWxlbWVudDogSFRNTEVsZW1lbnQgPSB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcigpO1xuICAgICAgICByZW5kZXJlZEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZTogTW91c2VFdmVudCk6IHZvaWQgPT4gY2xpY2tIYW5kbGVyKGUpKTtcbiAgICB9XG59IiwiZXhwb3J0IGVudW0gRW5kcG9pbnRzIHtcbiAgICBCQVNFID0gXCJJblBsYXllclByZXZpZXdcIixcbiAgICBFUElTT0RFX0lORk8gPSBcIi9Vc2Vycy97dXNlcklkfS9JdGVtcy97ZXBpc29kZUlkfVwiLFxuICAgIEVQSVNPREVfREVTQ1JJUFRJT04gPSBcIi9JdGVtcy97ZXBpc29kZUlkfVwiLFxuICAgIFBMQVlfTUVESUEgPSBcIi9Vc2Vycy97dXNlcklkfS97ZGV2aWNlSWR9L0l0ZW1zL3tlcGlzb2RlSWR9L1BsYXkve3RpY2tzfVwiLFxuICAgIFNFUlZFUl9TRVRUSU5HUyA9IFwiL1NlcnZlclNldHRpbmdzXCJcbn0iLCJpbXBvcnQge0xpc3RFbGVtZW50VGVtcGxhdGV9IGZyb20gXCIuL0NvbXBvbmVudHMvTGlzdEVsZW1lbnRUZW1wbGF0ZVwiO1xuaW1wb3J0IHtCYXNlSXRlbX0gZnJvbSBcIi4vTW9kZWxzL0VwaXNvZGVcIjtcbmltcG9ydCB7UHJvZ3JhbURhdGFTdG9yZX0gZnJvbSBcIi4vU2VydmljZXMvUHJvZ3JhbURhdGFTdG9yZVwiO1xuaW1wb3J0IHtTZWFzb259IGZyb20gXCIuL01vZGVscy9TZWFzb25cIjtcbmltcG9ydCB7U2Vhc29uTGlzdEVsZW1lbnRUZW1wbGF0ZX0gZnJvbSBcIi4vQ29tcG9uZW50cy9TZWFzb25MaXN0RWxlbWVudFRlbXBsYXRlXCI7XG5pbXBvcnQge1BvcHVwVGl0bGVUZW1wbGF0ZX0gZnJvbSBcIi4vQ29tcG9uZW50cy9Qb3B1cFRpdGxlVGVtcGxhdGVcIjtcbmltcG9ydCB7UGxheWJhY2tIYW5kbGVyfSBmcm9tIFwiLi9TZXJ2aWNlcy9QbGF5YmFja0hhbmRsZXJcIjtcbmltcG9ydCB7RW5kcG9pbnRzfSBmcm9tIFwiLi9FbmRwb2ludHNcIjtcblxuZXhwb3J0IGNsYXNzIExpc3RFbGVtZW50RmFjdG9yeSB7XG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBwbGF5YmFja0hhbmRsZXI6IFBsYXliYWNrSGFuZGxlciwgcHJpdmF0ZSBwcm9ncmFtRGF0YVN0b3JlOiBQcm9ncmFtRGF0YVN0b3JlKSB7IH1cbiAgICBcbiAgICBwdWJsaWMgYXN5bmMgY3JlYXRlRXBpc29kZUVsZW1lbnRzKGVwaXNvZGVzOiBCYXNlSXRlbVtdLCBwYXJlbnREaXY6IEhUTUxFbGVtZW50KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGNvbnN0IG9yZGVyZWRFcGlzb2RlcyA9IHRoaXMucmVzb2x2ZURpc3BsYXlPcmRlcihlcGlzb2RlcylcbiAgICAgICAgXG4gICAgICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCBvcmRlcmVkRXBpc29kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGVwaXNvZGUgPSBvcmRlcmVkRXBpc29kZXNbaV1cbiAgICAgICAgICAgIGNvbnN0IGVwaXNvZGVMaXN0RWxlbWVudFRlbXBsYXRlID0gbmV3IExpc3RFbGVtZW50VGVtcGxhdGUocGFyZW50RGl2LCBpLCBlcGlzb2RlLCB0aGlzLnBsYXliYWNrSGFuZGxlciwgdGhpcy5wcm9ncmFtRGF0YVN0b3JlKTtcbiAgICAgICAgICAgIGVwaXNvZGVMaXN0RWxlbWVudFRlbXBsYXRlLnJlbmRlcihhc3luYyAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gaGlkZSBlcGlzb2RlIGNvbnRlbnQgZm9yIGFsbCBleGlzdGluZyBlcGlzb2RlcyBpbiB0aGUgcHJldmlldyBsaXN0XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5wcmV2aWV3TGlzdEl0ZW1Db250ZW50XCIpLmZvckVhY2goKGVsZW1lbnQ6IEVsZW1lbnQpOiB2b2lkID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdoaWRlJyk7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWRMaXN0SXRlbScpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGNvbnN0IGVwaXNvZGVDb250YWluZXI6IEVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRoaXMuZ2V0RXBpc29kZVNlbGVjdG9yQnlJZChlcGlzb2RlLklkKSk/LnF1ZXJ5U2VsZWN0b3IoJy5wcmV2aWV3TGlzdEl0ZW1Db250ZW50Jyk7XG4gICAgICAgICAgICAgICAgaWYgKCFlcGlzb2RlQ29udGFpbmVyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBsb2FkIGVwaXNvZGUgZGVzY3JpcHRpb25cbiAgICAgICAgICAgICAgICBpZiAoIWVwaXNvZGUuRGVzY3JpcHRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdXJsID0gQXBpQ2xpZW50LmdldFVybChgLyR7RW5kcG9pbnRzLkJBU0V9JHtFbmRwb2ludHMuRVBJU09ERV9ERVNDUklQVElPTn1gXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgne2VwaXNvZGVJZH0nLCBlcGlzb2RlLklkKSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IEFwaUNsaWVudC5hamF4KHsgdHlwZTogJ0dFVCcsIHVybCwgZGF0YVR5cGU6ICdqc29uJyB9KVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXdEZXNjcmlwdGlvbjogc3RyaW5nID0gcmVzdWx0Py5EZXNjcmlwdGlvblxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ncmFtRGF0YVN0b3JlLnVwZGF0ZUl0ZW0oe1xuICAgICAgICAgICAgICAgICAgICAgICAgLi4uZXBpc29kZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIERlc2NyaXB0aW9uOiBuZXdEZXNjcmlwdGlvblxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICBlcGlzb2RlQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5wcmV2aWV3RXBpc29kZURlc2NyaXB0aW9uJykudGV4dENvbnRlbnQgPSBuZXdEZXNjcmlwdGlvblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBzaG93IGVwaXNvZGUgY29udGVudCBmb3IgdGhlIHNlbGVjdGVkIGVwaXNvZGVcbiAgICAgICAgICAgICAgICBlcGlzb2RlQ29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKTtcbiAgICAgICAgICAgICAgICBlcGlzb2RlQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkTGlzdEl0ZW0nKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBzY3JvbGwgdG8gdGhlIHNlbGVjdGVkIGVwaXNvZGVcbiAgICAgICAgICAgICAgICBlcGlzb2RlQ29udGFpbmVyLnBhcmVudEVsZW1lbnQuc2Nyb2xsSW50b1ZpZXcoeyBibG9jazogXCJzdGFydFwiIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmIChlcGlzb2RlLklkID09PSB0aGlzLnByb2dyYW1EYXRhU3RvcmUuYWN0aXZlTWVkaWFTb3VyY2VJZCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGVwaXNvZGVOb2RlOiBFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLmdldEVwaXNvZGVTZWxlY3RvckJ5SWQoZXBpc29kZS5JZCkpPy5xdWVyeVNlbGVjdG9yKCcucHJldmlld0xpc3RJdGVtQ29udGVudCcpO1xuICAgICAgICAgICAgICAgIGlmICghZXBpc29kZU5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gcHJlbG9hZCBlcGlzb2RlIGRlc2NyaXB0aW9uIGZvciB0aGUgY3VycmVudGx5IHBsYXlpbmcgZXBpc29kZVxuICAgICAgICAgICAgICAgIGlmICghZXBpc29kZS5EZXNjcmlwdGlvbikge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB1cmwgPSBBcGlDbGllbnQuZ2V0VXJsKGAvJHtFbmRwb2ludHMuQkFTRX0ke0VuZHBvaW50cy5FUElTT0RFX0RFU0NSSVBUSU9OfWBcbiAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKCd7ZXBpc29kZUlkfScsIGVwaXNvZGUuSWQpKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgQXBpQ2xpZW50LmFqYXgoeyB0eXBlOiAnR0VUJywgdXJsLCBkYXRhVHlwZTogJ2pzb24nIH0pXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5ld0Rlc2NyaXB0aW9uOiBzdHJpbmcgPSByZXN1bHQ/LkRlc2NyaXB0aW9uXG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ncmFtRGF0YVN0b3JlLnVwZGF0ZUl0ZW0oe1xuICAgICAgICAgICAgICAgICAgICAgICAgLi4uZXBpc29kZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIERlc2NyaXB0aW9uOiBuZXdEZXNjcmlwdGlvblxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICBlcGlzb2RlTm9kZS5xdWVyeVNlbGVjdG9yKCcucHJldmlld0VwaXNvZGVEZXNjcmlwdGlvbicpLnRleHRDb250ZW50ID0gbmV3RGVzY3JpcHRpb25cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgZXBpc29kZU5vZGUuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpO1xuICAgICAgICAgICAgICAgIGVwaXNvZGVOb2RlLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkTGlzdEl0ZW0nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBwdWJsaWMgY3JlYXRlU2Vhc29uRWxlbWVudHMoc2Vhc29uczogU2Vhc29uW10sIHBhcmVudERpdjogSFRNTEVsZW1lbnQsIGN1cnJlbnRTZWFzb25JbmRleDogbnVtYmVyLCB0aXRsZUNvbnRhaW5lcjogUG9wdXBUaXRsZVRlbXBsYXRlKTogdm9pZCB7XG4gICAgICAgIHNlYXNvbnMuc29ydCgoYSwgYikgPT4gYS5JbmRleE51bWJlciAtIGIuSW5kZXhOdW1iZXIpXG4gICAgICAgIFxuICAgICAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgc2Vhc29ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3Qgc2Vhc29uID0gbmV3IFNlYXNvbkxpc3RFbGVtZW50VGVtcGxhdGUocGFyZW50RGl2LCBpLCBzZWFzb25zW2ldLCBzZWFzb25zW2ldLkluZGV4TnVtYmVyID09PSBjdXJyZW50U2Vhc29uSW5kZXgpO1xuICAgICAgICAgICAgc2Vhc29uLnJlbmRlcigoZTogTW91c2VFdmVudCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdGl0bGVDb250YWluZXIuc2V0VGV4dChzZWFzb25zW2ldLnNlYXNvbk5hbWUpO1xuICAgICAgICAgICAgICAgIHRpdGxlQ29udGFpbmVyLnNldFZpc2libGUodHJ1ZSk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgcGFyZW50RGl2LmlubmVySFRNTCA9IFwiXCI7IC8vIHJlbW92ZSBvbGQgY29udGVudFxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlRXBpc29kZUVsZW1lbnRzKHNlYXNvbnNbaV0uZXBpc29kZXMsIHBhcmVudERpdikudGhlbigpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHJlc29sdmVEaXNwbGF5T3JkZXIoZXBpc29kZXM6IEJhc2VJdGVtW10pOiBCYXNlSXRlbVtdIHtcbiAgICAgICAgY29uc3QgZXBpc29kZXNDb3B5ID0gWy4uLmVwaXNvZGVzXVxuICAgICAgICBpZiAoIXRoaXMucHJvZ3JhbURhdGFTdG9yZS5pc1NodWZmbGVNb2RlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zb3J0QnlJbmRleE51bWJlcihlcGlzb2Rlc0NvcHkpXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBxdWV1ZU9yZGVyZWRJdGVtcyA9IHRoaXMucHJvZ3JhbURhdGFTdG9yZS5xdWV1ZU9yZGVyZWRJdGVtc1xuICAgICAgICBpZiAoIXF1ZXVlT3JkZXJlZEl0ZW1zIHx8IHF1ZXVlT3JkZXJlZEl0ZW1zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc29ydEJ5SW5kZXhOdW1iZXIoZXBpc29kZXNDb3B5KVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmVxdWVzdGVkRXBpc29kZUlkcyA9IG5ldyBTZXQoZXBpc29kZXNDb3B5Lm1hcChlcGlzb2RlID0+IGVwaXNvZGUuSWQpKVxuICAgICAgICBjb25zdCBxdWV1ZU9yZGVyZWRTdWJzZXQgPSBxdWV1ZU9yZGVyZWRJdGVtcy5maWx0ZXIoaXRlbSA9PiByZXF1ZXN0ZWRFcGlzb2RlSWRzLmhhcyhpdGVtLklkKSlcbiAgICAgICAgY29uc3QgcXVldWVPcmRlcmVkSWRzID0gbmV3IFNldChxdWV1ZU9yZGVyZWRTdWJzZXQubWFwKGl0ZW0gPT4gaXRlbS5JZCkpXG4gICAgICAgIGNvbnN0IHJlbWFpbmluZ0VwaXNvZGVzID0gZXBpc29kZXNDb3B5XG4gICAgICAgICAgICAuZmlsdGVyKGVwaXNvZGUgPT4gIXF1ZXVlT3JkZXJlZElkcy5oYXMoZXBpc29kZS5JZCkpXG4gICAgICAgIGNvbnN0IHNvcnRlZFJlbWFpbmluZ0VwaXNvZGVzID0gdGhpcy5zb3J0QnlJbmRleE51bWJlcihyZW1haW5pbmdFcGlzb2RlcylcblxuICAgICAgICByZXR1cm4gWy4uLnF1ZXVlT3JkZXJlZFN1YnNldCwgLi4uc29ydGVkUmVtYWluaW5nRXBpc29kZXNdXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRFcGlzb2RlU2VsZWN0b3JCeUlkKGVwaXNvZGVJZDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgY29uc3QgZXNjYXBlZEVwaXNvZGVJZCA9IHR5cGVvZiBDU1MgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBDU1MuZXNjYXBlID09PSAnZnVuY3Rpb24nXG4gICAgICAgICAgICA/IENTUy5lc2NhcGUoZXBpc29kZUlkKVxuICAgICAgICAgICAgOiBlcGlzb2RlSWQucmVwbGFjZSgvW1wiXFxcXF0vZywgJ1xcXFwkJicpXG4gICAgICAgIHJldHVybiBgW2RhdGEtaWQ9XCIke2VzY2FwZWRFcGlzb2RlSWR9XCJdYFxuICAgIH1cblxuICAgIHByaXZhdGUgc29ydEJ5SW5kZXhOdW1iZXIoZXBpc29kZXM6IEJhc2VJdGVtW10pOiBCYXNlSXRlbVtdIHtcbiAgICAgICAgcmV0dXJuIGVwaXNvZGVzLnNvcnQoKGEsIGIpID0+IChhLkluZGV4TnVtYmVyID8/IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSKSAtIChiLkluZGV4TnVtYmVyID8/IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSKSlcbiAgICB9XG59XG4iLCJleHBvcnQgZW51bSBJdGVtVHlwZSB7XG4gICAgQWdncmVnYXRlRm9sZGVyLFxuICAgIEF1ZGlvLFxuICAgIEF1ZGlvQm9vayxcbiAgICBCYXNlUGx1Z2luRm9sZGVyLFxuICAgIEJvb2ssXG4gICAgQm94U2V0LFxuICAgIENoYW5uZWwsXG4gICAgQ2hhbm5lbEZvbGRlckl0ZW0sXG4gICAgQ29sbGVjdGlvbkZvbGRlcixcbiAgICBFcGlzb2RlLFxuICAgIEZvbGRlcixcbiAgICBHZW5yZSxcbiAgICBNYW51YWxQbGF5bGlzdHNGb2xkZXIsXG4gICAgTW92aWUsXG4gICAgTGl2ZVR2Q2hhbm5lbCxcbiAgICBMaXZlVHZQcm9ncmFtLFxuICAgIE11c2ljQWxidW0sXG4gICAgTXVzaWNBcnRpc3QsXG4gICAgTXVzaWNHZW5yZSxcbiAgICBNdXNpY1ZpZGVvLFxuICAgIFBlcnNvbixcbiAgICBQaG90byxcbiAgICBQaG90b0FsYnVtLFxuICAgIFBsYXlsaXN0LFxuICAgIFBsYXlsaXN0c0ZvbGRlcixcbiAgICBQcm9ncmFtLFxuICAgIFJlY29yZGluZyxcbiAgICBTZWFzb24sXG4gICAgU2VyaWVzLFxuICAgIFN0dWRpbyxcbiAgICBUcmFpbGVyLFxuICAgIFR2Q2hhbm5lbCxcbiAgICBUdlByb2dyYW0sXG4gICAgVXNlclJvb3RGb2xkZXIsXG4gICAgVXNlclZpZXcsXG4gICAgVmlkZW8sXG4gICAgWWVhclxufSIsImltcG9ydCB7QmFzZUl0ZW19IGZyb20gXCIuL0VwaXNvZGVcIjtcblxuZXhwb3J0IGVudW0gUGxheU1ldGhvZCB7XG4gICAgVHJhbnNjb2RlID0gMCxcbiAgICBEaXJlY3RTdHJlYW0gPSAxLFxuICAgIERpcmVjdFBsYXkgPSAyXG59XG5cbmV4cG9ydCBlbnVtIFJlcGVhdE1vZGUge1xuICAgIFJlcGVhdE5vbmUgPSAwLFxuICAgIFJlcGVhdEFsbCA9IDEsXG4gICAgUmVwZWF0T25lID0gMlxufVxuXG5leHBvcnQgZW51bSBQbGF5YmFja09yZGVyIHtcbiAgICBEZWZhdWx0ID0gMCxcbiAgICBTaHVmZmxlID0gMVxufVxuXG5leHBvcnQgdHlwZSBRdWV1ZUl0ZW0gPSB7XG4gICAgSWQ6IHN0cmluZztcbiAgICBQbGF5bGlzdEl0ZW1JZDogc3RyaW5nO1xufVxuXG5leHBvcnQgdHlwZSBQbGF5YmFja1Byb2dyZXNzSW5mbyA9IHtcbiAgICBDYW5TZWVrOiBib29sZWFuO1xuICAgIEl0ZW06IEJhc2VJdGVtO1xuICAgIEl0ZW1JZDogc3RyaW5nO1xuICAgIFNlc3Npb25JZDogc3RyaW5nO1xuICAgIE1lZGlhU291cmNlSWQ6IHN0cmluZztcbiAgICBBdWRpb1N0cmVhbUluZGV4OiBudW1iZXIgfCBudWxsO1xuICAgIFN1YnRpdGxlU3RyZWFtSW5kZXg6IG51bWJlciB8IG51bGw7XG4gICAgSXNQYXVzZWQ6IGJvb2xlYW47XG4gICAgSXNNdXRlZDogYm9vbGVhbjtcbiAgICBQb3NpdGlvblRpY2tzOiBudW1iZXIgfCBudWxsO1xuICAgIFBsYXliYWNrU3RhcnRUaW1lVGlja3M6IG51bWJlciB8IG51bGw7XG4gICAgVm9sdW1lTGV2ZWw6IG51bWJlciB8IG51bGw7XG4gICAgQnJpZ2h0bmVzczogbnVtYmVyIHwgbnVsbDtcbiAgICBBc3BlY3RSYXRpbzogc3RyaW5nO1xuICAgIFBsYXlNZXRob2Q6IFBsYXlNZXRob2Q7XG4gICAgTGl2ZVN0cmVhbUlkOiBzdHJpbmc7XG4gICAgUGxheVNlc3Npb25JZDogc3RyaW5nO1xuICAgIFJlcGVhdE1vZGU6IFJlcGVhdE1vZGU7XG4gICAgUGxheWJhY2tPcmRlcjogUGxheWJhY2tPcmRlcjtcbiAgICBOb3dQbGF5aW5nUXVldWU6IFF1ZXVlSXRlbVtdO1xuICAgIFBsYXlsaXN0SXRlbUlkOiBzdHJpbmc7XG59IiwiaW1wb3J0IHtJdGVtVHlwZX0gZnJvbSBcIi4vSXRlbVR5cGVcIjtcblxuZXhwb3J0IHR5cGUgUGx1Z2luU2V0dGluZ3MgPSB7XG4gICAgRW5hYmxlZEl0ZW1UeXBlczogSXRlbVR5cGVbXSxcbiAgICBCbHVyRGVzY3JpcHRpb246IGJvb2xlYW4sXG4gICAgQmx1clRodW1ibmFpbDogYm9vbGVhbixcbn1cblxuZXhwb3J0IGNvbnN0IERlZmF1bHRQbHVnaW5TZXR0aW5nczogUGx1Z2luU2V0dGluZ3MgPSB7XG4gICAgRW5hYmxlZEl0ZW1UeXBlczogW0l0ZW1UeXBlLlNlcmllcywgSXRlbVR5cGUuQm94U2V0LCBJdGVtVHlwZS5Nb3ZpZSwgSXRlbVR5cGUuRm9sZGVyLCBJdGVtVHlwZS5WaWRlb10sXG4gICAgQmx1ckRlc2NyaXB0aW9uOiBmYWxzZSxcbiAgICBCbHVyVGh1bWJuYWlsOiBmYWxzZSxcbn0iLCJleHBvcnQgdHlwZSBTZXJ2ZXJTZXR0aW5ncyA9IHtcbiAgICBNaW5SZXN1bWVQY3Q6IG51bWJlciwgXG4gICAgTWF4UmVzdW1lUGN0OiBudW1iZXIsIFxuICAgIE1pblJlc3VtZUR1cmF0aW9uU2Vjb25kczogbnVtYmVyXG59XG5cbmV4cG9ydCBjb25zdCBEZWZhdWx0U2VydmVyU2V0dGluZ3M6IFNlcnZlclNldHRpbmdzID0ge1xuICAgIE1pblJlc3VtZVBjdDogNSxcbiAgICBNYXhSZXN1bWVQY3Q6IDkwLFxuICAgIE1pblJlc3VtZUR1cmF0aW9uU2Vjb25kczogMzAwXG59IiwiZXhwb3J0IGNsYXNzIEF1dGhTZXJ2aWNlIHtcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9hdXRoSGVhZGVyOiBzdHJpbmcgPSAnQXV0aG9yaXphdGlvbic7XG4gICAgcHJpdmF0ZSBfYXV0aEhlYWRlclZhbHVlOiBzdHJpbmcgPSAnJztcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRBdXRoSGVhZGVyS2V5KCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hdXRoSGVhZGVyO1xuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIGdldEF1dGhIZWFkZXJWYWx1ZSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5fYXV0aEhlYWRlclZhbHVlO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXRBdXRoSGVhZGVyVmFsdWUodmFsdWU6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICB0aGlzLl9hdXRoSGVhZGVyVmFsdWUgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWRkQXV0aEhlYWRlckludG9IdHRwUmVxdWVzdChyZXF1ZXN0OiBYTUxIdHRwUmVxdWVzdCk6IHZvaWQge1xuICAgICAgICByZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIodGhpcy5fYXV0aEhlYWRlciwgdGhpcy5nZXRBdXRoSGVhZGVyVmFsdWUoKSk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHtQcm9ncmFtRGF0YVN0b3JlfSBmcm9tIFwiLi9Qcm9ncmFtRGF0YVN0b3JlXCI7XG5pbXBvcnQge0F1dGhTZXJ2aWNlfSBmcm9tIFwiLi9BdXRoU2VydmljZVwiO1xuaW1wb3J0IHtMb2dnZXJ9IGZyb20gXCIuL0xvZ2dlclwiO1xuaW1wb3J0IHtCYXNlSXRlbSwgSXRlbUR0b30gZnJvbSBcIi4uL01vZGVscy9FcGlzb2RlXCI7XG5pbXBvcnQge1NlYXNvbn0gZnJvbSBcIi4uL01vZGVscy9TZWFzb25cIjtcbmltcG9ydCB7SXRlbVR5cGV9IGZyb20gXCIuLi9Nb2RlbHMvSXRlbVR5cGVcIjtcbmltcG9ydCB7UGxheWJhY2tQcm9ncmVzc0luZm99IGZyb20gXCIuLi9Nb2RlbHMvUGxheWJhY2tQcm9ncmVzc0luZm9cIjtcblxuLyoqXG4gKiBUaGUgY2xhc3NlcyB3aGljaCBkZXJpdmVzIGZyb20gdGhpcyBpbnRlcmZhY2UsIHdpbGwgcHJvdmlkZSB0aGUgZnVuY3Rpb25hbGl0eSB0byBoYW5kbGUgdGhlIGRhdGEgaW5wdXQgZnJvbSB0aGUgc2VydmVyIGlmIHRoZSBQbGF5YmFja1N0YXRlIGlzIGNoYW5nZWQuXG4gKi9cbmV4cG9ydCBjbGFzcyBEYXRhRmV0Y2hlciB7XG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBwcm9ncmFtRGF0YVN0b3JlOiBQcm9ncmFtRGF0YVN0b3JlLCBwcml2YXRlIGF1dGhTZXJ2aWNlOiBBdXRoU2VydmljZSwgcHJpdmF0ZSBsb2dnZXI6IExvZ2dlcikge1xuICAgICAgICBjb25zdCB7ZmV0Y2g6IG9yaWdpbmFsRmV0Y2h9ID0gd2luZG93XG4gICAgICAgIHdpbmRvdy5mZXRjaCA9IGFzeW5jICguLi5hcmdzKTogUHJvbWlzZTxSZXNwb25zZT4gPT4ge1xuICAgICAgICAgICAgY29uc3Qge29yaWdpbn0gPSB3aW5kb3cubG9jYXRpb247XG4gICAgICAgICAgICBsZXQgcmVzb3VyY2UgPSBhcmdzWzBdIGFzIFJlcXVlc3RJbmZvO1xuICAgICAgICAgICAgY29uc3QgY29uZmlnOiBSZXF1ZXN0SW5pdCA9IGFyZ3NbMV0gPz8ge307XG5cbiAgICAgICAgICAgIGNvbnN0IHRvVXJsID0gKGlucHV0OiBSZXF1ZXN0SW5mbyk6IFVSTCA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGlucHV0IGluc3RhbmNlb2YgVVJMKSByZXR1cm4gaW5wdXQ7XG4gICAgICAgICAgICAgICAgaWYgKGlucHV0IGluc3RhbmNlb2YgUmVxdWVzdCkgcmV0dXJuIG5ldyBVUkwoaW5wdXQudXJsKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFVSTChTdHJpbmcoaW5wdXQpLCBvcmlnaW4pO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYgKGNvbmZpZyAmJiBjb25maWcuaGVhZGVycykge1xuICAgICAgICAgICAgICAgIHRoaXMuYXV0aFNlcnZpY2Uuc2V0QXV0aEhlYWRlclZhbHVlKGNvbmZpZy5oZWFkZXJzW3RoaXMuYXV0aFNlcnZpY2UuZ2V0QXV0aEhlYWRlcktleSgpXSA/PyAnJylcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgdXJsOiBVUkwgPSB0b1VybChyZXNvdXJjZSk7XG4gICAgICAgICAgICBjb25zdCB1cmxQYXRobmFtZTogc3RyaW5nID0gdXJsLnBhdGhuYW1lO1xuXG4gICAgICAgICAgICAvLyBQcm9jZXNzIGRhdGEgZnJvbSBQT1NUIHJlcXVlc3RzXG4gICAgICAgICAgICAvLyBFbmRwb2ludDogL1Nlc3Npb25zL1BsYXlpbmdcbiAgICAgICAgICAgIGlmIChjb25maWcuYm9keSAmJiB0eXBlb2YgY29uZmlnLmJvZHkgPT09ICdzdHJpbmcnICYmIHVybFBhdGhuYW1lLmluY2x1ZGVzKCdTZXNzaW9ucy9QbGF5aW5nJykpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwbGF5aW5nSW5mbzogUGxheWJhY2tQcm9ncmVzc0luZm8gPSBKU09OLnBhcnNlKGNvbmZpZy5ib2R5KVxuXG4gICAgICAgICAgICAgICAgLy8gc2F2ZSB0aGUgbWVkaWEgaWQgb2YgdGhlIGN1cnJlbnRseSBwbGF5ZWQgdmlkZW9cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wcm9ncmFtRGF0YVN0b3JlLmFjdGl2ZU1lZGlhU291cmNlSWQgIT09IHBsYXlpbmdJbmZvLk1lZGlhU291cmNlSWQpXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvZ3JhbURhdGFTdG9yZS5hY3RpdmVNZWRpYVNvdXJjZUlkID0gcGxheWluZ0luZm8uTWVkaWFTb3VyY2VJZFxuXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9ncmFtRGF0YVN0b3JlLnBsYXliYWNrT3JkZXIgPSBwbGF5aW5nSW5mby5QbGF5YmFja09yZGVyXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9ncmFtRGF0YVN0b3JlLm5vd1BsYXlpbmdRdWV1ZSA9IChwbGF5aW5nSW5mby5Ob3dQbGF5aW5nUXVldWUgfHwgW10pLm1hcChxdWV1ZUl0ZW0gPT4gcXVldWVJdGVtLklkKVxuICAgICAgICAgICAgICAgIHRoaXMuZmV0Y2hNaXNzaW5nUXVldWVJdGVtcygpLnRoZW4oKVxuXG4gICAgICAgICAgICAgICAgLy8gRW5kcG9pbnQ6IC9TZXNzaW9ucy9QbGF5aW5nL1Byb2dyZXNzXG4gICAgICAgICAgICAgICAgaWYgKHVybFBhdGhuYW1lLmluY2x1ZGVzKCdQcm9ncmVzcycpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHVwZGF0ZSB0aGUgcGxheWJhY2sgcHJvZ3Jlc3Mgb2YgdGhlIGN1cnJlbnRseSBwbGF5ZWQgdmlkZW9cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZXBpc29kZTogQmFzZUl0ZW0gPSB0aGlzLnByb2dyYW1EYXRhU3RvcmUuZ2V0SXRlbUJ5SWQocGxheWluZ0luZm8uTWVkaWFTb3VyY2VJZClcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVwaXNvZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBsYXllZFBlcmNlbnRhZ2UgPSBlcGlzb2RlLlJ1blRpbWVUaWNrcyA+IDAgPyAocGxheWluZ0luZm8uUG9zaXRpb25UaWNrcyAvIGVwaXNvZGUuUnVuVGltZVRpY2tzKSAqIDEwMCA6IDBcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBsYXllZCA9IHBsYXllZFBlcmNlbnRhZ2UgPj0gdGhpcy5wcm9ncmFtRGF0YVN0b3JlLnNlcnZlclNldHRpbmdzLk1heFJlc3VtZVBjdFxuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2dyYW1EYXRhU3RvcmUudXBkYXRlSXRlbSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4uZXBpc29kZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBVc2VyRGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi5lcGlzb2RlLlVzZXJEYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBQbGF5YmFja1Bvc2l0aW9uVGlja3M6IHBsYXlpbmdJbmZvLlBvc2l0aW9uVGlja3MsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFBsYXllZFBlcmNlbnRhZ2U6IHBsYXllZFBlcmNlbnRhZ2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFBsYXllZDogcGxheWVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHVybFBhdGhuYW1lLmluY2x1ZGVzKCdFcGlzb2RlcycpKSB7XG4gICAgICAgICAgICAgICAgLy8gcmVtb3ZlIG5ldyAnc3RhcnRJdGVtSWQnIGFuZCAnbGltaXQnIHF1ZXJ5IHBhcmFtZXRlciwgdG8gc3RpbGwgZ2V0IHRoZSBmdWxsIGxpc3Qgb2YgZXBpc29kZXNcbiAgICAgICAgICAgICAgICBjb25zdCBjbGVhbmVkVVJMID0gdXJsLmhyZWYucmVwbGFjZSgvc3RhcnRJdGVtSWQ9W14mXSsmPy8sICcnKS5yZXBsYWNlKC9saW1pdD1bXiZdKyY/LywgJycpXG4gICAgICAgICAgICAgICAgcmVzb3VyY2UgPSB0b1VybChjbGVhbmVkVVJMKS50b1N0cmluZygpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlOiBSZXNwb25zZSA9IGF3YWl0IG9yaWdpbmFsRmV0Y2gocmVzb3VyY2UsIGNvbmZpZylcblxuICAgICAgICAgICAgaWYgKHVybFBhdGhuYW1lLmluY2x1ZGVzKCdFcGlzb2RlcycpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2dnZXIuZGVidWcoJ1JlY2VpdmVkIEVwaXNvZGVzJylcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICByZXNwb25zZS5jbG9uZSgpLmpzb24oKS50aGVuKChkYXRhOiBJdGVtRHRvKTogdm9pZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvZ3JhbURhdGFTdG9yZS50eXBlID0gSXRlbVR5cGUuU2VyaWVzXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvZ3JhbURhdGFTdG9yZS5zZWFzb25zID0gdGhpcy5nZXRGb3JtYXR0ZWRFcGlzb2RlRGF0YShkYXRhKVxuICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAodXJsUGF0aG5hbWUuaW5jbHVkZXMoJ1VzZXInKSAmJiB1cmxQYXRobmFtZS5pbmNsdWRlcygnSXRlbXMnKSAmJiB1cmwuc2VhcmNoUGFyYW1zLmhhcygnSWRzJykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlci5kZWJ1ZygnUmVjZWl2ZWQgSXRlbXMgYnkgSWRzJylcbiAgICAgICAgICAgICAgICByZXNwb25zZS5jbG9uZSgpLmpzb24oKS50aGVuKChkYXRhOiBJdGVtRHRvKTogdm9pZCA9PiB0aGlzLnByb2dyYW1EYXRhU3RvcmUubWVyZ2VRdWV1ZUl0ZW1zKGRhdGE/Lkl0ZW1zID8/IFtdKSlcblxuICAgICAgICAgICAgfSBlbHNlIGlmICh1cmxQYXRobmFtZS5pbmNsdWRlcygnVXNlcicpICYmIHVybFBhdGhuYW1lLmluY2x1ZGVzKCdJdGVtcycpICYmIHVybC5zZWFyY2guaW5jbHVkZXMoJ1BhcmVudElkJykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlci5kZWJ1ZygnUmVjZWl2ZWQgSXRlbXMgd2l0aCBQYXJlbnRJZCcpXG4gICAgICAgICAgICAgICAgcmVzcG9uc2UuY2xvbmUoKS5qc29uKCkudGhlbigoZGF0YTogSXRlbUR0byk6IHZvaWQgPT4gdGhpcy5zYXZlSXRlbURhdGEoZGF0YSwgdXJsLnNlYXJjaFBhcmFtcy5nZXQoJ1BhcmVudElkJykpKVxuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHVybFBhdGhuYW1lLmluY2x1ZGVzKCdVc2VyJykgJiYgdXJsUGF0aG5hbWUuaW5jbHVkZXMoJ0l0ZW1zJykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlci5kZWJ1ZygnUmVjZWl2ZWQgSXRlbXMgd2l0aG91dCBQYXJlbnRJZCcpXG5cbiAgICAgICAgICAgICAgICByZXNwb25zZS5jbG9uZSgpLmpzb24oKS50aGVuKChkYXRhOiBCYXNlSXRlbSk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlci5kZWJ1ZygnUmVjZWl2ZWQgc2luZ2xlIGl0ZW0gZGF0YSAtPiBTZXR0aW5nIEJveFNldCBuYW1lJylcblxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKEl0ZW1UeXBlW2RhdGEuVHlwZV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgSXRlbVR5cGUuQm94U2V0OlxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBJdGVtVHlwZS5Gb2xkZXI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ncmFtRGF0YVN0b3JlLmJveFNldE5hbWUgPSBkYXRhLk5hbWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2dyYW1EYXRhU3RvcmUuYWN0aXZlTWVkaWFTb3VyY2VJZCA9IGRhdGEuSWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBJdGVtVHlwZS5Nb3ZpZTogLy8gY291bGQgYmUgc2luZ2xlIHZpZGVvIChlLmcuIHN0YXJ0ZWQgZnJvbSBkYXNoYm9hcmQpXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIEl0ZW1UeXBlLlZpZGVvOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2F2ZUl0ZW1EYXRhKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgSXRlbXM6IFtkYXRhXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVG90YWxSZWNvcmRDb3VudDogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU3RhcnRJbmRleDogMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHVybFBhdGhuYW1lLmluY2x1ZGVzKCdQbGF5ZWRJdGVtcycpKSB7XG4gICAgICAgICAgICAgICAgLy8gdXBkYXRlIHRoZSBwbGF5ZWQgc3RhdGUgb2YgdGhlIGVwaXNvZGVcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlci5kZWJ1ZygnUmVjZWl2ZWQgUGxheWVkSXRlbXMnKVxuXG4gICAgICAgICAgICAgICAgY29uc3QgaXRlbUlkOiBzdHJpbmcgPSBleHRyYWN0S2V5RnJvbVN0cmluZyh1cmxQYXRobmFtZSwgJ1BsYXllZEl0ZW1zLycpXG4gICAgICAgICAgICAgICAgY29uc3QgY2hhbmdlZEl0ZW06IEJhc2VJdGVtID0gdGhpcy5wcm9ncmFtRGF0YVN0b3JlLmdldEl0ZW1CeUlkKGl0ZW1JZClcbiAgICAgICAgICAgICAgICBpZiAoIWNoYW5nZWRJdGVtKSByZXR1cm5cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICByZXNwb25zZS5jbG9uZSgpLmpzb24oKS50aGVuKChkYXRhKSA9PiBjaGFuZ2VkSXRlbS5Vc2VyRGF0YS5QbGF5ZWQgPSBkYXRhW1wiUGxheWVkXCJdKVxuICAgICAgICAgICAgICAgIHRoaXMucHJvZ3JhbURhdGFTdG9yZS51cGRhdGVJdGVtKGNoYW5nZWRJdGVtKVxuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHVybFBhdGhuYW1lLmluY2x1ZGVzKCdGYXZvcml0ZUl0ZW1zJykpIHtcbiAgICAgICAgICAgICAgICAvLyB1cGRhdGUgdGhlIGZhdm91cml0ZSBzdGF0ZSBvZiB0aGUgZXBpc29kZVxuICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKCdSZWNlaXZlZCBGYXZvcml0ZUl0ZW1zJylcblxuICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW1JZDogc3RyaW5nID0gZXh0cmFjdEtleUZyb21TdHJpbmcodXJsUGF0aG5hbWUsICdGYXZvcml0ZUl0ZW1zLycpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGNoYW5nZWRJdGVtOiBCYXNlSXRlbSA9IHRoaXMucHJvZ3JhbURhdGFTdG9yZS5nZXRJdGVtQnlJZChpdGVtSWQpO1xuICAgICAgICAgICAgICAgIGlmICghY2hhbmdlZEl0ZW0pIHJldHVyblxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICByZXNwb25zZS5jbG9uZSgpLmpzb24oKS50aGVuKChkYXRhKSA9PiBjaGFuZ2VkSXRlbS5Vc2VyRGF0YS5Jc0Zhdm9yaXRlID0gZGF0YVtcIklzRmF2b3JpdGVcIl0pO1xuICAgICAgICAgICAgICAgIHRoaXMucHJvZ3JhbURhdGFTdG9yZS51cGRhdGVJdGVtKGNoYW5nZWRJdGVtKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2VcblxuICAgICAgICAgICAgZnVuY3Rpb24gZXh0cmFjdEtleUZyb21TdHJpbmcoc2VhcmNoU3RyaW5nOiBzdHJpbmcsIHN0YXJ0U3RyaW5nOiBzdHJpbmcsIGVuZFN0cmluZzogc3RyaW5nID0gJycpOiBzdHJpbmcge1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0YXJ0SW5kZXg6IG51bWJlciA9IHNlYXJjaFN0cmluZy5pbmRleE9mKHN0YXJ0U3RyaW5nKSArIHN0YXJ0U3RyaW5nLmxlbmd0aFxuICAgICAgICAgICAgICAgIGlmIChlbmRTdHJpbmcgIT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGVuZEluZGV4OiBudW1iZXIgPSBzZWFyY2hTdHJpbmcuaW5kZXhPZihlbmRTdHJpbmcsIHN0YXJ0SW5kZXgpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWFyY2hTdHJpbmcuc3Vic3RyaW5nKHN0YXJ0SW5kZXgsIGVuZEluZGV4KVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBzZWFyY2hTdHJpbmcuc3Vic3RyaW5nKHN0YXJ0SW5kZXgpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgcHVibGljIHNhdmVJdGVtRGF0YShpdGVtRHRvOiBJdGVtRHRvLCBwYXJlbnRJZDogc3RyaW5nID0gJycpOiB2b2lkIHtcbiAgICAgICAgaWYgKCFpdGVtRHRvIHx8ICFpdGVtRHRvLkl0ZW1zIHx8IGl0ZW1EdG8uSXRlbXMubGVuZ3RoID09PSAwKVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIFxuICAgICAgICBjb25zdCBmaXJzdEl0ZW0gPSBpdGVtRHRvLkl0ZW1zLmF0KDApXG4gICAgICAgIGNvbnN0IGl0ZW1EdG9UeXBlOiBJdGVtVHlwZSA9IEl0ZW1UeXBlW2ZpcnN0SXRlbT8uVHlwZV1cbiAgICAgICAgc3dpdGNoIChpdGVtRHRvVHlwZSkge1xuICAgICAgICAgICAgY2FzZSBJdGVtVHlwZS5FcGlzb2RlOlxuICAgICAgICAgICAgICAgIC8vIGRvIG5vdCBvdmVyd3JpdGUgZGF0YSBpZiB3ZSBvbmx5IHJlY2VpdmUgb25lIGl0ZW0gd2hpY2ggYWxyZWFkeSBleGlzdHNcbiAgICAgICAgICAgICAgICBpZiAoaXRlbUR0by5JdGVtcy5sZW5ndGggPiAxIHx8ICF0aGlzLnByb2dyYW1EYXRhU3RvcmUuc2Vhc29ucy5mbGF0TWFwKHNlYXNvbiA9PiBzZWFzb24uZXBpc29kZXMpLnNvbWUoZXBpc29kZSA9PiBlcGlzb2RlLklkID09PSBmaXJzdEl0ZW0uSWQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvZ3JhbURhdGFTdG9yZS50eXBlID0gSXRlbVR5cGUuU2VyaWVzXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvZ3JhbURhdGFTdG9yZS5zZWFzb25zID0gdGhpcy5nZXRGb3JtYXR0ZWRFcGlzb2RlRGF0YShpdGVtRHRvKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZldGNoTWlzc2luZ1F1ZXVlSXRlbXMoKS50aGVuKClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgSXRlbVR5cGUuTW92aWU6XG4gICAgICAgICAgICAgICAgaWYgKGl0ZW1EdG8uSXRlbXMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2dyYW1EYXRhU3RvcmUudHlwZSA9IHRoaXMucHJvZ3JhbURhdGFTdG9yZS5hY3RpdmVNZWRpYVNvdXJjZUlkICE9PSAnJyAmJiB0aGlzLnByb2dyYW1EYXRhU3RvcmUuYWN0aXZlTWVkaWFTb3VyY2VJZCA9PT0gcGFyZW50SWQgPyBJdGVtVHlwZS5Cb3hTZXQgOiBJdGVtVHlwZS5Nb3ZpZVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2dyYW1EYXRhU3RvcmUubW92aWVzID0gaXRlbUR0by5JdGVtcy5tYXAoKG1vdmllLCBpZHgpID0+ICh7XG4gICAgICAgICAgICAgICAgICAgICAgICAuLi5tb3ZpZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIEluZGV4TnVtYmVyOiBpZHggKyAxXG4gICAgICAgICAgICAgICAgICAgIH0pKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZldGNoTWlzc2luZ1F1ZXVlSXRlbXMoKS50aGVuKClcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gZG8gbm90IG92ZXJ3cml0ZSBkYXRhIGlmIHdlIG9ubHkgcmVjZWl2ZSBvbmUgaXRlbSB3aGljaCBhbHJlYWR5IGV4aXN0c1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5wcm9ncmFtRGF0YVN0b3JlLm1vdmllcy5zb21lKG1vdmllID0+IG1vdmllLklkID09PSBmaXJzdEl0ZW0uSWQpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5wcm9ncmFtRGF0YVN0b3JlLm1vdmllcy5zb21lKG1vdmllID0+IG1vdmllLlNvcnROYW1lID09PSBmaXJzdEl0ZW0uU29ydE5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2dyYW1EYXRhU3RvcmUudHlwZSA9IHRoaXMucHJvZ3JhbURhdGFTdG9yZS5hY3RpdmVNZWRpYVNvdXJjZUlkICE9PSAnJyAmJiB0aGlzLnByb2dyYW1EYXRhU3RvcmUuYWN0aXZlTWVkaWFTb3VyY2VJZCA9PT0gcGFyZW50SWQgPyBJdGVtVHlwZS5Cb3hTZXQgOiBJdGVtVHlwZS5Nb3ZpZVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvZ3JhbURhdGFTdG9yZS5tb3ZpZXMgPSBpdGVtRHRvLkl0ZW1zLm1hcCgobW92aWUsIGlkeCkgPT4gKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLm1vdmllLFxuICAgICAgICAgICAgICAgICAgICAgICAgSW5kZXhOdW1iZXI6IGlkeCArIDFcbiAgICAgICAgICAgICAgICAgICAgfSkpXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmV0Y2hNaXNzaW5nUXVldWVJdGVtcygpLnRoZW4oKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSBJdGVtVHlwZS5WaWRlbzpcbiAgICAgICAgICAgICAgICBpZiAoaXRlbUR0by5JdGVtcy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvZ3JhbURhdGFTdG9yZS50eXBlID0gdGhpcy5wcm9ncmFtRGF0YVN0b3JlLmFjdGl2ZU1lZGlhU291cmNlSWQgIT09ICcnICYmIHRoaXMucHJvZ3JhbURhdGFTdG9yZS5hY3RpdmVNZWRpYVNvdXJjZUlkID09PSBwYXJlbnRJZCA/IEl0ZW1UeXBlLkZvbGRlciA6IEl0ZW1UeXBlLlZpZGVvXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1EdG8uSXRlbXMuc29ydCgoYSwgYikgPT4gKGEuU29ydE5hbWUgJiYgYi5Tb3J0TmFtZSkgPyBhLlNvcnROYW1lLmxvY2FsZUNvbXBhcmUoYi5Tb3J0TmFtZSkgOiAwKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2dyYW1EYXRhU3RvcmUubW92aWVzID0gaXRlbUR0by5JdGVtcy5tYXAoKHZpZGVvLCBpZHgpID0+ICh7XG4gICAgICAgICAgICAgICAgICAgICAgICAuLi52aWRlbyxcbiAgICAgICAgICAgICAgICAgICAgICAgIEluZGV4TnVtYmVyOiBpZHggKyAxXG4gICAgICAgICAgICAgICAgICAgIH0pKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZldGNoTWlzc2luZ1F1ZXVlSXRlbXMoKS50aGVuKClcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gZG8gbm90IG92ZXJ3cml0ZSBkYXRhIGlmIHdlIG9ubHkgcmVjZWl2ZSBvbmUgaXRlbSB3aGljaCBhbHJlYWR5IGV4aXN0c1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5wcm9ncmFtRGF0YVN0b3JlLm1vdmllcy5zb21lKHZpZGVvID0+IHZpZGVvLklkID09PSBmaXJzdEl0ZW0uSWQpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5wcm9ncmFtRGF0YVN0b3JlLm1vdmllcy5zb21lKHZpZGVvID0+IHZpZGVvLlNvcnROYW1lID09PSBmaXJzdEl0ZW0uU29ydE5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2dyYW1EYXRhU3RvcmUudHlwZSA9IHRoaXMucHJvZ3JhbURhdGFTdG9yZS5hY3RpdmVNZWRpYVNvdXJjZUlkICE9PSAnJyAmJiB0aGlzLnByb2dyYW1EYXRhU3RvcmUuYWN0aXZlTWVkaWFTb3VyY2VJZCA9PT0gcGFyZW50SWQgPyBJdGVtVHlwZS5Gb2xkZXIgOiBJdGVtVHlwZS5WaWRlb1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGl0ZW1EdG8uSXRlbXMuc29ydCgoYSwgYikgPT4gKGEuU29ydE5hbWUgJiYgYi5Tb3J0TmFtZSkgPyBhLlNvcnROYW1lLmxvY2FsZUNvbXBhcmUoYi5Tb3J0TmFtZSkgOiAwKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2dyYW1EYXRhU3RvcmUubW92aWVzID0gaXRlbUR0by5JdGVtcy5tYXAoKHZpZGVvLCBpZHgpID0+ICh7XG4gICAgICAgICAgICAgICAgICAgICAgICAuLi52aWRlbyxcbiAgICAgICAgICAgICAgICAgICAgICAgIEluZGV4TnVtYmVyOiBpZHggKyAxXG4gICAgICAgICAgICAgICAgICAgIH0pKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZldGNoTWlzc2luZ1F1ZXVlSXRlbXMoKS50aGVuKClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHRoaXMubG9nZ2VyLmVycm9yKFwiQ291bGRuJ3Qgc2F2ZSBpdGVtcyBmcm9tIHJlc3BvbnNlXCIsIGl0ZW1EdG8pO1xuICAgIH1cbiAgICBcbiAgICBwdWJsaWMgZ2V0Rm9ybWF0dGVkRXBpc29kZURhdGEgPSAoaXRlbUR0bzogSXRlbUR0bykgPT4ge1xuICAgICAgICBjb25zdCBlcGlzb2RlRGF0YTogQmFzZUl0ZW1bXSA9IGl0ZW1EdG8uSXRlbXNcbiAgICAgICAgXG4gICAgICAgIC8vIGdldCBhbGwgZGlmZmVyZW50IHNlYXNvbklkc1xuICAgICAgICBjb25zdCBzZWFzb25JZHM6IFNldDxzdHJpbmc+ID0gbmV3IFNldDxzdHJpbmc+KGVwaXNvZGVEYXRhLm1hcCgoZXBpc29kZTogQmFzZUl0ZW0pOiBzdHJpbmcgPT4gZXBpc29kZS5TZWFzb25JZCkpXG5cbiAgICAgICAgLy8gZ3JvdXAgdGhlIGVwaXNvZGVzIGJ5IHNlYXNvbklkXG4gICAgICAgIGNvbnN0IGdyb3VwOiBSZWNvcmQ8c3RyaW5nLCBCYXNlSXRlbVtdPiA9IGdyb3VwQnkoZXBpc29kZURhdGEsIChlcGlzb2RlOiBCYXNlSXRlbSk6IHN0cmluZyA9PiBlcGlzb2RlLlNlYXNvbklkKVxuXG4gICAgICAgIGNvbnN0IHNlYXNvbnM6IFNlYXNvbltdID0gW11cbiAgICAgICAgY29uc3QgaXRlcmF0b3I6IEl0ZXJhYmxlSXRlcmF0b3I8c3RyaW5nPiA9IHNlYXNvbklkcy52YWx1ZXMoKVxuICAgICAgICBsZXQgdmFsdWU6IEl0ZXJhdG9yUmVzdWx0PHN0cmluZz4gPSBpdGVyYXRvci5uZXh0KClcbiAgICAgICAgd2hpbGUgKCF2YWx1ZS5kb25lKSB7XG4gICAgICAgICAgICBjb25zdCBzZWFzb25JZDogc3RyaW5nID0gdmFsdWUudmFsdWVcbiAgICAgICAgICAgIGNvbnN0IHNlYXNvbjogU2Vhc29uID0ge1xuICAgICAgICAgICAgICAgIHNlYXNvbklkOiBzZWFzb25JZCxcbiAgICAgICAgICAgICAgICBzZWFzb25OYW1lOiBncm91cFtzZWFzb25JZF0uYXQoMCkuU2Vhc29uTmFtZSxcbiAgICAgICAgICAgICAgICBlcGlzb2RlczogZ3JvdXBbc2Vhc29uSWRdLFxuICAgICAgICAgICAgICAgIEluZGV4TnVtYmVyOiBzZWFzb25zLmxlbmd0aFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBzZWFzb25zLnB1c2goc2Vhc29uKVxuICAgICAgICAgICAgdmFsdWUgPSBpdGVyYXRvci5uZXh0KClcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzZWFzb25zXG4gICAgICAgIFxuICAgICAgICBmdW5jdGlvbiBncm91cEJ5PFQ+KGFycjogVFtdLCBmbjogKGl0ZW06IFQpID0+IGFueSk6IFJlY29yZDxzdHJpbmcsIFRbXT4ge1xuICAgICAgICAgICAgcmV0dXJuIGFyci5yZWR1Y2U8UmVjb3JkPHN0cmluZywgVFtdPj4oKHByZXY6IFJlY29yZDxzdHJpbmcsIFRbXT4sIGN1cnI6IFQpOiB7fSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZ3JvdXBLZXkgPSBmbihjdXJyKVxuICAgICAgICAgICAgICAgIGNvbnN0IGdyb3VwOiBUW10gPSBwcmV2W2dyb3VwS2V5XSB8fCBbXVxuICAgICAgICAgICAgICAgIGdyb3VwLnB1c2goY3VycilcbiAgICAgICAgICAgICAgICByZXR1cm4geyAuLi5wcmV2LCBbZ3JvdXBLZXldOiBncm91cCB9XG4gICAgICAgICAgICB9LCB7fSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgZmV0Y2hNaXNzaW5nUXVldWVJdGVtcygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgY29uc3QgbWlzc2luZ1F1ZXVlSXRlbUlkcyA9IHRoaXMucHJvZ3JhbURhdGFTdG9yZS5nZXRNaXNzaW5nUXVldWVJdGVtSWRzKClcbiAgICAgICAgaWYgKG1pc3NpbmdRdWV1ZUl0ZW1JZHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB1c2VySWQgPSBBcGlDbGllbnQuZ2V0Q3VycmVudFVzZXJJZD8uKClcbiAgICAgICAgICAgIGlmICghdXNlcklkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGlkc1BhcmFtID0gbWlzc2luZ1F1ZXVlSXRlbUlkcy5tYXAoaWQgPT4gZW5jb2RlVVJJQ29tcG9uZW50KGlkKSkuam9pbignLCcpXG4gICAgICAgICAgICBjb25zdCB1cmwgPSBBcGlDbGllbnQuZ2V0VXJsKGAvVXNlcnMvJHt1c2VySWR9L0l0ZW1zP0lkcz0ke2lkc1BhcmFtfWApXG4gICAgICAgICAgICBjb25zdCBpdGVtRHRvOiBJdGVtRHRvID0gYXdhaXQgQXBpQ2xpZW50LmFqYXgoe3R5cGU6ICdHRVQnLCB1cmwsIGRhdGFUeXBlOiAnanNvbid9KVxuICAgICAgICAgICAgdGhpcy5wcm9ncmFtRGF0YVN0b3JlLm1lcmdlUXVldWVJdGVtcyhpdGVtRHRvPy5JdGVtcyA/PyBbXSlcbiAgICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmVycm9yKGBDb3VsZG4ndCBmZXRjaCBxdWV1ZSBpdGVtcyBieSBpZGAsIGV4KVxuICAgICAgICB9XG4gICAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIExvZ2dlciB7XG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBsb2dfcHJlZml4OiBzdHJpbmcgPSBcIltJblBsYXllckVwaXNvZGVQcmV2aWV3XVwiKSB7XG4gICAgfVxuXG4gICAgcHVibGljIGRlYnVnKG1zZzogc3RyaW5nLCAuLi5kZXRhaWxzOiBhbnlbXSk6IHZvaWQge1xuICAgICAgICAvLyBjb25zb2xlLmRlYnVnKGAke3RoaXMubG9nX3ByZWZpeH0gJHttc2d9YCwgZGV0YWlscyk7XG4gICAgfVxuXG4gICAgcHVibGljIGVycm9yKG1zZzogc3RyaW5nLCAuLi5kZXRhaWxzOiBhbnlbXSk6IHZvaWQge1xuICAgICAgICBjb25zb2xlLmVycm9yKGAke3RoaXMubG9nX3ByZWZpeH0gJHttc2d9YCwgZGV0YWlscyk7XG4gICAgfVxuXG4gICAgcHVibGljIGluZm8obXNnOiBzdHJpbmcsIC4uLmRldGFpbHM6IGFueVtdKTogdm9pZCB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhgJHt0aGlzLmxvZ19wcmVmaXh9ICR7bXNnfWAsIGRldGFpbHMpO1xuICAgIH1cblxufVxuIiwiaW1wb3J0IHtMb2dnZXJ9IGZyb20gXCIuL0xvZ2dlclwiO1xuaW1wb3J0IHtFbmRwb2ludHN9IGZyb20gXCIuLi9FbmRwb2ludHNcIjtcblxuZXhwb3J0IGNsYXNzIFBsYXliYWNrSGFuZGxlciB7XG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBsb2dnZXI6IExvZ2dlcikgeyB9XG5cbiAgICBhc3luYyBwbGF5KGVwaXNvZGVJZDogc3RyaW5nLCBzdGFydFBvc2l0aW9uVGlja3M6IG51bWJlcik6IFByb21pc2U8dm9pZCB8IFJlc3BvbnNlPiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB1cmwgPSBBcGlDbGllbnQuZ2V0VXJsKGAvJHtFbmRwb2ludHMuQkFTRX0ke0VuZHBvaW50cy5QTEFZX01FRElBfWBcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgne3VzZXJJZH0nLCBBcGlDbGllbnQuZ2V0Q3VycmVudFVzZXJJZCgpKVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKCd7ZGV2aWNlSWR9JywgQXBpQ2xpZW50LmRldmljZUlkKCkpXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoJ3tlcGlzb2RlSWR9JywgZXBpc29kZUlkKVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKCd7dGlja3N9Jywgc3RhcnRQb3NpdGlvblRpY2tzLnRvU3RyaW5nKCkpKVxuXG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgQXBpQ2xpZW50LmFqYXgoeyB0eXBlOiAnR0VUJywgdXJsIH0pXG4gICAgICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5sb2dnZXIuZXJyb3IoYENvdWxkbid0IHN0YXJ0IHRoZSBwbGF5YmFjayBvZiBhbiBlcGlzb2RlYCwgZXgpXG4gICAgICAgIH1cbiAgICB9XG59IiwiaW1wb3J0IHtQcm9ncmFtRGF0YX0gZnJvbSBcIi4uL01vZGVscy9Qcm9ncmFtRGF0YVwiO1xuaW1wb3J0IHtTZWFzb259IGZyb20gXCIuLi9Nb2RlbHMvU2Vhc29uXCI7XG5pbXBvcnQge0Jhc2VJdGVtfSBmcm9tIFwiLi4vTW9kZWxzL0VwaXNvZGVcIjtcbmltcG9ydCB7SXRlbVR5cGV9IGZyb20gXCIuLi9Nb2RlbHMvSXRlbVR5cGVcIjtcbmltcG9ydCB7RGVmYXVsdFBsdWdpblNldHRpbmdzLCBQbHVnaW5TZXR0aW5nc30gZnJvbSBcIi4uL01vZGVscy9QbHVnaW5TZXR0aW5nc1wiO1xuaW1wb3J0IHtEZWZhdWx0U2VydmVyU2V0dGluZ3MsIFNlcnZlclNldHRpbmdzfSBmcm9tIFwiLi4vTW9kZWxzL1NlcnZlclNldHRpbmdzXCI7XG5pbXBvcnQge1BsYXliYWNrT3JkZXJ9IGZyb20gXCIuLi9Nb2RlbHMvUGxheWJhY2tQcm9ncmVzc0luZm9cIjtcblxuZXhwb3J0IGNsYXNzIFByb2dyYW1EYXRhU3RvcmUge1xuICAgIHByaXZhdGUgX3Byb2dyYW1EYXRhOiBQcm9ncmFtRGF0YVxuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuX3Byb2dyYW1EYXRhID0ge1xuICAgICAgICAgICAgYWN0aXZlTWVkaWFTb3VyY2VJZDogJycsXG4gICAgICAgICAgICBib3hTZXROYW1lOiAnJyxcbiAgICAgICAgICAgIHR5cGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIG1vdmllczogW10sXG4gICAgICAgICAgICBzZWFzb25zOiBbXSxcbiAgICAgICAgICAgIHBsYXliYWNrT3JkZXI6IFBsYXliYWNrT3JkZXIuRGVmYXVsdCxcbiAgICAgICAgICAgIG5vd1BsYXlpbmdRdWV1ZTogW10sXG4gICAgICAgICAgICBxdWV1ZUl0ZW1zOiBbXSxcbiAgICAgICAgICAgIHBsdWdpblNldHRpbmdzOiBEZWZhdWx0UGx1Z2luU2V0dGluZ3MsXG4gICAgICAgICAgICBzZXJ2ZXJTZXR0aW5nczogRGVmYXVsdFNlcnZlclNldHRpbmdzXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IGFjdGl2ZU1lZGlhU291cmNlSWQoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Byb2dyYW1EYXRhLmFjdGl2ZU1lZGlhU291cmNlSWRcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0IGFjdGl2ZU1lZGlhU291cmNlSWQoYWN0aXZlTWVkaWFTb3VyY2VJZDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuX3Byb2dyYW1EYXRhLmFjdGl2ZU1lZGlhU291cmNlSWQgPSBhY3RpdmVNZWRpYVNvdXJjZUlkXG4gICAgfVxuXG4gICAgcHVibGljIGdldCBhY3RpdmVTZWFzb24oKTogU2Vhc29uIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2Vhc29ucy5maW5kKHNlYXNvbiA9PiBzZWFzb24uZXBpc29kZXMuc29tZShlcGlzb2RlID0+IGVwaXNvZGUuSWQgPT09IHRoaXMuYWN0aXZlTWVkaWFTb3VyY2VJZCkpXG4gICAgfVxuICAgIFxuICAgIHB1YmxpYyBnZXQgdHlwZSgpOiBJdGVtVHlwZSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wcm9ncmFtRGF0YS50eXBlXG4gICAgfVxuICAgIFxuICAgIHB1YmxpYyBzZXQgdHlwZSh0eXBlOiBJdGVtVHlwZSkge1xuICAgICAgICB0aGlzLl9wcm9ncmFtRGF0YS50eXBlID0gdHlwZVxuICAgIH1cbiAgICBcbiAgICBwdWJsaWMgZ2V0IGJveFNldE5hbWUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Byb2dyYW1EYXRhLmJveFNldE5hbWVcbiAgICB9XG4gICAgXG4gICAgcHVibGljIHNldCBib3hTZXROYW1lKGJveFNldE5hbWU6IHN0cmluZykge1xuICAgICAgICB0aGlzLl9wcm9ncmFtRGF0YS5ib3hTZXROYW1lID0gYm94U2V0TmFtZVxuICAgIH1cbiAgICBcbiAgICBwdWJsaWMgZ2V0IG1vdmllcygpOiBCYXNlSXRlbVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Byb2dyYW1EYXRhLm1vdmllc1xuICAgIH1cbiAgICBcbiAgICBwdWJsaWMgc2V0IG1vdmllcyhtb3ZpZXM6IEJhc2VJdGVtW10pIHtcbiAgICAgICAgdGhpcy5fcHJvZ3JhbURhdGEubW92aWVzID0gbW92aWVzXG4gICAgICAgIHRoaXMuX3Byb2dyYW1EYXRhLnNlYXNvbnMgPSBbXVxuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgc2Vhc29ucygpOiBTZWFzb25bXSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wcm9ncmFtRGF0YS5zZWFzb25zXG4gICAgfVxuXG4gICAgcHVibGljIHNldCBzZWFzb25zKHNlYXNvbnM6IFNlYXNvbltdKSB7XG4gICAgICAgIHRoaXMuX3Byb2dyYW1EYXRhLnNlYXNvbnMgPSBzZWFzb25zXG4gICAgICAgIHRoaXMuX3Byb2dyYW1EYXRhLm1vdmllcyA9IFtdXG4gICAgfVxuXG4gICAgcHVibGljIGdldCBwbGF5YmFja09yZGVyKCk6IFBsYXliYWNrT3JkZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5fcHJvZ3JhbURhdGEucGxheWJhY2tPcmRlclxuICAgIH1cblxuICAgIHB1YmxpYyBzZXQgcGxheWJhY2tPcmRlcihvcmRlcjogUGxheWJhY2tPcmRlcikge1xuICAgICAgICB0aGlzLl9wcm9ncmFtRGF0YS5wbGF5YmFja09yZGVyID0gb3JkZXJcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IG5vd1BsYXlpbmdRdWV1ZSgpOiBzdHJpbmdbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wcm9ncmFtRGF0YS5ub3dQbGF5aW5nUXVldWVcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0IG5vd1BsYXlpbmdRdWV1ZShxdWV1ZUlkczogc3RyaW5nW10pIHtcbiAgICAgICAgdGhpcy5fcHJvZ3JhbURhdGEubm93UGxheWluZ1F1ZXVlID0gcXVldWVJZHNcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IGlzU2h1ZmZsZU1vZGUoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnBsYXliYWNrT3JkZXIgPT09IFBsYXliYWNrT3JkZXIuU2h1ZmZsZVxuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgcGx1Z2luU2V0dGluZ3MoKTogUGx1Z2luU2V0dGluZ3Mge1xuICAgICAgICByZXR1cm4gdGhpcy5fcHJvZ3JhbURhdGEucGx1Z2luU2V0dGluZ3NcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0IHBsdWdpblNldHRpbmdzKHNldHRpbmdzOiBQbHVnaW5TZXR0aW5ncykge1xuICAgICAgICB0aGlzLl9wcm9ncmFtRGF0YS5wbHVnaW5TZXR0aW5ncyA9IHNldHRpbmdzXG4gICAgfVxuXG4gICAgcHVibGljIGdldCBzZXJ2ZXJTZXR0aW5ncygpOiBTZXJ2ZXJTZXR0aW5ncyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wcm9ncmFtRGF0YS5zZXJ2ZXJTZXR0aW5nc1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXQgc2VydmVyU2V0dGluZ3Moc2V0dGluZ3M6IFNlcnZlclNldHRpbmdzKSB7XG4gICAgICAgIHRoaXMuX3Byb2dyYW1EYXRhLnNlcnZlclNldHRpbmdzID0gc2V0dGluZ3NcbiAgICB9XG4gICAgXG4gICAgcHVibGljIGdldCBkYXRhSXNBbGxvd2VkRm9yUHJldmlldygpIHtcbiAgICAgICAgaWYgKCF0aGlzLmFsbG93ZWRQcmV2aWV3VHlwZXMuaW5jbHVkZXModGhpcy50eXBlKSlcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICBcbiAgICAgICAgc3dpdGNoICh0aGlzLnR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgSXRlbVR5cGUuU2VyaWVzOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNlYXNvbnMuZmxhdE1hcChzZWFzb24gPT4gc2Vhc29uLmVwaXNvZGVzKS5sZW5ndGggPiAwIHx8IHRoaXMucXVldWVPcmRlcmVkSXRlbXMubGVuZ3RoID4gMFxuICAgICAgICAgICAgY2FzZSBJdGVtVHlwZS5Nb3ZpZTpcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICAgICAgY2FzZSBJdGVtVHlwZS5Cb3hTZXQ6XG4gICAgICAgICAgICBjYXNlIEl0ZW1UeXBlLkZvbGRlcjpcbiAgICAgICAgICAgIGNhc2UgSXRlbVR5cGUuVmlkZW86XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubW92aWVzLmxlbmd0aCA+PSAxXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIHB1YmxpYyBnZXQgYWxsb3dlZFByZXZpZXdUeXBlcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGx1Z2luU2V0dGluZ3MuRW5hYmxlZEl0ZW1UeXBlc1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgcXVldWVPcmRlcmVkSXRlbXMoKTogQmFzZUl0ZW1bXSB7XG4gICAgICAgIGlmICghdGhpcy5ub3dQbGF5aW5nUXVldWUgfHwgdGhpcy5ub3dQbGF5aW5nUXVldWUubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gW11cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGFsbEl0ZW1zQnlJZCA9IG5ldyBNYXA8c3RyaW5nLCBCYXNlSXRlbT4odGhpcy5hbGxMb2FkZWRJdGVtcy5tYXAoaXRlbSA9PiBbaXRlbS5JZCwgaXRlbV0pKVxuICAgICAgICByZXR1cm4gdGhpcy5ub3dQbGF5aW5nUXVldWVcbiAgICAgICAgICAgIC5tYXAocXVldWVJdGVtSWQgPT4gYWxsSXRlbXNCeUlkLmdldChxdWV1ZUl0ZW1JZCkpXG4gICAgICAgICAgICAuZmlsdGVyKGl0ZW0gPT4gISFpdGVtKVxuICAgIH1cblxuICAgIHB1YmxpYyBnZXRNaXNzaW5nUXVldWVJdGVtSWRzKCk6IHN0cmluZ1tdIHtcbiAgICAgICAgaWYgKCF0aGlzLm5vd1BsYXlpbmdRdWV1ZSB8fCB0aGlzLm5vd1BsYXlpbmdRdWV1ZS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBbXVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgYWxsSXRlbXNCeUlkID0gbmV3IFNldDxzdHJpbmc+KHRoaXMuYWxsTG9hZGVkSXRlbXMubWFwKGl0ZW0gPT4gaXRlbS5JZCkpXG4gICAgICAgIHJldHVybiB0aGlzLm5vd1BsYXlpbmdRdWV1ZS5maWx0ZXIocXVldWVJdGVtSWQgPT4gIWFsbEl0ZW1zQnlJZC5oYXMocXVldWVJdGVtSWQpKVxuICAgIH1cblxuICAgIHB1YmxpYyBtZXJnZVF1ZXVlSXRlbXMoaXRlbXM6IEJhc2VJdGVtW10pOiB2b2lkIHtcbiAgICAgICAgaWYgKCFpdGVtcyB8fCBpdGVtcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZXhpc3RpbmdRdWV1ZUl0ZW1zQnlJZCA9IG5ldyBNYXA8c3RyaW5nLCBCYXNlSXRlbT4odGhpcy5fcHJvZ3JhbURhdGEucXVldWVJdGVtcy5tYXAoaXRlbSA9PiBbaXRlbS5JZCwgaXRlbV0pKVxuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgaXRlbXMpIHtcbiAgICAgICAgICAgIGV4aXN0aW5nUXVldWVJdGVtc0J5SWQuc2V0KGl0ZW0uSWQsIGl0ZW0pXG4gICAgICAgICAgICBjb25zdCBleGlzdGluZ0l0ZW0gPSB0aGlzLmdldEl0ZW1CeUlkKGl0ZW0uSWQpXG4gICAgICAgICAgICBpZiAoZXhpc3RpbmdJdGVtKSB7XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVJdGVtKHtcbiAgICAgICAgICAgICAgICAgICAgLi4uZXhpc3RpbmdJdGVtLFxuICAgICAgICAgICAgICAgICAgICAuLi5pdGVtXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3Byb2dyYW1EYXRhLnF1ZXVlSXRlbXMgPSBBcnJheS5mcm9tKGV4aXN0aW5nUXVldWVJdGVtc0J5SWQudmFsdWVzKCkpXG4gICAgfVxuXG4gICAgcHVibGljIGdldEl0ZW1CeUlkKGl0ZW1JZDogc3RyaW5nKTogQmFzZUl0ZW0ge1xuICAgICAgICBzd2l0Y2ggKHRoaXMudHlwZSkge1xuICAgICAgICAgICAgY2FzZSBJdGVtVHlwZS5TZXJpZXM6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2Vhc29uc1xuICAgICAgICAgICAgICAgICAgICAuZmxhdE1hcChzZWFzb24gPT4gc2Vhc29uLmVwaXNvZGVzKVxuICAgICAgICAgICAgICAgICAgICAuZmluZChlcGlzb2RlID0+IGVwaXNvZGUuSWQgPT09IGl0ZW1JZClcbiAgICAgICAgICAgICAgICAgICAgPz8gdGhpcy5fcHJvZ3JhbURhdGEucXVldWVJdGVtcy5maW5kKGl0ZW0gPT4gaXRlbS5JZCA9PT0gaXRlbUlkKVxuICAgICAgICAgICAgY2FzZSBJdGVtVHlwZS5Cb3hTZXQ6XG4gICAgICAgICAgICBjYXNlIEl0ZW1UeXBlLk1vdmllOlxuICAgICAgICAgICAgY2FzZSBJdGVtVHlwZS5Gb2xkZXI6XG4gICAgICAgICAgICBjYXNlIEl0ZW1UeXBlLlZpZGVvOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm1vdmllcy5maW5kKG1vdmllID0+IG1vdmllLklkID09PSBpdGVtSWQpXG4gICAgICAgICAgICAgICAgICAgID8/IHRoaXMuX3Byb2dyYW1EYXRhLnF1ZXVlSXRlbXMuZmluZChpdGVtID0+IGl0ZW0uSWQgPT09IGl0ZW1JZClcbiAgICAgICAgICAgIGRlZmF1bHQ6IFxuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyB1cGRhdGVJdGVtKGl0ZW1Ub1VwZGF0ZTogQmFzZUl0ZW0pOiB2b2lkIHtcbiAgICAgICAgc3dpdGNoICh0aGlzLnR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgSXRlbVR5cGUuU2VyaWVzOiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNlYXNvbjogU2Vhc29uID0gdGhpcy5zZWFzb25zLmZpbmQoc2Vhc29uID0+IHNlYXNvbi5zZWFzb25JZCA9PT0gaXRlbVRvVXBkYXRlLlNlYXNvbklkKVxuICAgICAgICAgICAgICAgICAgICBpZiAoIXNlYXNvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbURhdGEucXVldWVJdGVtcyA9IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi50aGlzLl9wcm9ncmFtRGF0YS5xdWV1ZUl0ZW1zLmZpbHRlcihpdGVtID0+IGl0ZW0uSWQgIT09IGl0ZW1Ub1VwZGF0ZS5JZCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbVRvVXBkYXRlXG4gICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2Vhc29ucyA9IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLiB0aGlzLnNlYXNvbnMuZmlsdGVyKHNlYXNvbiA9PiBzZWFzb24uc2Vhc29uSWQgIT09IGl0ZW1Ub1VwZGF0ZS5TZWFzb25JZCksIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi5zZWFzb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXBpc29kZXM6IFsuLi4gc2Vhc29uLmVwaXNvZGVzLmZpbHRlcihlcGlzb2RlID0+IGVwaXNvZGUuSWQgIT09IGl0ZW1Ub1VwZGF0ZS5JZCksIGl0ZW1Ub1VwZGF0ZV1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSBJdGVtVHlwZS5Cb3hTZXQ6XG4gICAgICAgICAgICBjYXNlIEl0ZW1UeXBlLk1vdmllOlxuICAgICAgICAgICAgY2FzZSBJdGVtVHlwZS5Gb2xkZXI6XG4gICAgICAgICAgICBjYXNlIEl0ZW1UeXBlLlZpZGVvOlxuICAgICAgICAgICAgICAgIHRoaXMubW92aWVzID0gWy4uLiB0aGlzLm1vdmllcy5maWx0ZXIobW92aWUgPT4gbW92aWUuSWQgIT09IGl0ZW1Ub1VwZGF0ZS5JZCksIGl0ZW1Ub1VwZGF0ZV1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHNob3VsZFRyYWNrSW5RdWV1ZUl0ZW1zID0gdGhpcy5fcHJvZ3JhbURhdGEubm93UGxheWluZ1F1ZXVlLmluY2x1ZGVzKGl0ZW1Ub1VwZGF0ZS5JZClcbiAgICAgICAgICAgIHx8IHRoaXMuX3Byb2dyYW1EYXRhLnF1ZXVlSXRlbXMuc29tZShpdGVtID0+IGl0ZW0uSWQgPT09IGl0ZW1Ub1VwZGF0ZS5JZClcblxuICAgICAgICBpZiAoc2hvdWxkVHJhY2tJblF1ZXVlSXRlbXMpIHtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW1EYXRhLnF1ZXVlSXRlbXMgPSBbXG4gICAgICAgICAgICAgICAgLi4udGhpcy5fcHJvZ3JhbURhdGEucXVldWVJdGVtcy5maWx0ZXIoaXRlbSA9PiBpdGVtLklkICE9PSBpdGVtVG9VcGRhdGUuSWQpLFxuICAgICAgICAgICAgICAgIGl0ZW1Ub1VwZGF0ZVxuICAgICAgICAgICAgXVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXQgYWxsTG9hZGVkSXRlbXMoKTogQmFzZUl0ZW1bXSB7XG4gICAgICAgIGNvbnN0IGJhc2VJdGVtcyA9IHRoaXMudHlwZSA9PT0gSXRlbVR5cGUuU2VyaWVzXG4gICAgICAgICAgICA/IHRoaXMuc2Vhc29ucy5mbGF0TWFwKHNlYXNvbiA9PiBzZWFzb24uZXBpc29kZXMpXG4gICAgICAgICAgICA6IHRoaXMubW92aWVzXG5cbiAgICAgICAgY29uc3QgYWxsSXRlbXNCeUlkID0gbmV3IE1hcDxzdHJpbmcsIEJhc2VJdGVtPihiYXNlSXRlbXMubWFwKGl0ZW0gPT4gW2l0ZW0uSWQsIGl0ZW1dKSlcbiAgICAgICAgdGhpcy5fcHJvZ3JhbURhdGEucXVldWVJdGVtcy5mb3JFYWNoKGl0ZW0gPT4gYWxsSXRlbXNCeUlkLnNldChpdGVtLklkLCBpdGVtKSlcbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20oYWxsSXRlbXNCeUlkLnZhbHVlcygpKVxuICAgIH1cbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJpbXBvcnQge0xvZ2dlcn0gZnJvbSBcIi4vU2VydmljZXMvTG9nZ2VyXCI7XG5pbXBvcnQge0F1dGhTZXJ2aWNlfSBmcm9tIFwiLi9TZXJ2aWNlcy9BdXRoU2VydmljZVwiO1xuaW1wb3J0IHtQcmV2aWV3QnV0dG9uVGVtcGxhdGV9IGZyb20gXCIuL0NvbXBvbmVudHMvUHJldmlld0J1dHRvblRlbXBsYXRlXCI7XG5pbXBvcnQge1Byb2dyYW1EYXRhU3RvcmV9IGZyb20gXCIuL1NlcnZpY2VzL1Byb2dyYW1EYXRhU3RvcmVcIjtcbmltcG9ydCB7RGlhbG9nQ29udGFpbmVyVGVtcGxhdGV9IGZyb20gXCIuL0NvbXBvbmVudHMvRGlhbG9nQ29udGFpbmVyVGVtcGxhdGVcIjtcbmltcG9ydCB7UGxheWJhY2tIYW5kbGVyfSBmcm9tIFwiLi9TZXJ2aWNlcy9QbGF5YmFja0hhbmRsZXJcIjtcbmltcG9ydCB7TGlzdEVsZW1lbnRGYWN0b3J5fSBmcm9tIFwiLi9MaXN0RWxlbWVudEZhY3RvcnlcIjtcbmltcG9ydCB7UG9wdXBUaXRsZVRlbXBsYXRlfSBmcm9tIFwiLi9Db21wb25lbnRzL1BvcHVwVGl0bGVUZW1wbGF0ZVwiO1xuaW1wb3J0IHtEYXRhRmV0Y2hlcn0gZnJvbSBcIi4vU2VydmljZXMvRGF0YUZldGNoZXJcIjtcbmltcG9ydCB7SXRlbVR5cGV9IGZyb20gXCIuL01vZGVscy9JdGVtVHlwZVwiO1xuaW1wb3J0IHsgUGx1Z2luU2V0dGluZ3MgfSBmcm9tIFwiLi9Nb2RlbHMvUGx1Z2luU2V0dGluZ3NcIjtcbmltcG9ydCB7U2VydmVyU2V0dGluZ3N9IGZyb20gXCIuL01vZGVscy9TZXJ2ZXJTZXR0aW5nc1wiO1xuaW1wb3J0IHtFbmRwb2ludHN9IGZyb20gXCIuL0VuZHBvaW50c1wiO1xuXG4vLyBsb2FkIGFuZCBpbmplY3QgaW5QbGF5ZXJQcmV2aWV3LmNzcyBpbnRvIHRoZSBwYWdlXG4vKlxuICogSW5qZWN0IHN0eWxlIHRvIGJlIHVzZWQgZm9yIHRoZSBwcmV2aWV3IHBvcHVwXG4gKi9cbmxldCBpblBsYXllclByZXZpZXdTdHlsZTogSFRNTFN0eWxlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJylcbmluUGxheWVyUHJldmlld1N0eWxlLmlkID0gJ2luUGxheWVyUHJldmlld1N0eWxlJ1xuaW5QbGF5ZXJQcmV2aWV3U3R5bGUudGV4dENvbnRlbnQgPSBgXG4uc2VsZWN0ZWRMaXN0SXRlbSB7XG4gICAgaGVpZ2h0OiBhdXRvO1xufVxuLnByZXZpZXdMaXN0SXRlbSB7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjsgXG4gICAgYWxpZ24taXRlbXM6IGZsZXgtc3RhcnQ7XG59XG4ucHJldmlld0xpc3RJdGVtQ29udGVudCB7XG4gICAgd2lkdGg6IDEwMCU7IFxuICAgIG1pbi1oZWlnaHQ6IDE1LjV2aDsgXG4gICAgcG9zaXRpb246IHJlbGF0aXZlOyBcbiAgICBkaXNwbGF5OiBmbGV4OyBcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xufVxuLnByZXZpZXdQb3B1cCB7XG4gICAgYW5pbWF0aW9uOiAxNDBtcyBlYXNlLW91dCAwcyAxIG5vcm1hbCBib3RoIHJ1bm5pbmcgc2NhbGV1cDsgXG4gICAgcG9zaXRpb246IGZpeGVkOyBcbiAgICBtYXJnaW46IDBweDsgXG4gICAgYm90dG9tOiAxLjV2aDsgXG4gICAgbGVmdDogNTB2dzsgXG4gICAgd2lkdGg6IDQ4dnc7XG59XG4ucHJldmlld1BvcHVwVGl0bGUge1xuICAgIG1heC1oZWlnaHQ6IDR2aDtcbn1cbi5wcmV2aWV3UG9wdXBTY3JvbGxlciB7XG4gICAgbWF4LWhlaWdodDogNjB2aDtcbn1cbi5wcmV2aWV3UXVpY2tBY3Rpb25Db250YWluZXIge1xuICAgIG1hcmdpbi1sZWZ0OiBhdXRvOyBcbiAgICBtYXJnaW4tcmlnaHQ6IDFlbTtcbn1cbi5wcmV2aWV3RXBpc29kZUNvbnRhaW5lciB7XG4gICAgd2lkdGg6IDEwMCU7XG59XG4ucHJldmlld0VwaXNvZGVUaXRsZSB7XG4gICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG59XG4ucHJldmlld0VwaXNvZGVJbWFnZUNhcmQge1xuICAgIG1heC13aWR0aDogMzAlO1xufVxuLnByZXZpZXdFcGlzb2RlRGVzY3JpcHRpb24ge1xuICAgIG1hcmdpbi1sZWZ0OiAwLjVlbTsgXG4gICAgbWFyZ2luLXRvcDogMWVtOyBcbiAgICBtYXJnaW4tcmlnaHQ6IDEuNWVtOyBcbiAgICBkaXNwbGF5OiBibG9jaztcbn1cbi5wcmV2aWV3RXBpc29kZURldGFpbHMge1xuICAgIG1hcmdpbi1sZWZ0OiAxZW07IFxuICAgIGp1c3RpZnktY29udGVudDogc3RhcnQgIWltcG9ydGFudDtcbn1cbi5ibHVyIHtcbiAgICBmaWx0ZXI6IGJsdXIoNnB4KTsgXG4gICAgdHJhbnNpdGlvbjogZmlsdGVyIDAuM3MgZWFzZTsgXG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xufVxuLmJsdXI6aG92ZXIge1xuICAgIGZpbHRlcjogYmx1cigwKTtcbn1cbi5wcmV2aWV3RXBpc29kZUltYWdlQ2FyZDpob3ZlciAuYmx1ciB7XG4gICAgZmlsdGVyOiBibHVyKDApO1xufVxuYFxuZG9jdW1lbnQ/LmhlYWQ/LmFwcGVuZENoaWxkKGluUGxheWVyUHJldmlld1N0eWxlKVxuXG4vLyBpbml0IHNlcnZpY2VzIGFuZCBoZWxwZXJzXG5jb25zdCBsb2dnZXI6IExvZ2dlciA9IG5ldyBMb2dnZXIoKVxuY29uc3QgYXV0aFNlcnZpY2U6IEF1dGhTZXJ2aWNlID0gbmV3IEF1dGhTZXJ2aWNlKClcbmNvbnN0IHByb2dyYW1EYXRhU3RvcmU6IFByb2dyYW1EYXRhU3RvcmUgPSBuZXcgUHJvZ3JhbURhdGFTdG9yZSgpXG5uZXcgRGF0YUZldGNoZXIocHJvZ3JhbURhdGFTdG9yZSwgYXV0aFNlcnZpY2UsIGxvZ2dlcilcbmNvbnN0IHBsYXliYWNrSGFuZGxlcjogUGxheWJhY2tIYW5kbGVyID0gbmV3IFBsYXliYWNrSGFuZGxlcihsb2dnZXIpXG5jb25zdCBsaXN0RWxlbWVudEZhY3RvcnkgPSBuZXcgTGlzdEVsZW1lbnRGYWN0b3J5KHBsYXliYWNrSGFuZGxlciwgcHJvZ3JhbURhdGFTdG9yZSlcblxuZnVuY3Rpb24gaW5pdGlhbGl6ZSgpIHtcbiAgICAvLyBFbnN1cmUgQXBpQ2xpZW50IGV4aXN0cyBhbmQgdXNlciBpcyBsb2dnZWQgaW5cbiAgICBpZiAodHlwZW9mIEFwaUNsaWVudCA9PT0gJ3VuZGVmaW5lZCcgfHwgIUFwaUNsaWVudC5nZXRDdXJyZW50VXNlcklkPy4oKSkge1xuICAgICAgICBzZXRUaW1lb3V0KGluaXRpYWxpemUsIDMwMCkgLy8gSW5jcmVhc2VkIHJldHJ5IGRlbGF5IHNsaWdodGx5XG4gICAgICAgIHJldHVyblxuICAgIH1cblxuICAgIEFwaUNsaWVudC5nZXRQbHVnaW5Db25maWd1cmF0aW9uKCc3MzgzM2Q1Zi0wYmNiLTQ1ZGMtYWI4Yi03Y2U2NjhmNDM0NWQnKVxuICAgICAgICAudGhlbigoY29uZmlnOiBQbHVnaW5TZXR0aW5ncykgPT4gcHJvZ3JhbURhdGFTdG9yZS5wbHVnaW5TZXR0aW5ncyA9IGNvbmZpZylcblxuICAgIGNvbnN0IHNlcnZlclNldHRpbmdzVXJsID0gQXBpQ2xpZW50LmdldFVybChgLyR7RW5kcG9pbnRzLkJBU0V9JHtFbmRwb2ludHMuU0VSVkVSX1NFVFRJTkdTfWApXG4gICAgQXBpQ2xpZW50LmFqYXgoeyB0eXBlOiAnR0VUJywgdXJsOiBzZXJ2ZXJTZXR0aW5nc1VybCwgZGF0YVR5cGU6ICdqc29uJyB9KVxuICAgICAgICAudGhlbigoY29uZmlnOiBTZXJ2ZXJTZXR0aW5ncykgPT4gcHJvZ3JhbURhdGFTdG9yZS5zZXJ2ZXJTZXR0aW5ncyA9IGNvbmZpZylcbn1cbmluaXRpYWxpemUoKVxuXG5jb25zdCB2aWRlb1BhdGhzOiBzdHJpbmdbXSA9IFsnL3ZpZGVvJ11cbmxldCBwcmV2aW91c1JvdXRlUGF0aDogc3RyaW5nID0gbnVsbFxubGV0IHByZXZpZXdDb250YWluZXJMb2FkZWQ6IGJvb2xlYW4gPSBmYWxzZVxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndmlld3Nob3cnLCB2aWV3U2hvd0V2ZW50SGFuZGxlcilcblxuZnVuY3Rpb24gdmlld1Nob3dFdmVudEhhbmRsZXIoKTogdm9pZCB7XG4gICAgY29uc3QgY3VycmVudFJvdXRlUGF0aDogc3RyaW5nID0gZ2V0TG9jYXRpb25QYXRoKClcblxuICAgIGZ1bmN0aW9uIGdldExvY2F0aW9uUGF0aCgpOiBzdHJpbmcge1xuICAgICAgICBjb25zdCBsb2NhdGlvbjogc3RyaW5nID0gd2luZG93LmxvY2F0aW9uLnRvU3RyaW5nKClcbiAgICAgICAgY29uc3QgY3VycmVudFJvdXRlSW5kZXg6IG51bWJlciA9IGxvY2F0aW9uLmxhc3RJbmRleE9mKCcvJylcbiAgICAgICAgcmV0dXJuIGxvY2F0aW9uLnN1YnN0cmluZyhjdXJyZW50Um91dGVJbmRleClcbiAgICB9XG5cbiAgICAvLyBJbml0aWFsIGF0dGVtcHQgdG8gbG9hZCB0aGUgdmlkZW8gdmlldyBvciBzY2hlZHVsZSByZXRyaWVzLlxuICAgIGF0dGVtcHRMb2FkVmlkZW9WaWV3KClcbiAgICBwcmV2aW91c1JvdXRlUGF0aCA9IGN1cnJlbnRSb3V0ZVBhdGhcblxuICAgIC8vIFRoaXMgZnVuY3Rpb24gYXR0ZW1wdHMgdG8gbG9hZCB0aGUgdmlkZW8gdmlldywgcmV0cnlpbmcgdXAgdG8gMyB0aW1lcyBpZiBuZWNlc3NhcnkuXG4gICAgZnVuY3Rpb24gYXR0ZW1wdExvYWRWaWRlb1ZpZXcocmV0cnlDb3VudCA9IDApOiB2b2lkIHtcbiAgICAgICAgaWYgKHZpZGVvUGF0aHMuaW5jbHVkZXMoY3VycmVudFJvdXRlUGF0aCkpIHtcbiAgICAgICAgICAgIGlmIChwcm9ncmFtRGF0YVN0b3JlLmRhdGFJc0FsbG93ZWRGb3JQcmV2aWV3KSB7XG4gICAgICAgICAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIHByZXZpZXcgY29udGFpbmVyIGlzIGFscmVhZHkgbG9hZGVkIGJlZm9yZSBsb2FkaW5nXG4gICAgICAgICAgICAgICAgaWYgKCFwcmV2aWV3Q29udGFpbmVyTG9hZGVkICYmICFpc1ByZXZpZXdCdXR0b25DcmVhdGVkKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgbG9hZFZpZGVvVmlldygpXG4gICAgICAgICAgICAgICAgICAgIHByZXZpZXdDb250YWluZXJMb2FkZWQgPSB0cnVlIC8vIFNldCBmbGFnIHRvIHRydWUgYWZ0ZXIgbG9hZGluZ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAocmV0cnlDb3VudCA8IDMpIHsgLy8gUmV0cnkgdXAgdG8gMyB0aW1lc1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsb2dnZXIuZGVidWcoYFJldHJ5ICMke3JldHJ5Q291bnQgKyAxfWApXG4gICAgICAgICAgICAgICAgICAgIGF0dGVtcHRMb2FkVmlkZW9WaWV3KHJldHJ5Q291bnQgKyAxKVxuICAgICAgICAgICAgICAgIH0sIDEwMDAwKSAvLyBXYWl0IDEwIHNlY29uZHMgZm9yIGVhY2ggcmV0cnlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh2aWRlb1BhdGhzLmluY2x1ZGVzKHByZXZpb3VzUm91dGVQYXRoKSkge1xuICAgICAgICAgICAgdW5sb2FkVmlkZW9WaWV3KClcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBsb2FkVmlkZW9WaWV3KCk6IHZvaWQge1xuICAgICAgICAvLyBhZGQgcHJldmlldyBidXR0b24gdG8gdGhlIHBhZ2VcbiAgICAgICAgY29uc3QgcGFyZW50OiBIVE1MRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idXR0b25zJykubGFzdEVsZW1lbnRDaGlsZC5wYXJlbnRFbGVtZW50OyAvLyBsYXN0RWxlbWVudENoaWxkLnBhcmVudEVsZW1lbnQgaXMgdXNlZCBmb3IgY2FzdGluZyBmcm9tIEVsZW1lbnQgdG8gSFRNTEVsZW1lbnRcbiAgICAgICAgXG4gICAgICAgIGxldCBpbmRleDogbnVtYmVyID0gQXJyYXkuZnJvbShwYXJlbnQuY2hpbGRyZW4pLmZpbmRJbmRleCgoY2hpbGQ6IEVsZW1lbnQpOiBib29sZWFuID0+IGNoaWxkLmNsYXNzTGlzdC5jb250YWlucyhcImJ0blVzZXJSYXRpbmdcIikpO1xuICAgICAgICAvLyBpZiBpbmRleCBpcyBpbnZhbGlkIHRyeSB0byB1c2UgdGhlIG9sZCBwb3NpdGlvbiAodXNlZCBpbiBKZWxseWZpbiAxMC44LjEyKVxuICAgICAgICBpZiAoaW5kZXggPT09IC0xKVxuICAgICAgICAgICAgaW5kZXggPSBBcnJheS5mcm9tKHBhcmVudC5jaGlsZHJlbikuZmluZEluZGV4KChjaGlsZDogRWxlbWVudCk6IGJvb2xlYW4gPT4gY2hpbGQuY2xhc3NMaXN0LmNvbnRhaW5zKFwib3NkVGltZVRleHRcIikpXG5cbiAgICAgICAgY29uc3QgcHJldmlld0J1dHRvbjogUHJldmlld0J1dHRvblRlbXBsYXRlID0gbmV3IFByZXZpZXdCdXR0b25UZW1wbGF0ZShwYXJlbnQsIGluZGV4KVxuICAgICAgICBwcmV2aWV3QnV0dG9uLnJlbmRlcihwcmV2aWV3QnV0dG9uQ2xpY2tIYW5kbGVyKVxuXG4gICAgICAgIGZ1bmN0aW9uIHByZXZpZXdCdXR0b25DbGlja0hhbmRsZXIoKTogdm9pZCB7XG4gICAgICAgICAgICBjb25zdCBkaWFsb2dDb250YWluZXI6IERpYWxvZ0NvbnRhaW5lclRlbXBsYXRlID0gbmV3IERpYWxvZ0NvbnRhaW5lclRlbXBsYXRlKGRvY3VtZW50LmJvZHksIGRvY3VtZW50LmJvZHkuY2hpbGRyZW4ubGVuZ3RoIC0gMSlcbiAgICAgICAgICAgIGRpYWxvZ0NvbnRhaW5lci5yZW5kZXIoKVxuXG4gICAgICAgICAgICBjb25zdCBjb250ZW50RGl2OiBIVE1MRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwb3B1cENvbnRlbnRDb250YWluZXInKVxuICAgICAgICAgICAgY29udGVudERpdi5pbm5lckhUTUwgPSAnJyAvLyByZW1vdmUgb2xkIGNvbnRlbnRcblxuICAgICAgICAgICAgY29uc3QgcG9wdXBUaXRsZTogUG9wdXBUaXRsZVRlbXBsYXRlID0gbmV3IFBvcHVwVGl0bGVUZW1wbGF0ZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncG9wdXBGb2N1c0NvbnRhaW5lcicpLCAtMSwgcHJvZ3JhbURhdGFTdG9yZSlcbiAgICAgICAgICAgIHBvcHVwVGl0bGUucmVuZGVyKChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHBvcHVwVGl0bGUuc2V0VmlzaWJsZShmYWxzZSk7XG4gICAgICAgICAgICAgICAgY29uc3QgY29udGVudERpdjogSFRNTEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncG9wdXBDb250ZW50Q29udGFpbmVyJylcblxuICAgICAgICAgICAgICAgIC8vIGRlbGV0ZSBlcGlzb2RlIGNvbnRlbnQgZm9yIGFsbCBleGlzdGluZyBlcGlzb2RlcyBpbiB0aGUgcHJldmlldyBsaXN0O1xuICAgICAgICAgICAgICAgIGNvbnRlbnREaXYuaW5uZXJIVE1MID0gJydcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBsaXN0RWxlbWVudEZhY3RvcnkuY3JlYXRlU2Vhc29uRWxlbWVudHMocHJvZ3JhbURhdGFTdG9yZS5zZWFzb25zLCBjb250ZW50RGl2LCBwcm9ncmFtRGF0YVN0b3JlLmFjdGl2ZVNlYXNvbj8uSW5kZXhOdW1iZXIgPz8gMCwgcG9wdXBUaXRsZSlcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIHN3aXRjaCAocHJvZ3JhbURhdGFTdG9yZS50eXBlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBJdGVtVHlwZS5TZXJpZXM6XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9ncmFtRGF0YVN0b3JlLmlzU2h1ZmZsZU1vZGUgJiYgcHJvZ3JhbURhdGFTdG9yZS5xdWV1ZU9yZGVyZWRJdGVtcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwb3B1cFRpdGxlLnNldFRleHQoJ05vdyBQbGF5aW5nIFF1ZXVlJylcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvcHVwVGl0bGUuc2V0VmlzaWJsZShwcm9ncmFtRGF0YVN0b3JlLnNlYXNvbnMubGVuZ3RoID4gMSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpc3RFbGVtZW50RmFjdG9yeS5jcmVhdGVFcGlzb2RlRWxlbWVudHMocHJvZ3JhbURhdGFTdG9yZS5xdWV1ZU9yZGVyZWRJdGVtcywgY29udGVudERpdilcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvcHVwVGl0bGUuc2V0VGV4dChwcm9ncmFtRGF0YVN0b3JlLmFjdGl2ZVNlYXNvbj8uc2Vhc29uTmFtZSA/PyAnJylcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvcHVwVGl0bGUuc2V0VmlzaWJsZSh0cnVlKVxuICAgICAgICAgICAgICAgICAgICAgICAgbGlzdEVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVwaXNvZGVFbGVtZW50cyhwcm9ncmFtRGF0YVN0b3JlLmFjdGl2ZVNlYXNvbj8uZXBpc29kZXMgPz8gW10sIGNvbnRlbnREaXYpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICBjYXNlIEl0ZW1UeXBlLk1vdmllOlxuICAgICAgICAgICAgICAgICAgICBwb3B1cFRpdGxlLnNldFRleHQoJycpXG4gICAgICAgICAgICAgICAgICAgIHBvcHVwVGl0bGUuc2V0VmlzaWJsZShmYWxzZSlcbiAgICAgICAgICAgICAgICAgICAgbGlzdEVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVwaXNvZGVFbGVtZW50cyhwcm9ncmFtRGF0YVN0b3JlLm1vdmllcy5maWx0ZXIobW92aWUgPT4gbW92aWUuSWQgPT09IHByb2dyYW1EYXRhU3RvcmUuYWN0aXZlTWVkaWFTb3VyY2VJZCksIGNvbnRlbnREaXYpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgY2FzZSBJdGVtVHlwZS5WaWRlbzpcbiAgICAgICAgICAgICAgICAgICAgcG9wdXBUaXRsZS5zZXRUZXh0KCcnKVxuICAgICAgICAgICAgICAgICAgICBwb3B1cFRpdGxlLnNldFZpc2libGUoZmFsc2UpXG4gICAgICAgICAgICAgICAgICAgIGxpc3RFbGVtZW50RmFjdG9yeS5jcmVhdGVFcGlzb2RlRWxlbWVudHMocHJvZ3JhbURhdGFTdG9yZS5tb3ZpZXMsIGNvbnRlbnREaXYpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgY2FzZSBJdGVtVHlwZS5Cb3hTZXQ6XG4gICAgICAgICAgICAgICAgY2FzZSBJdGVtVHlwZS5Gb2xkZXI6XG4gICAgICAgICAgICAgICAgICAgIHBvcHVwVGl0bGUuc2V0VGV4dChwcm9ncmFtRGF0YVN0b3JlLmJveFNldE5hbWUpXG4gICAgICAgICAgICAgICAgICAgIHBvcHVwVGl0bGUuc2V0VmlzaWJsZSh0cnVlKVxuICAgICAgICAgICAgICAgICAgICBsaXN0RWxlbWVudEZhY3RvcnkuY3JlYXRlRXBpc29kZUVsZW1lbnRzKHByb2dyYW1EYXRhU3RvcmUubW92aWVzLCBjb250ZW50RGl2KVxuICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBzY3JvbGwgdG8gdGhlIGVwaXNvZGUgdGhhdCBpcyBjdXJyZW50bHkgcGxheWluZ1xuICAgICAgICAgICAgY29uc3QgYWN0aXZlSXRlbSA9IGNvbnRlbnREaXYucXVlcnlTZWxlY3RvcignLnNlbGVjdGVkTGlzdEl0ZW0nKSBcbiAgICAgICAgICAgIGlmICghYWN0aXZlSXRlbSkge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihcIkNvdWxkbid0IGZpbmQgYWN0aXZlIG1lZGlhIHNvdXJjZSBlbGVtZW50IGluIHByZXZpZXcgbGlzdC4gVGhpcyBzaG91bGQgbmV2ZXIgaGFwcGVuXCIsIHByb2dyYW1EYXRhU3RvcmUpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhY3RpdmVJdGVtPy5wYXJlbnRFbGVtZW50LnNjcm9sbEludG9WaWV3KClcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiB1bmxvYWRWaWRlb1ZpZXcoKTogdm9pZCB7XG4gICAgICAgIC8vIENsZWFyIG9sZCBkYXRhIGFuZCByZXNldCBwcmV2aWV3Q29udGFpbmVyTG9hZGVkIGZsYWdcbiAgICAgICAgYXV0aFNlcnZpY2Uuc2V0QXV0aEhlYWRlclZhbHVlKFwiXCIpXG5cbiAgICAgICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGlhbG9nQmFja2Ryb3BDb250YWluZXJcIikpXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGlhbG9nQmFja2Ryb3BDb250YWluZXJcIikpXG4gICAgICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRpYWxvZ0NvbnRhaW5lclwiKSlcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkaWFsb2dDb250YWluZXJcIikpXG4gICAgICAgIFxuICAgICAgICBwcmV2aWV3Q29udGFpbmVyTG9hZGVkID0gZmFsc2UgLy8gUmVzZXQgZmxhZyB3aGVuIHVubG9hZGluZ1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBpc1ByZXZpZXdCdXR0b25DcmVhdGVkKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJ1dHRvbnMnKS5xdWVyeVNlbGVjdG9yKCcjcG9wdXBQcmV2aWV3QnV0dG9uJykgIT09IG51bGxcbiAgICB9XG59XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=