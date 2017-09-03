<?php
namespace app\advert\controllers;

use app\advert\enums\OperationShortType;
use app\advert\enums\OperationType;
use app\advert\enums\RealtyCategory;
use app\advert\enums\RealtyType;
use app\advert\forms\AdvertApiSearch;
use app\advert\models\Advert;
use app\advert\models\AdvertFile;
use app\advert\models\BaseRealty;
use app\advert\models\City;
use app\advert\models\LivingRealty;
use app\core\components\AccessChecker;
use app\advert\enums\Cities;
use app\core\CoreModule;
use app\core\models\User;
use app\profile\models\Favorite;
use Yii;
use app\advert\forms\AdvertSearch;
use app\core\base\AppController;
use yii\web\NotFoundHttpException;
use yii\filters\VerbFilter;
use yii\filters\AccessControl;
use app\profile\enums\UserRole;
use extpoint\megamenu\MenuHelper;

class AdvertController extends AppController
{
    public $layout = '@app/core/layouts/web_profile';

    public static function coreMenuItems()
    {
        $user = Yii::$app->has('user') && Yii::$app->user->model;

        return [
            [
                'label' => $user && Yii::$app->user->model->role == UserRole::ADMIN ?
                    \Yii::t('app', 'Adverts') :
                    \Yii::t('app', 'My adverts'),
                'url' => ["/advert/advert/index"],
                'urlRule' => "adverts",
                'visible' => $user,
                'items' => [
                    [
                        'label' => \Yii::t('app', 'Editing'),
                        'url' => ["/advert/advert/update", 'advertUid' => MenuHelper::paramGet('advertUid')],
                        'urlRule' => "/advert/update/<advertUid>",
                        'roles' => UserRole::USER,
                        'accessCheck' => function($url) {
                            return [
                                AccessChecker::RULE_MODEL_UPDATE,
                                'model' => Advert::findOne(['uid' => $url['advertUid']]),
                            ];
                        },
                        'visible' => false
                    ],
                    [
                        'label' => \Yii::t('app', 'Delete'),
                        'url' => ["/advert/advert/delete", 'advertUid' => MenuHelper::paramGet('advertUid')],
                        'urlRule' => "/advert/delete/<advertUid>",
                        'roles' => UserRole::USER,
                        'accessCheck' => function($url) {
                            return [
                                AccessChecker::RULE_MODEL_DELETE,
                                'model' => Advert::findOne(['uid' => $url['advertUid']]),
                            ];
                        },
                        'visible' => false
                    ],
                    [
                        'label' => \Yii::t('app', 'Add advert'),
                        'url' => ["/advert/advert/update"],
                        'roles' => UserRole::USER,
                        'urlRule' => "advert/add",
                        'visible' => false
                    ],
                    [
                        'label' => \Yii::t('app', 'View'),
                        'url' => ["/advert/advert/view", 'advertUid' => MenuHelper::paramGet('advertUid')],
                        'urlRule' => "/advert/view/<advertUid>",
                        'roles' => UserRole::USER,
                        'visible' => false
                    ],
                ]
            ],
            [
                'label' => \Yii::t('app', 'My adverts'),
                'url' => ["/advert/advert/my-adverts"],
                'roles' => UserRole::USER,
                'urlRule' => "my-adverts",
                'visible' => $user
            ],
        ];
    }

    public function behaviors()
    {
        return [
            'verbs' => [
                'class' => VerbFilter::className(),
                'actions' => [
                    //'delete' => ['post'],
                ],
            ],
            'access' => [
                'class' => AccessControl::className(),
                'rules' => [
                    [
                        'allow' => true,
                        'roles' => [UserRole::USER],
                    ],
                    [
                        'allow' => true,
                        'actions' => ['index', 'api-top3'],
                        'roles' => [UserRole::ADMIN],
                    ],
                    [
                        'allow' => true,
                        'actions' => ['api-search', 'api-get', 'api-update', 'api-get-favorites', 'api-get-counts'],
                        'roles' => ['?'],
                    ],
                ],
            ],
        ];
    }

    /**
     * @return mixed
     */
    public function actionIndex(){
        $advertSearchModel = new AdvertSearch();
        $dataProvider = $advertSearchModel->search(Yii::$app->request->queryParams);

        return $this->render('index', [
            'advertSearchModel' => $advertSearchModel,
            'dataProvider' => $dataProvider,
        ]);
    }


    public function actionMyAdverts(){
        $this->layout = '@app/core/layouts/web_startup';
        $advertApiSearch = new AdvertSearch();
        $advertApiSearch->userId =  Yii::$app->user->id;

        $dataProvider = null;

        try{
            $dataProvider = $advertApiSearch->search([]);
            $dataProvider->pagination->page = isset(Yii::$app->request->get()['page']) ?
                intval(Yii::$app->request->get()['page']) || 0 : 0;
        }
        catch (\Exception $error){
            throw new NotFoundHttpException();
        }

        return $this->renderApp([
            'application' => [
                'components' => [
                    'db' => [
                        'data' => [
                            'adverts_base_realty' => array_map(function($model){
                                //from Advert -> to AdvertLiving|AdvertCountry|AdvertCommercial
                                /** @var Advert $model */
                                $class = RealtyCategory::getClass(RealtyType::getCategory($model->realtyType));
                                return $class::findOne(['advertId' => $model->id]);
                            }, $dataProvider->getModels()),
                        ],
                    ],
                ],
            ],
            'context' => [
                'params' => [
                    'totalCount' => $dataProvider->getTotalCount(),
                ],
            ],
        ]);
    }


    /**
     * Search adverts by $searchParams and return models' properties
     *
     * @param array $pagination
     * @param array $searchParams
     * @return array
     */
    public function actionApiSearchMyAdverts(array $pagination, array $searchParams = [])
    {
        $advertSearch = new AdvertSearch();
        $advertSearch->userId = \Yii::$app->user->id;
        $advertSearch->load($searchParams);
        $dataProvider = $advertSearch->search([], false);
        $dataProvider->pagination->page = $pagination['page'];
        $dataProvider->pagination->pageSize = $pagination['pageSize'];

        return [
            'models' => array_map(function($model){
                //from Advert -> to AdvertLiving|AdvertCountry|AdvertCommercial
                /** @var Advert $model */
                $class = RealtyCategory::getClass(RealtyType::getCategory($model->realtyType));
                return $class::findOne(['advertId' => $model->id]);
            }, $dataProvider->getModels()),
            'totalCount' => $dataProvider->getTotalCount(),
        ];
    }

    /**
     * @param number|null $advertUid
     * @return string|\yii\web\Response
     * @throws NotFoundHttpException
     */
    public function actionUpdate($advertUid = null)
    {
        $this->layout = '@app/core/layouts/web_startup';
        $user = Yii::$app->user->model;
        $advertId = null;
        $realtyType = null;

        if ($advertUid) {
            /** @var Advert $advert */
            $advert = Advert::find()->where(['uid' => $advertUid])->one();

            //protected
            if(!(Yii::$app->user->model->role == UserRole::ADMIN || Yii::$app->user->model->id == $advert->userId)){
                throw new NotFoundHttpException();
            }

            $realtyType = $advert->realtyType;
            $advertId = $advert->primaryKey;
        }
        else {
            $city = City::getCityByIp();

            return $this->renderApp([
                'context' => [
                    'params' => [
                        'address' =>
                            isset($city->placeId) ?
                                [
                                    'placeId' => $city->placeId,
                                    'location' => $city->location
                                ] :
                                [
                                    'placeId' => Cities::getPlaceId(Cities::MADRID),
                                    'location' => Cities::getLocation()[Cities::MADRID],
                                ],
                        'backUrl' => null,
                        'userContactInfo' => [
                            'contactName' => $user->info->contactName,
                            'contactPhone' => $user->info->contactPhone,
                            'contactEmail' => $user->info->contactEmail,
                        ]
                    ]
                ]
            ]);
        }

        /** @var BaseRealty $realtyModel */
        $realtyClass = RealtyCategory::getClass(RealtyType::getCategory($realtyType));
        $realtyModel = $realtyClass::find()->where(['advertId' => $advertId])->one();

        if (!$realtyModel) {
            throw new NotFoundHttpException('Error! lost data.');
        }

        if (!$realtyModel->advert->userId) {
            $realtyModel->advert->userId = Yii::$app->user->model->id;
        }

        return $this->renderApp([
            'context' => [
                'params' => [
                    'model' =>  $realtyModel ? $realtyModel : null,
                    'address' => null,
                    'userContactInfo' => null,
                    'backUrl' => Yii::$app->request->referrer
                ]
            ]
        ]);
    }

    /**
     * @param array $model
     * @param array $photos
     * @param string $uidMainFile
     * @return array
     */
    public function actionApiUpdate(array $model, array $photos, $uidMainFile)
    {
        $advertUid = $model['advert']['uid'];
        $advertId = null;
        $realtyType = null;

        if ($advertUid) {
            /** @var Advert $advert */
            $advert = Advert::find()->where(['uid' => $advertUid])->one();

            //protected
            if(!(Yii::$app->user->model->role == UserRole::ADMIN || Yii::$app->user->model->id == $advert->userId)){
                return null;
            }
            $realtyType = $advert->realtyType;
            $advertId = $advert->primaryKey;
        }
        else {
            $realtyType = $model['advert']['realtyType'];
        }

        /** @var BaseRealty $realtyModel */
        $realtyModel = null;
        $realtyClass = RealtyCategory::getClass(RealtyType::getCategory($realtyType));

        if ($advertUid) {
            $realtyModel = $realtyClass::find()->where(['advertId' => $advertId])->one();

            if (!$realtyModel) {
                return ['errors' => 'not found realty model!'];
            }
        } else {
            unset($model['id']);
            unset($model['advertId']);
            unset($model['advert']['id']);
            unset($model['advert']['uid']);
            unset($model['advert']['updateTime']);
            unset($model['advert']['createTime']);
            unset($model['advert']['endTimeShow']);
            unset($model['advert']['viewCount']);

            $realtyModel = new $realtyClass();
            $realtyModel->populateRelation('advert', new Advert());
            $realtyModel->advert->realtyType = $realtyType;
        }

        if ($realtyModel->advert->load($model, 'advert') &&
            $realtyModel->load($model, '') &&
            $realtyModel->advert->validate() &&
            $realtyModel->validate())
        {
            if (!$realtyModel->advert->userId) {
                $realtyModel->advert->userId = Yii::$app->user->model->id;
            }

            //for user not change time fields
            if ($advertUid) {
                $advert = Advert::find()->where(['id' => $advertId])->select(['createTime', 'endTimeShow'])->one();

                $realtyModel->advert->createTime = $advert->createTime;
                $realtyModel->advert->endTimeShow = $advert->endTimeShow;
            }

            //clear price (only numbers)
            $realtyModel->advert->price = $this->clearNumber($realtyModel->advert->price);


            //save
            if($realtyModel->advert->save(false) && $realtyModel->save(false)){
                /** @var AdvertFile $fileModel */
                foreach ($realtyModel->advert->files as $fileModel) {
                    if($fileModel->file)
                    {
                        $key = array_search($fileModel->fileUid, $photos);

                        if($key !== false){
                            array_splice($photos, $key, 1);

                            //change files
                            $fileModel->isMain = $fileModel->fileUid == $uidMainFile;
                            $fileModel->save();
                        }
                        else{

                            //delete files
                            $fileModel->file->isTemp = true;
                            $fileModel->file->save();
                            $fileModel->delete();
                        }
                    }
                }

                //add new files
                foreach ($photos as $newFileUid) {
                    if($newFileUid){
                        $advertFile = new AdvertFile([
                            'advertUid' => $realtyModel->advert->uid,
                            'fileUid' => $newFileUid,
                            'isMain' => $newFileUid == $uidMainFile,
                        ]);

                        if ($advertFile->validate() && $advertFile->save()) {
                            $advertFile->file->isTemp = false;
                            $advertFile->file->save();
                        }
                    }
                }

                if($advertUid){
                    Yii::$app->session->setFlash('success', Yii::t('app', 'Advert successfully changed!'));
                }
                else{
                    Yii::$app->session->setFlash('success', Yii::t('app', 'Advert successfully added!'));

                    \Yii::$app->mailer
                        ->compose('@app/auth/mail/addAdvert', [])
                        ->setTo(Yii::$app->user->model->email)
                        ->send();
                }
                return [];
            }
        }

        $errors = [];
        foreach ($realtyModel->advert->getErrors() as $key=>$value){
            $errors['advert.' . $key] = $value;
        }
        $errors = array_merge($errors, $realtyModel->getErrors());

        return [
            'errors' => [
                'model' =>$errors
            ]
        ];
    }

    /**
     * @param integer $advertUid
     * @return mixed
     */
    public function actionView($advertUid)
    {
        return $this->render('view', [
            'advertModel' => $this->findModel($advertUid),
        ]);
    }

    /**
     * @param integer $advertUid
     * @param string $backUrl
     * @return mixed
     */
    public function actionDelete($advertUid, $backUrl = null)
    {
        $advert = $this->findModel($advertUid);

        //protection
        if($advert && (Yii::$app->user->model->role == UserRole::ADMIN || Yii::$app->user->model->id == $advert->userId)){
            $advert->delete();
        }

        if($backUrl !== null){
            if($backUrl == ''){
                $urlRedirect = ['index'];
                Yii::$app->session->setFlash('success', Yii::t('app', 'Advert successfully deleted!'));
            }
            else{
                $urlRedirect = substr($backUrl, 1);
            }
        }
        else{
            $urlRedirect = Yii::$app->request->referrer ?: ['index'];
            Yii::$app->session->setFlash('success', Yii::t('app', 'Advert successfully deleted!'));
        }

        return $this->redirect($urlRedirect);
    }


    /**
     * @param integer $uid
     * @return Advert
     * @throws NotFoundHttpException
     */
    protected function findModel($uid)
    {
        /** @var Advert $advertModel */
        $advertModel = Advert::find()->where(['uid' => $uid])->one();
        if (!$advertModel) {
            throw new NotFoundHttpException();
        }

        return $advertModel;
    }

    /**
     * Search adverts by $searchParams and return models' properties
     *
     * @param array $params values to be loaded into AdvertApiSearch model
     * @param array $pagination
     * @return array
     */
    public function actionApiSearch(array $params, array $pagination)
    {
        // Detect location
        if (!empty($params['placeId'])) {
            $values['placeId'] = Cities::getPlaceId($params['placeId']) ?: $params['placeId'];
            $location = CoreModule::getInstance()->addressManager->fetchAddress($values['placeId'])['location'];
            $params['addressLocation'] = $location ? $location[0] . ',' . $location[1] : $params['addressLocation'];
        }

        if(!empty($params['userUid'])){
            $params['userId'] = User::findOne(['uid' => $params['userUid']])->id;
        }
        $dataProvider = (new AdvertApiSearch())->search($params, false);
        $dataProvider->pagination->page = $pagination['page'];
        $dataProvider->pagination->pageSize = $pagination['pageSize'];

        return [
            'models' => $dataProvider->getModels(),
            'totalCount' => $dataProvider->getTotalCount(),
            'addressLocation' => isset($params['addressLocation']) ? $params['addressLocation'] : '',
            'counts' => !empty($params['realtyCategory'])
                ? $this->getCounts(
                    !empty($params['userUid']) ? $params['userUid'] : null,
                    !empty($params['advertId']) ? $params['advertId'] : null)
                : null
        ];
    }

    /**
     * @param $advertUid
     * @return array|null|\yii\db\ActiveRecord
     */
    public function actionApiGet($advertUid)
    {
        return BaseRealty::getByAdvertUid($advertUid);
    }
    
    /**
     *
     * @param string $number
     * @return string
     */
    public function clearNumber($number){

        $priceClear = '';
        $firstDelimiter = true;
        for($i = strlen($number) - 1; $i > -1; $i--){
            if(is_numeric($number[$i])){
                $priceClear = $number[$i] . $priceClear;
            }
            else if($firstDelimiter && ($number[$i] == '.' || $number[$i] == ',')){
                $priceClear = '.' . $priceClear;
                $firstDelimiter = false;
            }
        }

        return $priceClear;
    }

    public static function getCounts($userUid = null, $advertIds = null){
        //create counts
        $counts = [];
        $counts[OperationShortType::BUY] = [];
        $counts[OperationShortType::RENT] = [];
        foreach ($counts as $key => $value){
            foreach (RealtyCategory::getKeys() as $realtyCategory){
                $query = Advert::find()->andWhere(['>', 'endTimeShow', date("Y-m-d H:i:s")]);
                if($userUid){
                    $query->where(['userId' => User::findOne(['uid' => $userUid])->id]);
                }
                if($advertIds){
                    $query->andWhere(['in', 'id', $advertIds]);
                }
                if($key == OperationShortType::RENT){
                    $query->andWhere(['or',
                        ['operationType' => OperationType::LONG],
                        ['operationType' => OperationType::SHORT]]);
                }
                else{
                    $query->andWhere(['operationType' => $key]);
                }
                $counts[$key][$realtyCategory] = $query->andWhere(['in', 'realtyType', RealtyType::getRealtyTypesByCategory($realtyCategory)])->count();
            }
        }

        //sum by operations
        foreach ($counts as $key => $value){
            $counts[$key]['count'] = 0;
            foreach ($value as $realtyCategoryCount){
                $counts[$key]['count'] += $realtyCategoryCount;
            }
        }

        return $counts;
    }

    public function actionApiTop3($advertId){
        $advert = Advert::findOne(['id' => $advertId]);
        if($advert){
            $advert->top3 = !$advert->top3;
            $advert->save();
            return true;
        }
        return false;
    }

    public static function getAdvertsTop3(){
        $advertsTop3 = [];
        $advertsTop3[OperationShortType::BUY] = RealtyCategory::getLabels();
        $advertsTop3[OperationShortType::RENT] = array_merge(RealtyCategory::getLabels(), [OperationType::SHORT => []]);

        foreach ($advertsTop3 as $operationShortType => $realtyCategories){
            foreach ($realtyCategories as $realtyCategory => $array){
                //get 3 random adverts
                $query = Advert::find()
                    ->where(['top3' => true])
                    ->andWhere('SELECT COUNT(*) FROM `adverts_files` WHERE `advertUid`=adverts_realty.uid')
                    ->orderBy('RAND()')
                    ->select(['realtyType', 'id'])
                    ->limit(3);

                if(array_search($realtyCategory, RealtyCategory::getKeys()) !== false){
                    $query->andWhere(['in', 'realtyType', RealtyType::getRealtyTypesByCategory($realtyCategory)]);

                    if($operationShortType == OperationShortType::RENT){
                        $query->andWhere(['or',
                            ['operationType' => OperationType::LONG],
                            ['operationType' => OperationType::SHORT]]);
                    }
                    else{
                        $query->andWhere(['operationType' => $operationShortType]);
                    }
                }
                else{
                    $query->andWhere(['operationType' => $realtyCategory]);
                }

                $advertsTop3[$operationShortType][$realtyCategory] = $query->all();

                $advertsTop3[$operationShortType][$realtyCategory] = array_map(function($advert){
                    $realtyClass = RealtyCategory::getClass(RealtyType::getCategory($advert->realtyType));
                    return $realtyClass::findOne(['advertId' => $advert->id]);
                }, $advertsTop3[$operationShortType][$realtyCategory]);
            }
        }

        return $advertsTop3;
    }
}
