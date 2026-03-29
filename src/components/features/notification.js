import React, { useEffect, useRef } from 'react';
import { notification } from 'antd';

export default function Notification(props) {

    const [api, contextHolder] = notification.useNotification();
    const { type, message, description } = props;
    const hasShown = useRef(false);

    useEffect(() => {
        // Reset the guard when type is cleared
        if (!type) {
            hasShown.current = false;
            return;
        }

        // Prevent StrictMode double-fire
        if (hasShown.current) return;
        hasShown.current = true;

        api[type]({
            message: message,
            description: description,
            showProgress: true,
            pauseOnHover: true,
        });
    }, [type, message, description]);

    return <>{contextHolder}</>;
}