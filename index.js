const express = require("express")
const app = express();
const PORT = process.env.PORT || 5000;

//TẠO SEVER

app.listen(PORT,function () {
    console.log("sever is running...");
});
// config các file static
app.use(express.static("public"));
// confing sử dụng ejs
app.set("view engine","ejs");

//npm install mssql

//thông tin cấu hình kết nối


// const mssql = require("mssql");

//     server:'127.0.0.1',
//     database:'Lab4',
//     user:"sa",
//     password:'123456'
// }

const mssql = require("mssql");
const config = {
    server:"DESKTOP-S30D2EK\\SQLEXPRESS",
    user:"sa",
    password:"123",
    database:"Lab4",
    options:{
        encrypt:false
    }
};

// const config = {
//     server:'cloud-apt.database.windows.net',
//     database:'Development',
//     user:"quanghoa",
//     password:'Studentaptech123'
// }


mssql.connect(config,function (err) {
    if(err) console.log(err);
    else console.log("connect BD thanh cong")
})
//tạo đối tượng để truy vấn đối tượng
var db = new mssql.Request();

//trang chủ
app.get("/",function (req,res) {
    //res.send("Day la trang chu!");
    //láy dữ liệu
    db.query("SELECT * FROM KhachHang",function (err,rows) {
        if(err) res.send("Ko co ket qya");
        else
            // res.send(rows.recordset);
            res.render("home",{
                khs: rows.recordset
            });
    });
    // res.render("home");
});

app.get("/danh-sach-san-pham",function (req,res) {
    //res.send("Day la trang chu!");
    //láy dữ liệu
    db.query("SELECT * FROM SanPham",function (err,rows) {
        if(err) res.send("Ko co ket qya");
        else
            // res.send(rows.recordset);
            res.render("DanhSachSanPham",{
                SPs: rows.recordset
            });
    });
    // res.render("home");
});
app.get("/san-pham/:IDSP",function (req,res) {
    //res.send("Day la trang chu!");
    //láy dữ liệu
    db.query("SELECT * FROM SanPham WHERE IDSP",function (err,rows) {
        if(err) res.send("Ko co ket qya");
        else
            // res.send(rows.recordset);
            res.render("SanPham",{
                SPs: rows.recordset
            });
    });
    // res.render("home");
});

app.get("/search",function (req,res) {
    //res.send("Day la trang chu!");
    //láy dữ liệu
    let key_search = "'%"+req.query.keyword+"%'";
    db.query("SELECT * FROM KhachHang WHERE TenKH LIKE "+key_search,function (err,rows) {
        if(err) res.send("Ko co ket qya");
        else
            // res.send(rows.recordset);
            res.render("home",{
                khs: rows.recordset
            });
    });
    // res.render("home");
});


