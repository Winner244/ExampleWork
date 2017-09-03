<?php
namespace app\advert\enums;

use app\core\base\AppEnum;
use Yii;

class SaleType extends AppEnum {

    const FREEDOM = 'freedom';
    const ALTERNATIVE = 'alternative';
    const MORTGAGE_POSSIBLE = 'mortgage_possible';
    const FZ214 = 'fz214';
    const JSK = 'jsk';
    const TRANSFER_LEASE = 'transfer_lease';
    const BUY_SALE = 'buy_sale';
    const INVESTMENTS = 'investments';

    /**
     * @return array
     */
    public static function getLabels()
    {
        return [
            self::FREEDOM => Yii::t('app', '{gender, plural, other{Free}}', ['gender' => 'women']),
            self::ALTERNATIVE => Yii::t('app', 'Alternative'),
            self::MORTGAGE_POSSIBLE => Yii::t('app', 'Mortgage possible'),
            self::FZ214 => Yii::t('app', '214-FL'),
            self::JSK => Yii::t('app', 'Contract BS'),
            self::TRANSFER_LEASE => Yii::t('app', 'Contract cession'),
            self::BUY_SALE => Yii::t('app', 'Preliminary sales contract'),
            self::INVESTMENTS => Yii::t('app', 'Investment Treaty'),
        ];
    }


    public static function getTypesSale($realtyType)
    {
        $map = [
            RealtyCategory::LIVING => [self::FREEDOM, self::ALTERNATIVE],
            RealtyType::FLAT_NEW => [self::MORTGAGE_POSSIBLE, self::FZ214, self::JSK, self::TRANSFER_LEASE, self::BUY_SALE, self::INVESTMENTS]
        ];

        if($realtyType == RealtyType::FLAT_NEW){
            return $map[$realtyType];
        }
        if(array_key_exists(RealtyType::getCategory($realtyType), $map)){
            return $map[RealtyType::getCategory($realtyType)];
        }

        return null;
    }
}