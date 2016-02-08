import React, { Component } from 'react';
import JSONTree from 'react-json-tree';

const styles = {
    actionBar: {
        paddingTop: 8,
        paddingBottom: 7,
        paddingLeft: 16
    },
    payload: {
        margin: 0,
        overflow: 'auto'
    },
    buttonStyle: {
        cursor: 'pointer',
        fontWeight: 'bold',
        borderRadius: 3,
        padding: '6px 15px',
        flexGrow: 1,
        display: 'inline-block',
        fontSize: '0.8em',
        color: 'white',
        textDecoration: 'none',
        position:'absolute',
        right:'0',
        margin: '0 5px',
        backgroundColor: 'rgba(29, 31, 33, 0.74)',
        border: 'none',
        marginTop: '-5px'
    }
};

export default class LogMonitorAction extends Component {
    renderPayload(payload) {
        return (
            <div style={{
        ...styles.payload,
        backgroundColor: this.props.theme.base00
      }}>
        { Object.keys(payload).length > 0 ?
        <JSONTree theme={this.props.theme}
                  keyName={'action'}
                  data={payload}
                  expandRoot={this.props.expandActionRoot}/> : '' }
            </div>
        );
    }

    copyStateToLast(event, state, actionId) {
        this.props.copyTrace(state, actionId);
        event.stopPropagation();
    }

    render() {

        const { type, ...payload } = this.props.action;
        return (
            <div style={{
        backgroundColor: this.props.theme.base02,
        color: this.props.theme.base06,
        ...this.props.style}}>
                <div style={styles.actionBar}
                    onClick={this.props.onClick}>
                    {type}
                     :::::: {this.props.actionId}
                </div>
                {!this.props.collapsed ? this.renderPayload(payload) : ''}
            </div>
        );
    }
}
