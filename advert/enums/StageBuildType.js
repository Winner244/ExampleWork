'use strict';

var Jii = require('jii');
var Enum = require('../../core/base/Enum');

const PROJECT = 'project';
const BUILD = 'build';
const PASSED = 'passed';

/**
 * @module
 * @class
 * @extends Enum
 */
module.exports = Jii.defineClass('app.advert.enums.StageBuildType', {

    __extends: Enum,

    __static: /** @lends module.exports */{

        PROJECT: PROJECT,
        BUILD: BUILD,
        PASSED: PASSED,

        _labels: {
            [PROJECT]: Jii.t('app', 'Project'),
            [BUILD]: Jii.t('app', 'Under construction'),
            [PASSED]: Jii.t('app', 'Was passed')
        }
    }

});