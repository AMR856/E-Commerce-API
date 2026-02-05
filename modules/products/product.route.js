const express = require("express");
const router = express.Router();
const { postProduct, getAllProducts, getProduct, updateProduct, deleteProduct, getCount, isFeatured } = require("./product.controller");
const multer = require('multer');

const FILE_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
}


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      const isValid = FILE_TYPE_MAP[file.mimetype];
      let uploadError = new Error('invalid image type');

      if(isValid) {
          uploadError = null
      }
    cb(uploadError, 'public/uploads')
  },
  filename: function (req, file, cb) {
      
    const fileName = file.originalname.split(' ').join('-');
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`)
  }
})
    
  const uploadOptions = multer({ storage: storage })


router.post("/", postProduct);
router.post(`/`, uploadOptions.single('image'), async (req, res) =>{
    const category = await Category.findById(req.body.category);
    if(!category) return res.status(400).send('Invalid Category')

    const file = req.file;
    if(!file) return res.status(400).send('No image in the request')

    const fileName = file.filename
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: `${basePath}${fileName}`,// "http://localhost:3000/public/upload/image-2323232"
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
    })
    
});
router.get("/", getAllProducts);
router.get('/:id', getProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.get('/get/count', getCount);
router.get('/get/isFeatured', isFeatured);
router.put(
  '/gallery-images/:id', 
  uploadOptions.array('images', 10), 
  async (req, res)=> {
      if(!mongoose.isValidObjectId(req.params.id)) {
          return res.status(400).send('Invalid Product Id')
       }
       const files = req.files
       let imagesPaths = [];
       const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

       if(files) {
          files.map(file =>{
              imagesPaths.push(`${basePath}${file.filename}`);
          })
       }

       const product = await Product.findByIdAndUpdate(
          req.params.id,
          {
              images: imagesPaths
          },
          { new: true}
      )

      if(!product)
          return res.status(500).send('the gallery cannot be updated!')

      res.send(product);
  }
)
module.exports = router;