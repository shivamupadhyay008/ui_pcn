import { useState, useEffect } from "react";
import InfiniteScroll from "./InfiniteScroll";
import Card from "./Card";
import NewsModal from "./NewsModal";
import { getOrganizations, getTrendingNews, getNewsByOrganization } from "../api/news";

const NewsView = () => {
  const [organizations, setOrganizations] = useState([]);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filter, setFilter] = useState("all");
  const [selectedOrg, setSelectedOrg] = useState("");
  const [organizationList, setOrganizationList] = useState([]);
  const [userList, setUserList] = useState([]);

  const [isFetchingOrg, setIsFetchingOrg] = useState(false);
  const [isFetchingTrending, setIsFetchingTrending] = useState(true);

  const fetchOrgs = async () => {
    try {
      const orgs = await getOrganizations();
      const orgArray = orgs?.data || [];
      setOrganizations(orgArray);
    } catch (error) {
      console.error("Error fetching organizations:", error);
    }
  };

  const fetchTrending = async () => {
    try {
      setIsFetchingTrending(true);
      const trending = await getTrendingNews();
      console.log("Trending news:", trending.data.myFeed);
      setUserList(trending.data.users || []);
      setOrganizationList(trending.data.organizations || []);

      setItems(trending.data.myFeed || []);
    } catch (error) {
      console.error("Error fetching trending news:", error);
    } finally {
      setIsFetchingTrending(false);
    }
  };
  const fetchOrgNews = async () => {
    try {
      setIsFetchingOrg(true);
      const news = await getNewsByOrganization(selectedOrg);
      setItems(news.data?.myFeed || []);
    } catch (error) {
      console.error("Error fetching org news:", error);
      setItems([]);
    } finally {
      setIsFetchingOrg(false);
    }
  };

  useEffect(() => {
    fetchOrgs();
    fetchTrending();
  }, []);

  useEffect(() => {
    if (filter === "trending") {
      fetchTrending();
    }
  }, [filter]);

  useEffect(() => {
    if (selectedOrg && filter === "org") {
      fetchOrgNews();
    }
    if (filter !== "org") {
      setSelectedOrg("");
    }
  }, [selectedOrg, filter]);

  const loadMore = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    // Simulate API fetch delay

    if (items.length) {
      setHasMore(false);
    }

    setIsLoading(false);
  };


  return (
    <>
      <div className="mb-4 flex gap-4 items-center">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter
          </label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          >
            {/* <option value="all">All</option> */}
            <option value="trending">Trending</option>
            <option value="org">Organization</option>
          </select>
        </div>
        {filter === "org" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Organization
            </label>
            <select
              value={selectedOrg}
              onChange={(e) => setSelectedOrg(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
            >
              <option value="">Select Organization</option>
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {(isFetchingTrending || isFetchingOrg) && (
        <div className="text-center p-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Loading news...</p>
        </div>
      )}

      {!isFetchingTrending && !isFetchingOrg && items.length > 0 && (
        <InfiniteScroll
          loadMore={loadMore}
          hasMore={hasMore}
          isLoading={isLoading}
        >
          {items?.map((item) => (
            <Card
              key={item.id}
              title={item.title}
              date={item.date}
              description={item.description}
              likes={typeof item.likes === 'string' ? item.likes : item.likesCount}
              saves={typeof item.saves === 'string' ? item.saves : item.pinCount}
              imageUrl={item.imageUrl || item.files?.[0]?.url || 'https://placehold.co/600x400'}
              onClick={() => {
                setSelectedItem(item);
                setIsModalOpen(true);
              }}
            />
          ))}
        </InfiniteScroll>
      )}

      {!isFetchingTrending && !isFetchingOrg && items.length === 0 && (
        <div className="text-center p-8">
          <div className="text-gray-500">
            <p className="text-2xl mb-2">📭</p>
            <p className="text-gray-600">No data found</p>
            <p className="text-sm text-gray-500 mt-1">Try different filters or select another organization</p>
          </div>
        </div>
      )}
      {/* </div> */}

      {!hasMore && (
        <p className="text-center mt-4 text-gray-600">No more items to load</p>
      )}

      {isModalOpen && (
        <NewsModal item={selectedItem} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
};

export default NewsView;
