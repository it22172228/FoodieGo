const Cart=require('../Models/CartManagementModel');

const getAllCarts=async(req,res,next)=>{
    let carts;

    try{
        carts=await Cart.find();

    }catch(err){
        console.log(err);
        return res.status(500).json({message:"Internal Server Error"});
    }

    if(!carts || carts.length ===0){
        return res.status(404).json({message:"No food items found"});
    }
    return res.status(200).json({carts});
};

const getCartById=async(req,res,next)=>{
    const id=req.params.id;

    let cart;
    try{
        cart=await Cart.findById(id);
    }catch(err){
        console.log(err);
        return res.status(500).json({message:"Internal Server Error"});
    }

    if(!cart){
        return res.status(404).json({message:"Food Item Not Found"});
    }

    return res.status(200).json({cart});
};

const addToCart=async(req,res,next)=>{
    const {name,image,location,price,qty,total}=req.body;

    let cart;
    try{
        cart =new Cart({
            name,
            image,
            location,
            price,
            qty,
            total
        });
        await cart.save();
    }catch(err){
        console.log(err);
        return res.status(500).json({message:"Internal Server Error"});
    }
    return res.status(201).json({cart});
};

const updateCart=async(req,res,next)=>{
    const id=req.params.id;
    const {name,image,location,price,qty,total}=req.body;
    
    let updateCart;
    try{
        updateCart=await Cart.findByIdAndUpdate(id);
        if(!updateCart){
            return res.status(404).json({message:"Food Item Not Found"});
        }
        updateCart.name=name;
        updateCart.image=image;
        updateCart.location=location;
        updateCart.price=price;
        updateCart.qty=qty;
        updateCart.total=total;

        await updateCart.save();
    }catch(err){
        console.log(err);
        return res.status(500).json({message:"Internal Server Error"});
    }

    return res.status(200).json({updateCart});
};

const deleteCart=async(req,res,next)=>{
    const id=req.params.id;

    try{
        const cart=await Cart.findByIdAndDelete(id);
        if(!cart){
            return res.status(404).json({message:"Food Item Not Found"});
        }
        res.status(200).json({message:"Food Item Deleted Successfully"});
    }catch(err){
        console.log(err);
        return res.status(500).json({message:"Internal Server Error"});
    }
};

module.exports={
    getAllCarts,
    getCartById,
    addToCart,
    updateCart,
    deleteCart
};