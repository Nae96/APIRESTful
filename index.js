const express= require(`express`);
// const res = require("express/lib/response");
const {Router}=express;

const app = express();
const router = Router();
const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, ()=>{
    console.log(`Servidor http escuchando en el puerto ${server.address().port}`);
});

server.on(`error`, (error)=> console.log(`Error en servidor ${error}`));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(`/public`, express.static(__dirname + `/public`));

app.use(`/api/products`, router);

let productsHarC =[
    {id:1, title: "Hp", price: 101, thumbnail: `http://localhost:8080/public/hp.jpg`},
    {id:2, title: "Apple", price: 102, thumbnail: `http://localhost:8080/public/Apple.jpg`},
    {id:3, title: "Lenovo", price: 103, thumbnail: `http://localhost:8080/public/lenovo.jpg`},
];

class Products{

    constructor(products) {
        this.products = [...products];
        // this.products = products;
    }

  

    findOne(id){
        return this.products.find((item)=> item.id == id);
    }
    addOne(product){
        const lastItem = this.products[this.products.length-1];
        let lastId =1;
        if(lastItem){
            lastId=lastItem.id +1;
        }
        product.id=lastId;
        this.products.push(product);
        return this.products[this.products.length-1];
    }
    updateOne(id, product) {
     const productToInsert = {...product, id};

     for (let i=0; i<this.products.length; i++){
         if (this.products[i].id==id){
             this.products[i]=productToInsert;
             return productToInsert;
         }
     }
     return undefinded;
   
    }

    deleteOne(id){
        const foundProduct = this.findOne(id);
        if (foundProduct){
            this.products= this.products.filter((item)=> item.id !=id);
            return id;
        }
        return undefined;
    }
    getAll(){
        return this.products;
     }

}

router.get(`/:id`, (req,res)=>{
    let {id}= req.params;
    console.log("id", id);
    const products =new Products(productsHarC);
    id=parseInt(id);

    const found = products.findOne(id);
    if(found){
        res.json(found);
    }else{
        res.json({error:`producto no encontrado`});
    }
});

router.get(`/`, (req, res)=>{
    const products = new Products(productsHarC);
    res.json(products.getAll());
});

router.delete(`:id`, (req, res)=>{
    let {id} =req.params;
    const products = new Products(productsHarC);

    id= parseInt(id);

    const deletedProduct = products.deleteOne(id);
    console.log(products.getAll());
    if (deletedProduct){
        res.json({success:`ok`, id})
    } else{
        res.json({error: `El producto no fue encontrado`});
    }
});

router.put(`/:id`, (req,res)=>{
    let {id}= req.params;
    const {body}= req;
    id =parseInt(id);

    const products= new Products(productsHarC); 
// ACAAA
    const changedProduct = products.updateOne(id, body);

    if (changedProduct){
        res.json({succes:`ok`, new: changedProduct});
    }else{
        res.json({error:`producto no encontrado`});
    }
});



router.post(`/`, (req, res)=>{
    const {body} =req;
    console.log(body);
    body.price = parseFloat(body.price);

    const products = new Products(productsHarC);
    const productoGenerado =products.addOne(body);
    res.json({succes:`ok`, new: productoGenerado});
});





// como mostrar un html en express sendfile
app.get(`/form`, (req, res)=>{
    res.sendFile(__dirname+ `/index.html`);
});

