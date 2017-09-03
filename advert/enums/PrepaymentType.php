<?php
namespace app\advert\enums;

use app\core\base\AppEnum;
use Yii;

class PrepaymentType extends AppEnum {

    const ANY = '';
    const MONTH_1 = 'month_1';
    const MONTH_2 = 'month_2';
    const MONTH_3 = 'month_3';

    /**
     * @return array
     */
    public static function getLabels()
    {
        return [
            self::ANY => Yii::t('app', '{sex, select, other{Any}}', ['sex' => 'women']),
            self::MONTH_1 => Yii::t('app', 'not more than {count, number} {count, plural, one{month} other{months}}', ['count' => 1]),
            self::MONTH_2 => Yii::t('app', 'not more than {count, number} {count, plural, one{month} other{months}}', ['count' => 2]),
            self::MONTH_3 => Yii::t('app', 'not more than {count, number} {count, plural, one{month} other{months}}', ['count' => 3])
        ];
    }
}