<?php

namespace app\advert\forms;

use app\advert\models\Address;
use app\advert\models\Currency;
use app\advert\models\Advert;
use app\core\models\User;
use yii\db\Query;
use Yii;
use yii\db\ActiveQuery;
use app\core\traits\SearchModelTrait;

class AdvertSearch extends Advert {

    use SearchModelTrait;

    public $priceFrom;
    public $priceTo;
    public $areaSizeFrom;
    public $areaSizeTo;
    public $cityId;
    public $cityTitle;
    public $userId;
    public $userUid;
    public $advertIds;
    public $searchCurrencyCode = Currency::EUR;


    /**
     * @inheritdoc
     */
    public function rules() {
        return [
            [['id', 'viewCount'], 'integer'],
            [['priceFrom', 'priceTo', 'areaSizeFrom', 'areaSizeTo', 'userId'], 'number'],
            [['createTime', 'updateTime', 'contactName', 'contactPhone', 'contactEmail', 'searchCurrencyCode', 'userUid'], 'safe'],
            [['cityId', 'cityTitle'], 'string', 'max' => 255]
        ];
    }

    protected function createQuery()
    {
        return Advert::find();
    }

    /**
     * @param ActiveQuery $query
     */
    protected function prepare($query)
    {
        $query
            ->orderBy(['createTime' => SORT_DESC])
            ->joinWith('currency currency')
            // @todo consider joinWith()
            ->leftJoin(Address::tableName() . ' address', 'address.placeId = adverts_realty.placeId')
            ->andWhere(['address.lang' => Yii::$app->language]);

        if($this->cityId) {
            $query->andWhere(['address.cityId' => $this->cityId]);
        }

        if($this->userId){
            $query->andWhere(['adverts_realty.userId' => $this->userId]);
        }
        if($this->userUid){
            $query->andWhere(['adverts_realty.userId' => User::findOne(['uid' => $this->userUid])->id]);
        }

        $this->preparePrice($query);

        if ($this->areaSizeFrom) {
            $query->andWhere("areaSize >= :areaSizeFrom", ['areaSizeFrom' => $this->areaSizeFrom]);
        }

        if ($this->areaSizeTo) {
            $query->andWhere("areaSize <= :areaSizeTo", ['areaSizeTo' => $this->areaSizeTo]);
        }

        if($this->advertIds){
            $query->andWhere(['in', 'id', $this->advertIds]);
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
        $columnFormula = "(price/currency.rate)";

        if ($this->priceFrom) {
            $query->andWhere("{$columnFormula} >= :priceFrom", ['priceFrom' => floor($this->priceFrom / $conversionRate)]);
        }

        if ($this->priceTo) {
            $query->andWhere("{$columnFormula} <= :priceTo", ['priceTo' => ceil($this->priceTo / $conversionRate)]);
        }
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels() {
        return [
            'priceFrom' => \Yii::t('app', 'Price from'),
            'priceTo' => \Yii::t('app', 'Price to'),
            'price' => \Yii::t('app', 'Price'),
            'currencyCode' => \Yii::t('app', 'Currency code'),
            'cityId' => \Yii::t('app', 'City'),

            'areaSizeFrom' => \Yii::t('app', 'Area size from'),
            'areaSizeTo' => \Yii::t('app', 'Area size to'),
            'areaSizeKitchenFrom' => \Yii::t('app', 'Area size kitchen from'),
            'areaSizeKitchenTo' => \Yii::t('app', 'Area size kitchen to'),
            'areaSizeLivingFrom' => \Yii::t('app', 'Area size living from'),
            'areaSizeLivingTo' => \Yii::t('app', 'Area size living to'),

            'countRoomsFrom' => \Yii::t('app', 'Rooms count from'),
            'countRoomsTo' => \Yii::t('app', 'Rooms count to'),
            'floorFrom' => \Yii::t('app', 'Floor from'),
            'floorTo' => \Yii::t('app', 'Floor to'),
            'floorTotalFrom' => \Yii::t('app', 'Floor count from'),
            'floorTotalTo' => \Yii::t('app', 'Floor count to'),
            'countLift' => \Yii::t('app', 'Lift count minimum'),
            'countBathroom' => \Yii::t('app', 'Bathroom count'),
            'contactPhone' => \Yii::t('app', 'Contact phone'),
            'countBedroom' => \Yii::t('app', 'Bedroom count minimum'),
            'countPhoneLine' => \Yii::t('app', 'Phone lines count minimum'),
            'searchCurrencyCode' => \Yii::t('app', 'Search currency code'),
            'operationType' => \Yii::t('app', 'Operation type'),
            'realtyType' => \Yii::t('app', 'Type realty'),
            'roomTypes' => \Yii::t('app', 'Type rooms'),
            'addressString' => \Yii::t('app', 'Address'),
            'datePublished' => \Yii::t('app', 'Advert publish date'),
            'windowViewType' => \Yii::t('app', 'Windows'),
            'bathroomType' => \Yii::t('app', 'Bathroom'),
            'tenantsType' => \Yii::t('app', 'The composition of tenants'),
            'prepaymentType' => \Yii::t('app', 'Prepayment'),
            'commissionType' => \Yii::t('app', 'Commission'),
            'contractType' => \Yii::t('app', 'Type contract'),
            'classBuilding' => \Yii::t('app', 'Class building'),
            'entryType' => \Yii::t('app', 'Entry'),
            'furnishType' => \Yii::t('app', 'Furnish'),
            'agentsCanCall' => \Yii::t('app', 'Without the «agents do not call»'),
            'priceForMeter' => \Yii::t('app', 'Price for meter'),
            'existingPhotos' => \Yii::t('app', 'Only with photos'),
            'possibilityExpansionPhoneLines' => \Yii::t('app', 'With the possibility of increasing'),
            'discountsAndPromotions' => \Yii::t('app', 'Discounts and promotions'),

            'typeNewBuildings' => \Yii::t('app', 'Type new building'),
            'floor' => \Yii::t('app', 'Floor'),
            'homeType' => \Yii::t('app', 'Type home'),
            'repairType' => \Yii::t('app', 'Repair'),
            'statusObjectType' => \Yii::t('app', 'Status premises'),
            'heatingType' => \Yii::t('app', 'Heating'),
            'saleType' => \Yii::t('app', 'Type sale'),
            'yearNewBuildingsType' => \Yii::t('app', 'Year of new buildings'),
            'stageBuildType' => \Yii::t('app', 'Stage of construction'),
            'no_furniture' => \Yii::t('app', 'no furniture'),
            'cargo_lift' => \Yii::t('app', 'cargo lift'),
            'pets' => \Yii::t('app', 'pets allowed'),
            'children' => \Yii::t('app', 'children allowed'),
            'no_pledge' => \Yii::t('app', 'deposit collateral'),
        ];
    }

}
