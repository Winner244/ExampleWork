<?php
namespace app\advert\enums;

use app\core\base\AppEnum;
use Yii;

class RealtyRoomType extends AppEnum {

    const STUDIO = 'studio';
    const ROOM_1 = '1';
    const ROOM_2 = '2';
    const ROOM_3 = '3';
    const ROOM_4 = '4';
    const ROOM_5 = '5';
    const ROOM_6_PLUS = '6';
    const FREE = 'free';

    /**
     * @return array
     */
    public static function getLabels()
    {
        return [
            self::STUDIO => Yii::t('app', 'Studio'),
            self::ROOM_1 => Yii::t('app', '{count}-rooms', ['count' => 1]),
            self::ROOM_2 => Yii::t('app', '{count}-rooms', ['count' => 2]),
            self::ROOM_3 => Yii::t('app', '{count}-rooms', ['count' => 3]),
            self::ROOM_4 => Yii::t('app', '{count}-rooms', ['count' => 4]),
            self::ROOM_5 => Yii::t('app', '{count}-rooms', ['count' => 5]),
            self::ROOM_6_PLUS => Yii::t('app', '6-rooms +'),
            self::FREE => Yii::t('app', 'Free planning'),
        ];
    }
}