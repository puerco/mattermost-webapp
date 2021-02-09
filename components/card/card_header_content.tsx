// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

type Props = {
    title: React.ReactNode;
    subtitle?: React.ReactNode;
    buttonText?: React.ReactNode;
    onClick?: () => void;
};

const CardHeaderContent: React.FC<Props> = (props: Props) => {
    return (
        <>
            <div>
                <div className='text-top'>
                    {props.title}
                </div>
                <div className='text-bottom'>
                    {props.subtitle}
                </div>
            </div>
            {
                props.buttonText && props.onClick ?
                    <button
                        className='content-button primary'
                        onClick={props.onClick}
                    >
                        {props.buttonText}
                    </button> :
                    ''
            }

        </>
    );
};

export default CardHeaderContent;
