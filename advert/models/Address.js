'use strict';

const Jii = require('jii');
const ActiveRecord = require('jii-model/base/BaseActiveRecord');

/**
 * @class app.advert.models.Address
 * @extends Jii.sql.ActiveRecord
 */
module.exports = Jii.defineClass('app.advert.models.Address', /** @lends app.advert.models.Address.prototype */{

    __extends: ActiveRecord,

    __static: /** @lends app.advert.models.Address */{

        tableName() {
            return 'address';
        },

        modelSchema: function () {
            return {
                primaryKey: ['id'],
                columns: {
                    id: {
                        jsType: 'number',
                        isPrimaryKey: true
                    },
                    title: 'string',
                    shortTitle: 'string',
                    placeId: 'string',
                    cityId: 'string',
                    lang: 'string',
                    location: 'string',
                }
            };
        },
    },

    getCity() {
        return this.hasOne(require('./City'), {id: 'cityId'});
    }

});
