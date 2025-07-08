# OneDrive Integration Setup

## Step 1: Create Azure App Registration

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** > **App registrations**
3. Click **New registration**
4. Fill in:
   - **Name**: LearnTechLab Course Materials
   - **Supported account types**: Accounts in this organizational directory only
   - **Redirect URI**: Web - `http://localhost:3000/api/auth/microsoft/callback`

## Step 2: Configure API Permissions

1. In your app registration, go to **API permissions**
2. Click **Add a permission**
3. Select **Microsoft Graph**
4. Choose **Application permissions**
5. Add these permissions:
   - `Files.ReadWrite.All`
   - `Sites.ReadWrite.All`
6. Click **Grant admin consent**

## Step 3: Create Client Secret

1. Go to **Certificates & secrets**
2. Click **New client secret**
3. Add description: "OneDrive API Access"
4. Set expiration: 24 months
5. Copy the **Value** (not the Secret ID)

## Step 4: Get Required IDs

1. **Client ID**: From app registration Overview page
2. **Tenant ID**: From app registration Overview page
3. **Client Secret**: From step 3 above

## Step 5: Update Environment Variables

Update your `.env.local` file:

```env
MICROSOFT_CLIENT_ID=your_client_id_from_step_4
MICROSOFT_CLIENT_SECRET=your_client_secret_from_step_3
MICROSOFT_TENANT_ID=your_tenant_id_from_step_4
MICROSOFT_REDIRECT_URI=http://localhost:3000/api/auth/microsoft/callback
ONEDRIVE_FOLDER_ID=beffb4d1067d3ffe!107
ONEDRIVE_BASE_URL=https://graph.microsoft.com/v1.0
```

## Step 6: Test the Integration

1. Restart your Next.js application
2. Go to admin course materials page
3. Try uploading a PDF file
4. Check your OneDrive for the uploaded file

## Folder Structure Created

The system will automatically create this structure in your OneDrive:

```
OneDrive/
├── ai-devops-cloud/
│   ├── section-1/
│   │   ├── subsection-1/
│   │   │   ├── material-1.pdf
│   │   │   └── material-2.pdf
│   │   └── subsection-2/
│   └── section-2/
```

## Troubleshooting

- **Authentication Error**: Check client ID, secret, and tenant ID
- **Permission Error**: Ensure admin consent is granted
- **Upload Error**: Verify Files.ReadWrite.All permission is active
- **Folder Creation Error**: Check Sites.ReadWrite.All permission

## Cost Benefits

- **Storage**: 1TB for $6.99/month (vs S3 variable costs)
- **Bandwidth**: No charges (vs S3 $0.09/GB)
- **Requests**: No charges (vs S3 $0.0004/1000)
- **Annual Savings**: ~$1,000+ compared to S3