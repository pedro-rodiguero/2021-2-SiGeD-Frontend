export default class ClientForm {
  constructor(data = {}) {
    this.name = data.name || '';
    this.email = data.email || '';
    this.cpf = data.cpf || '';
    this.address = data.address || '';
    this.phone = data.phone || '';
    this.secondaryPhone = data.secondaryPhone || '';
    this.image = data.image || '';
    this.office = data.office || '';
    this.featuresIds = data.features || [];
    this.location = data.location?.name || '';
  }
}
