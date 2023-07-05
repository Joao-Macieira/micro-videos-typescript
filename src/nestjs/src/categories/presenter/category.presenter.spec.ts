import { instanceToPlain } from 'class-transformer';
import {
  CategoryCollectionPresenter,
  CategoryPresenter,
} from './category.presenter';
import { PaginationPresenter } from '../../@shared/presenters/pagination.presenter';

describe('Presenters tests', () => {
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

  describe('CategoryCollectionPresenter', () => {
    describe('constructor', () => {
      it('should set values', () => {
        const created_at = new Date();
        const presenter = new CategoryCollectionPresenter({
          items: [
            {
              id: 'e3e15329-fb1a-4ae4-a06b-7dde81ffa4a3',
              name: 'Movie',
              description: 'some description',
              is_active: true,
              created_at,
            },
          ],
          current_page: 1,
          per_page: 2,
          last_page: 3,
          total: 4,
        });

        expect(presenter.meta).toBeInstanceOf(PaginationPresenter);
        expect(presenter.meta).toEqual(
          new PaginationPresenter({
            current_page: 1,
            per_page: 2,
            last_page: 3,
            total: 4,
          }),
        );
        expect(presenter.data).toEqual([
          new CategoryPresenter({
            id: 'e3e15329-fb1a-4ae4-a06b-7dde81ffa4a3',
            name: 'Movie',
            description: 'some description',
            is_active: true,
            created_at,
          }),
        ]);
      });
    });

    it('should presenter data', () => {
      const created_at = new Date();
      let presenter = new CategoryCollectionPresenter({
        items: [
          {
            id: 'e3e15329-fb1a-4ae4-a06b-7dde81ffa4a3',
            name: 'Movie',
            description: 'some description',
            is_active: true,
            created_at,
          },
        ],
        current_page: 1,
        per_page: 2,
        last_page: 3,
        total: 4,
      });

      expect(instanceToPlain(presenter)).toStrictEqual({
        data: [
          {
            id: 'e3e15329-fb1a-4ae4-a06b-7dde81ffa4a3',
            name: 'Movie',
            description: 'some description',
            is_active: true,
            created_at: created_at.toISOString(),
          },
        ],
        meta: {
          current_page: 1,
          per_page: 2,
          last_page: 3,
          total: 4,
        },
      });

      presenter = new CategoryCollectionPresenter({
        items: [
          {
            id: 'e3e15329-fb1a-4ae4-a06b-7dde81ffa4a3',
            name: 'Movie',
            description: 'some description',
            is_active: true,
            created_at,
          },
        ],
        current_page: '1' as any,
        per_page: '2' as any,
        last_page: '3' as any,
        total: '4' as any,
      });

      expect(instanceToPlain(presenter)).toStrictEqual({
        meta: {
          current_page: 1,
          per_page: 2,
          last_page: 3,
          total: 4,
        },
        data: [
          {
            id: 'e3e15329-fb1a-4ae4-a06b-7dde81ffa4a3',
            name: 'Movie',
            description: 'some description',
            is_active: true,
            created_at: created_at.toISOString(),
          },
        ],
      });
    });
  });
});
