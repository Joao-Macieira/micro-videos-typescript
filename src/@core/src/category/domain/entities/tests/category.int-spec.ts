import { Category } from "../category";

describe('category integration tests', () => {
  describe('create method', () => {
    it('should a invalid category using incorrect name property', () => {
      expect(() => new Category({ name: null })).containsErrorMessages({
        name: [
          "name must be shorter than or equal to 255 characters",
          "name must be a string",
          "name should not be empty",
        ]
      });
  
      expect(() => new Category({ name: '' })).containsErrorMessages({
        name: [
          "name should not be empty",
        ]
      });
  
      expect(() => new Category({ name: 5 as any })).containsErrorMessages({
        name: [
          "name must be shorter than or equal to 255 characters",
          "name must be a string",
        ]
      });
  
      expect(() => new Category({ name: 't'.repeat(256) })).containsErrorMessages({
        name: [
          "name must be shorter than or equal to 255 characters"
        ]
      });
    });
  
    it('should a invalid category using incorrect description property', () => {
      expect(() => new Category({ name: 'John', description: 5 as any })).containsErrorMessages({
        description: [
          "description must be a string"
        ]
      });
    });
  
    it('should a invalid category using incorrect is_active property', () => {
      expect(() => new Category({ name: 'John', is_active: 5 as any })).containsErrorMessages({
        is_active: ["is_active must be a boolean value"]
      });
    });

    it('should create a valid category', () => {
      expect.assertions(0);
      new Category({ name: "Movie" });
      new Category({ name: "Movie", description: "Movie description" });
      new Category({ name: "Movie", description: null });
      new Category({ name: "Movie", description: "Movie description", is_active: false });
      new Category({ name: "Movie", description: "Movie description", is_active: true });
    });
  });

  describe('update method', () => {
    it('should a invalid category using incorrect name property', () => {
      const category = new Category({ name: 'Movie' });

      expect(() => category.update(null, null)).containsErrorMessages({
        name: [
          "name must be shorter than or equal to 255 characters",
          "name must be a string",
          "name should not be empty",
        ]
      });

      expect(() => category.update('', null)).containsErrorMessages({
        name: ["name should not be empty"],
      });

      expect(() => category.update(5 as any, null)).containsErrorMessages({
        name: [
          "name must be shorter than or equal to 255 characters",
          "name must be a string",
        ]
      });

      expect(() => category.update('t'.repeat(256), null)).containsErrorMessages({
        name: [
          "name must be shorter than or equal to 255 characters"
        ]
      });
    });
  
    it('should a invalid category using incorrect description property', () => {
      const category = new Category({ name: 'Movie' });

      expect(() => category.update('Series', 5 as any)).containsErrorMessages({
        description: ["description must be a string"]
      });
    });

    it('should update category', () => {
      expect.assertions(0);
      const category = new Category({ name: "Movie" });
      category.update('Serie', null);
      category.update('Serie', 'Serie description');
    });
  });
});