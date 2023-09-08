This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## IMPORTANT - THE .env.local file

This project calculates the number of tickets sold for a FFF raffle in one day using SHYFT APIs. In order to run to run this project create an .env.local file, and add one variable called

`API_KEY=`

The value for this will be your SHYFT API key which you shall obtain from SHYFT Website [Here.](http://shyft.to/get-api-key)

View our detailed documentation [here.](http://docs.shyft.to/)
