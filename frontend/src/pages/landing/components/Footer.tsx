const Footer = () => {
  return (
    <div className="bottom-0 w-full text-center p-2 font-semibold bg-gray-100 dark:bg-zinc-900 text-gray-600 dark:text-gray-400 text-sm border-t border-gray-300 dark:border-gray-700">
      © {new Date().getFullYear()} Created by <a href="https://amareshh.vercel.app" target="_blank" className="underline-offset-2 underline text-blue-500">Amaresh</a> with ❤️ | All rights
      reserved
    </div>
  );
};

export default Footer;
