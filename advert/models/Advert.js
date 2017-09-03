'use strict';

const Jii = require('jii');
const ActiveRecord = require('jii-model/base/BaseActiveRecord');
const CurrencyType = require('../../core/enums/CurrencyType');
const OperationType = require('../enums/OperationType');
const RealtyType = require('../enums/RealtyType');
const RepairType = require('../enums/RepairType');
const BathroomType = require('../enums/BathroomType');
const TenantsType = require('../enums/TenantsType');
const PrepaymentType = require('../enums/PrepaymentType');
const CommissionType = require('../enums/CommissionType');
const ContractType = require('../enums/ContractType');
const EntryType = require('../enums/EntryType');
const FurnishType = require('../enums/FurnishType');
const HeatingType = require('../enums/HeatingType');
const AvailabilityThingsType = require('../enums/AvailabilityThingsType');
const HomeType = require('../enums/HomeType');
const RealtyRoomType = require('../enums/RealtyRoomType');
const StageBuildType = require('../enums/StageBuildType');
const StatusObjectType = require('../enums/StatusObjectType');
const SaleType = require('../enums/SaleType');
const LevelType = require('../../search/enums/LevelType');
const Address = require('./Address');
const User = require('../../core/models/User');

/**
 * @class app.advert.models.Advert
 * @extends ActiveRecord
 */
module.exports = Jii.defineClass('app.advert.models.Advert', /** @lends app.advert.models.Advert.prototype */{

    __extends: ActiveRecord,

    __static: /** @lends app.advert.models.Advert */{

        tableName() {
            return 'adverts_realty';
        },

        modelSchema: function () {
            return {
                primaryKey: ['id'],
                columns: {
                    id: {
                        jsType: 'number',
                        isPrimaryKey: true
                    },
                    uid: 'string',
                    placeId: 'string',
                    price: 'number',
                    userId: 'number',
                    developerId: 'number',
                    basementType: 'string',
                    contactPhone: 'string',
                    contactName: 'string',
                    contactEmail: 'string',
                    description: 'string',
                    currencyCode: 'string',
                    addressString: 'string',
                    updateTime: 'string',
                    createTime: 'string',
                    endTimeShow: 'string',

                    viewCount: 'number',
                    areaSize: 'number',
                    floor: 'number',
                    floorTotal: 'number',
                    realtyType: 'string',
                    bathroomType: 'string',
                    tenantsType: 'string',
                    prepaymentType: 'string',
                    commissionType: 'string',
                    homeType: 'string',
                    repairType: 'string',
                    statusObjectType: 'string',
                    saleType: 'string',
                    operationType: 'string',
                    urlMainPhoto: 'string',
                    urlView: 'string',

                    no_furniture: 'boolean',
                    furniture: 'boolean',
                    fridge: 'boolean',
                    conditioner: 'boolean',
                    internet: 'boolean',
                    kitchen: 'boolean',
                    phone: 'boolean',
                    tv: 'boolean',
                    dishwasher: 'boolean',
                    washer: 'boolean',
                    children: 'boolean',
                    pets: 'boolean',
                    no_pledge: 'boolean',
                    agentsCanCall: 'boolean',
                    fromOwner: 'boolean', //от собственника
                    top3: 'boolean',

                    files: 'array',
                    photos: 'array'
                }
            };
        },

        commonInfos: ['basementType', 'areaSize', 'floor', 'floorTotal', 'realtyType', 'bathroomType',
            'tenantsType', 'prepaymentType', 'commissionType', 'homeType', 'repairType', 'statusObjectType',
            'saleType', 'operationType'],

        getWithEnum(name, model){
            const enumsByName = {
                bathroomType: BathroomType,
                commissionType: CommissionType,
                contractType: ContractType,
                entryType: EntryType,
                furnishType: FurnishType,
                heatingType: HeatingType,
                homeType: HomeType,
                operationType: OperationType,
                prepaymentType: PrepaymentType,
                realtyType: RealtyType,
                roomType: RealtyRoomType,
                repairType: RepairType,
                stageBuildType: StageBuildType,
                statusObjectType: StatusObjectType,
                tenantsType: TenantsType,
                saleType: SaleType,
                searchCurrencyCode: CurrencyType,
            };
            let value = model.get(name);

            if(name == 'roomType'){
                return RealtyRoomType.getLabelAdvert(value) || value;
            }
            return enumsByName[name] ? enumsByName[name].getLabel(value) : value;
        },
    },

    getDataCommonInfo(){
        return this.getData().filter(el => this.__static.commonInfos.indexOf(el.key) != -1);
    },

    getData(){
        let res = [];
        this.attributes().map(el => res.push({
            'key': el,
            'labelAttribute': this.getAttributeLabel(el),
            'labelValue': this.__static.getWithEnum(el, this),
            'value': this.get(el)
        }));
        return res;
    },

    rules() {
        return [
            [['realtyId', 'viewCount', 'id', 'developerId'], 'integer'],
            [['agentsCanCall', 'fromOwner', 'no_pledge', 'top3'].concat(AvailabilityThingsType.getKeys()), 'boolean'],
            [['createTime', 'updateTime', 'endTimeShow', 'description', 'files'], 'safe'],
            [['contactPhone', 'price', 'placeId'], 'string', {max: 255}],
            [['contactName', 'urlView'], 'string', {max: 2000}],
            ['contactEmail', 'email'],
            ['currencyCode', 'in', {'range': CurrencyType.getKeys()}],
            ['currencyCode', 'default', {value: CurrencyType.EUR}],
            ['userId', 'integer'],
            [['uid'], 'string', {max: 36}],
            [['areaSize', 'floor', 'floorTotal'], 'number', {min: 0}],
            ['realtyType', 'in', {'range': RealtyType.getKeys()}],
            ['bathroomType', 'in', {'range': BathroomType.getKeys()}],
            ['tenantsType', 'in', {'range': TenantsType.getKeys()}],
            ['prepaymentType', 'in', {'range': PrepaymentType.getKeys()}],
            ['commissionType', 'in', {'range': CommissionType.getKeys()}],
            ['homeType', 'in', {'range': HomeType.getKeys()}],
            ['repairType', 'in', {'range': RepairType.getKeys()}],
            ['statusObjectType', 'in', {'range': StatusObjectType.getKeys()}],
            ['operationType', 'in', {'range': OperationType.getKeys()}],
            ['saleType', 'in', {'range': SaleType.getKeys()}],
            ['basementType', 'in', {'range': LevelType.getBasementTypeValues()}],
        ];
    },

    attributeLabels() {
        return Object.assign({
            price: Jii.t('app', 'Price'),
            contactPhone: Jii.t('app', 'Contact phone'),
            contactName: Jii.t('app', 'Contact name'),
            contactEmail: Jii.t('app', 'Contact email'),
            description: Jii.t('app', 'Description'),
            currencyCode: Jii.t('app', 'Currency code'),
            addressString: Jii.t('app', 'Address'),
            createTime: Jii.t('app', 'Advert publish date'),
            updateTime: Jii.t('app', 'Update time'),
            floor: Jii.t('app', 'Floor'),
            floorTotal: Jii.t('app', 'Floor total'),
            realtyType: Jii.t('app', 'Type realty'),
            bathroomType: Jii.t('app', 'Bathroom count'),
            tenantsType: Jii.t('app', 'The composition of tenants'),
            prepaymentType: Jii.t('app', 'Prepayment'),
            commissionType: Jii.t('app', 'Commission'),
            basementType: Jii.t('app', 'Basement Type'),
            homeType: Jii.t('app', 'Type home'),
            repairType: Jii.t('app', 'Repair'),
            statusObjectType: Jii.t('app', 'Status premises'),
            saleType: Jii.t('app', 'Type sale'),
            operationType: Jii.t('app', 'Operation type'),
            areaSize: Jii.t('app', 'Area size'),
            viewCount: Jii.t('app', 'View count'),
            userId: Jii.t('app', 'User'),
            agentsCanCall: Jii.t('app', 'agents do not call'),
            no_pledge: Jii.t('app', 'deposit collateral'),
            pets: Jii.t('app', 'pets allowed'),
            children: Jii.t('app', 'children allowed'),
            no_furniture: Jii.t('app', 'no furniture'),
            fromOwner: Jii.t('app', 'From the owner'),
            endTimeShow: Jii.t('app', 'End time display advert'),
        }, AvailabilityThingsType.getLabels());
    },

    getAddress() {
        return this.hasOne(Address, {id: 'placeId'});
    },

    getUser(){
        return this.hasOne(User, {id: 'userId'});
    },

    getDeveloper(){
        return this.hasOne(User, {id: 'developerId'});
    }
});
