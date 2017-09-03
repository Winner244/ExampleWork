<?php
namespace app\advert\enums;

use app\core\base\AppEnum;
use Yii;

class CommissionType extends AppEnum {

    const NONE = 'not';
    const EXCLUSIVE = 'exclusive';

    /**
     * @return array
     */
    public static function getLabels()
    {
        return [
            self::NONE => Yii::t('app', 'Absent'),
            self::EXCLUSIVE => Yii::t('app', 'Exclusive'),
        ];
    }
}