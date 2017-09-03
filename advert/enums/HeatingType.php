<?php
namespace app\advert\enums;

use app\core\base\AppEnum;
use Yii;

class HeatingType extends AppEnum {

    const GAS = 'gas';
    const COAL = 'coal';
    const BAKE = 'bake';
    const FIREPLACE = 'fireplace';
    const NONE = 'none';

    /**
     * @return array
     */
    public static function getLabels()
    {
        return [
            self::GAS => Yii::t('app', 'Gas'),
            self::COAL => Yii::t('app', 'Coal'),
            self::BAKE => Yii::t('app', 'Furnace'),
            self::FIREPLACE => Yii::t('app', 'Fireplace'),
            self::NONE => Yii::t('app', 'Not heated'),
        ];
    }
}