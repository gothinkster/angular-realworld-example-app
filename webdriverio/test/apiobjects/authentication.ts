import axios from "axios";
import { browser } from "@wdio/globals";

class Authentication {
  async getUserToken(email: string, password: string): Promise<string> {
    return await axios
      .post("https://api.realworld.io/api/users/login", {
        user: {
          email: email,
          password: password,
        },
      })
      .then(function (response) {
        return response.data.user.token;
      })
      .catch(function (error) {
        console.log(error);
        return error;
      });
  }

  async loginUser(emailaddress: string, password: string) {
    const token = await this.getUserToken(emailaddress, password);
    await browser.execute(`localStorage.setItem("jwtToken", "${token}")`);
  }
}
export default new Authentication();
