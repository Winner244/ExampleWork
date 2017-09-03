<?php
namespace app\advert\enums;

use app\core\base\AppEnum;
use Yii;

class HomeType extends AppEnum {

    const PANEL = 'panel';
    const BRICK = 'brick';
    const MONOLITH = 'monolith';
    const STALIN = 'stalin';
    const BLOCK = 'block';
    const WOOD = 'wood';
    const BRICK_MONOLITH = 'brick_monolith';
    const DASHBOARD = 'dashboard';
    const BUSINESS_CENTER = 'business_center';
    const NON_RESIDENTIAL = 'non_residential';
    const RESIDENTIAL = 'residential';
    const TRC = 'trc';
    const OLD_FUND = 'old_fund';

    /**
     * @return array
     */
    public static function getLabels()
    {
        return [
            self::PANEL => Yii::t('app', 'Panel'),
            self::BRICK => Yii::t('app', 'Brick'),
            self::MONOLITH => Yii::t('app', 'Monolithic'),
            self::STALIN => Yii::t('app', 'Stalin'),
            self::BLOCK => Yii::t('app', 'Modular'),
            self::WOOD => Yii::t('app', 'Wooden'),
            self::BRICK_MONOLITH => Yii::t('app', 'Brick-solid'),
            self::DASHBOARD => Yii::t('app', 'Shield'),
            self::BUSINESS_CENTER => Yii::t('app', 'Business center'),
            self::NON_RESIDENTIAL => Yii::t('app', 'Non residential'),
            self::RESIDENTIAL => Yii::t('app', 'Residential'),
            self::TRC => Yii::t('app', 'Mall'),
            self::OLD_FUND => Yii::t('app', 'Old fund')
        ];
    }

    public static function getTypesHome($realtyType)
    {
        $map = [
            RealtyCategory::LIVING => [self::PANEL, self::BRICK, self::MONOLITH, self::STALIN, self::BLOCK, self::WOOD, self::BRICK_MONOLITH, self::DASHBOARD],
            RealtyCategory::COUNTRY => [self::BRICK, self::MONOLITH, self::WOOD, self::DASHBOARD],
            RealtyCategory::COMMERCIAL => [self::BUSINESS_CENTER, self::NON_RESIDENTIAL, self::RESIDENTIAL, self::TRC, self::OLD_FUND],
            RealtyType::FLAT_NEW => [self::PANEL, self::BRICK, self::MONOLITH]
        ];

        if($realtyType == RealtyType::FLAT_NEW){
            return $map[$realtyType];
        }

        return $map[RealtyType::getCategory($realtyType)];
    }
}