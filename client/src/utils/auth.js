import decode from "jwt-decode";

class AuthService {
  // get user's username
  getUsername() {
    const token = this.getToken();
    if (token) {
      const decodedToken = decode(token);
      return decodedToken.data.username; // Extracting only username
    }
    return "Guest"; // Default value
  }

  // check if user's logged in
  loggedIn() {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  isTokenExpired(token) {
    try {
      const decoded = decode(token);
      return decoded.exp < Date.now() / 1000;
    } catch (err) {
      return false;
    }
  }

  getToken() {
    return localStorage.getItem("id_token");
  }

  login(idToken) {
    localStorage.setItem("id_token", idToken);
    window.location.assign("/");
  }

  logout() {
    localStorage.removeItem("id_token");
    window.location.assign("/");
  }
}

export default new AuthService();
