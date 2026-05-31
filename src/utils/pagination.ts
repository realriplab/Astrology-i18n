export interface PaginationLinkOptions {
  currentPage: number
  totalPages: number
  buildPageUrl: (page: number) => string
}

export interface PaginationLinks {
  prev?: string
  next?: string
  first?: string
  last?: string
  pages: PaginationPageItem[]
}

export type PaginationPageItem =
  | { type: "page"; page: number; href: string; current: boolean }
  | { type: "ellipsis" }

export type VisiblePaginationItem = number | "ellipsis"

export function getTotalPages(totalItems: number, pageSize: number): number {
  if (!Number.isInteger(pageSize) || pageSize < 1) {
    throw new RangeError("pageSize must be a positive integer")
  }

  return Math.max(1, Math.ceil(totalItems / pageSize))
}

export function getPageSlice<T>(
  items: readonly T[],
  currentPage: number,
  pageSize: number
): T[] {
  if (!Number.isInteger(currentPage) || currentPage < 1) {
    throw new RangeError("currentPage must be a positive integer")
  }

  const start = (currentPage - 1) * pageSize
  return items.slice(start, start + pageSize)
}

export function getPaginationLinks({
  currentPage,
  totalPages,
  buildPageUrl,
}: PaginationLinkOptions): PaginationLinks {
  if (!Number.isInteger(currentPage) || currentPage < 1) {
    throw new RangeError("currentPage must be a positive integer")
  }

  if (!Number.isInteger(totalPages) || totalPages < 1) {
    throw new RangeError("totalPages must be a positive integer")
  }

  if (currentPage > totalPages) {
    throw new RangeError("currentPage cannot be greater than totalPages")
  }

  return {
    prev: currentPage > 1 ? buildPageUrl(currentPage - 1) : undefined,
    next: currentPage < totalPages ? buildPageUrl(currentPage + 1) : undefined,
    first: currentPage > 1 ? buildPageUrl(1) : undefined,
    last: currentPage < totalPages ? buildPageUrl(totalPages) : undefined,
    pages: getVisiblePaginationItems(currentPage, totalPages).map((item) =>
      item === "ellipsis"
        ? { type: "ellipsis" }
        : {
            type: "page",
            page: item,
            href: buildPageUrl(item),
            current: item === currentPage,
          }
    ),
  }
}

export function getVisiblePaginationItems(
  currentPage: number,
  totalPages: number
): VisiblePaginationItem[] {
  if (!Number.isInteger(currentPage) || currentPage < 1) {
    throw new RangeError("currentPage must be a positive integer")
  }

  if (!Number.isInteger(totalPages) || totalPages < 1) {
    throw new RangeError("totalPages must be a positive integer")
  }

  if (currentPage > totalPages) {
    throw new RangeError("currentPage cannot be greater than totalPages")
  }

  if (totalPages <= 5) {
    return pageRange(totalPages)
  }

  if (currentPage <= 3) {
    const endPage = currentPage === 3 ? 4 : 3
    return [...pageRange(endPage), "ellipsis", totalPages]
  }

  if (currentPage >= totalPages - 2) {
    return [1, "ellipsis", ...pageRange(3).map((page) => totalPages - 3 + page)]
  }

  return [
    1,
    "ellipsis",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis",
    totalPages,
  ]
}

export function pageRange(totalPages: number): number[] {
  if (!Number.isInteger(totalPages) || totalPages < 1) {
    throw new RangeError("totalPages must be a positive integer")
  }

  return Array.from({ length: totalPages }, (_, index) => index + 1)
}
