import React, { PropTypes, Component} from 'react';
import Immutable from "immutable";
import ReactDOM from 'react-dom';
import LogMonitorEntry from './LogMonitorEntry';
import LogMonitorButton from './LogMonitorButton';
import shouldPureComponentUpdate from 'react-pure-render/function';
import * as themes from 'redux-devtools-themes';
import { ActionCreators } from './instrument';
import { updateScrollTop } from './actions';
import reducer from './reducers';

const { reset, rollback, commit, sweep, toggleAction } = ActionCreators;

const styles = {
    container: {
        fontFamily: 'monaco, Consolas, Lucida Console, monospace, Arial',
        position: 'relative',
        overflowY: 'hidden',
        width: '100%',
        height: '100%',
        minWidth: 300,
        direction: 'ltr',
        display:'flex',
        flexDirection:'column',
        fontFamily: 'Arial',
        fontSize: '14px'
    },
    buttonBar: {
        padding: '15px 0',
        textAlign: 'center',
        borderBottomWidth: 1,
        borderBottomStyle: 'solid',
        borderColor: 'transparent',
        zIndex: 1
        //display: 'flex',
        //flexDirection: 'row'
    },
    elements: {
        overflowX: 'hidden',
        overflowY: 'auto',
        position:'relative'
    },

    textAreaDebug: {
        padding: '10px',
        resize: 'none',
        background: '#BABEC1',
        border: '1px solid #313131',
        boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.53)',
        minHeight: '90px',
        minWidth: '80%',
        marginTop: '10px',
        marginBottom: '10px'
    },

    halfWidth: {
        width: '50%',
        display: 'inline-block'
    },

    logMonitorTabs: {
        marginBottom:'15px'
    },

    logMonitorTabsItem: {
        padding: '12px',
        display: 'inline-block',
        width: '50%',
        color: '#fff',
        border: '5px solid #373B41',
        borderBottom:'none',
        borderRight: 'none',
        cursor: 'pointer',
        background: '#373B41',
        fontSize: '16px',
        boxSizing: 'border-box'
    },

    logMonitorTabsItemActive: {
        padding: '12px',
        display: 'inline-block',
        width: '50%',
        color: '#fff',
        border: '5px solid #373B41',
        borderBottom:'none',
        borderRight: 'none',
        cursor: 'pointer',
        background: '#373B41',
        fontSize: '16px',
        boxSizing: 'border-box',
        borderBottom:'none',
        background:'none'
    },

    logMonitorTabsContentLabel: {
        color: '#7191B9',
        marginRight: '15px',
        marginLeft: '10px'
    },

    formWrapper:{
        margin:'20px 0'
    },

    logMonitorTabsContentInput: {
        background: '#BABEC1',
        border: 'none',
        padding: '4px 5px',
        boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.53)',
        width: '50%'
    }
};

export default class LogMonitor extends Component {

    static update = reducer;

    static propTypes = {
        dispatch: PropTypes.func,
        computedStates: PropTypes.array,
        actionsById: PropTypes.object,
        stagedActionIds: PropTypes.array,
        skippedActionIds: PropTypes.array,
        monitorState: PropTypes.shape({
            initialScrollTop: PropTypes.number
        }),

        preserveScrollTop: PropTypes.bool,
        select: PropTypes.func.isRequired,
        theme: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.string
        ]),
        expandActionRoot: PropTypes.bool,
        expandStateRoot: PropTypes.bool
    };

    static defaultProps = {
        select: (state) => state,
        theme: 'nicinabox',
        preserveScrollTop: true,
        expandActionRoot: true,
        expandStateRoot: true
    };

    shouldComponentUpdate = shouldPureComponentUpdate;

    constructor(props) {
        super(props);
        this.state = {};
        this.state.active = false;
        this.handleToggleAction = this.handleToggleAction.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.handleRollback = this.handleRollback.bind(this);
        this.handleSweep = this.handleSweep.bind(this);
        this.handleCommit = this.handleCommit.bind(this);
        this.copyTrace = this.copyTrace.bind(this);
        this.applyTrace = this.applyTrace.bind(this);
    }

    componentDidMount() {
        const node = this.refs.container;
        if (!node) {
            return;
        }

        if (this.props.preserveScrollTop) {
            node.scrollTop = this.props.monitorState.initialScrollTop;
            this.interval = setInterval(
                ::
                    this.updateScrollTop, 1000
            )
            ;
        }
    }

    componentWillUnmount() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    copyTrace() {
        const { actionsById, stagedActionIds, computedStates , currentStateIndex} = this.props;
        let from = this.refs.from.value;
        let to = this.refs.to.value;
        let trace = {
            actionHistory: [],
            state: {}
        }
        to = to ? to : computedStates.length-1;
        from = from ? from : 0;
        for (let i = from; i <= to; i++) {
            const actionId = stagedActionIds[i];
            const action = actionsById[actionId].action;
            trace.actionHistory.push({action});
        }
        if(from) trace.state = computedStates[from-1].state;
        else trace.state = computedStates[from].state;
        ReactDOM.findDOMNode(this.refs.textAreaValue).value = JSON.stringify(trace);
    }

    applyTrace() {
        let trace = JSON.parse(ReactDOM.findDOMNode(this.refs.textAreaValue).value);
        this.props.dispatch(commit(Immutable.fromJS(trace.state)));
        for (let i = 0; i < trace.actionHistory.length; i++) {
            this.props.dispatch(ActionCreators.performAction(trace.actionHistory[i].action));
        }
    }

    updateScrollTop() {
        const node = this.refs.container;
        this.props.dispatch(updateScrollTop(node ? node.scrollTop : 0));
    }

    componentWillReceiveProps(nextProps) {
        const node = this.refs.container;
        if (!node) {
            this.scrollDown = true;
        } else if (
            this.props.stagedActionIds.length <
            nextProps.stagedActionIds.length
        ) {
            const { scrollTop, offsetHeight, scrollHeight } = node;

            this.scrollDown = Math.abs(
                    scrollHeight - (scrollTop + offsetHeight)
                ) < 20;
        } else {
            this.scrollDown = false;
        }
    }

    componentDidUpdate() {
        const node = this.refs.container;
        if (!node) {
            return;
        }
        if (this.scrollDown) {
            const { offsetHeight, scrollHeight } = node;
            node.scrollTop = scrollHeight - offsetHeight;
            this.scrollDown = false;
        }
    }

    handleRollback() {
        this.props.dispatch(rollback());
    }

    handleSweep() {
        this.props.dispatch(sweep());
    }

    handleCommit() {
        this.props.dispatch(commit());
    }

    handleToggleAction(id) {
        this.props.dispatch(toggleAction(id));
    }

    handleReset() {
        this.props.dispatch(reset());
    }

    getTheme() {
        let { theme } = this.props;
        if (typeof theme !== 'string') {
            return theme;
        }

        if (typeof themes[theme] !== 'undefined') {
            return themes[theme];
        }

        console.warn('DevTools theme ' + theme + ' not found, defaulting to nicinabox');
        return themes.nicinabox;
    }

    render() {
        const elements = [];
        const theme = this.getTheme();
        const { actionsById, skippedActionIds, stagedActionIds, computedStates, select } = this.props;

        for (let i = 0; i < stagedActionIds.length; i++) {
            const actionId = stagedActionIds[i];
            const action = actionsById[actionId].action;
            const { state, error } = computedStates[i];
            let previousState;
            if (i > 0) {
                previousState = computedStates[i - 1].state;
            }
            elements.push(
            <LogMonitorEntry key={actionId}
                    theme={theme}
                    select={select}
                    action={action}
                    actionId={actionId}
                    state={state}
                    previousState={previousState}
                    collapsed={skippedActionIds.indexOf(actionId) > -1}
                    error={error}
                    copyTrace={this.copyTrace}
                    expandActionRoot={this.props.expandActionRoot}
                    expandStateRoot={this.props.expandStateRoot}
                    onActionClick={this.handleToggleAction}/>
                );
        }

        return ( <div style={{...styles.container, backgroundColor: theme.base00}}>
            <div style={{...styles.buttonBar, borderColor: theme.base02}}>
                <div>
                    <div style={styles.logMonitorTabs}>
                        <ul style={styles.logMonitorTabs}>
                            <li style={this.state.active? styles.logMonitorTabsItemActive : styles.logMonitorTabsItem}
                                onClick={() => {this.setState({active : !this.state.active})}}>
                            Operations
                            </li>
                            <li style={!this.state.active? styles.logMonitorTabsItemActive : styles.logMonitorTabsItem}
                                onClick={() => {this.setState({active : !this.state.active})}}>
                            Trace
                            </li>
                        </ul>

                <div className="debugger-tabs-content" style={!this.state.active?{display: 'none'}:{display:'block'}}>
                    <LogMonitorButton
                        theme={theme}
                        onClick={this.handleReset}
                        enabled>
                    Reset
                    </LogMonitorButton>
                    <LogMonitorButton
                        theme={theme}
                        onClick={this.handleRollback}
                        enabled={computedStates.length > 1}>
                    Revert
                    </LogMonitorButton>
                    <LogMonitorButton
                        theme={theme}
                        onClick={this.handleSweep}
                        enabled={skippedActionIds.length > 0}>
                     Sweep
                    </LogMonitorButton>
                    <LogMonitorButton
                        theme={theme}
                        onClick={this.handleCommit}
                        enabled={computedStates.length > 1}>
                    Commit
                    </LogMonitorButton>
                </div>
                <div style={this.state.active?{display: 'none'}:{display:'block'}}>
                    <div  style={styles.formWrapper}>
                        <div style={styles.halfWidth}>
                            <label style={styles.logMonitorTabsContentLabel}>From:</label>
                            <input type="text"
                                    style={styles.logMonitorTabsContentInput}
                                    ref="from"/>
                        </div>
                        <div style={styles.halfWidth}>
                            <label style={styles.logMonitorTabsContentLabel}>To:</label>
                            <input type="text"
                                    style={styles.logMonitorTabsContentInput}
                                    ref="to"/>
                        </div>
                    </div>
                    <LogMonitorButton
                            theme={theme}
                            onClick={this.copyTrace}
                            enabled>
                    CopyTrace
                    </LogMonitorButton>
                    <LogMonitorButton
                            theme={theme}
                            onClick={this.applyTrace}
                            enabled>
                            ApplyTrace
                    </LogMonitorButton>

                <div style={{...styles.buttonBar, borderColor: theme.base02, padding:'8px 0 15px'}}>
                <textarea ref="textAreaValue" style={{...styles.textAreaDebug}}></textarea>
                </div>
            </div>
        </div>
        </div>
                    </div>
        <div style={styles.elements} ref='container'>
            {elements}
        </div>
    </div>);
    }
}