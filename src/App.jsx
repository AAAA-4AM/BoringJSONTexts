import React from "react";
import "./App.css"; // Assuming you have a CSS file for styles
import Footer from "./Footer";

import GoToTopButton from "./components/GoToTopButton";
import JsonTreeView from "./components/JsonTreeView";
import { Copy, Check, Minimize2, Expand, X, ArrowUpToLine } from "lucide-react";

const App = () => {
  const [inputText, setInputText] = React.useState("");
  const [formattedText, setFormattedText] = React.useState("");

  const formatText = (text) => {
    if (!text.trim()) return "";

    let formattedText = text;
    let isValidJSON = false;
    let jsonData = null;

    // Try to parse as JSON first
    try {
      jsonData = JSON.parse(text);
      isValidJSON = true;
      formattedText = JSON.stringify(jsonData, null, 2);
    } catch (e) {
      // If not valid JSON, try to handle escaped JSON string
      try {
        // Remove outer quotes if present and unescape
        let cleanText = text.trim();
        if (
          (cleanText.startsWith('"') && cleanText.endsWith('"')) ||
          (cleanText.startsWith("'") && cleanText.endsWith("'"))
        ) {
          cleanText = cleanText.slice(1, -1);
        }

        // Replace escape sequences
        cleanText = cleanText
          .replace(/\\n/g, "\n")
          .replace(/\\t/g, "\t")
          .replace(/\\r/g, "\r")
          .replace(/\\"/g, '"')
          .replace(/\\'/g, "'")
          .replace(/\\\\/g, "\\");

        // Try parsing the cleaned text as JSON
        jsonData = JSON.parse(cleanText);
        isValidJSON = true;
        formattedText = JSON.stringify(jsonData, null, 2);
      } catch (e2) {
        // If still not JSON, just clean up escape sequences for regular text
        formattedText = text
          .replace(/\\n/g, "\n")
          .replace(/\\t/g, "\t")
          .replace(/\\r/g, "\r")
          .replace(/\\"/g, '"')
          .replace(/\\'/g, "'")
          .replace(/\\\\/g, "\\");
      }
    }

    // Count statistics
    const lines = formattedText.split("\n");
    const wordCount = formattedText
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
    const characterCount = formattedText.length;
    const lineCount = lines.length;

    // For JSON, count objects and arrays
    let objectCount = 0;
    let arrayCount = 0;
    if (isValidJSON) {
      const jsonString = JSON.stringify(jsonData);
      objectCount = (jsonString.match(/{/g) || []).length;
      arrayCount = (jsonString.match(/\[/g) || []).length;
    }

    return {
      originalText: text,
      formattedText,
      isValidJSON,
      jsonData,
      wordCount,
      characterCount,
      lineCount,
      objectCount,
      arrayCount,
      lines: lines.filter((line) => line.trim() !== ""),
    };
  };

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setInputText(newText);
    setFormattedText(formatText(newText));
  };

  // State for copy confirmations
  const [copyStatus, setCopyStatus] = React.useState({
    formatted: false,
    minified: false,
    lines: {},
  });

  const copyToClipboard = (text, type = "formatted", lineIndex = null) => {
    navigator.clipboard.writeText(text);
    if (type === "formatted") {
      setCopyStatus((prev) => ({ ...prev, formatted: true }));
      setTimeout(
        () => setCopyStatus((prev) => ({ ...prev, formatted: false })),
        1200
      );
    } else if (type === "minified") {
      setCopyStatus((prev) => ({ ...prev, minified: true }));
      setTimeout(
        () => setCopyStatus((prev) => ({ ...prev, minified: false })),
        1200
      );
    } else if (type === "line" && lineIndex !== null) {
      setCopyStatus((prev) => ({
        ...prev,
        lines: { ...prev.lines, [lineIndex]: true },
      }));
      setTimeout(
        () =>
          setCopyStatus((prev) => ({
            ...prev,
            lines: { ...prev.lines, [lineIndex]: false },
          })),
        1200
      );
    }
  };

  // State for expanded beautified JSON panel
  const [isExpanded, setIsExpanded] = React.useState(false);

  // State for graph visualization toggle
  const [showGraph, setShowGraph] = React.useState(false);

  return (
    <div className="App">
      {/* Go to Top Button replaced with Lucide icon */}
      <GoToTopButton />
      {/* Expanded Beautified JSON Modal */}
      {isExpanded && formattedText && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-70">
          <div className="relative w-full max-w-3xl mx-auto bg-gradient-to-br from-gray-950 to-blue-950 rounded-2xl shadow-2xl border-2 border-blue-900 p-6 sm:p-10 flex flex-col">
            <button
              onClick={() => setIsExpanded(false)}
              className="absolute top-4 right-4 bg-blue-800 text-white rounded-lg hover:rounded-4xl px-3 py-1 hover:py-2 hover:bg-blue-700 font-semibold shadow transition-all text-sm flex items-center gap-1"
              aria-label="Minimize"
            >
              <Minimize2 size={18} className="inline-block text-blue-200" />
            </button>
            <h2 className="text-2xl font-bold text-blue-200 mb-6 tracking-wide text-center">
              Beautified JSON
            </h2>
            <div className="flex-1 overflow-auto p-2 sm:p-4 bg-gray-950 rounded-xl border border-blue-900 max-h-[70vh]">
              <pre className="text-green-300 text-base sm:text-lg font-mono whitespace-pre-wrap">
                {formattedText.formattedText}
              </pre>
            </div>
          </div>
        </div>
      )}
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-gray-800 py-6 px-1 flex items-center justify-center">
        <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-400 tracking-tight drop-shadow text-center md:text-left">
              Boring JSON Formatter{" "}
              <span className="text-indigo-300">&amp; Beautifier</span>
            </h1>
          </div>

          {/* Input Section */}
          <div className="bg-gradient-to-br from-blue-950 to-gray-900 rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 mb-8 border border-blue-900">
            <label className="block text-lg sm:text-xl font-bold text-blue-200 mb-3 sm:mb-4 tracking-wide">
              Paste or Type Your JSON Text
            </label>
            <textarea
              className="w-full min-h-[120px] h-36 resize-none sm:h-44 border-2 border-blue-800 rounded-xl p-3 sm:p-4 focus:border-blue-400 focus:outline-none resize-vertical font-mono text-sm sm:text-base bg-gray-950 text-blue-100 placeholder:text-blue-400 shadow-inner transition"
              placeholder='e.g. {"name":"John","age":30} or escaped JSON strings'
              value={inputText}
              onChange={handleTextChange}
            />
            <div className="flex justify-between items-center mt-2 px-1">
              <span className="text-xs text-blue-400">
                Supports minified, escaped, or messy JSON
              </span>
              {/* Graph Toggle Checkbox */}
              {formattedText.isValidJSON && (
                <div className="flex items-center">
                  <label
                    htmlFor="show-graph"
                    className="flex items-center cursor-pointer select-none"
                  >
                    <div className="relative">
                      <input
                        id="show-graph"
                        type="checkbox"
                        checked={showGraph}
                        onChange={(e) => setShowGraph(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-blue-900 rounded-full peer border-2 border-blue-700 transition-all duration-200 peer-checked:bg-blue-600"></div>
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-200 peer-checked:translate-x-5"></div>
                    </div>
                    <span className="ml-3 text-blue-200 text-sm font-medium">
                      Show Tree Visualization
                    </span>
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Output Section */}
          {formattedText && (
            <div className="space-y-6 sm:space-y-8">
              {/* Statistics */}
              <div className="bg-gradient-to-br from-blue-950 to-gray-900 rounded-2xl shadow-xl p-8 border border-blue-900">
                <h2 className="text-2xl font-bold text-blue-200 mb-6 tracking-wide">
                  {formattedText.isValidJSON
                    ? "JSON Statistics"
                    : "Text Statistics"}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                  <div className="text-center p-4 bg-blue-950 rounded-xl border border-blue-900">
                    <div className="text-3xl font-extrabold text-blue-400">
                      {formattedText.wordCount}
                    </div>
                    <div className="text-xs text-blue-200 mt-1">Words</div>
                  </div>
                  <div className="text-center p-4 bg-blue-950 rounded-xl border border-blue-900">
                    <div className="text-3xl font-extrabold text-green-400">
                      {formattedText.characterCount}
                    </div>
                    <div className="text-xs text-green-200 mt-1">
                      Characters
                    </div>
                  </div>
                  <div className="text-center p-4 bg-blue-950 rounded-xl border border-blue-900">
                    <div className="text-3xl font-extrabold text-yellow-300">
                      {formattedText.lineCount}
                    </div>
                    <div className="text-xs text-yellow-100 mt-1">Lines</div>
                  </div>
                  {formattedText.isValidJSON ? (
                    <div className="text-center p-4 bg-blue-950 rounded-xl border border-blue-900">
                      <div className="text-3xl font-extrabold text-purple-300">
                        {formattedText.objectCount + formattedText.arrayCount}
                      </div>
                      <div className="text-xs text-purple-100 mt-1">
                        Objects/Arrays
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-4 bg-blue-950 rounded-xl border border-blue-900">
                      <div className="text-sm font-bold text-red-400">
                        Not Valid JSON
                      </div>
                      <div className="text-xs text-red-200">Text Format</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Formatted Output */}
              <div className="bg-gradient-to-br from-gray-950 to-blue-950 rounded-2xl shadow-xl p-8 border border-blue-900 relative">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                  <h2 className="text-2xl font-bold text-blue-200 tracking-wide">
                    {formattedText.isValidJSON
                      ? "Beautified JSON"
                      : "Formatted Text"}
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        copyToClipboard(
                          formattedText.formattedText,
                          "formatted"
                        )
                      }
                      className={`px-3 hover:px-4 py-2 bg-blue-600 text-white hover:rounded-2xl rounded-lg hover:bg-blue-700 transition-all font-semibold shadow flex items-center gap-2`}
                    >
                      {copyStatus.formatted ? (
                        <>
                          <Check size={18} className="text-green-400 mr-1" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={18} className="text-blue-200 mr-1" />
                          Copy Formatted
                        </>
                      )}
                    </button>
                    {formattedText.isValidJSON && (
                      <button
                        onClick={() =>
                          copyToClipboard(
                            JSON.stringify(formattedText.jsonData),
                            "minified"
                          )
                        }
                        className={`px-3 hover:px-4 py-2 bg-green-600 text-white rounded-lg hover:rounded-2xl hover:bg-green-700 transition-all font-semibold shadow flex items-center gap-2`}
                      >
                        {copyStatus.minified ? (
                          <>
                            <Check size={18} className="text-green-400 mr-1" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy size={18} className="text-green-200 mr-1" />
                            Copy Minified
                          </>
                        )}
                      </button>
                    )}
                    {/* Expand Button */}
                    <button
                      onClick={() => setIsExpanded(true)}
                      className="bg-blue-900 text-blue-200 ease rounded-lg hover:rounded-4xl px-3 py-2 hover:px-4 hover:bg-blue-800 transition-all font-semibold shadow flex items-center gap-1 border border-blue-700 text-sm"
                      aria-label="Expand Beautified JSON"
                    >
                      <Expand
                        size={18}
                        className="inline-block text-blue-200"
                      />
                    </button>
                  </div>
                </div>
                <div className="p-3 sm:p-4 bg-gray-950 rounded-xl border border-blue-900 overflow-auto max-h-60 sm:max-h-96">
                  <pre className="text-green-300 text-sm sm:text-base font-mono whitespace-pre-wrap">
                    {formattedText.formattedText}
                  </pre>
                </div>
              </div>

              {/* <TreeForm /> */}

              {/* JSON Tree Visualization as right-side panel */}
              {showGraph && formattedText.isValidJSON && (
                <div>
                  {/* Overlay*/}
                  <div className="fixed inset-0 z-40 flex">
                    <div
                      className="flex-1 bg-black/40"
                      onClick={() => setShowGraph(false)}
                    />
                    <button
                      className="px-3 z-100 absolute top-6 not-md:right-10 md:left-10 py-2 hover:top-5 hover:py-3 hover:rounded-4xl bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold shadow transition-all ease text-sm flex items-center gap-1"
                      onClick={() => setShowGraph(false)}
                      aria-label="Close Tree Visualization"
                    >
                      <X size={18} className="inline-block text-blue-200" />
                    </button>
                    <div
                      className="h-full w-full md:w-3/4 bg-gradient-to-br from-blue-950 to-gray-900 border-l-2 border-blue-900 shadow-2xl flex flex-col p-0 m-0"
                      style={{
                        maxWidth: "100vw",
                        right: 0,
                        position: "fixed",
                        top: 0,
                        zIndex: 50,
                        boxShadow: "rgba(0,0,0,0.4) -8px 0 32px",
                      }}
                    >
                      <div className="flex items-center justify-between px-6 py-4 border-b border-blue-900 bg-blue-950/80">
                        <span className="font-bold text-blue-200 text-lg">
                          JSON Tree Visualization
                        </span>
                      </div>
                      <div className="flex-1 overflow-auto">
                        <JsonTreeView data={formattedText.jsonData} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Original vs Formatted Comparison */}
              <div className="bg-gradient-to-br from-blue-950 to-gray-900 rounded-2xl shadow-xl p-8 border border-blue-900">
                <h2 className="text-2xl font-bold text-blue-200 mb-6 tracking-wide">
                  Before & After Comparison
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <h3 className="text-sm font-semibold text-blue-300 mb-2">
                      Original (Unformatted)
                    </h3>
                    <div className="p-2 sm:p-3 bg-gray-950 rounded-xl border border-blue-900 max-h-24 sm:max-h-40 overflow-auto">
                      <pre className="text-red-300 text-xs font-mono whitespace-pre-wrap break-all">
                        {formattedText.originalText}
                      </pre>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-green-300 mb-2">
                      Formatted
                    </h3>
                    <div className="p-2 sm:p-3 bg-gray-950 rounded-xl border border-blue-900 max-h-24 sm:max-h-40 overflow-auto">
                      <pre className="text-green-300 text-xs font-mono whitespace-pre-wrap">
                        {formattedText.formattedText}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>

              {/* Line by Line View */}
              {formattedText.lines.length > 1 && (
                <div className="bg-gradient-to-br from-gray-950 to-blue-950 rounded-2xl shadow-xl p-8 border border-blue-900">
                  <h2 className="text-2xl font-bold text-blue-200 mb-6 tracking-wide">
                    Line by Line Breakdown
                  </h2>
                  <div className="space-y-2 max-h-40 sm:max-h-60 overflow-auto">
                    {formattedText.lines.map((line, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-2 sm:space-x-3 p-1 sm:p-2 hover:bg-blue-950 rounded-xl border border-blue-900"
                      >
                        <span className="text-xs font-mono text-blue-400 w-6 sm:w-8 flex-shrink-0">
                          {index + 1}
                        </span>
                        <code className="text-xs sm:text-sm font-mono text-blue-100 flex-1 break-all">
                          {line}
                        </code>
                        <button
                          onClick={() => copyToClipboard(line, "line", index)}
                          className="text-xs cursor-pointer flex items-center gap-1 flex-shrink-0 px-1 text-center sm:px-2 py-1 rounded transition-colors"
                        >
                          {copyStatus.lines[index] ? (
                            <Check size={14} className="text-green-500" />
                          ) : (
                            <Copy
                              size={14}
                              className="text-blue-200 hover:text-blue-400"
                            />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Empty State */}
          {!inputText.trim() && (
            <div className="bg-gradient-to-br from-blue-950 to-gray-900 rounded-2xl shadow-xl p-8 sm:p-12 text-center border border-blue-900">
              <div className="text-blue-900 text-4xl sm:text-6xl mb-4">🔧</div>
              <h3 className="text-xl sm:text-2xl font-bold text-blue-200 mb-2">
                Paste Your JSON Text to Format!
              </h3>
              <p className="text-blue-400 mb-3 sm:mb-4">
                Works with minified JSON, escaped JSON strings, or any messy
                JSON format
              </p>
              <div className="text-xs sm:text-sm text-blue-300 space-y-1">
                <p>Examples:</p>
                <code className="block bg-gray-950 p-1 sm:p-2 rounded text-xs border border-blue-900 text-blue-100">
                  {`{"name":"John","age":30,"city":"New York"}`}
                </code>
                <code className="block bg-gray-950 p-1 sm:p-2 rounded text-xs border border-blue-900 text-blue-100">
                  {`"{\\"message\\":\\"Hello World\\",\\"status\\":\\"success\\"}"`}
                </code>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default App;
