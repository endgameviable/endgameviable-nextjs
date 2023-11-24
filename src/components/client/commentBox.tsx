'use client';

import { siteConfig } from '@config/siteConfig';
import commentBox from 'commentbox.io';
import { useEffect } from 'react';

export default function CommentBox() {
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
