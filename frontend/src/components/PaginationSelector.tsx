import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination';

type Props = {
  page: number;
  pages: number;
  onPageChange: (page: number) => void;
};

const PaginationSelector = ({ page, pages, onPageChange }: Props) => {
  const pageNumbers = Array.from({ length: pages }, (_, index) => index + 1);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          {page !== 1 && (
            <PaginationPrevious
              href="#"
              onClick={() => onPageChange(page - 1)}
            />
          )}
        </PaginationItem>

        {pageNumbers.map((pageNumber) => (
          <PaginationItem key={pageNumber}>
            <PaginationLink
              href="#"
              isActive={pageNumber === page}
              onClick={() => onPageChange(pageNumber)}
            >
              {pageNumber}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          {page !== pages && (
            <PaginationNext href="#" onClick={() => onPageChange(page + 1)} />
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationSelector;
