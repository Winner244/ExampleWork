'use strict';

const Jii = require('jii');
const React = require('react');
const ReactDOM = require('react-dom');
const ReactView = require('jii-view/react/ReactView');
const ActiveForm = require('jii-view/react/form/ActiveForm.jsx');
const ActiveField = require('jii-view/react/form/ActiveField.jsx');
const Input = require('jii-view/react/form/Input.jsx');
const ButtonPopover = require('../../../core/widgets/ButtonPopover/ButtonPopover');
const ButtonsRadioField = require('../../../core/widgets/Form/ButtonsRadioField/ButtonsRadioField');
const ButtonCheckbox = require('../../../core/widgets/Form/ButtonCheckbox/ButtonCheckbox');
const TypeRealtyField = require('../../../core/widgets/Form/TypeRealtyField/TypeRealtyField');
const AddressField = require('../../../core/widgets/Form/AddressField/AddressField');
const DropDownField = require('../../../core/widgets/Form/DropDownField/DropDownField');
const AvailabilityThingsType = require('../../../advert/enums/AvailabilityThingsType');
const BathroomType = require('../../../advert/enums/BathroomType');
const RealtyRoomType = require('../../../advert/enums/RealtyRoomType');
const HomeType = require('../../../advert/enums/HomeType');
const ClassBuildingType = require('../../../advert/enums/ClassBuildingType');
const RealtyCategory = require('../../../advert/enums/RealtyCategory');
const RealtyType = require('../../../advert/enums/RealtyType');
const OperationType = require('../../../advert/enums/OperationType');
const RepairType = require('../../../advert/enums/RepairType');
const TenantsType = require('../../../advert/enums/TenantsType');
const PrepaymentType = require('../../../advert/enums/PrepaymentType');
const CommissionType = require('../../../advert/enums/CommissionType');
const StatusObjectType = require('../../../advert/enums/StatusObjectType');
const SaleType = require('../../../advert/enums/SaleType');
const HeatingType = require('../../../advert/enums/HeatingType');
const ContractType = require('../../../advert/enums/ContractType');
const EntryType = require('../../../advert/enums/EntryType');
const YearNewBuildingsType = require('../../../advert/enums/YearNewBuildingsType');
const FurnishType = require('../../../advert/enums/FurnishType');
const StageBuildType = require('../../../advert/enums/StageBuildType');
const NewBuildingType = require('../../../advert/enums/NewBuildingType');
const LivingRealty = require('../../../advert/models/LivingRealty');
const CountryRealty = require('../../../advert/models/CountryRealty');
const CommercialRealty = require('../../../advert/models/CommercialRealty');
const Advert = require('../../../advert/models/Advert');
const Cities = require('../../../advert/enums/Cities');
const CurrencyType = require('../../../core/enums/CurrencyType');
const FileInputView = require('../../../file/widgets/FileInputView/FileInput');
const RichTextEditor = require('../../../core/widgets/RichTextEditor/RichTextEditor');
const Address = require('../../models/Address');
const MapSelectAddress = require('../MapSelectAddress/MapSelectAddress');
const SearchModule = require('../../../search/SearchModule');

const _union = require('lodash/union');

require('./AdvertEditForm.less');


/**
 * @class app.advert.widgets.AdvertEditForm.AdvertEditFormWidget
 * @extends Jii.view.react.ReactView
 */
module.exports = Jii.defineClass('app.advert.widgets.AdvertEditForm.AdvertEditFormWidget', /** @lends app.advert.widgets.AdvertEditForm.AdvertEditFormWidget.prototype */{

    __extends: ReactView,

    __static: {
        defaultProps: {
            priceForMeterFieldVisible: true,
            address: {
                placeId: Cities.getPlaceId(Cities.MADRID),
                location: Cities.getLocation(Cities.MADRID),
            },
            backUrl: null,
            userContactInfo: null,
        }
    },

    state: {
        operationType: null,
        realtyType: null,
        disableSubmit: false
    },

    livingModel: null,
    countryModel: null,
    commercialModel: null,

    init(){
        SearchModule.initializationGoogleScript(window.JII_CONFIG.application.params.apiPlaceAutocompleteAccessKey);
        const optionInitialization = { //for create advert in models (not work without this)
            'advert': {
                'currencyCode': CurrencyType.DEFAULT,
                'contactName': this.props.userContactInfo ? this.props.userContactInfo.contactName : '',
                'contactPhone': this.props.userContactInfo ? this.props.userContactInfo.contactPhone : '',
                'contactEmail': this.props.userContactInfo ? this.props.userContactInfo.contactEmail : '',
            }
        };

        //new
        this.livingModel = new LivingRealty(optionInitialization);
        this.livingModel.get('advert').set({'address': new Address()});

        this.countryModel = new CountryRealty(optionInitialization);
        this.countryModel.get('advert').set({'address': new Address()});

        this.commercialModel = new CommercialRealty(optionInitialization);
        this.commercialModel.get('advert').set({'address': new Address()});


        //load
        if (this.props.model) {
            switch (RealtyType.getRealtyCategory(this.props.model['advert']['realtyType'])) {
                case RealtyCategory.LIVING:
                    this.livingModel.setAttributes(this.props.model);
                    this.livingModel.get('advert').setAttributes(this.props.model['advert']);
                    break;


                case RealtyCategory.COUNTRY:
                    this.countryModel.setAttributes(this.props.model);
                    this.countryModel.get('advert').setAttributes(this.props.model['advert']);
                    break;

                case RealtyCategory.COMMERCIAL:
                    this.commercialModel.setAttributes(this.props.model);
                    this.commercialModel.get('advert').setAttributes(this.props.model['advert']);
                    break;
            }

            this.state.operationType = this.props.model['advert']['operationType'];
            this.state.realtyType = this.props.model['advert']['realtyType'];
        }

        //bind
        this._onChangeAddress = this._onChangeAddress.bind(this);
        this._onChangeOperationType = this._onChangeOperationType.bind(this);
        this._onChangeRealtyType = this._onChangeRealtyType.bind(this);
        this._onSubmit = this._onSubmit.bind(this);
    },

    componentWillMount() {
        // @todo set proper title if requested
        document.title = this.props.model ? Jii.t('app', 'Editing advert') : Jii.t('app', 'Addition advert');
    },

    arrayIteration(to){
        const array = [];
        for (let i = 1; i <= to; i++) {
            array.push({value: i, label: i});
        }
        return array;
    },

    getCurrentModel(realtyCategory){
        let model = this.livingModel;
        switch (realtyCategory) {
            case RealtyCategory.COMMERCIAL:
                model = this.commercialModel;
                break;

            case RealtyCategory.COUNTRY:
                model = this.countryModel;
                break;
        }

        return model;
    },

    _onChangeOperationType(newValue){
        this.setState({'operationType': newValue});

        this.livingModel.set('advert.operationType', newValue);
        this.countryModel.set('advert.operationType', newValue);
        this.commercialModel.set('advert.operationType', newValue);
    },

    _onChangeRealtyType(newValue){
        this.setState({'realtyType': newValue});

        this.livingModel.set('advert.realtyType', newValue);
        this.countryModel.set('advert.realtyType', newValue);
        this.commercialModel.set('advert.realtyType', newValue);
    },

    addNone(array){
        return [
            {
                value: null,
                label: Jii.t('app', 'Not chosen')
            }
        ].concat(array);
    },

    _onChangeAddress(e, placeId, title = null) {
        if(placeId)
        {
            this.livingModel.set({'advert.placeId': placeId});
            this.countryModel.set({'advert.placeId': placeId});
            this.commercialModel.set({'advert.placeId': placeId});
        }

        if(title){
            this.livingModel.set({'advert.address.title': title});
            this.countryModel.set({'advert.address.title': title});
            this.commercialModel.set({'advert.address.title': title});
        }

        this.forceUpdate();
    },

    _onSubmit(){
        this.setState({disableSubmit: true});
        const model = this.getCurrentModel(RealtyType.getRealtyCategory(this.state.realtyType));
        let dataModels = model.getAttributes();
        dataModels.advert = model.get('advert').getAttributes();
        const photos = ReactDOM.findDOMNode(this).querySelector('input[name=photos]').value.split(',');
        const photos_uidMainFile = ReactDOM.findDOMNode(this).querySelector('input[name=photos_uidMainFile]').value;

        Jii.app.rpc.send(
            'advert/advert/api-update',
            {
                model: dataModels,
                photos: photos,
                uidMainFile: photos_uidMainFile
            })
            .then(response => {
                if (response.errors) {
                    model.setErrors(response.errors.model);
                    this.setState({disableSubmit: false});

                    //TODO: very bad code (render react kill scroll)
                    setTimeout(() => window.$('html,body').stop().scrollTop(window.$('.has-error').offset().top - 300), 100);
                }
                else {
                    location.href = this.props.backUrl && this.props.backUrl != location.href
                        ? this.props.backUrl
                        : Jii.app.clientRouter.createUrl(['/advert/advert/my-adverts']);
                }
            });
    },

    render() {
        const realtyCategory = RealtyType.getRealtyCategory(this.state.realtyType);
        const typesRealtyField = RealtyType.getValues(null, this.state.operationType);
        const selectTypeRealty = typesRealtyField.filter((v) => v.value === this.state.realtyType).shift();

        const model = this.getCurrentModel(realtyCategory);

        return (
            <ActiveForm
                model={model}
                layout='horizontal'
                cols={[3, 7]}
                options={{
                    method: 'post',
                    encType : 'multipart/form-data',
                    className: 'AdvertEditForm'
                }}
                onSubmit={this._onSubmit}
            >
                <ButtonsRadioField
                    attribute='advert.operationType'
                    values={[
                        {value: OperationType.BUY, label: OperationType.getAddAdvertLabel(OperationType.BUY)},
                        {value: OperationType.LONG, label: OperationType.getAddAdvertLabel(OperationType.LONG)},
                        {value: OperationType.SHORT, label: OperationType.getAddAdvertLabel(OperationType.SHORT)},
                    ]}
                    onChange={this._onChangeOperationType}
                    active={!this.props.model}
                />

                {this.state.operationType &&
                <div>
                    <ActiveField
                        attribute='advert.realtyType'
                    >
                        {!this.props.model &&
                        <ButtonPopover
                            label={selectTypeRealty ? RealtyType.getLabel(selectTypeRealty.value) : Jii.t('app', 'Select')}
                            className='TypeRealtyField__popover'
                            typeClose={'focus'}
                        >
                            <TypeRealtyField
                                attribute='advert.realtyType'
                                values={typesRealtyField}
                                onSelectTypeRealtyChange={this.handleSelectTypeRealtyChange}
                                onChange={this._onChangeRealtyType}
                            />
                        </ButtonPopover>
                        }
                        {this.props.model &&
                        <button type='button' className='btn btn-primary disabled'>
                            {RealtyType.getLabel(this.props.model['advert']['realtyType'])}
                        </button>
                        }
                    </ActiveField>

                    {this.state.realtyType && this.renderShowRealtyType() }

                </div>
                }
            </ActiveForm>
        );
    },

    renderShowRealtyType(){
        //for short code
        const realtyCategory = RealtyType.getRealtyCategory(this.state.realtyType);
        const model = this.getCurrentModel(realtyCategory);

        const isCommercial = realtyCategory == RealtyCategory.COMMERCIAL;
        const isLiving = realtyCategory == RealtyCategory.LIVING;
        const isCountry = realtyCategory == RealtyCategory.COUNTRY;
        const isBuy = this.state.operationType == OperationType.BUY;
        const isShort = this.state.operationType == OperationType.SHORT;
        const isLong = this.state.operationType == OperationType.LONG;

        return (
            <div>
                {this.props.model &&
                <span>
                        <Input attribute='advert.createTime' inputOptions={{'disabled': true}}/>
                        <Input attribute='advert.endTimeShow' inputOptions={{'disabled': true}}/>
                    </span>
                }

                {<AddressField
                    attribute='advert.placeId'
                    titleAttribute='advert.address.title'
                    locationAttribute='advert.address.location'
                    label={Jii.t('app', 'Address')}
                    inputOptions={{'required': true}}
                    typesAddress={['address']}
                    onAddressChange={this._onChangeAddress}
                />}

                <MapSelectAddress
                    locationCity={this.props.address ? this.props.address.location: null}
                    placeId={model.get('advert.placeId')}
                    onChangeMarkerMap={this._onChangeAddress}
                />

                <ActiveField
                    attribute='advert.price'
                >
                    <Input
                        attribute='advert.price'
                        inputOptions={{'required': true, 'className': 'AdvertEditForm__join'}}
                        layout='inline'/>

                    <ButtonsRadioField
                        attribute={'advert.currencyCode'}
                        values={CurrencyType.getValuesWithSymbols()}
                        layout='inline'
                    />
                </ActiveField>

                {(isLiving || RealtyType.isAreaConfigurable(null, this.state.realtyType) && this.state.realtyType != RealtyType.PLAT) &&
                <Input attribute='advert.areaSize'/>
                }

                {(isLiving || isCommercial) &&
                <Input attribute='advert.floor'/>
                }

                {this.state.realtyType != RealtyType.PLAT && (
                    <Input attribute='advert.floorTotal'/>
                )}

                {(!isCommercial && this.state.realtyType != RealtyType.PLAT ||
                isCommercial && RealtyType.isCommercialBuildFields(this.state.realtyType)) && (
                    <ActiveField
                        attribute='advert.homeType'
                        label={(
                            isLiving ?
                                Jii.t('app', 'House type') : (
                                    isCountry ?
                                        Jii.t('app', 'Material of house') :
                                        Jii.t('app', 'Building type')
                                )
                        )}
                    >
                        <DropDownField
                            attribute='advert.homeType'
                            items={this.addNone(isLiving ?
                                (this.state.realtyType == RealtyType.FLAT_NEW ?
                                        HomeType.getValuesNewBuilding(true) :
                                        HomeType.getValuesLivingCategory(true)
                                ) :
                                isCountry ?
                                    HomeType.getValuesCountryCategory(true) :
                                    HomeType.getValuesCommercialCategory(true))
                            }
                            layout='inline'
                        />
                    </ActiveField>
                )}

                {isLiving && this.renderLivingGroups()}

                {isCountry && this.renderCountryGroups()}

                {isCommercial && this.renderCommercialGroups()}

                {(isLiving || isCountry) && isBuy && (
                    <ActiveField
                        attribute='advert.statusObjectType'
                        label={ isLiving ?
                            Jii.t('app', 'Status premises') :
                            Jii.t('app', 'Status of plot')
                        }
                    >
                        <DropDownField
                            attribute='advert.statusObjectType'
                            items={this.addNone(isLiving ?
                                StatusObjectType.getValuesLivingCategory(true) :
                                StatusObjectType.getValuesCountryCategory(true))
                            }
                            layout='inline'
                        />
                    </ActiveField>
                )}

                {(isLiving || isCountry) &&
                this.state.realtyType != RealtyType.PLAT && this.state.realtyType != RealtyType.FLAT_NEW && (
                    <span>
                        <ButtonsRadioField
                            attribute='advert.repairType'
                            values={RepairType.getValues()}
                        />

                        <ButtonsRadioField
                            attribute='advert.bathroomType'
                            values={isLiving ? BathroomType.getValuesLivingCategory() : BathroomType.getValuesCountryCategory()}
                        />
                    </span>
                )}

                {(isLong || isShort) && (
                    <span>
                        <ActiveField
                            attribute='id'
                            label={Jii.t('app', 'The composition of tenants')}
                        >
                            <ButtonsRadioField
                                attribute='advert.tenantsType'
                                values={TenantsType.getValuesRadio()}
                                layout='inline'
                            />
                            &nbsp;
                            {TenantsType.getValuesChecked(true).map(item => (
                                <ButtonCheckbox
                                    key={item.value}
                                    attribute={'advert.' + item.value}
                                    label={item.label}
                                    layout='inline'
                                />
                            ))}
                        </ActiveField>

                        {isLong && (
                            <ActiveField
                                attribute='id'
                                label={Jii.t('app', 'Commission')}
                            >
                                <ButtonsRadioField
                                    attribute='advert.commissionType'
                                    values={CommissionType.getValues()}
                                    layout='inline'
                                />
                                &nbsp;
                                <ButtonCheckbox
                                    attribute='advert.agentsCanCall'
                                    layout='inline'
                                />
                            </ActiveField>
                        )}
                                    </span>
                )}

                {(isLiving || isCountry) && isLong && (
                    <ActiveField
                        attribute='id'
                        label={Jii.t('app', 'Prepayment')}
                    >
                        <DropDownField
                            emptyLabel={PrepaymentType.getAddFormLabel(PrepaymentType.ANY)}
                            attribute='advert.prepaymentType'
                            items={PrepaymentType.getAddFormValues()}
                            layout='inline'
                        />
                        &nbsp;
                        <ButtonCheckbox
                            attribute='advert.no_pledge'
                            label={AvailabilityThingsType.getFormLabel('no_pledge')}
                            layout='inline'
                        />
                    </ActiveField>
                )}

                <Input attribute='advert.contactPhone'/>
                <Input attribute='advert.contactEmail'/>
                <Input attribute='advert.contactName'/>

                {this.renderAvailabilityThings(realtyCategory)}

                <RichTextEditor attribute='advert.description'/>

                <ActiveField
                    attribute='id'
                    label={Jii.t('app', 'A photo')}
                >
                    <FileInputView
                        options={{
                            name: 'photos',
                            files: this.props.model ? this.props.model['advert']['photos'] : '',
                            multiple: true
                        }}
                    />
                </ActiveField>

                <div className='text-center'>
                    <input
                        type={this.state.disableSubmit ? 'button' : 'submit'}
                        className={'btn btn-primary ' + (this.state.disableSubmit ? 'disabled' : '')}
                        value={this.props.model ? Jii.t('app', 'Save') : Jii.t('app', 'Add')}
                    />
                </div>
            </div>
        );
    },

    renderLivingGroups(){
        const isBuy = this.state.operationType == OperationType.BUY;
        const rooms = RealtyRoomType.getValues(null, this.state.operationType, this.state.realtyType);

        return (
            <span>
                 {rooms.length > 0 &&
                 <ActiveField
                     attribute='roomType'
                     label={Jii.t('app', 'Type rooms')}
                 >
                     <DropDownField
                         attribute='roomType'
                         emptyLabel={Jii.t('app', 'Not chosen')}
                         items={rooms}
                         layout='inline'
                     />
                 </ActiveField>
                 }

                <Input attribute='areaSizeLiving' inputOptions={{'required': true}}/>
                <Input attribute='areaSizeKitchen'/>

                {isBuy && (
                    <ButtonsRadioField
                        attribute='advert.saleType'
                        values={this.state.realtyType == RealtyType.FLAT_NEW ?
                            SaleType.getValuesNewBuildingForm() :
                            SaleType.getValuesLiving()}
                    />
                )}

                {!isBuy && (
                    <ActiveField
                        attribute='id'
                        label={Jii.t('app', 'Bathroom')}
                    >
                        {AvailabilityThingsType.getValuesLivingCategoryLongShortOperation(true).map(item => (
                            <ButtonCheckbox
                                key={item.value}
                                attribute={item.value}
                                label={item.label}
                                layout='inline'
                            />
                        ))}
                    </ActiveField>
                )}

                {this.state.realtyType != RealtyType.FLAT_NEW && (
                    <span>
                         <DropDownField
                             attribute='countBathroom'
                             emptyLabel={Jii.t('app', 'None')}
                             items={_union([{
                                 value: 0,
                                 label: Jii.t('app', 'None')
                             }], this.arrayIteration(4))}
                         />

                        <ActiveField
                            attribute='id'
                            label={Jii.t('app', 'Lift count')}
                        >
                            <DropDownField
                                attribute='countLift'
                                emptyLabel={Jii.t('app', 'None')}
                                items={_union([{
                                    value: 0,
                                    label: Jii.t('app', 'None')
                                }], this.arrayIteration(4))}
                                layout='inline'
                            />
                            &nbsp;
                            <ButtonCheckbox
                                attribute='cargo_lift'
                                label={AvailabilityThingsType.getFormLabel('cargo_lift')}
                                layout='inline'
                            />
                        </ActiveField>

                        <ActiveField
                            attribute='id'
                            label={Jii.t('app', 'balcony')}
                        >
                            <ButtonCheckbox
                                attribute='balcony'
                                label={AvailabilityThingsType.getFormLabel('balcony')}
                                layout='inline'
                            />
                            <ButtonCheckbox
                                attribute='loggia'
                                label={AvailabilityThingsType.getFormLabel('loggia')}
                                layout='inline'
                            />
                        </ActiveField>

                        <ActiveField
                            attribute='id'
                            label={Jii.t('app', 'Windows')}
                        >
                            <ButtonCheckbox
                                attribute='window_to_street'
                                layout='inline'
                            />
                            <ButtonCheckbox
                                attribute='window_to_yard'
                                layout='inline'
                            />
                        </ActiveField>

                    </span>
                )}

                {this.state.realtyType == RealtyType.FLAT_NEW && (
                    <span>
                        <ButtonsRadioField
                            attribute='yearNewBuilding'
                            values={YearNewBuildingsType.getValues(true)}
                        />

                        <ButtonsRadioField
                            attribute='furnishType'
                            values={FurnishType.getValues()}
                        />

                        <ButtonsRadioField
                            attribute='stageBuildType'
                            values={StageBuildType.getValues()}
                        />

                        <ButtonsRadioField
                            attribute='typeNewBuildings'
                            values={NewBuildingType.getValues()}
                        />
                    </span>
                )}

            </span>
        );
    },

    renderCountryGroups(){
        const isBuy = this.state.operationType == OperationType.BUY;

        return (
            <span>
                <Input attribute='areaSizePlat'/>

                {isBuy && (
                    <ActiveField
                        attribute='id'
                        label={Jii.t('app', 'Availability on plot')}
                    >
                        {AvailabilityThingsType.getValuesCountryCategoryBuyOperationArea(true).map(item => (
                            <ButtonCheckbox
                                key={item.value}
                                attribute={'advert' + item.value}
                                label={item.label}
                                layout='inline'
                            />
                        ))}
                    </ActiveField>
                )}

                {this.state.realtyType != RealtyType.PLAT && (
                    <span>
                        <ButtonsRadioField
                            attribute='heatingType'
                            values={HeatingType.getValues()}
                        />

                        <DropDownField
                            attribute='countBedroom'
                            emptyLabel={Jii.t('app', 'None')}
                            items={_union([{
                                value: 0,
                                label: Jii.t('app', 'None')
                            }], this.arrayIteration(7))}
                        />
                    </span>
                )}
            </span>
        );
    },

    renderCommercialGroups(){
        const isBuy = this.state.operationType == OperationType.BUY;

        return (
            <span>
                {this.state.realtyType != RealtyType.GARAGE && (
                    <ButtonsRadioField
                        attribute='contractType'
                        values={isBuy ? ContractType.getValuesBuyOperation() : ContractType.getValuesShortLongOperation()}
                    />
                )}

                {RealtyType.isCommercialBuildFields(this.state.realtyType) && (
                    <span>
                        <ButtonsRadioField
                            attribute='classBuilding'
                            values={ClassBuildingType.getValues()}
                        />

                        <Input attribute='countRooms'/>

                        <ActiveField
                            attribute='id'
                            label={Jii.t('app', 'Phone lines count minimum')}
                        >
                            <Input
                                attribute='countPhoneLine'
                                layout='inline'
                                inputOptions={{
                                    style: {
                                        width: 150
                                    },
                                    className: 'AdvertEditForm__join'
                                }}
                            />
                            <ButtonCheckbox
                                attribute='possibilityExpansionPhoneLines'
                                layout='inline'
                            />
                        </ActiveField>

                    </span>
                )}

                {RealtyType.isExistingEntryType(this.state.realtyType) && (
                    <ButtonsRadioField
                        attribute='entryType'
                        values={EntryType.getValues()}
                    />
                )}
            </span>
        );
    },

    renderAvailabilityThings(realtyCategory){
        const isBuy = this.state.operationType == OperationType.BUY;
        const isShort = this.state.operationType == OperationType.SHORT;
        const isLong = this.state.operationType == OperationType.LONG;

        if (!(isShort || isLong) &&
            this.state.realtyType != RealtyType.PLAT &&
            this.state.realtyType != RealtyType.GARAGE) {
            return null;
        }
        const AdvertAttributes = Object.keys(Advert.getTableSchema().columns);

        return (
            <ActiveField
                attribute='id'
                label={AvailabilityThingsType.getTextHeader(realtyCategory)}
            >
                {AvailabilityThingsType.getValuesRealtyCategory(realtyCategory, isBuy).map(item => (
                    <ButtonCheckbox
                        key={item.value}
                        attribute={(AdvertAttributes.indexOf(item.value) != -1 ? 'advert.' : '') + item.value}
                        label={item.label}
                        radioValues={[AvailabilityThingsType.NO_FURNITURE, AvailabilityThingsType.FURNITURE]}
                        layout='inline'
                    />
                ))}
            </ActiveField>

        );
    },

});
