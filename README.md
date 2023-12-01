This is the Next.js application that I'm experimenting with as an engine for my Endgame Viable blog site.

It's a hybrid static/dynamic blog platform, but the goal is to keep the content completely separate from the blog repo.

The project, however, expects to find content at build time in a local content directory. The content directory is populated as part of a backend build process using [a Hugo template](https://github.com/endgameviable/endgameviable-json-theme) that renders Markdown content into JSON data files instead of HTML.

I also want to support content from other sources like YAML files, but that's a process that's handled elsewhere. This project renders whatever JSON data it finds in the local content directory.

You might be wondering why a Next.js project when site generation from Markdown files can be easily done with a static site generator (like Hugo). 1) It's a fun experiment. 2) This project also aims to add server-side functionality that's difficult or impossible to do with exclusively static sites. Mainly:

- Search. The main thing, really.
- ActivityPub integration.\*
- Webmention and icky WordPress Pingback handling.
- Link redirection.
- Dynamic blogrolls.
- Protected pages that might require some form of authentication.
- Maybe comments?? But probably not. I don't want the headaches of hosting comments. Better to offload that burden to third parties, imo.

Using Next.js hopefully allows us to have the best of all worlds: Static page generation for things that don't change, client-side javascript where we can use it, and dynamic server-side rendering for things that need a server. And it's a much less painful development experience than trying to develop client-side Javascript for HTML.

\* Someday I'd like the blog server to _be_ an ActiityPub server, but that's too ambitious at present. For now, it just integrates with an ActivityPub account via. Mastodon-style API calls. (Only tested with GoToSocial so far.)

## Inspiration

I searched for a way to do this _without_ writing something of my own, but everything fell short of my requirements.

Inspiration has been taken from numerous Next.js blog projects on github (seriously there are thousands) and blog samples in the Next.js docs. The concept of separating the content is loosely based on ideas in Blot https://github.com/davidmerfield/Blot.

And, of course, since we live in 2023, ChatGPT patiently explained numerous AWS, Next.js, Node.js, and Typescript concepts to me, and who knows where _that_ information came from.

## Hosting

I currently use AWS Amplify to host the front end, and AWS CloudFormation templates to build the backend infrastructure. I don't _want_ it to be tethered to AWS, but it is right now

### Backend Setup

It works best to build the backend stack first. The backend infrastructure is managed in [endgameviable-infrastructure](https://github.com/endgameviable/endgameviable-infrastructure). In short:

`./createstack.sh` to create a CloudFormation stack of resources required to build content data files for the Next.js build. The Amplify build will read outputs from that stack into environment variables for setup.

### AWS Amplify Setup

I wanted to setup everything as infrastructure-as-code so you could just press a single button to create and deploy everything needed to run the site, but alas, you can't do that with AWS Amplify. Or at least, it's not documented very well if you can.

So you have to create an AWS Amplify app manually in the console.

Set the Amplify service account to the one created in the backend stack. It has permissions to all the right resources.

### Build Settings

- Build Image: Amazon Linux:2023 image
- Build Timeout: (default)
- Package Overrides:
  - Amplify CLI: latest
  - Next.js version: latest
  - Node.js version: 18

Amazon Linux:2023 is relatively new build image that is required in order to build a Next.js 13+ App Router application, which requires Node.js 18+, which wasn't supported until the Amazon Linux:2023 image.

### Environment Variables

As far as I know, these have to be set manually in the AWS Amplify Console.

- EGV_RUNTIME_ACCESS_KEY_ID
- EGV_RUNTIME_SECRET_ACCESS_KEY
  - Access token and secret for an account that has access to resources from the server-side runtime. These are required mainly so that the api can access DynamoDB tables. Couldn't find any other way to get credentials to the runtime. Create an IAM user with S3ReadOnly, DynamoReadOnly, and SQS message send permissions, then create access tokens and set them here. At some future date I want to update the CloudFormation template to make this user. Then all you'll have to do is export the tokens.
- EGV_USER_MASTODON_API_TOKEN
  - Get this by querying the Mastodon API of your ActivityPub server instance. (I use GoToSocial, actually, not Mastodon.)
- EGV_USER_COMMENTBOX
  - A CommentBox api key. If not specified, no CommentBox is rendered.
- EGV_RESOURCE_STATE_TABLE
- EGV_RESOURCE_SEARCH_TABLE
- EGV_RESOURCE_JSON_BUCKET
- EGV_RESOURCE_EVENT_QUEUE
  - Names of resources managed by Amplify and CloudFormation so they have long, weird names. These no longer need to be set manually. They are read from the CloudFormation outputs and populated during the Amplify frontend build.



## Next.js

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
