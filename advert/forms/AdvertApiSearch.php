<?php

namespace app\advert\forms;

use app\advert\enums\Cities;
use app\advert\enums\DatePublishedType;
use app\advert\enums\LevelType;
use app\advert\enums\OperationShortType;
use app\advert\enums\OperationType;
use app\advert\enums\RealtyCategory;
use app\advert\enums\RealtyType;
use app\advert\enums\YearNewBuildingsType;
use app\advert\models\Address;
use app\advert\models\Currency;
use app\core\CoreModule;
use app\search\components\MapTilesComponent;
use app\search\enums\RealtyMenuItems;
use yii\base\Model;
use yii\db\ActiveQuery;
use app\core\traits\SearchModelTrait;
use yii\db\Expression;
use yii\db\Query;
use Yii;

class AdvertApiSearch extends Model  {

    use SearchModelTrait;

    public $priceForMeter;
    public $datePublished;
    public $floorType;
    public $yearNewBuildingsType;
    public $placeId;
    public $addressString;
    public $addressLocation;
    public $positionTile;
    public $zoom;
    public $tilesSet;
    public $userId;

//    поиск по наличию фото
//    public $existingPhotos;

    // Base advert

    public $contactPhone;

    // bool
    public $no_furniture;
    public $furniture;
    public $fridge;
    public $conditioner;
    public $internet;
    public $kitchen;
    public $phone;
    public $tv;
    public $dishwasher;
    public $washer;
    public $children;
    public $pets;
    public $no_pledge;
    public $agentsCanCall;
    public $discountsAndPromotions;

    // num range
    public $priceFrom;
    public $priceTo;
    public $areaSizeFrom;
    public $areaSizeTo;
    public $floorFrom;
    public $floorTo;
    public $floorTotalFrom;
    public $floorTotalTo;

    // min value
    public $countLift;

    // string
    public $realtyType;
    public $bathroomType;
    public $tenantsType;
    public $prepaymentType;
    public $commissionType;
    public $operationType;
    public $countBathroom;
    public $realtyCategory;
    public $operationShortType;

    // list
    public $homeType;
    public $repairType;
    public $statusObjectType;
    public $saleType;

    public $advertId;


    // Country

    // bool
    public $bath;
    public $canal;
    public $electricity;
    public $garage;
    public $gas;
    public $pool;
    public $water;

    // list
    public $heatingType;

    // min value
    public $countBedroom;


    // Living

    //bool
    public $balcony;
    public $bathtub;
    public $big_balcony;
    public $cargo_lift;
    public $radiator;
    public $shower;
    public $toilet;
    public $trash;
    public $loggia;
    public $window_to_street;
    public $window_to_yard;
    public $fromOwner;
    public $fromBuilder;

    // num range
    public $areaSizeKitchenFrom;
    public $areaSizeKitchenTo;
    public $areaSizeLivingFrom;
    public $areaSizeLivingTo;

    // list
    public $typeNewBuildings;
    public $stageBuildType;
    public $roomTypes;

    // string
    public $furnishType;



    // Commercial

    // bool
    public $lift;
    public $parking;
    public $secure;
    public $possibilityExpansionPhoneLines;

    // string
    public $contractType;
    public $classBuilding;
    public $entryType;

    // min value
    public $countPhoneLine;

    public $searchCurrencyCode = Currency::EUR;

    protected $rangeProperties = [
        'areaSize' => [
            'areaSizeFrom',
            'areaSizeTo',
        ],
    ];

    protected $livingRangeProperties = [
        'areaSizeKitchen' => [
            'areaSizeKitchenFrom',
            'areaSizeKitchenTo',
        ],
        'areaSizeLiving' => [
            'areaSizeLivingFrom',
            'areaSizeLivingTo',
        ],
        'floor' => [
            'floorFrom',
            'floorTo',
        ],
        'floorTotal' => [
            'floorTotalFrom',
            'floorTotalTo',
        ],
    ];
    protected $commercialRangeProperties = [];
    protected $countryRangeProperties = [];

    protected $boolProperties = ['no_furniture', 'furniture', 'fridge', 'conditioner', 'internet', 'kitchen', 'phone',
        'tv', 'dishwasher', 'washer', 'children', 'pets', 'no_pledge', 'agentsCanCall', 'fromOwner', 'discountsAndPromotions'];
    protected $livingBoolProperties = ['balcony', 'bathtub', 'big_balcony', 'cargo_lift', 'radiator', 'shower',
        'toilet', 'trash', 'loggia', 'window_to_street', 'window_to_yard', 'fromBuilder'];
    protected $commercialBoolProperties = ['lift', 'parking', 'secure', 'possibilityExpansionPhoneLines'];
    protected $countryBoolProperties = ['bath', 'canal', 'electricity', 'garage', 'gas', 'pool', 'water'];


    protected $listProperties = ['homeType', 'repairType', 'statusObjectType', 'saleType', 'advertId'];
    protected $livingListProperties = ['typeNewBuildings', 'stageBuildType', ['roomTypes' => 'roomType']];
    protected $commercialListProperties = [];
    protected $countryListProperties = ['heatingType'];


    protected $stringProperties = ['realtyType', 'bathroomType', 'tenantsType', 'prepaymentType', 'commissionType', 'operationType', 'userId'];
    protected $livingStringProperties = ['furnishType', 'countBathroom'];
    protected $commercialStringProperties = ['contractType', 'classBuilding', 'entryType'];
    protected $countryStringProperties = [];


    protected $minValueProperties = [];
    protected $livingMinValueProperties = ['countLift'];
    protected $commercialMinValueProperties = ['countPhoneLine'];
    protected $countryMinValueProperties = ['countBedroom'];


    /**
     * @inheritdoc
     */
    public function rules() {
        $rules = [
            [['priceFrom', 'priceTo', 'areaSizeFrom', 'areaSizeTo', 'floorFrom', 'floorTo', 'floorTotalFrom', 'floorTotalTo', 'zoom'], 'number'],
            [['realtyType', 'placeId', 'addressString', 'operationType', 'addressLocation', 'realtyCategory', 'operationShortType'], 'string', 'max' => 255],
            [['bathroomType', 'tenantsType', 'prepaymentType', 'commissionType', 'contactPhone', 'datePublished'], 'string', 'max' => 32],
            ['searchCurrencyCode', 'string', 'max' => 3],
            [['no_furniture', 'furniture', 'fridge', 'conditioner', 'internet', 'kitchen', 'phone', 'tv', 'dishwasher',
                'washer', 'children', 'pets', 'no_pledge', 'agentsCanCall', 'priceForMeter', 'fromOwner', 'discountsAndPromotions'], 'boolean'],
            [['homeType', 'repairType', 'statusObjectType', 'floorType', 'yearNewBuildingsType', 'saleType', 'positionTile', 'tilesSet', 'advertId'], 'safe'],
            ['userId', 'integer']
        ];

        $livingRealtyRules = [
            [['areaSizeKitchenFrom', 'areaSizeKitchenTo', 'areaSizeLivingFrom', 'areaSizeLivingTo', 'countLift', 'countBathroom', ], 'number'],
            [['balcony', 'bathtub', 'big_balcony', 'cargo_lift', 'radiator', 'shower', 'toilet', 'trash', 'loggia',
                'window_to_street', 'window_to_yard', 'fromBuilder'], 'boolean'],
            [['furnishType'], 'string', 'max' => 32],
            [['roomTypes', 'typeNewBuildings', 'stageBuildType'], 'safe'],
        ];

        $commercialRealtyRules = [
            [['countPhoneLine'], 'number'],
            [['lift', 'parking', 'secure', 'possibilityExpansionPhoneLines'], 'boolean'],
            [['contractType', 'classBuilding', 'entryType'], 'string', 'max' => 32],
        ];

        $countryRulesRules = [
            [['bath', 'canal', 'electricity', 'garage', 'gas', 'pool', 'water'], 'boolean'],
            ['heatingType', 'safe'],
            ['countBedroom', 'number'],
        ];

        return array_merge($rules, $livingRealtyRules, $commercialRealtyRules, $countryRulesRules);
    }

    public function processUrlParams($params = []) {
        $values = [];
        $arrayColumns = [
            'roomTypes',
            'typeNewBuildings',
            'floorType',
            'homeType',
            'repairType',
            'statusObjectType',
            'heatingType',
            'saleType',
            'yearNewBuildingsType',
            'stageBuildType',
            'positionTile'
        ];

        // Detect operation type from menu
        if (isset($params['menu']) && !$this->operationShortType) {
            $values['operationType'] = RealtyMenuItems::getOperationType($params['menu']);
        }

        // Detect address name
        if (!empty($params['address']) && $params['address'] != 'onMap') {

            $values['placeId'] = Cities::getPlaceId($params['address']) ?: $params['address'];
            $location = CoreModule::getInstance()->addressManager->fetchAddress($values['placeId'])['location'];
            $params['addressLocation'] = $location ?
                $location[0] . ',' . $location[1] :
                (isset($params['addressLocation']) ? $params['addressLocation']: '');
        }
        foreach ($params as $attribute => $value) {
            // Range
            if ($this->hasProperty("${attribute}From") && $this->hasProperty("${attribute}To")) {
                list($from, $to) = explode('-', $attribute);
                if ($from) {
                    $values["${attribute}From"] = $from;
                }
                if ($to) {
                    $values["${attribute}To"] = $to;
                }
                continue;
            }

            // Arrays
            if (in_array($attribute, $arrayColumns)) {
                $values[$attribute] = explode('*', $value);
                continue;
            }

            if ($this->hasProperty($attribute)) {
                $values[$attribute] = $value;
            }
        }

        $this->attributes = $values;
    }

    protected function createQuery()
    {
        $realtyClass = RealtyCategory::getClass($this->realtyCategory ?: RealtyType::getCategory($this->realtyType));
        return $realtyClass::find();
    }

    /**
     * @param ActiveQuery $query
     */
    protected function prepare($query)
    {
        $query
            ->joinWith('advert advert')
            // @todo consider joinWith()
            ->leftJoin(Currency::tableName() . ' currency', 'advert.currencyCode = currency.code')
            ->leftJoin(Address::tableName() . ' address', 'address.placeId = advert.placeId')
            ->andWhere(['address.lang' => Yii::$app->language])
            ->andWhere(['>', 'advert.endTimeShow', date("Y-m-d H:i:s")]);

        // Custom rules

        if ($this->tenantsType && $this->tenantsType == 'any') {
            $this->tenantsType = null;
        }

        if ($this->countBathroom && $this->countBathroom == 0) {
            $this->countBathroom = null;
        }

        if ($this->contactPhone) {
            $query->andWhere(['like', 'contactPhone', $this->contactPhone]);
        }

        if ($this->placeId) {
            $query->andWhere(['address.cityId' => $this->placeId]);
        }
        else if($this->addressString){
            $query->andWhere(['address.cityId' => CoreModule::getInstance()->addressManager->getPlaceId(explode(' ', $this->addressString)[0])]);
        }

        if($this->realtyCategory){
            $query->andWhere(['in', 'advert.realtyType', RealtyType::getRealtyTypesByCategory($this->realtyCategory)]);
        }

        if($this->operationShortType){
            if($this->operationShortType !== OperationShortType::BUY){
                $query->andWhere(['or',
                    ['advert.operationType' => OperationType::LONG],
                    ['advert.operationType' => OperationType::SHORT]]);
            }
            else{
                $query->andWhere(['advert.operationType' => $this->operationShortType]);
            }
        }

        $this->prepareDatePublished($query);
        $this->prepareFloorOptions($query);
        $this->prepareYearNewBuildings($query);
        $this->prepareMortgagePossible($query);

        $this->prepareTilesSummary($query);

        $this->preparePrice($query);
        $this->prepareRanges($query);
        $this->prepareBooleans($query);
        $this->prepareStrings($query);
        $this->prepareLists($query);
        $this->prepareMinValues($query);
        $this->preparePositionTitle($query);
    }

    /**
     * Process options of new buildings' ready state
     *
     * @param Query $query
     */
    protected function prepareYearNewBuildings($query)
    {
        if (!$this->yearNewBuildingsType || !is_array($this->yearNewBuildingsType) || !count($this->yearNewBuildingsType)) {
            return;
        }

        $currentYear = date("Y");
        $orOperators = [];

        foreach ($this->yearNewBuildingsType as $dateOption) {
            switch ($dateOption) {
                case YearNewBuildingsType::DONE:
                    $orOperators[] = ['<', 'yearNewBuilding', $currentYear];
                    break;
                case YearNewBuildingsType::LATER:
                    $orOperators[] = ['>', 'yearNewBuilding', YearNewBuildingsType::getLastSpecifiedYear()];
                    break;
                default:
                    $specifiedYear = (integer) trim($dateOption, "=>");
                    if ($specifiedYear) {
                        $orOperators[] = ['yearNewBuilding' => $specifiedYear];
                    }
                    break;
            }
        }

        if (count($orOperators)) {
            $query->andWhere(array_merge(['or'], $orOperators));
        }
    }


    /**
     * Process MortgagePossible
     *
     * @param Query $query
     */
    protected function prepareMortgagePossible($query)
    {
        if (!$this->saleType  || !is_array($this->saleType) || !count($this->saleType) || array_search('mortgage_possible', $this->saleType) === false) {
            return;
        }
        unset($this->saleType[array_search('mortgage_possible', $this->saleType)]);

        $query->andWhere('mortgage_possible = 1');
    }

    /**
     * Process floor options
     *
     * @param Query $query
     */
    protected function prepareFloorOptions($query)
    {
        if (!$this->floorType || !is_array($this->floorType) || !count($this->floorType)) {
            return;
        }

        foreach ($this->floorType as $floorOption) {
            switch ($floorOption) {
                case LevelType::NOT_LAST:
                    $query->andWhere('floor != floorTotal');
                    break;
                case LevelType::LAST:
                    $query->andWhere('floor = floorTotal');
                    break;
                case LevelType::NOT_FIRST:
                    $query->andWhere('floor != 1');
                    break;
                case LevelType::FIRST:
                    $query->andWhere('floor = 1');
                    break;
                case LevelType::BASEMENT:
                    $query->andWhere(['basementType' => LevelType::BASEMENT]);
                    break;
                case LevelType::SEMI_BASEMENT:
                    $query->andWhere(['basementType' => LevelType::SEMI_BASEMENT]);
                    break;
                case "":
                default:
                    break;
            }
        }
    }

    /**
     * Process advert publish date
     *
     * @param Query $query
     */
    protected function prepareDatePublished($query)
    {
        if ($this->datePublished) {
            $timeOffset = DatePublishedType::getTimeOffset($this->datePublished);
            if ($timeOffset) {
                $query->andWhere("createTime >= FROM_UNIXTIME(:time)", ['time' =>  time() - $timeOffset]);
            }
        }
    }

    /**
     * Process price ranges
     *
     * @param Query $query
     */
    protected function preparePrice($query)
    {
        $conversionRate = Currency::findOne(['code' => $this->searchCurrencyCode])->rate;

        // If it's price for meter, then divide price by area size
        $columnFormula = (bool) $this->priceForMeter ?
            "(price/(currency.rate*areaSize))" :
            "(price/currency.rate)";

        if ($this->priceFrom) {
            $query->andWhere("{$columnFormula} >= :priceFrom", ['priceFrom' => floor($this->priceFrom / $conversionRate)]);
        }

        if ($this->priceTo) {
            $query->andWhere("{$columnFormula} <= :priceTo", ['priceTo' => ceil($this->priceTo / $conversionRate)]);
        }
    }

    /**
     * @param ActiveQuery $query
     */
    protected function prepareTilesSummary($query)
    {
        if (!$this->zoom || !count($this->tilesSet)) {
            return;
        }

        $tileFieldName = "tile{$this->zoom}";

        // Check if advert's address is belongs to the given tile
        $tilesConditions = array_map(function($tileCoordinates) use ($tileFieldName) {
            return new Expression('address.' . $tileFieldName . ' = GeomFromText("POINT(' . doubleval($tileCoordinates[0]) . ' ' . doubleval($tileCoordinates[1]) . ')")');
        }, $this->tilesSet);

        $realtyClass = RealtyCategory::getClass($this->realtyCategory ?: RealtyType::getCategory($this->realtyType));
        $realtyTableName = $realtyClass::tableName();

        $query
            ->andWhere(array_merge(['or'], $tilesConditions))
            ->addSelect($realtyTableName . '.advertId, AVG(address.latitude) as centerLat, AVG(address.longitude) as centerLng, COUNT(*) as advertsCount')
            ->groupBy('address.' . $tileFieldName)
            ->asArray();
    }

    /**
     * @param Query $query
     */
    protected function prepareRanges($query) {
        foreach($this->getRangeProperties() as $tableField => $rangeProperties) {
            list($fromProperty, $toProperty) = $rangeProperties;

            if ($this->$fromProperty) {
                $query->andWhere(['>=', $tableField, $this->$fromProperty]);
            }
            if ($this->$toProperty) {
                $query->andWhere(['<=', $tableField, $this->$toProperty]);
            }
        }
    }

    /**
     * @param Query $query
     */
    protected function prepareBooleans($query) {
        foreach($this->getBoolProperties() as $boolProperty) {
            if ($this->$boolProperty) {
                $query->andWhere([$boolProperty => $this->$boolProperty]);
            }
        }
    }

    /**
     * @param Query $query
     */
    protected function prepareStrings($query) {
        foreach($this->getStringProperties() as $stringProperty) {
            if ($this->$stringProperty) {
                $query->andWhere([$stringProperty => $this->$stringProperty]);
            }
        }
    }
    /**
     * @param Query $query
     */
    protected function prepareMinValues($query) {
        foreach($this->getMinValueProperties() as $minValueProperty) {
            if ($this->$minValueProperty) {
                $query->andWhere(['>=', $minValueProperty, (integer) $this->$minValueProperty]);
            }
        }
    }

    /**
     * @param Query $query
     */
    protected function prepareLists($query) {
        foreach($this->getListProperties() as $listProperty) {

            // $listProperty could be either a string or a key-value array
            // In the second case key is the name of the field in search model, and the value is the name
            // of the advert model attribute
            if (is_array($listProperty)) {
                $searchListProperty = key($listProperty);
                $listProperty = $listProperty[$searchListProperty];
            } else {
                $searchListProperty = $listProperty;
            }

            if (!$this->$searchListProperty || !is_array($this->$searchListProperty)) {
                continue;
            }

            $listValues = $this->$searchListProperty;

            if (count($listValues) == 1 && in_array('', $listValues)) {
                continue;
            }

            $query->andWhere(['in', $listProperty, $listValues]);
        }
    }

    /**
     * @param Query $query
     */
    protected function preparePositionTitle($query){
        if($this->positionTile && $this->zoom) {
            $query->andWhere('address.tile' . MapTilesComponent::getZoom($this->zoom) . ' = GeomFromText("POINT(' . doubleval($this->positionTile[0]) . ' ' . doubleval($this->positionTile[1]) . ')")');
        }
    }

    protected function getBoolProperties() {
        switch ($this->realtyCategory ?: RealtyType::getCategory($this->realtyType)) {
            case RealtyCategory::LIVING:
                return array_merge($this->boolProperties, $this->livingBoolProperties);
            case RealtyCategory::COUNTRY:
                return array_merge($this->boolProperties, $this->countryBoolProperties);
            case RealtyCategory::COMMERCIAL:
                return array_merge($this->boolProperties, $this->commercialBoolProperties);
            default:
                return [];
        }
    }

    protected function getListProperties() {
        switch ($this->realtyCategory ?: RealtyType::getCategory($this->realtyType)) {
            case RealtyCategory::LIVING:
                return array_merge($this->listProperties, $this->livingListProperties);
            case RealtyCategory::COUNTRY:
                return array_merge($this->listProperties, $this->countryListProperties);
            case RealtyCategory::COMMERCIAL:
                return array_merge($this->listProperties, $this->commercialListProperties);
            default:
                return [];
        }
    }

    protected function getStringProperties() {
        switch ($this->realtyCategory ?: RealtyType::getCategory($this->realtyType)) {
            case RealtyCategory::LIVING:
                return array_merge($this->stringProperties, $this->livingStringProperties);
            case RealtyCategory::COUNTRY:
                return array_merge($this->stringProperties, $this->countryStringProperties);
            case RealtyCategory::COMMERCIAL:
                return array_merge($this->stringProperties, $this->commercialStringProperties);
            default:
                return [];
        }
    }

    protected function getRangeProperties() {
        switch ($this->realtyCategory ?: RealtyType::getCategory($this->realtyType)) {
            case RealtyCategory::LIVING:
                return array_merge($this->rangeProperties, $this->livingRangeProperties);
            case RealtyCategory::COUNTRY:
                return array_merge($this->rangeProperties, $this->countryRangeProperties);
            case RealtyCategory::COMMERCIAL:
                return array_merge($this->rangeProperties, $this->commercialRangeProperties);
            default:
                return [];
        }
    }

    protected function getMinValueProperties() {
        switch ($this->realtyCategory ?: RealtyType::getCategory($this->realtyType)) {
            case RealtyCategory::LIVING:
                return array_merge($this->minValueProperties, $this->livingMinValueProperties);
            case RealtyCategory::COUNTRY:
                return array_merge($this->minValueProperties, $this->countryMinValueProperties);
            case RealtyCategory::COMMERCIAL:
                return array_merge($this->minValueProperties, $this->commercialMinValueProperties);
            default:
                return [];
        }
    }

}
