const web3 = require('@solana/web3.js');
const { Connection, PublicKey, Keypair, clusterApiUrl } = web3
const fs = require('fs').promises;
const BufferLayout = require('buffer-layout');
const bs58 = require('bs58')
const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
(async () => {
    console.log("\n-->1 Create Payer Account : who will pay for deployment")
    // const payerAccount = new Keypair() // can create from seed if want to deploy to mainnet.

    payerAccount = Keypair.fromSecretKey(bs58.decode("4T6sWaMW6GBSpgYnag8yMQNo893Qp8igqM3uU3Tot1BY7faPMTbQBHrwTjQNmn5vUr1T9sm8MdfKYJxspFADqk3P"))
    console.log("publicKey:", payerAccount.publicKey.toBase58())
    console.log("\n-->2 Air drop money to Payer Account ...");
    const devnet = clusterApiUrl('devnet') // "https://api.devnet.solana.com"
    const conn = new Connection(devnet)

    console.log(await conn.getBalance(payerAccount.publicKey))

    console.log("\n-->3 Create Program Account : smart contract need separate account to attach.");
    const programAccount = new Keypair()
    const programId = programAccount.publicKey
    console.log('Program loaded to account')
    console.log("programId:", programId.toBase58())
    fs.writeFile('./program/Program_id.txt', programId.toBase58(), (err) => {
        if(err) throw err;
    })
    console.log("\n-->4 Loading Program to Account : upload smart contract using BPF LOADER ...");
    const program = await fs.readFile('./program/program.so')
    await web3.BpfLoader.load(conn, payerAccount, programAccount, program, web3.BPF_LOADER_PROGRAM_ID)

    console.log({ result: "!!!!   SUCCESS  !!!!" })
    // fs.writeFile('./program/Program_id.txt', "   SUCCESS   ",(err)=>{
    //     if(err) throw err;
    // })
})()