import React from 'react';

const TaskListModal = ({ onTaskSelect, tasks, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center">
      <div className="bg-white w-full max-w-md rounded-t-3xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Select Task to Edit</h2>
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
        <div className="overflow-y-auto max-h-[60vh]">
          {tasks.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No tasks available to edit
            </div>
          ) : (
            <div className="p-4">
              {tasks.map((task) => (
                <button
                  key={task.taskId}
                  onClick={() => onTaskSelect(task)}
                  className="w-full p-4 mb-3 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 rounded-2xl flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center flex-1 min-w-0">
                    <div className="text-2xl mr-4 flex-shrink-0">
                      {task.isDefault ? (
                        task.taskName === 'Prayer and Praise' ? '🙏' :
                        task.taskName === 'Bible Study' ? '📖' :
                        task.taskName === 'No Sin' ? '✨' : '📝'
                      ) : '📝'}
                    </div>
                    <span className="text-lg text-gray-800 truncate">
                      {task.taskName}
                    </span>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="w-full py-3 px-6 rounded-2xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskListModal;