<?php
namespace app\advert\enums;

use app\core\base\AppEnum;
use Yii;

class RepairType extends AppEnum {

    const COSMETICS = 'cosmetics';
    const EURO = 'euro';
    const DESIGN = 'design';
    const NONE = 'none';

    /**
     * @return array
     */
    public static function getLabels()
    {
        return [
            self::COSMETICS => Yii::t('app', 'Cosmetic'),
            self::EURO => Yii::t('app', 'Western renovation'),
            self::DESIGN => Yii::t('app', 'Design'),
            self::NONE => Yii::t('app', 'Absent')
        ];
    }
}