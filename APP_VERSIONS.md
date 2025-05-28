# TalentMatch AI - App Version Guide

This guide explains the different app versions available and how to switch between them.

## Available App Versions

### 1. `App.tsx` - Full Featured App (Original)
- **Features**: Complete TalentMatch AI with authentication, job matching, profiles
- **Components**: Supabase auth, protected routes, full UI
- **Issue**: May cause blank page on some environments due to authentication complexity
- **Use**: Production environment with proper Supabase setup

### 2. `AppFixed.tsx` - Stable UI Version (Current)
- **Features**: Beautiful landing page with UI components, no authentication
- **Components**: React Router, shadcn/ui components, responsive design
- **Status**: ✅ Working on all environments
- **Use**: Recommended for Lovable and environments with auth issues

### 3. `AppWorking.tsx` - Basic Functional Version
- **Features**: Simple routing with basic styling
- **Components**: React Router, HTML/CSS styling
- **Status**: ✅ Always works
- **Use**: Fallback option, testing basic functionality

### 4. `AppDebug.tsx` - Diagnostic Version
- **Features**: Environment checking, debug information
- **Components**: Basic React, environment variable display
- **Status**: ✅ For troubleshooting
- **Use**: Debugging environment issues

### 5. `MinimalApp.tsx` - Minimal Test
- **Features**: Basic React component test
- **Components**: Pure React, no routing
- **Status**: ✅ Basic React test
- **Use**: Testing if React is working

## How to Switch Versions

Edit `src/main.tsx` and change the import/render:

```typescript
// Switch to different app version
import AppFixed from './AppFixed.tsx';  // Change this line

// Update the render call
React.createElement(AppFixed)  // Change this line
```

## Current Status

- **Active Version**: `AppFixed.tsx`
- **Reason**: Fixes blank page issue on Lovable
- **Features Available**: Landing page, routing, UI components
- **Missing**: Authentication (removed to fix blank page)

## Recommended Setup for Different Environments

### For Lovable (Cloud Environment)
```typescript
React.createElement(AppFixed)  // Stable, no auth issues
```

### For Local Development
```typescript
React.createElement(App)  // Full features with proper .env.local
```

### For Debugging
```typescript
React.createElement(AppDebug)  // Check environment and troubleshoot
```
