'use client';

import { useEffect } from 'react';
import commentBox from 'commentbox.io';

// Hopefully detected at build time
const appId = process.env.EGV_USER_COMMENTBOX_APPID;

export default function CommentBoxLayout() {
    if (!appId || appId === '') 
        return <></>;
        
    useEffect(() => {
        commentBox(appId);
    }, []);
    return (
        <>
            <div className="commentbox"></div>
        </>
    );
}
