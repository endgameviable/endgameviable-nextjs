import Entry, { renderArticleAsHTML, renderSummaryAsHTML } from '@/data/interfaces/entry';
import { safeStringify } from '@/types/strings';
import Link from 'next/link';

interface Comment {
  id: string;
  date: string;
  text: string;
  uri: string;
}

async function getThread(instance?: string, id?: string): Promise<Comment[]> {
  const comments: Comment[] = [];
  const headers = new Headers();
  headers.append('Authorization', `Bearer ${process.env.MASTODON_API_TOKEN}`);
  const apiUrl = `${instance}/api/v1/statuses/${id}/context`;
  await fetch(apiUrl, {method: 'GET', headers: headers})
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      for (const status of data.descendants) {
        comments.push({
          id: status.id,
          date: safeStringify(status.created_at),
          text: safeStringify(status.text),
          uri: status.uri,
        })
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return comments;
}

export default async function MastodonThreadLayout({ entry }: { entry: Entry }) {
  if (!entry.social || !entry.social.mastodon_instance) {
    return <></>;
  }
  const comments = await getThread(entry.social.mastodon_instance, entry.social.mastodon_status_id);
  return (
    <>
      <section>
        <p>Mastodon thread</p>
        {comments.map((comment) => {
          return <p key={comment.id}>{comment.date} {comment.text}</p>;
        })}
      </section>
    </>
  );
}
