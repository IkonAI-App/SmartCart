# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## AWS Amplify Deployment

### Checking Deployment Logs

To check the latest Amplify deployment logs:

```bash
npm run amplify:logs
```

Or directly:

```bash
./scripts/check-amplify-logs.sh
```

To check a specific job:

```bash
./scripts/check-amplify-logs.sh <job-id>
```

The script will:
- Fetch the latest deployment job (or a specific job if ID is provided)
- Display job status and information
- Show the last 100 lines of build logs
- Provide a summary of the deployment status
