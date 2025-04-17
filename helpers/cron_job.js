const cron = require('node-cron');
const {Category} = require('../models/category');
const {Product} = require('../models/product');

cron.schedule('04 14 * * *', async function () {
   try {
    const categoriesToBeDeleted = await Category.find({
        markedForDeletion: true,
    });
    for (const category of categoriesToBeDeleted) {
       const categoryProductsCount = await Product.countDocuments({
           category: category.id,
       });
       if (categoryProductsCount < 1) await category.deletedOne();
    }
    console.log('CRON job conpleted at', new Date());
   } catch (error) {
       console.error('Error executing cron job:', error);
   }
});