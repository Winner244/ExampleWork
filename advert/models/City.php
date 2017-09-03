<?php

namespace app\advert\models;

use Yii;
use \app\core\base\AppModel;
use GeoIp2\Database\Reader;
use GeoIp2\Exception\AddressNotFoundException;
use app\advert\enums\Cities;
use app\core\CoreModule;
use yii\base\Exception;
use yii\db\ActiveQuery;

/**
 *
 * @property integer $id
 * @property string $placeId
 * @property string $location
 * @property string $title
 * @property string $shortTitle
 * @property string $lang
 * @property integer $geoipId
 * @property-read Address $address
 */
class City extends AppModel {

    /**
     * @inheritdoc
     */
    public static function tableName() {
        return 'cities';
    }

    /**
     * @return ActiveQuery
     */
    public static function find() {
        return parent::find()->select([
            'id',
            'placeId',
            'title',
            'shortTitle',
            'lang',
            'location' => 'CONCAT(X(location), ",", Y(location))',
        ]);
    }

    /**
     * @param string $ip
     * @return null|City
     * @throws Exception
     */
    public static function getCityByIp($ip = null){

        if(!$ip){
            if(Yii::$app->request && Yii::$app->request->userIP){
                $ip = Yii::$app->request->userIP;
            }
            else{
                return null;
            }
        }

        if(!file_exists(CoreModule::getInstance()->geoDataFileCityPath)){
            throw new Exception('Load geoip db file "GeoLite2-City.mmdb" from: "http://geolite.maxmind.com/download/geoip/database/GeoLite2-City.mmdb.gz" (http://dev.maxmind.com/ru/geolite2/)', 0);
        }
        
        $geoIp = new Reader(CoreModule::getInstance()->geoDataFileCityPath);

        try{
            $record = $geoIp->city($ip); //find in geoip
        }
        catch (AddressNotFoundException $error){
            $record = null; //not ip in geoip
        }
        finally{
            $geoIp->close();
        }

        if($record) {
            $cityDb = City::findOne(['geoipId' => $record->city->geonameId]); //find by geoipId in db

            if (!$cityDb) { //need find and fill field in db

                //all languages name geoip
                foreach ($record->city->names as $key => $cityName) {

                    //find in db by shortTitle
                    $cityDb = self::findOne(['shortTitle' => $cityName]);

                    if ($cityDb) { //found
                        array_map(function ($cityRowData) use ($record) { //add
                            $cityRowData->geoipId = $record->city->geonameId; //field
                            $cityRowData->save();
                        }, self::find()->where(['placeId' => $cityDb->placeId])->all());
                        break;
                    }
                }
            }
            return $cityDb;
        }

        return null;
    }

    /**
     * @inheritdoc
     */
    public function rules() {
        return [
            [['placeId', 'title'], 'required'],
            [['title', 'shortTitle'], 'string'],
            [['placeId', 'location'], 'string', 'max' => 255],
            [['lang'], 'string', 'max' => 5],
            [['geoipId'], 'number'],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels() {
        return [
            'id' => \Yii::t('app', 'ID'),
            'placeId' => \Yii::t('app', 'Address'),
            'title' => \Yii::t('app', 'Long Name'),
            'shortTitle' => \Yii::t('app', 'Short Name'),
            'lang' => \Yii::t('app', 'Lang'),
        ];
    }

}
