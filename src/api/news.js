import client from "./axiosinstance";

// Fetch all organizations
export const getOrganizations = async () => {
  try {
    const response = await client.get("/news-plugin/organization-list");
    return response.data;
  } catch (error) {
    console.error("Error fetching organizations:", error);
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
  const response = await client.get("/news-plugin/trending");
  return response.data;
};

export const getNewsByOrganization = async (orgId) => {
  const response = await client.get(
    `/news-plugin/organization-news?organizationId=${orgId}`
  );
  return response.data;
};

export const likeNews = async (organizationId, newsId) => {
  const response = await client.post("/plugin/news/like/news", {
    organizationId: organizationId,
    reactType: "THUMBS_UP",
    sourceId: newsId,
  });
  return response.data;
};

export const unlikeNews = async (organizationId, newsId) => {
  const response = await client.delete(
    `/plugin/news/like/news/${newsId}?organizationId=${organizationId}`
  );
  return response.data;
};

export const pinNews = async (newsId) => {
  const response = await client.post("/plugin/news/pin/", {
    feedId: newsId,
    type: "global_news",
  });
  return response.data;
};

export const unpinNews = async (newsId) => {
  const response = await client.patch(`/plugin/news/pin/${newsId}`, {
    type: "global_news",
  });
  return response.data;
};


