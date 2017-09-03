<?php
namespace app\advert\enums;

use app\core\base\AppEnum;

class DatePublishedType extends AppEnum {

    const BUY = 'buy';
    const LONG = 'long';
    const SHORT = 'short';

    const ANYTIME = 'anytime';
    const TODAY = 'today';
    const MINUTE_5 = 'minute_5';
    const MINUTE_10 = 'minute_10';
    const MINUTE_15 = 'minute_15';
    const MINUTE_20 = 'minute_20';
    const MINUTE_30 = 'minute_30';
    const HOUR = 'hour';
    const HOUR_2 = 'hour_2';
    const HOUR_3 = 'hour_3';
    const HOUR_4 = 'hour_4';
    const HOUR_5 = 'hour_5';
    const HOUR_6 = 'hour_6';
    const HOUR_12 = 'hour_12';
    const HOUR_18 = 'hour_18';
    const DAY = 'day';
    const HOUR_36 = 'hour_36';
    const DAY_2 = 'day_2';
    const DAY_3 = 'day_3';
    const DAY_5 = 'day_5';
    const DAY_10 = 'day_10';
    const MONTH = 'month';

    const MINUTE_LENGTH = 60;
    const HOUR_LENGTH = 3600;
    const DAY_LENGTH = 86400;
    const MONTH_LENGTH = 2582000; // Consider month as 30 days

    /**
     * @param string $datePublishedType
     * @return integer
     */
    public static function getTimeOffset($datePublishedType) {
        $timeOffsets = [
            self::ANYTIME => 0,
            self::TODAY => self::TODAY,
            self::MINUTE_5 => 5 * self::MINUTE_LENGTH,
            self::MINUTE_10 => 10 * self::MINUTE_LENGTH,
            self::MINUTE_15 => 15 * self::MINUTE_LENGTH,
            self::MINUTE_20 => 20 * self::MINUTE_LENGTH,
            self::MINUTE_30 => 30 * self::MINUTE_LENGTH,
            self::HOUR => self::HOUR_LENGTH,
            self::HOUR_2 => 2 * self::HOUR_LENGTH,
            self::HOUR_3 => 3 * self::HOUR_LENGTH,
            self::HOUR_4 => 4 * self::HOUR_LENGTH,
            self::HOUR_5 => 5 * self::HOUR_LENGTH,
            self::HOUR_6 => 6 * self::HOUR_LENGTH,
            self::HOUR_12 => 12 * self::HOUR_LENGTH,
            self::HOUR_18 => 18 * self::HOUR_LENGTH,
            self::DAY => self::DAY_LENGTH,
            self::HOUR_36 => 36 * self::HOUR_LENGTH,
            self::DAY_2 => 2 * self::DAY_LENGTH,
            self::DAY_3 => 3 * self::DAY_LENGTH,
            self::DAY_5 => 5 * self::DAY_LENGTH,
            self::DAY_10 => 10 * self::DAY_LENGTH,
            self::MONTH => self::MONTH_LENGTH,
        ];

        return $datePublishedType === self::TODAY ?
            // @todo use visitor's timezone correction
            time() - strtotime("today midnight") :
            (isset($timeOffsets[$datePublishedType]) ? $timeOffsets[$datePublishedType] : 0);
    }

}