'use client';

import { useEffect } from 'react';
import commentBox from 'commentbox.io';

export default function CommentBoxLayout() {
    useEffect(() => {
        commentBox('5741534720819200-proj');
      }, []);
    return <>
        <div className="commentbox"></div>
    </>;
}
