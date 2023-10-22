const axios = require('axios');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const notion_md = require('../modules/notion_md');


// --------------------------------------
const PageAPI = {
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + process.env.API_KEY,
    "Notion-Version": "2022-02-22"
  },

  getPage: async (pageID) => {
    try {
      const response = await axios({
        method: 'GET',
        url: `https://api.notion.com/v1/pages/${pageID}`,
        headers: PageAPI.headers,
      });

      const pageData = response.data;
      return pageData;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },
  updatePageContent: async (pageID, newContent) => {
    try {
      const response = await axios({
        method: 'patch',
        url: `https://api.notion.com/v1/pages/${pageID}`,
        headers: PageAPI.headers,
        data: newContent,
      });

      const updatedPageData = response.data;
      return updatedPageData;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },
  deletePage: async (pageID) => {
    try {
      const response = await axios({
        method: 'delete',
        url: `https://api.notion.com/v1/pages/${pageID}`,
        headers: PageAPI.headers,
      });

      if (response.status === 204) {
        console.log('Page deleted successfully.');
        return true;
      } else {
        console.error('Error:', response.data);
        return false;
      }
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },
};

module.exports = PageAPI;
