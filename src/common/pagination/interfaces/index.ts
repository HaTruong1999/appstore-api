export interface IPaginationOptions<CustomMetaType> {
    /**
     * Số lượng bản ghi mỗi trang
     */
    limit: number | string;
    /**
     * Trang yêu cầu
     */
    page: number | string;

    metaTransformer?: (meta: IPaginationMeta) => CustomMetaType;
}

export interface ObjectLiteral {
    [s: string]: any;
}

export interface IPaginationMeta extends ObjectLiteral {
    /**
     * Số lượng bản ghi của trang hiện tại
     */
    itemCount: number;
    /**
     * Tổng số lượng bản ghi
     */
    totalItems: number;
    /**
     * Số lượng bản ghi mỗi trang
     */
    itemsPerPage: number;
    /**
     * Tổng số trang
     */
    totalPages: number;
    /**
     * Trang hiện tại
     */
    currentPage: number;
}