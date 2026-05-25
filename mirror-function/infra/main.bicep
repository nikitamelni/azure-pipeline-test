// Uniform edge mirror — Azure infrastructure.
//
// Provisions:
//   * Storage account (one for both AzureWebJobsStorage and mirror data)
//     - Blob container `edge-mirror` for the route JSONs
//     - Table `byTag` for tag → routes invalidation lookup
//   * Application Insights for observability
//   * Linux Consumption Function App (Node 22) hosting the mirror code
//   * App settings (UNIFORM_*, MIRROR_*) wired from parameters
//
// Secret parameters (UNIFORM_API_KEY) are passed in at deploy time. Storage
// keys are looked up via listKeys() so they're never persisted in source.

@description('Azure region to deploy into.')
param location string = resourceGroup().location

@description('Short name prefix used for all resources. 3-11 lowercase chars recommended.')
param namePrefix string = 'pfgmirror'

@description('Uniform project ID to mirror.')
param uniformProjectId string

@description('Uniform API key. Pass via --parameters file or @secure() automation; do not commit.')
@secure()
param uniformApiKey string

@description('Uniform edge API base. Override only for testing.')
param uniformApiBase string = 'https://uniform.global'

@description('Uniform management API base. Override only for testing.')
param uniformAppBase string = 'https://uniform.app'

@description('Blob container name for route JSONs.')
param blobContainer string = 'edge-mirror'

@description('Table name for tag→route reverse index.')
param tableByTag string = 'byTag'

@description('Max requests per second the mirror will issue to Uniform.')
param rateLimitRps int = 5

@description('Default URL locale prefix (matches the Next.js app modifyPath).')
param defaultLocale string = 'en'

@description('JSON map of dynamic route placeholder name → Uniform entry type. Example: {"location":"location"}')
param dynamicExpansions string = '{"location":"location"}'

@description('CRON expression (NCRONTAB, 6-field) for the seed reconciliation timer.')
param seedTimerCron string = '0 0 */6 * * *'

@description('Function runtime version to host. node|22 supports the v4 programming model.')
param functionsRuntimeVersion string = '~4'

@description('Node version for the worker process.')
param nodeVersion string = '22'

var storageAccountName = toLower('${namePrefix}st${uniqueString(resourceGroup().id)}')
var functionAppName    = '${namePrefix}-fn'
var hostingPlanName    = '${namePrefix}-plan'
var appInsightsName    = '${namePrefix}-ai'
var logWorkspaceName   = '${namePrefix}-logs'

resource storage 'Microsoft.Storage/storageAccounts@2023-05-01' = {
  name: storageAccountName
  location: location
  sku: { name: 'Standard_LRS' }
  kind: 'StorageV2'
  properties: {
    accessTier: 'Hot'
    allowBlobPublicAccess: false
    supportsHttpsTrafficOnly: true
    minimumTlsVersion: 'TLS1_2'
  }
}

resource blobService 'Microsoft.Storage/storageAccounts/blobServices@2023-05-01' = {
  parent: storage
  name: 'default'
}

resource mirrorContainer 'Microsoft.Storage/storageAccounts/blobServices/containers@2023-05-01' = {
  parent: blobService
  name: blobContainer
  properties: {
    publicAccess: 'None'
  }
}

resource tableService 'Microsoft.Storage/storageAccounts/tableServices@2023-05-01' = {
  parent: storage
  name: 'default'
}

resource byTagTable 'Microsoft.Storage/storageAccounts/tableServices/tables@2023-05-01' = {
  parent: tableService
  name: tableByTag
}

resource logWorkspace 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  name: logWorkspaceName
  location: location
  properties: {
    sku: { name: 'PerGB2018' }
    retentionInDays: 30
  }
}

resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: appInsightsName
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: logWorkspace.id
  }
}

resource hostingPlan 'Microsoft.Web/serverfarms@2024-04-01' = {
  name: hostingPlanName
  location: location
  sku: {
    name: 'Y1'
    tier: 'Dynamic'
  }
  kind: 'functionapp'
  properties: {
    reserved: true // Linux
  }
}

var storageConnectionString = 'DefaultEndpointsProtocol=https;AccountName=${storage.name};AccountKey=${storage.listKeys().keys[0].value};EndpointSuffix=${environment().suffixes.storage}'

resource functionApp 'Microsoft.Web/sites@2024-04-01' = {
  name: functionAppName
  location: location
  kind: 'functionapp,linux'
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: hostingPlan.id
    httpsOnly: true
    siteConfig: {
      linuxFxVersion: 'NODE|${nodeVersion}'
      ftpsState: 'Disabled'
      minTlsVersion: '1.2'
      appSettings: [
        // ---- Functions runtime plumbing ----
        { name: 'AzureWebJobsStorage', value: storageConnectionString }
        { name: 'WEBSITE_CONTENTAZUREFILECONNECTIONSTRING', value: storageConnectionString }
        { name: 'WEBSITE_CONTENTSHARE', value: toLower(functionAppName) }
        { name: 'FUNCTIONS_EXTENSION_VERSION', value: functionsRuntimeVersion }
        { name: 'FUNCTIONS_WORKER_RUNTIME', value: 'node' }
        { name: 'WEBSITE_NODE_DEFAULT_VERSION', value: '~${nodeVersion}' }
        { name: 'APPLICATIONINSIGHTS_CONNECTION_STRING', value: appInsights.properties.ConnectionString }

        // ---- Uniform configuration ----
        { name: 'UNIFORM_PROJECT_ID', value: uniformProjectId }
        { name: 'UNIFORM_API_KEY', value: uniformApiKey }
        { name: 'UNIFORM_API_BASE', value: uniformApiBase }
        { name: 'UNIFORM_APP_BASE', value: uniformAppBase }

        // ---- Mirror storage configuration ----
        { name: 'MIRROR_STORAGE_CONNECTION', value: storageConnectionString }
        { name: 'MIRROR_BLOB_CONTAINER', value: blobContainer }
        { name: 'MIRROR_TABLE_BY_TAG', value: tableByTag }

        // ---- Mirror behavior ----
        { name: 'MIRROR_RATE_LIMIT_RPS', value: string(rateLimitRps) }
        { name: 'MIRROR_LOCALE_DEFAULT', value: defaultLocale }
        { name: 'MIRROR_DYNAMIC_EXPANSIONS', value: dynamicExpansions }
        { name: 'MIRROR_SEED_TIMER_CRON', value: seedTimerCron }
      ]
    }
  }
  dependsOn: [
    mirrorContainer
    byTagTable
  ]
}

output functionAppName string = functionApp.name
output functionAppHostName string = functionApp.properties.defaultHostName
output storageAccountName string = storage.name
output blobContainerName string = blobContainer
output tableByTagName string = tableByTag
output appInsightsName string = appInsights.name
output mirrorReadEndpoint string = 'https://${functionApp.properties.defaultHostName}/api/v1/route'
output mirrorInvalidateEndpoint string = 'https://${functionApp.properties.defaultHostName}/api/invalidate'
output mirrorSeedEndpoint string = 'https://${functionApp.properties.defaultHostName}/api/seed'
