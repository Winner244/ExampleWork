<?php
namespace app\advert\enums;

use app\core\base\AppEnum;
use yii\base\Exception;
use Yii;

class RealtyType extends AppEnum {

    const FLAT = 'flat';
    const FLAT_NEW = 'flat_new';
    const ROOM = 'room';
    const SHARE = 'share';
    const HOUSE = 'house';
    const HOUSE_PART = 'house_part';
    const TOWNHOUSE = 'townhouse';
    const PLAT = 'plat';
    const OFFICE = 'office';
    const TRADE_PLAT = 'trade_plat';
    const WAREHOUSE = 'warehouse';
    const FREE_APPOINTMENT = 'free_appointment';
    const FOOD_ROOM = 'food_room';
    const GARAGE = 'garage';
    const PRODUCTION = 'production';
    const CAR_SERVICE = 'car_service';
    const BUSINESS = 'business';
    const BUILDING = 'building';
    const SERVICES = 'services';
    const BED = 'bed';

    /**
     * @return array
     */
    public static function getLabels()
    {
        return [
            self::FLAT => Yii::t('app', '{realtyQuantity, plural, other{Flat}}', ['realtyQuantity' => 1]),
            self::FLAT_NEW => Yii::t('app', '{realtyQuantity, plural, other{Flat in new building}}', ['realtyQuantity' => 1]),
            self::ROOM => Yii::t('app', '{realtyQuantity, plural, other{Room}}', ['realtyQuantity' => 1]),
            self::SHARE => Yii::t('app', '{realtyQuantity, plural, other{Share}}', ['realtyQuantity' => 1]),
            self::HOUSE => Yii::t('app', 'House'),
            self::HOUSE_PART => Yii::t('app', 'Part house'),
            self::TOWNHOUSE => Yii::t('app', 'Townhouse'),
            self::PLAT => Yii::t('app', 'Plat'),
            self::OFFICE => Yii::t('app', 'Office'),
            self::TRADE_PLAT => Yii::t('app', '{realtyQuantity, plural, other{Trade area}}', ['realtyQuantity' => 1]),
            self::WAREHOUSE => Yii::t('app', 'Warehouse'),
            self::FREE_APPOINTMENT => Yii::t('app', 'Free appointment'),
            self::FOOD_ROOM => Yii::t('app', 'Public catering'),
            self::GARAGE => Yii::t('app', 'Garage'),
            self::PRODUCTION => Yii::t('app', 'Production'),
            self::CAR_SERVICE => Yii::t('app', 'Car service'),
            self::BUSINESS => Yii::t('app', 'Business'),
            self::BUILDING => Yii::t('app', 'Building'),
            self::SERVICES => Yii::t('app', 'Services'),
            self::BED => Yii::t('app', 'Bed')
        ];
    }

    public static function getRealtyTypesByCategory($category){
        $realtyCategoryGroups = [
            RealtyCategory::LIVING => [self::FLAT, self::FLAT_NEW, self::ROOM, self::SHARE, self::BED],
            RealtyCategory::COUNTRY => [self::HOUSE, self::HOUSE_PART, self::TOWNHOUSE, self::PLAT],
            RealtyCategory::COMMERCIAL => [
                self::OFFICE, self::TRADE_PLAT, self::WAREHOUSE, self::FOOD_ROOM, self::FREE_APPOINTMENT, self::GARAGE,
                self::PRODUCTION, self::CAR_SERVICE, self::BUSINESS, self::BUILDING, self::SERVICES
            ]
        ];
        if(isset($realtyCategoryGroups[$category])){
            return $realtyCategoryGroups[$category];
        }

        throw new Exception("Unknown category: {$category}");
    }

    public static function getCategory($id)
	{
		$map = [
		    RealtyCategory::LIVING => [self::FLAT, self::FLAT_NEW, self::ROOM, self::SHARE, self::BED],
		    RealtyCategory::COUNTRY => [self::HOUSE, self::HOUSE_PART, self::TOWNHOUSE, self::PLAT],
		    RealtyCategory::COMMERCIAL => [self::OFFICE, self::TRADE_PLAT, self::WAREHOUSE, self::FREE_APPOINTMENT, self::FOOD_ROOM, self::GARAGE,
                self::PRODUCTION, self::CAR_SERVICE, self::BUSINESS, self::BUILDING, self::SERVICES],
        ];

        foreach ($map as $category => $types) {
            if (in_array($id, $types)) {
                return $category;
            }
        }

        throw new Exception("Unknown realty type: {$id}");
	}

}