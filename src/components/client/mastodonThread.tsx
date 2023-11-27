'use client';

import { Mention } from '@/data/interfaces/mention';
import { publicSiteUrl } from '@/site/utilities';
import { useState, useEffect } from 'react';

export default function MastodonThreadLayout({ route }: { route: string }) {
  const url = publicSiteUrl(route);
  const initial: Mention[] = [];
  const [mentions, setMentions] = useState(initial);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    console.log("api starting");
    fetch(`/api/mentions?url=${url}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("api done:", data);
        setMentions(data);
        setLoading(false);
      })
  }, [url]);

  if (isLoading) {
    return <section>
      <p>Looking for fediverse mentions...</p>
      <noscript>
        <p>...but they'll never be found because Javascript is disabled.</p>
      </noscript>
    </section>;
  }

  if (!mentions || mentions.length === 0) {
    return <section><p>No fediverse mentions found.</p></section>
  }

  return (
    <>
      <section>
        <header>
          <h2>Mentions from The Fediverse</h2>
        </header>
        {mentions.map((comment) => {
          const dt = new Date(comment.date);
          const options: Intl.DateTimeFormatOptions = {
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: false,
          };    
          const dateString = new Intl.DateTimeFormat('default', options).format(dt);
          return <p key={comment.url}>{dateString} {comment.content}</p>;
        })}
      </section>
    </>
  );
}
