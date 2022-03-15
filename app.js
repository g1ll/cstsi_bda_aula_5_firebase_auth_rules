import 'dotenv/config'
import { initializeApp } from "firebase/app";
import { getDatabase, set, ref, push, get } from "firebase/database"
import {
    createUserWithEmailAndPassword,
    getAuth,
    signInWithEmailAndPassword,
    signOut,
} from 'firebase/auth';

//banco produtos
const firebaseConfig = {
    apiKey: process.env.APP_API_KEY,
    authDomain: process.env.APP_AUTH_DOMAIN,
    databaseURL: process.env.APP_DATABASE_URL,
    projectId: process.env.APP_PROJECT_ID,
    storageBucket: process.env.APP_STORAGE_BUCKET,
    messagingSenderId: process.env.APP_MESSAGING_SENDER_ID,
    appId: process.env.APP_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth();



//CRIAÇÃO DO USUÁRIO
// const credentials = await createUserWithEmailAndPassword(auth, user.email, user.password);
// console.log(credentials.user.uid)


//LOGIN E LOGOUT DO USUÁRIO
// try {
//     console.log({ "token": auth.currentUser?.accessToken })
//     await signInWithEmailAndPassword(auth, user.email, user.password)
//     console.log({ "token": auth.currentUser?.accessToken })
//     console.log({ "uid": auth.currentUser.uid })
//     await signOut(auth) //desconecta o user
//     console.info('deconectado')
//     console.log({ "token": auth.currentUser?.accessToken })
// } catch (error) {
//     const errorCode = error.code;
//     const errorMessage = error.message;
//     console.log({errorCode, errorMessage})
//     process.exit(0)
// }

const createUser = async (email, password) => {
    try {
        const credentials = await createUserWithEmailAndPassword(auth, email, password);
        console.log({"Created User ":{"uid":credentials.user.uid, "email":email}})
        const newUser = await set(ref(db, 'users/' + credentials.user.uid), {
            "email": email,
        })
        process.exit(0)
    } catch (error) {
        console.log({'errorCode': error.code,"Message":error.Message})
        process.exit(0)
    }
}

const loginUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.log('error:' + error.code)
        process.exit(0)
    }
}

const insertProduto = async (newProduto) => {
    try {
        const refPush = await push(ref(db, 'produtos'), newProduto)
        if (refPush) console.log({ "produto": refPush })
    } catch (error) {
        console.log(error.code)
        process.exit(0)
    }
}

//User data
const user = {
    email: 'gillgonzales@ifsul.edu.br',
    password: 'qwerty'
}

// //Create new user
// await createUser(user.email, user.password)


const loggedUser = await loginUser(user.email, user.password);
const novoProduto = {
    descricao: "TV SMART 80\" LG 16K",
    id_prod: 333,
    importado: 0,
    nome: "TV SMART LG 80\"",
    preco: 19990,
    qtd_estoque: 100,
    uid: loggedUser.uid
};
await insertProduto(novoProduto);
process.exit(0)

// // console.log(await get(ref(db,'users/')))
