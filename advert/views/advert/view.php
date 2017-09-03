<?php

namespace app\views;

use app\advert\models\Advert;
use app\profile\enums\UserRole;
use Yii;
use yii\helpers\Html;
use yii\web\View;
use yii\widgets\DetailView;

/* @var View $this */
/* @var Advert $advertModel */

?>

<h1><?= Html::encode($this->title) ?></h1>

<?= DetailView::widget([
    'model' => $advertModel,
    'attributes' => [
        [
            'attribute' => 'id',
            'visible' => \Yii::$app->user->can(UserRole::ADMIN),
        ],
        'uid',
        'price',
        'currencyCode',
        'createTime',
        'updateTime',
        'contactName',
        'contactPhone',
        'contactEmail:email',
        'address.title',
        'areaSize',
    ],
]) ?>
