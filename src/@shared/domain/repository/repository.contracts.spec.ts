import { SearchParams } from "./repository.contracts";

describe('SearchParams unit tests', () => {
  test('page prop', () => {
    const params = new SearchParams({});

    expect(params.page).toBe(1);

    const arrange = [
      { page: null, expect: 1 },
      { page: undefined, expect: 1 },
      { page: "", expect: 1 },
      { page: "fake", expect: 1 },
      { page: 0, expect: 1 },
      { page: -1, expect: 1 },
      { page: 5.5, expect: 1 },
      { page: true, expect: 1 },
      { page: false, expect: 1 },
      { page: {}, expect: 1 },
      { page: 1, expect: 1 },
      { page: 2, expect: 2 },
    ];
    
    arrange.forEach((item) => {
      expect(new SearchParams({ page: item.page as any }).page).toBe(item.expect);
    });
  });

  test('per_page prop', () => {
    const params = new SearchParams({});

    expect(params.per_page).toBe(15);

    const arrange = [
      { per_page: null, expect: 15 },
      { per_page: undefined, expect: 15 },
      { per_page: "", expect: 15 },
      { per_page: "fake", expect: 15 },
      { per_page: 0, expect: 15 },
      { per_page: -1, expect: 15 },
      { per_page: 5.5, expect: 15 },
      { per_page: true, expect: 15 },
      { per_page: false, expect: 15 },
      { per_page: {}, expect: 15 },
      { per_page: 1, expect: 1 },
      { per_page: 2, expect: 2 },
      { per_page: 10, expect: 10 },
    ];
    
    arrange.forEach((item) => {
      expect(new SearchParams({ per_page: item.per_page as any }).per_page).toBe(item.expect);
    });
  });

  test('sort prop', () => {
    const params = new SearchParams({});

    expect(params.sort).toBeNull();

    const arrange = [
      { sort: null, expect: null },
      { sort: undefined, expect: null },
      { sort: "", expect: null },
      { sort: "fake", expect: "fake" },
      { sort: 0, expect: "0" },
      { sort: -1, expect: "-1" },
      { sort: 5.5, expect: "5.5" },
      { sort: true, expect: "true" },
      { sort: false, expect: "false" },
      { sort: {}, expect: "[object Object]"},
      { sort: "field", expect: "field" },
    ];
    
    arrange.forEach((item) => {
      expect(new SearchParams({ sort: item.sort as any }).sort).toBe(item.expect);
    });
  });

  test('sort_dir prop', () => {
    let params = new SearchParams({});
    expect(params.sort_dir).toBeNull();

    params = new SearchParams({ sort: null });
    expect(params.sort_dir).toBeNull();

    params = new SearchParams({ sort: undefined });
    expect(params.sort_dir).toBeNull();

    params = new SearchParams({ sort: "" });
    expect(params.sort_dir).toBeNull();

    const arrange = [
      { sort_dir: null, expect: "asc" },
      { sort_dir: undefined, expect: "asc" },
      { sort_dir: "", expect: "asc" },
      { sort_dir: "fake", expect: "asc" },
      { sort_dir: 0, expect: "asc" },
      { sort_dir: "ASC", expect: "asc" },
      { sort_dir: "asc", expect: "asc" },
      { sort_dir: "DESC", expect: "desc" },
      { sort_dir: "desc", expect: "desc" },
    ];
    
    arrange.forEach((item) => {
      expect(new SearchParams({ sort: "field", sort_dir: item.sort_dir as any }).sort_dir).toBe(item.expect);
    });
  });

  test('filter prop', () => {
    const params = new SearchParams({});

    expect(params.filter).toBeNull();

    const arrange = [
      { filter: null, expect: null },
      { filter: undefined, expect: null },
      { filter: "", expect: null },
      { filter: "fake", expect: "fake" },
      { filter: 0, expect: "0" },
      { filter: -1, expect: "-1" },
      { filter: 5.5, expect: "5.5" },
      { filter: true, expect: "true" },
      { filter: false, expect: "false" },
      { filter: {}, expect: "[object Object]"},
      { filter: "field", expect: "field" },
    ];
    
    arrange.forEach((item) => {
      expect(new SearchParams({ filter: item.filter as any }).filter).toBe(item.expect);
    });
  });
});