'use strict';

const Jii = require('jii');
const React = require('react');
const LayoutView = require('../../../core/layouts/web_general');
const OperationType = require('../../enums/OperationType');
const RealtyCategory = require('../../enums/RealtyCategory');
const PhoneCollapsible = require('../../../core/widgets/PhoneCollapsible/PhoneCollapsible');
const RealtyType = require('../../enums/RealtyType');
const RealtyRoomType = require('../../enums/RealtyRoomType');
const CurrencyType = require('../../../core/enums/CurrencyType');
const Helper = require('../../../core/base/Helper');
const UserRealtyRole = require('../../../profile/enums/UserRealtyRole');
const RealtyMenuItems = require('../../../search/enums/RealtyMenuItems');
const EmailValidator = require('jii-model/validators/EmailValidator');
const ImageGallery = require('react-image-gallery').default;
const moment = require('moment');

require('./AdvertFull.less');

/**
 * @class app.advert.widgets.advertFull.AdvertFullWidget
 * @extends Jii.view.react.ReactView
 */
module.exports = Jii.defineClass('app.advert.widgets.advertFull.AdvertFullWidget', /** @lends app.advert.widgets.advertFull.AdvertFullWidget.prototype */{

    __extends: LayoutView,

    __static: {

        /**
         * @alias {app.advert.widgets.advertFull.AdvertFullWidget.prototype.props}
         */
        defaultProps: {
            linksBreadcrumbs: [],
            backUrl: null
        },

        refs: {
            favoriteIcon: null,
            watchPriceInput: null,
        }
    },

    state: {
        watchChangePriceEmail: null,
        watchChangePriceModalType: 'subscribe',
        watchEmailError: true
    },

    init(){
        this.__super();
        this.renderDeveloperCategoryFlat = this.renderDeveloperCategoryFlat.bind(this);
        this.onAddFavorite = this.onAddFavorite.bind(this);
        this.urlQuery = {
            'address' : this.props.model.get('advert.address.cityId'),
            'menu' : RealtyMenuItems.getValue(
                this.props.model.get('advert.operationType'),
                this.props.model.get('advert.realtyType')),
            'realtyType' : this.props.model.get('advert.realtyType'),
        };

        const watchChangePrice = Jii.app.getModule('profile').getWatchChangePrice(this.props.model.get('advert.id'));
        this.state.watchChangePriceEmail = watchChangePrice === null ? null : watchChangePrice.email;
        this.state.watchChangePriceModalType = watchChangePrice === null ? 'subscribe' : 'unsubscribe';
    },

    componentWillMount() {
        document.title = this.props.model.get('advert.address.title') + ' - ' + Jii.t('app', 'Cian Spain');
    },

    componentDidMount(){
        window.$('#watchPrice').on('hidden.bs.modal', () =>
            this.setState({
                watchChangePriceModalType: this.state.watchChangePriceModalType == 'unsubscribe-send'
                    ? 'subscribe'
                    : 'unsubscribe'
            })
        );
    },

    clickDeleteAdvert(e){
        if (!confirm('Вы уверены, что хотите удалить этот элемент?')) {
            e.preventDefault();
        }
    },

    onAddFavorite(){
        Jii.app.getModule('profile').addFavorite(this.props.model.get('advert.id'));
        this.forceUpdate();
    },

    isFavorite(){
        return Jii.app.getModule('profile').isFavorite(this.props.model.get('advert.id'));
    },

    renderContent(){
        if(this.props.model.get('advert.realtyType') == RealtyType.FLAT || this.props.model.get('advert.realtyType') == RealtyType.FLAT_NEW){
            this.urlQuery['roomTypes'] = this.props.model.get('roomType');
        }

        return (
            <div className='AdvertFull list'>
                <div className='AdvertFull__container'>
                    <div className='col-sm-6 AdvertFull__left-content'>
                        {this.renderLeftPartContent()}
                    </div>

                    <div className='col-sm-6'>
                        {this.renderRightPartContent()}
                    </div>

                    <iframe
                        className='AdvertFull__map'
                        src={'https://www.google.com/maps/embed/v1/place?q=place_id:' + this.props.model.get('advert.placeId') +
                        '&key=' + window.JII_CONFIG.application.params.mapsEmbedAccessKey}>
                    </iframe>
                    {this.props.model.get('advert.realtyType') === RealtyType.FLAT &&
                    this.renderDeveloperFlats()
                    }
                </div>
            </div>
        );
    },

    renderDeveloperFlats(){
        const developer = this.props.model.get('advert.developer');

        if(developer && developer.get('countFlats') > 1 && developer.get('userType') == UserRealtyRole.ROLE_DEVELOPER) {
            let viewShow = 0;
            const categories = developer.get('flatCategoriesInfo')
                .filter(category => category.count && viewShow++ < 3);

            return (
                <div className='AdvertFull__other-objects'>
                    <div className='col-sm-8 AdvertFull__other-objects-container'>
                        <div className='AdvertFull__other-objects-header'>
                            {Jii.t('app', 'More {count} apartments from the builder', {count: categories.reduce((a, b) => a + b.count, 0)})}
                        </div>
                        <div className='AdvertFull__other-objects-flats'>
                            {categories.map(this.renderDeveloperCategoryFlat)}
                        </div>
                    </div>
                    <div className='col-sm-4 AdvertFull__other-objects-info'>
                        <div className='media'>
                            <div className='media-left'>
                                <a href='#'>
                                    <img
                                        className='media-object AdvertFull__other-objects-img'
                                        src={developer.get('photo').get('miniImageUrl')}
                                    />
                                </a>
                            </div>
                            <div className='media-body'>
                                <a href='/' className='media-heading AdvertFull__other-objects-name'>{developer.get('name')}</a>
                                <div className='AdvertFull__other-objects-count'>
                                    {
                                        Jii.t('app',
                                            '{realtyQuantity} {realtyQuantity, plural, other{Flat}}',
                                            {realtyQuantity: developer.get('countFlats')})
                                    }
                                </div>
                            </div>
                        </div>
                        <div className='AdvertFull__other-objects-description' dangerouslySetInnerHTML={{__html: developer.get('description')}}/>
                        <a href='/' className='AdvertFull__other-objects-link'>
                            {Jii.t('app', 'Read more about the builder')}
                        </a>
                    </div>
                    <div className='clear'></div>
                </div>
            );
        }
        return null;
    },
    renderDeveloperCategoryFlat(flatCategoryInfo, index){
        const priceLengthMin = parseInt(flatCategoryInfo.minPrice).toString().length;

        let pricePostfix = '';
        if(priceLengthMin > 9){
            pricePostfix = Jii.t('app', 'billion');
        }
        else if(priceLengthMin > 6){
            pricePostfix = Jii.t('app', 'million');
        }
        else if(priceLengthMin > 3){
            pricePostfix = Jii.t('app', 'thousand');
        }
        pricePostfix += ' ' + CurrencyType.getShortLabel(flatCategoryInfo.currencyCode);

        return (
            <div className='AdvertFull__other-objects-flat' key={index}>
                <div>
                    {
                        RealtyRoomType.getLabelAdvert(flatCategoryInfo.roomType) +
                        ' ' +
                        Jii.t('app', 'from') +
                        ' ' +
                        flatCategoryInfo.minAreaSize +
                        ' ' +
                        Jii.t('app', 'm')
                    }
                    <sup>2</sup>
                </div>
                <div className='AdvertFull__other-objects-flat-prices'>
                    {
                        this.normalizePrice(flatCategoryInfo.minPrice, priceLengthMin) +
                        '-' +
                        this.normalizePrice(flatCategoryInfo.maxPrice, priceLengthMin) +
                        ' ' +
                        pricePostfix
                    }
                </div>
                <a
                    href={Jii.app.clientRouter.createUrl(
                        [
                            'search/search/search',
                            {
                                userId: this.props.model.get('advert.userId'),
                                realtyType: RealtyType.FLAT,
                                roomTypes: flatCategoryInfo.roomType,
                            }
                        ],
                        false)}
                    className='AdvertFull__other-objects-link'
                >
                    {Jii.t('app',
                        '{realtyQuantity} {realtyQuantity, plural, other{Flat}}',
                        {realtyQuantity: flatCategoryInfo.count})}
                    </a>
            </div>
        );
    },

    normalizePrice(price, priceLengthMin){
        //short price (no more billion)
        if(priceLengthMin > 3) {
            price /= Math.pow(10, Math.min(parseInt((priceLengthMin - 1) / 3) * 3, 9));
        }

        //comma
        price = price.toString().replace('.', ',');

        //no more  2 mark after comma
        if(price.search(',') > -1) {
            price = price.substr(0, price.indexOf(',') + (price.search(',00') == -1 ? 3 : 0));
        }

        return price;
    },

    renderLeftPartContent(){
        const roomType = this.props.model.get('roomType') && RealtyRoomType.getFormatLabel([this.props.model.get('roomType')]) + ' ' || '';
        const descriptionType = roomType +
            RealtyType.getLabel(this.props.model.get('advert.realtyType')).toLowerCase() +
            (this.props.model.get('advert.operationType') != OperationType.BUY ? ' ' + OperationType.getFormLabel(this.props.model.get('advert.operationType')).toLowerCase() : '');

        const currencyCode = CurrencyType.getShortLabel(this.props.model.get('advert.currencyCode'));
        return (
            <span>
                {(this.user && (this.user.id == this.props.model.get('advert.userId') || this.user.role == 'admin')) &&
                    <div className='AdvertFull__control-panel'>
                        <a
                            className='btn btn-success'
                            href={Jii.app.clientRouter.createUrl([
                                '/advert/advert/update',
                                { advertUid: this.props.model.get('advert.uid') }
                            ], false)}
                        >
                            {Jii.t('app', 'Edit advert')}
                        </a>
                        <a
                            className='btn btn-warning'
                            onClick={this.clickDeleteAdvert}
                            href={Jii.app.clientRouter.createUrl([
                                '/advert/advert/delete',
                                {
                                    advertUid: this.props.model.get('advert.uid'),
                                    backUrl: this.props.backUrl
                                }
                            ], false)}
                        >
                            {Jii.t('app', 'Remove advert')}
                        </a>
                        {this.user.role == 'admin' &&
                            <button
                                type='button'
                                className={[
                                    'ButtonCheckbox__button',
                                    'btn',
                                    this.props.model.get('advert.top3') ? 'btn-primary' : 'btn-default'
                                ].join(' ')}
                                onClick={() => {
                                    this.props.model.set('advert.top3', !this.props.model.get('advert.top3'));
                                    Jii.app.rpc.send('advert/advert/api-top3', {advertId: this.props.model.get('advert.id')});
                                    this.forceUpdate();
                                }}
                            >
                                <span
                                    className={'glyphicon ' + (this.props.model.get('advert.top3') ? 'glyphicon-ok' : 'glyphicon-unchecked')}/>
                                &nbsp;
                                {Jii.t('app', 'Top 3')}
                            </button>
                        }
                        <div className='clear'></div>
                    </div>
                }

                <div className='AdvertFull__description-type'>
                    <div
                        className={'AdvertFull__favorite ' + (this.isFavorite() ? 'AdvertFull__favorite_theme-on' : '')}
                        onClick={this.onAddFavorite}
                        ref='favoriteIcon'
                    />
                    {descriptionType}
                </div>

                <h1 className='AdvertFull__address'>{this.props.model.get('advert.address.title')}</h1>

                <div className='AdvertFull__price-box'>
                    <div className='AdvertFull__price'>{this.props.model.get('advert.price') == null ? '' : (Helper.getFormatNumber(this.props.model.get('advert.price')) || this.props.model.get('advert.price')) + ' ' + currencyCode}</div>
                    {this.props.model.get('advert.areaSize') &&
                    <div className='m-advert-short__price-area'>
                        {Math.round(this.props.model.get('advert.price') / this.props.model.get('advert.areaSize')) +
                        ' ' + currencyCode + ' ' + Jii.t('app', 'for') + ' ' + Jii.t('app', 'm')}<sup>2</sup>
                    </div>
                    }
                </div>


                <span
                    className='AdvertFull__link-watch'
                    data-toggle='modal'
                    data-target='#watchPrice'
                >
                    <svg className='AdvertFull__link-watch-icon'>
                        <use href='/images/icons.svg#icon_envelope'/>
                    </svg>
                    <span className='AdvertFull__link-watch-text'>{
                        this.state.watchChangePriceModalType === 'subscribe' || this.state.watchChangePriceModalType === 'unsubscribe-send'
                            ? Jii.t('app', 'Watch the price')
                            : Jii.t('app', 'Cancel subscribe on price')
                    }</span>
                </span>
                {this.renderModalWatchPrice()}


                <div className='AdvertFull__phone-box'>
                    <PhoneCollapsible phoneNumber={this.props.model.get('advert.contactPhone')}/>
                </div>

                {(this.props.model.get('advert.operationType') == OperationType.LONG || this.props.model.get('advert.operationType') == OperationType.SHORT) &&
                    (RealtyType.getRealtyCategory(this.props.model.get('advert.realtyType')) == RealtyCategory.LIVING ||
                    RealtyType.getRealtyCategory(this.props.model.get('advert.realtyType')) == RealtyCategory.COUNTRY) &&

                    <div className='AdvertFull__existing-fhings-block'>
                        <div
                            className='AdvertFull__existing-fhings-header'>{Jii.t('app', 'The apartment has') + ':'}</div>
                        <ul className='AdvertFull__existing-fhings-list'>
                            {this.renderItemsExistingThings()}
                        </ul>
                        <div className='clear'></div>
                    </div>
                }

                    <div className='m-advert-short__description' dangerouslySetInnerHTML={{__html: this.props.model.get('advert.description')}}></div>

                { this.props.model.get('advert.contactPhone') &&
                    <div className='AdvertFull__PhoneCollapsible-box'>
                        <h4>{this.props.model.get('advert.contactName')}</h4>
                        <h5>{this.props.model.get('advert.contactEmail')}</h5>
                        <PhoneCollapsible phoneNumber={this.props.model.get('advert.contactPhone')}/>
                    </div>
                }

                <div className='AdvertFull__links-box'>
                    <span
                        className='AdvertFull__link'
                        onClick={this.onAddFavorite}
                    >
                        {this.isFavorite()
                            ? Jii.t('app', 'Remove from favorites')
                            : Jii.t('app', 'Add to favorites')}
                    </span>
                </div>
            </span>
        );
    },
    renderRightPartContent(){
        const commonInfo = this.props.model.getDataCommonInfo();
        let data = moment(this.props.model.get('advert.createTime')).locale(Jii.app.language);
        data.minutes(data.minutes() + moment().utcOffset());

        return (
            <span>
                <div className='AdvertFull__time'>
                    {data.from(moment())}
                </div>
                {this.props.model.get('advert.photos') && this.props.model.get('advert.photos').length > 0 &&
                this.renderSlider()
                }

                {commonInfo.length > 0 &&
                    <span>
                        <dl className='AdvertFull__common-info-block row'>
                            <dt className='AdvertFull__common-info-label col-sm-5'>{Jii.t('app', 'Common information') + ':'}</dt>
                            <dd className='AdvertFull__item-common-info-value col-sm-7'>&nbsp;</dd>
                            {this.renderItemsInfo(commonInfo)}
                        </dl>
                    </span>
                }
            </span>
        );
    },

    renderModalWatchPrice(){
        return (
            <div className='modal fade' id='watchPrice' role='dialog' aria-labelledby='myModalLabel'>
                <div className='modal-dialog' role='document'>
                    <div className='modal-content'>
                        <div className='modal-body AdvertFull__watch-modal-body'>
                            <button
                                type='button'
                                className='close AdvertFull__watch-modal-close'
                                data-dismiss='modal'
                                aria-label='Close'
                            >
                                <span aria-hidden='true'>&times;</span>
                            </button>
                            <h3 className='modal-title AdvertFull__watch-modal-title'>
                                {this.state.watchChangePriceModalType == 'subscribe' || this.state.watchChangePriceModalType == 'subscribe-send'
                                    ? Jii.t('app', 'Subscription on price change')
                                    : Jii.t('app', 'Cancel subscriptions to price change')
                                }
                            </h3>
                            <span className='AdvertFull__watch-modal-text'>
                                {this.state.watchChangePriceModalType == 'subscribe' || this.state.watchChangePriceModalType == 'subscribe-send'
                                    ? Jii.t('app', 'We will send you an email if the price of the object changes')
                                    : <span>
                                        {Jii.t('app', 'On') + ' '}
                                        <strong>{this.state.watchChangePriceEmail}</strong>
                                        {' ' + Jii.t('app', 'will no longer be receiving letters')}
                                    </span>
                                }
                            </span>

                            <div className='AdvertFull__watch-modal-input-box'>
                                {this.state.watchChangePriceModalType == 'subscribe' &&
                                    <span>
                                        <input
                                            className={[
                                                'AdvertFull__watch-modal-input',
                                                'col-sm-5',
                                                (this.state.watchEmailError ? '' : 'AdvertFull__watch-modal-input_theme_error')
                                            ].join(' ')}
                                            defaultValue={Jii.app.getModule('profile').user ? Jii.app.getModule('profile').user.email : ''}
                                            ref='watchPriceInput'
                                            onChange={(e) => {
                                                if((new EmailValidator()).validateValue(e.target.value) != this.state.watchEmailError){
                                                    this.setState({watchEmailError: !this.state.watchEmailError});
                                                }
                                            }}
                                        />
                                        <div className={[
                                            'AdvertFull__watch-modal-tooltip-error',
                                            'tooltip',
                                            'bottom',
                                            (this.state.watchEmailError ? 'none' : '')
                                        ].join(' ')}>
                                            <div className='tooltip-arrow'></div>
                                            <div className='tooltip-inner'>{Jii.t('app', 'Wrong format email!')}</div>
                                        </div>
                                    </span>
                                }

                                {this.state.watchChangePriceModalType == 'subscribe' || this.state.watchChangePriceModalType == 'unsubscribe'
                                    ?
                                    <button
                                        type='button'
                                        className='btn btn-primary'
                                        onClick={() => {
                                            if(this.state.watchEmailError){
                                                if(this.state.watchChangePriceModalType == 'subscribe') {
                                                    this.state.watchChangePriceEmail = this.refs.watchPriceInput.value;
                                                }

                                                Jii.app.getModule('profile').addWatchChangePrice(this.props.model.get('advert.id'), this.state.watchChangePriceEmail);

                                                this.setState({watchChangePriceModalType: this.state.watchChangePriceModalType + '-send'});
                                            }
                                        }}
                                    >
                                        {
                                            this.state.watchChangePriceModalType == 'subscribe'
                                                ? Jii.t('app', 'Subscribe')
                                                : Jii.t('app', 'Unsubscribe')
                                        }
                                    </button>
                                    :
                                    <div>
                                        <div className='AdvertFull__icon-good'/>
                                        {this.state.watchChangePriceModalType == 'subscribe-send'
                                            ? <span>
                                                {Jii.t('app', 'On') + ' '}
                                                <strong>{this.state.watchChangePriceEmail}</strong>
                                                {' ' + Jii.t('app', 'framed subscribe to price change')}
                                            </span>
                                            : Jii.t('app', 'You have unsubscribed from notifications of change in price of the object')
                                        }
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    },

    renderSlider(){
        const classNameOriginal = 'AdvertFull__slider-img-original';
        let images = this.props.model.get('advert.photos').map(img => {
            return {
                original: img.originalImageUrl,
                thumbnail: img.miniImageUrl,
                originalClass: classNameOriginal,
                thumbnailClass: 'AdvertFull__slider-img-thumbnail',
                sizes: img.width + 'x' + img.height,
                isMain: img.isMain
            };
        });

        return (
            <div className='AdvertFull__slider'>
                <ImageGallery
                    startIndex={images.findIndex(img => img.isMain)}
                    items={images}
                    showBullets={false}
                    slideInterval={2000}
                    slideDuration={500}
                    onScreenChange={isFullScreen => {
                        if(isFullScreen){
                            const heightWindow = window.innerHeight - 100;
                            window.$('.' + classNameOriginal).css('height', heightWindow);

                            window.$('.' + classNameOriginal + ' img').each((index, img) => {
                                const size = window.$(img).attr('sizes').split('x');
                                if(size[1] > heightWindow){
                                    window.$(img).css('height', heightWindow);
                                }
                                else{
                                    window.$(img).css('height', size[1]);
                                    window.$(img).css('transform', 'translateY(' + ((heightWindow - size[1]) / 2) + 'px)');
                                }
                            });
                        }
                        else {
                            window.$('.' + classNameOriginal + ' img').removeAttr('style');
                            window.$('.' + classNameOriginal).removeAttr('style');
                        }
                    }}
                />
            </div>
        );
    },

    renderItemsInfo(values){
        return values.filter(el => el.value).map((el, index) => (
            <div key={index} className='AdvertFull__item-common-info'>
                <dt className='AdvertFull__item-common-info-label col-sm-6'>{el.labelAttribute}:</dt>
                <dd className='AdvertFull__item-common-info-value col-sm-6'>{el.labelValue}</dd>
            </div>
        ));
    },

    renderItemsExistingThings(){
        return this.props.model.getDataAvailabilityThings().filter(el => el.value == 1).map((el, index) => (
            <li key={index} className='AdvertFull__item-existing-thing'>
                <div className={'AdvertFull__item-existing-thing-icon i-icon-offer-' + el.key + ' i-icon'}></div>
                <span className='AdvertFull__item-existing-thing-text'>{el.labelAttribute}</span>
            </li>
        ));
    }
});
