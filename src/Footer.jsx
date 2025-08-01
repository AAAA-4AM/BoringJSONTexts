// import Link from "next/link";
// import Image from "next/image";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer
      className="py-4 px-2 sm:px-8 flex flex-col md:flex-row items-center md:justify-between gap-4 md:gap-6 bg-gradient-to-r from-gray-900 via-blue-950 to-gray-800 text-gray-300 border-t border-indigo-900 w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-4 w-full md:w-auto text-center md:text-left">
        <a href="/" className="font-bold text-blue-400 hover:underline text-base sm:text-lg">
          Boring JSON Texts
        </a>
        <span className="hidden sm:inline text-gray-500">|</span>
        <div className="text-xs text-gray-300 sm:text-right w-full sm:w-auto mt-1 sm:mt-0">
          © {new Date().getFullYear()} FourAM.
        </div>
      </div>
      <a
        href="https://fouram.adityasrivastava.me/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 cursor-pointer hover:bg-white/10 pl-1.5 pr-2 py-1 rounded-xl transition"
      >
        <img
          src="/lg.png"
          alt="FourAM logo"
          width={28}
          height={28}
          className=""
        />
        <span className="text-xs text-indigo-300">
          Powered by <span className="text-gray-100">FourAM</span>
        </span>
      </a>
      <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-4">
        <a
          href="https://react.dev/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline text-gray-400 text-xs sm:text-base"
        >
          Built with React JS
        </a>
        <span className="hidden sm:inline text-gray-500">&amp;</span>
        <a
          href="https://tailwindcss.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline text-gray-400 text-xs sm:text-base"
        >
          Tailwind CSS
        </a>
      </div>
    </motion.footer>
  );
}
