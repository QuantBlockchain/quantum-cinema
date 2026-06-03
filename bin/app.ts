#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { QcWorldlabsStack } from "../lib/qc-worldlabs-stack";

const app = new cdk.App();

new QcWorldlabsStack(app, "QcWorldlabsStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || "us-east-1",
  },
  description:
    "Quantum Cinema - Interactive quantum computing visualization with CloudFront + ALB + ECS Fargate",
});
