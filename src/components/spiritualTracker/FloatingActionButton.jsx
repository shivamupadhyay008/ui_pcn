import React from 'react';
import { ArkColors } from '../../common/constants/colors';

const FloatingActionButton = ({ setIsModalVisible, setModalType, onMonthlyReport }) => {
  return (
    <div className="fixed bottom-3 right-3 z-50 flex flex-col space-y-3">
      {/* Monthly Report Button */}
      <button
        onClick={onMonthlyReport}
        className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
        style={{
          backgroundColor: ArkColors.SECONDARY_PRIMARY,
        }}
        data-testid="spiritual-tracker-monthly-report-btn"
        title="Monthly Report"
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </button>

      {/* Edit Tasks Button */}
      <button
        onClick={() => {
          setIsModalVisible(true);
          setModalType('edit');
        }}
        className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
        style={{
          backgroundColor: ArkColors.SECONDARY_PRIMARY,
        }}
        data-testid="spiritual-tracker-edit-btn"
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </button>

      {/* Add Task Button */}
      <button
        onClick={() => {
          setIsModalVisible(true);
          setModalType('create');
        }}
        className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
        style={{
          backgroundColor: ArkColors.SECONDARY_PRIMARY,
        }}
        data-testid="spiritual-tracker-add-btn"
      >
        <svg
          className="w-8 h-8 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
};

export default FloatingActionButton;