'use client';

import { Mention } from '@/data/interfaces/mention';
import { siteUrl } from '@/site/utilities';
import { useState, useEffect } from 'react';

async function getMentions(url: string): Promise<Mention[]> {
  try {
    const response = await fetch(
      `/api/mentions?url=${url}`,
    );
    const data = await response.json();
    console.log("api done:", data);
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
  return [];
}

export default function MastodonThreadLayout({ route }: { route: string }) {
  const url = siteUrl(route);
  const initial: Mention[] = [];
  const [mentions, setMentions] = useState(initial);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/mentions?url=${url}`)
      .then((res) => res.json())
      .then((data) => {
        setMentions(data);
        setLoading(false);
      })
  }, [url]);

  if (isLoading) {
    return <section><p>Getting mentions...</p></section>
  }

  if (!mentions) {
    return <section><p>No mentions found.</p></section>
  }

  return (
    <>
      <section>
        <header>
          <h2>Mentions from The Fediverse</h2>
        </header>
        {mentions.map((comment) => {
          return <p key={comment.url}>{comment.date} {comment.content}</p>;
        })}
      </section>
    </>
  );
}
