import React from "react";
import "./App.css";
import Footer from "./Footer";
import { motion, AnimatePresence } from "framer-motion";
import GoToTopButton from "./components/GoToTopButton";
import JsonTreeView from "./components/JsonGraphView";
import {
  Copy,
  Check,
  Minimize2,
  Expand,
  X,
  ArrowUpToLine,
  FileText,
  Zap,
  BarChart3,
  Eye,
  Code,
  Settings,
} from "lucide-react";

const App = () => {
  const [inputText, setInputText] = React.useState("");
  const [formattedText, setFormattedText] = React.useState("");
  // State for expanded beautified JSON panel
  const [isExpanded, setIsExpanded] = React.useState(false);
  // State for graph visualization toggle
  const [showGraph, setShowGraph] = React.useState(false);

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

  return (
    <div className="App">
      {/* Go to Top Button with animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
      >
        <GoToTopButton />
      </motion.div>

      {/* Expanded Beautified JSON Modal with Framer Motion */}
      <AnimatePresence>
        {isExpanded && formattedText && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="relative w-full max-w-4xl mx-auto bg-gradient-to-br from-gray-950/95 to-blue-950/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-blue-800/50 p-6 sm:p-10 flex flex-col"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <motion.button
                onClick={() => setIsExpanded(false)}
                className="absolute top-4 right-4 bg-red-600/20 hover:bg-red-600/40 text-red-300 hover:text-red-100 rounded-full p-3 font-semibold shadow-lg transition-all duration-300 flex items-center gap-1 border border-red-500/30"
                aria-label="Close"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={20} />
              </motion.button>
              <motion.h2
                className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-6 tracking-wide text-center"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <FileText
                  className="inline-block mr-3 text-blue-400"
                  size={32}
                />
                Beautified JSON
              </motion.h2>
              <motion.div
                className="flex-1 overflow-auto p-4 bg-gray-950/70 backdrop-blur-sm rounded-2xl border border-blue-900/50 max-h-[70vh] shadow-inner"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <pre className="text-green-300 text-base sm:text-lg font-mono whitespace-pre-wrap">
                  {formattedText.formattedText}
                </pre>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-indigo-950 py-6 px-1 flex items-center justify-center relative overflow-hidden">
        {/* Animated background elements */}
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, #3b82f6 0%, transparent 50%)",
              "radial-gradient(circle at 80% 20%, #8b5cf6 0%, transparent 50%)",
              "radial-gradient(circle at 40% 80%, #06b6d4 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
        />

        <motion.div
          className="w-full max-w-6xl mx-auto px-2 sm:px-4 md:px-6 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="flex flex-col md:flex-row md:items-center md:justify-between mt-16 gap-4"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-400 tracking-tight drop-shadow text-center md:text-left">
                <Code className="inline-block mr-3 text-blue-400" size={48} />
                Boring JSON Formatter{" "}
                <span className="text-indigo-300">&amp; Beautifier</span>
              </h1>
            </div>
          </motion.div>

          {/* Input Section with animations */}
          <motion.div
            className="bg-gradient-to-br from-blue-950/80 to-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 mb-8 border border-blue-800/50"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <motion.label
              className="flex text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent mb-4 tracking-wide items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
            >
              <Zap className="text-blue-400" size={28} />
              Paste or Type Your JSON Text
            </motion.label>
            <motion.textarea
              className="w-full min-h-[120px] h-36 resize-none sm:h-44 border-2 border-blue-700/50 rounded-2xl p-4 sm:p-5 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 resize-vertical font-mono text-sm sm:text-base bg-gray-950/70 backdrop-blur-sm text-blue-100 placeholder:text-blue-400/70 shadow-inner transition-all duration-300"
              placeholder='e.g. {"name":"John","age":30} or escaped JSON strings'
              value={inputText}
              onChange={handleTextChange}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.4 }}
              whileFocus={{ scale: 1.02 }}
            />
            <motion.div
              className="flex justify-between items-center mt-4 px-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
            >
              <span className="text-sm text-blue-400/80 flex items-center gap-2">
                <Settings size={16} />
                Supports minified, escaped, or messy JSON
              </span>
              {/* Enhanced Graph Toggle */}
              {formattedText.isValidJSON && (
                <motion.div
                  className="flex items-center"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.6 }}
                >
                  <label
                    htmlFor="show-graph"
                    className="flex items-center cursor-pointer select-none group"
                  >
                    <div className="relative">
                      <input
                        id="show-graph"
                        type="checkbox"
                        checked={showGraph}
                        onChange={(e) => setShowGraph(e.target.checked)}
                        className="sr-only peer"
                      />
                      <motion.div
                        className="w-12 h-7 bg-blue-900/50 rounded-full peer border-2 border-blue-700/50 transition-all duration-300 peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-purple-600 peer-checked:border-purple-500/50"
                        whileTap={{ scale: 0.95 }}
                      />
                      <motion.div
                        className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow-lg transition-all duration-300 peer-checked:translate-x-5 peer-checked:bg-gradient-to-r peer-checked:from-blue-100 peer-checked:to-purple-100"
                        layout
                      />
                    </div>
                    <span className="ml-3 text-blue-200 text-sm font-medium group-hover:text-blue-100 transition-colors flex items-center gap-2">
                      Show Tree Visualization
                    </span>
                  </label>
                </motion.div>
              )}
            </motion.div>
          </motion.div>

          {/* Output Section with animations */}
          {formattedText && (
            <motion.div
              className="space-y-6 sm:space-y-8"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              {/* Enhanced Statistics Section */}
              <motion.div
                className="bg-gradient-to-br from-blue-950/80 to-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-blue-800/50"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <motion.h2
                  className="text-3xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent mb-8 tracking-wide flex items-center gap-3"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <BarChart3 className="text-blue-400" size={32} />
                  {formattedText.isValidJSON
                    ? "JSON Statistics"
                    : "Text Statistics"}
                </motion.h2>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    {
                      value: formattedText.wordCount,
                      label: "Words",
                      color: "blue",
                    },
                    {
                      value: formattedText.characterCount,
                      label: "Characters",
                      color: "green",
                    },
                    {
                      value: formattedText.lineCount,
                      label: "Lines",
                      color: "yellow",
                    },
                    {
                      value: formattedText.isValidJSON
                        ? formattedText.objectCount + formattedText.arrayCount
                        : "Not JSON",
                      label: formattedText.isValidJSON
                        ? "Objects/Arrays"
                        : "JSON",
                      color: "red",
                    },
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      className={`text-center p-6 bg-gradient-to-br from-${stat.color}-800 to-gray-950/60 backdrop-blur-sm rounded-2xl border border-${stat.color}-700 hover:border-${stat.color}-600 transition-all duration-300 group cursor-pointer`}
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        delay: 0,
                        duration: 0.1,
                        type: "spring",
                      }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div
                        className={`text-4xl font-extrabold text-${stat.color}-400 group-hover:text-${stat.color}-300 transition-colors`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          delay: stat.delay + 0.2,
                          type: "spring",
                          stiffness: 200,
                        }}
                      >
                        {typeof stat.value === "number"
                          ? stat.value.toLocaleString()
                          : stat.value}
                      </motion.div>
                      <div
                        className={`text-xs text-${stat.color}-200 mt-2 group-hover:text-${stat.color}-100 transition-colors`}
                      >
                        {stat.label}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Enhanced Formatted Output Section */}
              <motion.div
                className="bg-gradient-to-br from-gray-950/80 to-blue-950/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-blue-800/50 relative overflow-hidden"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.5, duration: 0.6 }}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                  <motion.h2
                    className="text-3xl font-bold bg-gradient-to-r from-blue-300 to-green-300 bg-clip-text text-blue-400 tracking-wide flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.7 }}
                  >
                    <FileText className="text-blue-400" size={32} />
                    {formattedText.isValidJSON
                      ? "Beautified JSON"
                      : "Formatted Text"}
                  </motion.h2>
                  <motion.div
                    className="flex gap-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.9 }}
                  >
                    {/* Copy formatted button */}
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

                    {/* copy minified button */}
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
                  </motion.div>
                </div>
                <motion.div
                  className="p-6 bg-gray-950/70 backdrop-blur-sm rounded-2xl border border-blue-900/50 overflow-auto max-h-60 sm:max-h-96 shadow-inner"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.1 }}
                >
                  <pre className="text-green-300 text-sm sm:text-base font-mono whitespace-pre-wrap">
                    {formattedText.formattedText}
                  </pre>
                </motion.div>
              </motion.div>

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
                      className="px-3 z-100 absolute top-5 not-md:right-10 md:left-10 py-2 hover:top-4 hover:py-3 hover:rounded-4xl bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold shadow transition-all ease text-sm flex items-center gap-1"
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
            </motion.div>
          )}

          {/* Empty State with animation */}
          {!inputText.trim() && (
            <motion.div
              className="bg-gradient-to-br from-blue-950/80 to-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 sm:p-12 text-center border border-blue-800/50"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <motion.div
                className="text-6xl sm:text-8xl mb-6"
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                🔧
              </motion.div>
              <motion.h3
                className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                Paste Your JSON Text to Format!
              </motion.h3>
              <motion.p
                className="text-blue-400 mb-6 text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                Works with minified JSON, escaped JSON strings, or any messy
                JSON format
              </motion.p>
              <motion.div
                className="text-sm text-blue-300 space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
              >
                <p className="font-semibold">Examples:</p>
                <motion.code
                  className="block bg-gray-950/70 backdrop-blur-sm p-4 rounded-xl text-sm border border-blue-900/50 text-blue-100 font-mono"
                  whileHover={{ scale: 1.02 }}
                >
                  {`{"name":"John","age":30,"city":"New York"}`}
                </motion.code>
                <motion.code
                  className="block bg-gray-950/70 backdrop-blur-sm p-4 rounded-xl text-sm border border-blue-900/50 text-blue-100 font-mono"
                  whileHover={{ scale: 1.02 }}
                >
                  {`"{\\"message\\":\\"Hello World\\",\\"status\\":\\"success\\"}"`}
                </motion.code>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default App;
