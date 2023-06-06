export class SequelizeModelFactory {
  constructor(private model, private factoryProps: () => any) {}

  async create(data?: any) {
    return this.model.create(data ? data : this.factoryProps());
  }

  async bulkCreate() {}
  
  make() {}

  bulkMake() {}
}