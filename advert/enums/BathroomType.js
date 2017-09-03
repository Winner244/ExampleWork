'use strict';

var Jii = require('jii');
var Enum = require('../../core/base/Enum');

const APART = 'apart';
const JOINTLY = 'jointly';
const IN_HOME = 'in_home';
const IN_COURT = 'in_court';
const NONE = 'not';

/**
 * @module
 * @class
 * @extends Enum
 */
module.exports = Jii.defineClass('app.advert.enums.BathroomType', {

    __extends: Enum,

    __static: /** @lends module.exports */{

        APART: APART,
        JOINTLY: JOINTLY,
        IN_HOME: IN_HOME,
        IN_COURT: IN_COURT,

        _labels: {
            [APART]: Jii.t('app', 'Separated'),
            [JOINTLY]: Jii.t('app', 'Combined'),
            [IN_HOME]: Jii.t('app', 'In home'),
            [IN_COURT]: Jii.t('app', 'In courtyard'),
            [NONE]: Jii.t('app', 'None')
        },
        _livingCategory: [APART, JOINTLY],
        _countryCategory: [IN_HOME, IN_COURT],

        getValuesLivingCategory(){
            return this.getValues(this._livingCategory);
        },
        getValuesCountryCategory(){
            return this.getValues(this._countryCategory);
        }
    }

});