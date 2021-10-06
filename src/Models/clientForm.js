export default class ClientForm {
  constructor(data = {}) {
    this.id = data._id || '';
    this.name = data.name || '';
    this.email = data.email || '';
    this.cpf = data.cpf || '';
    this.address = data.address || '';
    this.phone = data.phone || '';
    this.secondaryPhone = data.secondaryPhone || '';
    this.image = data.image || '';
    this.office = data.office || '';
    this.features = data.features || [];
    this.location = data.location?.name || '';
  }
}
