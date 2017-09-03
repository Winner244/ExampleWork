<?php
namespace app\advert\enums;

use app\core\base\AppEnum;
use Yii;

class StageBuildType extends AppEnum {

    const PROJECT = 'project';
    const BUILD = 'build';
    const PASSED = 'passed';

    /**
     * @return array
     */
    public static function getLabels()
    {
        return [
            self::PROJECT => Yii::t('app', 'Project'),
            self::BUILD => Yii::t('app', 'Under construction'),
            self::PASSED => Yii::t('app', 'Was passed'),
        ];
    }
}