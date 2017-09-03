'use strict';

var Jii = require('jii');

var ActiveRecord = require('jii-model/base/BaseActiveRecord');

// Rent
const LIVING_RENT_1ROOM = 'livingRent1Room';
const LIVING_RENT_2ROOM = 'livingRent2Room';
const LIVING_RENT_3ROOM = 'livingRent3Room';
const COUNTRY_RENT_HOUSE = 'countryRentHouse';
const LIVING_RENT_ROOM = 'livingRentRoom';
const LIVING_RENT_STUDIO = 'livingRentStudio';
const COMMERCIAL_RENT = 'commercialRent';

// Buy
const LIVING_BUY_1ROOM = 'livingBuy1Room';
const LIVING_BUY_2ROOM = 'livingBuy2Room';
const LIVING_BUY_3ROOM = 'livingBuy3Room';
const COUNTRY_BUY_HOUSE = 'countryBuyHouse';
const LIVING_BUY_ROOM = 'livingBuyRoom';
const COUNTRY_BUY_TOWNHOUSE = 'countryBuyTownhouse';
const LIVING_BUY_FLAT_NEW = 'livingBuyFlatNew';
const COMMERCIAL_BUY_GARAGE = 'commercialBuyGarage';
const COMMERCIAL_BUY = 'commercialBuy';
const COUNTRY_BUY_PLAT = 'countryBuyPlat';

// New buildings
const LIVING_BUY_NEW_1ROOM = 'livingBuyNew1Room';
const LIVING_BUY_NEW_2ROOM = 'livingBuyNew2Room';
const LIVING_BUY_NEW_3ROOM = 'livingBuyNew3Room';
const LIVING_BUY_NEW_BUILDERS = 'livingBuyNewBuilders';

// Daily
const LIVING_SHORT_FLAT = 'livingShortFlat';
const COUNTRY_SHORT_HOUSE = 'countryShortHouse';
const LIVING_SHORT_ROOM = 'countryShortRoom';
const LIVING_SHORT_1ROOM = 'countryShort1Room';
const LIVING_SHORT_2ROOM = 'countryShort2Room';
const LIVING_SHORT_3ROOM = 'countryShort3Room';

// Commercial
const COMMERCIAL_LONG_OFFICE = 'commercialLongOffice';
const COMMERCIAL_BUY_OFFICE = 'commercialBuyOffice';
const COMMERCIAL_LONG_WAREHOUSE = 'commercialLongWarehouse';
const COMMERCIAL_BUY_WAREHOUSE = 'commercialBuyWarehouse';
const COMMERCIAL_LONG_TRADE_PLAT = 'commercialLongTradeplat';
const COMMERCIAL_BUY_TRADE_PLAT = 'commercialBuyTradeplat';
const COMMERCIAL_LONG_PRODUCTION = 'commercialLongProduction';
const COMMERCIAL_BUY_PRODUCTION = 'commercialBuyProduction';
const COMMERCIAL_LONG_BUILDING = 'commercialLongBuilding';
const COMMERCIAL_BUY_BUILDING = 'commercialBuyBuilding';
const COMMERCIAL_LONG_FREE_APPOINTMENT = 'commercialLongFree';
const COMMERCIAL_BUY_FREE_APPOINTMENT = 'commercialBuyFree';
const COMMERCIAL_LONG_BUSINESS = 'commercialLongBusiness';
const COMMERCIAL_BUY_BUSINESS = 'commercialBuyBusiness';

/**
 * @class app.advert.models.AdvertSummary
 * @extends ActiveRecord
 */
module.exports = Jii.defineClass('app.advert.models.AdvertSummary', /** @lends app.advert.models.AdvertSummary.prototype */{

    __extends: ActiveRecord,

    __static: /** @lends module.exports */{

        LIVING_RENT_1ROOM: LIVING_RENT_1ROOM,
        LIVING_RENT_2ROOM: LIVING_RENT_2ROOM,
        LIVING_RENT_3ROOM: LIVING_RENT_3ROOM,
        COUNTRY_RENT_HOUSE: COUNTRY_RENT_HOUSE,
        LIVING_RENT_ROOM: LIVING_RENT_ROOM,
        LIVING_RENT_STUDIO: LIVING_RENT_STUDIO,
        COMMERCIAL_RENT: COMMERCIAL_RENT,

        LIVING_BUY_1ROOM: LIVING_BUY_1ROOM,
        LIVING_BUY_2ROOM: LIVING_BUY_2ROOM,
        LIVING_BUY_3ROOM: LIVING_BUY_3ROOM,
        COUNTRY_BUY_HOUSE: COUNTRY_BUY_HOUSE,
        LIVING_BUY_ROOM: LIVING_BUY_ROOM,
        COUNTRY_BUY_TOWNHOUSE: COUNTRY_BUY_TOWNHOUSE,
        LIVING_BUY_FLAT_NEW: LIVING_BUY_FLAT_NEW,
        COMMERCIAL_BUY_GARAGE: COMMERCIAL_BUY_GARAGE,
        COMMERCIAL_BUY: COMMERCIAL_BUY,
        COUNTRY_BUY_PLAT: COUNTRY_BUY_PLAT,

        LIVING_BUY_NEW_1ROOM: LIVING_BUY_NEW_1ROOM,
        LIVING_BUY_NEW_2ROOM: LIVING_BUY_NEW_2ROOM,
        LIVING_BUY_NEW_3ROOM: LIVING_BUY_NEW_3ROOM,
        LIVING_BUY_NEW_BUILDERS: LIVING_BUY_NEW_BUILDERS,

        LIVING_SHORT_FLAT: LIVING_SHORT_FLAT,
        COUNTRY_SHORT_HOUSE: COUNTRY_SHORT_HOUSE,
        LIVING_SHORT_ROOM: LIVING_SHORT_ROOM,
        LIVING_SHORT_1ROOM: LIVING_SHORT_1ROOM,
        LIVING_SHORT_2ROOM: LIVING_SHORT_2ROOM,
        LIVING_SHORT_3ROOM: LIVING_SHORT_3ROOM,

        COMMERCIAL_LONG_OFFICE: COMMERCIAL_LONG_OFFICE,
        COMMERCIAL_BUY_OFFICE: COMMERCIAL_BUY_OFFICE,
        COMMERCIAL_LONG_WAREHOUSE: COMMERCIAL_LONG_WAREHOUSE,
        COMMERCIAL_BUY_WAREHOUSE: COMMERCIAL_BUY_WAREHOUSE,
        COMMERCIAL_LONG_TRADE_PLAT: COMMERCIAL_LONG_TRADE_PLAT,
        COMMERCIAL_BUY_TRADE_PLAT: COMMERCIAL_BUY_TRADE_PLAT,
        COMMERCIAL_LONG_PRODUCTION: COMMERCIAL_LONG_PRODUCTION,
        COMMERCIAL_BUY_PRODUCTION: COMMERCIAL_BUY_PRODUCTION,
        COMMERCIAL_LONG_BUILDING: COMMERCIAL_LONG_BUILDING,
        COMMERCIAL_BUY_BUILDING: COMMERCIAL_BUY_BUILDING,
        COMMERCIAL_LONG_FREE_APPOINTMENT: COMMERCIAL_LONG_FREE_APPOINTMENT,
        COMMERCIAL_BUY_FREE_APPOINTMENT: COMMERCIAL_BUY_FREE_APPOINTMENT,
        COMMERCIAL_LONG_BUSINESS: COMMERCIAL_LONG_BUSINESS,
        COMMERCIAL_BUY_BUSINESS: COMMERCIAL_BUY_BUSINESS,

        tableName() {
            return 'adverts_summary';
        },

        modelSchema: function () {
            return {
                primaryKey: ['groupName', 'cityId'],
                columns: {
                    groupName: {
                        jsType: 'number',
                        isPrimaryKey: true
                    },
                    advertId: {
                        jsType: 'number',
                        isPrimaryKey: true
                    },
                    cityId: 'string',
                    advertCount: 'number',
                }
            };
        }

    },

    rules() {
        return [
            ['advertCount', 'number', {min: 0}],
            [['groupName', 'cityId'], 'string'],
            [['mortgage_possible', 'window_to_street', 'window_to_yard', 'fromBuilder'], 'boolean'],
        ];
    },

    attributeLabels() {
        return {
            groupName: Jii.t('app', 'Group name'),
            cityId: Jii.t('app', 'Place ID'),
            advertCount: Jii.t('app', 'From the developer'),
        };
    }


});
