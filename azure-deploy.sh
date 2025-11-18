# Create the updated azure-deploy.sh script
cat > azure-deploy-central.sh << 'EOF'
#!/bin/bash

# Updated Configuration with centralindia
RESOURCE_GROUP_INDIA="dlai-rg-india"
RESOURCE_GROUP_US="dlai-rg-us"
LOCATION_INDIA="centralindia"  # Changed from westindia to centralindia
LOCATION_US="eastus"           # Using eastus instead of westus2 for better compatibility
APP_NAME="dlaisd"
DOMAIN="www.dlaisd.com"

echo "Starting Azure infrastructure deployment for DLAI Satellite Data..."
echo "Primary Region: $LOCATION_INDIA"
echo "Secondary Region: $LOCATION_US"
echo ""

# Check if user is logged in
echo "Checking Azure login status..."
az account show > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "Please log in to Azure..."
    az login
fi

# Get current subscription
SUBSCRIPTION_ID=$(az account show --query id -o tsv)
SUBSCRIPTION_NAME=$(az account show --query name -o tsv)
echo "Current Subscription: $SUBSCRIPTION_NAME ($SUBSCRIPTION_ID)"
echo ""

# Check if resource providers are registered
echo "Checking resource provider registration..."
az provider register --namespace Microsoft.App --wait
az provider register --namespace Microsoft.OperationalInsights --wait
az provider register --namespace Microsoft.Insights --wait
echo "✅ Resource providers registered"

# Create Resource Groups
echo "Step 1: Creating resource groups..."
az group create --name $RESOURCE_GROUP_INDIA --location $LOCATION_INDIA --tags "Project=DLAI" "Environment=Production"
az group create --name $RESOURCE_GROUP_US --location $LOCATION_US --tags "Project=DLAI" "Environment=Production"
echo "✅ Resource groups created successfully"

# Create Container Registry
echo ""
echo "Step 2: Creating Azure Container Registry..."
az acr create \
  --resource-group $RESOURCE_GROUP_INDIA \
  --name dlaisdregistry \
  --sku Basic \
  --admin-enabled true \
  --tags "Project=DLAI" "Environment=Production"

# Get ACR credentials
ACR_USERNAME=$(az acr credential show --name dlaisdregistry --query username -o tsv)
ACR_PASSWORD=$(az acr credential show --name dlaisdregistry --query passwords[0].value -o tsv)
echo "✅ Container Registry created successfully"
echo "   ACR Login Server: dlaisdregistry.azurecr.io"
echo "   ACR Username: $ACR_USERNAME"

# Create Container Apps Environment
echo ""
echo "Step 3: Creating Container Apps environments..."
az containerapp env create \
  --name dlai-env-india \
  --resource-group $RESOURCE_GROUP_INDIA \
  --location $LOCATION_INDIA \
  --tags "Project=DLAI" "Environment=Production"

az containerapp env create \
  --name dlai-env-us \
  --resource-group $RESOURCE_GROUP_US \
  --location $LOCATION_US \
  --tags "Project=DLAI" "Environment=Production"
echo "✅ Container Apps environments created successfully"

# Create Container App for India (Primary)
echo ""
echo "Step 4: Creating Container Apps..."
az containerapp create \
  --name dlai-app-india \
  --resource-group $RESOURCE_GROUP_INDIA \
  --environment dlai-env-india \
  --image nginx:latest \
  --target-port 4000 \
  --ingress external \
  --min-replicas 1 \
  --max-replicas 5 \
  --tags "Project=DLAI" "Environment=Production" "Region=India"

# Create Container App for US (Secondary)
az containerapp create \
  --name dlai-app-us \
  --resource-group $RESOURCE_GROUP_US \
  --environment dlai-env-us \
  --image nginx:latest \
  --target-port 4000 \
  --ingress external \
  --min-replicas 0 \
  --max-replicas 3 \
  --tags "Project=DLAI" "Environment=Production" "Region=US"

echo "✅ Container Apps created successfully"

# Get FQDNs for both apps
echo ""
echo "Step 5: Retrieving application URLs..."
FQDN_INDIA=$(az containerapp show --name dlai-app-india --resource-group $RESOURCE_GROUP_INDIA --query properties.configuration.ingress.fqdn -o tsv)
FQDN_US=$(az containerapp show --name dlai-app-us --resource-group $RESOURCE_GROUP_US --query properties.configuration.ingress.fqdn -o tsv)

echo "🌐 Application URLs:"
echo "   India (Primary): https://$FQDN_INDIA"
echo "   US (Secondary): https://$FQDN_US"

# Create Application Insights for monitoring
echo ""
echo "Step 6: Setting up monitoring..."
az monitor app-insights component create \
  --app dlai-insights \
  --location $LOCATION_INDIA \
  --resource-group $RESOURCE_GROUP_INDIA \
  --tags "Project=DLAI" "Environment=Production"

APP_INSIGHTS_KEY=$(az monitor app-insights component show --app dlai-insights --resource-group $RESOURCE_GROUP_INDIA --query instrumentationKey -o tsv)
echo "✅ Application Insights configured"
echo "   Instrumentation Key: $APP_INSIGHTS_KEY"

# First, register all required resource providers manually
echo "Registering Azure resource providers..."

# Register Container Registry provider (this was missing)
az provider register --namespace Microsoft.ContainerRegistry --wait

# Register Container Apps providers
az provider register --namespace Microsoft.App --wait
az provider register --namespace Microsoft.OperationalInsights --wait
az provider register --namespace Microsoft.Insights --wait

# Register additional providers that might be needed
az provider register --namespace Microsoft.Web --wait
az provider register --namespace Microsoft.Storage --wait

# Check registration status
echo "Checking provider registration status..."
az provider list --query "[?contains(namespace, 'Microsoft.Container') || contains(namespace, 'Microsoft.App')].{Namespace:namespace, RegistrationState:registrationState}" -o table

# Wait for registration to complete
echo "Waiting for registration to complete (this may take 5-10 minutes)..."
sleep 300

echo ""
echo "🎉 Azure infrastructure deployment completed successfully!"
echo ""
echo "📋 NEXT STEPS:"
echo "1. GitHub Secrets Configuration:"
echo "   - ACR_USERNAME: $ACR_USERNAME"
echo "   - ACR_PASSWORD: $ACR_PASSWORD"
echo "   - AZURE_SUBSCRIPTION_ID: $SUBSCRIPTION_ID"
echo ""
echo "2. Test the deployment:"
echo "   - Visit India app: https://$FQDN_INDIA"
echo "   - Visit US app: https://$FQDN_US"
echo ""
echo "3. Configure custom domain for production:"
echo "   - Update DNS for $DOMAIN to point to: $FQDN_INDIA"
echo ""
echo "4. Push your code to GitHub to trigger the deployment pipeline"
EOF

# Make the script executable
chmod +x azure-deploy-central.sh

# Run the updated deployment script
./azure-deploy-central.sh