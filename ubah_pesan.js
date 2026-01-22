require('dotenv').config();
const { createWalletClient, createPublicClient, http } = require('viem');
const { privateKeyToAccount } = require('viem/accounts');
const { baseSepolia } = require('viem/chains');

// 🏠 Alamat Kontrak Anda
const CONTRACT_ADDRESS = "0x75c83CA4FB792D082C435E09F2b175439EFaD38a";

// 📜 ABI (Hanya fungsi ubahPesan yang kita butuh)
const abi = [
    {
        "inputs": [{ "internalType": "string", "name": "_pesanBaru", "type": "string" }],
        "name": "ubahPesan",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

async function main() {
    // Setup Akun & Client
    const account = privateKeyToAccount(process.env.PRIVATE_KEY);
    
    // Client untuk Menulis (Wallet)
    const walletClient = createWalletClient({
        account,
        chain: baseSepolia,
        transport: http(process.env.RPC_URL)
    });

    // Client untuk Konfirmasi (Public)
    const publicClient = createPublicClient({
        chain: baseSepolia,
        transport: http(process.env.RPC_URL)
    });

    const pesanBaru = "Nusantara Fusion is Live! 🚀";

    console.log(`✍️  Mengirim transaksi ubah pesan...`);
    console.log(`📝 Pesan Baru: "${pesanBaru}"`);

    try {
        // 1. Kirim Transaksi
        const hash = await walletClient.writeContract({
            address: CONTRACT_ADDRESS,
            abi: abi,
            functionName: 'ubahPesan',
            args: [pesanBaru]
        });

        console.log(`✅ Transaksi Terkirim! Hash: ${hash}`);
        console.log(`⏳ Menunggu konfirmasi blok...`);

        // 2. Tunggu sampai sukses
        await publicClient.waitForTransactionReceipt({ hash });

        console.log(`🎉 SUKSES! Pesan di blockchain telah berubah.`);
        console.log(`👉 Cek lagi pakai 'node baca_kontrak.js' untuk bukti.`);

    } catch (error) {
        console.error("❌ Gagal:", error);
    }
}

main();

