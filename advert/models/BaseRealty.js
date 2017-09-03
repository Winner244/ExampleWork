'use strict';

var Jii = require('jii');
var ActiveRecord = require('jii-model/base/BaseActiveRecord');
var Advert = require('./Advert');
var RealtyCategory = require('../enums/RealtyCategory');
var RealtyType = require('../enums/RealtyType');
var AvailabilityThingsType = require('../enums/AvailabilityThingsType');

/**
 * @class app.advert.models.BaseRealty
 * @extends ActiveRecord
 */
module.exports = Jii.defineClass('app.advert.models.BaseRealty', /** @lends app.advert.models.BaseRealty.prototype */{

    __extends: ActiveRecord,

    __static: /** @lends app.advert.models.BaseRealty */{

        tableName() {
            return 'adverts_base_realty';
        },

        modelSchema: function () {
            return {
                primaryKey: ['advertId'],
                columns: {
                    advertId: {
                        jsType: 'number',
                        isPrimaryKey: true
                    },
                }
            };
        },

        /**
         * @param {object} data row data to be populated into the record.
         * @returns {app.advert.models.BaseRealty} the newly created active record
         */
        instantiate(data) {
            if (data && data.advert.realtyType) {
                const realtyClass = this.getRealtyClassByType(data.advert.realtyType);
                return new realtyClass();
            }
            return new this();
        },

        getRealtyClassByType(type) {
            switch (RealtyType.getRealtyCategory(type)) {
                case RealtyCategory.LIVING:
                    return require('./LivingRealty');
                case RealtyCategory.COUNTRY:
                    return require('./CountryRealty');
                case RealtyCategory.COMMERCIAL:
                    return require('./CommercialRealty');
                default:
                    return this;
            }
        },

    },

    getAdvert: function () {
        return this.hasOne(Advert, {id: 'advertId'});
    },
    getDataCommonInfo(){
        return []
            .concat(this.getData().filter(el => el.key != 'id' && el.key != 'advertId'))
            .concat(this.get('advert').getDataCommonInfo()).filter((el) => {
                return AvailabilityThingsType.getKeys().indexOf(el.key) == -1;
            });
    },
    getDataAvailabilityThings(){
        return [].concat(this.getData()).concat(this.get('advert').getData()).filter((el) => {
            return AvailabilityThingsType.getKeys().indexOf(el.key) != -1;
        });
    },
    getData(){
        var res = [];
        this.attributes().map(el => res.push({
            'key': el,
            'labelAttribute': this.getAttributeLabel(el),
            'labelValue': Advert.getWithEnum(el, this),
            'value': this.get(el)
        }));
        return res;
    },

});
