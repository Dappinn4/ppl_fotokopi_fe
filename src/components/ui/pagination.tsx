"use client";

import * as React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { ButtonProps, buttonVariants } from "@/components/ui/button";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
  ...props
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
} & React.ComponentProps<"nav">) => {
  const [isSmallScreen, setIsSmallScreen] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 640);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const renderPageNumbers = () => {
    if (isSmallScreen) {
      const startPage = Math.max(1, currentPage - 1);
      const endPage = Math.min(totalPages, currentPage + 1);
      const pages = [];

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      return pages.map((page) => (
        <PaginationItem key={page}>
          <PaginationLink
            isActive={currentPage === page}
            onClick={() => onPageChange(page)}
          >
            {page}
          </PaginationLink>
        </PaginationItem>
      ));
    }

    return Array.from({ length: totalPages }, (_, index) => {
      const page = index + 1;
      return (
        <PaginationItem key={page}>
          <PaginationLink
            isActive={currentPage === page}
            onClick={() => onPageChange(page)}
          >
            {page}
          </PaginationLink>
        </PaginationItem>
      );
    });
  };

  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    >
      <PaginationPrevious
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      />
      <PaginationContent>{renderPageNumbers()}</PaginationContent>
      <PaginationNext
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      />
    </nav>
  );
};
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<HTMLUListElement, React.ComponentProps<"ul">>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn("flex flex-row items-center gap-1", className)} {...props} />
  )
);
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<HTMLLIElement, React.ComponentProps<"li">>(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={cn("", className)} {...props} />
  )
);
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<ButtonProps, "size"> & React.ComponentProps<"a">;

const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  disabled,
  ...props
}: PaginationLinkProps & { disabled?: boolean }) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? "outline" : "ghost",
        size,
      }),
      className,
      disabled && "opacity-50 cursor-not-allowed pointer-events-none"
    )}
    aria-disabled={disabled}
    {...props}
    onClick={(e) => {
      if (disabled) {
        e.preventDefault();
        e.stopPropagation();
      } else if (props.onClick) {
        props.onClick(e);
      }
    }}
  />
);
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn("gap-1 pl-2.5", className)}
    {...props}
  >
    <ChevronLeftIcon className="h-4 w-4" />
    <span className="cursor-pointer">Previous</span>
  </PaginationLink>
);
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn("gap-1 pr-2.5", className)}
    {...props}
  >
    <span className="cursor-pointer">Next</span>
    <ChevronRightIcon className="h-4 w-4" />
  </PaginationLink>
);
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex cursor-pointer h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <DotsHorizontalIcon className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
