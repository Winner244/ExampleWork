'use strict';

var Jii = require('jii');
var Enum = require('../../core/base/Enum');

const ECONOMY = 'economy';
const BUSINESS = 'business';
const PREMIUM = 'premium';
const COMFORT = 'comfort';

/**
 * @module
 * @class
 * @extends Enum
 */
module.exports = Jii.defineClass('app.advert.enums.NewBuildingType', {

    __extends: Enum,

    __static: /** @lends module.exports */{

        ECONOMY: ECONOMY,
        BUSINESS: BUSINESS,
        PREMIUM: PREMIUM,
        COMFORT: COMFORT,

        _labels: {
            [ECONOMY]: Jii.t('app', 'Economy'),
            [BUSINESS]: Jii.t('app', 'Business'),
            [PREMIUM]: Jii.t('app', 'Premium'),
            [COMFORT]: Jii.t('app', 'Comfort'),
        }
    }

});