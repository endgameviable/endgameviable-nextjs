This is a presentation layer application that presents structured, timestamped json content.

It's a blog platform, basically.

Content is read from an s3 bucket of json data, which can be generated however you like, but I use a Hugo project that converts Markdown blog posts into json data pages.

Content can also come from other sources like YAML files, but that's a process the json generator handles.

These things can all be done with a static site generator (like Hugo), but this project aims to add server-side functionality that's difficult or impossible to do with static sites. Mainly:

- Search.
- Link redirection.
- WordPress Pingback handling.
- Dynamic blogrolls.
- ActivityPub integration.
- Maybe comments?? But probably not.

Using Next.js hopefully allows us to have the best of all worlds: Static page generation for things that don't change, client-side javascript where we can use it, and dynamic server-side rendering for things that need a server.

## Inspiration

I searched for a way to do this _without_ writing something of my own, but everything fell short of my requirements.

Inspiration has been taken from numerous similar Next.js blog projects on github and blog samples in the Next.js docs. Some concepts loosely based on ideas in Blot https://github.com/davidmerfield/Blot.

And, of course, since we live in 2023, ChatGPT patiently explained numerous Typescript concepts to me, and who knows where _that_ information came from.

## Hosting

I use AWS Amplify to host this.

The build script is almost the default, but has some modifications and looks like this:

```
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - node -v
        - npm ci
    build:
      commands:
        - node -v
        - env | grep -e S3_ACCESS_KEY_ID -e S3_SECRET_ACCESS_KEY -e MASTODON_API_TOKEN >> .env.production
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

This line is vitally important not to forget:

```
- env | grep -e S3_ACCESS_KEY_ID -e S3_SECRET_ACCESS_KEY -e MASTODON_API_TOKEN >> .env.production
```

Otherwise the access tokens will not be available and the server-side app won't know how to connect to anything at runtime. See https://docs.aws.amazon.com/amplify/latest/userguide/ssr-environment-variables.html

It took a LONG time to figure that out so don't forget it!

## AWS Amplify Setup

### Build Settings

- Build Image: Amazon Linux:2023 image
- Build Timeout: (default)
- Package Overrides:
  - Amplify CLI: latest
  - Next.js version: latest
  - Node.js version: 18

### Environment Variables

As far as I know, these have to be set manually in the AWS Amplify Console.

- MASTODON_API_KEY
  - Get this by querying the Mastodon API of your ActivityPub server instance. (I use GoToSocial, not Mastodon.)
- RESOURCE_LINK_TABLE
- RESOURCE_SEARCH_TABLE
- RESOURCE_JSON_BUCKET
- RESOURCE_EVENT_QUEUE
  - The resources are managed by Amplify and CloudFormation so they have long, weird names.

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
