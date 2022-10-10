import {
    Repository,
    FindConditions,
    FindManyOptions,
    SelectQueryBuilder,
    ObjectLiteral,
    OrderByCondition,
} from 'typeorm';
import { Pagination } from './pagination';
import { IPaginationMeta, IPaginationOptions } from './interfaces';
import { createPaginationObject } from './create-pagination';

const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 1;

export async function paginate<T, CustomMetaType = IPaginationMeta>(
    repository: Repository<T>,
    options: IPaginationOptions<CustomMetaType>,
    searchOptions?: FindConditions<T> | FindManyOptions<T>,
    orderOptions?: any | any,
): Promise<Pagination<T, CustomMetaType>>;

export async function paginate<T, CustomMetaType = IPaginationMeta>(
    queryBuilder: SelectQueryBuilder<T>,
    options: IPaginationOptions<CustomMetaType>,
): Promise<Pagination<T, CustomMetaType>>;

export async function paginate<T, CustomMetaType = IPaginationMeta>(
    repositoryOrQueryBuilder: Repository<T> | SelectQueryBuilder<T>,
    options: IPaginationOptions<CustomMetaType>,
    searchOptions?: FindConditions<T> | FindManyOptions<T>,
    orderOptions?: any | any,
) {
    return repositoryOrQueryBuilder instanceof Repository
        ? paginateRepository<T, CustomMetaType>(
            repositoryOrQueryBuilder,
            options,
            searchOptions,
            orderOptions
        )
        : paginateQueryBuilder<T, CustomMetaType>(
            repositoryOrQueryBuilder,
            options,
        );
}

// export async function paginateRaw<T, CustomMetaType extends ObjectLiteral = IPaginationMeta>(
//     queryBuilder: SelectQueryBuilder<T>,
//     options: IPaginationOptions<CustomMetaType>,
// ): Promise<Pagination<T, CustomMetaType>> {
//     const [page, limit] = resolveOptions(options);

//     const totalQueryBuilder = queryBuilder.clone();
//     const [items, total] = await Promise.all([
//         queryBuilder
//             .limit(limit)
//             .offset((page - 1) * limit)
//             .getRawMany<T>(),
//         totalQueryBuilder.getCount(),
//     ]);

//     return createPaginationObject<T, CustomMetaType>({
//         items,
//         totalItems: total,
//         currentPage: page,
//         limit,
//         metaTransformer: options.metaTransformer,
//     });
// }

// export async function paginateRawAndEntities<T, CustomMetaType = IPaginationMeta>(
//     queryBuilder: SelectQueryBuilder<T>,
//     options: IPaginationOptions<CustomMetaType>,
// ): Promise<[Pagination<T, CustomMetaType>, Partial<T>[]]> {
//     const [page, limit] = resolveOptions(options);

//     const totalQueryBuilder = queryBuilder.clone();

//     const [itemObject, total] = await Promise.all([
//         queryBuilder
//             .limit(limit)
//             .offset((page - 1) * limit)
//             .getRawAndEntities<T>(),
//         totalQueryBuilder.getCount(),
//     ]);

//     return [
//         createPaginationObject<T, CustomMetaType>({
//             items: itemObject.entities,
//             totalItems: total,
//             currentPage: page,
//             limit,
//             metaTransformer: options.metaTransformer,
//         }),
//         itemObject.raw,
//     ];
// }

function resolveOptions(
    options: IPaginationOptions<any>,
): [number, number] {
    const page = resolveNumericOption(options, 'page', DEFAULT_PAGE);
    const limit = resolveNumericOption(options, 'limit', DEFAULT_LIMIT);

    return [page, limit];
}

function resolveNumericOption(
    options: IPaginationOptions<any>,
    key: 'page' | 'limit',
    defaultValue: number,
): number {
    const value = options[key];
    const resolvedValue = Number(value);

    if (Number.isInteger(resolvedValue) && resolvedValue >= 0)
        return resolvedValue;

    console.warn(
        `Query parameter "${key}" with value "${value}" was resolved as "${resolvedValue}", please validate your query input! Falling back to default "${defaultValue}".`,
    );
    return defaultValue;
}

async function paginateRepository<T, CustomMetaType = IPaginationMeta>(
    repository: Repository<T>,
    options: IPaginationOptions<CustomMetaType>,
    searchOptions?: FindConditions<T> | FindManyOptions<T>,
    orderOptions?: any | any,
): Promise<Pagination<T, CustomMetaType>> {
    const [page, limit] = resolveOptions(options);
    if (page < 1) {
        return createPaginationObject<T, CustomMetaType>({
            items: [],
            totalItems: 0,
            currentPage: page,
            limit,
            metaTransformer: options.metaTransformer,
        });
    }
    const [items, total] = await repository.findAndCount({
        skip: limit * (page - 1),
        take: limit,
        order: orderOptions,
        ...searchOptions
    });

    return createPaginationObject<T, CustomMetaType>({
        items,
        totalItems: total,
        currentPage: page,
        limit,
        metaTransformer: options.metaTransformer,
    });
}

async function paginateQueryBuilder<T, CustomMetaType = IPaginationMeta>(
    queryBuilder: SelectQueryBuilder<T>,
    options: IPaginationOptions<CustomMetaType>,
): Promise<Pagination<T, CustomMetaType>> {
    const [page, limit] = resolveOptions(options);
    const [items, total] = await queryBuilder
        .take(limit)
        .skip((page - 1) * limit)
        .getManyAndCount();

    return createPaginationObject<T, CustomMetaType>({
        items,
        totalItems: total,
        currentPage: page,
        limit,
        metaTransformer: options.metaTransformer,
    });
}