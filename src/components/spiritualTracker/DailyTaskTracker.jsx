import React, { useState, useEffect } from 'react';
import { getTaskByDate, updateDailyTaskCompletion } from '../../services/spiritualTracker';
import { getFormattedDate, getFormattedDateWithTimeZone, getIanaTimeZone, isFutureDate } from '../../utils/dateUtils';
import { ArkColors } from '../../common/constants/colors';

const DailyTaskTracker = ({
  setIsVisible,
  date = {},
  updateProgressDataLocally,
  forceRefreshSelectedDayData,
  setForceRefreshSelectedDate,
  testId = 'daily-task'
}) => {
  const [loading, setIsLoading] = useState(false);
  const [updatingTasks, setUpdatingTasks] = useState({});
  const [tasks, setTasks] = useState([]);
  const prevFormattedDateRef = React.useRef(null);
  const [loadError, setLoadError] = useState({});

  const futureDate = isFutureDate(date);

  const getTaskIcon = (taskName, isDefault) => {
    if (!isDefault) return '📝'; // Custom task icon
    switch (taskName) {
      case 'Prayer and Praise': return '🙏';
      case 'Bible Study': return '📖';
      case 'No Sin': return '✨';
      default: return '📝';
    }
  };

  const getTaskDataByDate = async (forceRefresh = false) => {
    const dateFormatted = getFormattedDateWithTimeZone(date);
    const dateWithoutTimezone = getFormattedDate(date);
    const timeZoneName = getIanaTimeZone();

    if (!forceRefresh && prevFormattedDateRef.current === dateWithoutTimezone) return;

    prevFormattedDateRef.current = dateWithoutTimezone;
    setIsLoading(true);
    try {
      const res = await getTaskByDate(dateFormatted, timeZoneName);
      console.log(res);
      
      setTasks(res.data || []);
      if (res.success) {
        const completedTasks = res.data.filter(task => task.isCompleted);
        updateProgressDataLocally(false, true, completedTasks.length, res.data.length);
      }
    } catch (ex) {
      console.error("Get Task By Date Error:", ex);
    }
    setIsLoading(false);
  };

  const updateCurrentDayTasks = async (taskId, status) => {
    if (futureDate) {
      alert('Cannot update future tasks');
      return;
    }

    const dateFormatted = getFormattedDate(date);
    const taskData = {
      taskId,
      date: dateFormatted,
      completeStatus: !status,
    };

    setUpdatingTasks(prev => ({ ...prev, [taskId]: true }));
    toggleTask(taskId);
    updateProgressDataLocally(!status);
    setUpdatingTasks(prev => {
      const updated = { ...prev };
      delete updated[taskId];
      return updated;
    });

    try {
      const res = await updateDailyTaskCompletion(taskData);
      if (res.success && res.shoutout && res.shoutout.shoutMsg) {
        // Handle shoutout logic here
        setIsVisible(res.shoutout.shoutMsg);
      }
    } catch (ex) {
      console.error("Update Daily Task Completion Error:", ex);
      // Revert changes on error
      toggleTask(taskId);
      updateProgressDataLocally(!status);
    }
  };

  const toggleTask = (taskId) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.taskId === taskId
          ? { ...task, isCompleted: !task.isCompleted }
          : task
      )
    );
  };

  useEffect(() => {
    if (date.date) getTaskDataByDate();
  }, [date]);

  useEffect(() => {
    if (date.date) {
      if (forceRefreshSelectedDayData) {
        getTaskDataByDate(true);
      }
      setForceRefreshSelectedDate(false);
    }
  }, [forceRefreshSelectedDayData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div
          className="animate-spin rounded-full border-b-2"
          style={{
            height: 24,
            width: 24,
            borderColor: ArkColors.PRIMARY_COLOR,
          }}
        ></div>
      </div>
    );
  }

  return (
    <div className="px-2.5 w-full">
      <h3 className="text-lg font-bold mb-5">
        Daily Tasks
      </h3>
      {tasks.length === 0 ? (
        <div className="w-full text-center">
          <p
            className="text-lg mt-5"
            style={{ color: ArkColors.BLACK00 }}
          >
            No tasks for this date
          </p>
        </div>
      ) : (
        <div className="w-full pb-24">
          {tasks.map(task => {
            const taskCompleted = task.isCompleted;
            const taskDisabled = futureDate;

            return (
              <button
                key={task.taskId}
                onClick={() => updateCurrentDayTasks(task.taskId, task.isCompleted)}
                disabled={updatingTasks[task.taskId] || taskDisabled}
                className={`w-full flex items-center justify-between p-2.5 rounded-3xl mb-3 ${
                  taskCompleted ? 'border border-solid' : 'bg-gray-100'
                } ${taskDisabled ? 'opacity-60' : ''}`}
                style={{
                  borderColor: taskCompleted ? ArkColors.PRIMARY_COLOR : 'transparent',
                  backgroundColor: taskCompleted ? 'transparent' : ArkColors.grey6,
                }}
                data-testid={`${testId}-btn-${task.taskId}`}
              >
                <div className="flex items-center flex-1 min-w-0">
                  <div className="w-6 h-6 mr-4 flex-shrink-0 text-lg">
                    {loadError[task.taskId] ? '📝' : getTaskIcon(task.taskName, task.isDefault)}
                  </div>
                  <span
                    className="text-lg ml-4 flex-1 truncate"
                    style={{
                      color: taskCompleted ? ArkColors.PRIMARY_COLOR : ArkColors.BLACK00,
                    }}
                  >
                    {task.taskName}
                  </span>
                </div>

                <div
                  className="w-4.5 h-4.5 rounded-2xl flex items-center justify-center border border-solid"
                  style={{
                    borderColor: taskCompleted ? ArkColors.PRIMARY_COLOR : ArkColors.CHECKBOXGRAY,
                    backgroundColor: taskCompleted ? ArkColors.PRIMARY_COLOR : ArkColors.WHITE01,
                  }}
                >
                  {updatingTasks[task.taskId] ? (
                    <div
                      className="animate-spin rounded-full border-b"
                      style={{
                        height: 8,
                        width: 8,
                        borderColor: ArkColors.PRIMARY_COLOR,
                      }}
                    ></div>
                  ) : taskCompleted ? (
                    <svg
                      className="w-2.25 h-2.25 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <div
                      className="w-3 h-3 rounded-2xl"
                      style={{
                        backgroundColor: ArkColors.BORDER_GREY,
                      }}
                    ></div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DailyTaskTracker;