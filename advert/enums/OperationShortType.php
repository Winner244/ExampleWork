<?php
namespace app\advert\enums;

use app\core\base\AppEnum;
use Yii;

class OperationShortType extends AppEnum {

    const BUY = 'buy';
    const RENT = 'rent';

    /**
     * @return array
     */
    public static function getLabels()
    {
        return [
            self::BUY => Yii::t('app', 'Buy'),
            self::RENT => Yii::t('app', 'Rent'),
        ];
    }

    public static function getKey($operationType){
        if($operationType == OperationType::BUY){
            return self::BUY;
        }
        return self::RENT;
    }
}