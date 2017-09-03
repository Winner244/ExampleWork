'use strict';

var Jii = require('jii');
var Enum = require('../../core/base/Enum');
var _map = require('lodash/map');

const APARTMENTS = 'apartments';
const PENTHOUSE = 'penthouse';
const SNT = 'snt';
const IJS = 'ijs';
const INDUSTRIAL = 'industrial';
const FARM = 'farm';
const INVESTMENTS = 'investments';
const DACHA = 'dacha';

/**
 * @module
 * @class
 * @extends Enum
 */
module.exports = Jii.defineClass('app.advert.enums.StatusObjectType', {

    __extends: Enum,

    __static: /** @lends module.exports */{

        APARTMENTS: APARTMENTS,
        PENTHOUSE: PENTHOUSE,
        SNT: SNT,
        IJS: IJS,
        INDUSTRIAL: INDUSTRIAL,
        FARM: FARM,
        INVESTMENTS: INVESTMENTS,
        DACHA: DACHA,

        _labels: {
            [APARTMENTS]: Jii.t('app', 'Apartments'),
            [PENTHOUSE]: Jii.t('app', 'Penthouse'),
            [SNT]: Jii.t('app', 'SNT'),
            [IJS]: Jii.t('app', 'IHC'),
            [INDUSTRIAL]: Jii.t('app', 'Industrial'),
            [FARM]: Jii.t('app', 'Farm'),
            [INVESTMENTS]: Jii.t('app', 'Investment project'),
            [DACHA]: Jii.t('app', 'Suburban cooperative'),
        },

        _livingCategory: [APARTMENTS, PENTHOUSE],
        _countryCategory: [SNT, IJS, INDUSTRIAL, FARM, INVESTMENTS, DACHA],

        getValues(formLabel = false, arrayValues = this.getKeys()){
            return _map(arrayValues, (value) => ({
                value: value,
                label: formLabel ? this.getFormLabel(value) : this.getLabel(value)
            }));
        },
        getValuesLivingCategory(form = false){
            return this.getValues(form, this._livingCategory);
        },
        getValuesCountryCategory(form = false){
            return this.getValues(form, this._countryCategory);
        },
        getFormLabel(name){
            return this._labels[name];
        }
    }

});