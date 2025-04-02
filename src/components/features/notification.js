import React, { useEffect } from 'react';
import { notification } from 'antd';

export default function Notification(props) {
    const [api, contextHolder] = notification.useNotification();

    const openNotificationWithIconSubmit = () => {
        if (props.type === 'success') {
            api[props.type]({
                message: 'Success!',
                description: 'The information you provided has been successfully saved.',
                showProgress: true,
                pauseOnHover: true,
            });
        } else if (props.type === 'error') {
            api[props.type]({
                message: 'Oops! Something went wrong.',
                description: 'We were unable to save your changes. Please try again later.',
                showProgress: true,
                pauseOnHover: true,
            });
        }
    };

    useEffect(() => {
        if (props.type) { // Only trigger if props.type has a value
            openNotificationWithIconSubmit();
        }
    }, [props.type]); // Run when props.type changes

    return <>{contextHolder}</>;
}