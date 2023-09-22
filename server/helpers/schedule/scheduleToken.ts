import { tokenModel } from "../../models";
import checkTokenQueue from "../queue";

async function scheduleToken(): Promise<void> {
  const tokens = await tokenModel.getTokens({ page: 0, page_size: 100 }, {
    status: 1
  });
  const list = tokens.rows;
  list.forEach((item) => {
    checkTokenQueue.addTask({
      ...item.toJSON()
    });
  });
}

export default scheduleToken;
