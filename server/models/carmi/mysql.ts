import { DataTypes, Model } from "sequelize";
import { sequelizeExample } from "../db";

interface CarmiAttributes {
  user_id: number;
  ip: string;
  key: string;
  value: string;
  type: string;
  level: number;
  end_time: string;
  status: number;
  create_time: string;
  update_time: string;
}

export class CarmiModel extends Model<CarmiAttributes> {}

CarmiModel.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
    },
    ip: {
      type: DataTypes.STRING,
    },
    key: {
      type: DataTypes.STRING,
    },
    value: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.STRING,
    },
    level: {
      type: DataTypes.INTEGER,
    },
    end_time: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.INTEGER,
    },
    create_time: {
      type: DataTypes.STRING,
    },
    update_time: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize: sequelizeExample,
    modelName: "carmi",
    timestamps: false,
    freezeTableName: true,
  }
);

export default CarmiModel;
