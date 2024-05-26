// const sql = require("./db.js"); // Not using database for now.
var log4js = require("../config/logger.js");
var logger = log4js.getLogger();
const axios = require("axios");
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour

exports.testModel = async (req) => {
  console.log("Test Model");
};

// Dummy user data
const users = [
  {
    user_id: 1,
    first_name: 'Vijay',
    last_name: 'Bhatkande',
    username: 'vijay',
    password: 'password456',// Hashed version of 'password456'
    role_id: 1,
    role: 'admin',
    is_active: true,
    created_datetime: '2023-01-01T00:00:00Z'
  },
  {
    user_id: 2,
    first_name: 'Omkar',
    last_name: 'Bhatkande',
    username: 'omkar',
    password: 'password456', // Hashed version of 'password456'
    role_id: 2,
    role: 'user',
    is_active: true,
    created_datetime: '2023-01-02T00:00:00Z'
  }
];

exports.getLoginModel = async (credentials) => {
  try {
    const { username, password } = credentials;
    logger.info("inside getLoginModel.");
    // Simulate searching for the user in the dummy data
    const user = users.find(u => u.username === username.toLowerCase().trim());
    if (user) {
      // not using for now.
      // const bcrypt = require('bcrypt');
      // const passwordMatch = await bcrypt.compare(password, user.password);
      if (password === user.password) {
        // Exclude the password from the user details
        const { password, ...userDetails } = user;
        return {
          status: 200,
          user: userDetails,
        };
      } else {
        return {
          status: 401,
          message: 'Invalid credentials2',
        };
      }
    } else {
      return {
        status: 401,
        message: 'Invalid credentials3',
      };
    }
  } catch (err) {
    logger.error("Error --", err);
    throw err;
  }
};

// NASA Image Search Filter API.
exports.SearchNasaImage = async (payload) => {
  console.log("Search NASA Image");
  const nasaImageResult = await getNasaImage(payload);
  // console.log(nasaImageResult.collection.items, "NASA Image Result...");
  const sampleData = nasaImageResult.collection.items;
  console.log(sampleData, "NASA Image Result...");
  return {
    status: 200,
    data: sampleData,
    total_count: nasaImageResult.collection.metadata.total_hits,
    page: payload.page,
    page_size: payload.page_size,
  };
};

//API Call to NASA developer Portal.
async function getNasaImage(searchParam = {}) {
  const params = {};
  // Map provided search parameters to the corresponding API parameters
  if (searchParam.title) params.q = searchParam.title;
  if (searchParam.yearStartDate) params.year_start = searchParam.yearStartDate;
  if (searchParam.yearEndDate) params.year_end = searchParam.yearEndDate;
  if (searchParam.mediaType) params.media_type = searchParam.mediaType;
  if (Number.isInteger(searchParam.page)) params.page = searchParam.page;
  if (Number.isInteger(searchParam.page_size)) params.page_size = searchParam.page_size;
  console.log(params, "Req Params.")
  // Generate a unique cache key based on the query parameters
  const cacheKey = JSON.stringify(params);
  // Check if the data is already in the cache
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    console.log('Serving from cache');
    return cachedData;
  }
  try {
    const response = await axios.get(`${process.env.NASA_API_ENDPOINT}/search`, {
      params,
      paramsSerializer: params => {
        return Object.entries(params)
          .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
          .join('&');
      },
    });
    const data = response?.data;
    // Store the response data in the cache
    cache.set(cacheKey, data);
    return data;
  } catch (error) {
    console.error(`Error fetching data from NASA API: ${error.message}`);
    throw new Error('Failed to fetch data from NASA API');
  }
}




