import { Op } from "sequelize";
import { sequelize } from "../db";
import CarmiModel from "./mysql";
import UserModel from "../user/mysql";

interface CarmiData {
  id: number;
  // ... other properties
}

async function getCarmiInfo(where: any): Promise<CarmiData | null> {
  const find:any  = await CarmiModel.findOne({
    where,
  });
  return find;
}

async function updateCarmiInfo(data: any, where: any): Promise<number> {
  const update = await CarmiModel.update(data, {
    where: {
      ...where,
    },
  });
  return update[0]; // Update returns an array with the number of affected rows as the second element
}

// 获取卡密列表
async function getCarmis(
  { page, page_size }: { page: number; page_size: number },
  where: any
): Promise<{ rows: CarmiData[]; count: number }> {
  CarmiModel.belongsTo(UserModel, { foreignKey: "user_id", targetKey: "id" });
  const find:any = await CarmiModel.findAndCountAll({
    where,
    include: [
      {
        model: UserModel,
        required: false,
      },
    ],
    order: [["create_time", "DESC"]],
    offset: page * page_size,
    limit: page_size,
  });
  return { rows: find.rows, count: find.count };
}

async function delCarmi(user_id: number): Promise<number> {
  const del = await CarmiModel.destroy({
    where: {
        user_id,
    },
  });
  return del;
}

async function addCarmis(datas:any): Promise<CarmiData[]> {
  const captains:any = await CarmiModel.bulkCreate([...datas]);
  return captains;
}

// 清理过期的卡密
async function checkCarmiEndTime(time: string): Promise<number> {
  const captains = await CarmiModel.update(
    {
      status: 2,
    },
    {
      where: {
        end_time: {
          [Op.lt]: time,
          [Op.ne]: "",
        },
        status: 0,
      },
    }
  );
  return captains[0]; // Update returns an array with the number of affected rows as the second element
}

export default {
  getCarmiInfo,
  updateCarmiInfo,
  getCarmis,
  delCarmi,
  addCarmis,
  checkCarmiEndTime,
};
