#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { QcWorldlabsStack } from "../lib/qc-worldlabs-stack";

const app = new cdk.App();

new QcWorldlabsStack(app, "QcWorldlabsStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    // Pinned to us-west-2: the deployed stack lives there. Do not change
    // without migrating the stack, or CDK will create a duplicate elsewhere.
    region: "us-west-2",
  },
  description:
    "Quantum Cinema - Interactive quantum computing visualization with CloudFront + ALB + ECS Fargate",
});
