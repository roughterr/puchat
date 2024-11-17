export class UserPasswordService {
    private userToPasswordMap = new Map<string, string>([
        ["ian", "ian"],
        ["dan", "dan"],
        ["chris", "chris"],
    ]);

    /**
     * Says whether the combination of login and password is correct.
     */
    areCredentialsCorrect(login: string, password: string): boolean {
        return this.userToPasswordMap.has(login) && this.userToPasswordMap.get(login) == password;
    }
}

