import axiosInstance from '../api/axiosinstance';

// API endpoints (these should match your backend)
const API_ENDPOINTS = {
  CREATE_TASK: '/spiritual-tracker/task',
  GET_ALL_TASKS: '/spiritual-tracker/list-for-edit',  
  GET_PROGRESS_BY_MONTH: '/spiritual-tracker/progress/month',
  GET_TASKS_BY_DATE: '/spiritual-tracker/task/get-all',
  UPDATE_TASK_COMPLETION: '/spiritual-tracker/task/completion-status',
  UPDATE_TASK: '/spiritual-tracker/task',
  DELETE_TASK: '/spiritual-tracker/task',
  GET_MONTHLY_REPORT: '/spiritual-tracker/monthly-report',
  DAILY_TASK_COMPLETION_PROGRESS: '/spiritual-tracker/daily-task-completion-progress',
  LIST_FOR_EDIT: '/spiritual-tracker/list-for-edit'
};

export async function createNewTask(data) {
  const res = await axiosInstance.post(API_ENDPOINTS.CREATE_TASK, data);
  return res.data;
}

export async function getProgressByMonth(startDate, endDate) {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  const res = await axiosInstance.get(`${API_ENDPOINTS.DAILY_TASK_COMPLETION_PROGRESS}?${params.toString()}`);
  return res.data;
}

export async function getTaskByDate(date, timeZoneName) {
  const params = new URLSearchParams({
    date: date,
    timeZoneName: timeZoneName
  });
  const res = await axiosInstance.get(`${API_ENDPOINTS.GET_TASKS_BY_DATE}?${params}`);
  return res.data;
}

export async function updateDailyTaskCompletion(data) {
  const res = await axiosInstance.put(API_ENDPOINTS.UPDATE_TASK_COMPLETION, data);
  return res.data;
}

export async function getAllTaskForUser() {
  const res = await axiosInstance.get(API_ENDPOINTS.GET_ALL_TASKS);
  return res.data;
}

export async function updateIndividualTask(data) {
  const res = await axiosInstance.put(API_ENDPOINTS.UPDATE_TASK, data);
  return res.data;
}

export async function deleteTaskById(taskId, isDefault) {
  const params = new URLSearchParams();
  if (taskId) params.append('taskId', taskId);
  params.append('isDefault', isDefault);
  const res = await axiosInstance.delete(`${API_ENDPOINTS.DELETE_TASK}?${params.toString()}`);
  return res.data;
}

export async function getReportByMonth(month, year) {
  const params = new URLSearchParams();
  if (month) params.append('month', month);
  if (year) params.append('year', year);
  const res = await axiosInstance.get(`${API_ENDPOINTS.GET_MONTHLY_REPORT}?${params.toString()}`);
  return res.data;
}


