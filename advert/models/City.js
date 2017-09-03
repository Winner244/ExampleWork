'use strict';

const Jii = require('jii');
const ActiveRecord = require('jii-model/base/BaseActiveRecord');

/**
 * @class app.advert.models.City
 * @extends Jii.sql.ActiveRecord
 */
module.exports = Jii.defineClass('app.advert.models.City', /** @lends app.advert.models.City.prototype */{

    __extends: ActiveRecord,

    __static: /** @lends app.advert.models.City */{

        citiesCache: {},

        tableName() {
            return 'cities';
        },

        modelSchema: function () {
            return {
                primaryKey: ['id'],
                columns: {
                    id: {
                        jsType: 'number',
                        isPrimaryKey: true
                    },
                    placeId: 'string',
                    location: 'string',
                    title: 'string',
                    shortTitle: 'string',
                    lang: 'string',
                    geoipId: 'number',
                }
            };
        },

        /**
         * @param {app.advert.models.City} city
         * @return void
         */
        cacheCity(city) {
            if (city && !this.__static.citiesCache[city.get('placeId')]) {
                this.__static.citiesCache[city.get('placeId')] = city;
            }
        },

        /**
         * @param {string} cityId
         * @return {app.advert.models.City|null}
         */
        getCachedCity(cityId) {
            return this.__static.citiesCache[cityId] || null;
        }

    }

});
