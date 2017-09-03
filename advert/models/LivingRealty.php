<?php

namespace app\advert\models;
use app\advert\enums\OperationType;
use app\advert\enums\RealtyRoomType;
use app\advert\enums\RealtyType;

/** Объявления недвижимости категории жилое (квартиры, новостройки...)
 *
 * @property integer $areaSizeKitchen
 * @property integer $areaSizeLiving
 * @property integer $countLift
 * @property integer $countBathroom
 * @property integer $yearNewBuilding
 * @property string $roomType
 * @property string $furnishType
 * @property string $typeNewBuildings
 * @property string $stageBuildType
 * @property boolean $balcony
 * @property boolean $bathtub
 * @property boolean $big_balcony
 * @property boolean $cargo_lift
 * @property boolean $radiator
 * @property boolean $shower
 * @property boolean $toilet
 * @property boolean $trash
 * @property boolean $loggia
 * @property boolean $mortgagePossible
 * @property boolean $window_to_street
 * @property boolean $window_to_yard
 * @property boolean $fromBuilder
 *
 */
class LivingRealty extends BaseRealty
{

    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'adverts_realty_living';
    }

    /**
     * Declares attribute hints.
     */
    public function attributeHints()
    {
        return array(
            'areaSizeKitchen' => \Yii::t('app', 'square meters.'),
            'areaSizeLiving' => \Yii::t('app', 'square meters.'),
        );
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return array_merge(parent::rules(), [
            [['areaSizeKitchen', 'areaSizeLiving', 'countLift', 'countBathroom', 'yearNewBuilding'], 'number', 'min' => 0],
            [['balcony', 'bathtub', 'big_balcony', 'cargo_lift', 'radiator', 'shower', 'toilet', 'trash',
                'loggia', 'mortgage_possible', 'window_to_street', 'window_to_yard', 'fromBuilder'], 'boolean'],
            [['roomType', 'furnishType', 'typeNewBuildings', 'stageBuildType'], 'string', 'max' => 32],
            ['roomType', 'required', 'when' => function($model){
                return $model->advert->realtyType == RealtyType::FLAT || $model->advert->realtyType == RealtyType::FLAT_NEW;
            }, 'whenClient' => "function (attribute, value) {
                 return $('#advert-realtytype').val() == '" .RealtyType::FLAT. "' || $('#advert-realtytype').val() == '" .RealtyType::FLAT_NEW. "';
            }"]
        ]);
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return array_merge(parent::attributeLabels(), [
            'areaSizeKitchen' => \Yii::t('app', 'Area size kitchen'),
            'areaSizeLiving' => \Yii::t('app', 'Area size living'),
            'countLift' => \Yii::t('app', 'Lifts count'),
            'countBathroom' => \Yii::t('app', 'Bathroom count'),
            'yearNewBuilding' => \Yii::t('app', 'Year of new buildings'),
            'roomType' => \Yii::t('app', 'Type rooms'),
            'furnishType' => \Yii::t('app', 'Furnish'),
            'typeNewBuildings' => \Yii::t('app', 'Type new building'),
            'stageBuildType' => \Yii::t('app', 'Stage of construction'),
            'balcony' => \Yii::t('app', 'balcony'),
            'bathtub' => \Yii::t('app', 'bathtub'),
            'big_balcony' => \Yii::t('app', 'big balcony'),
            'cargo_lift' => \Yii::t('app', 'cargo lift'),
            'radiator' => \Yii::t('app', 'radiator'),
            'shower' => \Yii::t('app', 'shower'),
            'toilet' => \Yii::t('app', 'toilet'),
            'trash' => \Yii::t('app', 'trash'),
            'loggia' => \Yii::t('app', 'loggia'),
            'mortgage_possible' => \Yii::t('app', 'Mortgage possible'),
            'window_to_street' => \Yii::t('app', 'Window faces the street'),
            'window_to_yard' => \Yii::t('app', 'Window faces the yard'),
            'fromBuilder' => \Yii::t('app', 'From the developer'),
        ]);
    }

    /** @inheritdoc */
    public static function getMatchingGroupsByAttr($attributes)
    {
        $matchingGroups = parent::getMatchingGroupsByAttr($attributes);

        if ($attributes['advert']['operationType'] === OperationType::BUY) {
            if ($attributes['advert']['realtyType'] === RealtyType::FLAT) {
                switch ($attributes['roomType']) {
                    case RealtyRoomType::ROOM_1:
                        $matchingGroups[] = AdvertSummary::LIVING_BUY_1ROOM;
                        break;
                    case RealtyRoomType::ROOM_2:
                        $matchingGroups[] = AdvertSummary::LIVING_BUY_2ROOM;
                        break;
                    case RealtyRoomType::ROOM_3:
                        $matchingGroups[] = AdvertSummary::LIVING_BUY_3ROOM;
                        break;
                }
            }

            if ($attributes['advert']['realtyType'] === RealtyType::ROOM) {
                $matchingGroups[] = AdvertSummary::LIVING_BUY_ROOM;
            }

            if ($attributes['advert']['realtyType'] === RealtyType::FLAT_NEW) {
                $matchingGroups[] = AdvertSummary::LIVING_BUY_FLAT_NEW;

                switch ($attributes['roomType']) {
                    case RealtyRoomType::ROOM_1:
                        $matchingGroups[] = AdvertSummary::LIVING_BUY_NEW_1ROOM;
                        break;
                    case RealtyRoomType::ROOM_2:
                        $matchingGroups[] = AdvertSummary::LIVING_BUY_NEW_2ROOM;
                        break;
                    case RealtyRoomType::ROOM_3:
                        $matchingGroups[] = AdvertSummary::LIVING_BUY_NEW_3ROOM;
                        break;
                }

                if ($attributes['fromBuilder']) {
                    $matchingGroups[] = AdvertSummary::LIVING_BUY_NEW_BUILDERS;
                }
            }
        }

        if ($attributes['advert']['operationType'] === OperationType::LONG) {
            if ($attributes['advert']['realtyType'] === RealtyType::FLAT) {
                switch ($attributes['roomType']) {
                    case RealtyRoomType::ROOM_1:
                        $matchingGroups[] = AdvertSummary::LIVING_RENT_1ROOM;
                        break;
                    case RealtyRoomType::ROOM_2:
                        $matchingGroups[] = AdvertSummary::LIVING_RENT_2ROOM;
                        break;
                    case RealtyRoomType::ROOM_3:
                        $matchingGroups[] = AdvertSummary::LIVING_RENT_3ROOM;
                        break;
                    case RealtyRoomType::STUDIO:
                        $matchingGroups[] = AdvertSummary::LIVING_RENT_STUDIO;
                        break;
                }
            }

            if ($attributes['advert']['realtyType'] === RealtyType::ROOM) {
                $matchingGroups[] = AdvertSummary::LIVING_RENT_ROOM;
            }
        }

        if ($attributes['advert']['operationType'] === OperationType::SHORT) {
            if ($attributes['advert']['realtyType'] === RealtyType::FLAT) {
                switch ($attributes['roomType']) {
                    case RealtyRoomType::ROOM_1:
                        $matchingGroups[] = AdvertSummary::LIVING_SHORT_1ROOM;
                        break;
                    case RealtyRoomType::ROOM_2:
                        $matchingGroups[] = AdvertSummary::LIVING_SHORT_2ROOM;
                        break;
                    case RealtyRoomType::ROOM_3:
                        $matchingGroups[] = AdvertSummary::LIVING_SHORT_3ROOM;
                        break;
                }
                $matchingGroups[] = AdvertSummary::LIVING_SHORT_FLAT;
            }
            if($attributes['advert']['realtyType'] === RealtyType::ROOM) {
                $matchingGroups[] = AdvertSummary::LIVING_SHORT_ROOM;
            }
        }

        return $matchingGroups;
    }

}
