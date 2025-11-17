import React, { useState, useEffect, useRef } from 'react';
import { ArkColors } from '../../common/constants/colors';

const DayCard = ({ day, date, progress, selected, onPress, testId }) => {
  const greenWidth = progress * 30;
  const grayWidth = 30 - greenWidth;
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <button
      onClick={onPress}
      className={`flex flex-col items-center justify-center w-12 h-20 mx-1.5 rounded-3xl py-2 ${
        selected ? '' : 'bg-transparent'
      }`}
      style={{
        backgroundColor: selected ? ArkColors.grey6 : 'transparent',
      }}
      data-testid={testId}
    >
      <span
        className="text-sm mb-1"
        style={{ color: ArkColors.BORDER_GREY }}
      >
        {weekDays[day]}
      </span>
      <span
        className="text-base font-bold mb-2"
        style={{ color: ArkColors.BLACK00 }}
      >
        {date}
      </span>
      <div className="flex h-1 w-8 rounded-sm overflow-hidden">
        <div
          style={{
            width: `${greenWidth}px`,
            backgroundColor: ArkColors.PROGRESS_GREEN,
          }}
        />
        {grayWidth > 0 && (
          <div
            style={{
              width: `${grayWidth}px`,
              backgroundColor: ArkColors.progressGray,
            }}
          />
        )}
      </div>
    </button>
  );
};

const DailyProgress = ({
  data,
  selectedDate,
  setSelectedDate,
  setSelectedIndex,
  fetchProgressData,
  dateRange,
  isScrolling
}) => {
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [loadingNext, setLoadingNext] = useState(false);
  const loadedMonths = useRef(new Set()); // Track which months have been loaded
  const flatListRef = useRef(null);
  const itemWidth = 62;

  const todayIndex = React.useMemo(() => {
    if (!data.length) return 0;
    const today = new Date();
    return data.findIndex(item =>
      Number(item.date) === today.getDate() &&
      Number(item.month) === today.getMonth() &&
      Number(item.year) === today.getFullYear()
    );
  }, [data]);

  const handleScrollEnd = () => {
    isScrolling.current = false;
  };

  const handleScroll = (event) => {
    isScrolling.current = true;

    // Check if we've reached the end to load next month
    const { scrollLeft, scrollWidth, clientWidth } = event.target;
    const isNearEnd = scrollLeft + clientWidth >= scrollWidth - 50; // 50px threshold

    if (isNearEnd && !loadingNext && data.length > 0) {
      // Calculate the next month to load based on the last item in data
      const lastItem = data[data.length - 1];
      const lastDate = new Date(lastItem.year, lastItem.month, lastItem.date);
      const nextMonth = new Date(lastDate);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      nextMonth.setDate(1);

      const nextMonthEnd = new Date(nextMonth);
      nextMonthEnd.setMonth(nextMonthEnd.getMonth() + 1);
      nextMonthEnd.setDate(0);

      const format = (date) => date.toLocaleDateString('en-CA');
      const nextMonthKey = `${format(nextMonth)}-${format(nextMonthEnd)}`;

      // Only fetch if we haven't already loaded this month
      if (!loadedMonths.current.has(nextMonthKey)) {
        setLoadingNext(true);
        fetchProgressData(format(nextMonth), format(nextMonthEnd), 'next')
          .then(() => {
            loadedMonths.current.add(nextMonthKey);
          })
          .finally(() => {
            setLoadingNext(false);
          });
      }
    }
  };

  useEffect(() => {
    if (data.length && isInitialRender) {
      const defaultIndex = todayIndex >= 0 ? todayIndex : 0;
      setSelectedDate(defaultIndex);
      setSelectedIndex(defaultIndex);

      setTimeout(() => {
        if (flatListRef.current) {
          // Center the selected item
          const container = flatListRef.current;
          const selectedElement = container.children[defaultIndex];
          if (selectedElement) {
            selectedElement.scrollIntoView({
              behavior: 'auto',
              block: 'nearest',
              inline: 'center'
            });
          }
        }
        setIsInitialRender(false);
      }, 50);
    }
  }, [data, todayIndex]);

  useEffect(() => {
    if (!isInitialRender && flatListRef.current && selectedDate !== null) {
      const container = flatListRef.current;
      const selectedElement = container.children[selectedDate];
      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [selectedDate, isInitialRender]);

  const onViewChange = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const index = parseInt(entry.target.dataset.index);
        setSelectedIndex(index);
      }
    });
  };

  const observer = useRef(null);

  useEffect(() => {
    observer.current = new IntersectionObserver(onViewChange, {
      root: flatListRef.current,
      threshold: 0.5
    });

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  const renderItem = (item, index) => (
    <div
      key={index}
      data-index={index}
      ref={(el) => {
        if (el && observer.current) {
          observer.current.observe(el);
        }
      }}
    >
      <DayCard
        day={item.day}
        date={item.date}
        progress={item.completed_tasks / Math.max(1, item.total_tasks)}
        selected={selectedDate === index}
        onPress={() => setSelectedDate(index)}
        testId={`date-card-${index}`}
      />
    </div>
  );

  return (
    <div
      style={{
        width: '100%',
        backgroundColor: ArkColors.WHITE01,
      }}
      className="mb-8"
    >
      <div
        className="flex overflow-x-auto scrollbar-hide"
        style={{
          paddingHorizontal: 16,
          alignItems: 'center',
        }}
      >
        <div
          ref={flatListRef}
          className="flex"
          onScroll={handleScroll}
          onTouchEnd={handleScrollEnd}
          onMouseUp={handleScrollEnd}
        >
          {data.map((item, index) => renderItem(item, index))}
          {loadingNext && (
            <div
              className="flex items-center justify-center"
              style={{ paddingHorizontal: 16 }}
            >
              <div
                className="animate-spin rounded-full border-b-2"
                style={{
                  height: 20,
                  width: 20,
                  borderColor: ArkColors.PROGRESS_GREEN,
                }}
              ></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyProgress;