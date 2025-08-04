import React from "react";

const TreeForm = ({ data }) => {
  if (!data || typeof data !== "object") return null;

  return (
    <div className="bg-gradient-to-br from-blue-950 to-gray-900 rounded-xl border border-blue-900 p-4 my-4 overflow-auto">
      <div className="font-bold text-blue-200 mb-2 text-sm">
        JSON Tree Visualization
      </div>
      <div className="bg-gray-950/50 rounded-lg border border-blue-900 p-4 overflow-auto max-h-[500px]">
        <TreeNode label="root" value={data} />
      </div>
    </div>
  );
};

const TreeNode = ({ label, value, depth = 0, isLast = false }) => {
  const isObject = value !== null && typeof value === "object";
  const isArray = Array.isArray(value);

  // Get color based on value type
  const getValueColor = (val) => {
    if (val === null) return "text-gray-400";
    switch (typeof val) {
      case "string":
        return "text-green-300";
      case "number":
        return "text-yellow-300";
      case "boolean":
        return "text-purple-300";
      default:
        return "text-gray-300";
    }
  };

  // Format value for display
  const formatValue = (val) => {
    if (val === null) return "null";
    if (typeof val === "string") return `"${val}"`;
    return String(val);
  };

  return (
    <div className="relative pl-6 pt-2">
      {/* Tree lines */}
      {depth > 0 && (
        <>
          {/* Vertical connection line from parent */}
          <div className="absolute left-0 top-0 w-0.5 bg-blue-500/50 h-full" />

          {/* Horizontal connection line to node */}
          <div className="absolute left-0 top-4 h-0.5 bg-blue-500/50 w-6" />

          {/* End cap for last child node */}
          {isLast && (
            <div className="absolute left-0 top-4 w-0.5 bg-gray-950/50 h-[calc(100%-16px)]" />
          )}
        </>
      )}

      {/* Node content */}
      <div className="flex flex-col">
        {/* Node header */}
        <div
          className={`
          rounded-lg px-3 py-2 mb-1 inline-block
          ${isObject ? "bg-blue-900/40" : "bg-purple-900/40"} 
          border border-blue-700/50
          max-w-max
        `}
        >
          {/* Label with type indicator */}
          <span className="font-mono text-blue-300 font-medium">{label}</span>
          <span className="text-blue-400 mx-1">:</span>

          {/* Value or type indicator */}
          {isObject ? (
            <span className="font-mono text-indigo-400 text-sm">
              {isArray ? "[ ]" : "{ }"}
              <span className="text-blue-500 text-xs ml-1">
                {isObject && `(${Object.keys(value).length})`}
              </span>
            </span>
          ) : (
            <span className={`font-mono ${getValueColor(value)}`}>
              {formatValue(value)}
            </span>
          )}
        </div>

        {/* Children nodes */}
        {isObject && Object.keys(value).length > 0 && (
          <div className="ml-2">
            {Object.entries(value).map(([key, val], index, arr) => (
              <TreeNode
                key={key}
                label={isArray ? `[${key}]` : key}
                value={val}
                depth={depth + 1}
                isLast={index === arr.length - 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TreeForm;
