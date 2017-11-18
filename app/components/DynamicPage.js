/**
 * Created by guoshuyu on 2017/11/10.
 */

import React, {Component} from 'react';
import {
    View, Text, StatusBar, ListView, RefreshControl, ActivityIndicator
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import styles from "../style"
import * as Constant from "../style/constant"
import I18n from '../style/i18n'
import loginActions from '../store/actions/login'
import userActions from '../store/actions/user'
import eventActions from '../store/actions/event'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import EventItem from './widget/EventItem'
import PullListView from './widget/PullLoadMoreListView'
import * as Config from '../config/'


/**
 * 动态 -> 我的关注，我的仓库
 */
class DynamicPage extends Component {

    constructor(props) {
        super(props);
        this._renderRow = this._renderRow.bind(this);
        this._refresh = this._refresh.bind(this);
        this._loadMore = this._loadMore.bind(this);
        this.page = 0;
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    _renderRow(rowData, sectionID, rowID, highlightRow) {
        return (
            <EventItem
                actionTime={1510369871000}
                actionUser={'CarGuo'}
                actionUserPic={'https://avatars0.githubusercontent.com/u/27534854?s=64&v=4'}
                actionMode={"publish"}
                actionTarget={"GSYGitHubApp"}/>
        )
    }

    /**
     * 刷新
     * */
    _refresh() {
        let {eventAction} = this.props;
        eventAction.getEventReceived(0, (res) => {
            this.page = 1;
            setTimeout(() => {
                this.refs.pullList.refreshComplete((res && res.length >= Config.PAGE_SIZE));
            }, 500);
        })
    }

    /**
     * 加载更多
     * */
    _loadMore() {
        let {eventAction} = this.props;
        eventAction.getEventReceived(this.page, (res) => {
            this.page++;
            setTimeout(() => {
                this.refs.pullList.loadMoreComplete((res && res.length >= Config.PAGE_SIZE));
            }, 300);
        });
    }


    render() {
        let {eventState, userState} = this.props;
        let dataSource = (eventState.received_events_data_list);
        return (
            <View style={styles.mainBox}>
                <StatusBar hidden={false} backgroundColor={'transparent'} translucent barStyle={'light-content'}/>
                <PullListView
                    style={{flex: 1}}
                    ref="pullList"
                    renderRow={(rowData, sectionID, rowID, highlightRow) =>
                        this._renderRow(rowData, sectionID, rowID, highlightRow)
                    }
                    refresh={this._refresh}
                    loadMore={this._loadMore}
                    dataSource={dataSource}
                />
            </View>
        )
    }
}

export default connect(state => ({
    userState: state.user,
    loginState: state.login,
    eventState: state.event,
}), dispatch => ({
    loginAction: bindActionCreators(loginActions, dispatch),
    userAction: bindActionCreators(userActions, dispatch),
    eventAction: bindActionCreators(eventActions, dispatch)
}))(DynamicPage)
