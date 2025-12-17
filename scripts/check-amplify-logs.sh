#!/bin/bash

# Script to check the latest Amplify deployment job logs
# Usage: ./scripts/check-amplify-logs.sh [job-id]

set -e

# Configuration
APP_ID="dvdenm3zgv9km"
BRANCH_NAME="SmartCart"
REGION="ap-southeast-1"
PROFILE="capy"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Amplify Deployment Logs Checker ===${NC}\n"

# Get the latest job if no job ID provided
if [ -z "$1" ]; then
    echo -e "${YELLOW}Fetching latest job...${NC}"
    JOB_ID=$(aws amplify list-jobs \
        --app-id "$APP_ID" \
        --branch-name "$BRANCH_NAME" \
        --region "$REGION" \
        --profile "$PROFILE" \
        --max-results 1 \
        --query 'jobSummaries[0].jobId' \
        --output text)
    
    if [ "$JOB_ID" == "None" ] || [ -z "$JOB_ID" ]; then
        echo -e "${RED}No jobs found${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}Latest job ID: $JOB_ID${NC}\n"
else
    JOB_ID="$1"
    echo -e "${GREEN}Checking job ID: $JOB_ID${NC}\n"
fi

# Get job details
echo -e "${YELLOW}Fetching job details...${NC}"
JOB_INFO=$(aws amplify get-job \
    --app-id "$APP_ID" \
    --branch-name "$BRANCH_NAME" \
    --job-id "$JOB_ID" \
    --region "$REGION" \
    --profile "$PROFILE")

# Extract job status
STATUS=$(echo "$JOB_INFO" | jq -r '.job.summary.status')
COMMIT_ID=$(echo "$JOB_INFO" | jq -r '.job.summary.commitId')
COMMIT_TIME=$(echo "$JOB_INFO" | jq -r '.job.summary.commitTime')
START_TIME=$(echo "$JOB_INFO" | jq -r '.job.summary.startTime')
END_TIME=$(echo "$JOB_INFO" | jq -r '.job.summary.endTime // "N/A"')

echo -e "${BLUE}Job Information:${NC}"
echo -e "  Status: ${STATUS}"
echo -e "  Commit ID: ${COMMIT_ID}"
echo -e "  Commit Time: ${COMMIT_TIME}"
echo -e "  Start Time: ${START_TIME}"
echo -e "  End Time: ${END_TIME}\n"

# Get build step log URL
BUILD_LOG_URL=$(echo "$JOB_INFO" | jq -r '.job.steps[] | select(.stepName == "BUILD") | .logUrl // empty')

if [ -z "$BUILD_LOG_URL" ] || [ "$BUILD_LOG_URL" == "null" ]; then
    echo -e "${RED}No build log URL found${NC}"
    exit 1
fi

echo -e "${YELLOW}Fetching build logs...${NC}\n"
echo -e "${BLUE}=== BUILD LOGS ===${NC}\n"

# Download and display logs
curl -s "$BUILD_LOG_URL" | tail -100

echo -e "\n${BLUE}=== End of Logs ===${NC}"

# Show status summary
if [ "$STATUS" == "SUCCEED" ]; then
    echo -e "\n${GREEN}✓ Deployment succeeded!${NC}"
elif [ "$STATUS" == "FAILED" ]; then
    echo -e "\n${RED}✗ Deployment failed!${NC}"
    echo -e "${YELLOW}Full logs available at:${NC}"
    echo "$BUILD_LOG_URL"
elif [ "$STATUS" == "RUNNING" ]; then
    echo -e "\n${YELLOW}⏳ Deployment is still running...${NC}"
    echo -e "${YELLOW}Run this script again in a few minutes to see updated logs.${NC}"
else
    echo -e "\n${YELLOW}Status: $STATUS${NC}"
fi

