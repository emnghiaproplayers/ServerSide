const mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;
const Schema = mongoose.Schema;

var toppingSchema = new Schema({
    type : {
        type : String,
        required : true
    },
    price_extra: {
        type : Number,
        required: true
    }
},{
    timestamps: true
})

const cakeSchema = new Schema({ //Schema : định nghĩa đối tượng lưu trữ trong DB
    type: {
        type : String,
        required : true
        // type là string, required : bắt buộc điền, unique : không được trùng
    },
    name: {
        type : String,
        required : true,
        unique : true
    },
    price: {
        type : Currency,
        required : true
    },
    topping: [toppingSchema]
},{
    timestamps : true
     //timestamps : lệnh cho phép tự động thêm các trường createdAt và updatedAt vào
});

var Cakes = mongoose.model('Cake', cakeSchema);
module.exports = Cakes;