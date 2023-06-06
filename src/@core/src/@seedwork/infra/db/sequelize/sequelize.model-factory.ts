export class SequelizeModelFactory {
  constructor(private model, private factoryProps: () => any) {}

  async create(data?: any) {
    return this.model.create(data ? data : this.factoryProps());
  }

  async bulkCreate() {}
  
  make(data?: any) {
    return this.model.build(data ? data : this.factoryProps());
  }

  bulkMake() {}
}