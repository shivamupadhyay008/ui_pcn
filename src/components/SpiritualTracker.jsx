import React, { useState, useEffect } from 'react';
import { getAllTaskForUser, getProgressByMonth } from '../services/spiritualTracker';
import DailyProgress from './spiritualTracker/DailyProgress';
import DailyTaskTracker from './spiritualTracker/DailyTaskTracker';
import TaskCreationModal from './spiritualTracker/TaskCreationModal';
import TaskListModal from './spiritualTracker/TaskListModal';
import PraiseModal from './spiritualTracker/PraiseModal';
import FloatingActionButton from './spiritualTracker/FloatingActionButton';
import MonthlyReport from './spiritualTracker/MonthlyReport';
import { getMonthRanges, getFormattedDateMonthYear } from '../utils/dateUtils';
import { ArkColors } from '../common/constants/colors';

const SpiritualTracker = () => {
  const [currentView, setCurrentView] = useState('tracker'); // 'tracker' or 'monthly-report'
  const [trackerData, setTrackerData] = useState({
    isLoading: true,
    modalType: '',
    isModalVisible: false,
    selectedDate: '',
    selectedIndex: null,
    progressData: [],
    taskBeingEdited: null,
    allTasks: [],
    isPraiseVisible: null,
    forceRefreshSelectedDayData: false,
    dailyTaskCompletionProgress: [],
    listForEdit: [],
  });

  const isScrollingRef = React.useRef(false);
  const lastSelectedDateRef = React.useRef(null);
  const dateRanges = getMonthRanges();

  const updateTrackerData = (updatedValues) => {
    if (typeof updatedValues === 'function') {
      setTrackerData(updatedValues);
    } else {
      setTrackerData((prev) => ({ ...prev, ...updatedValues }));
    }
  };

  const updateProgressCounts = (isCompleted, isUpdateCount = false, taskCompleted = 0, totalTask = 0) => {
    setTrackerData((prev) => {
      const updatedProgress = [...prev.progressData];
      const selectedDay = updatedProgress[prev.selectedDate];
      if (!selectedDay) return prev;
      if (isUpdateCount) {
        selectedDay.completed_tasks = taskCompleted;
        selectedDay.not_completed_tasks = Math.max(0, totalTask - taskCompleted);
      } else {
        selectedDay.completed_tasks = Math.max(0, selectedDay.completed_tasks + (isCompleted ? 1 : -1));
        selectedDay.not_completed_tasks = Math.max(0, selectedDay.not_completed_tasks + (isCompleted ? -1 : 1));
      }
      selectedDay.total_tasks = selectedDay.completed_tasks + selectedDay.not_completed_tasks;
      return { ...prev, progressData: updatedProgress };
    });
  };

  const closePraiseModal = () => updateTrackerData({ isPraiseVisible: null });

  const fetchProgressData = async (startDate, endDate, append = "default") => {
    try {
      const res = await getProgressByMonth(startDate, endDate);
      if (append === 'next') {
        updateTrackerData((prev) => ({
          ...prev,
          progressData: [...prev.progressData, ...res.data],
        }));
      } else {
        updateTrackerData({ progressData: res.data });
      }
    } catch (error) {
      console.error("Fetch Progress Data Error:", error);
      // Handle error appropriately
    }
  };

  const fetchAllTasks = async () => {
    try {
      const res = await getAllTaskForUser();
      updateTrackerData({ allTasks: res.data });
    } catch (error) {
      console.error("Fetch All Tasks Error:", error);
    }
  };


  const fetchInitialData = async () => {
    updateTrackerData({ isLoading: true });
    try {
      await Promise.all([
        fetchProgressData(dateRanges.previous.start, dateRanges.current.end),
        fetchAllTasks()
      ]);
    } catch (error) {
      console.error("Error fetching initial data:", error);
    } finally {
      updateTrackerData({ isLoading: false });
    }
  };

  const refreshTasks = () => {
    fetchAllTasks();
    updateTrackerData({ forceRefreshSelectedDayData: true });
  };

  const getCurrentDateData = () => {
    const { selectedIndex, selectedDate } = trackerData;

    if (isScrollingRef.current && selectedIndex !== null && trackerData.progressData[selectedIndex]) {
      return trackerData.progressData[selectedIndex];
    }

    if (
      selectedDate &&
      selectedDate !== lastSelectedDateRef.current &&
      trackerData.progressData[selectedDate]
    ) {
      lastSelectedDateRef.current = selectedDate;
      return trackerData.progressData[selectedDate];
    }

    return trackerData.progressData[selectedDate] || null;
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  if (trackerData.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div
          className="animate-spin rounded-full border-b-2"
          style={{
            height: 32,
            width: 32,
            borderColor: ArkColors.PRIMARY_COLOR,
          }}
        ></div>
      </div>
    );
  }

  const currentDateLabel = getFormattedDateMonthYear(
    new Date(
      getCurrentDateData() && getCurrentDateData().year,
      getCurrentDateData() && getCurrentDateData().month,
      getCurrentDateData() && getCurrentDateData().date
    )
  );

  const selectedDateData = trackerData.progressData[trackerData.selectedDate];

  // Render monthly report view
  if (currentView === 'monthly-report') {
    return (
      <div className="relative">
        <MonthlyReport />
        {/* Back Button */}
        <button
          onClick={() => setCurrentView('tracker')}
          className="fixed top-4 left-4 z-50 w-12 h-12 rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
          style={{
            backgroundColor: ArkColors.PRIMARY_COLOR,
          }}
          title="Back to Tracker"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
    );
  }

  // Render main tracker view
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: ArkColors.WHITE01,
      }}
    >
      <div className="flex flex-col items-center">
        {/* Header Image */}
        <div className="mt-5 w-full flex justify-center">
          <img
            src="/jesus-with-verse.jpg" // You'll need to add this image
            alt="Jesus with verse"
            className="w-11/12 max-w-md h-30 object-contain"
          />
        </div>

        {/* Date Display */}
        <div
          className="text-xl font-bold mt-5"
          style={{
            color: ArkColors.BLACK00,
          }}
        >
          {currentDateLabel}
        </div>

        {/* Date Scroll */}
        <DailyProgress
          data={trackerData.progressData}
          selectedDate={trackerData.selectedDate}
          setSelectedDate={(val) => updateTrackerData({ selectedDate: val })}
          setSelectedIndex={(val) => updateTrackerData({ selectedIndex: val })}
          fetchProgressData={fetchProgressData}
          dateRange={dateRanges}
          isScrolling={isScrollingRef}
        />

        {/* Daily Tasks */}
        <DailyTaskTracker
          setIsVisible={(val) => updateTrackerData({ isPraiseVisible: val })}
          date={{
            month: selectedDateData ? selectedDateData.month : null,
            date: selectedDateData ? selectedDateData.date : null,
            year: selectedDateData ? selectedDateData.year : null,
          }}
          updateProgressDataLocally={updateProgressCounts}
          forceRefreshSelectedDayData={trackerData.forceRefreshSelectedDayData}
          setForceRefreshSelectedDate={(val) => updateTrackerData({ forceRefreshSelectedDayData: val })}
        />
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton
        setIsModalVisible={(val) => updateTrackerData({ isModalVisible: val })}
        setModalType={(val) => updateTrackerData({ modalType: val })}
        onMonthlyReport={() => setCurrentView('monthly-report')}
      />

      {/* Task Creation/Edit Modal */}
      {trackerData.isModalVisible && (trackerData.modalType === 'create' || trackerData.modalType === 'editModal') && (
        <TaskCreationModal
          onClose={() => updateTrackerData({ isModalVisible: false })}
          isEdit={trackerData.modalType === 'editModal'}
          editTaskData={trackerData.taskBeingEdited}
          refreshData={refreshTasks}
        />
      )}

      {/* Task List Modal for Editing */}
      {trackerData.isModalVisible && trackerData.modalType === 'edit' && (
        <TaskListModal
          onTaskSelect={(task) => {
            updateTrackerData({
              isModalVisible: true,
              modalType: 'editModal',
              taskBeingEdited: task,
            });
          }}
          tasks={trackerData.allTasks}
          onClose={() => updateTrackerData({ isModalVisible: false })}
        />
      )}

      {/* Praise Modal */}
      {trackerData.isPraiseVisible && (
        <PraiseModal
          isVisible={!!trackerData.isPraiseVisible}
          closeModal={closePraiseModal}
          textContent={trackerData.isPraiseVisible}
        />
      )}
    </div>
  );
};

export default SpiritualTracker;