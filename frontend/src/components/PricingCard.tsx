import { Link } from "react-router-dom";
import Svg from "./svg";
const PricingCard = ({
  children,
  description,
  price,
  type,
  subscription,
  buttonText,
  active,
}: any) => {
  return (
    <>
      <div className="w-full px-4 md:w-1/2 lg:w-1/3">
        <div className="relative z-10 mb-10 overflow-hidden rounded-[10px] border-2 border-stroke bg-white px-8 py-10 shadow-pricing dark:border-zinc-600 dark:bg-zinc-900 sm:p-12 lg:px-6 lg:py-10 xl:p-[50px]">
          <span className="mb-3 block text-lg font-semibold text-primary dark:text-primary-light">
            {type}
          </span>
          <div className="mb-5 text-[42px] font-bold text-dark dark:text-white">
            {price}
            <span className="text-base font-medium text-body-color dark:text-dark-6">
              / {subscription}
            </span>
          </div>
          <p className="mb-8 border-b border-stroke pb-8 text-base text-body-color dark:border-dark-3 dark:text-dark-6">
            {description}
          </p>
          <div className="mb-9 flex flex-col gap-[14px]">{children}</div>
          <Link
            to="/login"
            className={` ${
              active
                ? "block w-full rounded-md border border-blue-500 bg-primary p-3 text-center text-base font-medium dark:text-white transition hover:bg-opacity-90"
                : "block w-full rounded-md border border-stroke bg-transparent p-3 text-center text-base font-medium dark:text-zinc-100 text-zinc-900 transition hover:border-zinc-100 hover:bg-zinc-100 hover:text-black dark:border-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-white"
            } `}
          >
            {buttonText}
          </Link>
          <div>
            <Svg />
          </div>
        </div>
      </div>
    </>
  );
};
export default PricingCard;
