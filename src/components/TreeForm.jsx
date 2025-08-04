import { div } from "framer-motion/client";

const JsonTreeView = ({ data }) => {
  if (!data || typeof data !== "object") return null;

  // Tree node component to recursively render JSON structure
  const TreeNode = ({ label, value, depth = 0, isLast = false }) => {
    const isObject = value !== null && typeof value === "object";
    const isArray = Array.isArray(value);

    // Calculate indent based on depth
    const indent = depth * 16;

    return (
      <div className="relative" style={{ marginLeft: `${indent}px` }}>
        {/* Vertical line connecting to parent (except for root) */}
        {depth > 0 && (
          <div
            className="absolute border-l-2 border-indigo-500/50 border h-full"
            style={{ left: "-16px", top: "0" }}
          />
        )}

        {/* Horizontal line connecting to node */}
        {depth > 0 && (
          <div
            className="absolute border-t-2 border-indigo-500/50 w-4"
            style={{ left: "-16px", top: "12px" }}
          />
        )}

        <div className="flex items-start py-1">
          {/* Node Content */}
          <div
            className={`rounded-md px-3 py-1 ${
              isObject ? "bg-blue-900/30" : "bg-purple-900/30"
            } border border-blue-700/50`}
          >
            {/* Label */}
            <span className="font-mono text-sm font-medium text-blue-300">
              {label}
              {" :"}
            </span>

            {/* Value display for primitives */}
            {!isObject ? (
              <span
                className={`ml-2 font-mono text-sm ${
                  value === null
                    ? "text-gray-400"
                    : typeof value === "string"
                    ? "text-green-300"
                    : typeof value === "number"
                    ? "text-yellow-300"
                    : typeof value === "boolean"
                    ? "text-purple-300"
                    : "text-gray-300"
                }`}
              >
                {value === null
                  ? "null"
                  : typeof value === "string"
                  ? `"${value}"`
                  : String(value)}
              </span>
            ) : (
              <span className="ml-2 font-mono text-xs text-indigo-400">
                {isArray ? "[ ]" : "{ }"}
              </span>
            )}
          </div>
        </div>

        {/* Render children for objects and arrays */}
        {isObject &&
          Object.entries(value).map(([key, val], index, arr) => (
            <TreeNode
              key={key}
              label={isArray ? `[${key}]` : key}
              value={val}
              depth={depth + 1}
              isLast={index === arr.length - 1}
            />
          ))}
      </div>
    );
  };

  return (
    <div className="bg-gray-950/50 rounded-lg border border-blue-900 p-4 overflow-auto max-h-full">
      <div className="pl-4">
        {/* <TreeNode label="root" value={data} /> */}
        <TreeForm label="root" value={data} />
      </div>
    </div>
  );
};

const TreeForm = ({ label, value, level = 0, isLast = false }) => {
  // attributes for every node
  const isObject = value != null && typeof value === "object";
  const isArray = Array.isArray(value);

  const size = isArray ? value.length : Object.keys(value).length;

  return (
    <div className="flex-row items-center">
      {/* connector for top node */}
      {level > 0 && <div className="w-0.5 h-8 mx-auto bg-blue-400" />}
      {/* root node */}
      {level === 0 && (
        <div className="text-center w-fit px-3 py-2 mx-auto bg-blue-900 border border-blue-400 rounded-lg">
          {`${label} : ${isArray ? "[ ]" : "{ }"}`}
        </div>
      )}
      {!isArray && level > 0 && (
        <div className="flex flex-col items-center justify-center max-w-fit min-w-fit mx-auto border border-blue-400 rounded-lg">
          <div
            className={`w-full bg-blue-950 text-center ${
              typeof value !== "object" ? "rounded-t-lg" : "rounded-lg"
            } px-3 py-2`}
          >
            {label}
          </div>
          {typeof value !== "object" && (
            <div className="w-full bg-blue-900 rounded-b-lg px-3 py-2 border-t border-t-blue-400 text-center">
              {JSON.stringify(value)}
            </div>
          )}
        </div>
      )}
      {/* render bottom line */}
      {isObject && !isLast && size > 1 && (
        <div className="w-0.5 h-8 mx-auto bg-blue-400" />
      )}
      {/* render vertical connector for child node */}
      {isObject && !isLast && size > 1 && (
        <div
          className="h-0.5 bg-blue-400 w-full relative"
          // style={{
          //   marginLeft: "calc(50% - 0.5rem)",
          //   marginRight: "0",
          // }}
        />
      )}
      {isObject && (
        <div className="flex flex-row w-full gap-4 justify-between">
          {Object.entries(value).map(([k, v], idx, arr) => (
            <TreeForm
              key={k}
              label={Array.isArray(value) ? `[${k}]` : k}
              value={v}
              isArray={isArray}
              isLast={idx === arr.length - 1}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default JsonTreeView;
