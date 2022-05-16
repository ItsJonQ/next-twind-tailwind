# Twind x Next.js

Getting [Twind](https://twind.dev/) to work with [Next.js](https://nextjs.org/) (v10).

## Goal

- Ensure server-side rendering is working.
- Ensuring there's not FOUC (flash of unstyled content).

## Versions

- [Next.js](https://nextjs.org/), `v10.0.0`
- [Twind](https://twind.dev/), `v0.16.16`

## Setup

### Setting up Twind

Ensure your project has the correct Twind dependencies:

```sh
npm install -D @twind/next twind
```

Create a `twind.config.js` file at the root of your project, and add the following:

```js
export default {
  theme: {
    extend: {
      screens: {
        standalone: { raw: '(display-mode:standalone)' },
      },
    },
  },
};
```

### Check if Twind is working

Add some very simple Twind styles to a test page.

```jsx
// pages/example.js
import Head from 'next/head';
import Image from 'next/image';
import { tw } from 'twind';

export default function Page() {
  return (
    <main
      className={tw`h-screen bg-purple-400 flex items-center justify-center`}
    >
      <h1
        className={tw`font-bold text(center 5xl white sm:gray-800 md:pink-700)`}
      >
        This is Twind!
      </h1>
    </main>
  );
}
```

Fire up your Next.js app. These Twind styles should load.

You should see a lavendar purple page with large pink text saying "This is Twind!".

If this isn't working, you'll need to tinker to get the basics of Twind to work with your Next.js project.

If Twind is working, then move onto the next step.

### Server-side rendering Twind

At this point in time, you should have:

- A working Next.js app
- Tailwind styles loaded and working
- Twind working with Tailwind and Next.js

However, you may notice that you're experience a flash of unstyled content (FOUC) for production builds.

This is because Twind isn't being server-side rendered yet. We're going to do that now!

Previously, we've installed the necessary dependency to get this working, `@twind/next`.

```sh
npm install -D @twind/next twind
```

On [Twind's Next.js docs](https://github.com/tw-in-js/use-twind-with/tree/main/packages/next), they include instructions on setting up Twind **with a custom Document component**.

This is what you'll have to do.

Open (or create) a `pages/_document.js` file in your Next.js project.

Add the following to ensure the exported `Document` (class) is wrapped with `withTwindDocument` and `twindConfig`.

```jsx
// pages/_document.js
import Document from 'next/document';
import withTwindDocument from '@twind/next/document';
import twindConfig from '../twind.config';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }
}

export default withTwindDocument(twindConfig, MyDocument);
```

Twind's instructions are **missing** the `Document` import. Add this part in if your `_document.js` file doesn't have it.

```jsx
import Document from 'next/document';
```

### Check if Twind SSR is working

Moment of truth...

You can actually do this without building Next.js for production and serving it.

In local development (running `npm run dev`), when you view the source code, you should be able to see the (giant) `style` tag with the various Tailwind styles inside.

```
<style id="__tw-v3yfpw">button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;margin:0...
```

If you can see it when viewing source, that means that **SSR is working**. The styles from Twind is extracting correctly and being injected into the document.

## Questions

### How does this work?

Simply put, it's looking at the HTML to figure out what classes the page needs, then injecting those classes.

All of this happens in `pages/_document.js`.

CSS(-in-JS) and SSR work by examining the HTML that's being rendered on the page. They then cross match details (like classes) to pluck out the necessary styles needed to render those styles.

After getting all the classes, they'll "inject" all of those classes in a `style` tag along with the page's original HTML (`string`).

That's it! SSR CSS in a nutshell.

You can see some of these mechanics in Twind's [Next.js integration](https://github.com/tw-in-js/use-twind-with/blob/main/packages/next/document.ts) as well as their [shim file](https://github.com/tw-in-js/use-twind-with/blob/main/packages/next/shim/document.ts).
