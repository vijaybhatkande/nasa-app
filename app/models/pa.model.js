// const sql = require("./db.js");
const moment = require("moment");
var log4js = require("../config/logger.js");
var logger = log4js.getLogger(); 
const multer = require("multer");
const fs = require("fs"); 
const axios = require("axios");
const { comparePasswords, hashPassword } = require("../utility/helper.js");
const { response, query } = require("express");
const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

exports.testModel = async (req) => {
  console.log("Test Model");
};

// NASA Image Filter API.
exports.SearchNasaImage = async (payload) => {
  console.log("Search NASA Image");
  console.log(process.env.NASA_API_ENDPOINT);
  const { title, yearStartDate, yearEndDate, mediaType, cache: useCache } = payload;
  // Create a unique cache key based on the query parameters.
  const cacheKey = `data_${title}_${yearStartDate}_${yearEndDate}_${mediaType}`;
  if (useCache === true && cache.has(cacheKey)) {
    console.log('Serving from cache');
    return {
      status: 200,
      data: cache.get(cacheKey),
    };
  }
  const nasaImageResult = await getNasaImage(payload);
  console.log(nasaImageResult.collection.items, "NASA Image Result...");
  const sampleData = nasaImageResult.collection.items;
  const filters = { title, yearStartDate, yearEndDate, mediaType };
  const result = await fetchData(filters, sampleData);
  if (useCache === true) {
    cache.set(cacheKey, result);
  }
  return {
    status: 200,
    data: result,
  };
};

// Fetch data from external URL
const fetchExternalData = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    return null;
  }
};

// Function to simulate data fetching 
const fetchData = async (filters, sampleData) => {
  return sampleData.filter(item => {
    const dataItem = item.data[0];
    return (!filters.title || dataItem.title.toLowerCase().includes(filters.title.toLowerCase())) &&
      (!filters.yearStartDate || new Date(dataItem.date_created).getFullYear() >= parseInt(filters.yearStartDate)) &&
      (!filters.yearEndDate || new Date(dataItem.date_created).getFullYear() <= parseInt(filters.yearEndDate)) &&
      (!filters.mediaType || dataItem.media_type === filters.mediaType);
  });
};

//API Call to NASA devloper Portal.
async function getNasaImage(searchParam) {
  try {
    const response = await axios.get(process.env.NASA_API_ENDPOINT + 'search', {
      params: {
        q: searchParam.title || "",
        year_start: searchParam.yearStartDate || "",
        year_end: searchParam.yearEndDate || "",
        media_type: searchParam.mediaType || "",
      },
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
}


