'use client';

import { useEffect } from 'react';
import commentBox from 'commentbox.io';

export default function CommentBoxLayout() {
    useEffect(() => {
        commentBox('5741534720819200-proj', {
            createBoxUrl(boxId: string, pageLocation: Location) {
                pageLocation.protocol = 'https';
                pageLocation.hostname = 'endgameviable.com';
                return pageLocation.href;
            },        
        });
      }, []);
    return <>
        <div className="commentbox"></div>
    </>;
}
