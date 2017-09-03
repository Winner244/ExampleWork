<?php
namespace app\advert\enums;

use app\core\base\AppEnum;
use Yii;

class BathroomType extends AppEnum  {

    const APART = 'apart';
    const JOINTLY = 'jointly';
    const IN_HOME = 'in_home';
    const IN_COURT = 'in_court';
    const NONE = 'not';


    /**
     * @return array
     */
    public static function getLabels()
    {
        return [
            self::APART => Yii::t('app', 'Separated'),
            self::JOINTLY => Yii::t('app', 'Combined'),
            self::IN_HOME => Yii::t('app', 'In home'),
            self::IN_COURT => Yii::t('app', 'In courtyard'),
            self::NONE => Yii::t('app', 'None')
        ];
    }

    public static function getTypesBathroom($realtyCategory)
    {
        $map = [
            RealtyCategory::LIVING => [self::APART, self::JOINTLY],
            RealtyCategory::COUNTRY => [self::IN_HOME, self::IN_COURT]
        ];

        if(array_key_exists($realtyCategory, $map)){
            return $map[$realtyCategory];
        }

        return null;
    }
}