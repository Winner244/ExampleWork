'use strict';

const Jii = require('jii');
const Enum = require('../../core/base/Enum');

const RENT = 'rent';
const COMMERCIAL = 'commercial';
const NEW_BUILDING = 'new_building';

/**
 * @class app.advert.enums.SectionType
 * @extends app.core.base.Enum
 */
module.exports = Jii.defineClass('app.advert.enums.SectionType', /** @lends app.advert.enums.SectionType.prototype */{

    __extends: Enum,

    __static: /** @lends app.advert.enums.SectionType */{

        RENT: RENT,
        COMMERCIAL: COMMERCIAL,
        NEW_BUILDING: NEW_BUILDING,
    }

});
