'use strict';

var Jii = require('jii');
var Enum = require('../../core/base/Enum');

const COSMETICS = 'cosmetics';
const EURO = 'euro';
const DESIGN = 'design';
const NONE = 'none';

/**
 * @module
 * @class
 * @extends Enum
 */
module.exports = Jii.defineClass('app.advert.enums.RepairType', {

    __extends: Enum,

    __static: /** @lends module.exports */{

        COSMETICS: COSMETICS,
        EURO: EURO,
        DESIGN: DESIGN,
        NONE: NONE,

        _labels: {
            [COSMETICS]: Jii.t('app', 'Cosmetic'),
            [EURO]: Jii.t('app', 'Western renovation'),
            [DESIGN]: Jii.t('app', 'Design'),
            [NONE]: Jii.t('app', 'Absent')
        }
    }

});