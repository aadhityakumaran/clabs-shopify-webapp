import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  BlockStack,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { setPixel, createWebhook } from "~/models/Pixel.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {

  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();
  const webPixelSettings = formData.get("accountID");
  if (!webPixelSettings) {
    return null;
  }
  return await setPixel(webPixelSettings as string, admin.graphql);
  // return await createWebhook(admin.graphql);
}
  

export default function Index() {
  const fetcher = useFetcher();
  return (
    <Page>
      <ui-title-bar title="Remix app template">
        Generate a product
      </ui-title-bar>
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
              <fetcher.Form method="post">
                <input name="accountID" placeholder="Account ID" aria-label="Account ID"/>
                <button type="submit">Create Pixel</button>
              </fetcher.Form>
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
