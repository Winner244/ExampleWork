<?php
namespace app\advert\enums;

use app\core\base\AppEnum;

class LevelType extends AppEnum {

    const NOT_FIRST = 'not_first';
    const NOT_LAST = 'not_last';
    const LAST = 'last';
    const BASEMENT = 'basement';
    const SEMI_BASEMENT = 'semi_basement';
    const FIRST = 'first';

    /**
     * @return array
     */
    public static function getBasementType(){
        return [self::BASEMENT, self::SEMI_BASEMENT];
    }
}