# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Local Development

### Backend (Java Lambda)

1. Build the Java Lambda function:
```bash
mvn clean package
```

### Frontend (React)

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start development server:
```bash
npm start
```

The app will be available at `http://localhost:3000`

## Deployment

### First-time Setup

1. Install project dependencies:
```bash
npm install
```

2. Bootstrap AWS CDK (first-time only):
```bash
cdk bootstrap
```

### Deploy the Application

1. Build the Java Lambda function:
```bash
mvn clean package
```

2. Build the frontend:
```bash
cd frontend
npm install
npm run build
cd ..
```

3. Deploy using CDK:
```bash
cdk deploy
```

After deployment, CDK will output:
- API Gateway URL (for backend API)
- CloudFront URL (for frontend website)

## Testing

### Backend Testing
```bash
cd src
mvn test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## Architecture

- **Frontend**: React application hosted on S3 and served through CloudFront
- **Backend**: Java Lambda function exposed through API Gateway
- **Infrastructure**: Defined using AWS CDK in TypeScript

## Important Files

- `lib/hello-world-stack.ts`: CDK infrastructure definition
- `src/main/java/com/example/Handler.java`: Lambda function code
- `frontend/src/App.tsx`: Main React component
- `frontend/src/App.css`: Styles for the React app

## Available Scripts

In the project root:
- `cdk deploy`: Deploy the full stack
- `cdk diff`: Show changes to be deployed
- `cdk destroy`: Remove all resources

In the frontend directory:
- `npm start`: Start development server
- `npm test`: Run tests
- `npm run build`: Build for production

## Environment Variables

Frontend:
- Create `.env` file in the frontend directory:

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## Troubleshooting

### CORS Issues
If experiencing CORS errors:
1. Check API Gateway CORS configuration in `lib/hello-world-stack.ts`
2. Verify Lambda function CORS headers in `Handler.java`
3. Ensure frontend is using the correct API URL

### Deployment Issues
1. Ensure AWS credentials are properly configured
2. Check CloudWatch logs for Lambda errors
3. Verify all build steps completed successfully

## Cleanup

To remove all deployed resources:
```bash
cdk destroy
```

Note: This will delete all resources including the S3 bucket and CloudFront distribution.

## Security

- The API Gateway is configured with CORS
- CloudFront serves the frontend over HTTPS
- S3 bucket is not publicly accessible (accessed through CloudFront)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
