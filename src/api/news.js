import client from './axiosinstance';

// Fetch all organizations
export const getOrganizations = async () => {
  try {
    const response = await client.get('/news-plugin/organization-list');
    return response.data;
  } catch (error) {
    console.error('Error fetching organizations:', error);
    throw error;
  }
};

// Example functions for future use (get news, post news, etc.)
// export const getNews = async (params = {}) => {
//   const response = await client.get('/news-plugin/news', { params });
//   return response.data;
// };
//
export const getTrendingNews = async () => {
  const response = await client.get('/news-plugin/trending');
  return response.data;
};

export const getNewsByOrganization = async (orgId) => {
  const response = await client.get(`/news-plugin/organization-news?organizationId=${orgId}`);
  return response.data;
};
//
// export const getNewsByOrganization = async (orgId) => {
//   const response = await client.get(`/news-plugin/news/${orgId}`);
//   return response.data;
// };
