export function getWhoStartingValue(nickname: string) {
    const randomNumber = Math.random();
    return randomNumber < 0.5 ? nickname : "";
}