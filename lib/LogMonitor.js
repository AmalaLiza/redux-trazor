'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _LogMonitorEntry = require('./LogMonitorEntry');

var _LogMonitorEntry2 = _interopRequireDefault(_LogMonitorEntry);

var _LogMonitorButton = require('./LogMonitorButton');

var _LogMonitorButton2 = _interopRequireDefault(_LogMonitorButton);

var _function = require('react-pure-render/function');

var _function2 = _interopRequireDefault(_function);

var _reduxDevtoolsThemes = require('redux-devtools-themes');

var themes = _interopRequireWildcard(_reduxDevtoolsThemes);

var _instrument = require('./instrument');

var _actions = require('./actions');

var _reducers = require('./reducers');

var _reducers2 = _interopRequireDefault(_reducers);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var reset = _instrument.ActionCreators.reset;
var rollback = _instrument.ActionCreators.rollback;
var commit = _instrument.ActionCreators.commit;
var sweep = _instrument.ActionCreators.sweep;
var toggleAction = _instrument.ActionCreators.toggleAction;


var styles = {
    container: {
        fontFamily: 'monaco, Consolas, Lucida Console, monospace, Arial',
        position: 'relative',
        overflowY: 'hidden',
        width: '100%',
        height: '100%',
        minWidth: 300,
        direction: 'ltr',
        display: 'flex',
        flexDirection: 'column',
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
        position: 'relative'
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
        marginBottom: '15px'
    },

    logMonitorTabsItem: {
        padding: '12px',
        display: 'inline-block',
        width: '50%',
        color: '#fff',
        border: '5px solid #373B41',
        borderBottom: 'none',
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
        borderBottom: 'none',
        borderRight: 'none',
        cursor: 'pointer',
        background: '#373B41',
        fontSize: '16px',
        boxSizing: 'border-box',
        borderBottom: 'none',
        background: 'none'
    },

    logMonitorTabsContentLabel: {
        color: '#7191B9',
        marginRight: '15px',
        marginLeft: '10px'
    },

    formWrapper: {
        margin: '20px 0'
    },

    logMonitorTabsContentInput: {
        background: '#BABEC1',
        border: 'none',
        padding: '4px 5px',
        boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.53)',
        width: '50%'
    }
};

var LogMonitor = function (_Component) {
    _inherits(LogMonitor, _Component);

    function LogMonitor(props) {
        _classCallCheck(this, LogMonitor);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props));

        _this.shouldComponentUpdate = _function2.default;

        _this.state = {};
        _this.state.active = false;
        _this.handleToggleAction = _this.handleToggleAction.bind(_this);
        _this.handleReset = _this.handleReset.bind(_this);
        _this.handleRollback = _this.handleRollback.bind(_this);
        _this.handleSweep = _this.handleSweep.bind(_this);
        _this.handleCommit = _this.handleCommit.bind(_this);
        _this.copyTrace = _this.copyTrace.bind(_this);
        _this.applyTrace = _this.applyTrace.bind(_this);
        return _this;
    }

    LogMonitor.prototype.componentDidMount = function componentDidMount() {
        var node = this.refs.container;
        if (!node) {
            return;
        }

        if (this.props.preserveScrollTop) {
            node.scrollTop = this.props.monitorState.initialScrollTop;
            this.interval = setInterval(this.updateScrollTop.bind(this), 1000);
        }
    };

    LogMonitor.prototype.componentWillUnmount = function componentWillUnmount() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    };

    LogMonitor.prototype.copyTrace = function copyTrace() {
        var _props = this.props;
        var actionsById = _props.actionsById;
        var stagedActionIds = _props.stagedActionIds;
        var computedStates = _props.computedStates;
        var currentStateIndex = _props.currentStateIndex;

        var from = this.refs.from.value;
        var to = this.refs.to.value;
        var trace = {
            actionHistory: [],
            state: {}
        };
        to = to ? to : computedStates.length - 1;
        from = from ? from : 0;
        for (var i = from; i <= to; i++) {
            var actionId = stagedActionIds[i];
            var action = actionsById[actionId].action;
            trace.actionHistory.push({ action: action });
        }
        if (from) trace.state = computedStates[from - 1].state;else trace.state = computedStates[from].state;
        _reactDom2.default.findDOMNode(this.refs.textAreaValue).value = JSON.stringify(trace);
    };

    LogMonitor.prototype.applyTrace = function applyTrace() {
        var trace = JSON.parse(_reactDom2.default.findDOMNode(this.refs.textAreaValue).value);
        this.props.dispatch(commit(_immutable2.default.fromJS(trace.state)));
        for (var i = 0; i < trace.actionHistory.length; i++) {
            this.props.dispatch(_instrument.ActionCreators.performAction(trace.actionHistory[i].action));
        }
    };

    LogMonitor.prototype.updateScrollTop = function updateScrollTop() {
        var node = this.refs.container;
        this.props.dispatch((0, _actions.updateScrollTop)(node ? node.scrollTop : 0));
    };

    LogMonitor.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        var node = this.refs.container;
        if (!node) {
            this.scrollDown = true;
        } else if (this.props.stagedActionIds.length < nextProps.stagedActionIds.length) {
            var scrollTop = node.scrollTop;
            var offsetHeight = node.offsetHeight;
            var scrollHeight = node.scrollHeight;


            this.scrollDown = Math.abs(scrollHeight - (scrollTop + offsetHeight)) < 20;
        } else {
            this.scrollDown = false;
        }
    };

    LogMonitor.prototype.componentDidUpdate = function componentDidUpdate() {
        var node = this.refs.container;
        if (!node) {
            return;
        }
        if (this.scrollDown) {
            var offsetHeight = node.offsetHeight;
            var scrollHeight = node.scrollHeight;

            node.scrollTop = scrollHeight - offsetHeight;
            this.scrollDown = false;
        }
    };

    LogMonitor.prototype.handleRollback = function handleRollback() {
        this.props.dispatch(rollback());
    };

    LogMonitor.prototype.handleSweep = function handleSweep() {
        this.props.dispatch(sweep());
    };

    LogMonitor.prototype.handleCommit = function handleCommit() {
        this.props.dispatch(commit());
    };

    LogMonitor.prototype.handleToggleAction = function handleToggleAction(id) {
        this.props.dispatch(toggleAction(id));
    };

    LogMonitor.prototype.handleReset = function handleReset() {
        this.props.dispatch(reset());
    };

    LogMonitor.prototype.getTheme = function getTheme() {
        var theme = this.props.theme;

        if (typeof theme !== 'string') {
            return theme;
        }

        if (typeof themes[theme] !== 'undefined') {
            return themes[theme];
        }

        console.warn('DevTools theme ' + theme + ' not found, defaulting to nicinabox');
        return themes.nicinabox;
    };

    LogMonitor.prototype.render = function render() {
        var _this2 = this;

        var elements = [];
        var theme = this.getTheme();
        var _props2 = this.props;
        var actionsById = _props2.actionsById;
        var skippedActionIds = _props2.skippedActionIds;
        var stagedActionIds = _props2.stagedActionIds;
        var computedStates = _props2.computedStates;
        var select = _props2.select;


        for (var i = 0; i < stagedActionIds.length; i++) {
            var actionId = stagedActionIds[i];
            var action = actionsById[actionId].action;
            var _computedStates$i = computedStates[i];
            var state = _computedStates$i.state;
            var error = _computedStates$i.error;

            var previousState = undefined;
            if (i > 0) {
                previousState = computedStates[i - 1].state;
            }
            elements.push(_react2.default.createElement(_LogMonitorEntry2.default, { key: actionId,
                theme: theme,
                select: select,
                action: action,
                actionId: actionId,
                state: state,
                previousState: previousState,
                collapsed: skippedActionIds.indexOf(actionId) > -1,
                error: error,
                copyTrace: this.copyTrace,
                expandActionRoot: this.props.expandActionRoot,
                expandStateRoot: this.props.expandStateRoot,
                onActionClick: this.handleToggleAction }));
        }

        return _react2.default.createElement(
            'div',
            { style: _extends({}, styles.container, { backgroundColor: theme.base00 }) },
            _react2.default.createElement(
                'div',
                { style: _extends({}, styles.buttonBar, { borderColor: theme.base02 }) },
                _react2.default.createElement(
                    'div',
                    null,
                    _react2.default.createElement(
                        'div',
                        { style: styles.logMonitorTabs },
                        _react2.default.createElement(
                            'ul',
                            { style: styles.logMonitorTabs },
                            _react2.default.createElement(
                                'li',
                                { style: this.state.active ? styles.logMonitorTabsItemActive : styles.logMonitorTabsItem,
                                    onClick: function onClick() {
                                        _this2.setState({ active: !_this2.state.active });
                                    } },
                                'Operations'
                            ),
                            _react2.default.createElement(
                                'li',
                                { style: !this.state.active ? styles.logMonitorTabsItemActive : styles.logMonitorTabsItem,
                                    onClick: function onClick() {
                                        _this2.setState({ active: !_this2.state.active });
                                    } },
                                'Trace'
                            )
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'debugger-tabs-content', style: !this.state.active ? { display: 'none' } : { display: 'block' } },
                            _react2.default.createElement(
                                _LogMonitorButton2.default,
                                {
                                    theme: theme,
                                    onClick: this.handleReset,
                                    enabled: true },
                                'Reset'
                            ),
                            _react2.default.createElement(
                                _LogMonitorButton2.default,
                                {
                                    theme: theme,
                                    onClick: this.handleRollback,
                                    enabled: computedStates.length > 1 },
                                'Revert'
                            ),
                            _react2.default.createElement(
                                _LogMonitorButton2.default,
                                {
                                    theme: theme,
                                    onClick: this.handleSweep,
                                    enabled: skippedActionIds.length > 0 },
                                'Sweep'
                            ),
                            _react2.default.createElement(
                                _LogMonitorButton2.default,
                                {
                                    theme: theme,
                                    onClick: this.handleCommit,
                                    enabled: computedStates.length > 1 },
                                'Commit'
                            )
                        ),
                        _react2.default.createElement(
                            'div',
                            { style: this.state.active ? { display: 'none' } : { display: 'block' } },
                            _react2.default.createElement(
                                'div',
                                { style: styles.formWrapper },
                                _react2.default.createElement(
                                    'div',
                                    { style: styles.halfWidth },
                                    _react2.default.createElement(
                                        'label',
                                        { style: styles.logMonitorTabsContentLabel },
                                        'From:'
                                    ),
                                    _react2.default.createElement('input', { type: 'text',
                                        style: styles.logMonitorTabsContentInput,
                                        ref: 'from' })
                                ),
                                _react2.default.createElement(
                                    'div',
                                    { style: styles.halfWidth },
                                    _react2.default.createElement(
                                        'label',
                                        { style: styles.logMonitorTabsContentLabel },
                                        'To:'
                                    ),
                                    _react2.default.createElement('input', { type: 'text',
                                        style: styles.logMonitorTabsContentInput,
                                        ref: 'to' })
                                )
                            ),
                            _react2.default.createElement(
                                _LogMonitorButton2.default,
                                {
                                    theme: theme,
                                    onClick: this.copyTrace,
                                    enabled: true },
                                'CopyTrace'
                            ),
                            _react2.default.createElement(
                                _LogMonitorButton2.default,
                                {
                                    theme: theme,
                                    onClick: this.applyTrace,
                                    enabled: true },
                                'ApplyTrace'
                            ),
                            _react2.default.createElement(
                                'div',
                                { style: _extends({}, styles.buttonBar, { borderColor: theme.base02, padding: '8px 0 15px' }) },
                                _react2.default.createElement('textarea', { ref: 'textAreaValue', style: _extends({}, styles.textAreaDebug) })
                            )
                        )
                    )
                )
            ),
            _react2.default.createElement(
                'div',
                { style: styles.elements, ref: 'container' },
                elements
            )
        );
    };

    return LogMonitor;
}(_react.Component);

LogMonitor.update = _reducers2.default;
LogMonitor.propTypes = {
    dispatch: _react.PropTypes.func,
    computedStates: _react.PropTypes.array,
    actionsById: _react.PropTypes.object,
    stagedActionIds: _react.PropTypes.array,
    skippedActionIds: _react.PropTypes.array,
    monitorState: _react.PropTypes.shape({
        initialScrollTop: _react.PropTypes.number
    }),

    preserveScrollTop: _react.PropTypes.bool,
    select: _react.PropTypes.func.isRequired,
    theme: _react.PropTypes.oneOfType([_react.PropTypes.object, _react.PropTypes.string]),
    expandActionRoot: _react.PropTypes.bool,
    expandStateRoot: _react.PropTypes.bool
};
LogMonitor.defaultProps = {
    select: function select(state) {
        return state;
    },
    theme: 'nicinabox',
    preserveScrollTop: true,
    expandActionRoot: true,
    expandStateRoot: true
};
exports.default = LogMonitor;