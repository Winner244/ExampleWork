<?php

namespace app\advert\models;

use app\core\base\AppModel;
use app\file\models\File;

/**
 *
 * @property integer $advertUid
 * @property string $fileUid
 * @property boolean $isMain
 * @property-read File $file

 */
class AdvertFile extends AppModel
{

    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'adverts_files';
    }

    public function getFile()
    {
        return $this->hasOne(File::className(), ['uid' => 'fileUid']);
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['fileUid', 'advertUid'], 'string', 'max' => 36],
            ['isMain', 'boolean']
        ];
    }
}
