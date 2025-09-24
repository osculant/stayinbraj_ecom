import React from "react";

const roleStyles = {
  alert: "bg-red-500",
  success: "bg-green-500",
  warning: "bg-yellow-500",
  info: "bg-gray-500",
};

const iconMap = {
  alert: "ri-error-warning-fill",
  success: "ri-checkbox-circle-fill",
  warning: "ri-alert-line",
  info: "ri-circle-fill",
};

const Toast = ({ message, role = "info" }) => {
  const bg = roleStyles[role] || "bg-gray-500";
  const icon = iconMap[role] || "fa-circle";

  return (
    <div className={`text-white px-4 py-2 rounded-lg flex items-center gap-3 min-w-[320px] max-w-[650px] shadow-lg ${bg}`}>
      <div className="flex items-center justify-start w-full">
        <div className={`h-10 w-10 bg-opacity-30 rounded-full flex items-center justify-center`}>
          <i className={`${icon} text-lg`}></i>
        </div>
        <div className="text-sm">{message}</div>
      </div>
      <div>
        <i className="ri-close-fill cursor-pointer"></i>
      </div>
    </div>
  );
};

export default Toast;
