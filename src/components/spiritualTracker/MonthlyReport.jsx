import React, { useState, useEffect, useRef } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { getReportByMonth } from '../../services/spiritualTracker';
import { ArkColors, PRESET_COLORS_SPIRITUAL_TRACKER_MONTHLY_REPORT } from '../../common/constants/colors';
import { getMonthName } from '../../utils/dateUtils';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const MonthlyReport = () => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const [availableMonths, setAvailableMonths] = useState(
    Array.from({ length: currentMonth }, (_, i) => i + 1)
  );
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(currentMonth - 1);
  const selectedMonth = availableMonths[selectedMonthIndex];

  const handlePrev = () => {
    if (selectedMonthIndex > 0) {
      setSelectedMonthIndex((prev) => prev - 1);
    } else {
      // Could show a toast message here
      console.log('No earlier months available');
    }
  };

  const handleNext = () => {
    if (selectedMonthIndex < availableMonths.length - 1) {
      setSelectedMonthIndex((prev) => prev + 1);
    }
  };

  const getMonthlyReportsData = async (month, year) => {
    setLoading(true);
    try {
      const res = await getReportByMonth(month, year);
      if (res.data.length > 0) {
        setReportData(res.data);
      } else {
        console.log('No reports available');
        setReportData([]);
        const updatedMonths = Array.from(
          { length: currentMonth - month },
          (_, i) => i + month + 1
        );
        setAvailableMonths(updatedMonths.length > 0 ? updatedMonths : [currentMonth]);
        setSelectedMonthIndex(0);
      }
    } catch (err) {
      console.error("Get Monthly Report Error:", err);
      setReportData([]);
    }
    setLoading(false);
  };

  function hashToHSL(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash) % 360;
    const saturation = 60 + (Math.abs(hash) % 20);
    const lightness = 50 + (Math.abs(hash) % 10);
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }

  function getRandomColorCode(taskId, idx) {
    if (idx < PRESET_COLORS_SPIRITUAL_TRACKER_MONTHLY_REPORT.length) {
      return PRESET_COLORS_SPIRITUAL_TRACKER_MONTHLY_REPORT[idx];
    }
    return hashToHSL(taskId);
  }

  const colorCache = {};
  const getConsistentRandomRGBA = (taskId, idx) => {
    if (!colorCache[taskId]) {
      colorCache[taskId] = getRandomColorCode(taskId, idx);
    }
    return colorCache[taskId];
  };

  const chartData = {
    labels: reportData.map((t) => t.task_name),
    datasets: [{
      data: reportData.map((t) => Math.round((t.completed_tasks / t.total_tasks) * 100)),
      backgroundColor: reportData.map((t, idx) => getConsistentRandomRGBA(t.task_id, idx)),
      borderWidth: 0,
    }]
  };

  const dataValues = chartData.datasets[0]?.data || [];
  const allZeros = dataValues.every(val => val === 0);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const task = reportData[context.dataIndex];
            const percentage = context.parsed;
            return `${task.task_name}: ${task.completed_tasks}/${task.total_tasks} days (${percentage}%)`;
          }
        }
      }
    }
  };

  useEffect(() => {
    if (selectedMonth) {
      getMonthlyReportsData(selectedMonth, currentYear);
    }
  }, [selectedMonth, selectedMonthIndex]);

  if (loading) {
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

  return (
    <div className="min-h-screen p-4" style={{ backgroundColor: ArkColors.WHITE01 }}>
      <div className="flex flex-col items-center">
        <h1 className="text-xl font-medium mb-4 mt-4" style={{ color: ArkColors.BLACK00 }}>
          Monthly Report
        </h1>

        <div
          className="w-full max-w-md rounded-xl p-4 mb-4"
          style={{ backgroundColor: ArkColors.WHITE09 }}
        >
          {/* Month Navigation */}
          <div className="relative flex items-center justify-center h-12 mb-4 rounded-xl"
               style={{ backgroundColor: ArkColors.WHITE01 }}>
            <button
              onClick={handlePrev}
              className="absolute left-0 p-2 hover:opacity-70 transition-opacity"
              style={{ color: ArkColors.BORDER_GREY }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>

            <div
              className="px-4 py-2 rounded-lg"
              style={{ backgroundColor: ArkColors.grey2 }}
            >
              <span className="font-semibold text-sm" style={{ color: ArkColors.BLACK01 }}>
                {getMonthName(selectedMonth, currentYear)} {currentYear}
              </span>
            </div>

            <button
              onClick={handleNext}
              className="absolute right-0 p-2 hover:opacity-70 transition-opacity"
              style={{ color: ArkColors.BORDER_GREY }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          </div>

          {reportData.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-base" style={{ color: ArkColors.BLACK00 }}>
                No reports available for {getMonthName(selectedMonth, currentYear)}.
              </p>
            </div>
          ) : (
            <>
              {!allZeros ? (
                <div className="w-40 h-40 mx-auto mb-6">
                  <Pie data={chartData} options={chartOptions} />
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-base" style={{ color: ArkColors.BLACK00 }}>
                    No tasks were completed for {getMonthName(selectedMonth, currentYear)}.
                  </p>
                </div>
              )}

              <div className="space-y-3">
                {reportData.map((task, idx) => (
                  <div
                    key={idx}
                    className="flex items-center bg-white rounded p-3"
                    style={{
                      borderLeftWidth: 4,
                      borderLeftColor: getConsistentRandomRGBA(task.task_id, idx),
                      borderLeftStyle: 'solid'
                    }}
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium" style={{ color: ArkColors.BLACK00 }}>
                        {task.task_name}
                      </p>
                      <p className="text-xs" style={{ color: ArkColors.BLACK00 }}>
                        {task.completed_tasks} of {task.total_tasks} days ({Math.round((task.completed_tasks / task.total_tasks) * 100)}%)
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MonthlyReport;