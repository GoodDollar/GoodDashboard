import gunDB from "../gundb";
import { delay } from "../../../utils/async";
class User {
  constructor() {
    this.gun = gunDB;
    //init users list
    this.gun.get("users/bywalletAddress").then();
  }

  async getByAddress(address) {
    let result = {
      fullName: "",
      avatar: undefined,
    };
    try {
      const profileToShow = this.gun
        .get("users/bywalletAddress")
        .get(address.toLowerCase())
        .get("profile");
      const avatarAndNameP = Promise.all([
        profileToShow.get("avatar").get("display"),
        profileToShow.get("fullName").get("display"),
      ]);
      const [avatar, fullName] = await Promise.race([
        avatarAndNameP,
        delay(3000, [undefined, "Unknown"]),
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
