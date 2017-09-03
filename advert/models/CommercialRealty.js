'use strict';

var Jii = require('jii');

var BaseRealty = require('./BaseRealty');
var ContractType = require('../enums/ContractType');
var EntryType = require('../enums/EntryType');
var AvailabilityThingsType = require('../enums/AvailabilityThingsType');

/**
 * @class app.advert.models.CommercialRealty
 * @extends BaseRealty
 */
module.exports = Jii.defineClass('app.advert.models.CommercialRealty', /** @lends app.advert.models.CommercialRealty.prototype */{

    __extends: BaseRealty,

    __static: /** @lends app.advert.models.CommercialRealty */{

        tableName() {
            return 'adverts_realty_commercial';
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

                    countRooms: 'number',
                    countPhoneLine: 'number',

                    contractType: 'string',
                    classBuilding: 'string',
                    entryType: 'string',

                    lift: 'boolean',
                    parking: 'boolean',
                    secure: 'boolean',
                    possibilityExpansionPhoneLines: 'boolean'
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
            [['countRooms', 'countPhoneLine', 'id', 'advertId'], 'number', {min: 0}],
            ['contractType', 'in', {'range': ContractType.getKeys()}],
            ['entryType', 'in', {'range': EntryType.getKeys()}],
            [['lift', 'parking', 'secure', 'possibilityExpansionPhoneLines'].concat(AvailabilityThingsType.getKeys()), 'boolean'],
            [['classBuilding'], 'string'],
            ['advert', 'safe']
        ];
    },

    attributeLabels() {
        return {
            countRooms: Jii.t('app', 'Rooms count'),
            countPhoneLine: Jii.t('app', 'Phone lines count'),
            contractType: Jii.t('app', 'Type contract'),
            classBuilding: Jii.t('app', 'Class building'),
            entryType: Jii.t('app', 'Entry'),
            lift: Jii.t('app', 'lift'),
            parking: Jii.t('app', 'parking'),
            secure: Jii.t('app', 'security'),
            possibilityExpansionPhoneLines: Jii.t('app', 'With the possibility of increasing'), // С возможностью расширения
        };
    }
});
