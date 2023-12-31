const propertyController = require("express").Router();
const Property = require("../models/Property");
const verifyToken = require("../middlewares/verifyToken");

//Get all
propertyController.get("/getall", async (req, res) => {
  try {
    const properties = await Property.find({});
    return res.status(200).json(properties);
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

// Get featured
propertyController.get("/find/featured", async (req, res) => {
  try {
    const featuredProperties = await Property.find({ featured: true }).populate(
      "currentOwner",
      "-password"
    );

    return res.status(200).json(featuredProperties);
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

// Get all from a specified type
propertyController.get("/find", async (req, res) => {
  try {
    const type = req.query;
    if (type) {
      const specifiedProperty = await Property.find({ type }).populate(
        "currentOwner",
        "-password"
      );
      return res.status(200).json(specifiedProperty);
    } else {
      return res.status(500).json({ msg: "No such type" });
    }
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

//Get counts of type types = ["beach", "mountain", "village"]
propertyController.get("/find/types", async (req, res) => {
  try {
    const beachType = await Property.countDocuments({ type: "beach" });
    const mountainType = await Property.countDocuments({ type: "mountain" });
    const villageType = await Property.countDocuments({ type: "village" });

    return res.status(200).json({
      beach: beachType,
      mountain: mountainType,
      village: villageType,
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

// Get individual property
propertyController.get("/find/:id", async (req, res) => {
  try {
    const individualProperty = await Propery.findById(req.params.id).populate(
      "currentOwner",
      "-password"
    );
    if (individualProperty) {
      return res.status(200).json(individualProperty);
    } else {
      return res.status(500).json("No such property exists");
    }
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

// Create a property
propertyController.post("/", verifyToken, async (req, res) => {
  try {
    let newProperty = await Property.create({
      ...req.body,
      currentOwner: req.user.id,
    });
    return res.status(201).json(newProperty);
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

// Update property
propertyController.put("/:id", verifyToken, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (property.currentOwner.toString() !== req.user.id) {
      throw new Error("You are not allow to update other people properties");
    } else {
      const updatedProperty = await Property.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      return res.status(200).json(updatedProperty);
    }
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

// Delete property
propertyController.delete('/:id',verifyToken,async(req,res) => {
    try{
        const property = await Property.findById(req.param.id)
        if(property.currentOwner.toString() !==req.user.id){
            throw new Error('You are not allow to delee other people properties')
        }else{
            await property.delete()
            return res.status(200).json({msg:'Property deleted successfully'})
        }
    }catch(error){
        return res.status(500).json(error.message);
    }
})

module.exports = propertyController