'use strict';

var Jii = require('jii');
var Enum = require('../../core/base/Enum');
var OperationType = require('./OperationType');
var RealtyType = require('./RealtyType');
var SectionType = require('./SectionType');
var _indexOf = require('lodash/indexOf');

const STUDIO = 'studio';
const ROOM_1 = '1';
const ROOM_2 = '2';
const ROOM_3 = '3';
const ROOM_4 = '4';
const ROOM_5 = '5';
const ROOM_6_PLUS = '6';
const FREE = 'free';

/**
 * @class RealtyRoomType
 * @extends app.core.base.Enum
 */
module.exports = Jii.defineClass('RealtyRoomType', /** @lends RealtyRoomType.prototype */{

    __extends: Enum,

    __static: /** @lends RealtyRoomType */{

        STUDIO: STUDIO,
        ROOM_1: ROOM_1,
        ROOM_2: ROOM_2,
        ROOM_3: ROOM_3,
        ROOM_4: ROOM_4,
        ROOM_5: ROOM_5,
        ROOM_6_PLUS: ROOM_6_PLUS,
        FREE: FREE,

        _labels: {
            [STUDIO]: Jii.t('app', 'Studio'),
            [ROOM_1]: Jii.t('app', '{count}-rooms', {'count': 1}),
            [ROOM_2]: Jii.t('app', '{count}-rooms', {'count': 2}),
            [ROOM_3]: Jii.t('app', '{count}-rooms', {'count': 3}),
            [ROOM_4]: Jii.t('app', '{count}-rooms', {'count': 4}),
            [ROOM_5]: Jii.t('app', '{count}-rooms', {'count': 5}),
            [ROOM_6_PLUS]: Jii.t('app', '6-rooms +'),
            [FREE]: Jii.t('app', 'Free planning')
        },

        _labelsAdvert: {
            [ROOM_1]: Jii.t('app', '{count}-room', {'count': 1}),
            [ROOM_2]: Jii.t('app', '{count}-room', {'count': 2}),
            [ROOM_3]: Jii.t('app', '{count}-room', {'count': 3}),
            [ROOM_4]: Jii.t('app', '{count}-room', {'count': 4}),
            [ROOM_5]: Jii.t('app', '{count}-room', {'count': 5}),
        },

        getLabelAdvert(id){
            return this._labelsAdvert[id] || this._labels[id] || id;
        },

        getTypes(type, operationType, objectType) {
            var roomEnum = this;
            var roomsSet1 = [
                roomEnum.STUDIO,
                roomEnum.ROOM_1,
                roomEnum.ROOM_2,
                roomEnum.ROOM_3,
                roomEnum.ROOM_4,
                roomEnum.ROOM_5,
                roomEnum.ROOM_6_PLUS
            ];

            if (type === SectionType.NEW_BUILDING ||
                (operationType === OperationType.BUY && _indexOf([RealtyType.FLAT, RealtyType.FLAT_NEW], objectType) !== -1))
            {
                return roomsSet1.concat(roomEnum.FREE);
            }
            else if (objectType === RealtyType.FLAT && _indexOf([OperationType.LONG, OperationType.SHORT], operationType) !== -1) {
                return roomsSet1;
            }

            return [];
        },
        getValues(type, operationType, objectType){
            return this.__super(this.getTypes(type, operationType, objectType));
        },
        getFormatLabel(rooms) {
            if (!rooms || rooms.length === 0) {
                return Jii.t('app', '{count, plural, one{room} other{rooms}}', {'count': 10});
            }

            const hasStudio = rooms.indexOf(STUDIO) >= 0;
            const hasFree = rooms.indexOf(FREE) >= 0;
            const numbers = rooms.filter((r) => /^\d+$/.test(r));

            const label = [];

            if (numbers.length === 1 && !hasStudio && !hasFree) {
                return numbers[0] + ' ' + Jii.t('app', '{roomsAbbr, select, other{rooms}}', {'roomsAbbr': 'short'});
            }

            if (numbers.length > 0 && numbers.length <= 6 && !hasStudio && !hasFree) {
                return numbers.join(', ') + ' '  + Jii.t('app', '{roomsAbbr, select, other{rooms}}', {'roomsAbbr': 'short'});
            }

            if (numbers.length > 0) {
                label.push(numbers.join(', ') + ' ' + Jii.t('app', 'r.'));
            }

            if (hasStudio) {
                label.push(Jii.t('app', 'Studio').toLowerCase());
            }

            if (hasFree) {
                label.push(Jii.t('app', 'free plan.'));
            }

            return label.join(', ');
        },
        getDefaultValue(type, operationType, objectType, rooms) {
            const values = this.getValues(type, operationType, objectType);

            if (values.length === 0) {
                return [];
            }

            if (rooms && rooms.length > 0) {
                return rooms.filter((r1) => values.some(r2 => r1 === r2.value));
            }

            if (type === SectionType.NEW_BUILDING) {
                return [];
            }

            return values
                .filter(v => v.value === ROOM_1 || v.value === ROOM_2)
                .map(v => v.value);
        }

    }

});
