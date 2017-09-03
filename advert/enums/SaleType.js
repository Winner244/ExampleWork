'use strict';

var Jii = require('jii');
var Enum = require('../../core/base/Enum');

const FREEDOM = 'freedom';
const ALTERNATIVE = 'alternative';
const MORTGAGE_POSSIBLE = 'mortgage_possible';
const FZ214 = 'fz214';
const JSK = 'jsk';
const TRANSFER_LEASE = 'transfer_lease';
const BUY_SALE = 'buy_sale';
const INVESTMENTS = 'investments';

/**
 * @module
 * @class
 * @extends Enum
 */
module.exports = Jii.defineClass('app.advert.enums.SaleType', {

    __extends: Enum,

    __static: /** @lends module.exports */{

        FREEDOM: FREEDOM,
        ALTERNATIVE: ALTERNATIVE,
        MORTGAGE_POSSIBLE: MORTGAGE_POSSIBLE,
        FZ214: FZ214,
        JSK: JSK,
        TRANSFER_LEASE: TRANSFER_LEASE,
        BUY_SALE: BUY_SALE,
        INVESTMENTS: INVESTMENTS,

        _labels: {
            [FREEDOM]: Jii.t('app', '{gender, select, other{Free}}', {'gender': 'women'}),
            [ALTERNATIVE]: Jii.t('app', 'Alternative'),
            [MORTGAGE_POSSIBLE]: Jii.t('app', 'Mortgage possible'),
            [FZ214]: Jii.t('app', '214-FL'),
            [JSK]: Jii.t('app', 'Contract BS'),
            [TRANSFER_LEASE]: Jii.t('app', 'Contract cession'),
            [BUY_SALE]: Jii.t('app', 'Preliminary sales contract'),
            [INVESTMENTS]: Jii.t('app', 'Investment Treaty'),
        },
        _shortLabels:{
            [JSK]: Jii.t('app', 'BS'),
            [TRANSFER_LEASE]: Jii.t('app', 'assignment'),
            [BUY_SALE]: Jii.t('app', 'preliminary agreement'),
            [INVESTMENTS]: Jii.t('app', 'investment'),
        },
        _newBuildingUpdate: [FZ214, JSK, TRANSFER_LEASE, BUY_SALE, INVESTMENTS],
        _newBuildingForm: [MORTGAGE_POSSIBLE, FZ214, JSK, TRANSFER_LEASE, BUY_SALE, INVESTMENTS],
        _living: [FREEDOM, ALTERNATIVE],

        getValuesLiving(){
            return this.getValues(this._living);
        },
        getValuesNewBuildingForm(){
            return this.getValues(this._newBuildingForm);
        },
        getValuesNewBuildingUpdate(){
            return this.getValues(this._newBuildingUpdate);
        },
        getShortLabel(name){
            return this._shortLabels[name] || this._labels[name];
        }
    }

});