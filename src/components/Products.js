import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import React from "react"
import Cart, { generateCartItemsFrom } from "./Cart";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */


const Products = () => {
  const [productsArray,setProductsArray] = useState([])
  const [cartArray,setCartArray] = useState([])
  const { enqueueSnackbar } = useSnackbar();
  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = async () => {
    try {
      const response = await axios.get(config.endpoint + '/products')
      setProductsArray(response.data)
      setCartArray(generateCartItemsFrom(await fetchCart(localStorage.getItem('token')),response.data))
      return response.data
    } catch (error) {
      console.log(error.message)
    }
  };
  useEffect(() => {
    performAPICall()
  },[])

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    setSearchRend(<React.Fragment><SentimentDissatisfied /><span>No products found</span></React.Fragment>)
    try {
      const response = await axios.get(config.endpoint + '/products/search?value=' + text)
      setProductsArray(response.data)
      return response.data
    }
    catch (error) {
      console.log(error.message)
      setProductsArray([])
    }
  };
  const [searchRend,setSearchRend] = useState(<React.Fragment><CircularProgress/><span>Loading Products...</span></React.Fragment>)
  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
    const searchText = event.target.value
    if (debounceTimeout) clearTimeout(debounceTimeout)
    const Timeout = setTimeout(() => performSearch(searchText),500)
    setDebounceTimer(Timeout)
  };
  const [debounceTimer,setDebounceTimer] = useState(0)
  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  const fetchCart = async (token) => {
    if (!token) return;
    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      const auth = {headers: {"Authorization": "Bearer " + token}}
      const response = await axios.get(config.endpoint + '/cart', auth)
      return response.data
    } catch (error) {
      if (error.response && error.response.status === 400) {
        enqueueSnackbar(error.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar("Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",{variant: "error"});
      }
      return null;
    }
  };
  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
    for (let item in items) {
      if (items[item]._id === productId) return true
    }
    return false
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options
  ) => {
    if (!token) {
      enqueueSnackbar("Login to add an item to the Cart", {variant: "warning",persist:false})
      return null;
    }
    if (isItemInCart(items,productId) && options) { // true if called from ADD TO CART
      enqueueSnackbar("Item already in cart. Use the cart sidebar to update quantity or remove item", { variant: "warning",persist:false });
      return null;
    }
    const auth = {headers: {"Authorization": "Bearer " + token}}
    const requestBody = {"productId":productId,"qty":qty}
    try {
      const response = await axios.post(config.endpoint + '/cart', requestBody, auth)
      setCartArray(generateCartItemsFrom(response.data,products))
    } catch (error) {
      if (error.response && error.response.status === 400) {
        enqueueSnackbar(error.response.data.message, { variant: "error",persist:false });
      } else {
        enqueueSnackbar("Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",{variant: "error"});
      }
    }
  };
  
  return (
    <div>
      <Header>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        <TextField
          className="search-desktop"
          id="outlined-name"
          placeholder="Search for items/categories"
          size="small"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          onChange={(event) => debounceSearch(event,debounceTimer)}
        />
      </Header>
 
      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
      />
        <Grid container columnSpacing={1} direction={{xs:"column",md:"row"}}>
          <Grid item className="product-grid" xs={9}>
            <Box className="hero">
              <p className="hero-heading">
                India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
                to your door step
              </p>
            </Box>
            {productsArray.length === 0 ? 
            <div className="loading">
              {searchRend}
            </div> :
            <Grid container sx={{padding:1}}>
              {productsArray.map(productinfo => {
                return (
                  <Grid item xs={6} md={3} key={productinfo._id} sx={{padding:0.5}}>
                    <ProductCard product={productinfo} key={productinfo._id}
                     handleAddToCart={() =>  addToCart(localStorage.getItem('token'),cartArray,productsArray,productinfo._id,1,true)}/>
                  </Grid>
                )
              })}
            </Grid>}
          </Grid>
            <Grid container justifyContent="center" alignItems="flex-start" item xs={3} 
              sx={{backgroundColor:"#E9F5E1",padding:0.5}}>
              <Cart products={productsArray} items={cartArray} handleQuantity={addToCart} />
            </Grid>
        </Grid>
      <Footer />
    </div>
  );
};

export default Products;
