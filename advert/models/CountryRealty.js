'use strict';

var Jii = require('jii');

var BaseRealty = require('./BaseRealty');
var AvailabilityThingsType = require('../enums/AvailabilityThingsType');


/**
 * @class app.advert.models.CountryRealty
 * @extends BaseRealty
 */
module.exports = Jii.defineClass('app.advert.models.CountryRealty', /** @lends app.advert.models.CountryRealty.prototype */{

    __extends: BaseRealty,

    __static: /** @lends app.advert.models.CountryRealty */{

        tableName() {
            return 'adverts_realty_country';
        },

        modelSchema: function () {
            return {
                primaryKey: ['advertId'],
                columns: {
                    id: 'number',
                    advertId: {
                        jsType: 'number',
                        isPrimaryKey: true
                    },
                    areaSizePlat: 'number',
                    countBedroom: 'number',

                    heatingType: 'string',

                    bath: 'boolean',
                    canal: 'boolean',
                    electricity: 'boolean',
                    garage: 'boolean',
                    gas: 'boolean',
                    pool: 'boolean',
                    water: 'boolean',
                }
            };
        }
    },

    init(){
        this.getData = this.getData.bind(this);
        this.getDataCommonInfo = this.getDataCommonInfo.bind(this);
    },

    rules() {
        return [
            [['countBedroom', 'areaSizePlat', 'id', 'advertId'], 'number', {min: 0}],
            [['heatingType'], 'string'],
            [AvailabilityThingsType.getKeys(), 'boolean'],
            ['advert', 'safe']
        ];
    },

    attributeLabels() {
        return {
            countBedroom: Jii.t('app', 'Bedrooms count'),
            heatingType: Jii.t('app', 'Heating'),
            areaSizePlat: Jii.t('app', 'Plot size'),
            bath: Jii.t('app', 'bath'),
            canal: Jii.t('app', 'canal'),
            electricity: Jii.t('app', 'electricity'),
            garage: Jii.t('app', 'garage'),
            gas: Jii.t('app', 'gas'),
            pool: Jii.t('app', 'pool'),
            water: Jii.t('app', 'water'),
        };
    }


});
