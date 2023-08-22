import { NotFoundError } from "#seedwork/domain";
import { CastMember } from "../../../../domain";
import { CastMemberInMemoryRepository } from "../../../../infra";
import DeleteCastMemberUseCase from "../../delete-cast-member.use-case";


describe("DeleteCastMemberUseCase Unit Tests", () => {
  let useCase: DeleteCastMemberUseCase.UseCase;
  let repository: CastMemberInMemoryRepository;

  beforeEach(() => {
    repository = new CastMemberInMemoryRepository();
    // @ts-ignore
    useCase = new DeleteCastMemberUseCase.UseCase(repository);
  });

  it("should throws error when entity not found", async () => {
    await expect(() => useCase.execute({ id: "fake id" })).rejects.toThrow(
      new NotFoundError(`Entity not found using ID fake id`)
    );
  });

  it("should delete a cast member", async () => {
    const castMember = CastMember.fake().anActor().build();
    const items = [castMember];
    repository.items = items;
    await useCase.execute({
      id: castMember.id,
    });
    expect(repository.items).toHaveLength(0);
  });
});
