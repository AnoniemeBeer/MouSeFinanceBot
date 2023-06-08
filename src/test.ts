import { GenericRepository } from './repository/index'
import { Purchase, User } from './model/index'

let purchaseRepository = new GenericRepository(Purchase);
let userRepository = new GenericRepository(User);

async function asyncFunction(){
    console.log(await userRepository.getAll());
};

asyncFunction();