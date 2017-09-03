'use strict';

var Jii = require('jii');
var Enum = require('../../core/base/Enum');

const FREEDOM = 'freedom';
const PASS = 'pass';

/**
 * @module
 * @class
 * @extends Enum
 */
module.exports = Jii.defineClass('app.advert.enums.EntryType', {

    __extends: Enum,

    __static: /** @lends module.exports */{

        FREEDOM: FREEDOM,
        PASS: PASS,

        _labels: {
            [FREEDOM]: Jii.t('app', '{gender, select, other{Free}}', {'gender': 'man'}),
            [PASS]: Jii.t('app', 'According permit'),
        },
    }

});