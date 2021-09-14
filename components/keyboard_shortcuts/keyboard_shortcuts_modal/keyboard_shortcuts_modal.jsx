// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import PropTypes from 'prop-types';
import React from 'react';
import {Modal} from 'react-bootstrap';
import {defineMessages, injectIntl} from 'react-intl';

import ModalStore from 'stores/modal_store.jsx';
import Constants from 'utils/constants';
import {intlShape} from 'utils/react_intl';
import {t} from 'utils/i18n';
import * as Utils from 'utils/utils';
import {KEYBOARD_SHORTCUTS} from '../keyboard_shortcuts';
import KeyboardShortcutSequence from '../keyboard_shortcuts_sequence/keyboard_shortcuts_sequence';

class KeyboardShortcutsModal extends React.PureComponent {
    static propTypes = {
        intl: intlShape.isRequired,
        isMac: PropTypes.bool.isRequired,
    }

    constructor(props) {
        super(props);

        this.state = {
            show: false,
        };
    }

    componentDidMount() {
        ModalStore.addModalListener(Constants.ActionTypes.TOGGLE_SHORTCUTS_MODAL, this.handleToggle);
    }

    componentWillUnmount() {
        ModalStore.removeModalListener(Constants.ActionTypes.TOGGLE_SHORTCUTS_MODAL, this.handleToggle);
    }

    handleToggle = () => {
        //toggles the state of shortcut dialog
        this.setState({
            show: !this.state.show,
        });
    }

    handleHide = () => {
        this.setState({show: false});
    }

    getShortcuts() {
        const {isMac} = this.props;
        const shortcuts = {};
        Object.keys(KEYBOARD_SHORTCUTS).forEach((s) => {
            if (isMac && KEYBOARD_SHORTCUTS[s].mac) {
                shortcuts[s] = KEYBOARD_SHORTCUTS[s].mac;
            } else if (!isMac && KEYBOARD_SHORTCUTS[s].default) {
                shortcuts[s] = KEYBOARD_SHORTCUTS[s].default;
            } else {
                shortcuts[s] = KEYBOARD_SHORTCUTS[s];
            }
        });

        return shortcuts;
    }

    render() {
        const shortcuts = this.getShortcuts();
        const {formatMessage} = this.props.intl;

        const isLinux = Utils.isLinux();

        return (
            <Modal
                dialogClassName='a11y__modal shortcuts-modal'
                show={this.state.show}
                onHide={this.handleHide}
                onExited={this.handleHide}
                role='dialog'
                aria-labelledby='shortcutsModalLabel'
            >
                <div className='shortcuts-content'>
                    <Modal.Header closeButton={true}>
                        <Modal.Title
                            componentClass='h1'
                            id='shortcutsModalLabel'
                        >
                            <strong><KeyboardShortcutSequence shortcut={shortcuts.mainHeader}/></strong>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='row'>
                            <div className='col-sm-4'>
                                <div className='section'>
                                    <div>
                                        <h3 className='section-title'><strong>{formatMessage(shortcuts.navHeader)}</strong></h3>
                                        <KeyboardShortcutSequence shortcut={shortcuts.navPrev}/>
                                        <KeyboardShortcutSequence shortcut={shortcuts.navNext}/>
                                        <KeyboardShortcutSequence shortcut={shortcuts.navUnreadPrev}/>
                                        <KeyboardShortcutSequence shortcut={shortcuts.navUnreadNext}/>
                                        {!isLinux && <KeyboardShortcutSequence shortcut={shortcuts.teamNavPrev}/>}
                                        {!isLinux && <KeyboardShortcutSequence shortcut={shortcuts.teamNavNext}/>}
                                        <KeyboardShortcutSequence shortcut={shortcuts.teamNavSwitcher}/>
                                        <KeyboardShortcutSequence shortcut={shortcuts.navSwitcher}/>
                                        <KeyboardShortcutSequence shortcut={shortcuts.navDMMenu}/>
                                        <KeyboardShortcutSequence shortcut={shortcuts.navSettings}/>
                                        <KeyboardShortcutSequence shortcut={shortcuts.navMentions}/>
                                        <KeyboardShortcutSequence shortcut={shortcuts.navFocusCenter}/>
                                        <KeyboardShortcutSequence shortcut={shortcuts.navOpenCloseSidebar}/>
                                    </div>
                                </div>
                            </div>
                            <div className='col-sm-4'>
                                <div className='section'>
                                    <div>
                                        <h3 className='section-title'><strong>{formatMessage(shortcuts.msgHeader)}</strong></h3>
                                        <span><strong>{formatMessage(shortcuts.msgInputHeader)}</strong></span>
                                        <div className='subsection'>
                                            <KeyboardShortcutSequence shortcut={shortcuts.msgEdit}/>
                                            <KeyboardShortcutSequence shortcut={shortcuts.msgReply}/>
                                            <KeyboardShortcutSequence shortcut={shortcuts.msgLastReaction}/>
                                            <KeyboardShortcutSequence shortcut={shortcuts.msgReprintPrev}/>
                                            <KeyboardShortcutSequence shortcut={shortcuts.msgReprintNext}/>
                                        </div>
                                        <span><strong>{formatMessage(shortcuts.msgCompHeader)}</strong></span>
                                        <div className='subsection'>
                                            <KeyboardShortcutSequence shortcut={shortcuts.msgCompUsername}/>
                                            <KeyboardShortcutSequence shortcut={shortcuts.msgCompChannel}/>
                                            <KeyboardShortcutSequence shortcut={shortcuts.msgCompEmoji}/>
                                        </div>
                                        <span><strong>{formatMessage(shortcuts.msgMarkdownHeader)}</strong></span>
                                        <div className='subsection'>
                                            <KeyboardShortcutSequence shortcut={shortcuts.msgMarkdownBold}/>
                                            <KeyboardShortcutSequence shortcut={shortcuts.msgMarkdownItalic}/>
                                            <KeyboardShortcutSequence shortcut={shortcuts.msgMarkdownLink}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='col-sm-4'>
                                <div className='section'>
                                    <div>
                                        <h3 className='section-title'><strong>{formatMessage(shortcuts.filesHeader)}</strong></h3>
                                        <KeyboardShortcutSequence shortcut={shortcuts.filesUpload}/>
                                    </div>
                                    <div className='section--lower'>
                                        <h3 className='section-title'><strong>{formatMessage(shortcuts.browserHeader)}</strong></h3>
                                        <KeyboardShortcutSequence shortcut={shortcuts.browserChannelPrev}/>
                                        <KeyboardShortcutSequence shortcut={shortcuts.browserChannelNext}/>
                                        <KeyboardShortcutSequence shortcut={shortcuts.browserFontIncrease}/>
                                        <KeyboardShortcutSequence shortcut={shortcuts.browserFontDecrease}/>
                                        <span><strong>{formatMessage(shortcuts.browserInputHeader)}</strong></span>
                                        <div className='subsection'>
                                            <KeyboardShortcutSequence shortcut={shortcuts.browserHighlightPrev}/>
                                            <KeyboardShortcutSequence shortcut={shortcuts.browserHighlightNext}/>
                                            <KeyboardShortcutSequence shortcut={shortcuts.browserNewline}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='info__label'>{formatMessage(shortcuts.info)}</div>
                    </Modal.Body>
                </div>
            </Modal>
        );
    }
}

export default injectIntl(KeyboardShortcutsModal);
