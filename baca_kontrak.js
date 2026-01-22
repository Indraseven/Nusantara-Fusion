require('dotenv').config();
const { createPublicClient, http } = require('viem');
const { baseSepolia } = require('viem/chains');

// ✅ ALAMAT KONTRAK ANDA (Sudah saya masukkan)
const CONTRACT_ADDRESS = "0x75c83CA4FB792D082C435E09F2b175439EFaD38a";

const abi = [
    {
        "inputs": [],
        "name": "pesan",
        "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
    }
];

async function main() {
    const client = createPublicClient({
        chain: baseSepolia,
        transport: http(process.env.RPC_URL)
    });

    console.log(`🔍 Membaca data dari kontrak: ${CONTRACT_ADDRESS}\n`);

    try {
        const owner = await client.readContract({
            address: CONTRACT_ADDRESS,
            abi: abi,
            functionName: 'owner',
        });
        console.log(`👑 Owner Kontrak : ${owner}`);

        const pesanIsi = await client.readContract({
            address: CONTRACT_ADDRESS,
            abi: abi,
            functionName: 'pesan',
        });
        console.log(`📜 Isi Pesan     : "${pesanIsi}"`);
    } catch (error) {
        console.error("❌ Gagal membaca:", error);
    }
}

main();

