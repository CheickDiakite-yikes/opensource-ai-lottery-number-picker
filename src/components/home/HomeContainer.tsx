
import { Footer } from "@/components/Footer";

interface HomeContainerProps {
  children: React.ReactNode;
}

export const HomeContainer = ({ children }: HomeContainerProps) => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col">
      <article className="px-4 sm:px-6 md:px-8 py-8 sm:py-12 flex-grow">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </article>
      <Footer />
    </main>
  );
};
