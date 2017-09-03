'use strict';

const Jii = require('jii');
const Enum = require('../../core/base/Enum');
const OperationType = require('./OperationType');

const BUY = 'buy';
const RENT = 'rent';

/**
 * @module
 * @class
 * @extends Enum
 */
module.exports = Jii.defineClass('app.advert.enums.OperationShortType', {

    __extends: Enum,

    __static: /** @lends module.exports */{

        BUY: BUY,
        RENT: RENT,

        _labels: {
            [BUY]: Jii.t('app', 'Buy'),
            [RENT]: Jii.t('app', 'Rent'),
        },
        _shortLabel:{
            [BUY]: Jii.t('app', 'Sale'),
            [RENT]: Jii.t('app', 'Rent')
        },
        getShortLabel(name){
            return this._shortLabel[name] || this._label[name] || '';
        },

        getKey(operationType){
            if(operationType == OperationType.BUY){
                return BUY;
            }
            return RENT;
        }
    },
});