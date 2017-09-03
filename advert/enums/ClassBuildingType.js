'use strict';

var Jii = require('jii');
var Enum = require('../../core/base/Enum');

const A = 'A';
const A_PLUS = 'A+';
const B = 'B';
const B_PLUS = 'B+';
const C = 'C';
const C_PLUS = 'C+';

/**
 * @class app.advert.enums.ClassBuildingType
 * @extends app.core.base.Enum
 */
module.exports = Jii.defineClass('app.advert.enums.ClassBuildingType', /** @lends app.advert.enums.ClassBuildingType.prototype */{

    __extends: Enum,

    __static: /** @lends app.advert.enums.ClassBuildingType */{

        A: A,
        A_PLUS: A_PLUS,
        B: B,
        B_PLUS: B_PLUS,
        C: C,
        C_PLUS: C_PLUS,

        _labels: {
            [A]: Jii.t('app', 'A'),
            [A_PLUS]: Jii.t('app', 'A+'),
            [B]: Jii.t('app', 'B'),
            [B_PLUS]: Jii.t('app', 'B+'),
            [C]: Jii.t('app', 'C'),
            [C_PLUS]: Jii.t('app', 'C+'),
        },
    },
});
