'use strict';

const Jii = require('jii');
const Controller = require('jii/base/Controller');
const AdvertSearch = require('../../advert/forms/AdvertSearch');
const BaseRealty = require('../../advert/models/BaseRealty');
const Pagination = require('jii-model/data/Pagination');
const CurrencyType = require('../../core/enums/CurrencyType');
const DatePublishedType  = require('../../search/enums/DatePublishedType');

/**
 * @class app.advert.controllers.AdvertController
 * @extends Jii.base.Controller
 */
const AdvertController = Jii.defineClass('app.advert.controllers.AdvertController', /** @lends app.advert.controllers.AdvertController.prototype */{

    __extends: Controller,

    // @todo use class instance attributes instead of static properties when Jii Module createController is fixed
    __static: {
        _staticAdvertSearch: null,
        _staticAdvertDataProvider: null
    },

    /**
     *
     * @param {Jii.base.Context} context
     * @return {Promise}
     */
    actionUpdate(context) {
        const collection = Jii.app.db.getRootCollection(BaseRealty);
        const queryParams = context.request.get();

        const advertUid = queryParams.advertUid;
        delete queryParams.advertUid;
        this.getAdvertSearch().setUrlQuery(queryParams);

        return Promise.resolve()
            .then(() => {
                if(!advertUid){
                    return null;
                }
                if(context.params.model.advert.uid == advertUid){
                    return context.params.model;
                }
                return collection.find((baseRealtyRecord) => baseRealtyRecord.get('advert').get('uid') == advertUid) ||
                    Jii.app.rpc.send('advert/advert/api-get', {advertUid: advertUid })
                        .then(response => {
                            return collection.createModel(response);
                        });
            })
            .then(advertModel => {
                return new Promise(resolve => {
                    require.ensure([], () => {
                        resolve(
                            this.render(
                                require('../views/advert/update'),
                                context,
                                {
                                    model: advertModel,
                                    address: context.params.address,
                                    backUrl: context.params.backUrl
                                }
                            )
                        );
                    });
                });
            });

    },

    actionMyAdverts(context){
        const request = context.request.get();
        this.getAdvertSearch().setUrlQuery(request);

        return new Promise(resolve => {
            require.ensure([], () => {
                resolve(
                    this.render(
                        require('../views/advert/myAdverts'),
                        context,
                        {
                            advertDataProvider: this.getAdvertDataProvider(context),
                            advertSearch: this.getAdvertSearch(),
                        }
                    )
                );
            });
        });
    },

    /**
     * @returns {AdvertSearch}
     */
    getAdvertSearch() {
        if (this.__static._staticAdvertSearch === null) {
            this.__static._staticAdvertSearch = new AdvertSearch({
                searchCurrencyCode: CurrencyType.DEFAULT,
                datePublished: DatePublishedType.ANYTIME,
                showMap: false,
                userId: Jii.app.getModule('profile').user ? Jii.app.getModule('profile').user.id : null
            });
        }

        return this.__static._staticAdvertSearch;
    },

    /**
     * @param {Jii.base.Context} context
     * @returns {Jii.base.DataProvider}
     */
    getAdvertDataProvider(context) {
        const modelNotExistBegin = this.__static._staticAdvertDataProvider === null;

        if (modelNotExistBegin) {
            const collection = Jii.app.db.getRootCollection(BaseRealty);
            this.__static._staticAdvertDataProvider = collection.createDataProvider({
                models: collection.getModels(),
                totalCount: context.params.totalCount || null,
                pagination: { mode: Pagination.MODE_LOAD_MORE },
                query: (pagination) => Jii.app.rpc.send('advert/advert/api-search-my-adverts', { pagination: pagination})
            });
        }

        const pagination = this.__static._staticAdvertDataProvider.getPagination();

        if(!modelNotExistBegin || pagination.getContext() !== context && !context.params.totalCount) {
            pagination.setContext(context);
            this.__static._staticAdvertDataProvider.reset([]);
            this.__static._staticAdvertDataProvider.fetch(true);
        }

        pagination.setPage(parseInt(context.request.get()['page']) || 0);

        return this.__static._staticAdvertDataProvider;
    }
});

module.exports = AdvertController;