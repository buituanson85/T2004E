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
    database:"Assignment1",
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
        if(err) res.send("Ko co ket qua");
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
        if(err) res.send("Ko co ket qua");
        else
            // res.send(rows.recordset);
            res.render("DanhSachSanPham",{
                sps: rows.recordset
            });
    });
    // res.render("home");
});
// app.get("/san-pham/:IDSP",function (req,res) {
//     //res.send("Day la trang chu!");
//     //láy dữ liệu
//     db.query("SELECT * FROM SanPham WHERE IDSP",function (err,rows) {
//         if(err) res.send("Ko co ket qya");
//         else
//             // res.send(rows.recordset);
//             res.render("SanPham",{
//                 SPs: rows.recordset
//             });
//     });
//     // res.render("home");
// });

app.get("/search",function (req,res) {
    //res.send("Day la trang chu!");
    //láy dữ liệu
    let key_search = "'%"+req.query.keyword+"%'";
    db.query("SELECT * FROM KhachHang WHERE TenKH LIKE "+key_search,function (err,rows) {
        if(err) res.send("Ko co ket qua");
        else
            // res.send(rows.recordset);
            res.render("home",{
                khs: rows.recordset
            });
    });
    // res.render("home");
});
// link trả về from khách hàng
app.get("/them-khach-hang",function (req,res) {
    res.render("form");
})

// nhận dữ liệu thêm vào bd
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));
//false lấy đc string number true all
app.post("/luu-khach-hang",function (req,res) {
    let ten = req.body.TenKH;
    // res.send(ten);
    let dt = req.body.DienThoai;
    let dc = req.body.DiaChi;
    let ma = req.body.Email;
    let sql_text = "INSERT INTO KhachHang(TenKh,DienThoai,DiaChi,Email) VALUES(N'"+ten+"',N'"+dt+"',N'"+dc+"','"+ma+"')";
    db.query(sql_text,function (err,rows) {
        if(err) res.send(err);
        // else res.send("Them KH Thanh Cong");
        else res.redirect("/"); //trả về trang chủ
    })
})

//install body-parser --save lấy thư viện

app.get("/them-san-pham",function (req,res) {
    res.render("formsanpham");
})

app.post("/luu-san-pham",function (req,res) {
    let tensp = req.body.TenSP;
    // res.send(ten);
    let dv = req.body.DonVi;
    let mt = req.body.MoTa;
    let gia = req.body.Gia;
    let anh = req.body.AnhDaiDien
    let sql_text = "INSERT INTO SanPham(TenSP,DonVi,MoTa,Gia,AnhDaiDien) VALUES(N'"+tensp+"','"+dv+"',N'"+mt+"','"+gia+"','"+anh+"')";
    db.query(sql_text,function (err,rows) {
        if(err) res.send(err);
        // else res.send("Them KH Thanh Cong");
        else res.redirect("/danh-sach-san-pham"); //trả về trang chủ
    })
})


//tạo đơn hàng
app.get("/tao-don",function (req,res) {
   let sql_text = "SELECT * FROM KhachHang;SELECT * FROM SanPham";
   db.query(sql_text,function (err,rows) {
       if (err) res.send(err);
       else{
           res.render("donhang",{
               khs: rows.recordsets[0],
               sps:rows.recordsets[1]
           });
       }
   })
    // res.render("donhang");
})

//Nhận dữ liệu tạo đơn hàng

app.post("/luu-don-hang",function (req,res) {
    let khID = req.body.KhachHangID;
    let spID = req.body.SanPhamID;
    let sql_text = "SELECT * FROM SanPham WHERE ID IN ("+spID+");";
    db.query(sql_text,function (err,rows) {
        if(err) res.send(err);
        else{
            let sps = rows.recordset;
            let tongtien = 0;
            sps.map(function (e) {
                tongtien += e.Gia;
            });
            let sql_text2 = "INSERT INTO DonHang(KhachHangID,TongTien,ThoiGian) VALUES("+khID+","+tongtien+",GETDATE());SELECT SCOPE_IDENTITY() AS DonHangID;";
            db.query(sql_text2,function (err,rows) {
                let donhang = rows.recordset[0];
                let MaSo = donhang.DonHangID;
                let sql_text3 = "";
                sps.map(function (e) {
                    sql_text3 += "INSERT INTO DonHangSanPham(DonHangID,SanPhamID,SoLuong,ThanhTien) VALUES("+MaSo+","+e.ID+",1,"+(e.Gia*1)+");";
                })
                db.query(sql_text3,function (err,rows) {
                    if(err) res.send(err);
                    else res.redirect("/danh-sach-san-pham");
                })
            })
        }
    });
    // res.send(khID);
    // res.send(spID);
    // res.send(sql_text);
})

