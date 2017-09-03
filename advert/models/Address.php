<?php

namespace app\advert\models;

use Yii;
use \app\core\base\AppModel;
use yii\db\ActiveQuery;

/**
 *
 * @property integer $id
 * @property string $placeId
 * @property string $cityId
 * @property string $title
 * @property string $shortTitle
 * @property string $lang
 * @property string $location
 * @property float $latitude
 * @property float $longitude
 * @property float $tile10
 */
class Address extends AppModel {

    /**
     * @inheritdoc
     */
    public static function tableName() {
        return 'address';
    }

    /**
     * @return ActiveQuery
     */
    public static function find() {
        return parent::find()->select([
            'id',
            'placeId',
            'cityId',
            'title',
            'shortTitle',
            'lang',
            'location' => 'CONCAT(X(location), ",", Y(location))',
        ]);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getCity()
    {
        return $this->hasOne(City::className(), ['placeId' => 'cityId'])->where(['lang' => Yii::$app->language]);
    }

    /**
     * @inheritdoc
     */
    public function rules() {
        return [
            [['placeId', 'title'], 'required'],
            [['title', 'shortTitle', 'cityId'], 'string'],
            [['location', 'placeId', 'cityId'], 'string', 'max' => 255],
            [['lang'], 'string', 'max' => 5],
            [['latitude', 'longitude'], 'number'],
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

    public function fields()
    {
        return array_merge(parent::fields(), [
            'city' => 'city',
        ]);
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels() {
        return [
            'id' => \Yii::t('app', 'ID'),
            'placeId' => \Yii::t('app', 'Address'),
            'cityId' => \Yii::t('app', 'City Address'),
            'title' => \Yii::t('app', 'Long Name'),
            'shortTitle' => \Yii::t('app', 'Short Name'),
            'lang' => \Yii::t('app', 'Lang'),
            'location' => \Yii::t('app', 'Location'),
        ];
    }
}
