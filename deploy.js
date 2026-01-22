require('dotenv').config();
const fs = require('fs');
const solc = require('solc');
const { createWalletClient, http, defineChain } = require('viem');
const { privateKeyToAccount } = require('viem/accounts');
const { baseSepolia } = require('viem/chains');

async function main() {
    console.log("⚙️  Sedang Mengompilasi Smart Contract...");

    // 1. BACA & COMPILE KONTRAK
    const sourceCode = fs.readFileSync('SapaNusantara.sol', 'utf8');
    const input = {
        language: 'Solidity',
        sources: { 'SapaNusantara.sol': { content: sourceCode } },
        settings: { outputSelection: { '*': { '*': ['*'] } } }
    };
    
    const output = JSON.parse(solc.compile(JSON.stringify(input)));
    
    // Cek Error Compile
    if (output.errors) {
        const errors = output.errors.filter(e => e.severity === 'error');
        if (errors.length > 0) {
            console.error("❌ Compile Error:", errors);
            return;
        }
    }

    const contractFile = output.contracts['SapaNusantara.sol']['SapaNusantara'];
    const bytecode = contractFile.evm.bytecode.object;
    const abi = contractFile.abi;

    console.log("✅ Compile Sukses!");

    // 2. PERSIAPAN DEPLOY
    const account = privateKeyToAccount(process.env.PRIVATE_KEY);
    const client = createWalletClient({
        account,
        chain: baseSepolia,
        transport: http(process.env.RPC_URL)
    });

    console.log(`🚀 Mengirim Kontrak dari: ${account.address}...`);

    // 3. DEPLOY
    const hash = await client.deployContract({
        abi,
        bytecode: `0x${bytecode}`,
        args: ["Halo Nusantara! Powered by Termux & Viem"], // Pesan awal
    });

    console.log(`⏳ Transaksi dikirim! Hash: ${hash}`);
    console.log("   Menunggu konfirmasi blok...");
    
    // Tunggu sebentar (manual delay karena kita pakai walletClient simpel)
    // Nanti Anda bisa cek statusnya di Explorer
}

main().catch((err) => {
    console.error("❌ Gagal Deploy:", err);
});

