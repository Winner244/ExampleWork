<?php
namespace app\advert\enums;

use app\core\base\AppEnum;
use Yii;

class ContractType extends AppEnum {

    const DIRECT_LEASE = 'direct_lease';
    const SUBLEASE = 'sublease';
    const COOPERATIVE = 'cooperative';
    const SALE = 'sale';
    const TRANSFER_LEASE = 'transfer_lease';

    /**
     * @return array
     */
    public static function getLabels()
    {
        return [
            self::DIRECT_LEASE => Yii::t('app', 'Direct lease'),
            self::SUBLEASE => Yii::t('app', 'Sublease'),
            self::COOPERATIVE => Yii::t('app', 'Agreement joint work'),
            self::SALE => Yii::t('app', 'Object sale'),
            self::TRANSFER_LEASE => Yii::t('app', 'Assignment of lease rights')
        ];
    }
}