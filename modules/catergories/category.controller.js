const Category = require("./category.model");

const getAllCategories = async function getAllCategories(_, res) {
  try {
    const categroyList = await Category.find();
    if (categroyList.length === 0) {
      return res.status(200).json({
        status: "Sucesss",
        message: "No categories were added yet",
      });
    }
    res.status(200).send(categroyList);
  } catch (err) {
    res.status(500).json({
      status: "Failed",
      error: err,
    });
  }
};

const getCategory = async function getCategory(req, res) {
  try {
    const category = await Category.findById(req.params.id);
    if (category) {
      res.status(200).json({
        status: "Success",
        category,
      });
    } else {
      res.status(404).json({
        status: "Failed",
        message: "Category wasn't found",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "Failed",
      error: err,
    });
  }
};

const updateCategory = async function updateCategory(req, res) {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color,
      },
      { new: true },
    );
    if (category) {
      res.status(201).json({
        status: "Success",
        category,
      });
    } else {
      res.status(404).json({
        status: "Failed",
        message: "Category wasn't found",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "Failed",
      error: err,
    });
  }
};

const postCategory = async function postCategory(req, res) {
  try {
    let category = new Category({
      name: req.body.name,
      icon: req.body.icon,
      color: req.body.color,
    });
    category = await category.save();
    res.status(201).json({
      status: "Success",
      category,
    });
  } catch (err) {
    res.status(500).json({
      status: "Failed",
      error: err,
    });
  }
};

const deleteCategory = function deleteCategory(req, res) {
  Category.findByIdAndDelete(req.params.id)
    .then((category) => {
      if (category) {
        res.status(200).json({
          status: "Success",
          message: "Category was deleted successfully",
        });
      } else {
        res.status(404).json({
          status: "Success",
          message: "Category wasn't found",
        });
      }
    })
    .catch((err) => {
      res.status(400).json({
        status: "Failed",
        error: err,
      });
    });
};

const getCount = async function getCount(_, res) {
  try {
    const categoryCount = await Category.countDocuments();
    res.status(200).json({
      status: "Sucesss",
      count: categoryCount,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "Failed",
      error: err,
    });
  }
};

module.exports = {
  getAllCategories,
  postCategory,
  deleteCategory,
  getCategory,
  updateCategory,
  getCount
};