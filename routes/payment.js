const express = require("express");
const XenditService = require("../services/xenditservice");
const router = express.Router();

// This Use Midtrans
// router.get("/", (req, res) => {
//   const midtransClient = require("midtrans-client");
//   // Create Snap API instance
//   let snap = new midtransClient.Snap({
//     // Set to true if you want Production Environment (accept real transaction).
//     isProduction: false,
//     serverKey: `${process.env.MIDTRANS_SERVER_KEY}`,
//   });
//   let date = new Date();
//   let parameter = {
//     transaction_details: {
//       order_id: date,
//       gross_amount: 20000,
//     },
//     credit_card: {
//       secure: true,
//     },
//     customer_details: {
//       first_name: "budi",
//       last_name: "pratama",
//       email: "budi.pra@example.com",
//       phone: "08111222333",
//     },
//   };

//   snap.createTransaction(parameter).then((transaction) => {
//     // transaction token
//     let transactionToken = transaction.token;
//     console.log("transactionToken:", transactionToken);
//     return res.status(200).send({ transactionToken: transactionToken });
//   });
// });

// This use Xendit
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

// This use Xendit
router.get("/", async (req, res) => {
  const xenditService = new XenditService();
  try {
    const date = new Date().toISOString();
    const createInvoiceData = {
      amount: 20000,
      invoiceDuration: 172800,
      externalId: `order-${date}`,
      description: "Test Invoice",
      currency: "IDR",
      reminderTime: 1,
      customer: {
        given_names: "Budi",
        surname: "Pratama",
        email: "budi.pra@example.com",
        mobile_number: "08111222333",
      },
    };

    const invoice = await xenditService.createInvoice(createInvoiceData);
    console.log("Created Invoice:", invoice);

    // Return the invoice URL as the transaction token
    const transactionToken = invoice.invoice_url;
    console.log("transactionToken:", transactionToken);
    return res.status(200).send({ transactionToken: transactionToken });
  } catch (error) {
    console.error("Error in Xendit service usage example:", error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
});

module.exports = router;
