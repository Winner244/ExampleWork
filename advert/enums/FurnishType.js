'use strict';

var Jii = require('jii');
var Enum = require('../../core/base/Enum');

const YES = 'yes';
const NO = 'no';

/**
 * @module
 * @class
 * @extends Enum
 */
module.exports = Jii.defineClass('app.advert.enums.FurnishType', {

    __extends: Enum,

    __static: /** @lends module.exports */{

        YES: YES,
        NO: NO,

        _labels: {
            [YES]: Jii.t('app', 'With furnish'),
            [NO]: Jii.t('app', 'Without furnish'),
        }
    }

});