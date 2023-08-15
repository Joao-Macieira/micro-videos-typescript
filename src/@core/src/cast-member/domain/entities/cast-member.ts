import { Entity, EntityValidationError, UniqueEntityId } from "#seedwork/domain";
import CastMemberValidatorFactory from "../validators/cast-member.validator";
import { Types, CastMemberType } from "../value-objects/cast-member-type.vo";
import { CastMemberFakeBuilder } from "./cast-member-fake-builder";

export interface CastMembersProps {
  name: string;
  type: CastMemberType;
  created_at?: Date;
}

export type CastMembersPropsJson = Required<{ id: string } & Omit<CastMembersProps, "types">> & { type: Types };

export class CastMember extends Entity<CastMembersProps, CastMembersPropsJson> {
  constructor(public readonly props: CastMembersProps, id?: UniqueEntityId) {
    super(props, id);
    CastMember.validate(props);
    this.props.created_at = this.props.created_at ?? new Date();
  }

  get name(): string {
    return this.props.name;
  }

  set name(value: string) {
    this.props.name = value;
  }

  get type(): CastMemberType {
    return this.props.type;
  }

  set type(value: CastMemberType) {
    this.props.type = value;
  }

  get created_at(): Date {
    return this.props.created_at;
  }

  update(name: string, type: CastMemberType): void {
    CastMember.validate({
      name,
      type,
    });

    this.name = name;
    this.type = type;
  }

  static validate(props: CastMembersProps) {
    const validator = CastMemberValidatorFactory.create();
    const isValid = validator.validate(props);

    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }

  static fake() {
    return CastMemberFakeBuilder;
  }

  toJSON(): CastMembersPropsJson {
    return {
      id: this.id,
      ...this.props,
      type: this.type.value,
    } as CastMembersPropsJson;
  }
}