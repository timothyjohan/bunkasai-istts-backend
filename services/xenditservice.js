const { Xendit } = require("xendit-node");
const InvoiceClient = require("xendit-node").Invoice;
require("dotenv").config();

const secretKey = process.env.XENDIT_SECRET_KEY;

const xenditClient = new Xendit({ secretKey: secretKey });
const { Invoice } = xenditClient;
const xenditInvoiceClient = new InvoiceClient({ secretKey: secretKey });

class XenditService {
  constructor() {
    this.invoiceClient = xenditInvoiceClient;
  }

  async createInvoice(data) {
    try {
      const response = await this.invoiceClient.createInvoice({ data });
      return response;
    } catch (error) {
      console.error("Error creating invoice:", error);
      throw error;
    }
  }

  async getInvoiceById(invoiceId) {
    try {
      const response = await this.invoiceClient.getInvoiceById({ invoiceId });
      return response;
    } catch (error) {
      console.error("Error getting invoice by ID:", error);
      throw error;
    }
  }

  async getInvoices(params = {}) {
    try {
      const response = await this.invoiceClient.getInvoices(params);
      return response;
    } catch (error) {
      console.error("Error getting invoices:", error);
      throw error;
    }
  }

  async expireInvoice(invoiceId) {
    try {
      const response = await this.invoiceClient.expireInvoice({ invoiceId });
      return response;
    } catch (error) {
      console.error("Error expiring invoice:", error);
      throw error;
    }
  }
}

module.exports = XenditService;

// Usage example:

// (async () => {
//   const xenditService = new XenditService();
//   try {
//     const createInvoiceData = {
//       amount: 10000,
//       invoiceDuration: 172800,
//       externalId: 'test1234',
//       description: 'Test Invoice',
//       currency: 'IDR',
//       reminderTime: 1,
//     };
//     const invoice = await xenditService.createInvoice(createInvoiceData);
//     console.log('Created Invoice:', invoice);

//     const fetchedInvoice = await xenditService.getInvoiceById(invoice.id);
//     console.log('Fetched Invoice by ID:', fetchedInvoice);

//     const invoices = await xenditService.getInvoices();
//     console.log('All Invoices:', invoices);

//     const expiredInvoice = await xenditService.expireInvoice(invoice.id);
//     console.log('Expired Invoice:', expiredInvoice);
//   } catch (error) {
//     console.error('Error in Xendit service usage example:', error);
//   }
// })();
