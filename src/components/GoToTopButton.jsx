import React from "react";

const GoToTopButton = () => {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 z-50 px-3 py-3 hover:py-4 transition-all rounded-full shadow-2xl border-2 border-blue-900 bg-gradient-to-br from-blue-700 to-blue-900 text-white font-bold text-lg flex items-center gap-2 duration-300 hover:from-blue-600 hover:to-blue-800 hover:scale-105 active:scale-95 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      aria-label="Go to top"
      style={{ boxShadow: "0 4px 24px 0 rgba(0,0,0,0.25)" }}
    >
      <svg
        width="20"
        height="20"
        fill="none"
        viewBox="0 0 20 20"
        className="inline-block"
      >
        <path
          d="M10 15V5M10 5l-5 5M10 5l5 5"
          stroke="#a5b4fc"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};

export default GoToTopButton;
