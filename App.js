/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { View } from 'react-native';
import { Provider } from 'react-redux';
import { getLanguageCurrent, getRefreshHandler } from './app/utils/actionUtils'
import { changeLocale } from './app/i18n'
import getRouter from './app/router';
import store from './app/store/'
import * as Constant from './app/assets/style/constant'

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            store: store,
            show: false
        };
        getLanguageCurrent().then((res) => {
            changeLocale(res.language);
            this.setState({
                show: true
            })
        });

        getRefreshHandler().set(Constant.REFRESH_LANGUAGE, () => {
            this.setState({
                show: false
            });
            setTimeout(() => {
                this.setState({
                    show: true
                })
            }, 500)
        });
    }

    render() {
        if (!this.state.show) {
            return <View />
        }
        return (
            <Provider store={this.state.store}>
                {getRouter()}
            </Provider>
        );
    }
}