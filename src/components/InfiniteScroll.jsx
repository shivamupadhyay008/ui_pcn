import { useEffect, useRef, useCallback } from 'react';

const InfiniteScroll = ({
  children,
  hasMore,
  isLoading,
  loadMore,
  loadingComponent = <div className="text-center p-4">Loading...</div>,
  sentinelClass = 'h-4', // Tailwind class for sentinel height
  containerClass = 'space-y-4' // Tailwind class for container
}) => {
  const sentinelRef = useRef();
  const observer = useRef();

  const handleIntersect = useCallback((entries) => {
    const [entry] = entries;
    if (entry.isIntersecting && hasMore && !isLoading) {
      loadMore();
    }
  }, [hasMore, isLoading, loadMore]);

  useEffect(() => {
    observer.current = new IntersectionObserver(handleIntersect, {
      rootMargin: '100px' // Trigger loadMore 100px before sentinel is visible
    });

    if (sentinelRef.current) {
      observer.current.observe(sentinelRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [handleIntersect]);

  return (
    <div className={containerClass}>
      {children}
      {isLoading && loadingComponent}
      {hasMore && <div ref={sentinelRef} className={sentinelClass} />}
    </div>
  );
};

export default InfiniteScroll;
