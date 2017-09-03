<?php

namespace app\advert\models;


use app\core\base\AppModel;

/**
 * Class BaseRealty
 * @package app\advert\models
 *
 * @property integer $id
 * @property integer $advertId
 * @property-read Advert $advert
 */
class BaseRealty extends AppModel
{
    /**
     * Get group names that match this model
     *
     * @param array $attributes
     * @return array
     */
    public static function getMatchingGroupsByAttr($attributes) {
        return [];
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['id', 'advertId'], 'integer'],
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

    public function getAdvert()
    {
        return $this->hasOne(Advert::className(), ['id' => 'advertId']);
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => \Yii::t('app', 'ID'),
            'advertId' => \Yii::t('app', 'Advert ID'),
        ];
    }

    public function fields()
    {
        return array_merge(parent::fields(), [
            'advert' => 'advert',
        ]);
    }

    public function beforeSave($insert) {
        if (!$this->advertId && $this->advert) {
            $this->advertId = $this->advert->id;
        }

        return parent::beforeSave($insert);
    }

    public function beforeDelete()
    {
        $advertModel = Advert::findOne($this->advertId);

        return parent::beforeDelete() && ($advertModel ? $advertModel->delete() : true);
    }

    /**
     * Get base realty attributes along with related Advert's attributes
     *
     * @param bool $advertFull
     * @return array
     */
    public function getFullAttributes($advertFull = false) {
        return array_merge($this->getAttributes(), [
            'advert' => $advertFull ?
                $this->advert->getFullAttributes() :
                $this->advert->getAttributes()
        ]);
    }

    public function getFullOldAttributes() {
        return array_merge($this->getOldAttributes(), [
            'advert' => $this->advert->getOldAttributes()
        ]);
    }

    public static function getByAdvertId($advertId) {
        $submodels = [LivingRealty::className(), CountryRealty::className(), CommercialRealty::className()];

        foreach($submodels as $subRealtyClassName) {
            $subRealtyRecord = $subRealtyClassName::findOne([
                'advertId' => $advertId
            ]);

            if ($subRealtyRecord) {
                return $subRealtyRecord;
            }
        }

        return null;
    }

    public static function getByAdvertUid($advertUid) {
        $advertId = Advert::find()->where(['uid' => $advertUid])->select('id')->scalar();

        if (!$advertId) {
            return null;
        }

        return self::getByAdvertId($advertId);
    }
}