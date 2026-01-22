require('dotenv').config();
const { createPublicClient, http, formatEther } = require('viem');
const { privateKeyToAccount } = require('viem/accounts');
// UBAH BARIS INI: Ganti 'base' jadi 'baseSepolia'
const { baseSepolia } = require('viem/chains'); 

async function main() {
    try {
        const account = privateKeyToAccount(process.env.PRIVATE_KEY);
        console.log(`\n👤 User: Indraseven.eth (Testnet Mode)`); // Update label biar jelas
        console.log(`🔑 Wallet: ${account.address}`);

        const client = createPublicClient({
            chain: baseSepolia, // UBAH BARIS INI JUGA
            transport: http(process.env.RPC_URL)
        });

        const blockNumber = await client.getBlockNumber();
        console.log(`📡 Status RPC: TERHUBUNG ke SEPOLIA (Block #${blockNumber})`);

        const balance = await client.getBalance({ address: account.address });
        console.log(`💰 Saldo: ${formatEther(balance)} ETH (Sepolia)`);

    } catch (error) {
        console.error("\n❌ GAGAL:", error.message);
    }
}

main();

