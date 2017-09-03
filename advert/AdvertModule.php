<?php

namespace app\advert;

use app\advert\controllers\AdvertController;
use app\advert\models\Advert;
use app\advert\models\AdvertSummary;
use app\advert\models\BaseRealty;
use app\core\base\AppModule;
use yii\base\Event;

class AdvertModule extends AppModule {

    public $apilayerAccessKey;
    public $daysLifeAdverts;

    public function coreMenu() {
        return AdvertController::coreMenuItems();
    }

    public function init()
    {
        parent::init();

        Event::on(BaseRealty::className(), BaseRealty::EVENT_AFTER_INSERT, function($event) {
            /** @var BaseRealty $baseRealtyModel */
            $baseRealtyModel = $event->sender;

            AdvertSummary::incrementGroups(
                $baseRealtyModel::getMatchingGroupsByAttr($baseRealtyModel->getFullAttributes()),
                $baseRealtyModel->advert->address->cityId
            );
        });

        Event::on(BaseRealty::className(), BaseRealty::EVENT_BEFORE_DELETE, function($event) {
            /** @var BaseRealty $baseRealtyModel */
            $baseRealtyModel = $event->sender;

            AdvertSummary::decrementGroups(
                $baseRealtyModel::getMatchingGroupsByAttr($baseRealtyModel->getFullAttributes()),
                $baseRealtyModel->advert->address->cityId
            );
        });

        Event::on(BaseRealty::className(), BaseRealty::EVENT_BEFORE_UPDATE, function($event) {
            /** @var BaseRealty $baseRealtyModel */
            $baseRealtyModel = $event->sender;

            AdvertSummary::decrementGroups(
                $baseRealtyModel::getMatchingGroupsByAttr($baseRealtyModel->getFullOldAttributes()),
                $baseRealtyModel->advert->address->cityId
            );

            AdvertSummary::incrementGroups(
                $baseRealtyModel::getMatchingGroupsByAttr($baseRealtyModel->getFullAttributes()),
                $baseRealtyModel->advert->address->cityId
            );
        });

        Event::on(Advert::className(), BaseRealty::EVENT_BEFORE_UPDATE, function($event) {
            /** @var Advert $advertModel */
            $advertModel = $event->sender;

            /** @var BaseRealty $subRealtyRecord */
            $subRealtyRecord = BaseRealty::getByAdvertId($advertModel->id);

            if (!$subRealtyRecord) {
                return;
            }

            // Increment/decrement functions are accept attributes of BaseRealty type,
            // e.g. [..., 'advert' => [...]]
            // So we're constructing this kind of array
            $oldAttributes = $subRealtyRecord->getOldAttributes();
            $oldAttributes['advert'] = $advertModel->getOldAttributes();
            $newAttributes = $subRealtyRecord->getAttributes();
            $newAttributes['advert'] = $advertModel->getAttributes();

            AdvertSummary::decrementGroups(
                $subRealtyRecord::getMatchingGroupsByAttr($oldAttributes),
                $advertModel->address->cityId
            );

            AdvertSummary::incrementGroups(
                $subRealtyRecord::getMatchingGroupsByAttr($newAttributes),
                $advertModel->address->cityId
            );
        });
    }

}