'use strict';

const Jii = require('jii');
const React = require('react');
const Layout = require('../../../profile/layouts/web_profile');
const AdvertEditForm = require('../../widgets/AdvertEditForm/AdvertEditFromWidget');

/**
 * @class app.advert.views.advert.update
 * @extends Jii.view.react.ReactView
 */
module.exports = Jii.defineClass('app.advert.views.advert.update', /** @lends app.advert.views.advert.update.prototype */{

    __extends: Layout,

    init(){
        this.label = Jii.t('app', 'Add advert');
    },

    renderContent() {
        return (
            <AdvertEditForm {...this.props}/>
        );
    }
});