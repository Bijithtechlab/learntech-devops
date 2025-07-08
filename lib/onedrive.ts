import { Client } from '@microsoft/microsoft-graph-client'
import { ConfidentialClientApplication } from '@azure/msal-node'

// Microsoft Graph configuration
const msalConfig = {
  auth: {
    clientId: process.env.MICROSOFT_CLIENT_ID!,
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET!,
    authority: `https://login.microsoftonline.com/${process.env.MICROSOFT_TENANT_ID}`
  }
}

const cca = new ConfidentialClientApplication(msalConfig)

// OneDrive configuration
const ONEDRIVE_CONFIG = {
  folderId: process.env.ONEDRIVE_FOLDER_ID || 'beffb4d1067d3ffe!107',
  baseUrl: process.env.ONEDRIVE_BASE_URL || 'https://graph.microsoft.com/v1.0'
}

// For now, we'll use direct file uploads to the shared folder
// This is a simplified approach using the shared drive

export class OneDriveService {
  
  // Get authenticated Graph API client
  private static async getGraphClient(): Promise<Client> {
    try {
      const clientCredentialRequest = {
        scopes: ['https://graph.microsoft.com/.default']
      }
      
      const response = await cca.acquireTokenByClientCredential(clientCredentialRequest)
      
      if (!response?.accessToken) {
        throw new Error('Failed to acquire access token')
      }
      
      return Client.init({
        authProvider: (done) => {
          done(null, response.accessToken)
        }
      })
    } catch (error) {
      console.error('Graph client authentication error:', error)
      throw error
    }
  }
  
  // Generate OneDrive sharing URL
  static async generateSharingUrl(itemId: string): Promise<string> {
    try {
      const graphClient = await this.getGraphClient()
      
      const sharingLink = await graphClient
        .api(`/me/drive/items/${itemId}/createLink`)
        .post({
          type: 'view',
          scope: 'anonymous'
        })
      
      return sharingLink.link.webUrl
    } catch (error) {
      console.error('Error generating sharing URL:', error)
      throw error
    }
  }

  // Upload file to OneDrive using Graph API
  static async uploadFile(
    file: Buffer, 
    fileName: string, 
    courseId: string, 
    sectionId: string, 
    subSectionId: string
  ): Promise<{ success: boolean; url?: string; itemId?: string; error?: string }> {
    try {
      const graphClient = await this.getGraphClient()
      
      // Create folder structure if it doesn't exist
      const folderPath = `${courseId}/${sectionId}/${subSectionId}`
      await this.ensureFolderExists(graphClient, folderPath)
      
      // Upload file
      const uploadPath = `/me/drive/root:/${folderPath}/${fileName}:/content`
      
      const uploadedItem = await graphClient
        .api(uploadPath)
        .put(file)
      
      // Generate sharing link
      const sharingUrl = await this.generateSharingUrl(uploadedItem.id)
      
      return {
        success: true,
        url: sharingUrl,
        itemId: uploadedItem.id
      }
    } catch (error) {
      console.error('OneDrive upload error:', error)
      return {
        success: false,
        error: `Failed to upload to OneDrive: ${error}`
      }
    }
  }

  // Ensure folder structure exists
  private static async ensureFolderExists(graphClient: Client, folderPath: string): Promise<void> {
    try {
      const folders = folderPath.split('/')
      let currentPath = ''
      
      for (const folder of folders) {
        currentPath = currentPath ? `${currentPath}/${folder}` : folder
        
        try {
          await graphClient.api(`/me/drive/root:/${currentPath}`).get()
        } catch (error) {
          // Folder doesn't exist, create it
          const parentPath = currentPath.substring(0, currentPath.lastIndexOf('/')) || '/'
          const parentApi = parentPath === '/' ? '/me/drive/root/children' : `/me/drive/root:/${parentPath}:/children`
          
          await graphClient.api(parentApi).post({
            name: folder,
            folder: {},
            '@microsoft.graph.conflictBehavior': 'rename'
          })
        }
      }
    } catch (error) {
      console.error('Error ensuring folder exists:', error)
      throw error
    }
  }

  // Delete file from OneDrive
  static async deleteFile(itemId: string): Promise<boolean> {
    try {
      const graphClient = await this.getGraphClient()
      
      await graphClient
        .api(`/me/drive/items/${itemId}`)
        .delete()
      
      return true
    } catch (error) {
      console.error('OneDrive delete error:', error)
      return false
    }
  }
}

export default OneDriveService