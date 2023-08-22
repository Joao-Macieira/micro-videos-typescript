import { setupSequelize } from "#seedwork/infra";
import ListCastMemberUseCase from "../../list-cast-member.use-case";
import { CastMemberSequelize } from "../../../../infra";
import { CastMember, Types } from "../../../../domain";
import { CastMemberToOutputMapper } from "../../../dto";

describe("ListCastMembersUseCase Integration Tests", () => {
  let useCase: ListCastMemberUseCase.UseCase;
  let repository: CastMemberSequelize.CastMemberRepository;

  setupSequelize({ models: [CastMemberSequelize.CastMemberModel] });

  beforeEach(() => {
    repository = new CastMemberSequelize.CastMemberRepository(
      CastMemberSequelize.CastMemberModel
    );
    useCase = new ListCastMemberUseCase.UseCase(repository);
  });

  it("should return output sorted by created_at when input param is empty", async () => {
    const categories = CastMember.fake()
      .theCastMembers(2)
      .withCreatedAt((i) => new Date(new Date().getTime() + 1000 + i))
      .build();

    await repository.bulkInsert(categories);
    const output = await useCase.execute({});
    expect(output).toEqual({
      items: [...categories].reverse().map((i) => i.toJSON()),
      total: 2,
      current_page: 1,
      per_page: 15,
      last_page: 1,
    });
  });

  describe("should search applying filter by name, sort and paginate", () => {
    const castMembers = [
      CastMember.fake().anActor().withName("test").build(),
      CastMember.fake().anActor().withName("a").build(),
      CastMember.fake().anActor().withName("TEST").build(),
      CastMember.fake().anActor().withName("e").build(),
      CastMember.fake().aDirector().withName("TeSt").build(),
    ];

    let arrange = [
      {
        input: {
          page: 1,
          per_page: 2,
          sort: "name",
          filter: { name: "TEST" },
        },
        output: {
          items: [castMembers[2], castMembers[4]].map(
            CastMemberToOutputMapper.toOutput
          ),
          total: 3,
          current_page: 1,
          per_page: 2,
          last_page: 2,
        },
      },
      {
        input: {
          page: 2,
          per_page: 2,
          sort: "name",
          filter: { name: "TEST" },
        },
        output: {
          items: [castMembers[0]].map(CastMemberToOutputMapper.toOutput),
          total: 3,
          current_page: 2,
          per_page: 2,
          last_page: 2,
        },
      },
    ];

    beforeEach(async () => {
      await repository.bulkInsert(castMembers);
    });

    test.each(arrange)(
      "when value is $search_params",
      async ({ input, output: expectedOutput }) => {
        const output = await useCase.execute(input);
        expect(output).toEqual(expectedOutput);
      }
    );
  });

  describe("should search applying filter by type, sort and paginate", () => {
    const castMembers = [
      CastMember.fake().anActor().withName("test").build(),
      CastMember.fake().aDirector().withName("a").build(),
      CastMember.fake().anActor().withName("TEST").build(),
      CastMember.fake().aDirector().withName("e").build(),
      CastMember.fake().anActor().withName("TeSt").build(),
      CastMember.fake().aDirector().withName("b").build(),
    ];

    let arrange = [
      {
        input: {
          page: 1,
          per_page: 2,
          sort: "name",
          filter: { type: Types.ACTOR },
        },
        output: {
          items: [castMembers[2], castMembers[4]].map(
            CastMemberToOutputMapper.toOutput
          ),
          total: 3,
          current_page: 1,
          per_page: 2,
          last_page: 2,
        },
      },
      {
        input: {
          page: 2,
          per_page: 2,
          sort: "name",
          filter: { type: Types.ACTOR },
        },
        output: {
          items: [castMembers[0]].map(CastMemberToOutputMapper.toOutput),
          total: 3,
          current_page: 2,
          per_page: 2,
          last_page: 2,
        },
      },
      {
        input: {
          page: 1,
          per_page: 2,
          sort: "name",
          filter: { type: Types.DIRECTOR },
        },
        output: {
          items: [castMembers[1], castMembers[5]].map(
            CastMemberToOutputMapper.toOutput
          ),
          total: 3,
          current_page: 1,
          per_page: 2,
          last_page: 2,
        },
      },
      {
        input: {
          page: 2,
          per_page: 2,
          sort: "name",
          filter: { type: Types.DIRECTOR },
        },
        output: {
          items: [castMembers[3]].map(CastMemberToOutputMapper.toOutput),
          total: 3,
          current_page: 2,
          per_page: 2,
          last_page: 2,
        },
      },
    ];

    beforeEach(async () => {
      await repository.bulkInsert(castMembers);
    });

    test.each(arrange)(
      "when value is $search_params",
      async ({ input, output: expectedOutput }) => {
        const output = await useCase.execute(input);
        expect(output).toEqual(expectedOutput);
      }
    );
  });

  it("should search using filter by name and type, sort and paginate", async () => {
    const castMembers = [
      CastMember.fake().anActor().withName("test").build(),
      CastMember.fake().aDirector().withName("a director").build(),
      CastMember.fake().anActor().withName("TEST").build(),
      CastMember.fake().aDirector().withName("e director").build(),
      CastMember.fake().anActor().withName("TeSt").build(),
      CastMember.fake().aDirector().withName("b director").build(),
    ];
    await repository.bulkInsert(castMembers);

    let output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: "name",
      filter: { name: "TEST", type: Types.ACTOR },
    });
    expect(output).toEqual({
      items: [castMembers[2], castMembers[4]].map(
        CastMemberToOutputMapper.toOutput
      ),
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    });

    output = await useCase.execute({
      page: 2,
      per_page: 2,
      sort: "name",
      filter: { name: "TEST", type: Types.ACTOR },
    });
    expect(output).toEqual({
      items: [castMembers[0]].map(CastMemberToOutputMapper.toOutput),
      total: 3,
      current_page: 2,
      per_page: 2,
      last_page: 2,
    });

    output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: "name",
      sort_dir: "asc",
      filter: { name: "director", type: Types.DIRECTOR },
    });
    expect(output).toEqual({
      items: [castMembers[1], castMembers[5]].map(
        CastMemberToOutputMapper.toOutput
      ),
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    });

    output = await useCase.execute({
      page: 2,
      per_page: 2,
      sort: "name",
      sort_dir: "asc",
      filter: { name: "director", type: Types.DIRECTOR },
    });
    expect(output).toEqual({
      items: [castMembers[3]].map(
        CastMemberToOutputMapper.toOutput
      ),
      total: 3,
      current_page: 2,
      per_page: 2,
      last_page: 2,
    });
  });
});