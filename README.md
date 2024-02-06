# Chatbot commands

## Setting up the frontend

### Creating the project folder

```bash
mkdir chatbot
```

```bash
cd chatbot
```

### Creating a new next project

#### Why Next.js?

We'll use next to build the front end of the chatbot.

Next provides a bunch of built-in features to build entreprise level applications with React.

Even the React teams recommends using Next.js for complex entreprise applications as it streamlines the development and
deployment process.

Bootstrapping the project:

> npx create-next-app@latest

#### TailwindCSS

We wll opt-out of using TailwindCSS for a few reasons:

- We'll rely on the components provided by the DSFR react library
- We'll rely on MUI for more advanced components
    - react-dsfr actually has a handy MUI integration
    - MUI and TailwindCSS can conflict with each other regarding their capabilities
- The CSS in JS solution recommended by the author is TSS-react which he owns and maintains
    - It integrates seamlessly with MUI

### Installing MUI (and associated CSS in JS libraries)

```bash
npm install @mui/material @emotion/react @emotion/styled @emotion/server tss-react
```

### Installing dsfr-react

```bash
npm install @codegouvfr/react-dsfr
```

```bash
npm install --save-dev sass
```

