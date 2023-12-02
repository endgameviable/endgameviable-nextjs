'use client';

import { useEffect } from 'react';
import commentBox from 'commentbox.io';
import { commentBoxAppID } from '@config/resourceConfig';

export default function CommentBoxLayout() {
    useEffect(() => {
        commentBox(commentBoxAppID);
    }, []);
    return (
        <>
            <div className="commentbox"></div>
        </>
    );
}
