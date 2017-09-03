'use strict';

var Jii = require('jii');
var Enum = require('../../core/base/Enum');
var _map = require('lodash/map');

const ANY = 'any';
const FAMILY = 'family';
const MAN = 'man';
const WOMEN = 'women';
const CHILDREN = 'children';
const PETS = 'pets';

/**
 * @module
 * @class
 * @extends Enum
 */
module.exports = Jii.defineClass('app.advert.enums.TenantsType', {

    __extends: Enum,

    __static: /** @lends module.exports */{

        ANY: ANY,
        FAMILY: FAMILY,
        MAN: MAN,
        WOMEN: WOMEN,
        CHILDREN: CHILDREN,
        PETS: PETS,

        _labels: {
            [ANY]: Jii.t('app', '{sex, select, other{Any}}', {'sex': 'man'}),
            [FAMILY]: Jii.t('app', 'Family'),
            [MAN]: Jii.t('app', 'Man'),
            [WOMEN]: Jii.t('app', 'Women'),
            [CHILDREN]: Jii.t('app', 'children allowed'),
            [PETS]: Jii.t('app', 'pets allowed'),
        },

        _radioValue: [ANY, FAMILY, MAN, WOMEN],
        _checkedValue: [CHILDREN, PETS],

        getValues(form = false, arrayValues = this.getKeys()){
            return _map(arrayValues, (value) => ({
                value: value,
                label: form ? this._labels[name] : this.getLabel(value)
            }));
        },
        getValuesRadio(form = false){
            return this.getValues(form, this._radioValue);
        },
        getValuesChecked(form = false){
            return this.getValues(form, this._checkedValue);
        },
    }

});