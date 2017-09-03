'use strict';

const Jii = require('jii');
const React = require('react');
const Layout = require('../../../profile/layouts/web_profile');
const SearchResultsWidget = require('../../../search/widgets/SearchResults/SearchResultsWidget');
const DataProviderLoader =  require('../../../core/widgets/DataProviderLoader/DataProviderLoader');

require('../../less/myAdverts.less');

/**
 * @class app.advert.views.advert.myAdverts
 * @extends Jii.view.react.ReactView
 */
module.exports = Jii.defineClass('app.advert.views.advert.myAdverts', /** @lends app.advert.views.advert.myAdverts.prototype */{

    __extends: Layout,

    init(){
        this.label = Jii.t('app', 'My adverts');
        Jii.view.react.ReactView.listenModel(this, this.props.advertDataProvider);
    },

    componentWillMount() {
        // @todo set proper title if requested
        document.title = Jii.t('app', 'My adverts');
    },

    renderContent() {
        const adverts = this.props.advertDataProvider.getModels();
        if(!adverts || !adverts.length)
        {
            return (
                <div className='myAdverts__box-loader'>
                    <DataProviderLoader
                        dataProvider={this.props.advertDataProvider}
                    />
                </div>
            );
        }

        return (
            <SearchResultsWidget
                query=''
                dataProvider={this.props.advertDataProvider}
                advertSearch={this.props.advertSearch}
                urlQuery={false}
                urlApi='/advert/advert/my-adverts'
                spa={true}
            />
        );
    }
});