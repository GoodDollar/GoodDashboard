import { sha3 } from "web3-utils";
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
      fullName: undefined,
      avatar: undefined
    };
    try {
      const profileToShow = this.gun
        .get("users/bywalletAddress")
        .get(sha3(address.toLowerCase()))
        .get("profile");
      const profile = await profileToShow.onThen();
      if (profile === undefined) return result;
      const avatarAndNameP = Promise.all([
        profile.avatar &&
          profileToShow
            .get("avatar")
            .get("display")
            .onThen(),
        profile.fullName &&
          profileToShow
            .get("fullName")
            .get("display")
            .onThen()
      ]);
      const [avatar, fullName] = await avatarAndNameP;
      result.avatar = avatar;
      result.fullName = fullName;
    } catch (e) {
      console.log(e);
    }
    return result;
  }
}

export default new User();
