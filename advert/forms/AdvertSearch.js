'use strict';

const Jii = require('jii');
const ActiveRecord = require('jii-model/base/BaseActiveRecord');
const OperationType = require('../enums/OperationType');
const RealtyType = require('../enums/RealtyType');
const CurrencyType = require('../../core/enums/CurrencyType');
const DatePublishedType = require('../../search/enums/DatePublishedType');
const RepairType = require('../enums/RepairType');
const BathroomType = require('../enums/BathroomType');
const TenantsType = require('../enums/TenantsType');
const PrepaymentType = require('../enums/PrepaymentType');
const RealtyCategory = require('../enums/RealtyCategory');
const AvailabilityThingsType = require('../enums/AvailabilityThingsType');
const CommissionType = require('../enums/CommissionType');
const ContractType = require('../enums/ContractType');
const EntryType = require('../enums/EntryType');
const FurnishType = require('../enums/FurnishType');
const RealtyMenuItems = require('../../search/enums/RealtyMenuItems');
const Cities = require('../enums/Cities');
const _merge = require('lodash/merge');
const _union = require('lodash/union');
const _each = require('lodash/each');
const _isArray = require('lodash/isArray');
const _indexOf = require('lodash/indexOf');
const _forIn = require('lodash/forIn');
const City = require('../models/City');

/**
 * @class app.advert.forms.AdvertSearch
 * @extends Jii.base.ActiveRecord
 */
module.exports = Jii.defineClass('app.advert.forms.AdvertSearch', /** @lends app.advert.forms.AdvertSearch.prototype */{

    __extends: ActiveRecord,

    __static: /** @lends app.advert.forms.AdvertSearch */{
        /**
         * @returns {{}}
         */
        modelSchema: function() {
            return {
                columns: {
                    priceFrom: 'number',
                    priceTo: 'number',

                    areaSizeFrom: 'number',
                    areaSizeTo: 'number',
                    areaSizeKitchenFrom: 'number',
                    areaSizeKitchenTo: 'number',
                    areaSizeLivingFrom: 'number',
                    areaSizeLivingTo: 'number',

                    countRoomsTo: 'number',
                    countRoomsFrom: 'number',
                    floorFrom: 'number',
                    floorTo: 'number',
                    floorTotalFrom: 'number',
                    floorTotalTo: 'number',

                    countLift: 'number',
                    countBathroom: 'number',
                    contactPhone: 'number',
                    countBedroom: 'number',
                    countPhoneLine: 'number',

                    zoom: 'number',

                    userId: 'string',
                    userUid: 'string',
                    searchCurrencyCode: 'string',
                    operationType: 'string',
                    operationShortType: 'string',
                    realtyType: 'string',
                    realtyCategory: 'string',
                    roomTypes: 'array',
                    placeId: 'string',
                    addressString: 'string',
                    addressLocation: 'string',
                    datePublished: 'string',
                    bathroomType: 'string',
                    tenantsType: 'string',
                    prepaymentType: 'string',
                    commissionType: 'string',
                    contractType: 'string',
                    classBuilding: 'string',
                    entryType: 'string',
                    furnishType: 'string',

                    no_furniture: 'boolean',
                    furniture: 'boolean',
                    fridge: 'boolean',
                    balcony: 'boolean',
                    bath: 'boolean',
                    bathtub: 'boolean',
                    big_balcony: 'boolean',
                    canal: 'boolean',
                    cargo_lift: 'boolean',
                    conditioner: 'boolean',
                    electricity: 'boolean',
                    garage: 'boolean',
                    gas: 'boolean',
                    internet: 'boolean',
                    kitchen: 'boolean',
                    lift: 'boolean',
                    parking: 'boolean',
                    phone: 'boolean',
                    pool: 'boolean',
                    radiator: 'boolean',
                    secure: 'boolean',
                    shower: 'boolean',
                    toilet: 'boolean',
                    trash: 'boolean',
                    tv: 'boolean',
                    dishwasher: 'boolean',
                    washer: 'boolean',
                    water: 'boolean',
                    children: 'boolean',
                    pets: 'boolean',
                    loggia: 'boolean',
                    no_pledge: 'boolean',
                    agentsCanCall: 'boolean',
                    priceForMeter: 'boolean',
                    existingPhotos: 'boolean',
                    possibilityExpansionPhoneLines: 'boolean',
                    discountsAndPromotions: 'boolean',
                    window_to_street: 'boolean',
                    window_to_yard: 'boolean',
                    fromOwner: 'boolean',
                    fromBuilder: 'boolean',

                    typeNewBuildings: 'array',
                    floorType: 'array',
                    homeType: 'array',
                    repairType: 'array',
                    statusObjectType: 'array',
                    heatingType: 'array',
                    saleType: 'array',
                    yearNewBuildingsType: 'array',
                    stageBuildType: 'array',
                    positionTile: 'array',
                    advertId: 'array',

                    showMap: 'boolean',
                }
            };
        }

    },

    rules() {
        return [
            [['placeId', 'addressString'], 'required'],
            [['priceFrom', 'priceTo', 'areaSizeFrom', 'areaSizeTo', 'areaSizeKitchenFrom', 'areaSizeKitchenTo',
                'areaSizeLivingFrom', 'areaSizeLivingTo', 'floorFrom', 'floorTo', 'floorTotalFrom', 'floorTotalTo',
                'countLift', 'contactPhone', 'countBedroom', 'countRoomsTo', 'countRoomsFrom', 'countPhoneLine', 'countBathroom'], 'number', {min: 0}],
            [_union(['priceForMeter', 'existingPhotos', 'possibilityExpansionPhoneLines', 'discountsAndPromotions',
                'window_to_street', 'window_to_yard', 'fromOwner', 'fromBuilder', 'showMap'], AvailabilityThingsType.getKeys()), 'boolean'],
            ['searchCurrencyCode', 'in', {'range': CurrencyType.getKeys()}],
            ['operationType', 'in', {'range': OperationType.getKeys()}],
            ['operationShortType', 'in', {'range': OperationType.getKeys()}],
            ['realtyType', 'in', {'range': RealtyType.getKeys()}],
            ['realtyCategory', 'in', {'range': RealtyCategory.getKeys()}],
            ['datePublished', 'in', {'range': DatePublishedType.getKeys()}],
            ['repair', 'in', {'range': RepairType.getKeys()}],
            ['bathroomType', 'in', {'range': BathroomType.getKeys()}],
            ['tenantsType', 'in', {'range': TenantsType.getKeys()}],
            ['prepaymentType', 'in', {'range': PrepaymentType.getKeys()}],
            ['commissionType', 'in', {'range': CommissionType.getKeys()}],
            ['contractType', 'in', {'range': ContractType.getKeys()}],
            ['entryType', 'in', {'range': EntryType.getKeys()}],
            ['furnishType', 'in', {'range': FurnishType.getKeys()}],
            [['roomTypes', 'typeNewBuildings', 'availabilityThings', 'floorType', 'homeType', 'repairs', 'statusObjectType',
                'heatingType', 'saleType', 'yearNewBuildingsType', 'stageBuildType'], 'safe'],
            [['addressString', 'classBuilding', 'addressLocation'], 'string'],
        ];
    },

    attributeLabels() {
        return _merge({
            priceFrom: Jii.t('app', 'Price from'),
            priceTo: Jii.t('app', 'Price to'),
            areaSizeFrom: Jii.t('app', 'Area size from'),
            areaSizeTo: Jii.t('app', 'Area size to'),
            areaSizeKitchenFrom: Jii.t('app', 'Area size kitchen from'),
            areaSizeKitchenTo: Jii.t('app', 'Area size kitchen to'),
            areaSizeLivingFrom: Jii.t('app', 'Area size living from'),
            areaSizeLivingTo: Jii.t('app', 'Area size living to'),

            countRoomsFrom: Jii.t('app', 'Rooms count from'),
            countRoomsTo: Jii.t('app', 'Rooms count to'),
            floorFrom: Jii.t('app', 'Floor from'),
            floorTo: Jii.t('app', 'Floor to'),
            floorTotalFrom: Jii.t('app', 'Floor count from'),
            floorTotalTo: Jii.t('app', 'Floor count to'),
            countLift: Jii.t('app', 'Lift count minimum'),
            countBathroom: Jii.t('app', 'Bathroom count'),
            contactPhone: Jii.t('app', 'Contact phone'),
            countBedroom: Jii.t('app', 'Bedroom count minimum'),
            countPhoneLine: Jii.t('app', 'Phone lines count minimum'),
            searchCurrencyCode: Jii.t('app', 'Search currency code'),
            operationType: Jii.t('app', 'Operation type'),
            realtyType: Jii.t('app', 'Type realty'),
            roomTypes: Jii.t('app', 'Type rooms'),
            addressString: Jii.t('app', 'Address'),
            datePublished: Jii.t('app', 'Advert publish date'),
            window_to_street: Jii.t('app', 'In street'),
            window_to_yard: Jii.t('app', 'In yard'),
            bathroomType: Jii.t('app', 'Bathroom'),
            tenantsType: Jii.t('app', 'The composition of tenants'),
            prepaymentType: Jii.t('app', 'Prepayment'),
            commissionType: Jii.t('app', 'Commission'),
            contractType: Jii.t('app', 'Type contract'),
            classBuilding: Jii.t('app', 'Class building'),
            entryType: Jii.t('app', 'Entry'),
            furnishType: Jii.t('app', 'Furnish'),
            agentsCanCall: Jii.t('app', 'Without the «agents do not call»'),
            priceForMeter: Jii.t('app', 'Price for meter'),
            existingPhotos: Jii.t('app', 'Only with photos'),
            possibilityExpansionPhoneLines: Jii.t('app', 'With the possibility of increasing'),
            discountsAndPromotions: Jii.t('app', 'Discounts and promotions'),

            typeNewBuildings: Jii.t('app', 'Type new building'),
            floorType: Jii.t('app', 'Floor'),
            homeType: Jii.t('app', 'Type home'),
            repairType: Jii.t('app', 'Repair'),
            statusObjectType: Jii.t('app', 'Status premises'),
            heatingType: Jii.t('app', 'Heating'),
            saleType: Jii.t('app', 'Type sale'),
            yearNewBuildingsType: Jii.t('app', 'Year of new buildings'),
            stageBuildType: Jii.t('app', 'Stage of construction'),
            fromBuilder: Jii.t('app', 'From the developer'),
            showMap: Jii.t('app', 'Display'),
            no_pledge: Jii.t('app', 'deposit collateral'),
        }, AvailabilityThingsType.getLabels());
    },

    getUrlQuery() {
        let data = {};
        const attributes = this.attributes();
        const columnTypes = this.__static.modelSchema().columns;

        attributes.forEach(attribute => {

            // Range
            if (attribute.substr(-4) === 'from') {
                const name = attribute.substr(0, attribute.length - 4);
                if (attributes.indexOf(`${name}ro`) !== -1 && (this.get(`${name}from`) || this.get(`${name}to`))) {
                    data[name] = [
                        (this.get(`${name}from`) || '').replace(/-/, ''),
                        '-',
                        (this.get(`${name}ro`) || '').replace(/-/, ''),
                    ].join('');
                    return;
                }
            }

            // Arrays
            if (columnTypes[attribute] === 'array' && this.get(attribute)) {
                if (this.get(attribute) !== null) {
                    data[attribute] = this.get(attribute).join('*');
                }
                return;
            }

            // Boolean
            if (columnTypes[attribute] === 'boolean') {
                if (this.get(attribute)) {
                    data[attribute] = '';
                }
                return;
            }

            // Other
            if (this.get(attribute) !== null && this.get(attribute) != '') {
                data[attribute] = this.get(attribute);
            }
        });

        // Append menu
        const menu = RealtyMenuItems.getValue(this.get('operationType'), this.get('realtyType'));
        if(menu){
            data.menu = menu;
        }
        delete data.operationType;

        // Append address name
        if (data.placeId) {
            const addressName = Cities.getName(data.placeId);
            if (addressName) {
                data.address = addressName;
                delete data.addressString;
            } else {
                data.address = data.placeId;
            }
            delete data.placeId;
            delete data.addressLocation;
        }

        //delete advertId
        if('advertId' in data){
            delete data['advertId'];
        }

        return data;
    },

    setUrlQuery(data) {
        let values = {};
        let columnTypes = this.__static.modelSchema().columns;

        // Detect operation type from menu
        if (data.menu) {
            values.operationType = RealtyMenuItems.getOperationType(data.menu);
        }

        // Detect address name
        if (data.address && data.address != 'onMap') {

            const cachedCity = City.getCachedCity(data.address);
            if (cachedCity) {
                data.placeId = cachedCity.get('cityId');
                data.addressString = cachedCity.get('title');
            } else {
                data.placeId = Cities.getPlaceId(data.address) || data.address;
                data.addressString = Cities.getLabel(data.address) || data.addressString || '';
            }
        }

        _each(data, (value, attribute) => {
            // Range
            if (columnTypes[`${attribute}From`] && columnTypes[`${attribute}To`]) {
                let parts = value.split('-');
                if (parts[0]) {
                    values[`${attribute}From`] = parts[0];
                }
                if (parts[1]) {
                    values[`${attribute}To`] = parts[1];
                }
                return;
            }

            // Arrays
            if (columnTypes[attribute] === 'array') {
                values[attribute] = value.split('*');
                return;
            }

            // Boolean
            if (columnTypes[attribute] === 'boolean') {
                values[attribute] = !value;
                return;
            }

            if (columnTypes[attribute]) {
                values[attribute] = value;
            }
        });

        if(!values['addressString'] && values['placeId'] && Cities.getName(values['placeId'])){
            values['addressString'] = Cities.getLabel(Cities.getName(values['placeId']));
        }

        this.set(values);
    },

    /**
     * Returns attribute values.
     *
     * TODO убрать функцию из класса, как только подправят библиотеку (неправильный порядок параметров в _indexOf)
     *
     * @param {Array} [names]
     * @param {Array} [except]
     * @returns {{}} Attribute values (name => value).
     */
    getAttributes(names, except) {
        let values = {};

        if (!_isArray(names)) {
            names = this.attributes();
        }

        _each(names, name => {
            if (!_isArray(except) || _indexOf(except, name) === -1) {
                values[name] = this.get(name);
            }
        });

        return values;
    },

    /**
     * Returns attribute not null values .
     * @param {Array} [except]
     * @returns {{}} Attribute values (name => value).
     */
    getNotNullAttributes(except) {
        let res = {};

        _forIn(this.getAttributes(null, except), (value, key) => {
            if(value) {
                res[key] = value;
            }
        });

        return res;
    }
});
