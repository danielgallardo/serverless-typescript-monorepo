// tslint:disable-next-line:variable-name
export const Client = jest.fn().mockImplementation(function() {
  // @ts-ignore
  this.indices = {
    create: jest.fn(async ({index}) => ({acknowledged: true, shards_acknowledged: true, index})),
    exists: jest.fn(async ({index}) => index === 'existing-index'),
    putMapping: jest.fn(async () => ({acknowledged: true})),
    delete: jest.fn(async () => ({acknowledged: true}))
  };
  // @ts-ignore
  this.bulk = jest.fn(async ({body}) => ({
    took: 6,
    errors: false,
    items: [body[0]]
  }));
  // @ts-ignore
  this.search = jest.fn(async ({index, type, body}) => {
    const items = new Array(body.size || 25).fill(undefined);
    return {
      took: 6,
      timed_out: false,
      _shards: {total: 5, successful: 5, skipped: 0, failed: 0},
      hits: {
        total: items.length * 5,
        max_score: 0,
        hits: items.map((_, i) => ({
          _index: index,
          _type: type,
          _id: i,
          _score: 0,
          _source: {
            id: i
          }
        }))
      }
    };
  });
});
