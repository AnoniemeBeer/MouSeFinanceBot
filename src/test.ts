import { UserRepository, PurchaseRepository } from './repository'
import { Purchase, User } from './model'
import sortTwoDArray from './utils/sortTwoDArray';

let purchaseRepository = new PurchaseRepository(Purchase);
let userRepository = new UserRepository(User);

async function asyncFunction() {
    let users: User[] = (await userRepository.getAll()).slice(0, 10);

    let leaderboard: any[][] = [];

    for (const user of users) {
        let purchases: Purchase[] = await purchaseRepository.getAllFromUser(user);
        let total: number = 0;
        for (const purchase of purchases) {
            total += purchase.price;
        }

        leaderboard.push([user, total]);
    }

    leaderboard.sort(sortTwoDArray);

    for (const [index, item] of leaderboard.entries()) {
        console.log(`${index+1}: ${item[0].name} € ${item[1]}`);
    }

    purchaseRepository.disconnect();
};

asyncFunction();