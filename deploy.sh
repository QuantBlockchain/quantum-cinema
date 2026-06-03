#!/bin/bash
set -e

echo "========================================="
echo "Quantum Cinema - AWS Deployment"
echo "========================================="

# Check AWS credentials
echo "Checking AWS credentials..."
aws sts get-caller-identity > /dev/null 2>&1 || {
    echo "ERROR: AWS credentials not configured. Run 'aws configure' first."
    exit 1
}

ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REGION=${AWS_DEFAULT_REGION:-us-east-1}
echo "Account: $ACCOUNT_ID"
echo "Region: $REGION"

# Install CDK dependencies
echo ""
echo "Installing CDK dependencies..."
npm install

# Build frontend
echo ""
echo "Building frontend..."
cd quantum-cinema
npm install
npm run build
cd ..

# Bootstrap CDK (if needed)
echo ""
echo "Bootstrapping CDK..."
npx cdk bootstrap aws://$ACCOUNT_ID/$REGION 2>/dev/null || true

# Deploy
echo ""
echo "Deploying stack..."
npx cdk deploy --require-approval broadening

echo ""
echo "========================================="
echo "Deployment complete!"
echo "========================================="
