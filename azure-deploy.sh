#!/bin/bash

# Configuration
RESOURCE_GROUP_INDIA="dlai-rg-india"
RESOURCE_GROUP_US="dlai-rg-us"
LOCATION_INDIA="westindia"
LOCATION_US="westus2"
APP_NAME="dlaisd"
DOMAIN="www.dlaisd.com"

echo "Starting Azure infrastructure deployment..."

# Create Resource Groups
echo "Creating resource groups..."
az group create --name $RESOURCE_GROUP_INDIA --location $LOCATION_INDIA
az group create --name $RESOURCE_GROUP_US --location $LOCATION_US

# Create Container Registry
echo "Creating container registry..."
az acr create --resource-group $RESOURCE_GROUP_INDIA --name dlaisdregistry --sku Basic --admin-enabled true

# Create Container Apps Environment
echo "Creating container apps environment..."
az containerapp env create \
  --name dlai-env-india \
  --resource-group $RESOURCE_GROUP_INDIA \
  --location $LOCATION_INDIA

az containerapp env create \
  --name dlai-env-us \
  --resource-group $RESOURCE_GROUP_US \
  --location $LOCATION_US

# Create Container App for India (Primary)
echo "Creating container app for India..."
az containerapp create \
  --name dlai-app-india \
  --resource-group $RESOURCE_GROUP_INDIA \
  --environment dlai-env-india \
  --image nginx:latest \
  --target-port 80 \
  --ingress external \
  --query properties.configuration.ingress.fqdn

# Create Container App for US (Secondary)
echo "Creating container app for US..."
az containerapp create \
  --name dlai-app-us \
  --resource-group $RESOURCE_GROUP_US \
  --environment dlai-env-us \
  --image nginx:latest \
  --target-port 80 \
  --ingress external \
  --query properties.configuration.ingress.fqdn

echo "Azure infrastructure deployment completed successfully!"
echo ""
echo "Next steps:"
echo "1. Update GitHub Secrets with ACR credentials"
echo "2. Push code to trigger GitHub Actions"
echo "3. Update DNS to point to the Container App FQDN"
