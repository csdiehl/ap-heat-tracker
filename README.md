# Heat Tracker

By: Caleb Diehl

This is the frontend for the extreme heat tracker (2023 version).

Links to interactive:

- **Production**: [https://projects.apnews.com/features/2023/heat-tracker/index.html][prod]
- **Preview**: [https://interactives-qa.ap.org/heat-tracker/][preview]

## Development

If you are cloning this interactive for and running it for the first time,
start by installing the necessary dependencies:

```shell
yarn install
```

Run this interactive in development by running:

```shell
yarn start
```

This will open your interactive in your browser.

## Deployment

### Preview

Deployments to the preview URL will happen automatically with every push to the main branch. If an update does not seem to be coming through, click "CI/CD" in the left menu to confirm that the build and preview deployment were successful.

### Production

We are set up to make production deployments manually via gitlab CI.

1. click `CI/CD -> Pipelines` in the left menu.
2. Next to the commit you want to deploy, you should see four circles. Hover over each circle to see the name of the task.
3. Click the task called `prod_deploy`

### Removing production deploy

If for any reason you want to take down the production deployment, follow steps 1 and 2 above, but

## Optimizing images

This project includes a script that will generate multiple image
sizes and nextgen image formats (webp and avif), so that we can load the smallest possible image file for for a user's device and browser.

```
yarn prep-image ./path/to/image.jpg
```

It's also possible to run the script on a whole folder at once, with:

```
yarn prep-image ./path/to/directory
```

[prod]: https://projects.apnews.com/features/2023/heat-tracker/index.html
[preview]: https://interactives-qa.ap.org/heat-tracker/
