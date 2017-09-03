<?php

namespace app\advert\models;
use app\advert\enums\OperationType;
use app\advert\enums\RealtyType;

/** Объявления недвижимости категории загородное (дом, участок...)
 *
 * @property integer $areaSizePlat
 * @property integer $countBedroom
 * @property string $heatingType
 * @property boolean $bath
 * @property boolean $canal
 * @property boolean $electricity
 * @property boolean $garage
 * @property boolean $gas
 * @property boolean $pool
 * @property boolean $water
 *
 */
class CountryRealty extends BaseRealty
{

    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'adverts_realty_country';
    }

    /**
     * Declares attribute hints.
     */
    public function attributeHints()
    {
        return array(
            'areaSizePlat' => \Yii::t('app', 'plot of land.'),
        );
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return array_merge(parent::rules(), [
            [['countBedroom', 'areaSizePlat'], 'number', 'min' => 0],
            [['bath', 'canal', 'electricity', 'garage', 'gas', 'pool', 'water'], 'boolean'],
            [['heatingType'], 'string', 'max' => 32],
        ]);
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return array_merge(parent::attributeLabels(), [
            'areaSizePlat' => \Yii::t('app', 'Plot size'),
            'countBedroom' => \Yii::t('app', 'Bedrooms count'),
            'heatingType' => \Yii::t('app', 'Heating'),
            'bath' => \Yii::t('app', 'bath'),
            'canal' => \Yii::t('app', 'canal'),
            'electricity' => \Yii::t('app', 'electricity'),
            'garage' => \Yii::t('app', 'garage'),
            'gas' => \Yii::t('app', 'gas'),
            'pool' => \Yii::t('app', 'pool'),
            'water' => \Yii::t('app', 'water'),
        ]);
    }

    /** @inheritdoc */
    public static function getMatchingGroupsByAttr($attributes)
    {
        $matchingGroups = parent::getMatchingGroupsByAttr($attributes);

        if ($attributes['advert']['operationType'] === OperationType::LONG) {
            if ($attributes['advert']['realtyType'] === RealtyType::HOUSE) {
                $matchingGroups[] = AdvertSummary::COUNTRY_RENT_HOUSE;
            }
        }

        if ($attributes['advert']['operationType'] === OperationType::SHORT) {
            if ($attributes['advert']['realtyType'] === RealtyType::HOUSE) {
                $matchingGroups[] = AdvertSummary::COUNTRY_SHORT_HOUSE;
            }
        }

        if ($attributes['advert']['operationType'] === OperationType::BUY) {
            if ($attributes['advert']['realtyType'] === RealtyType::HOUSE) {
                $matchingGroups[] = AdvertSummary::COUNTRY_BUY_HOUSE;
            }
            if ($attributes['advert']['realtyType'] === RealtyType::TOWNHOUSE) {
                $matchingGroups[] = AdvertSummary::COUNTRY_BUY_TOWNHOUSE;
            }
            if ($attributes['advert']['realtyType'] === RealtyType::PLAT) {
                $matchingGroups[] = AdvertSummary::COUNTRY_BUY_PLAT;
            }
        }

        return $matchingGroups;
    }

}
