import fs from 'fs/promises'
import path from 'path'
import process from 'process'
import { authenticate } from '@google-cloud/local-auth'
import { google } from 'googleapis'
import { OAuth2Client } from '../domain'

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly']
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const BASE_CREDENTIALS_PATH = '/configs/latest'
const TOKEN_PATH = path.join(process.cwd(), BASE_CREDENTIALS_PATH, 'token.json')
const CREDENTIALS_PATH = path.join(process.cwd(),  BASE_CREDENTIALS_PATH, 'credentials.json')

const CredentialsService = () => {

  const loadSavedCredentialsIfExist = async (): Promise<OAuth2Client | null> => {
    try {
      const content: string = await fs.readFile(TOKEN_PATH, 'utf8')
      const credentials = JSON.parse(content)
      return google.auth.fromJSON(credentials) as OAuth2Client
    } catch (err) {
      console.error('Error loading saved credential', err)
      return null
    }
  }

  const saveCredentials = async (client: OAuth2Client) => {
    const content: string = await fs.readFile(CREDENTIALS_PATH, 'utf8')
    const keys = JSON.parse(content)
    const key = keys.installed || keys.web
    const payload = JSON.stringify({
      type: 'authorized_user',
      client_id: key.client_id,
      client_secret: key.client_secret,
      refresh_token: client.credentials.refresh_token,
    })
    await fs.writeFile(TOKEN_PATH, payload)
  }

  const authorize = async () => {
    const jsonClient = await loadSavedCredentialsIfExist()
    if (jsonClient) {
      return jsonClient
    }
    const authClient = await authenticate({
      scopes: SCOPES,
      keyfilePath: CREDENTIALS_PATH,
    })
    if (authClient.credentials) {
      await saveCredentials(authClient)
    }
    return authClient
  }

  return {
    authorize
  }
}

export { CredentialsService }
