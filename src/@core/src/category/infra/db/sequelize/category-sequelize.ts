import { Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Op } from "sequelize";
import { SequelizeModelFactory } from "#seedwork/infra/db/sequelize/sequelize.model-factory";
import { Category, CategoryRepository as CategoryRepositoryContract, CategoryId } from "#category/domain";
import { NotFoundError, EntityValidationError, LoadEntityError } from "#seedwork/domain";

export namespace CategorySequelize {

  type CategoryModelProps = {
    id: string;
    name: string;
    description: string | null;
    is_active: boolean;
    created_at: Date;
  }

  @Table({ tableName: 'categories', timestamps: false })
  export class CategoryModel extends Model<CategoryModelProps> {
    @PrimaryKey
    @Column({ type: DataType.UUID })
    declare id: string;

    @Column({ allowNull: false, type: DataType.STRING(255) })
    declare name: string;

    @Column({ type: DataType.TEXT })
    declare description: string | null;

    @Column({ allowNull: false, type: DataType.BOOLEAN })
    declare is_active: boolean;

    @Column({ allowNull: false, type: DataType.DATE })
    declare created_at: Date;

    static factory() {
      const chance: Chance.Chance = require('chance')();

      return new SequelizeModelFactory<CategoryModel, CategoryModelProps>(CategoryModel, () => ({
        id: chance.guid({ version: 4 }),
        name: chance.word(),
        description: chance.sentence(),
        is_active: true,
        created_at: chance.date(),
      }));
    }
  }

  export class CategoryRepository implements CategoryRepositoryContract.Repository {
    sortableFields: string[] = ['name', 'created_at'];
  
    constructor(private categoryModel: typeof CategoryModel) {}
  
    async search(props: CategoryRepositoryContract.SearchParams): Promise<CategoryRepositoryContract.SearchResult> {
      const offset = (props.page - 1) * props.per_page;
      const limit = props.per_page;
  
      const {rows: models, count} = await this.categoryModel.findAndCountAll({
        ...(props.filter && {
          where: {
            name: {
              [Op.like]: `%${props.filter}%`
            }
          }
        }),
        ...(props.sort && this.sortableFields.includes(props.sort) ? {
          order: [[props.sort, props.sort_dir]]
        } : {
          order: [['created_at', 'DESC']]
        }),
        offset,
        limit
      });
  
      return new CategoryRepositoryContract.SearchResult({
        items: models.map(model => CategoryModelMapper.toEntity(model)),
        current_page: props.page,
        per_page: props.per_page,
        total: count,
        filter: props.filter,
        sort: props.sort,
        sort_dir: props.sort_dir
      });
    }
  
    async insert(entity: Category): Promise<void> {
      await this.categoryModel.create(entity.toJSON());
    }

    async bulkInsert(entities: Category[]): Promise<void> {
      await this.categoryModel.bulkCreate(entities.map(entity => entity.toJSON()));
    }
  
    async findById(id: string | CategoryId): Promise<Category> {
      const _id = `${id}`;
      const model = await this._get(_id);
      return CategoryModelMapper.toEntity(model);
    }
  
    async findAll(): Promise<Category[]> {
      const models = await this.categoryModel.findAll();
  
      return models.map(model => CategoryModelMapper.toEntity(model));
    }
  
    async update(entity: Category): Promise<void> {
      await this._get(entity.id);
      await this.categoryModel.update(entity.toJSON(), {
        where: { id: entity.id }
      })
    }
  
    async delete(id: string | CategoryId): Promise<void> {
      const _id = `${id}`;
      await this._get(_id);
      this.categoryModel.destroy({ where: { id: _id } });
    }
  
    private async _get(id: string) {
      return this.categoryModel.findByPk(id, {
        rejectOnEmpty: new NotFoundError(`Entity not found using ID ${id}`)
      });
    }
  }

  export class CategoryModelMapper {
    static toEntity(model: CategoryModel) {
      const { id, ...otherData } = model.toJSON();
  
      try {
        return new Category(otherData, new CategoryId(id));
      } catch (err) {
        if (err instanceof EntityValidationError) {
          throw new LoadEntityError(err.error);
        }
  
        throw err;
      }
    }
  }
}