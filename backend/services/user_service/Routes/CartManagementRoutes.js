const express=require("express");
const router2=express.Router();

const Cart=require("../Models/CartManagementModel");
const CartController=require("../Controllers/CartManagementController");

router2.get("/",CartController.getAllCarts);
router2.post("/",CartController.addToCart);
router2.get("/:id",CartController.getCartById);
router2.put("/:id",CartController.updateCart);
router2.delete("/:id",CartController.deleteCart);

module.exports=router2;