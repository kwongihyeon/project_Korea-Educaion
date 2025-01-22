import { paginationPage } from "@/app/menu";
import Cookies from "js-cookie";
  
  // components/Pagination.tsx
  interface Props {
    currentPage: number;
    totalPage: number;
    nextPage: string;
    prevPage: string;
    onPageChange: (page: number) => void;
    onUrlChange : (url : string) => void
  }

  const Pagination: React.FC<Props> = ({ currentPage, totalPage, nextPage, prevPage, onPageChange, onUrlChange }) => {
    const pageNumbers = Array.from({ length: totalPage }, (_, index) => index + 1);
    const language = Cookies.get('language') || "korean"

    return (
      <div className="flex items-center justify-center space-x-2">
        {prevPage && (
          <button
            className="border px-3 py-1"
            onClick={() => onUrlChange(prevPage)}
          >
            {paginationPage[language]?.prev}
          </button>
        )}

        {pageNumbers.map((page, index) => (
          <button
            key={index}
            className={`border px-3 py-1 ${page === currentPage ? "bg-blue-500 text-white" : "bg-white"}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}

        {nextPage && (
          <button
            className="border px-3 py-1"
            onClick={() => onUrlChange(nextPage)}
          >
            {paginationPage[language]?.next}
          </button>
        )}
      </div>
    );
  };

  export default Pagination;
