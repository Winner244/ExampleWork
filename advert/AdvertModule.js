'use strict';

const Jii = require('jii');
const Module = require('jii/base/Module');
const LayoutView = require('../core/layouts/web');

/**
 * @class app.profile.AdvertModule
 * @extends Jii.base.Module
 */
module.exports = Jii.defineClass('app.profile.AdvertModule', /** @lends app.profile.AdvertModule.prototype */{

    __extends: Module,

    csrfToken: null,

    layout: LayoutView,

    init() {
        // Require controllers after i18n init
        this.controllerMap = {
            AdvertController: require('./controllers/AdvertController')
        };
    },
});
