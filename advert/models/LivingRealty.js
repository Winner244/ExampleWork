'use strict';

var Jii = require('jii');

var BaseRealty = require('./BaseRealty');
var RealtyRoomType = require('../enums/RealtyRoomType');
var FurnishType = require('../enums/FurnishType');
var NewBuildingType = require('../enums/NewBuildingType');
var AvailabilityThingsType = require('../enums/AvailabilityThingsType');

/**
 * @class app.advert.models.LivingRealty
 * @extends BaseRealty
 */
module.exports = Jii.defineClass('app.advert.models.LivingRealty', /** @lends app.advert.models.LivingRealty.prototype */{

    __extends: BaseRealty,

    __static: /** @lends app.advert.models.LivingCategory */{

        tableName() {
            return 'adverts_realty_living';
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
                    areaSizeKitchen: 'number',
                    areaSizeLiving: 'number',
                    countLift: 'number',
                    countBathroom: 'number',

                    roomType: 'string',
                    furnishType: 'string',
                    typeNewBuildings: 'string',
                    stageBuildType: 'string',
                    yearNewBuilding: 'string',

                    balcony: 'boolean',
                    bathtub: 'boolean',
                    big_balcony: 'boolean',
                    cargo_lift: 'boolean',
                    radiator: 'boolean',
                    shower: 'boolean',
                    toilet: 'boolean',
                    trash: 'boolean',
                    loggia: 'boolean',
                    mortgage_possible: 'boolean',
                    window_to_street: 'boolean',
                    window_to_yard: 'boolean',
                    fromBuilder: 'boolean',
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
            [['areaSizeKitchen', 'areaSizeLiving', 'countLift', 'countBathroom', 'id', 'advertId'], 'number', {min: 0}],
            ['roomType', 'in', {'range': RealtyRoomType.getKeys()}],
            ['furnishType', 'in', {'range': FurnishType.getKeys()}],
            ['typeNewBuildings', 'in', {'range': NewBuildingType.getKeys()}],
            [['stageBuildType', 'yearNewBuilding'], 'string'],
            [['mortgage_possible', 'window_to_street', 'window_to_yard', 'fromBuilder'].concat(AvailabilityThingsType.getKeys()), 'boolean'],
            ['advert', 'safe']
        ];
    },

    attributeLabels() {
        return {
            areaSizeKitchen: Jii.t('app', 'Area size kitchen'),
            areaSizeLiving: Jii.t('app', 'Area size living'),
            countLift: Jii.t('app', 'Lifts count'),
            countBathroom: Jii.t('app', 'Bathroom count'),
            yearNewBuilding: Jii.t('app', 'Year of new buildings'), // Год сдачи ЖК
            roomType: Jii.t('app', 'Type rooms'),
            furnishType: Jii.t('app', 'Furnish'),
            typeNewBuildings: Jii.t('app', 'Type new building'),
            stageBuildType: Jii.t('app', 'Stage of construction'),  // Стадия строительства
            big_balcony: Jii.t('app', 'big balcony'),  // Стадия строительства
            cargo_lift: Jii.t('app', 'cargo lift'),  // Стадия строительства
            balcony: Jii.t('app', 'balcony'),
            bathtub: Jii.t('app', 'bathtub'),
            radiator: Jii.t('app', 'radiator'),
            shower: Jii.t('app', 'shower'),
            toilet: Jii.t('app', 'toilet'),
            trash: Jii.t('app', 'trash'),
            loggia: Jii.t('app', 'loggia'),
            mortgage_possible: Jii.t('app', 'Mortgage possible'),
            window_to_street: Jii.t('app', 'In street'),
            window_to_yard: Jii.t('app', 'In yard'),
            fromBuilder: Jii.t('app', 'From the developer'),
        };
    }


});
