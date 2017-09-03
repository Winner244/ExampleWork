'use strict';

const Jii = require('jii');
const React = require('react');
const ReactView = require('jii-view/react/ReactView');
const _noop = require('lodash/noop');


require('./MapSelectAddress.less');


/**
 * @class app.advert.widgets.MapSelectAddress.MapSelectAddress
 * @extends Jii.view.react.ReactView
 */
module.exports = Jii.defineClass('app.advert.widgets.MapSelectAddress.MapSelectAddress', /** @lends app.advert.widgets.MapSelectAddress.MapSelectAddress.prototype */{

    __extends: ReactView,

    __static: {
        defaultProps: {
            locationCity: null,
            placeId: null,
            onChangeMarkerMap: _noop,
        }
    },

    insideChange: false,
    placeId: null, //for protected from render without change address
    marker: null,
    map: null,

    init() {
        this._initMap = this._initMap.bind(this);
        this._onChangeMarker = this._onChangeMarker.bind(this);
    },

    componentDidMount() {
        if(window.scriptGoogleMap) {
            window.scriptGoogleMap.onloudFunctions.push(this._initMap);
        }
        this._initMap();
    },

    _initMap(){
        if (!window.google) {
            return;
        }

        this.map = new google.maps.Map(document.getElementById('map'), {
            zoom: 10,
            center: this.props.locationCity
                ? {
                    lat: parseFloat(this.props.locationCity.split(',')[0]),
                    lng: parseFloat(this.props.locationCity.split(',')[1])
                }
                : null
        });

        this.addMarkerById(true);

        this.map.addListener('click', (e) => {
            this._onChangeMarker(e.latLng);
        });
    },

    addMarkerById(setCenter = false){
        if(window.google && this.props.placeId != this.placeId){
            var geocoder = new google.maps.Geocoder;
            geocoder.geocode({'placeId': this.props.placeId}, (results, status) => {
                if (status === google.maps.GeocoderStatus.OK && results[0]) {
                    if(setCenter){
                        this.map.setZoom(17);
                        this.map.setCenter(results[0].geometry.location);
                    }
                    this.placeId = this.props.placeId;
                    this.insideChange = false;
                    this.addMarker(results[0].geometry.location);
                }
            });
        }
    },

    addMarker(latLng){
        if (this.marker) {
            this.marker.setMap(null);
        }

        this.marker = new google.maps.Marker({
            position: latLng,
            draggable: true,
            map: this.map
        });

        google.maps.event.addListener(this.marker, 'dragend', (e) => {
            this._onChangeMarker(e.latLng);
        });
    },

    _onChangeMarker(latLng){
        var geocoder = new google.maps.Geocoder;
        geocoder.geocode({'location': latLng}, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK && results[0]) {
                this.addMarker(latLng);
                this.insideChange = true;
                this.props.onChangeMarkerMap(null, results[0]['place_id'], results[0]['formatted_address']);
            }
            else if(status == 'OVER_QUERY_LIMIT'){
                Jii.log('Превышен лимит кликаний по карте!!');
            }
        });
    },

    render(){
        this.addMarkerById(!this.insideChange); //if new placeId

        return (
            <div id='map' className='MapSelectAddress__map'></div>
        );
    }

});