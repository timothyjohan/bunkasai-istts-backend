const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
    
    const midtransClient = require('midtrans-client');
    // Create Snap API instance
    let snap = new midtransClient.Snap({
            // Set to true if you want Production Environment (accept real transaction).
            isProduction : false,
            serverKey : `${process.env.MIDTRANS_SERVER_KEY}`
        });
    let date = new Date()
    let parameter = {
        "transaction_details": {
            "order_id": date,
            "gross_amount": 20000
        },
        "credit_card":{
            "secure" : true
        },
        "customer_details": {
            "first_name": "budi",
            "last_name": "pratama",
            "email": "budi.pra@example.com",
            "phone": "08111222333"
        }
    };
    
    snap.createTransaction(parameter)
        .then((transaction)=>{
            // transaction token
            let transactionToken = transaction.token;
            console.log('transactionToken:',transactionToken);
            return res.status(200).send({transactionToken: transactionToken})
    })
})


module.exports = router