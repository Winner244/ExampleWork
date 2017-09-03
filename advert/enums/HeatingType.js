'use strict';

var Jii = require('jii');
var Enum = require('../../core/base/Enum');

const GAS = 'gas';
const COAL = 'coal';
const BAKE = 'bake';
const FIREPLACE = 'fireplace';
const NONE = 'none';

/**
 * @module
 * @class
 * @extends Enum
 */
module.exports = Jii.defineClass('app.advert.enums.HeatingType', {

    __extends: Enum,

    __static: /** @lends module.exports */{

        GAS: GAS,
        COAL: COAL,
        BAKE: BAKE,
        FIREPLACE: FIREPLACE,
        NONE: NONE,

        _labels: {
            [GAS]: Jii.t('app', 'Gas'),
            [COAL]: Jii.t('app', 'Coal'),
            [BAKE]: Jii.t('app', 'Furnace'),
            [FIREPLACE]: Jii.t('app', 'Fireplace'),
            [NONE]: Jii.t('app', 'Not heated'),
        }
    }

});