<?php

namespace app\views;

use app\advert\models\CommercialRealty;
use app\advert\models\CountryRealty;
use app\advert\models\LivingRealty;
use app\advert\widgets\AdvertEditForm\AdvertEditForm;
use yii\web\View;
use Yii;

/* @var View $this */
/* @var CommercialRealty|LivingRealty|CountryRealty $model */
/* @var array|null $userContactInfo */
/* @var string $backUrl */
/* @var array $address */

?>

<?= AdvertEditForm::widget([
    'model' => $model,
    'userContactInfo' => $userContactInfo,
    'address' => $address,
    'backUrl' => $backUrl,
]) ?>

