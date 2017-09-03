<?php
namespace app\advert\enums;

use app\core\base\AppEnum;
use Yii;

class FurnishType extends AppEnum {

    const YES = 'yes';
    const NO = 'no';

    /**
     * @return array
     */
    public static function getLabels()
    {
        return [
            self::YES => Yii::t('app', 'With furnish'),
            self::NO => Yii::t('app', 'Without furnish'),
        ];
    }
}