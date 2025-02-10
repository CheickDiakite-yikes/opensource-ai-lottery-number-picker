
interface HomeContainerProps {
  children: React.ReactNode;
}

export const HomeContainer = ({ children }: HomeContainerProps) => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <article className="px-4 sm:px-6 md:px-8 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </article>
    </main>
  );
};
