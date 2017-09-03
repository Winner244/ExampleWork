<?php
namespace app\advert\enums;

use app\core\base\AppEnum;
use Yii;

class OperationType extends AppEnum {

    const BUY = 'buy';
    const LONG = 'long';
    const SHORT = 'short';

    /**
     * @return array
     */
    public static function getLabels()
    {
        return [
            self::BUY => Yii::t('app', 'Buy'),
            self::LONG => Yii::t('app', 'Rent long time'),
            self::SHORT => Yii::t('app', 'Rent short time'),
        ];
    }

    /**
     * @return array
     */
    public static function getAddAdvertLabels()
    {
        return [
            self::BUY => Yii::t('app', 'Sell'),
            self::LONG => Yii::t('app', 'Long time lease'),
            self::SHORT => Yii::t('app', 'Short time lease'),
        ];
    }

    /**
     * @return array
     */
    public static function getAddAdvertLabel($id)
    {
        $idLabelMap = static::getAddAdvertLabels();

        if (!isset($idLabelMap[$id])) {
            throw new \Exception('Unknown enum id: ' . $id);
        }
        return $idLabelMap[$id];
    }
}