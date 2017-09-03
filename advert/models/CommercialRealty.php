<?php

namespace app\advert\models;
use app\advert\enums\OperationType;
use app\advert\enums\RealtyType;

/** Объявления недвижимости категории коммерческое (оффис, производство...)
 *
 * @property integer $countRooms
 * @property integer $countPhoneLine
 * @property string $contractType
 * @property string $classBuilding
 * @property string $entryType
 * @property boolean $lift
 * @property boolean $parking
 * @property boolean $secure
 * @property boolean $possibilityExpansionPhoneLines
 *
 */
class CommercialRealty extends BaseRealty
{

    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'adverts_realty_commercial';
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
            [['countRooms', 'countPhoneLine'], 'number', 'min' => 0],
            [['lift', 'parking', 'secure', 'possibilityExpansionPhoneLines'], 'boolean'],
            [['contractType', 'classBuilding', 'entryType'], 'string', 'max' => 32],
        ]);
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return array_merge(parent::attributeLabels(), [
            'countRooms' => \Yii::t('app', 'Rooms count'),
            'countPhoneLine' => \Yii::t('app', 'Phone lines count'),
            'contractType' => \Yii::t('app', 'Type contract'),
            'classBuilding' => \Yii::t('app', 'Class building'),
            'entryType' => \Yii::t('app', 'Entry'),
            'lift' => \Yii::t('app', 'lift'),
            'parking' => \Yii::t('app', 'parking'),
            'secure' => \Yii::t('app', 'security'),
            'possibilityExpansionPhoneLines' => \Yii::t('app', 'With the possibility of increasing'),
        ]);
    }

    /** @inheritdoc */
    public static function getMatchingGroupsByAttr($attributes)
    {
        $matchingGroups = parent::getMatchingGroupsByAttr($attributes);

        if ($attributes['advert']['operationType'] === OperationType::LONG) {
            $matchingGroups[] = AdvertSummary::COMMERCIAL_RENT;

            switch ($attributes['advert']['realtyType']) {
                case RealtyType::OFFICE:
                    $matchingGroups[] = AdvertSummary::COMMERCIAL_LONG_OFFICE;
                    break;
                case RealtyType::WAREHOUSE:
                    $matchingGroups[] = AdvertSummary::COMMERCIAL_LONG_WAREHOUSE;
                    break;
                case RealtyType::TRADE_PLAT:
                    $matchingGroups[] = AdvertSummary::COMMERCIAL_LONG_TRADE_PLAT;
                    break;
                case RealtyType::PRODUCTION:
                    $matchingGroups[] = AdvertSummary::COMMERCIAL_LONG_PRODUCTION;
                    break;
                case RealtyType::BUILDING:
                    $matchingGroups[] = AdvertSummary::COMMERCIAL_LONG_BUILDING;
                    break;
                case RealtyType::FREE_APPOINTMENT:
                    $matchingGroups[] = AdvertSummary::COMMERCIAL_LONG_FREE_APPOINTMENT;
                    break;
                case RealtyType::BUSINESS:
                    $matchingGroups[] = AdvertSummary::COMMERCIAL_LONG_BUSINESS;
                    break;
            }
        }

        if ($attributes['advert']['operationType'] === OperationType::BUY) {
            $matchingGroups[] = AdvertSummary::COMMERCIAL_BUY;

            switch ($attributes['advert']['realtyType']) {
                case RealtyType::OFFICE:
                    $matchingGroups[] = AdvertSummary::COMMERCIAL_BUY_GARAGE;
                    break;
                case RealtyType::WAREHOUSE:
                    $matchingGroups[] = AdvertSummary::COMMERCIAL_BUY_WAREHOUSE;
                    break;
                case RealtyType::TRADE_PLAT:
                    $matchingGroups[] = AdvertSummary::COMMERCIAL_BUY_TRADE_PLAT;
                    break;
                case RealtyType::PRODUCTION:
                    $matchingGroups[] = AdvertSummary::COMMERCIAL_BUY_PRODUCTION;
                    break;
                case RealtyType::BUILDING:
                    $matchingGroups[] = AdvertSummary::COMMERCIAL_BUY_BUILDING;
                    break;
                case RealtyType::FREE_APPOINTMENT:
                    $matchingGroups[] = AdvertSummary::COMMERCIAL_BUY_FREE_APPOINTMENT;
                    break;
                case RealtyType::BUSINESS:
                    $matchingGroups[] = AdvertSummary::COMMERCIAL_BUY_BUSINESS;
                    break;
                case RealtyType::GARAGE:
                    $matchingGroups[] = AdvertSummary::COMMERCIAL_BUY_GARAGE;
                    break;
            }
        }

        return $matchingGroups;
    }

}
