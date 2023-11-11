This is an application to present timestamped content in a user-friendly HTML page. It's a blog, basically, but it can display more than just posts. Content can come from Markdown files in the traditional manner of a static site generator, or it can be extracted from structured data files like YAML.

These things can be done with a static site generator, but this project aims to add some additional functionality that's difficult or impossible with static generators. (Mainly robust searching, but there's some future potential for ActivityPub integration.)

## Inspiration

I searched for a way to do this _without_ writing something of my own, but everything fell short of my requirements.

Inspiration has been taken from numerous similar Next.js blog projects on github and blog samples in the Next.js docs. Some concepts loosely based on ideas in Blot https://github.com/davidmerfield/Blot.

And, of course, since we live in 2023, ChatGPT patiently explained numerous Typescript concepts to me, and who knows where _that_ information came from.

## Next.js

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
