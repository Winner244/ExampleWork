<?php
namespace app\advert\enums;

use app\core\base\AppEnum;
use Yii;

class NewBuildingType extends AppEnum {

    const ECONOMY = 'economy';
    const BUSINESS = 'business';
    const PREMIUM = 'premium';
    const COMFORT = 'comfort';

    /**
     * @return array
     */
    public static function getLabels()
    {
        return [
            self::ECONOMY => Yii::t('app', 'Economy'),
            self::BUSINESS => Yii::t('app', 'Business'),
            self::PREMIUM => Yii::t('app', 'Premium'),
            self::COMFORT => Yii::t('app', 'Comfort'),
        ];
    }
}