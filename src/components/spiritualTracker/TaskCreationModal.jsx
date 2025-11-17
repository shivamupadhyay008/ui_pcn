import React, { useState, useEffect } from 'react';
import { createNewTask, updateIndividualTask, deleteTaskById } from '../../services/spiritualTracker';

const TaskCreationModal = ({ onClose, isEdit = false, editTaskData = {}, refreshData }) => {
  const [taskName, setTaskName] = useState(isEdit && editTaskData.taskName ? editTaskData.taskName : '');
  const [selectedDays, setSelectedDays] = useState(
    isEdit && editTaskData.scheduledDays ? editTaskData.scheduledDays : [0, 1, 2, 3, 4, 5, 6]
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const daysOfWeek = [
    'Every Sunday',
    'Every Monday',
    'Every Tuesday',
    'Every Wednesday',
    'Every Thursday',
    'Every Friday',
    'Every Saturday'
  ];

  const selectAll = selectedDays.length === 7;

  const handleSubmit = () => {
    if (!taskName.trim()) {
      alert('Task name is required');
      return;
    }

    if (taskName.trim().length < 3) {
      alert('Task name must be at least 3 characters');
      return;
    }

    if (selectedDays.length === 0) {
      alert('Please select at least one day');
      return;
    }

    const data = {
      taskName: taskName.trim(),
      scheduledDays: selectedDays,
      ...(isEdit && {
        taskId: editTaskData.taskId,
        isDefault: editTaskData.isDefault,
      }),
    };

    handleCreateOrEdit(data);
  };

  const handleCreateOrEdit = async (data) => {
    setIsLoading(true);
    try {
      if (data.taskId) {
        const { taskName, ...rest } = data;
        const payload = rest;
        const res = await updateIndividualTask(payload);
        if (res.success) {
          alert('Task updated successfully!');
          refreshData();
          onClose();
        } else {
          alert(res.message || 'Failed to update task');
        }
      } else {
        const res = await createNewTask(data);
        if (res.success) {
          alert('Task created successfully!');
          refreshData();
          onClose();
        } else {
          alert(res.message || 'Failed to create task');
        }
      }
    } catch (ex) {
      console.error("Create/Edit Task Error:", ex);
      alert('An error occurred. Please try again.');
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    try {
      const res = await deleteTaskById(editTaskData.taskId, editTaskData.isDefault);
      if (res.success) {
        alert('Task deleted successfully!');
        refreshData();
        onClose();
      } else {
        alert(res.message || 'Failed to delete task');
      }
    } catch (error) {
      console.error("Delete Task Error:", error);
      alert('An error occurred while deleting the task.');
    }
  };

  const toggleDay = (index) => {
    const updatedDays = selectedDays.includes(index)
      ? selectedDays.filter((i) => i !== index)
      : [...selectedDays, index];
    setSelectedDays(updatedDays);
  };

  const toggleSelectAll = () => {
    setSelectedDays(selectAll ? [] : [0, 1, 2, 3, 4, 5, 6]);
  };

  return (
    <>
      {/* Modal Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center">
        <div className="bg-white w-full max-w-md rounded-t-3xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-bold text-gray-800">
              {isEdit ? 'Edit Task' : 'Create New Task'}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            {/* Task Name Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Task Name *
              </label>
              <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="Enter task name..."
                maxLength={50}
                disabled={isEdit && editTaskData.isDefault}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
              <div className="text-right text-sm text-gray-500 mt-1">
                {taskName.length}/50
              </div>
            </div>

            {/* Select All Toggle */}
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleSelectAll}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                  selectAll ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                }`}
              >
                {selectAll && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
              <span className="text-lg text-gray-700">Select all</span>
            </div>

            {/* Repeat Label */}
            <div>
              <span className="text-lg font-bold text-gray-700">Repeat ⋆</span>
            </div>

            {/* Days Selection */}
            <div className="space-y-3">
              {daysOfWeek.map((day, index) => (
                <button
                  key={index}
                  onClick={() => toggleDay(index)}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 active:bg-gray-100"
                >
                  <span className="text-lg text-gray-700">{day}</span>
                  {selectedDays.includes(index) && (
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}

              {/* Delete Task Option (only for edit mode) */}
              {isEdit && (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-red-50 active:bg-red-100 text-red-600"
                >
                  <span className="text-lg">Delete Task</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex space-x-3 p-6 border-t bg-gray-50">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-3 px-6 rounded-2xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 py-3 px-6 rounded-2xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                'Save'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Delete Task</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this task? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 px-4 rounded-xl border border-gray-300 text-gray-700 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 px-4 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskCreationModal;