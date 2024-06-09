import { register } from "@shopify/web-pixels-extension";

register(({ analytics, settings }) => {
  /**
   * CustomerLabs Tracking code - Custom pixel code for shopify
   * Find your Account Id at the top right navbar dropdown in your customerlabs acccout
   * Copy your account id and replace the text "CUSTOMELABS_ACCOUNT_ID" with your account id.
   **/

//   !(function (t, e, r, c, a, n, s) {
//     (t.ClAnalyticsObject = a),
//       (t[a] = t[a] || []),
//       (t[a].methods = [
//         "trackSubmit",
//         "trackClick",
//         "pageview",
//         "identify",
//         "track",
//       ]),
//       (t[a].factory = function (e) {
//         return function () {
//           var r = Array.prototype.slice.call(arguments);
//           return r.unshift(e), t[a].push(r), t[a];
//         };
//       });
//     for (var i = 0; i < t[a].methods.length; i++) {
//       var o = t[a].methods[i];
//       t[a][o] = t[a].factory(o);
//     }
//     (n = e.createElement(r)),
//       (s = e.getElementsByTagName(r)[0]),
//       (n.async = 1),
//       (n.crossOrigin = "anonymous"),
//       (n.src = c),
//       s.parentNode.insertBefore(n, s);
//   })(
//     self,
//     document,
//     "script",
//     `//cdn.js.customerlabs.co/cl5788uk313b01.js`,
//     "_cl",
//   );
//   _cl.SNIPPET_VERSION = "1.0.0";
//   _cl.SANDBOX_ENV = true;

!(function (t, a) {
	    (t.ClAnalyticsObject = a),
	      (t[a] = t[a] || []),
	      (t[a].methods = [
	        "trackSubmit",
	        "trackClick",
	        "pageview",
	        "identify",
	        "track",
	      ]),
	      (t[a].factory = function (e) {
	        return function () {
	          var r = Array.prototype.slice.call(arguments);
	          return r.unshift(e), t[a].push(r), t[a];
	        };
	      });
	    for (var i = 0; i < t[a].methods.length; i++) {
	      var o = t[a].methods[i];
	      t[a][o] = t[a].factory(o);
	    }
	  })(
	    self,
	    "_cl",
	  );
	  _cl.SNIPPET_VERSION = "1.0.0";
	  _cl.SANDBOX_ENV = true;
    try {
	  importScripts(`https://gist.github.com/aadhityakumaran/da27b3d6ca833fb0642fef8d2f7223d8.js`);
    } catch (e) {
      console.log(e);
    }
    try {
      importScripts(`https://cdn.js.customerlabs.co/cl5788uk313b01.js`);
    } catch (e) {
      console.log(e);
    }
    try {
      importScripts(`https://cdn.jsdelivr.net/npm/hello-world-js@0.0.2/src/index.min.js`);
    } catch (e) {
      console.log(e);
    }

  /**
   * @variable  __CL__ contains debug and fb_skip_contents
   **/
  var __CL__ = {
    debug: false, // if true, console messages will be display
    fb_skip_contents: false,
  };

  /**
   * @function shopify_products_mapping
   * @params items array
   **/
  function shopify_products_mapping(items) {
    var products = [];
    if (items.length > 0) {
      for (var i = 0; i < items.length; i++) {
        var product = {
          id: items[i].variant.product.id,
          sku: items[i].variant.sku,
          name: items[i].variant.product.title,
          price: items[i].variant.price.amount,
          imageURL: items[i].variant.image.src,
          brand: items[i].variant.product.vendor,
          quantity: items[i].quantity,
        };
        products.push(product);
      }
    }
    return products;
  }

  /**
   * @function clabs_product_mappings
   * @params products array
   **/
  function clabs_product_mappings(products) {
    var clabs_products = [];
    for (let i = 0; i < products.length; i++) {
      var clabs_product = {};
      for (var key in products[i]) {
        switch (key) {
          case "name":
          case "title":
            clabs_product.product_name = { t: "string", v: products[i][key] };
            break;
          case "id":
            clabs_product.product_id = { t: "string", v: products[i].id };
            break;
          case "price":
            clabs_product.product_price = { t: "number", v: products[i].price };
            break;
          case "category":
            clabs_product.product_category = {
              t: "string",
              v: products[i].category,
            };
            break;
          case "brand":
            clabs_product.product_brand = { t: "string", v: products[i].brand };
            break;
          case "variant":
            clabs_product.product_variant = {
              t: "string",
              v: products[i].variant,
            };
            break;
          case "productType":
            clabs_product.product_type = {
              t: "string",
              v: products[i].productType,
            };
            break;
          case "coupon":
            clabs_product.product_coupon = {
              t: "string",
              v: products[i].coupon,
            };
            break;
          case "quantity":
            clabs_product.product_quantity = {
              t: "string",
              v: products[i].quantity,
            };
            break;
          default:
            let isnum = /^\d+$/.test(products[i][key]);
            var type = "";
            if (Array.isArray(products[i][key])) {
              continue;
            } else if (
              typeof products[i][key] === "object" &&
              products[i][key] !== null &&
              !Array.isArray(products[i][key])
            ) {
              continue;
            } else if (
              products[i][key] !== null &&
              (Number.isFinite(products[i][key]) ||
                isnum ||
                !isNaN(parseFloat(products[i][key])))
            ) {
              type = "number";
            } else {
              type = "string";
            }
            if (key.substring(0, 8) === "product_") {
              clabs_product[key] = { t: type, v: products[i][key] };
            } else {
              clabs_product["product_" + key] = {
                t: type,
                v: products[i][key],
              };
            }
        }
      }
      clabs_products.push(clabs_product);
    }
    return clabs_products;
  }

  /**
   * @function identify_properties_mapping
   * @params properties object
   */
  function identify_properties_mapping(properties) {
    var identify_properties = {
      email: properties.email,
      phone: properties.phone,
      city: properties.shippingAddress.city,
      country: properties.shippingAddress.country,
      country_code: properties.shippingAddress.countryCode,
      state: properties.shippingAddress.province,
    };
    return identify_properties;
  }

  /**
   * @function identify_properties_formating
   * @params properties object
   */
  function identify_properties_formating(properties) {
    var clabs_properties = {};
    for (var key in properties) {
      if (properties[key] != null) {
        switch (key) {
          case "email":
            clabs_properties.email = { t: "string", v: properties[key] };
            break;
          case "phone":
            clabs_properties.phone = { t: "string", v: properties[key] };
            break;
          case "city":
            clabs_properties.city = { t: "string", v: properties[key] };
            break;
          case "country":
            clabs_properties.country = { t: "string", v: properties[key] };
            break;
          case "country_code":
            clabs_properties.country_code = { t: "string", v: properties[key] };
            break;
          case "state":
            clabs_properties.state = { t: "string", v: properties[key] };
            break;
        }
      }
    }
    return clabs_properties;
  }

  /**
   * @function identify_properties_to_send
   * @params event
   */
  function identify_properties_to_send(event) {
    var identify_properties = identify_properties_mapping(event.data.checkout);
    var user_traits_value = identify_properties_formating(identify_properties);
    var propertiesToSend = {
      customProperties: {
        user_traits: {
          t: "Object",
          v: user_traits_value,
        },
      },
    };
    if (user_traits_value.email) {
      propertiesToSend.customProperties.identify_by_email = {
        t: "string",
        v: user_traits_value.email.v,
        ib: true,
      };
    }
    if (user_traits_value.phone) {
      propertiesToSend.customProperties.identify_by_phone = {
        t: "string",
        v: user_traits_value.phone.v,
        ib: true,
      };
    }
    return propertiesToSend;
  }

  /**
   * @function clShopifyTrack
   * This function triggers default shopify standard events
   **/
  clShopifyTrack = function () {
    //Product viewed event
    analytics.subscribe("product_viewed", (event) => {
      var product = {
        id: event.data.productVariant.product.id,
        sku: event.data.productVariant.sku,
        name: event.data.productVariant.product.title,
        price: event.data.productVariant.price.amount,
        imageURL: event.data.productVariant.image.src,
        brand: event.data.productVariant.product.vendor,
      };
      var customData = {
        currency: {
          t: "string",
          v: event.data.productVariant.price.currencyCode,
        },
        url: {
          t: "string",
          v: event.context.window.location.href,
        },
        content_type: {
          t: "string",
          v: "product_group",
        },
      };
      if (__CL__.fb_skip_contents) {
        customData.skip_contents = true;
      }
      var productData = clabs_product_mappings([product]);
      if (productData[0].product_price) {
        customData.value = productData[0].product_price;
      }
      var properties = {
        customProperties: customData,
        productProperties: productData,
      };
      _cl.trackClick("Product viewed", properties);
      if (__CL__.debug) {
        console.log("Product viewed" + " : " + JSON.stringify(properties));
      }
    });
    //Category viewed
    analytics.subscribe("collection_viewed", (event) => {
      var properties = {
        customProperties: {
          url: {
            t: "string",
            v: event.context.window.location.href,
          },
          category_name: {
            t: "string",
            v: event.data.collection.title,
          },
          category_id: {
            t: "string",
            v: event.data.collection.id,
          },
        },
      };
      _cl.pageview("Category viewed", properties);
      if (__CL__.debug) {
        console.log("Category viewed" + " : " + JSON.stringify(properties));
      }
    });
    //Added to cart event
    analytics.subscribe("product_added_to_cart", (event) => {
      var product = {
        id: event.data.cartLine.merchandise.product.id,
        sku: event.data.cartLine.merchandise.sku,
        name: event.data.cartLine.merchandise.product.title,
        price: event.data.cartLine.merchandise.price.amount,
        imageURL: event.data.cartLine.merchandise.image.src,
        brand: event.data.cartLine.merchandise.product.vendor,
        quantity: event.data.cartLine.quantity,
      };
      var productData = clabs_product_mappings([product]);
      var customData = {
        currency: {
          t: "string",
          v: event.data.cartLine.cost.totalAmount.currencyCode,
        },
        url: {
          t: "string",
          v: event.context.window.location.href,
        },
        value: {
          t: "number",
          v: event.data.cartLine.cost.totalAmount.amount,
        },
      };
      if (__CL__.fb_skip_contents) {
        customData.skip_contents = true;
      }
      var properties = {
        customProperties: customData,
        productProperties: productData,
      };
      _cl.trackClick("Added to cart", properties);
      if (__CL__.debug) {
        console.log("Added to cart" + " : " + JSON.stringify(properties));
      }
    });
    //Search made event
    analytics.subscribe("search_submitted", (event) => {
      var properties = {
        customProperties: {
          search_string: {
            t: "string",
            v: event.data.searchResult.query,
          },
          url: {
            t: "string",
            v: event.context.window.location.href,
          },
        },
      };
      _cl.pageview("Search made", properties);
      if (__CL__.debug) {
        console.log("Search made" + " : " + JSON.stringify(properties));
      }
    });
    //Checkout made event
    analytics.subscribe("checkout_started", (event) => {
      var products = shopify_products_mapping(event.data.checkout.lineItems);
      var productData = clabs_product_mappings(products);
      var customData = {
        currency: {
          t: "string",
          v: event.data.checkout.totalPrice.currencyCode,
        },
        value: {
          t: "number",
          v: event.data.checkout.totalPrice.amount,
        },
      };
      if (__CL__.fb_skip_contents) {
        customData.skip_contents = true;
      }
      var properties = {
        customProperties: customData,
        productProperties: productData,
      };
      _cl.trackClick("Checkout made", properties);
      if (__CL__.debug) {
        console.log("Checkout made" + " : " + JSON.stringify(properties));
      }
    });
    //AddPaymentinfo event
    analytics.subscribe("payment_info_submitted", (event) => {
      var properties = {
        subtotal: {
          t: "number",
          v: event.data.checkout.subtotalPrice.amount,
        },
        shipping_price: {
          t: "number",
          v: event.data.checkout.shippingLine.price.amount,
        },
        tax: {
          t: "string",
          v: event.data.checkout.totalTax.amount,
        },
        value: {
          t: "string",
          v: event.data.checkout.totalPrice.amount,
        },
        currency: {
          t: "string",
          v: event.data.checkout.currencyCode,
        },
      };
      var propertiesToSend = identify_properties_to_send(event);
      _cl.identify(propertiesToSend);
      _cl.trackClick("AddPaymentInfo", { customProperties: properties });
      if (__CL__.debug) {
        console.log(
          "AddPaymentInfo" +
            " :" +
            JSON.stringify({ customProperties: payment_info }),
        );
      }
    });
    //Purchased event
    analytics.subscribe("checkout_completed", (event) => {
      var products = shopify_products_mapping(event.data.checkout.lineItems);
      var productData = clabs_product_mappings(products);
      var shippingDetails =
        event.data.checkout.shippingPrice ||
        event.data.checkout.shippingLine.price;
      var customData = {
        transaction_number: {
          t: "string",
          v: event.data.checkout.order.id,
        },
        currency: {
          t: "string",
          v: (event.data.checkout.totalPrice | {}).currencyCode,
        },
        subtotal: {
          t: "number",
          v: (event.data.checkout.subtotalPrice || {}).amount || 0,
        },
        tax: {
          t: "number",
          v: (event.data.checkout.totalTax || {}).amount || 0,
        },
        shipping: {
          t: "number",
          v: (shippingDetails && shippingDetails.amount) || 0,
        },
        value: {
          t: "number",
          v: (event.data.checkout.totalPrice || {}).amount || 0,
        },
      };
      var properties = {
        customProperties: customData,
        productProperties: productData,
      };
      var propertiesToSend = identify_properties_to_send(event);
      _cl.identify(propertiesToSend);
      if (
        customData.transaction_number &&
        customData.transaction_number.v &&
        window.localStorage
      ) {
        var purchases_str = localStorage.getItem("cl_past_purchases") || "{}";
        var purchases = JSON.parse(purchases_str);
        if (!purchases[customData.transaction_number.v]) {
          _cl.trackClick("Purchased", properties);
          purchases[customData.transaction_number.v] = "true";
          window.localStorage.setItem(
            "cl_past_purchases",
            JSON.stringify(purchases),
          );
        }
      } else {
        _cl.trackClick("Purchased", properties);
      }
      if (__CL__.debug) {
        console.log("Purchased" + " :" + JSON.stringify(properties));
      }
    });
  };
  //End of the customerlabs custom pixel code

  clShopifyTrack();
});
