import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage?: number;
  totalPages?: number;
  itemsPerPage?: string;
  onPageChange?: (page: number) => void;
  onItemsPerPageChange?: (value: string) => void;
}

export default function Pagination({
  currentPage = 1,
  totalPages = 100,
  itemsPerPage = "10",
  onPageChange = () => {},
  onItemsPerPageChange = () => {},
}: PaginationProps) {
  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    // Check if we're on mobile or desktop
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    
    if (!isMobile) {
      // Desktop view - show more pages
      for (let i = 1; i <= Math.min(maxVisiblePages, totalPages); i++) {
        pages.push(
          <Button
            key={i}
            variant={i === currentPage ? "default" : "ghost"}
            size="sm"
            className={`h-8 w-8 ${
              i === currentPage ? "bg-purple-600 hover:bg-purple-700" : ""
            }`}
            onClick={() => onPageChange(i)}
          >
            {i}
          </Button>
        );
      }
      
      if (totalPages > maxVisiblePages) {
        pages.push(
          <span key="ellipsis" className="text-gray-400 px-2">
            ...
          </span>
        );
        pages.push(
          <Button
            key={totalPages}
            variant="ghost"
            size="sm"
            className="h-8 w-8"
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </Button>
        );
      }
    } else {
      // Mobile view - show only 3 pages around current
      const start = Math.max(1, currentPage - 1);
      const end = Math.min(totalPages, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(
          <Button
            key={i}
            variant={i === currentPage ? "default" : "ghost"}
            size="sm"
            className={`h-8 w-8 ${
              i === currentPage ? "bg-purple-600 hover:bg-purple-700" : ""
            }`}
            onClick={() => onPageChange(i)}
          >
            {i}
          </Button>
        );
      }
    }
    
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mt-6 space-y-4 sm:space-y-0 px-4 sm:px-0">
      <div className="flex items-center space-x-1 sm:space-x-2 order-2 sm:order-1">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 sm:h-9 sm:w-9"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        
        <div className="hidden sm:flex items-center space-x-1">
          {renderPageNumbers()}
        </div>
        
        <div className="sm:hidden flex items-center space-x-1">
          {renderPageNumbers()}
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 sm:h-9 sm:w-9"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
      
      <Select 
        value={itemsPerPage}
        onValueChange={onItemsPerPageChange}
      >
        <SelectTrigger className="w-full sm:w-32 order-1 sm:order-2">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="5">5 / page</SelectItem>
          <SelectItem value="10">10 / page</SelectItem>
          <SelectItem value="20">20 / page</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}