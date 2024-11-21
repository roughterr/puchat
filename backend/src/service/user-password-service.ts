import jwt from "jsonwebtoken";

export class UserPasswordService {
    private userToPasswordMap = new Map<string, string>([
        ["ian", "ian"],
        ["dan", "dan"],
        ["chris", "chris"]
    ]);

    private JWT_SECRET = "your_jwt_secret";

    private tokenToUser = new Map<string, string>([]);

    /**
     * Says whether the combination of login and password is correct.
     */
    areCredentialsCorrect(login: string, password: string): boolean {
        console.log(`login=${login}, password=${password}`);
        return this.userToPasswordMap.has(login) && this.userToPasswordMap.get(login) == password;
    }

    /**
     * Try logging in using the given login and password.
     * @param login
     * @param password
     */
    login(login: string, password: string): LoginResult {
        if (login && password && this.areCredentialsCorrect(login, password)) {
            const newToken = this.generateToken(login);
            console.log(`new token is ${newToken}`);
            this.tokenToUser.set(newToken, login);
            return { successful: true, token: newToken };
        } else {
            return { successful: false, token: undefined };
        }
    }

    generateToken = (userId: string): string => {
        return jwt.sign({ userId }, this.JWT_SECRET, { expiresIn: "1h" }); // Token expires in 1 hour
    };
}

export interface LoginResult {
    successful: boolean;
    token: string;
}

