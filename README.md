# Variamos Languages

This project contains the Languages module of the VariaMos platform.

## Install libraries

First you need to install the project libraries, you can do so by running the following command:

```bash
yarn
````

or

```bash
npm i
```

## Run the project

You can run the project by either running any of the following commands.

```bash
yarn start
```

or

```bash
npm run start
```

## Disable Login

In case that you don't have a google account or you need to disable the Google login for some reason, you can create a `.env.local` or update it if you already have one with the following line:

```bash
REACT_APP_DISABLE_LOGIN=true
```
In this way the application will log you in automatically.


## Environment Variables

If you need to update any configuration of the application externaly, you can create an `.env.local` file or pass the following environment variables directly into your environment:

```bash
REACT_APP_DISABLE_LOGIN=
REACT_APP_NODE_ENV=
REACT_APP_HOST=
REACT_APP_PORT=
REACT_APP_URLBACKENDLANGUAGEREVIEWS=
REACT_APP_URLBACKENDLANGUAGE=
REACT_APP_URLVARIAMOSLANGUAGES=
REACT_APP_URLVARIAMOSDOCUMENTATION=
REACT_APP_URLVARIAMOSLANGDOCUMENTATION=
```

## Learn more

You can learn more in the [VariaMos App documentation](https://github.com/variamosple/VariaMosPLE/wiki).

To learn React, check out the [React documentation](https://reactjs.org/).

To learn Bootstrap, check out the [Bootstrap documentation](https://getbootstrap.com/).
