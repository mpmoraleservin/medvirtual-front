"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Filter, Eye } from "lucide-react";
import React, { useMemo, useState, useRef, useEffect } from "react";
import Link from "next/link";

// --- TypeScript Interfaces ---
export interface TableColumn<T> {
  key: keyof T;
  header: string;
  sortable?: boolean;
  searchable?: boolean;
  filterable?: boolean;
  width?: string;
  type?: 'text' | 'status' | 'badge' | 'avatar' | 'action' | 'currency' | 'date';
  statusColors?: Record<string, string>;
  badgeConfig?: {
    variant: 'default' | 'secondary' | 'outline' | 'destructive';
    className?: string;
  };
}

export interface StatusConfig {
  key: string;
  label: string;
  color: string;
}

export interface AdvancedTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  title?: string;
  searchPlaceholder?: string;
  statusConfig?: StatusConfig[];
  statusKey?: keyof T;
  onViewDetails?: (item: T) => void;
  filters?: {
    key: keyof T;
    label: string;
    type: 'text' | 'date' | 'select';
    placeholder?: string;
    options?: { value: string; label: string }[];
  }[];
  pageSizeOptions?: number[];
  defaultPageSize?: number;
  showMobileCards?: boolean;
  emptyMessage?: string;
  className?: string;
  showPagination?: boolean;
  showSearch?: boolean;
  showFilters?: boolean;
  showPageSize?: boolean;
}

export function AdvancedTable<T extends { id: string }>({
  data,
  columns,
  title,
  searchPlaceholder = "Search...",
  statusConfig,
  statusKey,
  onViewDetails,
  filters = [],
  pageSizeOptions = [5, 10, 20],
  defaultPageSize = 5,
  showMobileCards = true,
  emptyMessage = "No data found.",
  className = "",
  showPagination = true,
  showSearch = true,
  showFilters = true,
  showPageSize = true,
}: AdvancedTableProps<T>) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [page, setPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [pageSize, setPageSize] = useState<number | null>(null);
  const [manualPageSize, setManualPageSize] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // Auto-calculate page size based on viewport
  useEffect(() => {
    if (!showPagination) {
      setPageSize(defaultPageSize);
      setManualPageSize(true);
      return;
    }
    if (manualPageSize) return;
    function calculatePageSize() {
      const rowHeight = 64;
      const headerHeight = 56;
      const filterHeight = showSearch || showFilters ? 56 : 0;
      const titleHeight = title ? 40 : 0;
      const paginationHeight = showPagination ? 56 : 0;
      const container = tableContainerRef.current;
      if (container) {
        const available = window.innerHeight - container.getBoundingClientRect().top - paginationHeight - 24;
        const rows = Math.max(1, Math.floor((available - headerHeight - filterHeight - titleHeight) / rowHeight));
        setPageSize(rows);
      }
    }
    calculatePageSize();
    window.addEventListener("resize", calculatePageSize);
    return () => window.removeEventListener("resize", calculatePageSize);
  }, [manualPageSize, title, showSearch, showFilters, showPagination, defaultPageSize]);

  // Reset page when filters change
  useEffect(() => { 
    setPage(1); 
  }, [search, statusFilter, filterValues, pageSize]);

  // Filter data
  const filteredData = useMemo(() => {
    return data.filter(item => {
      // Search filter
      const searchMatch = !search || columns.some(col => {
        if (!col.searchable) return false;
        const value = item[col.key];
        return String(value).toLowerCase().includes(search.toLowerCase());
      });

      // Status filter
      const statusMatch = statusFilter === "All" || 
        (statusKey && item[statusKey] === statusFilter);

      // Custom filters
      const filterMatch = Object.entries(filterValues).every(([key, value]) => {
        if (!value) return true;
        const itemValue = item[key as keyof T];
        if (typeof itemValue === 'string') {
          return itemValue.toLowerCase().includes(value.toLowerCase());
        }
        return String(itemValue) === value;
      });

      return searchMatch && statusMatch && filterMatch;
    });
  }, [data, search, statusFilter, filterValues, columns, statusKey]);

  // Pagination
  const effectivePageSize = pageSize ?? defaultPageSize;
  const pageCount = Math.ceil(filteredData.length / effectivePageSize);
  const paginatedData = useMemo(() =>
    filteredData.slice((page - 1) * effectivePageSize, page * effectivePageSize),
    [filteredData, page, effectivePageSize]
  );

  // Render cell content based on column type
  const renderCellContent = (column: TableColumn<T>, value: any, item: T) => {
    switch (column.type) {
      case 'status':
        const statusColors = column.statusColors || {};
        const color = statusColors[String(value)] || "bg-gray-100 text-gray-800";
        return (
          <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 ${color}`}>
            {String(value)}
          </span>
        );
      case 'badge':
        const config = column.badgeConfig || { variant: 'default' };
        // Handle arrays for badges (like specializations, skills)
        if (Array.isArray(value)) {
          return (
            <div className="w-full h-full flex items-center justify-center flex-wrap gap-1">
              {value.map((item: string, index: number) => (
                <span
                  key={index}
                  className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${config.className || ''}`}
                >
                  {item}
                </span>
              ))}
            </div>
          );
        }
        return (
          <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${config.className || ''}`}>
            {String(value)}
          </span>
        );
      case 'action':
        return (
          <div className="flex justify-center gap-2">
            <Link href={`/dashboard/admin/panels/${item.id}`}>
              <Button
                size="icon"
                className="bg-blue-100 hover:bg-blue-200 text-blue-700"
                aria-label="View Details"
                title="View Details"
              >
                <Eye className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        );
      case 'currency':
        return (
          <div className="font-semibold text-center">
            {typeof value === 'number' ? `$${value.toLocaleString()}` : String(value)}
          </div>
        );
      case 'date':
        return <div>{String(value)}</div>;
      default:
        return (
          <div className="font-semibold text-[#222] leading-tight">
            {String(value)}
          </div>
        );
    }
  };

  return (
    <div className={`flex flex-col w-full max-w-screen-xl mx-auto ${className}`} ref={tableContainerRef}>
      {title && <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">{title}</h1>}
      
      {/* Filters and Search */}
      {(showSearch || showFilters || statusConfig) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div className="flex flex-1 gap-2">
            {showSearch && (
              <Input
                type="text"
                placeholder={searchPlaceholder}
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                className="w-full sm:w-64"
              />
            )}
            {statusConfig && (
              <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setPage(1); }}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  {statusConfig.map(option => (
                    <SelectItem key={option.key} value={option.key}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {showFilters && filters.length > 0 && (
              <>
                <Button variant="outline" className="gap-2 sm:hidden" onClick={() => setFilterOpen(true)} aria-label="Filter">
                  <Filter className="w-4 h-4" />
                </Button>
                <Button variant="outline" className="gap-2 hidden sm:inline-flex" onClick={() => setFilterOpen(true)}>
                  <Filter className="w-4 h-4" /> Filter
                </Button>
              </>
            )}
          </div>
          {showPageSize && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rows per page:</span>
              <Select
                value={(pageSize ?? defaultPageSize).toString()}
                onValueChange={v => {
                  setPageSize(Number(v));
                  setManualPageSize(true);
                }}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {pageSizeOptions.map(size => (
                    <SelectItem key={size} value={size.toString()}>{size}</SelectItem>
                  ))}
                  <SelectItem value={String(filteredData.length)}>All</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      )}

      {/* Table Container */}
      <div className="flex flex-col rounded-lg border bg-card p-4">
        {/* Desktop Table */}
        <div className="hidden sm:block w-full">
          <div ref={tableContainerRef} className={`relative w-full ${className}`}>
            <Table className="w-full" style={{ tableLayout: "auto" }}>
              <TableHeader>
                <TableRow className="bg-[#F6F6F7] border-b border-[#E5E7EB]">
                  {columns.map((column) => (
                    <TableHead
                      key={String(column.key)}
                      className="font-semibold text-xs sm:text-base px-6 py-3 text-left align-middle"
                    >
                      {column.header}
                    </TableHead>
                  ))}
                  {onViewDetails && <TableHead className="text-center px-6 py-3">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((item) => (
                  <TableRow key={item.id} className="bg-white border-b border-[#F1F1F1] hover:bg-[#F6F6F7] transition-colors group">
                    {columns.map((column) => (
                      <TableCell
                        key={String(column.key)}
                        className={
                          column.type === "status" || column.type === "action"
                            ? "whitespace-nowrap px-6 py-3 text-xs sm:text-base align-middle"
                            : "px-6 py-3 text-xs sm:text-base align-middle break-words whitespace-normal"
                        }
                        style={{ width: column.width || undefined }}
                      >
                        {renderCellContent(column, item[column.key], item)}
                      </TableCell>
                    ))}
                    {onViewDetails && (
                      <TableCell className="py-3 sm:py-4 text-center align-middle text-xs sm:text-base px-6 whitespace-nowrap">
                        <Link href={`/dashboard/admin/panels/${item.id}`}>
                          <Button
                            size="icon"
                            className="bg-blue-100 hover:bg-blue-200 text-blue-700"
                            aria-label="View Details"
                            title="View Details"
                          >
                            <Eye className="w-5 h-5" />
                          </Button>
                        </Link>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
                {paginatedData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={columns.length + (onViewDetails ? 1 : 0)} className="text-center text-muted-foreground py-8 text-xs sm:text-base px-6">
                      {emptyMessage}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Mobile Cards */}
        {showMobileCards && (
          <div className="flex flex-col gap-3 sm:hidden">
            {paginatedData.map((item) => (
              <div key={item.id} className="rounded-lg border bg-white p-4 flex flex-col gap-2 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    {columns.slice(0, 2).map((column) => (
                      <div key={String(column.key)} className="font-semibold text-[#222] leading-tight">
                        {renderCellContent(column, item[column.key], item)}
                      </div>
                    ))}
                  </div>
                  {onViewDetails && (
                    <Link href={`/dashboard/admin/panels/${item.id}`}>
                      <Button 
                        size="icon" 
                        className="bg-blue-100 hover:bg-blue-200 text-blue-700" 
                        aria-label="View Details" 
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            ))}
            {paginatedData.length === 0 && (
              <div className="text-center text-muted-foreground py-8 text-xs">{emptyMessage}</div>
            )}
          </div>
        )}

        {/* Pagination */}
        {showPagination && pageCount > 1 && (
          <div className="flex flex-wrap justify-between items-center mt-4 pt-2 border-t border-muted-foreground/10 gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <div className="flex gap-1">
              {Array.from({ length: pageCount }, (_, i) => (
                <Button
                  key={i+1}
                  size="sm"
                  variant={page === i+1 ? "default" : "outline"}
                  onClick={() => setPage(i+1)}
                  className="px-3"
                >
                  {i+1}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={page === pageCount || pageCount === 0}
              onClick={() => setPage(p => Math.min(pageCount, p + 1))}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* Advanced Filters Dialog */}
      {filters.length > 0 && (
        <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
          <DialogContent className="max-w-sm w-full">
            <DialogTitle className="sr-only">Advanced Filters</DialogTitle>
            <div className="flex flex-col space-y-4 py-2">
              {filters.map((filter) => (
                <div key={String(filter.key)}>
                  <Label htmlFor={String(filter.key)}>{filter.label}</Label>
                  {filter.type === 'select' && filter.options ? (
                    <Select
                      value={filterValues[String(filter.key)] || ""}
                      onValueChange={value => setFilterValues(prev => ({
                        ...prev,
                        [String(filter.key)]: value
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={filter.placeholder} />
                      </SelectTrigger>
                      <SelectContent>
                        {filter.options.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id={String(filter.key)}
                      type={filter.type}
                      value={filterValues[String(filter.key)] || ""}
                      onChange={e => setFilterValues(prev => ({
                        ...prev,
                        [String(filter.key)]: e.target.value
                      }))}
                      placeholder={filter.placeholder}
                    />
                  )}
                </div>
              ))}
            </div>
            <DialogFooter className="flex flex-col gap-2 mt-2">
              <Button onClick={() => setFilterOpen(false)} variant="default">Apply</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
} 