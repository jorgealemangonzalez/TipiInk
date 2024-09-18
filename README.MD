# Setup

```bash
npx firebase init emulators
```

You will also need to install the [stripe cli](https://docs.stripe.com/stripe-cli#install)

When deploying the external-facing functions ( such as the webhooks ) you need to 
[enable unauthenticated invocations](https://cloud.google.com/functions/1stgendocs/securing/managing-access-iam#gcloud_4)

# Running 

Using different windows:

Compile backend
```bash
pnpm run backend:watch
```

run emulators
```bash
pnpm run backend:emulate
```

Run frontend
```bash
pnpm run frontend:dev
```

Run stripe extension webhooks
```bash
    pnpm run -w stripe:extension:listen
```

Run stripe custom webhooks
```bash
    pnpm run -w stripe:custom:listen
```

# Deploying


Frontend:
```bash
pnpm run frontend:deploy
```

Backend:
```bash
pnpm run backend:deploy
```

All:
```bash
pnpm run firebase deploy
```


Stripe webhook secret (Optional): This is your signing secret for a Stripe-registered webhook. This webhook can only be registered after installation. Leave this value untouched during installation, then follow the postinstall instructions for registering your webhook and configuring this value.
? Where would you like to store your secrets? If you don't want to set this optional secret, leave both options unselected to skip it 
