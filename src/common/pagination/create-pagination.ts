import { IPaginationMeta, ObjectLiteral } from './interfaces';
import { Pagination } from './pagination';

export function createPaginationObject<T, CustomMetaType extends ObjectLiteral = IPaginationMeta>({
    items,
    totalItems,
    currentPage,
    limit,
    metaTransformer,
}: {
    items: T[];
    totalItems: number;
    currentPage: number;
    limit: number;
    metaTransformer?: (meta: IPaginationMeta) => CustomMetaType;
}): Pagination<T, CustomMetaType> {
    const totalPages = Math.ceil(totalItems / limit);

    const meta: IPaginationMeta = {
        totalItems: totalItems,
        itemCount: items.length,
        itemsPerPage: limit,
        totalPages: totalPages,
        currentPage: currentPage,
    };

    if (metaTransformer) {
        return new Pagination<T, CustomMetaType>(
            items,
            metaTransformer(meta)
        );
    }
    // @ts-ignore
    return new Pagination<T, CustomMetaType>(items, meta);
}