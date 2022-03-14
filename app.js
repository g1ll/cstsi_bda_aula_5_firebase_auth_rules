import 'dotenv/config'
import { initializeApp } from "firebase/app";
import {getDatabase, set, ref,push, get, query, orderByValue, limitToLast, orderByChild, onChildAdded, onValue, off} from "firebase/database"
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

const createUser = async () => {
    try {
        const credentials = await createUserWithEmailAndPassword(auth, email, password);
        console.log(credentials.user.uid)
        const newUser = await set(ref(db, 'users/' + credentials.user.uid), {
            "email": email,
        })
        if (newUser) console.log({ "User": newUser });
    } catch (error) {
        console.log('error:' + error.code)
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
    // email: 'gillvelleda@gmail.com',
    password: 'qwerty'
}

//Create new user
// await createUser(email, password)

const loggedUser = await loginUser(user.email, user.password);

// await signOut(auth)

const consulta = query(ref(db,'produtos/'),orderByChild('id_prod'), limitToLast(1))

onChildAdded(consulta,async (snap)=>{
    if(snap.exists()){
        const lastProduto = {...snap.val()}
        const newProduto = {
            descricao: "TV SMART 75\" SAMSUMG 8K",
            id_prod: lastProduto.id_prod+1,
            importado: 0,
            nome: "TV SMART SAMSUMG 75\"",
            preco: 15990,
            qtd_estoque: 100,
            uid: loggedUser.uid
        }
        off(consulta,'child_added')
        await insertProduto(newProduto);
        console.log({lastProduto,newProduto})
        process.exit(0)
    }
})

// console.log(await get(ref(db,'users/')))


