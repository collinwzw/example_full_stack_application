import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import { Construct } from 'constructs';
import * as path from 'path';

export class HelloWorldStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create Lambda function
    const helloFunction = new lambda.Function(this, 'HelloWorldFunction', {
      runtime: lambda.Runtime.JAVA_17,
      handler: 'com.example.Handler::handleRequest',
      code: lambda.Code.fromAsset(path.join(__dirname, '../target/hello-world-lambda-1.0-SNAPSHOT.jar')),
      memorySize: 512,
      timeout: cdk.Duration.seconds(30),
    });

    // Create API Gateway with CORS enabled
    const api = new apigateway.RestApi(this, 'HelloWorldApi', {
      restApiName: 'Hello World API',
      description: 'Simple API Gateway with Lambda integration',
      defaultCorsPreflightOptions: {
        allowOrigins: [
          'http://localhost:3000',
          'https://*.cloudfront.net'  // Add this line
        ],
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'Authorization'],
      },
    });

    // Create API Gateway resource and method
    const helloIntegration = new apigateway.LambdaIntegration(helloFunction);
    api.root.addMethod('GET', helloIntegration);

    // Create S3 bucket for website hosting
    const websiteBucket = new s3.Bucket(this, 'WebsiteBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // Create CloudFront distribution
    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin: new origins.S3Origin(websiteBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      defaultRootObject: 'index.html',
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        },
      ],
    });

    // Deploy website contents to S3
    new s3deploy.BucketDeployment(this, 'DeployWebsite', {
      sources: [s3deploy.Source.asset(path.join(__dirname, '../frontend/build'))],
      destinationBucket: websiteBucket,
      distribution,
      distributionPaths: ['/*'],
    });

    // Output the URLs
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
      description: 'API Gateway endpoint URL',
    });

    new cdk.CfnOutput(this, 'WebsiteUrl', {
      value: `https://${distribution.distributionDomainName}`,
      description: 'Website URL',
    });
  }
}
