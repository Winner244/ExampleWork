'use strict';

var Jii = require('jii');
var Enum = require('../../core/base/Enum');

const PANEL = 'panel';
const BRICK = 'brick';
const MONOLITH = 'monolith';
const STALIN = 'stalin';
const BLOCK = 'block';
const WOOD = 'wood';
const BRICK_MONOLITH = 'brick_monolith';
const DASHBOARD = 'dashboard';
const BUSINESS_CENTER = 'business_center';
const NON_RESIDENTIAL = 'non_residential';
const RESIDENTIAL = 'residential';
const TRC = 'trc';
const OLD_FUND = 'old_fund';

/**
 * @module
 * @class
 * @extends Enum
 */
module.exports = Jii.defineClass('app.advert.enums.HomeType', {

    __extends: Enum,

    __static: /** @lends module.exports */{

        PANEL: PANEL,
        BRICK: BRICK,
        STALIN: STALIN,
        BLOCK: BLOCK,
        WOOD: WOOD,
        BRICK_MONOLITH: BRICK_MONOLITH,
        DASHBOARD: DASHBOARD,
        BUSINESS_CENTER: BUSINESS_CENTER,
        NON_RESIDENTIAL: NON_RESIDENTIAL,
        RESIDENTIAL: RESIDENTIAL,
        TRC: TRC,

        _labels: {
            [PANEL]: Jii.t('app', 'Panel'),
            [BRICK]: Jii.t('app', 'Brick'),
            [MONOLITH]: Jii.t('app', 'Monolithic'),
            [STALIN]: Jii.t('app', 'Stalin'),
            [BLOCK]: Jii.t('app', 'Modular'),
            [WOOD]: Jii.t('app', 'Wooden'),
            [BRICK_MONOLITH]: Jii.t('app', 'Brick-solid'),
            [DASHBOARD]: Jii.t('app', 'Shield'),
            [BUSINESS_CENTER]: Jii.t('app', 'Business center'),
            [NON_RESIDENTIAL]: Jii.t('app', 'Non residential'),
            [RESIDENTIAL]: Jii.t('app', 'Residential'),
            [TRC]: Jii.t('app', 'Mall'),
            [OLD_FUND]: Jii.t('app', 'Old fund')
        },

        _livingCategory: [PANEL, BRICK, MONOLITH, STALIN, BLOCK, WOOD, BRICK_MONOLITH, DASHBOARD],
        _countryCategory: [BRICK, MONOLITH, WOOD, DASHBOARD],
        _commercialCategory: [BUSINESS_CENTER, NON_RESIDENTIAL, RESIDENTIAL, TRC, OLD_FUND],
        _newBuilding: [PANEL, BRICK, MONOLITH],

        getValuesCountryCategory(){
            return this.getValues(this._countryCategory);
        },
        getValuesLivingCategory(){
            return this.getValues(this._livingCategory);
        },
        getValuesCommercialCategory(){
            return this.getValues(this._commercialCategory);
        },
        getValuesNewBuilding(){
            return this.getValues(this._newBuilding);
        }
    }

});