const express = require("express");
const mssql = require("mssql");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
// get Services
app.get("/services", async (req, res, next) => {
  const results = (
    await new mssql.Request().query(`SELECT * FROM dbo.Services`)
  ).recordset;
  try {
    return res.status(200).json({
      message: "GET services success",
      metadata: results,
    });
  } catch (error) {}
});

// tìm máy theo id

// tìm id service theo tên
app.get("/get_services", async (req, res, next) => {
  const { name } = req.query;
  const results = (
    await new mssql.Request().query(
      `SELECT * FROM dbo.Services WHERE service_name = '${name}'`
    )
  ).recordset[0];
  try {
    return res.status(200).json({
      message: "get name service success",
      service_id: results.service_id,
    });
  } catch (error) {
    console.log(error);
  }
});

// create a new machine
app.post("/machines", async (req, res, next) => {
  const { machine_name, machine_type, hourly_rate } = req.body;
  console.log(machine_name, machine_type, hourly_rate);
  const results = await new mssql.Request().query(
    `INSERT INTO Machines (machine_name, machine_type, hourly_rate) VALUES ('${machine_name}', '${machine_type}', ${hourly_rate})`
  );

  try {
    return res.status(200).json({
      message: "Create a new machine success",
      metadata: results,
    });
  } catch (error) {}
});

// Tạo Phiếu Nhập Kho
app.post("/purchase-receipts", async (req, res, next) => {
  const { receipt_date, supplier, purchased_items } = req.body;
  // create a new bill
  // ('2024-11-30', 'Nhà Cung Cấp A')
  const insertPurchaseReceiptsQuery = `
  INSERT INTO PurchaseReceipts (receipt_date, supplier)
  OUTPUT inserted.receipt_id
  VALUES 
  ('${receipt_date}', '${supplier}');
  `;
  const newReceipt = (
    await new mssql.Request().query(insertPurchaseReceiptsQuery)
  ).recordset[0];
  const { receipt_id } = newReceipt;
  for (let i = 0; i < purchased_items.length; i++) {
    const insertPurchaseReceiptDetailQuery = `
    INSERT INTO PurchaseReceiptDetails (receipt_id, service_id, quantity, price)
    VALUES
     (${receipt_id}, ${purchased_items[i].service_id},  ${purchased_items[i].quantity},  ${purchased_items[i].price});`;
    await new mssql.Request().query(insertPurchaseReceiptDetailQuery);
  }
  try {
    return res.status(200).json({
      message: "Create a new purchase receipts success",
      metadata: newReceipt,
    });
  } catch (error) {}
});

module.exports = app;
