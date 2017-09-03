'use strict';

const Jii = require('jii');
const Enum = require('../../core/base/Enum');
const SectionType = require('./SectionType');
const _map = require('lodash/map');

const BUY = 'buy';
const LONG = 'long';
const SHORT = 'short';

/**
 * @module
 * @class
 * @extends Enum
 */
module.exports = Jii.defineClass('app.advert.enums.OperationType', {

    __extends: Enum,

    __static: /** @lends module.exports */{

        BUY: BUY,
        LONG: LONG,
        SHORT: SHORT,

        _labels: {
            [BUY]: Jii.t('app', 'Buy'),
            [LONG]: Jii.t('app', 'Rent long time'),
            [SHORT]: Jii.t('app', 'Rent short time')
        },
        _formLabels: {
            [LONG]: Jii.t('app', 'Protractedly'),
            [SHORT]: Jii.t('app', 'Daily')
        },
        _shortLabel:{
            [BUY]: Jii.t('app', 'Sale'),
            [LONG]: Jii.t('app', 'Rent'),
            [SHORT]: Jii.t('app', 'Rent')
        },
        _actionLabel:{
            [BUY]: Jii.t('app', 'Buy'),
            [LONG]: Jii.t('app', 'To rent'),
            [SHORT]: Jii.t('app', 'To rent')
        },
        _addAdvertLabel:{
            [BUY]: Jii.t('app', 'Sell'),
            [LONG]: Jii.t('app', 'Long time lease'),
            [SHORT]: Jii.t('app', 'Short time lease')
        },
        _leaseOperation: [LONG, SHORT],
        getValues(type, formLabel) {
            if (type === SectionType.NEW_BUILDING) {
                return [];
            }

            if(formLabel) {
                return _map(this._formLabels, (label, key) => ({
                    value: key,
                    label: label
                }));
            }

            return this.__super();
        },
        getValuesLeaseOperation(formLabel){
            return _map(this._leaseOperation, (key) => ({
                value: key,
                label: formLabel ? this.getFormLabel(key) : this.getLabel(key)
            }));
        },
        getFormLabel(name){
            return this._formLabels[name] || this._label[name] || '';
        },
        getShortLabel(name){
            return this._shortLabel[name] || this._label[name] || '';
        },
        getActionLabel(name){
            return this._actionLabel[name] || this._label[name] || '';
        },
        getAddAdvertLabel(name){
            return this._addAdvertLabel[name] || this._label[name] || '';
        }

    }

});