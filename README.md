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

Let's also use zod for schema validation

```bash
npm install @hookform/resolvers
```

### Installing react-hook-form for the chat form

```bash
npm install react-hook-form
```

We can also install zod for form validation

```bash
npm install zod
```

## Setting up the backend

### Containerizing the application

We'll rely on Docker and leverage Kubernetes for orchestration.

- creating dockerfiles
- selecting the correct base images

### Starting the minikube cluster

We start a local development kubernetes cluster using minikube.

```bash
minikube start
```

You can check if minikube started correctly by running the following command:

```bash
minikube status
```

We enable the ingress addon, so we can route traffic to our services.

(You only need to do this once, addons configuration is persisted)

```bash
minikube addons enable ingress
```

Our Ingress controller exposes services of type LoadBalancer.

To enable traffic from our local machine to services exposed by the Ingress controller as LoadBalancer, we need to
create a tunnel.

```bash
minikube tunnel
```

We can now run our app in a development environment using skaffold.

```bash
skaffold dev
```

### Creating a new django project in our api

We can create a new django app in our api_project by accessing the pod via `kubectl`.

You can retrieve the pod name using the following command:

```bash
kubectl get pods  # ex pod name returned: api-deployment-9bcd57788-6b2jr
```

```bash
kubectl exec <pd-name> -- python manage.py startapp api_app
```

```bash
kubectl exec api-deployment-86886859cc-2zf4j -- python manage.py startapp api_app
kubectl exec -n default api-deployment-86886859cc-2zf4j -- tar cf - /app/api_app | tar xf - -C /Users/devmadou/Documents/work/projects/poc/chatbot/api/api_app_copy
```

We can then register the app in our `api_project/settings.py` file.

```python
INSTALLED_APPS = [
    ...,
    'api_app',
]
```

### Replicating the dependencies in our local environment

We'll install pipenv locally and replicate dependencies in our local environment, so we can benefit form code
completion. This is not mandatory, but if not done, all files may show up errored in our IDE.

For that, we'll use pipenv.

We need to cd into our api app directory.

```bash
cd api
```

Then, we install our dependencies. The requirements file will be picked up automatically by pipenv.

```bash
pipenv install
```

We may need to lock the version of our dependencies to avoid inconsistencies between environments (local, preprod,
prod):

```bash
pipenv lock --keep-outdated
```

We can now activate our environment:

```bash
pipenv shell
```

### Configuring the Chatbot API used

We'll use OpenAI APIs to power our chatbot.

Once you create an account on https://openai.com/blog/openai-api and get some credit, you can install the openai python
package.

We could also simply add the `openai` package to our `requirements.txt` file and run the installation again:

```text
Django>=5.0.2
psycopg2-binary>=2.9.9
openai>=1.12.0
```

The api container should reload, but we still install the dependencies locally to benefit from code completion.

```bash
pipenv install
```

Create an environment variable to store your API key in `api/.env`.

***DO NOT SHARE THIS KEY WITH ANYONE***

You can skip versioning this file by adding it to your `.gitignore` file.

```dotenv
OPENAI_API_KEY=your-api-key
```

- installing python-dotenv

