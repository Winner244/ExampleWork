<?php

namespace app\advert\models;

use app\core\base\AppModel;
use yii\db\Query;

/**
 *
 * @property string $groupName
 * @property string $cityId
 * @property integer $advertCount
*/
class AdvertSummary extends AppModel
{
    // Rent
    const LIVING_RENT_1ROOM = 'livingRent1Room';
    const LIVING_RENT_2ROOM = 'livingRent2Room';
    const LIVING_RENT_3ROOM = 'livingRent3Room';
    const COUNTRY_RENT_HOUSE = 'countryRentHouse';
    const LIVING_RENT_ROOM = 'livingRentRoom';
    const LIVING_RENT_STUDIO = 'livingRentStudio';
    const COMMERCIAL_RENT = 'commercialRent';

    // Buy
    const LIVING_BUY_1ROOM = 'livingBuy1Room';
    const LIVING_BUY_2ROOM = 'livingBuy2Room';
    const LIVING_BUY_3ROOM = 'livingBuy3Room';
    const COUNTRY_BUY_HOUSE = 'countryBuyHouse';
    const LIVING_BUY_ROOM = 'livingBuyRoom';
    const COUNTRY_BUY_TOWNHOUSE = 'countryBuyTownhouse';
    const LIVING_BUY_FLAT_NEW = 'livingBuyFlatNew';
    const COMMERCIAL_BUY_GARAGE = 'commercialBuyGarage';
    const COMMERCIAL_BUY = 'commercialBuy';
    const COUNTRY_BUY_PLAT = 'countryBuyPlat';

    // New buildings
    const LIVING_BUY_NEW_1ROOM = 'livingBuyNew1Room';
    const LIVING_BUY_NEW_2ROOM = 'livingBuyNew2Room';
    const LIVING_BUY_NEW_3ROOM = 'livingBuyNew3Room';
    const LIVING_BUY_NEW_BUILDERS = 'livingBuyNewBuilders';

    // Daily
    const LIVING_SHORT_FLAT = 'livingShortFlat';
    const COUNTRY_SHORT_HOUSE = 'countryShortHouse';

    const LIVING_SHORT_ROOM = 'countryShortRoom';
    const LIVING_SHORT_1ROOM = 'countryShort1Room';
    const LIVING_SHORT_2ROOM = 'countryShort2Room';
    const LIVING_SHORT_3ROOM = 'countryShort3Room';

    // Commercial
    const COMMERCIAL_LONG_OFFICE = 'commercialLongOffice';
    const COMMERCIAL_BUY_OFFICE = 'commercialBuyOffice';
    const COMMERCIAL_LONG_WAREHOUSE = 'commercialLongWarehouse';
    const COMMERCIAL_BUY_WAREHOUSE = 'commercialBuyWarehouse';
    const COMMERCIAL_LONG_TRADE_PLAT = 'commercialLongTradeplat';
    const COMMERCIAL_BUY_TRADE_PLAT = 'commercialBuyTradeplat';
    const COMMERCIAL_LONG_PRODUCTION = 'commercialLongProduction';
    const COMMERCIAL_BUY_PRODUCTION = 'commercialBuyProduction';
    const COMMERCIAL_LONG_BUILDING = 'commercialLongBuilding';
    const COMMERCIAL_BUY_BUILDING = 'commercialBuyBuilding';
    const COMMERCIAL_LONG_FREE_APPOINTMENT = 'commercialLongFree';
    const COMMERCIAL_BUY_FREE_APPOINTMENT = 'commercialBuyFree';
    const COMMERCIAL_LONG_BUSINESS = 'commercialLongBusiness';
    const COMMERCIAL_BUY_BUSINESS = 'commercialBuyBusiness';

    public static function primaryKey() {
        return ['groupName', 'cityId'];
    }

    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'adverts_summary';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            ['advertCount', 'integer'],
            [['groupName', 'cityId'], 'string', 'max' => 255],
        ];
    }

    /**
     * @inheritdoc
     */
    public function transactions()
    {
        return [
            self::SCENARIO_DEFAULT => self::OP_ALL,
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'groupName' => \Yii::t('app', 'Group name'),
            'cityId' => \Yii::t('app', 'Address'),
            'advertCount' => \Yii::t('app', 'Advert count'),
        ];
    }

    /**
     * @param string[] $groupNames
     * @param string $cityId
     */
    public static function incrementGroups($groupNames, $cityId) {
        self::updateGroups($groupNames, $cityId, true);
    }

    /**
     * @param string[] $groupNames
     * @param string $cityId
     */
    public static function decrementGroups($groupNames, $cityId) {
        self::updateGroups($groupNames, $cityId, false);
    }

    /**
     * Increment or decrement counters of the given groupName-cityId combination
     *
     * @param string[] $groupNames
     * @param string $cityId
     * @param boolean $doIncrement
     */
    protected static function updateGroups($groupNames, $cityId, $doIncrement)
    {
        foreach ($groupNames as $groupName) {
            $groupCountRecord = self::findOne([
                'groupName' => $groupName,
                'cityId' => $cityId,
            ]);

            if (!$groupCountRecord) {
                $groupCountRecord = new self();
                $groupCountRecord->setAttributes([
                    'groupName' => $groupName,
                    'cityId' => $cityId,
                ]);
            }

            if ($doIncrement) {
                $groupCountRecord->advertCount += 1;
            } elseif ($groupCountRecord->advertCount) {
                $groupCountRecord->advertCount -= 1;
            }

            $groupCountRecord->save();
        }
    }

    /**
     * Get all group counters for the given $cityId
     *
     * @param string $cityId
     * @return static[]
     */
    public static function getByCityId($cityId) {
        return self::findAll([
            'cityId' => $cityId,
        ]);
    }

    /**
     * Get all group counters
     *
     * @return array|\yii\db\ActiveRecord[]
     */
    public static function getAll() {
        return self::find()->all();
    }

    /**
     * Get all the cities that has any adverts
     *
     * @param string $language
     * @return array Cities list
     */
    public static function getCitiesByLang($language) {
        $advertSummary = AdvertSummary::tableName();
        $cities = City::tableName();

        return (new Query())
            ->select(["$cities.shortTitle", "$cities.title", "$advertSummary.cityId"])
            ->from($advertSummary)
            // @todo consider joinWith()
            ->leftJoin("$cities cities", "$advertSummary.cityId = cities.placeId")
            ->where(['>', "$advertSummary.advertCount", 0])
            ->andWhere(["$cities.lang" => $language])
            ->distinct()
            ->indexBy('cityId')
            ->orderBy(["$cities.shortTitle" => SORT_ASC])
            ->limit(90)
            ->all();
    }

}
