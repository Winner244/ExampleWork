<?php

namespace app\advert\models;

use Yii;
use \app\core\base\AppModel;
use yii\helpers\ArrayHelper;

/**
 *
 * @property string $code
 * @property string $name
 * @property double $rate
 */
class Currency extends AppModel {

    const EUR = 'EUR';
    const RUB = 'RUB';

    /**
     * @inheritdoc
     */
    public static function tableName() {
        return 'currency';
    }

    /**
     * @return array
     */
    public static function getLabels()
    {
        return Currency::find()->select('code')->asArray()->indexBy('code')->column();
    }

    /**
     * @inheritdoc
     */
    public function rules() {
        return [
            [['code'], 'required'],
            [['rate'], 'number'],
            [['code'], 'string', 'max' => 3],
            [['name'], 'string', 'max' => 255],
            [['code'], 'unique'],
        ];
    }

    /**
     * @inheritdoc
     */
    public function transactions()
    {
        return [
            self::SCENARIO_DEFAULT => self::OP_ALL,
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels() {
        return [
            'code' => \Yii::t('app', 'Code'),
            'name' => \Yii::t('app', 'Name'),
            'rate' => \Yii::t('app', 'Rate'),
        ];
    }
}
