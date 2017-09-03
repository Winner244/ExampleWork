<?php
namespace app\advert\enums;

use app\core\base\AppEnum;
use Yii;

class StatusObjectType extends AppEnum {

    const APARTMENTS = 'apartments';
    const PENTHOUSE = 'penthouse';
    const SNT = 'snt';
    const IJS = 'ijs';
    const INDUSTRIAL = 'industrial';
    const FARM = 'farm';
    const INVESTMENTS = 'investments';
    const DACHA = 'dacha';

    /**
     * @return array
     */
    public static function getLabels()
    {
        return [
            self::APARTMENTS => Yii::t('app', 'Apartments'),
            self::PENTHOUSE => Yii::t('app', 'Penthouse'),
            self::SNT => Yii::t('app', 'SNT'),
            self::IJS => Yii::t('app', 'IHC'),
            self::INDUSTRIAL => Yii::t('app', 'Industrial'),
            self::FARM => Yii::t('app', 'Farm'),
            self::INVESTMENTS => Yii::t('app', 'Investment project'),
            self::DACHA => Yii::t('app', 'Suburban cooperative'),
        ];
    }

    public static function getTypesStatusObject($realtyCategory)
    {
        $map = [
            RealtyCategory::LIVING => [self::APARTMENTS, self::PENTHOUSE],
            RealtyCategory::COUNTRY => [self::SNT, self::IJS, self::INDUSTRIAL, self::FARM, self::INVESTMENTS, self::DACHA],
        ];

        if(array_key_exists($realtyCategory, $map)){
            return $map[$realtyCategory];
        }

        return null;
    }
}