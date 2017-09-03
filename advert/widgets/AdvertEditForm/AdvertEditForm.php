<?php

namespace app\advert\widgets\AdvertEditForm;

use app\advert\models\CommercialRealty;
use app\advert\models\CountryRealty;
use app\advert\models\LivingRealty;
use app\core\base\AppWidget;

class AdvertEditForm extends AppWidget {
    /**
     * @var LivingRealty|CommercialRealty|CountryRealty
     */
    public $model;
    public $address;
    public $userContactInfo;
    public $backUrl;

    /**
     * Renders the widget.
     */
    public function run() {
        return $this->renderReact([
            'model' =>  $this->model ? $this->model->getFullAttributes(true) : null,
            'userContactInfo' => $this->userContactInfo,
            'address' => $this->address,
            'backUrl' => $this->backUrl,
        ]);
    }
}
