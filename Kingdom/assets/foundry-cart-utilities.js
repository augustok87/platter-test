/**
 * foundry-cart-utilities.js
 *
 * The utilities offer functionalities like fetching cart data, adding/removing products
 * from the cart, and retrieving specific product prices.
**/

/**
 * Fetches the current cart data from the server.
 * https://shopify.dev/docs/api/ajax/reference/cart#json-of-a-cart
 *
 * @returns {Object|null} Returns the cart data, or null if there's an error.
 */
const getCart = async () => {
  try {
    const response = await fetch('/cart.js');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const cart = await response.json();
    return cart
  } catch (error) {
    console.error('Error in getCart:', error);
  }
};

/**
 * Adds products to the cart.
 * If the product is already in the cart, the Shopify ajax api will set the
 * quantity to whatever the quantity is here. If you do not wish to change
 * the quantity or simply wish to circumvent the default Cart API response, then
 * you must check for the existence of this item before calling it.
 * https://shopify.dev/docs/api/ajax/reference/cart#post-locale-cart-add-js
 *
 * @param items {Array[Object]} - items according to the add to cart
 * @param options {Object} -  Options may be:
 *   - callback {Function} - the callback function you wish to run, passed in the
 *     JSON response by default.
 *   - event {String} - the event you wish to dispatch (if any).
 * @returns {Object} - Items added
 */
const addItemsToCart = async (items = [], options = {}) => {
  const payload = {items};

  try {
    const response = await fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    } else {
      const jsonResponse = await response.json()
      // Dispatch event if provided in the options.
      if(options.callback) { options.callback(jsonResponse) }
      if(options.event) {document.dispatchEvent(new CustomEvent(options.event, {detail: jsonResponse}));}
      return jsonResponse;
    }
  } catch (error) {
    console.error('Error in addProductToCart:', error);
  }
};

/*
Cart Updates.
@param updates {Object} a key-value pairing of variantId:quantity.
https://shopify.dev/docs/api/ajax/reference/cart#post-locale-cart-update-js
*/
const updateCart = async (updates) => {
  try {
    const response = await fetch('/cart/update.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({updates})
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    } else {
      const responseBody = await response.json()
      return responseBody
    }
  } catch (error) {
    console.error('Error in updating the cart:', error);
  }

}

/**
 * Removes a specified product from the cart.
 *
 * @param {string|number} productId - The ID of the product to be removed from the cart.
 * @param {Function} callback - The callback to run on success (optional).
 */
const removeProductFromCart = async (productId, options = {}) => {
  try {
    const response = await fetch(`/cart/change.js?id=${productId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ quantity: 0 })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    } else {
      const responseBody = await response.json()
      if(options.event) {
        document.dispatchEvent(new CustomEvent(options.event, {detail: {cart: responseBody}}));
      }
    }
  } catch (error) {
    console.error('Error in removeProductFromCart:', error);
  }
};


export {
  getCart,
  addItemsToCart,
  updateCart
};
