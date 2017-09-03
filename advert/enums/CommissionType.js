'use strict';

var Jii = require('jii');
var Enum = require('../../core/base/Enum');

const NONE = 'not';
const EXCLUSIVE = 'exclusive';

/**
 * @module
 * @class
 * @extends Enum
 */
module.exports = Jii.defineClass('app.advert.enums.CommissionType', {

    __extends: Enum,

    __static: /** @lends module.exports */{

        NONE: NONE,
        EXCLUSIVE: EXCLUSIVE,

        _labels: {
            [NONE]: Jii.t('app', 'Absent'),
            [EXCLUSIVE]: Jii.t('app', 'Exclusive')
        }
    }

});