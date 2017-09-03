<?php
namespace app\advert\enums;

use app\core\base\AppEnum;
use Yii;

class ClassBuildingType extends AppEnum {

    const A = 'A';
    const A_PLUS = 'A+';
    const B = 'B';
    const B_PLUS = 'B+';
    const C = 'C';
    const C_PLUS = 'C+';

    /**
     * @return array
     */
    public static function getLabels()
    {
        return [
            self::A => Yii::t('app', 'A'),
            self::A_PLUS => Yii::t('app', 'A+'),
            self::B => Yii::t('app', 'B'),
            self::B_PLUS => Yii::t('app', 'B+'),
            self::C => Yii::t('app', 'C'),
            self::C_PLUS => Yii::t('app', 'C+'),
        ];
    }
}