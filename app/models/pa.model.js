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

const cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour

exports.testModel = async (req) => {
  console.log("Test Model");
};

// NASA Image Filter API.
exports.SearchNasaImage = async (payload) => {
  console.log("Search NASA Image");
  const nasaImageResult = await getNasaImage(payload);
  console.log(nasaImageResult.collection.items, "NASA Image Result...");
  const sampleData = nasaImageResult.collection.items;
  return {
    status: 200,
    data: sampleData,
  };
};


//API Call to NASA devloper Portal.
async function getNasaImage(searchParam = {}) {
  const params = {};
  // Map provided search parameters to the corresponding API parameters
  if (searchParam.title) params.q = searchParam.title;
  if (searchParam.yearStartDate) params.year_start = searchParam.yearStartDate;
  if (searchParam.yearEndDate) params.year_end = searchParam.yearEndDate;
  if (searchParam.mediaType) params.media_type = searchParam.mediaType;

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

exports.getNasaImagesDetailModel = async (payload) => {
  console.log("get NASA Image Deatils.");
  const nasaImageDetailResult = await getNasaImageDetail(payload);
  console.log(nasaImageDetailResult.collection.items, "NASA Image Result...");
  const imageData = nasaImageDetailResult.collection.items;
  return {
    status: 200,
    data: imageData,
  };
};

// API Call to NASA devloper Portal TO Get Image Details.
async function getNasaImageDetail(searchParam) {
  try {
    const response = await axios.get(process.env.NASA_API_ENDPOINT + 'asset/' + searchParam.nasa_id, {
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
}


