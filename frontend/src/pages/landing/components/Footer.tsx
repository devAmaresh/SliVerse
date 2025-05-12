import { HashLink } from "react-router-hash-link";

const Footer = () => {
  return (
    <>
      
      <footer className="w-full flex flex-col items-center justify-center gap-4 p-8 bg-gray-100 dark:bg-zinc-900 border-t border-gray-300 dark:border-gray-700">
        {/* Logo Image */}
        <div className="w-24 h-auto"></div>

        {/* Footer Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-400">
          <HashLink
            smooth
            to="/t/privacy"
            className="hover:text-blue-500 transition-colors duration-200"
          >
            Privacy
          </HashLink>
          <HashLink
            to="/t/terms"
            className="hover:text-blue-500 transition-colors duration-200"
          >
            Terms of Service
          </HashLink>
          <HashLink
            to="/t/cookies"
            className="hover:text-blue-500 transition-colors duration-200"
          >
            Cookie Policy
          </HashLink>
        </div>

        {/* Footer Credits */}
        <div className="text-center text-sm text-gray-600 dark:text-gray-400 font-semibold">
          © {new Date().getFullYear()} Created by{" "}
          <a
            href="https://amareshh.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 text-blue-500"
          >
            Amaresh
          </a>{" "}
          with ❤️ | All rights reserved
        </div>
      </footer>
    </>
  );
};

export default Footer;
