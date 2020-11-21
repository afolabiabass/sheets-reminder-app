const { GoogleSpreadsheet } = require('google-spreadsheet');

class Sheets {
  constructor(sheetId) {
    this.sheets = new GoogleSpreadsheet(sheetId);
  }

  async authenticate() {
    try {
      await this.sheets.useServiceAccountAuth(require('../service.json'));
      await this.sheets.loadInfo();
    } catch (e) {
      throw e;
    }
  }

  getSheet(name) {
    return this.sheets.sheetsByTitle[name];
  }

  getRows(sheet) {
    return sheet.getRows();
  }
}

module.exports = Sheets;
