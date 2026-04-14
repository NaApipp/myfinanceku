export default function Footer() {
  return (
    <div className="bg-[#F5F5F5] dark:bg-black ">
      <div className="border w-full border-gray-200 dark:border-white/10"></div>
      {/* Footer */}
      <div className="pt-3 pb-3 text-xs text-gray-400 dark:text-gray-600">
        <p className="text-center">
          © {new Date().getFullYear()} MyFinanceKu. All rights reserved.
        </p>
      </div>
    </div>
  );
}