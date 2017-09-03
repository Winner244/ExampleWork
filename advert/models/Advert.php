<?php

namespace app\advert\models;

use app\advert\AdvertModule;
use app\advert\enums\Cities;
use app\core\base\AppModel;
use app\core\CoreModule;
use app\core\models\User;
use app\core\validators\PhoneValidator;
use app\file\FileModule;
use app\file\models\File;
use app\advert\enums\OperationType;
use app\advert\enums\RealtyType;
use app\profile\enums\UserLanguage;
use app\profile\models\WatchChangePrice;
use app\search\enums\RealtyMenuItems;
use extpoint\yii2\behaviors\TimestampBehavior;
use extpoint\yii2\behaviors\UidBehavior;
use Yii;
use yii\base\Exception;

/**
 *
 * @property integer $id
 * @property string $placeId
 * @property string $cityId

 * @property integer $areaSize
 * @property integer $floor
 * @property integer $floorTotal
 * @property string $basementType
 * @property string $realtyType
 * @property string $bathroomType
 * @property string $tenantsType
 * @property string $prepaymentType
 * @property string $commissionType
 * @property string $homeType
 * @property string $repairType
 * @property string $statusObjectType
 * @property string $saleType
 * @property string $fromOwner

 * @property bool $no_furniture
 * @property bool $furniture
 * @property bool $fridge
 * @property bool $conditioner
 * @property bool $internet
 * @property bool $kitchen
 * @property bool $phone
 * @property bool $tv
 * @property bool $dishwasher
 * @property bool $washer
 * @property bool $children
 * @property bool $pets
 * @property bool $no_pledge
 * @property bool $agentsCanCall
 * @property bool $top3
 * @property integer $developerId
 * @property-read Address $address
 * @property-read string $urlMainPhoto
 * @property-read array $files
 * @property-read array $photos
 * @property-read User $developer
 *
 * @property-read array $operationTypeLabel
 * @property-read array $realtyTypeLabel
 * @property-read array $priceChangeWatchEmails
 *
 * @property string $uid
 * @property integer $userId
 * @property string $price
 * @property string $type
 * @property string $createTime
 * @property string $updateTime
 * @property integer $viewCount
 * @property string $contactName
 * @property string $contactPhone
 * @property string $contactEmail
 * @property string $currencyCode
 * @property string $description
 * @property string $operationType
 * @property string $endTimeShow

 */
class Advert extends AppModel
{

    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'adverts_realty';
    }

    /**
     * Declares attribute hints.
     */
    public function attributeHints()
    {
        return array(
            'areaSize' => \Yii::t('app', 'square meters.'),
        );
    }

    public function getUrlView($absolute = false){
        $params = ['search/search/view',
            'address' => Cities::getName($this->address->cityId) ?: $this->address->cityId,
            'menu' => RealtyMenuItems::getKey($this->operationType, $this->realtyType),
            'realtyType' => $this->realtyType,
            'advertUid' => $this->uid,
        ];

        if($absolute){
            return \Yii::$app->urlManager->createAbsoluteUrl($params);
        }
        return \Yii::$app->urlManager->createUrl($params);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getAddress()
    {
        return $this->hasOne(Address::className(), ['placeId' => 'placeId'])->where(['lang' => Yii::$app->language]);
    }

    public function getPriceChangeWatchEmails()
    {
        return $this->hasMany(WatchChangePrice::className(), ['advertId' => 'id']);
    }

    public function getFiles()
    {
        return $this->hasMany(AdvertFile::className(), ['advertUid' => 'uid']);
    }

    /**
     * @param bool $isPreview
     * @return string
     */
    public function getUrlMainPhoto($isPreview = false){
        $AdvertMainFile = $this->getFiles()->where(['isMain' => 1])->one();
        if($AdvertMainFile != null) {
            $file = File::findOne(['uid' => $AdvertMainFile->fileUid]);

            return $file
                ? $file->getPreviewImageUrl($isPreview ? FileModule::PROCESSOR_NAME_ADVERT_PREVIEW : FileModule::PROCESSOR_NAME_ORIGINAL)
                : '';
        }

        return '';
    }

    /**
     * @return array el = {url, isMain}
     */
    public function getPhotos(){
        $res = [];

        foreach($this->files as $photo) {
            $file = File::findOne(['uid' => $photo->fileUid]);

            if($file){
                array_push($res, $file->toArrayView($photo->isMain));
            }
        };

        return $res;
    }

    public function getCurrency()
    {
        return $this->hasOne(Currency::className(), ['code' => 'currencyCode']);
    }

    public function getUser()
    {
        return $this->hasOne(User::className(), ['id' => 'userId']);
    }

    public function getDeveloper()
    {
        return $this->hasOne(User::className(), ['id' => 'developerId']);
    }

    /**
     * @inheritdoc
     */
    public function canUpdatedByUser($user)
    {
        return $user->isMe($this->userId) && parent::canUpdatedByUser($user);
    }

    public function getOperationTypeLabel(){
        return OperationType::getAddAdvertLabel($this->operationType);
    }

    public function getRealtyTypeLabel(){
        return RealtyType::getLabel($this->realtyType);
    }

    /**
     * @inheritdoc
     */
    public function canDeletedByUser($user)
    {
        return $user->isMe($this->userId) && parent::canDeletedByUser ($user);
    }

    public function fields()
    {
        return array_merge(parent::fields(), [
            'address' => 'address',
            'photos' => 'photos',
            'user' => 'user',
            'developer' => 'developer',
            'urlView' => 'urlView',
            'urlMainPhoto' => 'urlMainPhoto',
        ]);
    }


    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['userId', 'viewCount'], 'integer'],
            [['createTime', 'updateTime', 'endTimeShow'], 'safe'],
            [['contactName', 'price'], 'string', 'max' => 2000],
            ['contactEmail', 'email'],
            ['contactPhone', PhoneValidator::className()],
            [['currencyCode'], 'string', 'max' => 3],
            ['currencyCode', 'default', 'value' => "EUR"],
            [['description'], 'string'],
            [['operationType'], 'string', 'max' => 32],
            ['uid', 'string', 'max' => 36],
            [['placeId', 'realtyType'], 'required'],
            [['floor', 'floorTotal'], 'number', 'min' => 0],
            [['areaSize'], 'number', 'min' => 1],
            [['placeId'], 'safe'],
            [['no_furniture', 'furniture', 'fridge', 'conditioner', 'internet', 'kitchen', 'phone', 'tv', 'dishwasher',
                'washer', 'children', 'pets', 'no_pledge', 'agentsCanCall', 'fromOwner', 'top3'], 'boolean'],
            [['realtyType'], 'string', 'max' => 255],
            [['bathroomType', 'tenantsType', 'prepaymentType', 'commissionType', 'homeType',
                'repairType', 'statusObjectType', 'saleType', 'basementType'], 'string', 'max' => 32],
            ['placeId', function() {
                if ($this->isAttributeChanged('placeId')) {
                    if(!CoreModule::getInstance()->addressManager->fetchAddress($this->placeId)){
                        throw new Exception('Not found city! placeId: ' . $this->placeId);
                    }
                }
            }]
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
    public function behaviors() {
        return [
            UidBehavior::className(),
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => \Yii::t('app', 'ID'),
            'placeId' => \Yii::t('app', 'Address'),
            'cityId' => \Yii::t('app', 'City Id'),
            'areaSize' => \Yii::t('app', 'Area size'),
            'floor' => \Yii::t('app', 'Floor'),
            'floorTotal' => \Yii::t('app', 'Floor total'),
            'basementType' => \Yii::t('app', 'Basement Type'),
            'realtyType' => \Yii::t('app', 'Type realty'),
            'realtyTypeLabel' => \Yii::t('app', 'Type realty'),
            'bathroomType' => \Yii::t('app', 'Bathroom type'),
            'tenantsType' => \Yii::t('app', 'The composition of tenants'),
            'prepaymentType' => \Yii::t('app', 'Prepayment'),
            'commissionType' => \Yii::t('app', 'Commission'),
            'homeType' => \Yii::t('app', 'Type home'),
            'repairType' => \Yii::t('app', 'Repair'),
            'statusObjectType' => \Yii::t('app', 'Status of object'),
            'saleType' => \Yii::t('app', 'Type sale'),

            'no_furniture' => \Yii::t('app', 'no furniture'),
            'furniture' => \Yii::t('app', 'furniture'),
            'fridge' => \Yii::t('app', 'fridge'),
            'conditioner' => \Yii::t('app', 'air conditioner'),
            'internet' => \Yii::t('app', 'internet'),
            'kitchen' => \Yii::t('app', 'kitchen'),
            'phone' => \Yii::t('app', 'phone'),
            'tv' => \Yii::t('app', 'tv'),
            'dishwasher' => \Yii::t('app', 'dishwasher'),
            'washer' => \Yii::t('app', 'washer'),
            'children' => \Yii::t('app', 'children allowed'),
            'pets' => \Yii::t('app', 'pets allowed'),
            'no_pledge' => \Yii::t('app', 'deposit collateral'),
            'agentsCanCall' => \Yii::t('app', 'Agents can call'),

            'address' => \Yii::t('app', 'Address'),
            'userId' => \Yii::t('app', 'User ID'),
            'price' => \Yii::t('app', 'Price'),
            'createTime' => \Yii::t('app', 'Create time'),
            'updateTime' => \Yii::t('app', 'Update time'),
            'viewCount' => \Yii::t('app', 'View count'),
            'contactName' => \Yii::t('app', 'Contact name'),
            'contactPhone' => \Yii::t('app', 'Contact phone'),
            'contactEmail' => \Yii::t('app', 'Contact email'),
            'currencyCode' => \Yii::t('app', 'Currency code'),
            'description' => \Yii::t('app', 'Description'),
            'operationType' => \Yii::t('app', 'Operation type'),
            'operationTypeLabel' => \Yii::t('app', 'Operation type'),
            'address.title' => \Yii::t('app', 'Address'),
            'fromOwner' => \Yii::t('app', 'From the owner'),
            'endTimeShow' => \Yii::t('app', 'End time display advert'),
        ];
    }

    public static function getCountByTile($lat, $lng, $zoom) {
        $zoom = (int) $zoom;
        $addressTileField = "tile{$zoom}";

        return Advert::find()
            ->joinWith('address address')
            ->andWhere("address.$addressTileField" . ' = GeomFromText("POINT(' . doubleval($lat) . ' ' . doubleval($lng) . ')")')
            ->all();
    }

    public function beforeSave($insert) {
        if(!$this->endTimeShow){
            $dateEndShow = date_create(date('Y-m-d H:i:s'))->modify('+ ' .AdvertModule::getInstance()->daysLifeAdverts . ' days');
            $this->endTimeShow = $dateEndShow->format('Y-m-d H:i:s');
        }
        if($this->isNewRecord){
            $this->createTime = gmdate('Y-m-d H:i:s');
        }
        $this->updateTime = gmdate('Y-m-d H:i:s');

        return parent::beforeSave($insert);
    }

    public function afterSave($insert, $changedAttributes)
    {
        parent::afterSave($insert, $changedAttributes);

        if(isset($changedAttributes['price']) || isset($changedAttributes['currencyCode'])){
            array_map(function($priceChangeWatchEmail) use($changedAttributes) {
                \Yii::$app->mailer
                    ->compose('@app/advert/mail/changePrice', [
                        'url' => $this->getUrlView(true),
                        'linkText' => $this->address->title,
                    ])
                    ->setTo($priceChangeWatchEmail->email)
                    ->send();
            }, $this->priceChangeWatchEmails);
        }
    }

    public function getFullAttributes(){
        return array_merge($this->getAttributes(), [
            'address' =>  $this->address->getAttributes(['title', 'placeId', 'location', 'cityId', 'lang']),
            'files' =>  $this->getPhotos(),
            'urlView' =>  $this->getUrlView()
        ]);
    }

    public static function getByUser($userId)
    {
        return self::find()
            ->andWhere(['userId' => $userId])
            ->all();
    }
}
