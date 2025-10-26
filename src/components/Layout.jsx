const Layout = ({ children, isChatVisible = false }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 transition-colors">
      <main
        className={`relative transition-[padding] duration-300 ease-out px-4 sm:px-6 lg:px-8 ${
          isChatVisible ? 'md:pr-96' : 'md:pr-0'
        }`}
      >
        <div className="max-w-7xl mx-auto py-6">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
