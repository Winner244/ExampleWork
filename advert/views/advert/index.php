<?php

namespace app\views;

use app\advert\models\Currency;
use app\advert\models\Advert;
use app\core\widgets\AppActionColumn;
use app\core\widgets\AppActiveForm;
use Yii;
use yii\web\View;
use yii\helpers\Html;
use yii\grid\GridView;
use yii\data\ActiveDataProvider;
use app\advert\forms\AdvertSearch;
use app\core\widgets\GooglePlacesAutoComplete;

/* @var View $this */
/* @var AdvertSearch $advertSearchModel */
/* @var ActiveDataProvider $dataProvider */

?>

<p>
    <?= Html::a(\Yii::t('app', '+ Add advert'), ['update'], ['class' => 'btn btn-primary']) ?>
</p>


<?php $form = AppActiveForm::begin(['method' => 'get', 'action' => ['/advert/advert/index']]); ?>

<?= $form->field($advertSearchModel, 'priceFrom') ?>
<?= $form->field($advertSearchModel, 'priceTo') ?>
<?= $form->field($advertSearchModel, 'searchCurrencyCode')->dropDownList(Currency::getLabels()); ?>
<?= $form->field($advertSearchModel, 'areaSizeFrom') ?>
<?= $form->field($advertSearchModel, 'areaSizeTo') ?>
<?= $form->field($advertSearchModel, 'cityId')->widget(GooglePlacesAutoComplete::className(),
    [
        'autocompleteOptions' => ['types' => ['(cities)']],
        'titleAttribute' => 'cityTitle',
    ]); ?>


<div class="form-group">
    <div class="col-sm-offset-3 col-sm-6">
        <?= Html::submitButton(\Yii::t('app', 'Search'), ['class' => 'btn btn-primary']) ?>
    </div>
</div>

<?php AppActiveForm::end(); ?>



<?= GridView::widget([
    'dataProvider' => $dataProvider,
    'columns' => [
        ['class' => 'yii\grid\SerialColumn'],

        'id',
        'operationTypeLabel',
        'realtyTypeLabel',
        'price',
        'currencyCode',
        'areaSize',
        'address.title',

        [
            'class' => AppActionColumn::className(),
            'template' => '{view} {update} {delete}',
            'urlCreator' => function($action, $model, $key, $index) {
                /** @type Advert $model */
                switch ($action) {
                    case 'view':
                        return $model->getUrlView();
                    case 'update':
                        return ['/advert/advert/update', 'advertUid' => $model->uid];
                    case 'delete':
                        return ['/advert/advert/delete', 'advertUid' => $model->uid];
                }
                return '#';
            },
            'buttonOptions' => [
                'rel' => 'nofollow',
            ]
        ],
    ],
]); ?>