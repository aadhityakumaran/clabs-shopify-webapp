import { AdminApiContext } from "node_modules/@shopify/shopify-app-remix/build/ts/server/clients";
import db from "../db.server";

async function getPixelID() {
    const pixelData = await db.pixel.findFirst();
    if (pixelData) {
        return pixelData.id;
    } else {
        return null;
    }
}

// async function deletePixelID() {
//     await db.pixel.deleteMany();
// }

async function createPixelID(id: string, accountID: string) {
    await db.pixel.create({
        data: {
            id: id,
            accountID: accountID,
        },
    });
}

async function createPixel(accountID: string, graphql: AdminApiContext["graphql"]) {
    try {
        const response = await graphql(
          `
          mutation {
            webPixelCreate(webPixel: { settings: {accountID: "${accountID}"} }) {
              userErrors {
                code
                field
                message
              }
              webPixel {
                settings
                id
              }
            }
          }`
        )
      
        const data = await response.json();
        console.log(data);
    
        if (data.data.webPixelCreate.userErrors && data.data.webPixelCreate.userErrors.length > 0) {
          console.log('User errors:', data.data.webPixelCreate.userErrors);
        }
    
        if (data.data.webPixelCreate.webPixel) {
          console.log('Web pixel created:', data.data.webPixelCreate.webPixel);
        }
  
        createPixelID(data.data.webPixelCreate.webPixel.id, accountID);
        return data;
    }   catch (error) {
        console.error('Error creating web pixel:', error);
        return error;
    }
}

async function updatePixel(accountId: string, pixelId: string, graphql: AdminApiContext["graphql"]) {
    try {
        const response = await graphql(
          `
          mutation {
            webPixelUpdate(id: "${pixelId}", webPixel: { settings: {accountID: "${accountId}"} }) {
              userErrors {
                code
                field
                message
              }
              webPixel {
                settings
                id
              }
            }
          }`
        )
      
        const data = await response.json();
        console.log(data);
    
        if (data.data.webPixelUpdate.userErrors && data.data.webPixelUpdate.userErrors.length > 0) {
          console.log('User errors:', data.data.webPixelUpdate.userErrors);
        }
    
        if (data.data.webPixelUpdate.webPixel) {
          console.log('Web pixel updated:', data.data.webPixelUpdate.webPixel);
        }
  
        return data;
    }   catch (error) {
        console.error('Error updating web pixel:', error);
        return error;
    }
}

export async function setPixel(accountId: string, graphql: AdminApiContext["graphql"]) {
    const pixelId = await getPixelID();
    if (pixelId) {
        return updatePixel(accountId, pixelId, graphql);
    } else {
        return createPixel(accountId, graphql);
    }
}

export async function createWebhook(graphql: AdminApiContext["graphql"]) {
    try {
        const response = await graphql(
          `
          mutation {
            webhookSubscriptionCreate(topic: CARTS_UPDATE, webhookSubscription: {callbackUrl: "https://webhook.site/071d7209-be45-4d63-b2a7-863de5bb8b50", format: JSON}) {
              userErrors {
                field
                message
              }
              webhookSubscription {
                id
              }
            }
          }`
        )
        // const response = await graphql(
        //     `
        //     mutation {
        //         webhookSubscriptionDelete(id: "gid://shopify/WebhookSubscription/1228059443349") {
        //             deletedWebhookSubscriptionId
        //             userErrors {
        //                 field
        //                 message
        //             }
        //         }
        //     }`
        // )
      
        const data = await response.json();
        console.log(data);
    
        if (data.data.webhookSubscriptionCreate.userErrors && data.data.webhookSubscriptionCreate.userErrors.length > 0) {
          console.log('User errors:', data.data.webhookSubscriptionCreate.userErrors);
        }
    
        if (data.data.webhookSubscriptionCreate.webhookSubscription) {
          console.log('Webhook created:', data.data.webhookSubscriptionCreate.webhookSubscription);
        }
  
        return data;
    }   catch (error) {
        console.error('Error creating webhook:', error);
        return error;
    }
}