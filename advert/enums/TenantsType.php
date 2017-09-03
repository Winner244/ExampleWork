<?php
namespace app\advert\enums;

use app\core\base\AppEnum;
use Yii;

class TenantsType extends AppEnum {

    const ANY = 'any';
    const FAMILY = 'family';
    const MAN = 'man';
    const WOMEN = 'women';
    const CHILDREN = 'children';
    const PETS = 'pets';

    /**
     * @return array
     */
    public static function getLabels()
    {
        return [
            self::ANY => Yii::t('app', '{sex, select, other{Any}}', ['sex' => 'man']),
            self::FAMILY => Yii::t('app', 'Family'),
            self::MAN => Yii::t('app', 'Man'),
            self::WOMEN => Yii::t('app', 'Women'),
            self::CHILDREN => Yii::t('app', 'children allowed'),
            self::PETS => Yii::t('app', 'pets allowed'),
        ];
    }
}