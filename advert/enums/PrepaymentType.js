'use strict';

var Jii = require('jii');
var Enum = require('../../core/base/Enum');
var _map = require('lodash/map');

const ANY = '';
const MONTH_1 = 'month_1';
const MONTH_2 = 'month_2';
const MONTH_3 = 'month_3';

/**
 * @module
 * @class
 * @extends Enum
 */
module.exports = Jii.defineClass('app.advert.enums.PrepaymentType', {

    __extends: Enum,

    __static: /** @lends module.exports */{

        ANY: ANY,
        MONTH_1: MONTH_1,
        MONTH_2: MONTH_2,
        MONTH_3: MONTH_3,

        _labels: {
            [ANY]: Jii.t('app', '{sex, select, other{Any}}', {'sex': 'women'}),
            [MONTH_1]: Jii.t('app', 'not more than {count, number} {count, plural, one{month} other{months}}', {'count': 1}),
            [MONTH_2]: Jii.t('app', 'not more than {count, number} {count, plural, one{month} other{months}}', {'count': 2}),
            [MONTH_3]: Jii.t('app', 'not more than {count, number} {count, plural, one{month} other{months}}', {'count': 3})
        },

        _addLabels: {
            [ANY]: Jii.t('app', 'None'),
            [MONTH_1]: Jii.t('app', '{count, number} {count, plural, one{month} other{months}}', {'count': 1}),
            [MONTH_2]: Jii.t('app', '{count, number} {count, plural, one{month} other{months}}', {'count': 2}),
            [MONTH_3]: Jii.t('app', '{count, number} {count, plural, one{month} other{months}}', {'count': 3})
        },

        getAddFormLabel(name){
            return this._addLabels[name] || '';
        },

        getAddFormValues(){
            return _map(this.getKeys(), (key) => ({
                value: key,
                label: this.getAddFormLabel(key)
            }));
        }
    },

});