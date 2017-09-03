'use strict';

const Jii = require('jii');
const Enum = require('../../core/base/Enum');

const LIVING = 'living';
const COUNTRY = 'country';
const COMMERCIAL = 'commercial';

/**
 * @class app.advert.enums.RealtyCategory
 * @extends app.core.base.Enum
 */
module.exports = Jii.defineClass('app.advert.enums.RealtyCategory', /** @lends app.advert.enums.RealtyCategory.prototype */{

    __extends: Enum,

    __static: /** @lends module.exports */{

        LIVING: LIVING,
        COUNTRY: COUNTRY,
        COMMERCIAL: COMMERCIAL,

        _labels: {
            [LIVING]: Jii.t('app', 'Residential'),
            [COUNTRY]: Jii.t('app', 'Suburban'),
            [COMMERCIAL]: Jii.t('app', 'Commercial')
        },

        _labelsNot: {
            [LIVING]: Jii.t('app', '{sex, select, other{Residential}}', {sex: 'women'}),
        },

        getLabelNot(name){
            return this._labelsNot[name] || this._labels[name] || '';
        },
    }

});
