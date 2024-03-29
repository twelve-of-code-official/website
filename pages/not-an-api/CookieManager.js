class CookieManager {
    constructor(information) {
        this.information = information;
        this._completed = this.getCookie("completed");
        this._user = this.getCookie("user");
    }
    setCookie(cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
        let expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + btoa(JSON.stringify(cvalue)) + ";" + expires + ";path=/";
    }
    getCookie(cname) {
        let name = cname + "=";
        let ca = document.cookie.split(";");
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == " ") {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                try {
                    return JSON.parse(atob(c.substring(name.length, c.length)));
                } catch (e) {
                    console.warn('There was an error retrieving a cookie, returning "" instead.', e);
                    return "";
                }
            }
        }
        console.warn('There was an error retrieving a cookie, returning "" instead.');
        return "";
    }
    random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    get completed() {
        this._completed = this.getCookie("completed");
        return this._completed;
    }
    set completed(cookieValue) {
        this._completed = cookieValue;
        this.setCookie("completed", this._completed, 60);
        return cookieValue;
    }
    get user() {
        this._user = this.getCookie("user");
        return this._user;
    }
    set user(cookieValue) {
        this._user = cookieValue;
        this.setCookie("user", this._user, 60);
        return cookieValue;
    }
    updateChallengeStatus(challengeLocation, newChallengeStatus) {
        const newCookie = this._completed;
        try {
            newCookie[challengeLocation[0]][challengeLocation[1]][challengeLocation[2]] = newChallengeStatus;
        } catch (e) {
            console.warn("Attempted to update a challenge that doesn't exist.", e);
        }
        this.completed = newCookie;
    }
    get blankCookie() {
        const blankCookie = {};
        for (const year in this.information) {
            blankCookie[year] = {};
            for (let i = 0; i < this.information[year].months.length; i++) {
                const month = this.information[year].months[i];
                blankCookie[year][month] = {1: false, 2: false, 3: false};
            }
        }
        return blankCookie;
    }
    get blankUserCookie() {
        return {username: `User-${this.random(1000000000, 9999999999)}`, seed: this.random(1000000000, 9999999999)};
    }
}
