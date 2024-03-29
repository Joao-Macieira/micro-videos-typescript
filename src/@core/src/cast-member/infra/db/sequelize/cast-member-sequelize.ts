import { EntityValidationError, LoadEntityError, NotFoundError, SortDirection } from "#seedwork/domain";
import { CastMember, CastMemberId, CastMemberType, Types } from "../../../domain";
import {CastMemberRepository as CastMemberRepositoryContract} from "../../../domain/repository";
import { Op, literal } from "sequelize";
import { Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

export namespace CastMemberSequelize {
  type CastMemberModelProps = {
    id: string;
    name: string;
    type: Types;
    created_at: Date;
  }

  @Table({ tableName: "cast_members", timestamps: false })
  export class CastMemberModel extends Model<CastMemberModelProps> {
    @PrimaryKey
    @Column({ type: DataType.UUID })
    declare id: string;

    @Column({ allowNull: false, type: DataType.STRING(255) })
    declare name: string;

    @Column({ allowNull: false, type: DataType.SMALLINT })
    declare type: Types

    @Column({ allowNull: false, type: DataType.DATE(6) })
    declare created_at: Date
  }

  export class CastMemberRepository implements CastMemberRepositoryContract.Repository {
    sortableFields: string[] = ["name", "created_at"];

    orderBy = {
      mysql: {
        name: (sort_dir: SortDirection) => literal(`binary name ${sort_dir}`),
      },
    };

    constructor(private castMemberModel: typeof CastMemberModel) {}

    async search(props: CastMemberRepositoryContract.SearchParams): Promise<CastMemberRepositoryContract.SearchResult> {
      const offset = (props.page - 1) * props.per_page;
      const limit = props.per_page;

      const where = {};

      if (props.filter && (props.filter.name || props.filter.type)) {
        if (props.filter.name) {
          where['name'] = { [Op.like]: `%${props.filter.name}%` }
        }

        if (props.filter.type) {
          where['type'] = props.filter.type.value;
        }
      }

      const { rows: models, count } = 
        await this.castMemberModel.findAndCountAll({
          where,
          ...(props.sort && this.sortableFields.includes(props.sort))
            ? { order: this.formatSort(props.sort, props.sort_dir) }
            : { order: [["created_at", "DESC"]] },
          limit,
          offset,
        });
      
      return new CastMemberRepositoryContract.SearchResult({
        items: models.map(model => CastMemberModelMapper.toEntity(model)),
        current_page: props.page,
        per_page: props.per_page,
        total: count,
        filter: props.filter,
        sort: props.sort,
        sort_dir: props.sort_dir,
      });
    }

    async insert(entity: CastMember): Promise<void> {
      await this.castMemberModel.create(entity.toJSON());
    }

    async bulkInsert(entities: CastMember[]): Promise<void> {
      await this.castMemberModel.bulkCreate(entities.map(entity => entity.toJSON()));
    }

    async findById(id: string | CastMemberId): Promise<CastMember> {
      const _id = `${id}`;
      const model = await this._get(_id);
      return CastMemberModelMapper.toEntity(model);
    }

    async findAll(): Promise<CastMember[]> {
      const models = await this.castMemberModel.findAll();
      return models.map(model => CastMemberModelMapper.toEntity(model));
    }

    async update(entity: CastMember): Promise<void> {
      await this._get(entity.id);
      await this.castMemberModel.update(entity.toJSON(), {
        where: { id: entity.id },
      });
    }

    async delete(id: string | CastMemberId): Promise<void> {
      const _id = `${id}`;
      await this._get(_id);
      this.castMemberModel.destroy({ where: { id: _id }});
    }

    private _get(id: string): Promise<CastMemberModel> {
      return this.castMemberModel.findByPk(id, {
        rejectOnEmpty: new NotFoundError(`Entity not found using ID ${id}`),
      });
    }

    private formatSort(sort: string, sort_dir: SortDirection) {
      const dialect = this.castMemberModel.sequelize.getDialect();

      if (this.orderBy[dialect] && this.orderBy[dialect][sort]) {
        return this.orderBy[dialect][sort](sort_dir);
      }

      return [[sort, sort_dir]];
    }
  }

  export class CastMemberModelMapper {
    static toEntity(model: CastMemberModel) {
      const { id, ...otherData } = model.toJSON();

      const [type, errorCastMemberType] = CastMemberType.create(otherData.type);

      try {
        return new CastMember({
          ...otherData,
          type
        }, new CastMemberId(id))
      } catch (error) {
        if (error instanceof EntityValidationError) {
          error.setFromError("type", errorCastMemberType);
          throw new LoadEntityError(error.error);
        }

        throw error;
      }
    }
  }
}