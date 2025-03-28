# Capital Web App

This web application serves as a dynamic meta preview and deep linking handler for the Capital mobile app.

## Features

- Generates dynamic meta previews for social media sharing of opportunities
- Handles deep linking to the Capital mobile app
- Supports both iOS (Universal Links) and Android (App Links) deep linking
- Redirects non-deep link traffic to the main web app

## Technical Implementation

### Meta Preview Generation
- Dynamic meta tags generated via `/api/meta` endpoint
- Supports Open Graph and Twitter Card meta tags
- Includes title, description, image and URL metadata
- Auto-redirects to mobile app or web app as fallback

### Deep Linking Configuration
- iOS Universal Links configured in `apple-app-site-association`
  - Bundle ID: `Q8924BQSUL.com.venturedk.capital`
  - Path pattern: `/RootNavView/OpportunityDetails*`

- Android App Links configured in `.well-known/assetlinks.json`
  - Package: `com.capital.connect.app`
  - URL handling for opportunity details pages

### URL Handling
- Opportunity URLs format: `/opportunity/:id`
- Redirects non-opportunity traffic to main web app
- Configured via Vercel redirects and rewrites

## Development
To run locally:
1. Clone the repository
2. Install dependencies: `npm install`
3. Start dev server: `npm run dev`

## Deployment
The application is deployed on Vercel with automatic deployments from the main branch.

## Environment Variables
Required environment variables:
- `API_URL`: Base URL for the Capital backend API
{
      "src": "/.well-known/apple-app-site-association",
      "dest": "/public/.well-known/apple-app-site-association",
      "headers": {
        "Content-Type": "application/json"
      }
    },
    {
      "src": "/apple-app-site-association",
      "dest": "/public/apple-app-site-association",
      "headers": {
        "Content-Type": "application/json"
      }
    },
    {
      "src": "/.well-known/assetlinks.json",
      "dest": "/public/.well-known/assetlinks.json",
      "headers": {
        "Content-Type": "application/json"
      }
    },