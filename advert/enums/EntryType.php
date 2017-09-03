<?php
namespace app\advert\enums;

use app\core\base\AppEnum;
use Yii;

class EntryType extends AppEnum {

    const FREEDOM = 'freedom';
    const PASS = 'pass';

    /**
     * @return array
     */
    public static function getLabels()
    {
        return [
            self::FREEDOM => Yii::t('app', '{gender, plural, other{Free}}', ['gender' => 'man']),
            self::PASS => Yii::t('app', 'According permit'),
        ];
    }
}