'use strict';

var Jii = require('jii');
var Enum = require('../../core/base/Enum');

const DIRECT_LEASE = 'direct_lease';
const SUBLEASE = 'sublease';
const COOPERATIVE = 'cooperative';
const SALE = 'sale';
const TRANSFER_LEASE = 'transfer_lease';

/**
 * @module
 * @class
 * @extends Enum
 */
module.exports = Jii.defineClass('app.advert.enums.ContractType', {

    __extends: Enum,

    __static: /** @lends module.exports */{

        DIRECT_LEASE: DIRECT_LEASE,
        SUBLEASE: SUBLEASE,
        COOPERATIVE: COOPERATIVE,
        SALE: SALE,
        TRANSFER_LEASE: TRANSFER_LEASE,

        _labels: {
            [DIRECT_LEASE]: Jii.t('app', 'Direct lease'),
            [SUBLEASE]: Jii.t('app', 'Sublease'),
            [COOPERATIVE]: Jii.t('app', 'Agreement joint work'),
            [SALE]: Jii.t('app', 'Object sale'),
            [TRANSFER_LEASE]: Jii.t('app', 'Assignment of lease rights')
        },
        _shortLongOperation: [DIRECT_LEASE, SUBLEASE, COOPERATIVE],
        _buyOperation: [SALE, TRANSFER_LEASE],
        getValuesShortLongOperation(){
            return this.getValues(this._shortLongOperation);
        },
        getValuesBuyOperation(){
            return this.getValues(this._buyOperation);
        }
    }

});