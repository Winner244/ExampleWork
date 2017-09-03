<?php
namespace app\advert\enums;

use app\advert\models\BaseRealty;
use app\advert\models\CommercialRealty;
use app\advert\models\CountryRealty;
use app\advert\models\LivingRealty;
use app\core\base\AppEnum;
use yii\base\Exception;

class RealtyCategory extends AppEnum {

	const LIVING = 'living';
	const COUNTRY = 'country';
	const COMMERCIAL = 'commercial';

	public static function getLabels()
	{
		return [
			self::LIVING => \Yii::t('app', 'Residential'),
			self::COUNTRY => \Yii::t('app', 'Suburban'),
			self::COMMERCIAL => \Yii::t('app', 'Commercial'),
		];
	}

    /**
     * @param string $id
     * @return LivingRealty|CountryRealty|CommercialRealty
     * @throws Exception
     */
    public static function getClass($id)
    {
        $classesByName = [
            self::LIVING => LivingRealty::className(),
            self::COUNTRY => CountryRealty::className(),
            self::COMMERCIAL => CommercialRealty::className(),
        ];

        if (isset($classesByName[$id])) {
            return $classesByName[$id];
        }

        throw new Exception("Unknown realty model type: {$id}");
    }
}