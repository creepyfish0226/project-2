module.exports = function(sequelize, DataTypes) {
  const ZipCode = sequelize.define("ZipCode", {
    // Giving the Zip Code model a name of type INTEGER
    Zip: DataTypes.INTEGER,
    City: DataTypes.STRING,
    State: DataTypes.STRING,
    Timezone: DataTypes.INTEGER,
    Latitude: DataTypes.DECIMAL(12, 4),
    Longitude: DataTypes.DECIMAL
  });

  ZipCode.associate = function(models) {
    // Associating Zipcode with Reviews
    // When an Zipcode is deleted, also delete any associated Reviews
    ZipCode.hasMany(models.Review, {
      onDelete: "cascade"
    });
  };

  return ZipCode;
};
