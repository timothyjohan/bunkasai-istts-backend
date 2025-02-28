const midtransClient = require('midtrans-client');

const createTransaction = (req, res) => {
    let snap = new midtransClient.Snap({
        isProduction: false,
        serverKey: `${process.env.MIDTRANS_SERVER_KEY}`
    });
    let date = new Date();
    let parameter = {
        "transaction_details": {
            "order_id": date,
            "gross_amount": 20000
        },
        "credit_card": {
            "secure": true
        },
        "customer_details": {
            "first_name": "budi",
            "last_name": "pratama",
            "email": "budi.pra@example.com",
            "phone": "08111222333"
        }
    };

    snap.createTransaction(parameter)
        .then((transaction) => {
            let transactionToken = transaction.token;
            console.log('transactionToken:', transactionToken);
            return res.status(200).send({ transactionToken: transactionToken });
        })
        .catch((error) => {
            return res.status(500).send(error);
        });
};

module.exports = {
    createTransaction,
};
