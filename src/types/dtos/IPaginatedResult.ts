export interface IPaginatedResult<T> {
    data: T[];
    totalRows: number;
    currentPage: number;
    pageSize: number;
}