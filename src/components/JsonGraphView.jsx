import React from "react";

// Tree node component
const TreeNode = ({ label, value, isArray, isLast, level }) => {
  const isObject = typeof value === "object" && value !== null;
  return (
    <div className="relative pl-4">
      {/* Vertical line for tree branch */}
      {level > 0 && (
        <span
          className={`absolute left-0 top-0 h-full w-4 border-l-2 ${
            isLast ? "border-transparent" : "border-blue-800"
          } border-blue-800`}
          style={{ borderStyle: "dashed" }}
        ></span>
      )}
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs text-blue-300 font-bold">
          {label}
        </span>
        {isObject ? (
          <span className="text-purple-300 font-mono text-xs">
            {Array.isArray(value) ? "[ ]" : "{ }"}
          </span>
        ) : (
          <span className="text-green-300 font-mono text-xs">
            = {JSON.stringify(value)}
          </span>
        )}
      </div>
      {/* Children */}
      {isObject && (
        <div className="ml-4 border-l-2 border-blue-800 pl-2">
          {Object.entries(value).map(([k, v], idx, arr) => (
            <TreeNode
              key={k}
              label={Array.isArray(value) ? `[${k}]` : k}
              value={v}
              isArray={Array.isArray(value)}
              isLast={idx === arr.length - 1}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const JsonGraphView = ({ data }) => {
  if (!data || typeof data !== "object") return null;
  return (
    <div className="bg-gradient-to-br from-blue-950 to-gray-900 rounded-xl border border-blue-900 p-4 my-4 overflow-auto">
      <div className="font-bold text-blue-200 mb-2 text-sm">
        JSON Tree Visualization
      </div>
      <div className="flex flex-col items-start w-full overflow-auto">
        <TreeNode
          label="root"
          value={data}
          isArray={Array.isArray(data)}
          isLast={true}
          level={0}
        />
      </div>
    </div>
  );
};

export default JsonGraphView;
