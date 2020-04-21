import gunDB from "../gundb";
import { delay } from "../../../utils/async";
class User {
  constructor() {
    this.gun = gunDB;
  }

  async getByAddress(address) {
    let result = {
      fullName: "",
      avatar: "",
    };
    try {
      const profileToShow = this.gun
        .get("users/bywalletAddress")
        .get(address.toLowerCase())
        .get("profile");
      const avatarAndNameP = Promise.all([
        profileToShow.get("avatar").get("display"),
        rofileToShow.get("fullName").get("display"),
      ]);
      const [avatar, fullName] = await Promise.race([
        avatarAndNameP,
        delay(3000, ["", "Unknown"]),
      ]);
      result.avatar = avatar;
      result.fullName = fullName;
    } catch (e) {
      console.log(e);
    }
    return result;
  }
}

export default new User();
