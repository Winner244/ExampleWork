'use strict';

var Jii = require('jii');
var Enum = require('../../core/base/Enum');
var RealtyCategory = require('./RealtyCategory');
var OperationType = require('./OperationType');
var SectionType = require('./SectionType');
var _each = require('lodash/each');
var _indexOf = require('lodash/indexOf');

const FLAT = 'flat';
const FLAT_NEW = 'flat_new';
const ROOM = 'room';
const SHARE = 'share';
const HOUSE = 'house';
const HOUSE_PART = 'house_part';
const TOWNHOUSE = 'townhouse';
const PLAT = 'plat';
const OFFICE = 'office';
const TRADE_PLAT = 'trade_plat';
const WAREHOUSE = 'warehouse';
const FREE_APPOINTMENT = 'free_appointment';
const FOOD_ROOM = 'food_room';
const GARAGE = 'garage';
const PRODUCTION = 'production';
const CAR_SERVICE = 'car_service';
const BUSINESS = 'business';
const BUILDING = 'building';
const SERVICES = 'services';
const BED = 'bed';

/**
 * @class app.advert.enums.RealtyType
 * @extends app.core.base.Enum
 */
module.exports = Jii.defineClass('app.advert.enums.RealtyType', /** @lends app.advert.enums.RealtyType.prototype */{

    __extends: Enum,

    __static: /** @lends module.exports */{

        FLAT: FLAT,
        FLAT_NEW: FLAT_NEW,
        ROOM: ROOM,
        SHARE: SHARE,
        HOUSE: HOUSE,
        HOUSE_PART: HOUSE_PART,
        TOWNHOUSE: TOWNHOUSE,
        PLAT: PLAT,
        OFFICE: OFFICE,
        TRADE_PLAT: TRADE_PLAT,
        WAREHOUSE: WAREHOUSE,
        FREE_APPOINTMENT: FREE_APPOINTMENT,
        FOOD_ROOM: FOOD_ROOM,
        GARAGE: GARAGE,
        PRODUCTION: PRODUCTION,
        CAR_SERVICE: CAR_SERVICE,
        BUSINESS: BUSINESS,
        BUILDING: BUILDING,
        SERVICES: SERVICES,
        BED: BED,

        _labels: {
            [FLAT]: Jii.t('app', '{realtyQuantity, plural, other{Flat}}', {'realtyQuantity': 1}),
            [FLAT_NEW]: Jii.t('app', '{realtyQuantity, plural, other{Flat in new building}}', {'realtyQuantity': 1}),
            [ROOM]: Jii.t('app', '{realtyQuantity, plural, other{Room}}', {'realtyQuantity': 1}),
            [SHARE]: Jii.t('app', '{realtyQuantity, plural, other{Share}}', {'realtyQuantity': 1}),
            [HOUSE]: Jii.t('app', 'House'),
            [HOUSE_PART]: Jii.t('app', 'Part house'),
            [TOWNHOUSE]: Jii.t('app', 'Townhouse'),
            [PLAT]: Jii.t('app', 'Plat'),
            [OFFICE]: Jii.t('app', 'Office'),
            [TRADE_PLAT]: Jii.t('app', '{realtyQuantity, plural, other{Trade area}}', {'realtyQuantity': 1}),
            [WAREHOUSE]: Jii.t('app', 'Warehouse'),
            [FREE_APPOINTMENT]: Jii.t('app', 'Free appointment'),
            [FOOD_ROOM]: Jii.t('app', 'Public catering'),
            [GARAGE]: Jii.t('app', 'Garage'),
            [PRODUCTION]: Jii.t('app', 'Production'),
            [CAR_SERVICE]: Jii.t('app', 'Car service'),
            [BUSINESS]: Jii.t('app', 'Business'),
            [BUILDING]: Jii.t('app', 'Building'),
            [SERVICES]: Jii.t('app', 'Services'),
            [BED]: Jii.t('app', 'Bed')
        },
        _formLabel: {
            [FLAT]: Jii.t('app', 'Secondary'),
            [FLAT_NEW]: Jii.t('app', 'New building'),
            [FREE_APPOINTMENT]: Jii.t('app', 'SFA'),
        },

        _genitiveCaseLabels: {
            [FLAT]: Jii.t('app', '{realtyQuantity, plural, other{Flat}}', {'realtyQuantity': 0}),
            [FLAT_NEW]: Jii.t('app', '{realtyQuantity, plural, other{Flat in new building}}', {'realtyQuantity': 0}),
            [ROOM]: Jii.t('app', '{realtyQuantity, plural, other{Room}}', {'realtyQuantity': 0}),
            [SHARE]: Jii.t('app', '{realtyQuantity, plural, other{Share}}', {'realtyQuantity': 0}),
            [TRADE_PLAT]: Jii.t('app', '{realtyQuantity, plural, other{Trade area}}', {'realtyQuantity': 0})
        },

        _realtyCategoryGroups: {
            [RealtyCategory.LIVING]: [FLAT, FLAT_NEW, ROOM, SHARE, BED],
            [RealtyCategory.COUNTRY]: [HOUSE, HOUSE_PART, TOWNHOUSE, PLAT],
            [RealtyCategory.COMMERCIAL]: [
                OFFICE, TRADE_PLAT, WAREHOUSE, FOOD_ROOM, FREE_APPOINTMENT, GARAGE,
                PRODUCTION, CAR_SERVICE, BUSINESS, BUILDING, SERVICES
            ]
        },

        _operationTypeGroups: {
            [OperationType.BUY]: [
                FLAT, FLAT_NEW, ROOM, SHARE, HOUSE, HOUSE_PART, TOWNHOUSE, PLAT, OFFICE, TRADE_PLAT, WAREHOUSE,
                FOOD_ROOM, FREE_APPOINTMENT, GARAGE, PRODUCTION, CAR_SERVICE, BUSINESS, BUILDING, SERVICES
            ],
            [OperationType.LONG]: [
                FLAT, ROOM, BED, HOUSE, HOUSE_PART, TOWNHOUSE, OFFICE, TRADE_PLAT, WAREHOUSE, FOOD_ROOM, FREE_APPOINTMENT,
                GARAGE, PRODUCTION, CAR_SERVICE, BUSINESS, BUILDING, SERVICES
            ],
            [OperationType.SHORT]: [FLAT, ROOM, BED, HOUSE]
        },

        _commercialBuildFields: [BUILDING, TRADE_PLAT, OFFICE],
        _existingEntryType: [BUILDING, TRADE_PLAT, OFFICE, WAREHOUSE, PRODUCTION],

        _areaConfigurable: [
            OFFICE, TRADE_PLAT, WAREHOUSE, FOOD_ROOM, FREE_APPOINTMENT, PRODUCTION, CAR_SERVICE, BUILDING, SERVICES, PLAT
        ],

        isCommercialBuildFields(el){
            return this._commercialBuildFields.indexOf(el) !== -1;
        },
        isExistingEntryType(el){
            return this._existingEntryType.indexOf(el) !== -1;
        },

        getGenitiveCaseLabel(realtyTypeId) {
            return this._genitiveCaseLabels[realtyTypeId] || this.getLabel(realtyTypeId);
        },

        getByOperationsType(operationType) {
            return this._operationTypeGroups[operationType] || [];
        },

        getRealtyCategory(realtyTypeId) {
            var targetCategoryId = null;
            _each(this._realtyCategoryGroups, (labelGroup, categoryId) => {
                if (categoryId !== null && _indexOf(labelGroup, realtyTypeId) === -1) {
                    return;
                }

                targetCategoryId = categoryId;
            });

            return targetCategoryId;
        },

        getRealtyTypesByCategory(category){
            return this._realtyCategoryGroups[category] || [];
        },

        getValues(type, operationType) {
            if (type === SectionType.NEW_BUILDING) {
                return [];
            }

            return this.getByOperationsType(operationType).map(realtyTypeId => ({
                value: realtyTypeId,
                label: this.getLabel(realtyTypeId),
                type: RealtyCategory.getLabel(this.getRealtyCategory(realtyTypeId))
            }));
        },

        getDefaultValue(type, operationType, objectType){
            if (type === SectionType.NEW_BUILDING) {
                return null;
            }
            const knownObjectTypes = this.getValues(type, operationType);

            if (objectType && knownObjectTypes.find((t) => t.value === objectType)) {
                return objectType;
            }

            return this.choiceValue(knownObjectTypes, type === 'commercial' ? this._labels[OFFICE] : this._labels[FLAT]);
        },
        choiceValue(values, value){
            if (values.length === 0) {
                return null;
            }

            return values.some(v => v.value === value) ? value : values[0].value;
        },


        /**
         * @param {string} sectionType
         * @param {string} realtyType
         * @return {boolean}
         */
        isAreaConfigurable(sectionType, realtyType) {
            return sectionType === SectionType.NEW_BUILDING ?
                false :
                this._areaConfigurable.indexOf(realtyType) !== -1;
        },

        getFormLabel(id){
            return this._formLabel[id] || this._labels[id] || '';
        }
    }

});
