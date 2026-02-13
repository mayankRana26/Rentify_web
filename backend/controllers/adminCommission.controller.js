import Commission from "../models/Commission.js";

export const getCommission = async (req, res) => {
  let settings = await Commission.findOne();

  if (!settings) {
    settings = await Commission.create({});
  }

  res.json(settings);
};

export const updateCommission = async (req, res) => {
  const { rentPercentage, salePercentage } = req.body;

  let settings = await Commission.findOne();

  if (!settings) {
    settings = await Commission.create({
      rentPercentage,
      salePercentage
    });
  } else {
    settings.rentPercentage = rentPercentage;
    settings.salePercentage = salePercentage;
    await settings.save();
  }

  res.json({ message: "Commission updated", settings });
};

