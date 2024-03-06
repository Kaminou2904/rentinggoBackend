const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();

const mongoUri = "mongodb+srv://influencermart:29je2004@cluster0.fosfl9w.mongodb.net/rentinggo";

mongoose.connect(mongoUri, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=> console.log('connected to the database successfully'))
    .catch((err)=> console.log('error occured while connecting to the database', err));

const formSchema = new mongoose.Schema({
    product: {type: String, required: true},
    email: {type: String, required: true},
    number: {type: String, required: true},
    date: {type: String, required: true},
    warranty: {type: String, required: true},
    address: {type: String, required: true},
    amount: {type: String, required: true},
    subdate: {type: Date, required: true, default: Date.now}
});

const form = mongoose.model('form', formSchema);

app.use(express.json());
app.use(cors())

app.get('/', (req, res)=>{
    res.send('hello')
});

app.post('/form', async (req, res)=>{
    try {
        const newForm = new form({
            product: req.body.product,
            email: req.body.email,
            number: req.body.number,
            date: req.body.date,
            warranty: req.body.warranty,
            address: req.body.address,
            amount: req.body.amount,
            subdate: req.body.subdate
        });
        await newForm.save();
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'rentinggo1@gmail.com',
                pass: 'qpfirhqsxwxvxmeb'
            }
        })

        const userMailOptions = {
            from: 'rentinggo1@gmail.com',
            to: req.body.email,
            subject: `Your ${req.body.product} Booking Confirmation`,
            html: `<p>Dear Customer, <br><br>Your ${req.body.product} booking is confirmed! 🎉 Thank you for choosing us. If you have any questions, feel free to call us at <a href="tel:+918451820012">8451820012</a>. <br><br>Best regards, <br>RentingGo</p>`
        }

        transporter.sendMail(userMailOptions, function(err, info){
            if(err){
                console.log('error occured while sending the mail to the user ', err)
            }else{
                console.log('mail successfully sent to the user ', info);
            }
        })

        const adminMailOptions = {
            from: 'rentinggo1@gmail.com',
            to: 'rentinggo1@gmail.com',
            subject: 'New Booking',
            text: 'A new booking has been submitted.\n\nNumber: ' + req.body.number + '\nAddress: ' + req.body.address + '\nDate: ' + req.body.date + '\nProduct: ' + req.body.product + '\nCate: ' + req.body.cate
        }

        transporter.sendMail(adminMailOptions, function(err, info){
            if(err){
                console.log('error occured while sending the mail to the user ', err)
            }else{
                console.log('mail successfully sent to the user ', info);
            }
        })
        res.status(200).json({success: true})
    } catch (err) {
        console.log('error occured while uploading the form ', err)
        res.status(500).json({success: false, msg: 'error occured in the server while uploading the form', error: err})
    }
})

app.listen(8080, ()=>{
    console.log('server started on port 8080');
})