const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const sendEmailCreateOrder = async (email, orderItems) => {  // Đảm bảo hàm nhận đúng tham số
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // Use `true` for port 465, `false` for all other ports
        auth: {
            user: process.env.MAIL_ACCOUNT, // Sử dụng biến môi trường đúng cách
            pass: process.env.MAIL_PASSWORD,
        },
    });

    // Tạo nội dung email động từ danh sách sản phẩm
    let listItem = '';
    const attachImage = []
    orderItems.forEach((order) => {
      listItem += `<div>
      <div>
        Bạn đã đặt sản phẩm <b>${order.name}</b> với số lượng: <b>${order.amount}</b> và giá là: <b>${order.price} VND</b></div>
        <div>Bên dưới là hình ảnh của sản phẩm</div>
      </div>`
      attachImage.push({path: order.image})
    })

    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: process.env.MAIL_ACCOUNT, // sender address
        to: email, // Sử dụng biến email được truyền vào
        subject: "Bạn đã đặt hàng tại shop NIN", // Subject line
        text: "Cảm ơn bạn đã đặt hàng!", // plain text body
        html: `<b>Bạn đã đặt hàng thành công tại shop NIN</b><br>${listItem}`, // html body
    });

    console.log("Message sent: %s", info.messageId);
};

module.exports = {
    sendEmailCreateOrder
};
