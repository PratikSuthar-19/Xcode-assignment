import React from "react";

interface ConfirmDialogProps {
  title: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-zinc-900 text-white p-6 rounded-2xl shadow-lg w-[90%] max-w-sm border border-zinc-700">
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        {message && <p className="text-sm text-gray-400 mb-4">{message}</p>}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-3 py-1.5 rounded-md border border-gray-500 text-gray-300 hover:bg-gray-700/50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-3 py-1.5 rounded-md border border-red-600 text-red-400 hover:bg-red-800/50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
