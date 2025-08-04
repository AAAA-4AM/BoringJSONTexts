// Format value for display
const formatValue = (val) => {
  if (val === null) return "null";
  if (typeof val === "string") return `"${val}"`;
  return String(val);
};

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

const TreeForm = ({ label, value, level = 0, isLast = false }) => {
  // attributes for every node
  const isObject = value != null && typeof value === "object";
  const isArray = Array.isArray(value);

  const size = isArray ? value.length : Object.keys(value).length;

  return (
    <div className="flex-row flex h-full items-center justify-start">
      {/* connector for top node */}
      {level > 0 && <div className="w-0 h-0.5 mx-auto bg-blue-400" />}
      {/* root node */}
      {level === 0 && (
        <div
          className={` ${
            isObject ? "bg-blue-900/70" : "bg-purple-900/40"
          } text-center w-fit px-3 py-2 my-auto bg-blue-950 border border-blue-400 rounded-lg`}
        >
          {`${label} : ${isArray ? "[ ]" : "{ }"}`}
          <span className="text-yellow-400/80 text-xs ml-2">
            {isObject && `(${Object.keys(value).length})`}
          </span>
        </div>
      )}

      {level > 0 && (
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
              <TreeForm
                key={key}
                label={isArray ? `[${key}]` : key}
                value={val}
                level={level + 1}
                isLast={index === arr.length - 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const JsonTreeView = ({ data }) => {
  return (
    <div className="bg-gray-950/50 rounded-lg border border-blue-900 p-4 overflow-auto h-full">
      <div className="pl-4 h-full">
        {/* <TreeNode label="root" value={data} /> */}
        <TreeForm label="root" value={data} />
      </div>
    </div>
  );
};

export default JsonTreeView;

const OldTreeForm = ({ label, value, level = 0, isLast = false }) => {
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
        <div
          className={` ${
            isObject ? "bg-blue-900/70" : "bg-purple-900/40"
          } text-center w-fit px-3 py-2 mx-auto bg-blue-950 border border-blue-400 rounded-lg`}
        >
          {`${label} : ${isArray ? "[ ]" : "{ }"}`}
          <span className="text-yellow-400/80 text-xs ml-2">
            {isObject && `(${Object.keys(value).length})`}
          </span>
        </div>
      )}
      {level > 0 && (
        <div className="flex flex-col items-center justify-center max-w-fit min-w-fit mx-auto border border-blue-400 rounded-lg">
          <div
            className={`w-full text-center ${
              typeof value !== "object" ? "rounded-t-lg" : "rounded-lg"
            } ${isObject ? "bg-blue-900/70" : "bg-indigo-800/40"} px-3 py-2`}
          >
            {label}{" "}
            <span className="text-orange-400 text-xs ml-1">
              {isObject && `(${Object.keys(value).length})`}
            </span>
          </div>
          {typeof value !== "object" && (
            <div
              className={`w-full ${getValueColor(
                value
              )} bg-blue-950 rounded-b-lg px-3 py-2 border-t border-t-blue-400 text-center`}
            >
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
        <div className="h-0.5 bg-blue-400 w-full relative" />
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
