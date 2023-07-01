import { instanceToPlain } from 'class-transformer';
import { CategoryPresenter } from './category.presenter';

describe('Category presenter unit tests', () => {
  describe('Constructor', () => {
    it('should set values', () => {
      const created_at = new Date();
      const presenter = new CategoryPresenter({
        id: 'e3e15329-fb1a-4ae4-a06b-7dde81ffa4a3',
        name: 'Movie',
        description: 'Some description',
        is_active: true,
        created_at,
      });

      expect(presenter.id).toBe('e3e15329-fb1a-4ae4-a06b-7dde81ffa4a3');
      expect(presenter.name).toBe('Movie');
      expect(presenter.description).toBe('Some description');
      expect(presenter.is_active).toBeTruthy();
      expect(presenter.created_at).toBe(created_at);
    });
  });

  it('should presenter data', () => {
    const created_at = new Date();
    const presenter = new CategoryPresenter({
      id: 'e3e15329-fb1a-4ae4-a06b-7dde81ffa4a3',
      name: 'Movie',
      description: 'Some description',
      is_active: true,
      created_at,
    });

    const data = instanceToPlain(presenter);

    expect(data).toStrictEqual({
      id: 'e3e15329-fb1a-4ae4-a06b-7dde81ffa4a3',
      name: 'Movie',
      description: 'Some description',
      is_active: true,
      created_at: created_at.toISOString(),
    });
  });
});
